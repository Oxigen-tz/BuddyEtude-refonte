// Cloud Functions de BuddyEtude
//
//  - E-mails : nouvelle demande, demande acceptée, nouveau message, nouvelle session.
//  - Rappels de session : 24 h et 1 h avant (tâche planifiée toutes les 15 minutes).
//  - Compteur public d'étudiants (stats/public), affiché sur l'accueil.
//  - Modération : statistiques (adminStats) et nettoyage des données de l'ancien format
//    (adminCleanupLegacy), appelables seulement par un compte listé dans "admins".
//  - Vie privée : effacement des données restantes à la suppression d'un compte, purge
//    quotidienne des e-mails envoyés (30 jours), des avis et des signalements traités (1 an).
//
// Les e-mails passent par une file : chaque e-mail est d'abord écrit dans la collection "mail",
// puis la fonction deliverMail l'envoie via le serveur SMTP (Brevo) et note le résultat dans
// le champ "delivery" (SUCCESS / ERROR). Configuration au déploiement :
//   - SMTP_USER (paramètre) : identifiant SMTP, ex. xxxx@smtp-brevo.com
//   - SMTP_PASSWORD (secret) : firebase functions:secrets:set SMTP_PASSWORD
//
// Chaque utilisateur peut couper ces e-mails dans Paramètres → Préférences
// (users/<uid>/private/settings.email_notifications = false).

const { onDocumentCreated, onDocumentUpdated, onDocumentWritten, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineString, defineSecret } = require("firebase-functions/params");
const nodemailer = require("nodemailer");
const logger = require("firebase-functions/logger");
// Imports modulaires : avec firebase-admin 12, admin.firestore.FieldValue / Timestamp ne sont
// pas définis dans l'environnement d'exécution des fonctions (toutes les fonctions plantaient).
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp, AggregateField } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { getAuth } = require("firebase-admin/auth");
const { getMessaging } = require("firebase-admin/messaging");
const crypto = require("node:crypto");
const calls = require("./calls");

initializeApp();
const db = getFirestore();

setGlobalOptions({ region: "europe-west1", maxInstances: 5 });

// Adresse publique du site (liens dans les e-mails). Modifiable au déploiement.
const APP_URL = defineString("APP_URL", { default: "https://buddyetude.com" });

// Envoi SMTP (Brevo par défaut)
const SMTP_HOST = defineString("SMTP_HOST", { default: "smtp-relay.brevo.com" });
const SMTP_USER = defineString("SMTP_USER", { description: "Identifiant SMTP (Brevo : SMTP et API → Connexion)" });
const MAIL_FROM = defineString("MAIL_FROM", { default: "BuddyEtude <notifications@buddyetude.com>" });
const SMTP_PASSWORD = defineSecret("SMTP_PASSWORD");
// Appels vidéo (Daily.co) : firebase functions:secrets:set DAILY_API_KEY
const DAILY_API_KEY = defineSecret("DAILY_API_KEY");

const MESSAGE_EMAIL_COOLDOWN_MS = 30 * 60 * 1000; // au plus un e-mail par conversation / 30 min

// ------------------------------------------------------------------ Outils

// Adresse e-mail d'un utilisateur s'il accepte les notifications (null sinon)
async function recipientEmail(uid) {
  if (!uid) return null;
  try {
    const [user, settings] = await Promise.all([
      getAuth().getUser(uid),
      db.doc(`users/${uid}/private/settings`).get(),
    ]);
    if (!user.email || user.disabled) return null;
    if (settings.exists && settings.get("email_notifications") === false) return null;
    return user.email;
  } catch (error) {
    logger.warn("Destinataire introuvable", { uid, error: error.message });
    return null;
  }
}

const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderEmail({ title, lines, ctaLabel, ctaPath }) {
  const url = `${APP_URL.value()}${ctaPath}`;
  const text = [title, "", ...lines, "", `${ctaLabel} : ${url}`, "", "—", "BuddyEtude · Pour ne plus recevoir ces e-mails : Paramètres → Préférences."].join("\n");
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <div style="font-weight:700;font-size:18px;color:#4f46e5;margin-bottom:24px">BuddyEtude</div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(title)}</h1>
      ${lines.map((l) => `<p style="margin:0 0 12px;line-height:1.5;color:#334155">${escapeHtml(l)}</p>`).join("")}
      <a href="${escapeHtml(url)}" style="display:inline-block;margin-top:12px;background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">${escapeHtml(ctaLabel)}</a>
    </div>
    <p style="font-size:12px;color:#64748b;margin-top:20px">Pour ne plus recevoir ces e-mails : Paramètres → Préférences sur BuddyEtude.</p>
  </div></body></html>`;
  return { text, html };
}

async function sendMail(to, subject, content) {
  if (!to) return;
  await db.collection("mail").add({ to, message: { subject, ...content }, createdAt: FieldValue.serverTimestamp() });
}

// Notifications push (téléphone / ordinateur) : jetons des appareils sur lesquels l'étudiant les
// a activées (Paramètres), dans users/<uid>/private/push. Messages "data" affichés par public/sw.js.
// Les jetons expirés sont retirés automatiquement.
async function sendPush(uid, { title, body, link, tag }) {
  if (!uid) return;
  const ref = db.doc(`users/${uid}/private/push`);
  const tokens = (await ref.get().catch(() => null))?.get("tokens") || [];
  if (!tokens.length) return;
  try {
    const res = await getMessaging().sendEachForMulticast({
      tokens,
      data: { title: String(title).slice(0, 120), body: String(body || "").slice(0, 300), link: link || "/Dashboard", tag: tag || "" },
      webpush: { headers: { Urgency: "high", TTL: "86400" } },
    });
    const dead = res.responses
      .map((r, i) => (!r.success && /registration-token-not-registered|invalid-registration-token|invalid-argument/.test(r.error?.code || "") ? tokens[i] : null))
      .filter(Boolean);
    if (dead.length) await ref.update({ tokens: FieldValue.arrayRemove(...dead) });
  } catch (error) {
    logger.warn("Notification push non envoyée", { uid, error: error.message });
  }
}

const formatStart = (ts) => ts?.toDate?.().toLocaleString("fr-FR", {
  timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
}) || "";

// ------------------------------------------------------------------ Demandes de binôme

// Anti-abus : au plus REQUESTS_PER_DAY demandes (binôme ou aide) par 24 h glissantes et par
// expéditeur ; au-delà, la demande est supprimée sans prévenir le destinataire.
// Même valeur que src/lib/safety.js (le site prévient avant d'atteindre la limite).
const REQUESTS_PER_DAY = 15;

async function withinRequestQuota(uid, now = Date.now()) {
  const ref = db.doc(`users/${uid}/private/quota`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const recent = (snap.exists ? snap.get("requests") || [] : []).filter((ms) => ms > now - DAY_MS);
    if (recent.length >= REQUESTS_PER_DAY) return false;
    tx.set(ref, { requests: [...recent, now] }, { merge: true });
    return true;
  });
}

exports.onRequestCreated = onDocumentCreated("requests/{pairId}", async (event) => {
  const r = event.data?.data();
  if (!r || r.status !== "pending") return;
  if (!(await withinRequestQuota(r.from_uid))) {
    logger.warn("Limite de demandes atteinte : demande supprimée", { from: r.from_uid });
    await event.data.ref.delete();
    return;
  }
  const from = r.from_name || "Un étudiant";
  const isHelp = r.kind === "help";
  const to = await recipientEmail(r.to_uid);
  const lines = [isHelp
    ? `${from} débute en ${r.subject || "une matière"} et aimerait ton aide : tu as indiqué y être avancé(e).`
    : `${from} souhaite réviser avec toi sur BuddyEtude.`];
  if (r.message) lines.push(`Son message : « ${String(r.message).slice(0, 500)} »`);
  const subject = isHelp ? `${from} te demande de l'aide en ${r.subject || "révision"}` : `${from} veut réviser avec toi`;
  await sendMail(to, subject,
    renderEmail({ title: isHelp ? "Demande d'aide 🙋" : "Nouvelle demande de binôme", lines, ctaLabel: "Répondre à la demande", ctaPath: `/Messages?chat=${r.from_uid}` }));
  await sendPush(r.to_uid, { title: isHelp ? "Demande d'aide 🙋" : "Nouvelle demande de binôme", body: subject, link: `/Messages?chat=${r.from_uid}`, tag: `request-${r.from_uid}` });
});

