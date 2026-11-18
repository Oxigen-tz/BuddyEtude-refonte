// Tests des règles Firestore (firestore.rules) sur l'émulateur local.
// Lancement : npm run test:rules
import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, getDocs,
  serverTimestamp, arrayRemove, writeBatch, orderBy, limit,
} from "firebase/firestore";

export async function firestoreTests(env, t) {
  const A = "uidAlice", B = "uidBob", C = "uidEve", ADMIN = "uidAdmin", BANNED = "uidBanned";
  const as = (uid) => env.authenticatedContext(uid, { email: `${uid}@test.com` }).firestore();
  const a = as(A), b = as(B), c = as(C), admin = as(ADMIN), banned = as(BANNED);
  const anon = env.unauthenticatedContext().firestore();
  const pair = [A, B].sort().join("_");
  const pairList = [A, B].sort();
  const seed = (fn) => env.withSecurityRulesDisabled((ctx) => fn(ctx.firestore()));

  await seed(async (db) => {
    await setDoc(doc(db, "admins", ADMIN), { since: "test" });
    await setDoc(doc(db, "users", BANNED), { display_name: "Banni", banned: true, profile_visible: false });
  });

  // ------------------------------------------------------------ Profils
  await t("profil : créer le sien (sans email)", assertSucceeds(setDoc(doc(a, "users", A), { uid: A, display_name: "Alice", profile_complete: true, profile_visible: true, subjects: ["Maths"], level: "licence" })));
  await t("profil : email dans le profil refusé", assertFails(setDoc(doc(c, "users", C), { display_name: "Eve", email: "eve@test.com" })));
  await t("profil : écrire celui d'un autre refusé", assertFails(setDoc(doc(c, "users", A), { display_name: "pirate" }, { merge: true })));
  await t("profil : se débannir soi-même refusé", assertFails(setDoc(doc(banned, "users", BANNED), { banned: false }, { merge: true })));
  await t("profil : recherche (requête de l'app)", assertSucceeds(getDocs(query(collection(b, "users"), where("profile_complete", "==", true), where("profile_visible", "==", true), limit(300)))));
  await t("profil : recherche sans filtre de visibilité refusée", assertFails(getDocs(query(collection(b, "users"), where("profile_complete", "==", true)))));
  await t("profil : profil masqué illisible par un autre", assertFails(getDoc(doc(b, "users", BANNED))));
  await t("profil : profil masqué lisible par la modération", assertSucceeds(getDoc(doc(admin, "users", BANNED))));
  await t("profil : données privées lisibles par le propriétaire", assertSucceeds(setDoc(doc(a, "users", A, "private", "settings"), { email_notifications: false, age_bracket: "15plus" })));
  await t("profil : données privées illisibles par un autre", assertFails(getDoc(doc(b, "users", A, "private", "settings"))));
  await t("profil : visiteur refusé", assertFails(getDocs(collection(anon, "users"))));

  // ------------------------------------------------------------ Demandes
  const req = { from_uid: A, to_uid: B, from_name: "Alice", to_name: "Bob", participants: pairList, status: "pending", message: "hi", createdAt: serverTimestamp() };
  await t("demande : envoi (id = paire)", assertSucceeds(setDoc(doc(a, "requests", pair), req)));
  await t("demande : id qui n'est pas la paire refusé", assertFails(setDoc(doc(c, "requests", "nimportequoi"), { ...req, from_uid: C, to_uid: B, participants: [B, C].sort() })));
  await t("demande : au nom d'un autre refusée", assertFails(setDoc(doc(c, "requests", [B, C].sort().join("_")), { ...req, from_uid: B, to_uid: C, participants: [B, C].sort() })));
  await t("demande : à soi-même refusée", assertFails(setDoc(doc(a, "requests", `${A}_${A}`), { ...req, to_uid: A, participants: [A, A] })));
  await t("demande : doublon dans l'autre sens refusé (même id)", assertFails(setDoc(doc(b, "requests", pair), { ...req, from_uid: B, to_uid: A })));
  await t("demande : lecture par le destinataire (requête)", assertSucceeds(getDocs(query(collection(b, "requests"), where("to_uid", "==", B)))));
  await t("demande : lecture par un tiers refusée", assertFails(getDoc(doc(c, "requests", pair))));
  await t("demande : l'émetteur ne peut pas s'auto-accepter", assertFails(updateDoc(doc(a, "requests", pair), { status: "accepted" })));
  await t("message : avant acceptation, refusé", assertFails(addDoc(collection(a, "messages"), { chatId: pair, participants: pairList, senderUid: A, text: "x", unreadBy: [B] })));
  await t("demande : le destinataire accepte", assertSucceeds(updateDoc(doc(b, "requests", pair), { status: "accepted" })));

  // ------------------------------------------------------------ Messages
  let msg;
  await t("message : envoi entre binômes", assertSucceeds((async () => { msg = await addDoc(collection(a, "messages"), { chatId: pair, participants: pairList, senderUid: A, text: "salut", unreadBy: [B], createdAt: serverTimestamp() }); })()));
  await t("message : requête paginée de l'app", assertSucceeds(getDocs(query(collection(b, "messages"), where("chatId", "==", pair), where("participants", "array-contains", B), orderBy("createdAt", "desc"), limit(50)))));
  await t("message : requête sans filtre participants refusée", assertFails(getDocs(query(collection(c, "messages"), where("chatId", "==", pair)))));
  await t("message : un tiers ne lit pas", assertFails(getDoc(doc(c, "messages", msg.id))));
  await t("message : un tiers ne s'invite pas dans la conversation", assertFails(addDoc(collection(c, "messages"), { chatId: pair, participants: pairList, senderUid: C, text: "x" })));
  await t("message : usurpation d'expéditeur refusée", assertFails(addDoc(collection(c, "messages"), { chatId: pair, participants: pairList, senderUid: A, text: "x" })));
  await t("message : texte trop long refusé", assertFails(addDoc(collection(a, "messages"), { chatId: pair, participants: pairList, senderUid: A, text: "x".repeat(4001) })));
  await t("non-lu : requête des non-lus", assertSucceeds(getDocs(query(collection(b, "messages"), where("unreadBy", "array-contains", B)))));
  await t("non-lu : non-lus d'un autre refusés", assertFails(getDocs(query(collection(c, "messages"), where("unreadBy", "array-contains", B)))));
  await t("non-lu : l'expéditeur n'efface pas le non-lu", assertFails(updateDoc(doc(a, "messages", msg.id), { unreadBy: [] })));
  await t("non-lu : le destinataire marque comme lu", assertSucceeds(updateDoc(doc(b, "messages", msg.id), { unreadBy: arrayRemove(B) })));
  await t("message : modifier le sien", assertSucceeds(updateDoc(doc(a, "messages", msg.id), { text: "salut !", isEdited: true })));
  await t("message : modifier celui de l'autre refusé", assertFails(updateDoc(doc(b, "messages", msg.id), { text: "pirate" })));
  await t("message : supprimer celui de l'autre refusé", assertFails(deleteDoc(doc(b, "messages", msg.id))));

  // ------------------------------------------------------------ Sessions + avis
  let ses;
  const session = { title: "Révisions", organizer_uid: A, organizer_name: "Alice", buddy_uid: B, buddy_name: "Bob", participants: [A, B], status: "planned", date: "2030-01-01", time: "10:00", duration_minutes: 60, mode: "en_ligne", meeting_url: "https://meet.jit.si/x" };
  await t("session : création entre binômes", assertSucceeds((async () => { ses = await addDoc(collection(a, "sessions"), session); })()));
  await t("session : création avec un non-binôme refusée", assertFails(addDoc(collection(c, "sessions"), { ...session, organizer_uid: C, participants: [C, A] })));
  await t("session : liste (requête de l'app)", assertSucceeds(getDocs(query(collection(b, "sessions"), where("participants", "array-contains", B)))));
  await t("session : un tiers ne lit pas", assertFails(getDoc(doc(c, "sessions", ses.id))));
  await t("session : changer autre chose que le statut refusé", assertFails(updateDoc(doc(b, "sessions", ses.id), { title: "x" })));
  await t("session : le binôme la termine", assertSucceeds(updateDoc(doc(b, "sessions", ses.id), { status: "completed" })));
  await t("avis : donner son avis", assertSucceeds(setDoc(doc(b, "feedback", `${ses.id}_${B}`), { sessionId: ses.id, from_uid: B, about_uid: A, rating: 2, comment: "retard" })));
  await t("avis : note hors 1-5 refusée", assertFails(setDoc(doc(a, "feedback", `${ses.id}_${A}`), { sessionId: ses.id, from_uid: A, about_uid: B, rating: 9 })));
  await t("avis : un tiers ne note pas la session", assertFails(setDoc(doc(c, "feedback", `${ses.id}_${C}`), { sessionId: ses.id, from_uid: C, about_uid: A, rating: 1 })));
  await t("avis : second avis (modification) refusé", assertFails(setDoc(doc(b, "feedback", `${ses.id}_${B}`), { sessionId: ses.id, from_uid: B, about_uid: A, rating: 5 })));
  await t("avis : illisibles par les étudiants", assertFails(getDoc(doc(a, "feedback", `${ses.id}_${B}`))));
  await t("avis : lisibles par la modération (requête de la page)", assertSucceeds(getDocs(query(collection(admin, "feedback"), where("rating", "<=", 2)))));

  // ------------------------------------------------------------ Tableau blanc (traits)
  await t("tableau : écoute d'un tableau inexistant", assertSucceeds(getDoc(doc(a, "whiteboards", pair))));
  await t("tableau : création par un binôme", assertSucceeds(setDoc(doc(a, "whiteboards", pair), { participants: pairList })));
  await t("tableau : un tiers ne crée pas le tableau d'une autre paire", assertFails(setDoc(doc(c, "whiteboards", [B, C].sort().join("_")), { participants: [B, C].sort() })));
  let stroke;
  await t("trait : ajout", assertSucceeds((async () => { stroke = await addDoc(collection(a, "whiteboards", pair, "strokes"), { uid: A, tool: "pen", color: "ink", width: 6, points: [1, 2, 3, 4], createdAt: serverTimestamp() }); })()));
  await t("trait : lecture des traits (requête de l'app)", assertSucceeds(getDocs(query(collection(b, "whiteboards", pair, "strokes"), orderBy("createdAt")))));
  await t("trait : un tiers ne lit pas", assertFails(getDocs(collection(c, "whiteboards", pair, "strokes"))));
  await t("trait : au nom de l'autre refusé", assertFails(addDoc(collection(b, "whiteboards", pair, "strokes"), { uid: A, tool: "pen", points: [1, 2] })));
  await t("trait : trop de points refusé", assertFails(addDoc(collection(a, "whiteboards", pair, "strokes"), { uid: A, tool: "pen", points: new Array(6001).fill(1) })));
  await t("trait : modification refusée", assertFails(updateDoc(doc(a, "whiteboards", pair, "strokes", stroke.id), { color: "red" })));
  await t("trait : « Tout effacer » par le binôme", assertSucceeds(deleteDoc(doc(b, "whiteboards", pair, "strokes", stroke.id))));

  // ------------------------------------------------------------ Signalements, modération, bannissement
  let report;
  await t("signalement : création", assertSucceeds((async () => { report = await addDoc(collection(b, "reports"), { reporter_uid: B, reported_uid: C, reported_user_name: "Eve", reason: "spam", details: "", status: "pending", createdAt: serverTimestamp() }); })()));
  await t("signalement : se signaler soi-même refusé", assertFails(addDoc(collection(b, "reports"), { reporter_uid: B, reported_uid: B, status: "pending" })));
  await t("signalement : illisible par les étudiants", assertFails(getDocs(collection(b, "reports"))));
  await t("modération : liste des signalements (requête de la page)", assertSucceeds(getDocs(query(collection(admin, "reports"), where("status", "==", "pending"), orderBy("createdAt", "desc")))));
  await seed((db) => setDoc(doc(db, "users", C), { display_name: "Eve", profile_visible: true }));
  await t("modération : bannir (lot profil + signalement)", assertSucceeds((async () => {
    const batch = writeBatch(admin);
    batch.update(doc(admin, "users", C), { banned: true, profile_visible: false });
    batch.update(doc(admin, "reports", report.id), { status: "banned", handledAt: serverTimestamp(), handledBy: ADMIN });
    await batch.commit();
  })()));
  await t("modération : un étudiant ne peut pas bannir", assertFails(updateDoc(doc(a, "users", B), { banned: true })));
  await t("modération : un étudiant ne peut pas se déclarer admin", assertFails(setDoc(doc(a, "admins", A), { since: "now" })));
  await t("banni : ne peut plus envoyer de demande", assertFails(setDoc(doc(banned, "requests", [A, BANNED].sort().join("_")), { ...req, from_uid: BANNED, to_uid: A, participants: [A, BANNED].sort() })));
  await t("banni : ne peut plus signaler", assertFails(addDoc(collection(banned, "reports"), { reporter_uid: BANNED, reported_uid: A, status: "pending" })));

  // ------------------------------------------------------------ Blocage
  await t("blocage : bloquer quelqu'un", assertSucceeds(setDoc(doc(b, "blocks", `${B}_${C}`), { blocker: B, blocked: C, blocked_name: "Eve" })));
  await t("blocage : id incohérent refusé", assertFails(setDoc(doc(b, "blocks", `${C}_${B}`), { blocker: B, blocked: C })));
  await t("blocage : liste de ses blocages", assertSucceeds(getDocs(query(collection(b, "blocks"), where("blocker", "==", B)))));
  await t("blocage : la personne bloquée ne voit pas le blocage", assertFails(getDoc(doc(c, "blocks", `${B}_${C}`))));
  await seed((db) => setDoc(doc(db, "users", C), { banned: false }, { merge: true }));
  await t("blocage : la personne bloquée ne peut plus envoyer de demande", assertFails(setDoc(doc(c, "requests", [B, C].sort().join("_")), { ...req, from_uid: C, to_uid: B, participants: [B, C].sort() })));
  await t("blocage : débloquer", assertSucceeds(deleteDoc(doc(b, "blocks", `${B}_${C}`))));

  // ------------------------------------------------------------ Retrait du binôme
  await t("binôme : retrait (suppression de la demande)", assertSucceeds(deleteDoc(doc(a, "requests", pair))));
  await t("binôme : plus de message possible après le retrait", assertFails(addDoc(collection(a, "messages"), { chatId: pair, participants: pairList, senderUid: A, text: "encore là ?", unreadBy: [B] })));

  // ------------------------------------------------------------ Compteur public, e-mails, reste
  await t("compteur : lisible par un visiteur", assertSucceeds(getDoc(doc(anon, "stats", "public"))));
  await t("compteur : écriture client refusée", assertFails(setDoc(doc(a, "stats", "public"), { studentCount: 9999 })));
  await t("file d'e-mails : inaccessible aux clients", assertFails(addDoc(collection(a, "mail"), { to: "x@test.com", message: { subject: "spam" } })));
  await t("collection inconnue refusée", assertFails(getDoc(doc(a, "secrets", "x"))));
}
