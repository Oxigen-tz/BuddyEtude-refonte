// Tests des Cloud Functions (functions/index.js) sur les émulateurs.
// Lancement : npm run test:functions
// Les déclencheurs Firestore tournent dans l'émulateur Functions ; la tâche planifiée des
// rappels (qui ne se déclenche pas seule en local) est appelée directement.
import { createRequire } from "node:module";

const PROJECT = "demo-buddyetude";
const FS = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;
const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const owner = { "Content-Type": "application/json", Authorization: "Bearer owner" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Outils d'accès à l'émulateur (droits "owner" : contourne les règles)
const toValue = (v) => {
  if (v === null) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
  if (typeof v === "object") return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toValue(x)])) } };
  return { stringValue: String(v) };
};
const write = (path, data) => fetch(`${FS}/${path}`, { method: "PATCH", headers: owner, body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toValue(v)])) }) });
const list = async (collection) => ((await (await fetch(`${FS}/${collection}?pageSize=300`, { headers: owner })).json()).documents) || [];
const get = async (path) => (await fetch(`${FS}/${path}`, { headers: owner })).json();
async function createUser(email) {
  const res = await fetch(`${AUTH}/accounts:signUp?key=fake`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "secret123", returnSecureToken: true }) });
  return (await res.json()).localId;
}
async function waitForMails(predicate, expected, label) {
  for (let i = 0; i < 40; i++) {
    const mails = (await list("mail")).filter((d) => predicate(d.fields));
    if (mails.length >= expected) return mails;
    await sleep(500);
  }
  throw new Error(`${label} : e-mail attendu non créé`);
}
const to = (f) => f.to?.stringValue;
const subject = (f) => f.message?.mapValue?.fields?.subject?.stringValue || "";

let pass = 0;
const failures = [];
const t = async (name, fn) => {
  try { await fn(); pass++; console.log(`  ok    ${name}`); }
  catch (e) { failures.push(name); console.log(`  ÉCHEC ${name} — ${e.message}`); }
};

const A = await createUser("alice@test.com");
const B = await createUser("bob@test.com");
const C = await createUser("carla@test.com");
const pair = [A, B].sort().join("_");

await t("compteur : profil complété → +1", async () => {
  await write(`users/${A}`, { display_name: "Alice", profile_complete: true });
  await write(`users/${B}`, { display_name: "Bob", profile_complete: true });
  for (let i = 0; i < 30; i++) {
    const count = Number((await get("stats/public")).fields?.studentCount?.integerValue || 0);
    if (count === 2) return;
    await sleep(500);
  }
  throw new Error("le compteur n'est pas à 2");
});

await t("e-mail : nouvelle demande de binôme", async () => {
  await write(`requests/${pair}`, { from_uid: A, to_uid: B, from_name: "Alice", to_name: "Bob", participants: [A, B].sort(), status: "pending", message: "On révise ?" });
  const [mail] = await waitForMails((f) => to(f) === "bob@test.com" && /veut réviser/.test(subject(f)), 1, "demande");
  if (!mail.fields.message.mapValue.fields.html.stringValue.includes("On révise ?")) throw new Error("message absent du corps");
});

await t("envoi : chaque e-mail est pris en charge (simulé en local)", async () => {
  for (let i = 0; i < 30; i++) {
    const mails = await list("mail");
    if (mails.length && mails.every((d) => d.fields.delivery?.mapValue?.fields?.state?.stringValue === "SKIPPED_EMULATOR")) return;
    await sleep(500);
  }
  throw new Error("delivery.state absent ou incorrect");
});

await t("e-mail : demande acceptée", async () => {
  await write(`requests/${pair}`, { from_uid: A, to_uid: B, from_name: "Alice", to_name: "Bob", participants: [A, B].sort(), status: "accepted", message: "On révise ?" });
  await waitForMails((f) => to(f) === "alice@test.com" && /accepté/.test(subject(f)), 1, "acceptation");
});