exports.onRequestAccepted = onDocumentUpdated("requests/{pairId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.status === "accepted" || after.status !== "accepted") return;
  const to = await recipientEmail(after.from_uid);
  await sendMail(to, `${after.to_name || "Ton binôme"} a accepté ta demande`,
    renderEmail({
      title: "Demande acceptée 🎉",
      lines: [`${after.to_name || "Ton binôme"} a accepté ta demande. Vous pouvez maintenant discuter et planifier une session.`],
      ctaLabel: "Ouvrir la conversation",
      ctaPath: `/Messages?chat=${after.to_uid}`,
    }));
  await sendPush(after.from_uid, { title: "Demande acceptée 🎉", body: `${after.to_name || "Ton binôme"} a accepté ta demande`, link: `/Messages?chat=${after.to_uid}`, tag: `request-${after.to_uid}` });
});

// ------------------------------------------------------------------ Messages

exports.onMessageCreated = onDocumentCreated("messages/{messageId}", async (event) => {
  const m = event.data?.data();
  if (!m) return;
  const now = Date.now();
  const senderName = await db.doc(`users/${m.senderUid}`).get().then((s) => s.get("display_name")).catch(() => null);

  for (const uid of m.unreadBy || []) {
    // Push à chaque message (regroupées par conversation sur l'appareil)
    await sendPush(uid, {
      title: senderName || "Nouveau message",
      body: m.text ? String(m.text).slice(0, 200) : (m.fileName ? `📎 ${m.fileName}` : ""),
      link: `/Messages?chat=${m.senderUid}`,
      tag: `chat-${m.chatId}`,
    });
    // Anti-spam : un e-mail au plus par conversation et par demi-heure
    const stateRef = db.doc(`users/${uid}/private/notif_state`);
    const shouldSend = await db.runTransaction(async (tx) => {
      const state = await tx.get(stateRef);
      const last = state.exists ? state.get(`lastMessageEmail.${m.chatId}`) : null;
      if (last && now - last.toMillis() < MESSAGE_EMAIL_COOLDOWN_MS) return false;
      tx.set(stateRef, { lastMessageEmail: { [m.chatId]: Timestamp.fromMillis(now) } }, { merge: true });
      return true;
    });
    if (!shouldSend) continue;
    const to = await recipientEmail(uid);
    const preview = m.text ? String(m.text).slice(0, 300) : (m.fileName ? `Fichier : ${m.fileName}` : "");
    await sendMail(to, `Nouveau message de ${senderName || "ton binôme"}`,
      renderEmail({
        title: `${senderName || "Ton binôme"} t'a écrit`,
        lines: preview ? [`« ${preview} »`] : [],
        ctaLabel: "Lire et répondre",
        ctaPath: `/Messages?chat=${m.senderUid}`,
      }));
  }
});

// Groupe supprimé : sa discussion et son tableau blanc partent avec lui
exports.onGroupDeleted = onDocumentDeleted("groups/{groupId}", async (event) => {
  await db.recursiveDelete(db.collection(`groups/${event.params.groupId}/messages`));
  await db.recursiveDelete(db.doc(`whiteboards/grp-${event.params.groupId}`));
});

// Discussion de groupe : notification push aux autres membres (pas d'e-mail)
// Nom affiché d'un étudiant, lu dans son profil : les noms recopiés dans les documents
// (senderName, organizer_name…) sont écrits par le client et pourraient être falsifiés.
async function displayNameOf(uid, fallback) {
  if (!uid) return fallback;
  const name = await db.doc(`users/${uid}`).get().then((s) => s.get("display_name")).catch(() => null);
  return (typeof name === "string" && name.trim()) ? name.trim().slice(0, 60) : fallback;
}

