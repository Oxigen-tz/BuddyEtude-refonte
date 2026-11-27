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
  await t("profil : se déclarer « étudiant vérifié » soi-même refusé", assertFails(setDoc(doc(a, "users", A), { verified_domain: "univ-test.fr" }, { merge: true })));
  await t("profil : créer un profil déjà « vérifié » refusé", assertFails(setDoc(doc(c, "users", C), { display_name: "Eve", verified_domain: "x.fr" })));
  await t("profil : se débannir soi-même refusé", assertFails(setDoc(doc(banned, "users", BANNED), { banned: false }, { merge: true })));
  await t("profil : recherche (requête de l'app)", assertSucceeds(getDocs(query(collection(b, "users"), where("profile_complete", "==", true), where("profile_visible", "==", true), limit(300)))));
  await t("profil : recherche sans filtre de visibilité refusée", assertFails(getDocs(query(collection(b, "users"), where("profile_complete", "==", true)))));
  await t("profil : profil masqué illisible par un autre", assertFails(getDoc(doc(b, "users", BANNED))));
  await t("profil : profil masqué lisible par la modération", assertSucceeds(getDoc(doc(admin, "users", BANNED))));
  await t("profil : données privées lisibles par le propriétaire", assertSucceeds(setDoc(doc(a, "users", A, "private", "settings"), { email_notifications: false, age_bracket: "15plus" })));
  await t("profil : code de vérification illisible même par le propriétaire", assertFails(getDoc(doc(a, "users", A, "private", "verification"))));
  await t("profil : quota de demandes non modifiable par le propriétaire", assertFails(setDoc(doc(a, "users", A, "private", "quota"), { requests: [] })));
  await t("profil : préférences push modifiables par le propriétaire", assertSucceeds(setDoc(doc(a, "users", A, "private", "push"), { tokens: ["t1"] })));
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
  await t("tableau : ajout de pages et d'un fond PDF", assertSucceeds(updateDoc(doc(a, "whiteboards", pair), { pageCount: 3, backgrounds: { 1: "https://x/p1.jpg" } })));
  await t("tableau : nombre de pages invalide refusé", assertFails(updateDoc(doc(a, "whiteboards", pair), { pageCount: 0 })));
  await t("trait : sur une autre page", assertSucceeds(addDoc(collection(b, "whiteboards", pair, "strokes"), { uid: B, tool: "pen", points: [1, 2], page: 2, createdAt: serverTimestamp() })));
  await t("trait : numéro de page invalide refusé", assertFails(addDoc(collection(b, "whiteboards", pair, "strokes"), { uid: B, tool: "pen", points: [1, 2], page: "deux" })));

  // ------------------------------------------------------------ Groupes de révision
  const groupRef = doc(collection(a, "groups"));
  const gid = groupRef.id;
  const D = "uidDora";
  const d = as(D);
  await t("groupe : création par Alice", assertSucceeds(setDoc(groupRef, { name: "Partiels L2", subject: "Maths", owner_uid: A, members: [A], member_names: { [A]: "Alice" }, createdAt: serverTimestamp() })));
  await t("groupe : création avec d'autres membres d'office refusée", assertFails(setDoc(doc(collection(a, "groups")), { name: "x", owner_uid: A, members: [A, B] })));
  await t("groupe : création au nom d'un autre refusée", assertFails(setDoc(doc(collection(c, "groups")), { name: "x", owner_uid: A, members: [A] })));
  await t("groupe : ajout d'un binôme (Bob)", assertSucceeds(updateDoc(doc(a, "groups", gid), { members: [A, B], [`member_names.${B}`]: "Bob" })));
  await t("groupe : ajout de quelqu'un qui n'est pas binôme refusé", assertFails(updateDoc(doc(a, "groups", gid), { members: [A, B, C] })));
  await t("groupe : un membre ne peut pas ajouter quelqu'un", assertFails(updateDoc(doc(b, "groups", gid), { members: [A, B, D] })));
  await t("groupe : liste de mes groupes (requête de l'app)", assertSucceeds(getDocs(query(collection(b, "groups"), where("members", "array-contains", B)))));
  await t("groupe : un non-membre ne lit pas", assertFails(getDoc(doc(c, "groups", gid))));
  await t("groupe : message d'un membre", assertSucceeds(addDoc(collection(b, "groups", gid, "messages"), { senderUid: B, senderName: "Bob", text: "Salut le groupe", createdAt: serverTimestamp() })));
  await t("groupe : message d'un non-membre refusé", assertFails(addDoc(collection(c, "groups", gid, "messages"), { senderUid: C, text: "intrus" })));
  await t("groupe : lecture des messages par un non-membre refusée", assertFails(getDocs(collection(c, "groups", gid, "messages"))));
  await t("groupe : tableau blanc de groupe (membre)", assertSucceeds(setDoc(doc(b, "whiteboards", `grp-${gid}`), { group_id: gid, pageCount: 1 })));
  await t("groupe : trait sur le tableau de groupe", assertSucceeds(addDoc(collection(a, "whiteboards", `grp-${gid}`, "strokes"), { uid: A, tool: "pen", points: [1, 2], page: 0, createdAt: serverTimestamp() })));
  await t("groupe : tableau de groupe interdit à un non-membre", assertFails(getDocs(collection(c, "whiteboards", `grp-${gid}`, "strokes"))));
  await t("groupe : un membre ne supprime pas le groupe", assertFails(deleteDoc(doc(b, "groups", gid))));
  await t("groupe : un membre retire un autre membre refusé", assertFails(updateDoc(doc(b, "groups", gid), { members: [B] })));
  await t("groupe : un membre quitte le groupe", assertSucceeds(updateDoc(doc(b, "groups", gid), { members: [A] })));
  await t("groupe : l'ancien membre ne lit plus", assertFails(getDocs(collection(b, "groups", gid, "messages"))));
  await t("groupe : suppression par le créateur", assertSucceeds(deleteDoc(doc(a, "groups", gid))));
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

  // ------------------------------------------------------------ Audit de sécurité (27/11/2026)
  const P = "uidPaul", Q = "uidQuentin", RB = "uidRebanni";
  const p = as(P), rb = as(RB);
  const pq = [P, Q].sort(), pqId = pq.join("_");
  await seed(async (db) => {
    await setDoc(doc(db, "users", P), { display_name: "Paul", profile_complete: true, profile_visible: true });
    await setDoc(doc(db, "users", Q), { display_name: "Quentin", profile_complete: true, profile_visible: true });
    await setDoc(doc(db, "requests", pqId), { from_uid: Q, to_uid: P, participants: pq, status: "accepted" });
    await setDoc(doc(db, "users", RB), { display_name: "Rebanni", banned: true });
    await setDoc(doc(db, "bans", RB), { since: "test" });
  });
  const fileMsg = (fileUrl) => ({ chatId: pqId, participants: pq, senderUid: P, text: "", unreadBy: [Q], fileUrl, fileType: "application/pdf", fileName: "cours.pdf" });
  await t("pièce jointe : lien « javascript: » refusé", assertFails(addDoc(collection(p, "messages"), fileMsg("javascript:alert(1)"))));
  await t("pièce jointe : lien vers un site tiers refusé", assertFails(addDoc(collection(p, "messages"), fileMsg("https://evil.example/cours.pdf"))));
  await t("pièce jointe : fichier de notre stockage accepté", assertSucceeds(addDoc(collection(p, "messages"), fileMsg("https://firebasestorage.googleapis.com/v0/b/x/o/chat_files%2Fa.pdf?alt=media"))));
  await t("bannissement : profil supprimé puis recréé refusé", assertFails(setDoc(doc(rb, "users", RB), { display_name: "Rebanni" })));
  await t("bannissement : bans/ illisible et non modifiable", assertFails(deleteDoc(doc(rb, "bans", RB))));
  await t("profil : présentation géante refusée", assertFails(setDoc(doc(p, "users", P), { bio: "x".repeat(5000) }, { merge: true })));
  await t("profil : photo hébergée sur un site tiers refusée", assertFails(setDoc(doc(p, "users", P), { photo_url: "https://pisteur.example/x.png" }, { merge: true })));
  await t("profil : photo du compte Google acceptée", assertSucceeds(setDoc(doc(p, "users", P), { photo_url: "https://lh3.googleusercontent.com/a/abc" }, { merge: true })));
  await t("profil : nom « Modération BuddyEtude » refusé", assertFails(setDoc(doc(p, "users", P), { display_name: "Modération BuddyEtude" }, { merge: true })));
  const R = "uidRita";
  await seed((db) => setDoc(doc(db, "users", R), { display_name: "Rita", profile_complete: true, profile_visible: true }));
  const pr = [P, R].sort();
  const reqPR = { from_uid: P, to_uid: R, participants: pr, status: "pending", to_name: "Rita", message: "On révise ?" };
  await t("demande : faux nom d'expéditeur refusé", assertFails(setDoc(doc(p, "requests", pr.join("_")), { ...reqPR, from_name: "Équipe BuddyEtude" })));
  await t("demande : avec son vrai nom acceptée", assertSucceeds(setDoc(doc(p, "requests", pr.join("_")), { ...reqPR, from_name: "Paul" })));
  await t("session : lien d'appel « javascript: » refusé", assertFails(addDoc(collection(p, "sessions"), { organizer_uid: P, participants: pq, status: "planned", title: "x", meeting_url: "javascript:alert(1)" })));

  // ------------------------------------------------------------ Modération des profils
  const M = "uidMarc", N = "uidNina";
  const mk = as(M);
  await seed(async (db) => {
    await setDoc(doc(db, "users", M), { display_name: "Marc", profile_complete: true, profile_visible: true, bio: "Achetez mes cours !", photo_url: "https://lh3.googleusercontent.com/a/x" });
    await setDoc(doc(db, "users", N), { display_name: "Nina", profile_complete: true, profile_visible: true });
  });
  await t("modération : retirer photo et présentation (admin)", assertSucceeds((async () => {
    const batch = writeBatch(admin);
    batch.update(doc(admin, "users", M), { bio: "", photo_url: "" });
    batch.set(doc(admin, "moderation", M), { bio_locked: true, photo_locked: true, notice: { action: "bio", reason: "spam", at: 1 } }, { merge: true });
    await batch.commit();
  })()));
  await t("modération : l'admin ne modifie pas le reste du profil", assertFails(updateDoc(doc(admin, "users", M), { city: "Paris" })));
  await t("modération : l'étudiant lit ses propres mesures", assertSucceeds(getDoc(doc(mk, "moderation", M))));
  await t("modération : un autre ne lit pas les mesures", assertFails(getDoc(doc(b, "moderation", M))));
  await t("modération : l'étudiant ne lève pas ses mesures", assertFails(setDoc(doc(mk, "moderation", M), { bio_locked: false }, { merge: true })));
  await t("modération : présentation bloquée, réécriture refusée", assertFails(setDoc(doc(mk, "users", M), { bio: "Achetez mes cours !" }, { merge: true })));
  await t("modération : photo bloquée, nouvelle photo refusée", assertFails(setDoc(doc(mk, "users", M), { photo_url: "https://lh3.googleusercontent.com/a/y" }, { merge: true })));
  await t("modération : le reste du profil reste modifiable", assertSucceeds(setDoc(doc(mk, "users", M), { city: "Lyon" }, { merge: true })));
  await t("modération : recréer son profil ne lève pas le blocage", assertFails((async () => {
    await deleteDoc(doc(mk, "users", M));
    await setDoc(doc(mk, "users", M), { display_name: "Marc", bio: "Achetez mes cours !" });
  })()));
  await t("modération : restreindre (admin)", assertSucceeds(setDoc(doc(admin, "moderation", M), { restricted: true }, { merge: true })));
  await t("modération : restreint, se rendre visible refusé", assertFails(setDoc(doc(mk, "users", M), { display_name: "Marc", profile_visible: true }, { merge: true })));
  const mn = [M, N].sort();
  await seed((db) => setDoc(doc(db, "users", M), { display_name: "Marc", profile_complete: true, profile_visible: false }));
  await t("modération : restreint, nouvelle demande refusée", assertFails(setDoc(doc(mk, "requests", mn.join("_")), { from_uid: M, to_uid: N, participants: mn, status: "pending", from_name: "Marc" })));
  await t("modération : un étudiant ne peut pas restreindre", assertFails(setDoc(doc(b, "moderation", N), { restricted: true })));
}