await t("e-mail : nouveau message, un seul pour deux messages rapprochés", async () => {
  await write(`messages/m1`, { chatId: pair, participants: [A, B].sort(), senderUid: A, text: "Salut !", unreadBy: [B], createdAt: new Date() });
  await waitForMails((f) => to(f) === "bob@test.com" && /Nouveau message/.test(subject(f)), 1, "message");
  await write(`messages/m2`, { chatId: pair, participants: [A, B].sort(), senderUid: A, text: "Tu es là ?", unreadBy: [B], createdAt: new Date() });
  await sleep(4000);
  const n = (await list("mail")).filter((d) => to(d.fields) === "bob@test.com" && /Nouveau message/.test(subject(d.fields))).length;
  if (n !== 1) throw new Error(`${n} e-mails au lieu d'un seul`);
});

await t("e-mail : désactivé dans les préférences → aucun envoi", async () => {
  await write(`users/${C}/private/settings`, { email_notifications: false });
  const pairAC = [A, C].sort().join("_");
  await write(`requests/${pairAC}`, { from_uid: A, to_uid: C, from_name: "Alice", to_name: "Carla", participants: [A, C].sort(), status: "pending" });
  await sleep(4000);
  if ((await list("mail")).some((d) => to(d.fields) === "carla@test.com")) throw new Error("e-mail envoyé malgré le réglage");
});

await t("e-mail : nouvelle session", async () => {
  const start = new Date(Date.now() + 3 * 86400000);
  await write(`sessions/s1`, { title: "Chapitre 4", organizer_uid: A, organizer_name: "Alice", buddy_uid: B, participants: [A, B], status: "planned", start_at: start, date: "2030-01-01", time: "18:00", mode: "en_ligne", meeting_url: "https://meet.jit.si/test" });
  const [mail] = await waitForMails((f) => to(f) === "bob@test.com" && /Nouvelle session/.test(subject(f)), 1, "session");
  // Les anciens liens meet.jit.si sont remplacés par l'appel intégré
  const text = mail.fields.message.mapValue.fields.text.stringValue;
  if (!text.includes("/Call?type=session&id=s1") || text.includes("meet.jit.si")) throw new Error("lien d'appel intégré absent");
});

await t("rappels : la veille et 1 h avant, sans doublon", async () => {
  process.env.GCLOUD_PROJECT = PROJECT;
  process.env.APP_URL = "https://buddyetude.com";
  const require = createRequire(import.meta.url);
  const functions = require("../../functions/index.js");
  await write(`sessions/s24`, { title: "Demain", organizer_uid: A, buddy_uid: B, participants: [A, B], status: "planned", start_at: new Date(Date.now() + 20 * 3600 * 1000), mode: "presentiel", location: "BU" });
  await write(`sessions/s1h`, { title: "Bientôt", organizer_uid: A, buddy_uid: B, participants: [A, B], status: "planned", start_at: new Date(Date.now() + 40 * 60 * 1000), mode: "en_ligne" });
  await functions.sessionReminders.run({});
  await functions.sessionReminders.run({}); // second passage : rien de nouveau
  const mails = (await list("mail")).filter((d) => /Rappel/.test(subject(d.fields)));
  const demain = mails.filter((d) => /Demain/.test(subject(d.fields))).length;
  const bientot = mails.filter((d) => /Bientôt/.test(subject(d.fields))).length;
  if (demain !== 2 || bientot !== 2) throw new Error(`rappels : ${demain} pour « Demain », ${bientot} pour « Bientôt » (2 attendus chacun)`);
});

await t("compteur : profil supprimé → -1", async () => {
  await fetch(`${FS}/users/${B}`, { method: "DELETE", headers: owner });
  for (let i = 0; i < 30; i++) {
    const count = Number((await get("stats/public")).fields?.studentCount?.integerValue || 0);
    if (count === 1) return;
    await sleep(500);
  }
  throw new Error("le compteur n'est pas revenu à 1");
});