exports.onGroupMessageCreated = onDocumentCreated("groups/{groupId}/messages/{messageId}", async (event) => {
  const m = event.data?.data();
  if (!m) return;
  const group = await db.doc(`groups/${event.params.groupId}`).get();
  if (!group.exists) return;
  const senderName = await displayNameOf(m.senderUid, "Nouveau message");
  for (const uid of group.get("members") || []) {
    if (uid === m.senderUid) continue;
    await sendPush(uid, {
      title: `${group.get("name")} · ${senderName}`,
      body: String(m.text || "").slice(0, 200),
      link: `/Groups?id=${event.params.groupId}`,
      tag: `group-${event.params.groupId}`,
    });
  }
});

// ------------------------------------------------------------------ Sessions

// Lien d'appel d'une session en ligne : appel intégré, ou lien externe choisi (Zoom, Teams…)
// Les anciens liens meet.jit.si ne sont plus proposés (Jitsi exige désormais un « hôte » connecté).
function callLinkOf(s, sessionId) {
  if (s.meeting_url && !/^https:\/\/meet\.jit\.si\//.test(s.meeting_url)) return s.meeting_url;
  if (s.mode === "en_ligne") return `${APP_URL.value()}/Call?type=session&id=${encodeURIComponent(sessionId)}`;
  return null;
}

exports.onSessionCreated = onDocumentCreated("sessions/{sessionId}", async (event) => {
  const s = event.data?.data();
  if (!s || s.status !== "planned") return;
  const otherUid = (s.participants || []).find((p) => p !== s.organizer_uid);
  const to = await recipientEmail(otherUid);
  const organizer = await displayNameOf(s.organizer_uid, "Ton binôme");
  const lines = [`${organizer} a planifié « ${s.title} » avec toi.`, `Quand : ${formatStart(s.start_at) || `${s.date} ${s.time}`}`];
  if (s.mode === "presentiel" && s.location) lines.push(`Où : ${s.location}`);
  const link = callLinkOf(s, event.params.sessionId);
  if (link) lines.push(`Appel vidéo : ${link}`);
  await sendMail(to, `Nouvelle session : ${s.title}`,
    renderEmail({ title: "Nouvelle session de révision 📅", lines, ctaLabel: "Voir mes sessions", ctaPath: "/Sessions" }));
  await sendPush(otherUid, { title: "Nouvelle session 📅", body: `${s.title} — ${formatStart(s.start_at) || `${s.date} ${s.time}`}`, link: "/Sessions", tag: `session-${event.params.sessionId}` });
});

// Rappels : la veille (moins de 24 h avant) et 1 h avant. Index composite status + start_at
// déclaré dans firestore.indexes.json.
exports.sessionReminders = onSchedule({ schedule: "every 15 minutes", timeZone: "Europe/Paris" }, async () => {
  const now = Date.now();
  const snap = await db.collection("sessions")
    .where("status", "==", "planned")
    .where("start_at", ">", Timestamp.fromMillis(now))
    .where("start_at", "<=", Timestamp.fromMillis(now + 24 * 3600 * 1000))
    .get();

  for (const docSnap of snap.docs) {
    const s = docSnap.data();
    const minutesLeft = (s.start_at.toMillis() - now) / 60000;
    let kind = null;
    if (minutesLeft <= 60 && !s.reminder1h) kind = "1h";
    else if (minutesLeft > 60 && !s.reminder24h) kind = "24h";
    if (!kind) continue;

    await docSnap.ref.update(kind === "1h" ? { reminder1h: true, reminder24h: true } : { reminder24h: true });
    const lines = [`« ${s.title} » ${kind === "1h" ? "commence dans moins d'une heure" : "a lieu demain"} : ${formatStart(s.start_at)}.`];
    if (s.mode === "presentiel" && s.location) lines.push(`Où : ${s.location}`);
    const link = callLinkOf(s, docSnap.id);
    if (link) lines.push(`Appel vidéo : ${link}`);
    for (const uid of s.participants || []) {
      const to = await recipientEmail(uid);
      await sendMail(to, `Rappel : ${s.title} ${kind === "1h" ? "dans 1 heure" : "demain"}`,
        renderEmail({ title: "Rappel de session ⏰", lines, ctaLabel: "Voir la session", ctaPath: "/Sessions" }));
      await sendPush(uid, { title: `Rappel : ${s.title}`, body: kind === "1h" ? "Commence dans moins d'une heure" : `Demain, ${formatStart(s.start_at)}`, link: "/Sessions", tag: `session-${docSnap.id}` });
    }
  }
  logger.info(`Rappels vérifiés : ${snap.size} session(s) dans les 24 h`);
});

// ------------------------------------------------------------------ Envoi des e-mails

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST.value(),
      port: 587,
      secure: false, // STARTTLS
      auth: { user: SMTP_USER.value(), pass: SMTP_PASSWORD.value() },
    });
  }
  return transporter;
}

exports.deliverMail = onDocumentCreated({ document: "mail/{mailId}", secrets: [SMTP_PASSWORD] }, async (event) => {
  const ref = event.data?.ref;
  if (!ref) return;

  // Réserve l'e-mail (évite un double envoi si l'événement est livré deux fois)
  const mail = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists || snap.get("delivery.state")) return null;
    tx.update(ref, { "delivery.state": "PROCESSING", "delivery.startTime": FieldValue.serverTimestamp() });
    return snap.data();
  });
  if (!mail) return;

  // En local (émulateurs), aucun e-mail réel n'est envoyé
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    await ref.update({ "delivery.state": "SKIPPED_EMULATOR", "delivery.endTime": FieldValue.serverTimestamp() });
    return;
  }

  try {
    const info = await getTransporter().sendMail({
      from: MAIL_FROM.value(),
      to: mail.to,
      subject: mail.message?.subject,
      text: mail.message?.text,
      html: mail.message?.html,
    });
    await ref.update({
      "delivery.state": "SUCCESS",
      "delivery.messageId": info.messageId || null,
      "delivery.endTime": FieldValue.serverTimestamp(),
    });
  } catch (error) {
    logger.error("Envoi d'e-mail échoué", { mailId: ref.id, error: error.message });
    await ref.update({
      "delivery.state": "ERROR",
      "delivery.error": String(error.message).slice(0, 500),
      "delivery.endTime": FieldValue.serverTimestamp(),
    });
  }
});

