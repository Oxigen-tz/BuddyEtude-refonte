import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Version allégée des animations de l'accueil : animations réduites demandées par l'appareil,
// petit écran, ou écran tactile sans souris (téléphones, tablettes).
// Sur ces appareils, les effets liés au défilement (3D, sections collantes, galerie horizontale,
// parallaxe) saturaient le processeur graphique : la page ne se redessinait plus en défilant.
const QUERY = "(max-width: 767px), (hover: none) and (pointer: coarse)";

export function useLiteMotion() {
  const reduce = useReducedMotion();
  const [lite, setLite] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return;
    const onChange = () => setLite(media.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);
  return reduce || lite;
}

// Même règle, lue une fois au chargement (pour les animations définies hors composant)
export const isLiteDevice = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