// --- Modération (fonctions appelables) : jeton de l'émulateur Auth
async function idToken(email) {
  const res = await fetch(`${AUTH}/accounts:signInWithPassword?key=fake`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "secret123", returnSecureToken: true }) });
  return (await res.json()).idToken;
}
async function call(name, data, token) {
  const res = await fetch(`http://127.0.0.1:5001/${PROJECT}/europe-west1/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ data }),
  });
  return { status: res.status, body: await res.json() };
}
const exists = async (path) => (await fetch(`${FS}/${path}`, { headers: owner })).status === 200;

await t("statistiques : refusées sans droit de modération", async () => {
  const { status } = await call("adminStats", {}, await idToken("carla@test.com"));
  if (status !== 403) throw new Error(`statut ${status} au lieu de 403`);
});

await t("statistiques : chiffres pour la modération", async () => {
  await write(`admins/${A}`, { role: "admin" });
  const { status, body } = await call("adminStats", {}, await idToken("alice@test.com"));
  if (status !== 200) throw new Error(`statut ${status} : ${JSON.stringify(body)}`);
  const r = body.result;
  if (r.accounts !== 3 || r.buddies !== 1 || r.weeks.length !== 8 || r.weeks[7].count !== 3) throw new Error(JSON.stringify(r));
});

await t("nettoyage : anciennes données comptées puis supprimées", async () => {
  await write("messages/old1", { chatId: "a@x.com_b@y.com", senderEmail: "a@x.com", text: "ancien" });
  await write("requests/old1", { from: "a@x.com", to: "b@y.com", status: "pending" });
  await write("sessions/old1", { title: "Ancienne", organizer_email: "a@x.com", status: "planned" });
  await write("whiteboards/a@x.com_b@y.com", { image: "data:" });
  await write("whiteboards/a@x.com_b@y.com/strokes/s1", { points: [] });
  await write(`users/legacy1`, { display_name: "Ancien", email: "ancien@test.com" });
  const token = await idToken("alice@test.com");
  const dry = (await call("adminCleanupLegacy", { dryRun: true }, token)).body.result;
  const expected = { messages: 1, requests: 1, sessions: 1, whiteboards: 1, profiles: 1 };
  for (const [k, v] of Object.entries(expected)) if (dry[k] !== v) throw new Error(`simulation : ${k} = ${dry[k]}`);
  if (!(await exists("messages/old1"))) throw new Error("la simulation a supprimé des données");
  await call("adminCleanupLegacy", { dryRun: false }, token);
  for (const p of ["messages/old1", "requests/old1", "sessions/old1", "whiteboards/a@x.com_b@y.com/strokes/s1"]) {
    if (await exists(p)) throw new Error(`${p} encore présent`);
  }
  if (!(await exists("messages/m1")) || !(await exists(`requests/${pair}`))) throw new Error("des données actuelles ont été supprimées");
  const legacy = (await get("users/legacy1")).fields;
  if (legacy.email || legacy.profile_visible?.booleanValue !== true) throw new Error("profil ancien mal nettoyé");
});

await t("purge : vieux e-mails supprimés, signalement en attente conservé", async () => {
  const old = new Date(Date.now() - 400 * 86400000);
  await write("mail/old", { to: "x@test.com", message: { subject: "vieux" }, createdAt: old });
  await write("reports/oldPending", { status: "pending", createdAt: old });
  await write("reports/oldDone", { status: "dismissed", createdAt: old });
  // Compte sans connexion depuis 4 ans (création directe dans l'émulateur Auth)
  const fourYearsAgo = String(Date.now() - 4 * 365 * 86400000);
  await fetch(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:batchCreate`, {
    method: "POST", headers: owner,
    body: JSON.stringify({ users: [{ localId: "inactif1", email: "inactif@test.com", createdAt: fourYearsAgo, lastLoginAt: fourYearsAgo }] }),
  });
  await write("users/inactif1", { display_name: "Inactif" });
  await write("users/inactif1/private/settings", { email_notifications: true });
  await write("messages/inactifMsg", { chatId: "x_y", senderUid: "inactif1", text: "vieux", unreadBy: [] });
  await sleep(1500);
  const require = createRequire(import.meta.url);
  await require("../../functions/index.js").dailyPurge.run({});
  for (const p of ["users/inactif1", "users/inactif1/private/settings", "messages/inactifMsg"]) {
    if (await exists(p)) throw new Error(`compte inactif : ${p} encore présent`);
  }
  if (!(await exists(`users/${A}`))) throw new Error("un compte actif a été supprimé");
  if (await exists("mail/old")) throw new Error("vieil e-mail conservé");
  if (await exists("reports/oldDone")) throw new Error("vieux signalement traité conservé");
  if (!(await exists("reports/oldPending"))) throw new Error("signalement en attente supprimé");
});

