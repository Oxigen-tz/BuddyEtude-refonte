import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SITE, PUBLIC_PAGES } from "@/seo/site";

// Met à jour, à chaque changement de page ou de langue : <title>, description, adresse
// canonique, balises de partage (Open Graph) et consigne d'indexation (robots).
// Les pages publiques sont aussi pré-remplies à la compilation (voir vite.config.js).

const setMeta = (selector, attr, key, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};
const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

// Liens hreflang : seulement sur l'accueil (seule page traduite à une adresse distincte).
// Retirés en quittant l'accueil, pour ne pas laisser ceux de l'accueil sur /About, /Legal…
const HREFLANG = [["fr", "/"], ["en", "/?lang=en"], ["x-default", "/"]];
const setHreflang = (on) => {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  if (!on) return;
  for (const [lng, path] of HREFLANG) {
    const el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", lng);
    el.setAttribute("href", SITE.url + path);
    document.head.appendChild(el);
  }
};

// "/about" ou "/Home" → clé de PUBLIC_PAGES ("/About", "/")
const publicKey = (pathname) => {
  if (pathname === "/" || pathname.toLowerCase() === "/home") return "/";
  return Object.keys(PUBLIC_PAGES).find((k) => k.toLowerCase() === pathname.toLowerCase().replace(/\/$/, ""));
};

export default function SeoManager() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "fr";

  // Accueil : l'adresse suit la langue affichée (/ en français, /?lang=en en anglais), pour que
  // la canonique, qui se réfère à l'adresse, corresponde toujours au contenu.
  useEffect(() => {
    if (publicKey(pathname) !== "/") return;
    const params = new URLSearchParams(search);
    const urlLang = params.get("lang") === "en" ? "en" : "fr";
    if (urlLang === lang && (lang === "en" || !params.has("lang"))) return;
    if (lang === "en") params.set("lang", "en"); else params.delete("lang");
    const q = params.toString();
    navigate({ pathname, search: q ? `?${q}` : "", hash }, { replace: true });
  }, [pathname, search, hash, lang, navigate]);

  useEffect(() => {
    const key = publicKey(pathname);
    if (key) {
      const meta = PUBLIC_PAGES[key][lang];
      // Canonique auto-référente : / → /, /?lang=en → /?lang=en (jamais /?lang=en depuis /)
      const enUrl = new URLSearchParams(search).get("lang") === "en";
      const url = SITE.url + (key === "/" ? (enUrl ? "/?lang=en" : "/") : key);
      document.title = meta.title;
      setMeta('meta[name="description"]', "name", "description", meta.description);
      setMeta('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large");
      setMeta('meta[property="og:title"]', "property", "og:title", meta.title);
      setMeta('meta[property="og:description"]', "property", "og:description", meta.description);
      setMeta('meta[property="og:url"]', "property", "og:url", url);
      setMeta('meta[property="og:locale"]', "property", "og:locale", lang === "en" ? "en_GB" : "fr_FR");
      setMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.description);
      setCanonical(url);
      setHreflang(key === "/");
    } else {
      setHreflang(false);
      // Espace connecté, page introuvable : pas d'indexation
      document.title = SITE.name;
      setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
      setCanonical(SITE.url + "/");
    }
  }, [pathname, search, lang]);

  return null;
}