// ------------------------------------------------------------------ Compteur public

// Nombre de profils complets : +1 quand un profil devient complet, -1 quand il est supprimé
// (ou redevient incomplet). Les règles interdisent aux clients d'écrire ce compteur.
exports.onProfileWrite = onDocumentWritten("users/{uid}", async (event) => {
  const before = event.data?.before.exists ? event.data.before.get("profile_complete") === true : false;
  const after = event.data?.after.exists ? event.data.after.get("profile_complete") === true : false;
  if (before === after) return;
  await db.doc("stats/public").set({ studentCount: FieldValue.increment(after ? 1 : -1) }, { merge: true });
});

// Aperçu anonymisé de profils pour l'accueil (stats/preview, lisible sans compte).
// Toutes les 6 heures : jusqu'à 6 profils tirés au hasard parmi les profils complets, visibles,
// non bannis, d'étudiants de 15 ans ou plus. Seuls le niveau, 3 matières au plus et le badge
// « vérifié » sont recopiés : jamais de nom, d'initiales, de photo, de ville, d'établissement
// ni de présentation. Moins de 3 profils éligibles : aperçu vide (rien n'est affiché).
const PREVIEW_SIZE = 6;
async function buildPublicPreview() {
  const snap = await db.collection("users").where("profile_complete", "==", true).get();
  const eligible = snap.docs.filter((d) => d.get("profile_visible") !== false && !d.get("banned"));
  // Tirage au hasard, puis vérification de l'âge (donnée privée) seulement pour les profils retenus
  for (let i = eligible.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [eligible[i], eligible[j]] = [eligible[j], eligible[i]]; }
  const profiles = [];
  for (const d of eligible) {
    if (profiles.length >= PREVIEW_SIZE) break;
    const priv = await db.doc(`users/${d.id}/private/settings`).get();
    if (priv.get("age_bracket") === "under15") continue;
    const subjects = (d.get("subjects") || [])
      .map((s) => (typeof s === "string" ? { name: s } : { name: s?.name, level: s?.level }))
      .filter((s) => typeof s.name === "string" && s.name.trim())
      .slice(0, 3)
      .map((s) => ({ name: s.name.trim().slice(0, 40), ...(typeof s.level === "string" ? { level: s.level } : {}) }));
    if (!subjects.length) continue;
    profiles.push({ level: typeof d.get("level") === "string" ? d.get("level").slice(0, 40) : "", subjects, verified: !!d.get("verified_domain") });
  }
  await db.doc("stats/preview").set({ profiles: profiles.length >= 3 ? profiles : [], updatedAt: FieldValue.serverTimestamp() });
  return profiles.length;
}
exports.refreshPublicPreview = onSchedule({ schedule: "every 6 hours", timeZone: "Europe/Paris" }, async () => {
  const n = await buildPublicPreview();
  logger.info("Aperçu public mis à jour", { profiles: n });
});

// Bannissement : la modération pose users/<uid>.banned ; le serveur tient en parallèle bans/<uid>,
// que l'utilisateur ne peut ni lire ni supprimer. Les règles s'appuient sur bans/ : supprimer puis
// recréer son profil ne lève plus le bannissement. Débannir (banned: false) retire l'entrée.
// Correction demandée par la modération (moderation/<uid>.fix_required = ["name", "photo", "bio"]) :
// la modération a noté la valeur fautive (fix_values). Dès que l'étudiant modifie un champ, il est
// retiré de la liste ; quand il n'en reste plus, l'accès au site revient (règles : mustFix) mais le
// profil reste masqué jusqu'à la validation par la modération (review_pending).
const FIX_FIELDS = { name: "display_name", photo: "photo_url", bio: "bio" };
exports.onProfileFixed = onDocumentWritten("users/{uid}", async (event) => {
  if (!event.data?.after.exists) return;
  const ref = db.doc(`moderation/${event.params.uid}`);
  const userRef = db.doc(`users/${event.params.uid}`);
  // Le profil est relu au moment du traitement (et non pris dans l'événement) : un ancien
  // événement traité en retard, après la demande de correction, faisait sinon croire à une
  // correction (ex. présentation vide enregistrée juste avant la demande).
  await db.runTransaction(async (tx) => {
    const [mod, userSnap] = await Promise.all([tx.get(ref), tx.get(userRef)]);
    const required = mod.exists ? mod.get("fix_required") || [] : [];
    if (!required.length || !userSnap.exists) return;
    const old = mod.get("fix_values") || {};
    const now = userSnap.data();
    const isFixed = (field) => {
      const value = String(now[FIX_FIELDS[field]] ?? "").trim();
      const before = String(old[field] ?? "").trim();
      // Nom : un autre nom, non vide. Photo et présentation : changées ou retirées.
      return field === "name" ? value !== "" && value !== before : value !== before;
    };
    const remaining = required.filter((f) => !isFixed(f));
    if (remaining.length === required.length) return;
    tx.set(ref, {
      fix_required: remaining,
      ...(remaining.length === 0 ? { review_pending: true, fixed_at: Date.now() } : {}),
    }, { merge: true });
  });
});

exports.onBanChanged = onDocumentWritten("users/{uid}", async (event) => {
  const before = event.data?.before.exists ? event.data.before.get("banned") === true : false;
  const afterExists = event.data?.after.exists;
  const after = afterExists ? event.data.after.get("banned") === true : false;
  const ref = db.doc(`bans/${event.params.uid}`);
  if (after && !before) await ref.set({ since: FieldValue.serverTimestamp() });
  // Profil supprimé : on garde l'entrée (sinon le banni recréerait un profil vierge)
  else if (before && !after && afterExists) await ref.delete();
});