await t("suppression de compte : données privées et avis effacés", async () => {
  const D = await createUser("dora@test.com");
  await write(`users/${D}/private/settings`, { email_notifications: true });
  await write(`feedback/s1_${D}`, { from_uid: D, sessionId: "s1", rating: 4 });
  const token = await idToken("dora@test.com");
  const res = await call("deleteMyData", {}, token);
  if (res.status !== 200) throw new Error(`deleteMyData : statut ${res.status}`);
  await fetch(`${AUTH}/accounts:delete?key=fake`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) });
  for (let i = 0; i < 30; i++) {
    if (!(await exists(`users/${D}/private/settings`)) && !(await exists(`feedback/s1_${D}`))) return;
    await sleep(500);
  }
  throw new Error("données encore présentes");
});

await t("résumé du lundi : nouveaux compatibles, préférence respectée", async () => {
  const E = await createUser("eva@test.com");
  const F = await createUser("fred@test.com");
  await write(`users/${E}`, { display_name: "Eva", profile_complete: true, profile_visible: true, subjects: [{ name: "Mathématiques" }], school: "IUT Vannes" });
  await write(`users/${F}`, { display_name: "Fred", profile_complete: true, profile_visible: true, subjects: [{ name: "Physique" }], school: "iut vannes " });
  await write(`users/${F}/private/settings`, { weekly_digest: false });
  await sleep(1500);
  const require = createRequire(import.meta.url);
  await require("../../functions/index.js").weeklyDigest.run({});
  const digests = (await list("mail")).filter((d) => /compatible/.test(subject(d.fields)));
  const toEva = digests.find((d) => to(d.fields) === "eva@test.com");
  if (!toEva) throw new Error("pas de résumé pour Eva");
  const text = toEva.fields.message.mapValue.fields.text.stringValue;
  if (!/Fred — même école/.test(text)) throw new Error(`contenu inattendu : ${text}`);
  if (digests.some((d) => to(d.fields) === "fred@test.com")) throw new Error("résumé envoyé malgré la préférence");
});

await t("aperçu public : profils éligibles seulement, aucune donnée personnelle", async () => {
  const mk = async (email, data, priv) => {
    const id = await createUser(email);
    await write(`users/${id}`, { profile_complete: true, profile_visible: true, display_name: "NomSecret", city: "VilleSecrete", school: "EcoleSecrete", bio: "BioSecrete", photo_url: "https://photo.secrete/x.png", level: "Licence", subjects: [{ name: "Chimie", level: "avance" }], ...data });
    if (priv) await write(`users/${id}/private/settings`, priv);
    return id;
  };
  for (const n of [1, 2, 3]) await mk(`ok${n}@test.com`, {}, { age_bracket: "15plus" });
  await mk("hidden@test.com", { profile_visible: false, subjects: [{ name: "Cachée" }] });
  await mk("banned@test.com", { banned: true, subjects: [{ name: "Bannie" }] });
  await mk("minor@test.com", { subjects: [{ name: "Mineure" }] }, { age_bracket: "under15" });
  await sleep(1000);
  const require = createRequire(import.meta.url);
  await require("../../functions/index.js").refreshPublicPreview.run({});
  const doc = await get("stats/preview");
  const json = JSON.stringify(doc);
  for (const secret of ["NomSecret", "VilleSecrete", "EcoleSecrete", "BioSecrete", "photo.secrete", "@test.com"]) {
    if (json.includes(secret)) throw new Error(`donnée personnelle recopiée : ${secret}`);
  }
  for (const excluded of ["Cachée", "Bannie", "Mineure"]) {
    if (json.includes(excluded)) throw new Error(`profil non éligible inclus : ${excluded}`);
  }
  const profiles = doc.fields?.profiles?.arrayValue?.values || [];
  if (profiles.length < 3 || profiles.length > 6) throw new Error(`${profiles.length} profil(s) dans l'aperçu`);
});

