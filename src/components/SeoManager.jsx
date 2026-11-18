import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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

// "/about" ou "/Home" → clé de PUBLIC_PAGES ("/About", "/")
const publicKey = (pathname) => {
  if (pathname === "/" || pathname.toLowerCase() === "/home") return "/";
  return Object.keys(PUBLIC_PAGES).find((k) => k.toLowerCase() === pathname.toLowerCase().replace(/\/$/, ""));
};

export default function SeoManager() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "fr";

  useEffect(() => {
    const key = publicKey(pathname);
    if (key) {
      const meta = PUBLIC_PAGES[key][lang];
      const url = SITE.url + (key === "/" ? (lang === "en" ? "/?lang=en" : "/") : key);
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
    } else {
      // Espace connecté, page introuvable : pas d'indexation
      document.title = SITE.name;
      setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
      setCanonical(SITE.url + "/");
    }
  }, [pathname, lang]);

  return null;
}
