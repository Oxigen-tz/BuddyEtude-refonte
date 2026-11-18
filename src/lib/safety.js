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
