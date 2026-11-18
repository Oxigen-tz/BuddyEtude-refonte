// Thème de l'application : "light", "dark" ou "system" (suit le réglage de l'ordinateur).
// Le choix est gardé dans localStorage("theme") ; absent = "system".
const KEY = "theme";
const media = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null);

export function getThemePreference() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === "dark" || saved === "light" ? saved : "system";
  } catch {
    return "system";
  }
}

function paint(pref) {
  const dark = pref === "dark" || (pref === "system" && media()?.matches);
  document.documentElement.classList.toggle("dark", Boolean(dark));
}

export function setThemePreference(pref) {
  try {
    if (pref === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch { /* stockage indisponible : le thème s'applique quand même pour cette visite */ }
  paint(pref);
}

// À appeler une fois au démarrage : applique le thème et suit les changements de l'ordinateur
export function initTheme() {
  paint(getThemePreference());
  const m = media();
  const onChange = () => { if (getThemePreference() === "system") paint("system"); };
  m?.addEventListener?.("change", onChange);
  return () => m?.removeEventListener?.("change", onChange);
}