await t("anti-abus : au-delà de 15 demandes par jour, la demande est supprimée", async () => {
  const S = await createUser("spam@test.com");
  for (let i = 0; i < 16; i++) {
    const target = `cible${String(i).padStart(2, "0")}`;
    await write(`requests/${[S, target].sort().join("_")}`, { from_uid: S, to_uid: target, from_name: "Spam", participants: [S, target].sort(), status: "pending" });
    await sleep(150);
  }
  for (let i = 0; i < 40; i++) {
    const left = (await list("requests")).filter((d) => d.fields.from_uid?.stringValue === S).length;
    if (left === 15) return;
    await sleep(500);
  }
  throw new Error("la 16e demande n'a pas été supprimée");
});

await t("étudiant vérifié : messagerie perso refusée, code par e-mail, badge posé", async () => {
  const V = await createUser("vera@test.com");
  await write(`users/${V}`, { display_name: "Vera", profile_complete: true });
  const token = await idToken("vera@test.com");
  const personal = await call("requestStudentVerification", { email: "vera@gmail.com" }, token);
  if (personal.status !== 400 || !/personal-email/.test(JSON.stringify(personal.body))) throw new Error(`Gmail accepté : ${JSON.stringify(personal.body)}`);
  const ok = await call("requestStudentVerification", { email: "Vera.Test@etu.univ-test.fr" }, token);
  if (ok.status !== 200) throw new Error(`envoi du code : ${JSON.stringify(ok.body)}`);
  const [mail] = await waitForMails((f) => to(f) === "vera.test@etu.univ-test.fr", 1, "code");
  const code = /(\d{6})/.exec(subject(mail.fields))[1];
  const wrong = await call("confirmStudentVerification", { code: code === "000000" ? "111111" : "000000" }, token);
  if (wrong.status === 200) throw new Error("mauvais code accepté");
  const good = await call("confirmStudentVerification", { code }, token);
  if (good.status !== 200 || good.body.result.domain !== "etu.univ-test.fr") throw new Error(`validation : ${JSON.stringify(good.body)}`);
  const profile = (await get(`users/${V}`)).fields;
  if (profile.verified_domain?.stringValue !== "etu.univ-test.fr") throw new Error("badge absent du profil");
  if (JSON.stringify(await get(`users/${V}/private/verification`)).includes("vera.test@")) throw new Error("adresse conservée après vérification");
  // La même adresse ne peut pas vérifier un deuxième compte
  const W = await createUser("walt@test.com");
  const reuse = await call("requestStudentVerification", { email: "vera.test@etu.univ-test.fr" }, await idToken("walt@test.com"));
  if (reuse.status === 200) throw new Error(`adresse réutilisée (${W})`);
});

await t("statistiques : entonnoir et mentorat", async () => {
  const { body } = await call("adminStats", {}, await idToken("alice@test.com"));
  const r = body.result;
  if (!Array.isArray(r.funnel) || r.funnel.length !== 5 || r.funnel[0].key !== "accounts") throw new Error(JSON.stringify(r.funnel));
  if (r.verified < 1) throw new Error(`vérifiés : ${r.verified}`);
  r.funnel.forEach((step, i) => { if (i > 0 && step.count > r.funnel[i - 1].count) throw new Error(`entonnoir qui remonte : ${JSON.stringify(r.funnel)}`); });
});