// Changement de nom : les noms recopiés dans les demandes, sessions, groupes et blocages
// (affichés dans la messagerie, les notifications…) et le compte de connexion sont mis à jour.
exports.onDisplayNameChanged = onDocumentUpdated("users/{uid}", async (event) => {
  const before = (event.data.before.get("display_name") || "").trim();
  const name = (event.data.after.get("display_name") || "").trim();
  if (!name || name === before) return;
  const uid = event.params.uid;
  const writer = db.bulkWriter();
  const each = async (query, update) => (await query.get()).docs.forEach((d) => writer.update(d.ref, update(d)));
  await Promise.all([
    each(db.collection("requests").where("from_uid", "==", uid), () => ({ from_name: name })),
    each(db.collection("requests").where("to_uid", "==", uid), () => ({ to_name: name })),
    each(db.collection("sessions").where("participants", "array-contains", uid),
      (d) => (d.get("organizer_uid") === uid ? { organizer_name: name } : { buddy_name: name })),
    each(db.collection("groups").where("members", "array-contains", uid), () => ({ [`member_names.${uid}`]: name })),
    each(db.collection("blocks").where("blocked", "==", uid), () => ({ blocked_name: name })),
  ]);
  await writer.close();
  await getAuth().updateUser(uid, { displayName: name }).catch((e) => logger.warn("Nom du compte non mis à jour", { uid, error: e.message }));
});

// ------------------------------------------------------------------ Appels vidéo

// Donne l'accès à l'appel vidéo d'un binôme (type "pair", id = paire de uids), d'un groupe
// ou d'une session, après vérification que l'appelant en fait partie.
exports.createCallToken = onCall({ secrets: [DAILY_API_KEY] }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Connexion requise.");
  const { type, id } = request.data || {};
  if (!["pair", "group", "session"].includes(type) || typeof id !== "string" || !id || id.length > 200 || id.includes("/")) {
    throw new HttpsError("invalid-argument", "bad-request");
  }

  let title = "";
  if (type === "pair") {
    const req = await db.doc(`requests/${id}`).get();
    if (!req.exists || req.get("status") !== "accepted" || !(req.get("participants") || []).includes(uid)) throw new HttpsError("permission-denied", "not-allowed");
    title = req.get("from_uid") === uid ? req.get("to_name") : req.get("from_name");
  } else if (type === "group") {
    const group = await db.doc(`groups/${id}`).get();
    if (!group.exists || !(group.get("members") || []).includes(uid)) throw new HttpsError("permission-denied", "not-allowed");
    title = group.get("name");
  } else {
    const session = await db.doc(`sessions/${id}`).get();
    if (!session.exists || !(session.get("participants") || []).includes(uid) || session.get("status") !== "planned") throw new HttpsError("permission-denied", "not-allowed");
    title = session.get("title");
  }

  const apiKey = (DAILY_API_KEY.value() || "").trim();
  if (!apiKey) throw new HttpsError("failed-precondition", "calls-not-configured");
  const me = await db.doc(`users/${uid}`).get();
  try {
    const room = await calls.ensureRoom(apiKey, { type, id });
    const token = await calls.createToken(apiKey, { roomName: room.name, userName: me.get("display_name") });
    return { url: room.url, token, title: title || "" };
  } catch (error) {
    logger.error("Appel vidéo : erreur Daily", { type, error: error.message });
    throw new HttpsError("unavailable", "calls-unavailable");
  }
});

// ------------------------------------------------------------------ Modération

const DAY_MS = 24 * 3600 * 1000;

async function assertAdmin(request) {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Connexion requise.");
  if (!(await db.doc(`admins/${uid}`).get()).exists) throw new HttpsError("permission-denied", "Réservé à la modération.");
}

const countOf = async (query) => (await query.count().get()).data().count;

// Statistiques de la page Modération
exports.adminStats = onCall(async (request) => {
  await assertAdmin(request);
  const now = Date.now();
  const [students, buddies, pendingRequests, messages7d, upcomingSessions, completedSessions, pendingReports, ratings] = await Promise.all([
    countOf(db.collection("users").where("profile_complete", "==", true)),
    countOf(db.collection("requests").where("status", "==", "accepted")),
    countOf(db.collection("requests").where("status", "==", "pending")),
    countOf(db.collection("messages").where("createdAt", ">=", Timestamp.fromMillis(now - 7 * DAY_MS))),
    countOf(db.collection("sessions").where("status", "==", "planned").where("start_at", ">", Timestamp.fromMillis(now))),
    countOf(db.collection("sessions").where("status", "==", "completed")),
    countOf(db.collection("reports").where("status", "==", "pending")),
    db.collection("feedback").aggregate({ average: AggregateField.average("rating"), count: AggregateField.count() }).get(),
  ]);

  // Inscriptions par semaine (8 dernières semaines), d'après les comptes Authentication
  const WEEKS = 8;
  const firstWeekStart = now - WEEKS * 7 * DAY_MS;
  const weeks = Array.from({ length: WEEKS }, (_, i) => ({ start: new Date(firstWeekStart + i * 7 * DAY_MS).toISOString(), count: 0 }));
  let accounts = 0;
  const accountUids = new Set();
  let pageToken;
  do {
    const page = await getAuth().listUsers(1000, pageToken);
    for (const u of page.users) {
      accounts++;
      accountUids.add(u.uid);
      const index = Math.floor((Date.parse(u.metadata.creationTime) - firstWeekStart) / (7 * DAY_MS));
      if (index >= 0 && index < WEEKS) weeks[index].count++;
    }
    pageToken = page.pageToken;
  } while (pageToken);

  // Entonnoir : combien d'étudiants franchissent chaque étape (lecture des demandes et sessions ;
  // suffisant pour quelques milliers de documents)
  const [profileDocs, requestDocs, sessionDocs, verified, helpRequests] = await Promise.all([
    db.collection("users").where("profile_complete", "==", true).select().get(),
    db.collection("requests").select("from_uid", "participants", "status").get(),
    db.collection("sessions").select("participants").get(),
    countOf(db.collection("users").where("verified_domain", ">", "")),
    countOf(db.collection("requests").where("kind", "==", "help")),
  ]);
  const profiles = new Set(profileDocs.docs.map((d) => d.id));
  const involved = new Set();
  const matched = new Set();
  requestDocs.forEach((d) => {
    (d.get("participants") || []).forEach((u) => involved.add(u));
    if (d.get("status") === "accepted") (d.get("participants") || []).forEach((u) => matched.add(u));
  });
  const withSession = new Set();
  sessionDocs.forEach((d) => (d.get("participants") || []).forEach((u) => withSession.add(u)));
  // Chaque étape ne compte que les étudiants qui ont aussi franchi les précédentes
  let reached = accountUids;
  const funnel = [["accounts", accountUids], ["profiles", profiles], ["requested", involved], ["matched", matched], ["hadSession", withSession]]
    .map(([key, set], i) => {
      if (i > 0) reached = new Set([...reached].filter((u) => set.has(u)));
      return { key, count: reached.size };
    });

  return {
    accounts, students, buddies, pendingRequests, messages7d, upcomingSessions, completedSessions, pendingReports,
    verified, helpRequests, funnel,
    ratingAverage: ratings.data().average ?? null,
    ratingCount: ratings.data().count,
    weeks,
    generatedAt: new Date(now).toISOString(),
  };
});

