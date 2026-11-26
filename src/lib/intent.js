// Intention choisie sur l'accueil (« Tu cherches quoi ? ») avant l'inscription.
// Gardée le temps de la session, puis lue une seule fois par Layout.jsx quand le profil est complet,
// pour amener l'étudiant directement au bon endroit.
const KEY = "be_intent";

export const INTENT_TARGETS = {
  duo: "/Search",
  help: "/Search?mode=help",
  group: "/Groups",
};

export function saveIntent(id) {
  try { if (INTENT_TARGETS[id]) sessionStorage.setItem(KEY, id); } catch { /* stockage indisponible : sans effet */ }
}

export function takeIntentTarget() {
  try {
    const id = sessionStorage.getItem(KEY);
    if (!id) return null;
    sessionStorage.removeItem(KEY);
    return INTENT_TARGETS[id] || null;
  } catch {
    return null;
  }
}
