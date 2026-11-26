// Chargement différé de Firebase pour les pages publiques (accueil, matières, à propos…).
// Firebase pèse ~130 Ko compressés : le visiteur anonyme ne l'attend plus pour voir la page.
// Les pages de l'application continuent d'importer ./config directement (même module).

let promise = null;

// Robots des moteurs de recherche et des aperçus de liens. Sur les pages publiques, ils n'ont
// besoin ni de la connexion ni du compteur : Firebase n'est pas chargé pour eux. Sinon, App Check
// (reCAPTCHA) échouait dans le rendu de Googlebot et laissait une erreur dans la console.
export const isBot = () => typeof navigator !== "undefined"
  && /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|whatsapp|discordbot|twitterbot|telegrambot|embedly|quora|pinterest|vkshare|applebot|yandex|duckduck|baidu|google-inspectiontool/i.test(navigator.userAgent);

export function loadFirebase() {
  if (!promise) {
    promise = Promise.all([
      import("./config"),
      import("firebase/auth"),
      import("firebase/firestore"),
      import("./services"),
    ]).then(([config, authSdk, firestore, services]) => ({
      auth: config.auth, db: config.db, authSdk, firestore, services,
    })).catch((error) => {
      promise = null; // on pourra réessayer
      throw error;
    });
  }
  return promise;
}

// Exécute fn quand la page est chargée et que le navigateur est au repos (au plus tard ~3 s après).
// Renvoie une fonction d'annulation.
export function whenIdle(fn, timeout = 3000) {
  let cancelled = false;
  let idleId = null;
  let timer = null;
  const run = () => {
    if (cancelled) return;
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(() => !cancelled && fn(), { timeout });
    else timer = setTimeout(() => !cancelled && fn(), 1200);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idleId !== null) window.cancelIdleCallback?.(idleId);
    if (timer) clearTimeout(timer);
  };
}

// Indice « connecté lors de la dernière visite » : permet de charger Firebase tout de suite pour
// les utilisateurs connectés (sans attendre le repos du navigateur). Ne contient aucune donnée.
const HINT = "be_session";
export const hasSessionHint = () => { try { return localStorage.getItem(HINT) === "1"; } catch { return false; } };
export const setSessionHint = (on) => { try { if (on) localStorage.setItem(HINT, "1"); else localStorage.removeItem(HINT); } catch { /* stockage indisponible */ } };
