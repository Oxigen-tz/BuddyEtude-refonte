// Référencement à la compilation (vite build) :
//  - données structurées (JSON-LD) dans index.html ; liens hreflang sur l'accueil seulement ;
//  - une page HTML pré-remplie par page publique (dist/About/index.html…) : titre, description,
//    adresse canonique et texte lisibles sans JavaScript (moteurs, aperçus de liens) ;
//  - dist/sitemap.xml.
// Les textes viennent de src/seo/site.js. Le contenu pré-rempli est remplacé par l'application
// dès que le JavaScript est chargé.
import fs from "node:fs";
import path from "node:path";
import { SITE, PUBLIC_PAGES, FAQ, baseJsonLd, faqJsonLd, subjectJsonLd } from "../src/seo/site.js";
import { SUBJECTS, SUBJECTS_HUB, subjectPath } from "../src/seo/subjects.js";

// Versions linguistiques de l'accueil, seule page traduite à une adresse distincte (/?lang=en)
const HREFLANG = [["fr", "/"], ["en", "/?lang=en"], ["x-default", "/"]];
const hreflangLinks = () => HREFLANG.map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="${SITE.url}${p}" />`).join("\n    ");
const hreflangSitemap = () => HREFLANG.map(([l, p]) => `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE.url}${p}"/>`).join("");

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
  <a href="/reviser" style="color:inherit">Réviser par matière</a>
  <a href="/Etablissements" style="color:inherit">Pour les établissements</a>
  <a href="/Legal" style="color:inherit">Mentions légales et CGU</a><a href="/Privacy" style="color:inherit">Confidentialité</a></nav>`;

// Pages matières : tout le texte de la page, lisible sans JavaScript
const LIGHT = "min-height:100vh;font-family:'Plus Jakarta Sans',system-ui,sans-serif;padding:96px 24px 64px;color:#17172A";
const subjectLinks = (exclude) => `<ul>${SUBJECTS.filter((x) => x.slug !== exclude).map((x) => `<li><a href="${subjectPath(x.slug)}" style="color:#6438F5">${esc(x.h1)}</a></li>`).join("")}</ul>`;
function subjectBody(slug) {
  const x = SUBJECTS.find((y) => y.slug === slug);
  return `<main style="${LIGHT}"><article style="max-width:760px;margin:0 auto">
  <p><a href="/" style="color:#6438F5;font-weight:700;text-decoration:none">BuddyEtude</a> › <a href="/reviser" style="color:#6438F5">Réviser par matière</a> › ${esc(x.name)}</p>
  <h1 style="font-size:40px;margin:12px 0 16px">${esc(x.h1)}</h1>
  <p style="font-size:18px;color:#444">${esc(x.intro)}</p>
  <p><a href="${x.term ? `/Search?subject=${encodeURIComponent(x.term)}` : "/Search"}" style="display:inline-block;background:#6438F5;color:#fff;padding:12px 22px;border-radius:12px;font-weight:700;text-decoration:none">Trouver mon binôme gratuitement</a></p>
  <h2 style="font-size:26px;margin:48px 0 12px">3 méthodes pour réviser à deux</h2>
  ${x.methods.map(([t, d]) => `<h3 style="font-size:18px;margin:20px 0 6px">${esc(t)}</h3><p style="color:#444;margin:0">${esc(d)}</p>`).join("\n  ")}
  <p style="margin-top:24px;color:#444">${esc(x.tools)}</p>
  <h2 style="font-size:26px;margin:48px 0 12px">Questions fréquentes</h2>
  ${x.faq.map(([q, a]) => `<h3 style="font-size:18px;margin:20px 0 6px">${esc(q)}</h3><p style="color:#444;margin:0">${esc(a)}</p>`).join("\n  ")}
  <h2 style="font-size:22px;margin:48px 0 12px">Les autres matières</h2>
  ${subjectLinks(slug)}
  ${nav}
</article></main>`;
}
function hubBody() {
  return `<main style="${LIGHT}"><div style="max-width:760px;margin:0 auto">
  <p><a href="/" style="color:#6438F5;font-weight:700;text-decoration:none">BuddyEtude</a> › Réviser par matière</p>
  <h1 style="font-size:40px;margin:12px 0 16px">${esc(SUBJECTS_HUB.h1)}</h1>
  <p style="font-size:18px;color:#444">${esc(SUBJECTS_HUB.intro)}</p>
  ${subjectLinks()}
  ${nav}
</div></main>`;
}

function bodyFor(route) {
  const fr = PUBLIC_PAGES[route].fr;
  if (PUBLIC_PAGES[route].subject) return subjectBody(PUBLIC_PAGES[route].subject);
  if (PUBLIC_PAGES[route].subjectHub) return hubBody();
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
  if (route === "/") html = html.replace("</head>", `    ${hreflangLinks()}\n    ${jsonLd(faqJsonLd("fr"))}\n  </head>`);
  const slug = PUBLIC_PAGES[route].subject;
  if (slug) html = html.replace("</head>", `    ${subjectJsonLd(slug).map(jsonLd).join("\n    ")}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${bodyFor(route)}</div>`);
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const entry = (loc, p, alt = "") =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>${alt}\n  </url>`;
  // L'accueil et sa version anglaise sont listés tous les deux, avec les mêmes liens réciproques
  const urls = Object.entries(PUBLIC_PAGES).flatMap(([route, p]) => route === "/"
    ? [entry(`${SITE.url}/`, p, hreflangSitemap()), entry(`${SITE.url}/?lang=en`, p, hreflangSitemap())]
    : [entry(SITE.url + route, p)]);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

export default function seoPlugin() {
  let outDir = "dist";
  return {
    name: "buddyetude-seo",
    configResolved(config) { outDir = path.resolve(config.root, config.build.outDir); },
    // Dev et build : données structurées dans <head>. Les hreflang ne vont que sur l'accueil
    // (pageHtml) : avant, /About, /Legal… portaient ceux de l'accueil.
    transformIndexHtml(html) {
      const head = baseJsonLd().map(jsonLd).join("\n    ");
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
