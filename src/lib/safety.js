// Garde-fous contre les abus, côté interface (les limites réelles sont appliquées côté serveur,
// voir functions/index.js : onRequestCreated).

// Demandes de binôme ou d'aide envoyées par jour (mêmes valeurs que REQUESTS_PER_DAY côté serveur)
export const REQUESTS_PER_DAY = 15;

const PHONE = /(?:\+|00)\d[\d\s.-]{7,}\d|\b0[1-9](?:[\s.-]?\d{2}){4}\b/;
const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
const LINK = /(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|fr|net|org|io|gg|me|ly|co|app|link)\b/i;
const SOCIAL = /\b(?:snap(?:chat)?|insta(?:gram)?|whats ?app|telegram|discord)\b/i;

// Coordonnées ou lien dans un message à un inconnu : on prévient avant l'envoi (sans bloquer)
export function detectContactInfo(text) {
  const value = String(text || "");
  return PHONE.test(value) || EMAIL.test(value) || LINK.test(value) || SOCIAL.test(value);
}

// Messageries grand public : une adresse d'établissement est requise pour le badge « étudiant
// vérifié » (liste complète côté serveur : FREE_MAIL_DOMAINS dans functions/index.js)
const PERSONAL_DOMAINS = /@(gmail|googlemail|outlook|hotmail|live|msn|yahoo|ymail|icloud|me|mac|aol|orange|wanadoo|free|sfr|neuf|laposte|bbox|gmx|proton|protonmail|pm|tutanota|yandex|mail|zoho|hey|fastmail)\.[a-z.]+$/i;
export const isSchoolLikeEmail = (email) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email || "") && !PERSONAL_DOMAINS.test(email);