// Chemin Storage d'une URL de téléchargement Firebase (…/o/<chemin encodé>?alt=media…)
function storagePathFromUrl(url) {
  const match = /\/o\/([^?]+)/.exec(String(url || ""));
  return match ? decodeURIComponent(match[1]) : null;
}

// Nettoyage des données de l'ancien format (identifiées par e-mail au lieu de l'uid), devenues
// invisibles : messages (et leurs fichiers), demandes, sessions, tableaux blancs. Retire aussi
// l'e-mail des profils qui ne se sont pas reconnectés depuis. dryRun (par défaut) : compte
// seulement, sans rien supprimer.
exports.adminCleanupLegacy = onCall({ timeoutSeconds: 540, memory: "512MiB" }, async (request) => {
  await assertAdmin(request);
  const dryRun = request.data?.dryRun !== false;
  const result = { dryRun, messages: 0, files: 0, requests: 0, sessions: 0, whiteboards: 0, profiles: 0 };
  const writer = dryRun ? null : db.bulkWriter();
  const bucket = dryRun ? null : getStorage().bucket();

  for (const d of (await db.collection("messages").get()).docs) {
    if (d.get("senderUid")) continue;
    result.messages++;
    const path = storagePathFromUrl(d.get("fileUrl"));
    if (path) {
      result.files++;
      if (!dryRun) await bucket.file(path).delete({ ignoreNotFound: true }).catch((e) => logger.warn("Fichier non supprimé", { path, error: e.message }));
    }
    if (!dryRun) writer.delete(d.ref);
  }
  for (const d of (await db.collection("requests").get()).docs) {
    if (d.get("from_uid")) continue;
    result.requests++;
    if (!dryRun) writer.delete(d.ref);
  }
  for (const d of (await db.collection("sessions").get()).docs) {
    if (d.get("organizer_uid")) continue;
    result.sessions++;
    if (!dryRun) writer.delete(d.ref);
  }
  for (const ref of await db.collection("whiteboards").listDocuments()) {
    if (!ref.id.includes("@")) continue;
    result.whiteboards++;
    if (!dryRun) await db.recursiveDelete(ref);
  }
  for (const d of (await db.collection("users").get()).docs) {
    if (d.get("email") === undefined) continue;
    result.profiles++;
    if (!dryRun) {
      writer.update(d.ref, {
        email: FieldValue.delete(),
        ...(d.get("profile_visible") === undefined ? { profile_visible: true } : {}),
      });
    }
  }

  if (!dryRun) {
    await writer.close();
    // Recompte le compteur public au passage
    const students = await countOf(db.collection("users").where("profile_complete", "==", true));
    await db.doc("stats/public").set({ studentCount: students }, { merge: true });
    logger.info("Nettoyage des anciennes données", result);
  }
  return result;
});

// ------------------------------------------------------------------ Vie privée

// Suppression d'un compte : la page Paramètres efface le profil, les messages, les demandes…
// puis appelle deleteMyData avant de supprimer le compte, pour effacer ce que le navigateur ne
// peut pas supprimer lui-même : données privées, fichiers, groupes, avis laissés.
// (Fonction appelable plutôt qu'un déclencheur de suppression de compte : ces déclencheurs
// n'existent qu'en 1re génération, qui ne prend pas en charge Node 24.)
async function cleanupUserData(uid) {
  await db.recursiveDelete(db.collection(`users/${uid}/private`));
  for (const d of (await db.collection("verified_emails").where("uid", "==", uid).get()).docs) await d.ref.delete();
  // Fichiers envoyés (pièces jointes, pages de PDF importées dans un tableau blanc, photos de profil)
  await getStorage().bucket().deleteFiles({ prefix: `chat_files/${uid}/` })
    .catch((e) => logger.warn("Fichiers non supprimés", { uid, error: e.message }));
  await getStorage().bucket().deleteFiles({ prefix: `avatars/${uid}/` })
    .catch((e) => logger.warn("Photos de profil non supprimées", { uid, error: e.message }));
  // Groupes : ceux qu'il a créés sont supprimés (avec leur discussion), il quitte les autres
  for (const g of (await db.collection("groups").where("members", "array-contains", uid).get()).docs) {
    if (g.get("owner_uid") === uid) await g.ref.delete(); // onGroupDeleted efface la suite
    else await g.ref.update({ members: FieldValue.arrayRemove(uid), [`member_names.${uid}`]: FieldValue.delete() });
  }
  const feedback = await db.collection("feedback").where("from_uid", "==", uid).get();
  const writer = db.bulkWriter();
  feedback.docs.forEach((d) => writer.delete(d.ref));
  await writer.close();
}

exports.deleteMyData = onCall({ timeoutSeconds: 300 }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Connexion requise.");
  await cleanupUserData(uid);
  return { ok: true };
});

