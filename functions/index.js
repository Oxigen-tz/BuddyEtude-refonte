// Cloud Functions de BuddyEtude
//
//  - E-mails : nouvelle demande, demande acceptée, nouveau message, nouvelle session.
//  - Rappels de session : 24 h et 1 h avant (tâche planifiée toutes les 15 minutes).
//  - Compteur public d'étudiants (stats/public), affiché sur l'accueil.
//
// Les e-mails passent par une file : chaque e-mail est d'abord écrit dans la collection "mail",
// puis la fonction deliverMail l'envoie via le serveur SMTP (Brevo) et note le résultat dans
// le champ "delivery" (SUCCESS / ERROR). Configuration au déploiement :
//   - SMTP_USER (paramètre) : identifiant SMTP, ex. xxxx@smtp-brevo.com
//   - SMTP_PASSWORD (secret) : firebase functions:secrets:set SMTP_PASSWORD
//
// Chaque utilisateur peut couper ces e-mails dans Paramètres → Préférences
// (users/<uid>/private/settings.email_notifications = false).

const { onDocumentCreated, onDocumentUpdated, onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineString, defineSecret } = require("firebase-functions/params");
const nodemailer = require("nodemailer");
const logger = require("firebase-functions/logger");
// Imports modulaires : avec firebase-admin 12, admin.firestore.FieldValue / Timestamp ne sont
// pas définis dans l'environnement d'exécution des fonctions (toutes les fonctions plantaient).
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

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

const formatStart = (ts) => ts?.toDate?.().toLocaleString("fr-FR", {
  timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
}) || "";

// ------------------------------------------------------------------ Demandes de binôme

exports.onRequestCreated = onDocumentCreated("requests/{pairId}", async (event) => {
  const r = event.data?.data();
  if (!r || r.status !== "pending") return;
  const to = await recipientEmail(r.to_uid);
  const lines = [`${r.from_name || "Un étudiant"} souhaite réviser avec toi sur BuddyEtude.`];
  if (r.message) lines.push(`Son message : « ${String(r.message).slice(0, 500)} »`);
  await sendMail(to, `${r.from_name || "Un étudiant"} veut réviser avec toi`,
    renderEmail({ title: "Nouvelle demande de binôme", lines, ctaLabel: "Répondre à la demande", ctaPath: `/Messages?chat=${r.from_uid}` }));
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
});

// ------------------------------------------------------------------ Messages

exports.onMessageCreated = onDocumentCreated("messages/{messageId}", async (event) => {
  const m = event.data?.data();
  if (!m) return;
  const now = Date.now();
  const senderName = await db.doc(`users/${m.senderUid}`).get().then((s) => s.get("display_name")).catch(() => null);

  for (const uid of m.unreadBy || []) {
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

// ------------------------------------------------------------------ Sessions

exports.onSessionCreated = onDocumentCreated("sessions/{sessionId}", async (event) => {
  const s = event.data?.data();
  if (!s || s.status !== "planned") return;
  const otherUid = (s.participants || []).find((p) => p !== s.organizer_uid);
  const to = await recipientEmail(otherUid);
  const lines = [`${s.organizer_name || "Ton binôme"} a planifié « ${s.title} » avec toi.`, `Quand : ${formatStart(s.start_at) || `${s.date} ${s.time}`}`];
  if (s.mode === "presentiel" && s.location) lines.push(`Où : ${s.location}`);
  if (s.meeting_url) lines.push(`Lien d'appel : ${s.meeting_url}`);
  await sendMail(to, `Nouvelle session : ${s.title}`,
    renderEmail({ title: "Nouvelle session de révision 📅", lines, ctaLabel: "Voir mes sessions", ctaPath: "/Sessions" }));
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
    if (s.meeting_url) lines.push(`Lien d'appel : ${s.meeting_url}`);
    for (const uid of s.participants || []) {
      const to = await recipientEmail(uid);
      await sendMail(to, `Rappel : ${s.title} ${kind === "1h" ? "dans 1 heure" : "demain"}`,
        renderEmail({ title: "Rappel de session ⏰", lines, ctaLabel: "Voir la session", ctaPath: "/Sessions" }));
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