// --- Changement de nom propagé (demandes, sessions, groupes)
await t("nom : un changement de nom est recopié dans les demandes, sessions et groupes", async () => {
  await write(`requests/${pair}`, { from_uid: A, to_uid: B, from_name: "Alice", to_name: "Bob", status: "accepted", participants: [A, B] });
  await write("sessions/s-nom", { organizer_uid: A, organizer_name: "Alice", buddy_name: "Bob", participants: [A, B], status: "planned", title: "Test" });
  await write("groups/g-nom", { owner_uid: A, members: [A, B], member_names: { [A]: "Alice", [B]: "Bob" }, name: "Groupe" });
  await write(`users/${B}`, { display_name: "Bob", profile_complete: true }); // profil existant (supprimé plus haut)
  await sleep(1500);
  await write(`users/${B}`, { display_name: "Bobby", profile_complete: true });
  for (let i = 0; i < 40; i++) {
    const [r, sess, g] = await Promise.all([get(`requests/${pair}`), get("sessions/s-nom"), get("groups/g-nom")]);
    if (r.fields?.to_name?.stringValue === "Bobby" && sess.fields?.buddy_name?.stringValue === "Bobby"
      && g.fields?.member_names?.mapValue?.fields?.[B]?.stringValue === "Bobby") return;
    await sleep(500);
  }
  throw new Error("nom non recopié");
});

// --- Appels vidéo : contrôle d'accès (sans clé Daily dans l'émulateur)
await t("appel : refusé à un étudiant hors du binôme", async () => {
  const { status, body } = await call("createCallToken", { type: "pair", id: pair }, await idToken("carla@test.com"));
  if (status === 200 || body.error?.message !== "not-allowed") throw new Error(`${status} ${JSON.stringify(body)}`);
});
await t("appel : membre du binôme autorisé (s'arrête à la clé Daily absente)", async () => {
  const { status, body } = await call("createCallToken", { type: "pair", id: pair }, await idToken("alice@test.com"));
  if (status === 200 || body.error?.message !== "calls-not-configured") throw new Error(`${status} ${JSON.stringify(body)}`);
});
await t("appel : paramètres invalides refusés", async () => {
  const { body } = await call("createCallToken", { type: "x", id: "../../" }, await idToken("alice@test.com"));
  if (body.error?.message !== "bad-request") throw new Error(JSON.stringify(body));
});

// --- Appels vidéo : salle et jeton Daily (API simulée)
await t("appel : salle créée une fois, réutilisée ensuite, jeton nominatif", async () => {
  const require = createRequire(import.meta.url);
  const calls = require("../../functions/calls.js");
  const rooms = new Map();
  const seen = [];
  const fakeFetch = async (url, { method = "GET", body } = {}) => {
    const path = url.replace(/^https:\/\/api\.daily\.co\/v1/, "");
    seen.push(`${method} ${path}`);
    const json = (status, data) => ({ status, json: async () => data });
    if (method === "GET" && path.startsWith("/rooms/")) {
      const room = rooms.get(path.slice(7));
      return room ? json(200, room) : json(404, { error: "not-found" });
    }
    if (method === "POST" && path === "/rooms") {
      const b = JSON.parse(body);
      if (b.privacy !== "private") return json(400, { error: "privacy" });
      const room = { name: b.name, url: `https://test.daily.co/${b.name}`, config: { exp: b.properties.exp } };
      rooms.set(b.name, room);
      return json(200, room);
    }
    if (method === "POST" && path === "/meeting-tokens") {
      const b = JSON.parse(body);
      return json(200, { token: `tok-${b.properties.room_name}-${b.properties.user_name}` });
    }
    return json(404, {});
  };
  const first = await calls.ensureRoom("k", { type: "pair", id: pair }, { fetchImpl: fakeFetch });
  const again = await calls.ensureRoom("k", { type: "pair", id: pair }, { fetchImpl: fakeFetch });
  if (first.url !== again.url || rooms.size !== 1) throw new Error("salle non réutilisée");
  if (!/^be-[0-9a-f]{24}$/.test(first.name)) throw new Error(`nom de salle : ${first.name}`);
  if (calls.roomNameFor("pair", pair) === calls.roomNameFor("group", pair)) throw new Error("salles identiques pour deux contextes");
  const token = await calls.createToken("k", { roomName: first.name, userName: "Alice" }, fakeFetch);
  if (token !== `tok-${first.name}-Alice`) throw new Error(token);
  if (seen.filter((x) => x === "POST /rooms").length !== 1) throw new Error(seen.join(", "));
});

console.log(`\nFunctions : ${pass} test(s) réussi(s), ${failures.length} échec(s)`);
process.exit(failures.length ? 1 : 0);
