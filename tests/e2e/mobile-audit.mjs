// Audit d'affichage mobile : passe sur une page et relève les défauts qui ne font pas échouer
// un scénario fonctionnel mais rendent le site inutilisable sur téléphone.
//  - débordement horizontal (la page « glisse » de côté) ;
//  - contenu resté invisible après défilement (animation d'apparition bloquée) ;
//  - bouton ou lien recouvert par un autre élément (le toucher n'arrive pas) ;
//  - bouton dans un lien / lien dans un bouton (toucher ignoré sur certains navigateurs) ;
//  - champ de saisie en police < 16 px (iPhone zoome la page à chaque saisie) ;
//  - fenêtre (dialogue) plus grande que l'écran sans défilement possible.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Défilement complet de la page, comme un utilisateur, pour déclencher les apparitions
export async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);
  for (let y = 0; y <= h; y += Math.round(vh * 0.6)) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await sleep(120);
  }
  await sleep(900);
}

// Analyse exécutée dans la page (aucune dépendance)
function inspect() {
  const W = document.documentElement.clientWidth;
  const H = innerHeight;
  const issues = [];
  const label = (el) => {
    const txt = (el.getAttribute("aria-label") || el.innerText || el.getAttribute("placeholder") || "").trim().replace(/\s+/g, " ").slice(0, 40);
    const cls = (el.className && typeof el.className === "string" ? el.className : "").split(" ").slice(0, 3).join(".");
    return `<${el.tagName.toLowerCase()}${cls ? "." + cls : ""}>${txt ? " « " + txt + " »" : ""}`;
  };
  const visibleBox = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 ? r : null;
  };
  // Un ancêtre qui coupe ce qui dépasse (le débordement ne fait alors pas glisser la page)
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) return true;
    }
    return false;
  };
  const hiddenByStyle = (el) => {
    for (let p = el; p; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.display === "none" || s.visibility === "hidden") return "masqué";
      if (parseFloat(s.opacity) < 0.05) return "opacité 0";
    }
    return null;
  };

  // 1. Débordement horizontal
  const scrollW = document.documentElement.scrollWidth;
  if (scrollW > W + 1) {
    const culprits = [...document.body.querySelectorAll("*")]
      .filter((el) => { const r = visibleBox(el); return r && r.right > W + 1 && !clipped(el) && getComputedStyle(el).position !== "fixed"; })
      .filter((el, _, all) => !all.some((o) => o !== el && el.contains(o)))
      .slice(0, 4).map(label);
    issues.push({ type: "débordement", detail: `largeur ${scrollW}px pour ${W}px : ${culprits.join(", ")}` });
  }

  // 2. Texte important invisible (parcourue entièrement, la page devrait tout montrer)
  const texts = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main button, main a, h1, h2")]
    .filter((el) => el.innerText?.trim() && el.closest("[aria-hidden='true'], .sr-only, [role='dialog'], [data-state='closed'], [hidden]") === null);
  const invisible = [...new Set(texts.filter((el) => {
    const s = getComputedStyle(el);
    if (s.display === "none") return false;
    const why = hiddenByStyle(el);
    // display:none (menus repliés, variantes bureau) est volontaire ; on signale l'opacité nulle
    return why === "opacité 0";
  }))];
  if (invisible.length) issues.push({ type: "invisible", detail: `${invisible.length} élément(s) à opacité 0 : ${invisible.slice(0, 4).map(label).join(", ")}` });

  // 3. Boutons et liens imbriqués
  const nested = [...document.querySelectorAll("a button, button a, a a, button button")];
  if (nested.length) issues.push({ type: "imbriqué", detail: nested.slice(0, 4).map(label).join(", ") });

  // 4. Cibles tactiles recouvertes (testées dans l'écran actuel uniquement)
  const targets = [...document.querySelectorAll("a[href], button, [role='button'], input, select, textarea, [role='combobox'], [role='tab']")];
  const covered = [];
  const modal = [...document.querySelectorAll("[role='dialog'], [role='alertdialog']")].find((d) => visibleBox(d));
  const doc = document.documentElement;
  const atTop = scrollY <= 1, atBottom = scrollY + H >= doc.scrollHeight - 2;
  // Barre fixe ou collante (en-tête, menu du bas) qui contient l'élément touché
  const barOf = (node) => {
    for (let p = node; p && p !== document.body; p = p.parentElement) {
      if (/(fixed|sticky)/.test(getComputedStyle(p).position)) return p;
    }
    return null;
  };
  for (const el of targets) {
    if (el.disabled || hiddenByStyle(el) || el.closest("[aria-hidden='true'], [inert]")) continue;
    // Fenêtre ouverte : le reste de la page est volontairement recouvert
    if (modal && !modal.contains(el)) continue;
    const r = visibleBox(el);
    if (!r || r.bottom < 4 || r.top > H - 4 || r.right < 4 || r.left > W - 4) continue;
    const x = Math.min(Math.max(r.left + r.width / 2, 1), W - 1);
    const y = Math.min(Math.max(r.top + r.height / 2, 1), H - 1);
    // Hors de la zone visible d'un conteneur qui défile (fenêtre, liste) : il suffit de défiler
    let outside = false;
    for (let p = el.parentElement; p && p !== document.body && !outside; p = p.parentElement) {
      if (!/(hidden|auto|scroll|clip)/.test(getComputedStyle(p).overflowY + getComputedStyle(p).overflowX)) continue;
      const c = p.getBoundingClientRect();
      outside = y < c.top || y > c.bottom || x < c.left || x > c.right;
    }
    if (outside) continue;
    const hit = document.elementFromPoint(x, y);
    if (!hit || el.contains(hit) || hit.contains(el) || hit.closest("label")?.control === el) continue;
    // Sous une barre fixe : normal pendant le défilement ; défaut seulement si on ne peut plus
    // défiler pour le dégager (barre du bas en fin de page, barre du haut en début de page)
    const bar = barOf(hit);
    if (bar && !bar.contains(el)) {
      const isBottomBar = bar.getBoundingClientRect().top > H / 2;
      if (!(isBottomBar ? atBottom : atTop)) continue;
    }
    covered.push(`${label(el)} sous ${label(hit)}`);
  }
  if (covered.length) issues.push({ type: "recouvert", detail: covered.slice(0, 4).join(" ; ") });

  // 5. Champs qui déclenchent le zoom automatique de l'iPhone
  const small = [...document.querySelectorAll("input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=color]), textarea, select")]
    .filter((el) => visibleBox(el) && !hiddenByStyle(el) && parseFloat(getComputedStyle(el).fontSize) < 16);
  if (small.length) issues.push({ type: "zoom iPhone", detail: `${small.length} champ(s) < 16px : ${small.slice(0, 3).map(label).join(", ")}` });

  // 6. Dialogue ouvert plus haut que l'écran et sans défilement
  for (const d of document.querySelectorAll("[role='dialog'], [role='alertdialog']")) {
    const r = visibleBox(d);
    if (!r) continue;
    const scrollable = d.scrollHeight > d.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(d).overflowY);
    if ((r.height > H + 1 || r.top < -1) && !scrollable) issues.push({ type: "dialogue", detail: `${label(d)} : ${Math.round(r.height)}px pour ${H}px` });
    if (r.width > W + 1) issues.push({ type: "dialogue", detail: `${label(d)} : ${Math.round(r.width)}px de large pour ${W}px` });
  }
  return issues;
}

// Audit d'une page : en haut, puis après défilement complet, puis tout en bas
export async function auditPage(page) {
  await sleep(600);
  const top = await page.evaluate(inspect);
  await scrollThrough(page);
  const bottom = await page.evaluate(inspect);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const seen = new Set();
  return [...top, ...bottom].filter((i) => { const k = i.type + i.detail; if (seen.has(k)) return false; seen.add(k); return true; });
}

export async function auditDialog(page) {
  await sleep(500);
  return page.evaluate(inspect);
}
