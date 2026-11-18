// Référencement à la compilation (vite build) :
//  - données structurées (JSON-LD) et liens hreflang dans index.html ;
//  - une page HTML pré-remplie par page publique (dist/About/index.html…) : titre, description,
//    adresse canonique et texte lisibles sans JavaScript (moteurs, aperçus de liens) ;
//  - dist/sitemap.xml.
// Les textes viennent de src/seo/site.js. Le contenu pré-rempli est remplacé par l'application
// dès que le JavaScript est chargé.
import fs from "node:fs";
import path from "node:path";
import { SITE, PUBLIC_PAGES, FAQ, baseJsonLd, faqJsonLd } from "../src/seo/site.js";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const FEATURES = [
  ["Binômes compatibles", "La recherche classe les étudiants selon vos matières en commun, votre niveau dans chacune, votre établissement, votre ville et vos disponibilités."],
  ["Messagerie", "Discutez et échangez vos fiches de cours dès que la demande est acceptée."],
  ["Sessions en visio", "Planifiez vos révisions avec un lien d'appel vidéo, des rappels et l'ajout à votre agenda."],
  ["Tableau blanc partagé", "Dessinez, écrivez et annotez vos cours en PDF à plusieurs, en temps réel."],
  ["Mentorat", "Bloqué dans une matière ? Trouvez un étudiant de niveau avancé qui accepte d'aider."],
  ["Groupes de révision", "Révisez jusqu'à six, avec une discussion et un tableau blanc communs."],
];

const nav = `<nav style="margin-top:40px;display:flex;flex-wrap:wrap;gap:16px;font-size:14px">
  <a href="/" style="color:inherit">Accueil</a><a href="/About" style="color:inherit">À propos</a>
  <a href="/Legal" style="color:inherit">Mentions légales et CGU</a><a href="/Privacy" style="color:inherit">Confidentialité</a></nav>`;

function bodyFor(route) {
  const fr = PUBLIC_PAGES[route].fr;
  if (route === "/") {
    return `<main style="min-height:100vh;background:#090A13;color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif;padding:96px 24px 64px"><div style="max-width:880px;margin:0 auto">
  <p style="color:#BBACFF;font-weight:700">BuddyEtude</p>
  <h1 style="font-size:48px;line-height:1.05;margin:12px 0 20px">Trouve ton binôme d'études et révise à deux</h1>
  <p style="font-size:18px;color:rgba(255,255,255,.75);max-width:640px">${esc(fr.description)}</p>
  <p style="margin-top:28px"><a href="/Dashboard" style="display:inline-block;background:#6438F5;color:#fff;padding:12px 22px;border-radius:12px;font-weight:700;text-decoration:none">Créer mon profil gratuitement</a></p>
  <h2 style="font-size:28px;margin:64px 0 16px">Tout pour réviser à deux</h2>
  <ul style="padding:0;list-style:none;display:grid;gap:14px">${FEATURES.map(([t, d]) => `<li><strong>${esc(t)}</strong> : ${esc(d)}</li>`).join("")}</ul>
  <h2 style="font-size:28px;margin:64px 0 16px">Questions fréquentes</h2>
  ${FAQ.fr.map(({ q, a }) => `<h3 style="font-size:18px;margin:20px 0 6px">${esc(q)}</h3><p style="color:rgba(255,255,255,.75);margin:0">${esc(a)}</p>`).join("\n  ")}
  ${nav}
</div></main>`;
  }
  return `<main style="min-height:100vh;font-family:'Plus Jakarta Sans',system-ui,sans-serif;padding:96px 24px 64px;color:#17172A"><div style="max-width:760px;margin:0 auto">
  <p><a href="/" style="color:#6438F5;font-weight:700;text-decoration:none">BuddyEtude</a></p>
  <h1 style="font-size:36px;margin:12px 0 16px">${esc(fr.title.replace(/ · BuddyEtude$/, ""))}</h1>
  <p style="font-size:17px;color:#555">${esc(fr.description)}</p>
  ${nav}
</div></main>`;
}

// Remplace le contenu d'une balise <meta> ou <link> repérée par son attribut
const setAttr = (html, selectorRe, attr, value) => html.replace(selectorRe, (tag) => tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${esc(value)}"`));

function pageHtml(template, route) {
  const { title, description } = PUBLIC_PAGES[route].fr;
  const url = SITE.url + (route === "/" ? "/" : route);
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setAttr(html, /<meta name="description"[^>]*>/, "content", description);
  html = setAttr(html, /<meta property="og:title"[^>]*>/, "content", title);
  html = setAttr(html, /<meta property="og:description"[^>]*>/, "content", description);
  html = setAttr(html, /<meta property="og:url"[^>]*>/, "content", url);
  html = setAttr(html, /<meta name="twitter:title"[^>]*>/, "content", title);
  html = setAttr(html, /<meta name="twitter:description"[^>]*>/, "content", description);
  html = setAttr(html, /<link rel="canonical"[^>]*>/, "href", url);
  if (route === "/") html = html.replace("</head>", `    ${jsonLd(faqJsonLd("fr"))}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${bodyFor(route)}</div>`);
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = Object.entries(PUBLIC_PAGES).map(([route, p]) => {
    const loc = SITE.url + (route === "/" ? "/" : route);
    const alt = route === "/"
      ? `\n    <xhtml:link rel="alternate" hreflang="fr" href="${SITE.url}/"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE.url}/?lang=en"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}/"/>`
      : "";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>${alt}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

export default function seoPlugin() {
  let outDir = "dist";
  return {
    name: "buddyetude-seo",
    configResolved(config) { outDir = path.resolve(config.root, config.build.outDir); },
    // Dev et build : données structurées + versions linguistiques dans <head>
    transformIndexHtml(html) {
      const head = [
        `<link rel="alternate" hreflang="fr" href="${SITE.url}/" />`,
        `<link rel="alternate" hreflang="en" href="${SITE.url}/?lang=en" />`,
        `<link rel="alternate" hreflang="x-default" href="${SITE.url}/" />`,
        ...baseJsonLd().map(jsonLd),
      ].join("\n    ");
      return html.replace("</head>", `    ${head}\n  </head>`);
    },
    // Build : pages pré-remplies et sitemap
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const template = fs.readFileSync(indexPath, "utf8");
      for (const route of Object.keys(PUBLIC_PAGES)) {
        const file = route === "/" ? indexPath : path.join(outDir, route.slice(1), "index.html");
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, pageHtml(template, route));
      }
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap());
    },
  };
}