// Purge : e-mails envoyés (30 jours), avis (1 an), signalements traités (1 an)
async function purgeOlderThan(collection, cutoffMs, keep = () => false) {
  const snap = await db.collection(collection).where("createdAt", "<", Timestamp.fromMillis(cutoffMs)).get();
  const writer = db.bulkWriter();
  let n = 0;
  snap.docs.forEach((d) => { if (!keep(d)) { writer.delete(d.ref); n++; } });
  await writer.close();
  return n;
}

// Comptes sans connexion depuis 3 ans : même effacement que « Supprimer mon compte »
// (messages et fichiers envoyés, demandes, profil, données privées, groupes, avis), puis
// suppression du compte.
async function deleteAccountData(uid) {
  const bucket = getStorage().bucket();
  const writer = db.bulkWriter();
  for (const d of (await db.collection("messages").where("senderUid", "==", uid).get()).docs) {
    const path = storagePathFromUrl(d.get("fileUrl"));
    if (path) await bucket.file(path).delete({ ignoreNotFound: true }).catch(() => {});
    writer.delete(d.ref);
  }
  for (const d of (await db.collection("requests").where("participants", "array-contains", uid).get()).docs) writer.delete(d.ref);
  await writer.close();
  await cleanupUserData(uid);
  await db.recursiveDelete(db.doc(`users/${uid}`));
  await getAuth().deleteUser(uid);
}

async function purgeInactiveAccounts(cutoffMs) {
  let n = 0;
  let pageToken;
  do {
    const page = await getAuth().listUsers(1000, pageToken);
    for (const u of page.users) {
      const last = Date.parse(u.metadata.lastSignInTime || u.metadata.creationTime);
      if (last < cutoffMs && !(await db.doc(`admins/${u.uid}`).get()).exists) {
        await deleteAccountData(u.uid).catch((e) => logger.error("Compte inactif non supprimé", { uid: u.uid, error: e.message }));
        n++;
      }
    }
    pageToken = page.pageToken;
  } while (pageToken);
  return n;
}

// Vérification étudiante commencée mais jamais validée : l'adresse est effacée après 1 jour
// (index de groupe de collections déclaré dans firestore.indexes.json)
async function purgeAbandonedVerifications(now) {
  const snap = await db.collectionGroup("private").where("expiresAt", "<", now - DAY_MS).get();
  const writer = db.bulkWriter();
  snap.docs.forEach((d) => { if (d.id === "verification") writer.delete(d.ref); });
  await writer.close();
  return snap.size;
}

async function runPurge(now = Date.now()) {
  return {
    mail: await purgeOlderThan("mail", now - 30 * DAY_MS),
    feedback: await purgeOlderThan("feedback", now - 365 * DAY_MS),
    reports: await purgeOlderThan("reports", now - 365 * DAY_MS, (d) => d.get("status") === "pending"),
    inactiveAccounts: await purgeInactiveAccounts(now - 3 * 365 * DAY_MS),
    abandonedVerifications: await purgeAbandonedVerifications(now),
  };
}

exports.dailyPurge = onSchedule({ schedule: "every day 04:00", timeZone: "Europe/Paris" }, async () => {
  logger.info("Purge quotidienne", await runPurge());
  // Comptes bannis avant l'ajout de bans/ (27/11/2026) : entrée créée une fois
  const banned = await db.collection("users").where("banned", "==", true).get();
  await Promise.all(banned.docs.map((d) => db.doc(`bans/${d.id}`).set({ since: FieldValue.serverTimestamp() }, { merge: true })));
});

// ------------------------------------------------------------------ Résumé hebdomadaire

// Chaque lundi : à chaque étudiant, les nouveaux inscrits de la semaine qui partagent une matière
// ou son école (hors binômes, demandes en cours et blocages). Désactivable dans Paramètres
// (weekly_digest = false) ou avec l'ensemble des e-mails (email_notifications = false).
const { computeMatch } = require("./matching");

async function runWeeklyDigest(now = Date.now()) {
  const cutoff = now - 7 * DAY_MS;
  const newUids = [];
  let pageToken;
  do {
    const page = await getAuth().listUsers(1000, pageToken);
    page.users.forEach((u) => { if (Date.parse(u.metadata.creationTime) >= cutoff) newUids.push(u.uid); });
    pageToken = page.pageToken;
  } while (pageToken);
  if (!newUids.length) return { sent: 0 };

  const newProfiles = (await db.getAll(...newUids.map((uid) => db.doc(`users/${uid}`))))
    .filter((d) => d.exists && d.get("profile_complete") === true && d.get("profile_visible") !== false && !d.get("banned"))
    .map((d) => ({ uid: d.id, ...d.data() }));
  if (!newProfiles.length) return { sent: 0 };

  let sent = 0;
  for (const userDoc of (await db.collection("users").where("profile_complete", "==", true).get()).docs) {
    const me = { uid: userDoc.id, ...userDoc.data() };
    if (me.banned) continue;
    let candidates = newProfiles
      .filter((p) => p.uid !== me.uid)
      .map((p) => ({ p, m: computeMatch(me, p) }))
      .filter(({ m }) => m.sharedSubjects.length > 0 || m.sameSchool);
    if (!candidates.length) continue;

    const settings = await db.doc(`users/${me.uid}/private/settings`).get();
    if (settings.exists && settings.get("weekly_digest") === false) continue;

    // Déjà en relation (demande ou binôme) ou bloqué dans un sens ou dans l'autre : exclu
    const related = new Set((await db.collection("requests").where("participants", "array-contains", me.uid).get())
      .docs.flatMap((d) => d.get("participants") || []));
    const blockRefs = candidates.flatMap(({ p }) => [db.doc(`blocks/${me.uid}_${p.uid}`), db.doc(`blocks/${p.uid}_${me.uid}`)]);
    const blocked = new Set((await db.getAll(...blockRefs)).filter((d) => d.exists).flatMap((d) => d.id.split("_")));
    candidates = candidates.filter(({ p }) => !related.has(p.uid) && !blocked.has(p.uid)).sort((a, b) => b.m.score - a.m.score);
    if (!candidates.length) continue;

    const to = await recipientEmail(me.uid);
    if (!to) continue;
    const n = candidates.length;
    const lines = [
      n === 1 ? "Un nouvel étudiant compatible avec toi s'est inscrit cette semaine :" : `${n} nouveaux étudiants compatibles avec toi se sont inscrits cette semaine :`,
      ...candidates.slice(0, 5).map(({ p, m }) => {
        const why = [...m.sharedSubjects.slice(0, 3), ...(m.sameSchool ? ["même école"] : [])].join(", ");
        return `• ${p.display_name || "Un étudiant"} — ${why}`;
      }),
    ];
    await sendMail(to, n === 1 ? "1 nouvel étudiant compatible cette semaine" : `${n} nouveaux étudiants compatibles cette semaine`,
      renderEmail({ title: "Les nouveaux de la semaine 👋", lines, ctaLabel: "Voir les profils", ctaPath: "/Search" }));
    sent++;
  }
  return { sent };
}

exports.weeklyDigest = onSchedule({ schedule: "every monday 09:00", timeZone: "Europe/Paris", timeoutSeconds: 540 }, async () => {
  logger.info("Résumé hebdomadaire", await runWeeklyDigest());
});

// ------------------------------------------------------------------ Étudiant vérifié

// Badge « étudiant vérifié » : l'étudiant reçoit un code à 6 chiffres sur une adresse de son
// établissement. Seul le domaine (ex. « viacesi.fr ») est enregistré dans son profil, jamais
// l'adresse ; une même adresse ne peut vérifier qu'un compte. Les messageries grand public
// (Gmail, Outlook…) sont refusées.
const FREE_MAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "outlook.fr", "hotmail.com", "hotmail.fr", "live.com", "live.fr",
  "msn.com", "yahoo.com", "yahoo.fr", "ymail.com", "icloud.com", "me.com", "mac.com", "aol.com", "aol.fr",
  "orange.fr", "wanadoo.fr", "free.fr", "sfr.fr", "neuf.fr", "laposte.net", "bbox.fr", "numericable.fr",
  "gmx.fr", "gmx.com", "gmx.de", "proton.me", "protonmail.com", "pm.me", "tutanota.com", "yandex.com",
  "yandex.ru", "mail.ru", "mail.com", "zoho.com", "hey.com", "fastmail.com", "qq.com", "163.com",
]);
const CODE_TTL_MS = 30 * 60 * 1000;
const MAX_CODES_PER_DAY = 5;
const MAX_ATTEMPTS = 5;
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

exports.requestStudentVerification = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Connexion requise.");
  const email = String(request.data?.email || "").trim().toLowerCase();
  const match = /^[^\s@]+@([a-z0-9.-]+\.[a-z]{2,})$/.exec(email);
  if (!match) throw new HttpsError("invalid-argument", "invalid-email");
  const domain = match[1];
  if (FREE_MAIL_DOMAINS.has(domain)) throw new HttpsError("invalid-argument", "personal-email");
  const owner = await db.doc(`verified_emails/${sha256(email)}`).get();
  if (owner.exists && owner.get("uid") !== uid) throw new HttpsError("already-exists", "email-used");

  const ref = db.doc(`users/${uid}/private/verification`);
  const now = Date.now();
  const code = String(crypto.randomInt(100000, 1000000));
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const sends = (snap.exists ? snap.get("sends") || [] : []).filter((ms) => ms > now - DAY_MS);
    if (sends.length >= MAX_CODES_PER_DAY) throw new HttpsError("resource-exhausted", "too-many-codes");
    tx.set(ref, {
      email, domain, codeHash: sha256(`${uid}:${code}`), expiresAt: now + CODE_TTL_MS, attempts: 0, sends: [...sends, now],
    });
  });
  await sendMail(email, `Ton code BuddyEtude : ${code}`, renderEmail({
    title: "Vérifie ton statut d'étudiant",
    lines: [`Ton code de vérification : ${code}`, "Il est valable 30 minutes. Si tu n'as rien demandé, ignore cet e-mail."],
    ctaLabel: "Revenir sur BuddyEtude",
    ctaPath: "/Settings",
  }));
  return { domain };
});

exports.confirmStudentVerification = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Connexion requise.");
  const code = String(request.data?.code || "").trim();
  const ref = db.doc(`users/${uid}/private/verification`);
  const snap = await ref.get();
  if (!snap.exists || !snap.get("codeHash")) throw new HttpsError("failed-precondition", "no-code");
  if (Date.now() > snap.get("expiresAt")) throw new HttpsError("deadline-exceeded", "expired");
  if ((snap.get("attempts") || 0) >= MAX_ATTEMPTS) throw new HttpsError("resource-exhausted", "too-many-attempts");
  if (sha256(`${uid}:${code}`) !== snap.get("codeHash")) {
    await ref.update({ attempts: FieldValue.increment(1) });
    throw new HttpsError("invalid-argument", "wrong-code");
  }
  const { email, domain } = snap.data();
  const emailRef = db.doc(`verified_emails/${sha256(email)}`);
  await db.runTransaction(async (tx) => {
    const owner = await tx.get(emailRef);
    if (owner.exists && owner.get("uid") !== uid) throw new HttpsError("already-exists", "email-used");
    tx.set(emailRef, { uid, verifiedAt: FieldValue.serverTimestamp() });
    tx.set(db.doc(`users/${uid}`), { verified_domain: domain, verified_at: FieldValue.serverTimestamp() }, { merge: true });
    // L'adresse n'est pas conservée : seul le domaine reste dans le profil
    tx.set(ref, { verifiedDomain: domain, verifiedAt: FieldValue.serverTimestamp() });
  });
  return { domain };
});

exports.removeStudentVerification = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Connexion requise.");
  const owned = await db.collection("verified_emails").where("uid", "==", uid).get();
  const batch = db.batch();
  owned.docs.forEach((d) => batch.delete(d.ref));
  batch.set(db.doc(`users/${uid}`), { verified_domain: FieldValue.delete(), verified_at: FieldValue.delete() }, { merge: true });
  batch.delete(db.doc(`users/${uid}/private/verification`));
  await batch.commit();
  return { ok: true };
});
