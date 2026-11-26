// Scénario de bout en bout sur les émulateurs Firebase (aucune donnée réelle).
// Lancement : npm run test:e2e   (démarre les émulateurs, le site, puis ce scénario)
//
// Trois étudiants (Alice, Bob, Eve) utilisent l'application dans Chrome sans interface.
// Navigateur : Google Chrome installé (ou CHROME_PATH=/chemin/vers/chrome).
import { chromium, webkit, devices } from "playwright-core";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { auditPage, auditDialog } from "./mobile-audit.mjs";

const PORT = 5174;
const BASE = `http://localhost:${PORT}`;
const PROJECT = "demo-buddyetude";
const FIRESTORE = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;

// ------------------------------------------------------------------ Serveur du site
const vite = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["vite", "--port", String(PORT), "--strictPort"], {
  env: { ...process.env, VITE_USE_EMULATORS: "true", VITE_FIREBASE_PROJECT_ID: PROJECT },
  stdio: "ignore",
  shell: process.platform === "win32",
});
// Sous Windows, le serveur est lancé via un shell : on arrête tout l'arbre de processus, et de
// façon synchrone (sinon le script se termine avant l'arrêt et le port reste occupé)
const stopVite = () => { try { process.platform === "win32" ? spawnSync("taskkill", ["/pid", String(vite.pid), "/T", "/F"], { stdio: "ignore" }) : vite.kill(); } catch { /* déjà arrêté */ } };

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return; } catch { /* pas encore prêt */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Le site ne démarre pas");
}

// ------------------------------------------------------------------ Outils
const results = [];
const openPages = [];
const OUTPUT = "tests/e2e/output";
mkdirSync(OUTPUT, { recursive: true });
const step = async (name, fn) => {
  try { await fn(); results.push({ ok: true, name }); console.log(`  ok    ${name}`); }
  catch (e) {
    results.push({ ok: false, name, error: e.message.split("\n")[0] });
    console.log(`  ÉCHEC ${name} — ${e.message.split("\n")[0]}`);
    // Capture de chaque navigateur ouvert, pour comprendre l'échec (dossier exclu de Git)
    const slug = name.replace(/[^\w]+/g, "_").slice(0, 40);
    await Promise.all(openPages.map((p, i) => p.screenshot({ path: `${OUTPUT}/${slug}-${i}.png` }).catch(() => {})));
  }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Lecture directe de l'émulateur (droits administrateur "owner") pour préparer / vérifier
async function firestoreQuery(collectionId, field, value) {
  const res = await fetch(`${FIRESTORE}:runQuery`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer owner" },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId }], where: { fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: { stringValue: value } } } } }),
  });
  return (await res.json()).filter((r) => r.document).map((r) => r.document);
}
const uidOf = async (displayName) => (await firestoreQuery("users", "display_name", displayName))[0]?.name.split("/").pop();

async function newUser(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 1440, height: 900 },
    locale: "fr-FR", isMobile: !!opts.mobile, hasTouch: !!opts.mobile,
  });
  const page = await ctx.newPage();
  page.errors = [];
  page.on("console", (m) => { if (m.type() === "error") page.errors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => page.errors.push("pageerror: " + e.message));
  openPages.push(page);
  return page;
}

// Connexion Google via l'émulateur (fenêtre "Add new account" / compte existant)
async function googleLogin(page, { email, name, create }) {
  await page.goto(BASE + "/Dashboard");
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("button", { name: /Continuer avec Google/ }).click(),
  ]);
  await popup.waitForLoadState();
  if (create) {
    await popup.getByText(/Add new account/i).click();
    await popup.locator("#email-input").fill(email);
    await popup.locator("#display-name-input").fill(name);
    await popup.getByRole("button", { name: /Sign in with Google/i }).click();
  } else {
    await popup.getByText(email).click();
  }
  // Nouveau compte : redirigé vers la création du profil ; compte existant : tableau de bord
  await page.getByText(/Bonjour,|Bienvenue sur BuddyEtude/).first().waitFor({ timeout: 20000 });
}

async function completeProfile(page, { level, subject }) {
  await page.goto(BASE + "/Profile");
  await page.getByRole("button", { name: /Enregistrer/ }).waitFor({ timeout: 15000 });
  await page.getByRole("combobox", { name: "Niveau d'études" }).click();
  await page.getByRole("option", { name: level, exact: true }).click();
  await page.getByRole("button", { name: subject }).click();
  await page.getByText("J'ai 15 ans ou plus").click();
  await page.getByRole("button", { name: /Enregistrer/ }).click();
  await page.waitForURL(/Dashboard/, { timeout: 10000 });
}

const card = (page, name) => page.locator("div.group", { hasText: name });

// ------------------------------------------------------------------ Scénario
async function scenario(browser) {
  const RUN = Date.now().toString(36).slice(-4);
  const U = {
    alice: { name: `Alice ${RUN}`, email: `alice_${RUN}@test.com` },
    bob: { name: `Bob ${RUN}`, email: `bob_${RUN}@test.com` },
    eve: { name: `Eve ${RUN}`, email: `eve_${RUN}@test.com` },
  };
  const A = await newUser(browser), B = await newUser(browser), E = await newUser(browser);

  await step("Alice se connecte (Google)", () => googleLogin(A, { ...U.alice, create: true }));
  await step("Bob se connecte (Google)", () => googleLogin(B, { ...U.bob, create: true }));
  await step("Eve se connecte (Google)", () => googleLogin(E, { ...U.eve, create: true }));
  await step("Profils complétés (avec tranche d'âge)", async () => {
    await completeProfile(A, { level: "Licence", subject: "+ Mathématiques" });
    await completeProfile(B, { level: "Licence", subject: "+ Mathématiques" });
    await completeProfile(E, { level: "Master", subject: "+ Chimie" });
  });
  await step("L'email n'est plus stocké dans les profils", async () => {
    const docs = await firestoreQuery("users", "display_name", U.alice.name);
    if (docs[0]?.fields?.email) throw new Error("email présent dans le profil");
  });

  await step("Recherche : Bob en premier, « 1 matière en commun »", async () => {
    await A.goto(BASE + "/Search");
    await card(A, U.bob.name).getByText("1 matière en commun").waitFor({ timeout: 15000 });
    const first = await A.locator("div.group h3").first().innerText();
    if (first !== U.bob.name) throw new Error(`premier profil : ${first}`);
  });
  await step("Mentorat : Bob (« Avancé ») apparaît dans « Trouver de l'aide » pour Alice", async () => {
    // Bob passe « Avancé » en Mathématiques (Alice y est « Intermédiaire »)
    const bobUid = await uidOf(U.bob.name);
    await fetch(`${FIRESTORE}/users/${bobUid}?updateMask.fieldPaths=subjects`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Authorization: "Bearer owner" },
      body: JSON.stringify({ fields: { subjects: { arrayValue: { values: [{ mapValue: { fields: { name: { stringValue: "Mathématiques" }, level: { stringValue: "avance" } } } }] } } } }),
    });
    await A.reload();
    await A.getByRole("tab", { name: /Trouver de l'aide/ }).click();
    await card(A, U.bob.name).getByText("Peut t'aider en Mathématiques").waitFor({ timeout: 15000 });
    await card(A, U.bob.name).getByRole("button", { name: /Demander de l'aide/ }).waitFor();
    if (await card(A, U.eve.name).count()) throw new Error("Eve (pas « Avancé ») apparaît en mode aide");
    await A.getByRole("tab", { name: /Trouver un binôme/ }).click();
  });
  await step("Alice envoie une demande à Bob (avertissement si numéro de téléphone)", async () => {
    await card(A, U.bob.name).getByRole("button", { name: /Contacter/ }).click();
    await A.getByRole("dialog").locator("textarea").fill("Appelle-moi au 06 12 34 56 78");
    await A.getByRole("dialog").getByRole("button", { name: /Envoyer/ }).click();
    await A.getByRole("dialog").getByRole("alert").waitFor({ timeout: 5000 });
    await A.getByRole("dialog").locator("textarea").fill("Salut, on révise les maths ?");
    await A.getByRole("dialog").getByRole("button", { name: /Envoyer/ }).click();
    await card(A, U.bob.name).getByRole("button", { name: /Demande envoyée/ }).waitFor({ timeout: 10000 });
  });
  await step("Bob : pastille « 1 » (demande en attente) et réponse depuis la recherche", async () => {
    await B.goto(BASE + "/Dashboard");
    await B.locator("aside nav a", { hasText: "Messages" }).locator("span", { hasText: "1" }).waitFor({ timeout: 10000 });
    await B.goto(BASE + "/Search");
    await card(B, U.alice.name).getByRole("button", { name: /Répondre à sa demande/ }).click();
    await B.getByRole("button", { name: /Accepter/ }).click({ timeout: 10000 });
    await B.locator("form input:not([type=file])").waitFor({ timeout: 10000 });
    // Attendre la confirmation du serveur avant de quitter la page
    await B.getByText("Demande acceptée !").first().waitFor({ timeout: 15000 });
  });

  await B.goto(BASE + "/Dashboard");
  await step("Alice écrit à Bob depuis « Ouvrir la conversation »", async () => {
    await A.goto(BASE + "/Search");
    await card(A, U.bob.name).getByRole("button", { name: /Ouvrir la conversation/ }).click();
    const input = A.locator("form input:not([type=file])");
    await input.waitFor({ timeout: 10000 });
    for (const text of ["Bonjour Bob !", "Dispo demain ?"]) {
      await input.fill(text);
      await input.press("Enter");
      await A.getByText(text).waitFor({ timeout: 10000 });
    }
  });
  await step("Bob voit 2 non-lus, puis la pastille disparaît à la lecture", async () => {
    await B.locator("aside nav a", { hasText: "Messages" }).locator("span", { hasText: "2" }).waitFor({ timeout: 10000 });
    await B.goto(BASE + "/Messages");
    await B.getByRole("button", { name: new RegExp(U.alice.name) }).click();
    await B.getByText("Dispo demain ?").waitFor({ timeout: 10000 });
    await sleep(1500);
    if (await B.locator("aside nav a", { hasText: "Messages" }).locator("span.bg-red-500").count()) throw new Error("pastille encore visible");
  });

  await step("Bob planifie une session en ligne (appel vidéo intégré)", async () => {
    await B.goto(BASE + "/Sessions");
    await B.getByRole("button", { name: /Nouvelle session/ }).click();
    const dlg = B.getByRole("dialog");
    await dlg.locator("#session-title").fill("Chapitre 4");
    await dlg.getByRole("combobox").first().click();
    await B.getByRole("option", { name: new RegExp(U.alice.name) }).click();
    const d = new Date(Date.now() + 2 * 86400000);
    await dlg.locator("#session-date").fill(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    await dlg.locator("#session-time").fill("18:00");
    await dlg.getByText(/Appel vidéo inclus/).waitFor();
    await dlg.getByRole("button", { name: /Créer|Planifier/ }).last().click();
    await B.getByText("Chapitre 4").first().waitFor({ timeout: 10000 });
  });
  await step("Alice : notification, session au tableau de bord, bouton d'appel vidéo", async () => {
    await A.getByText(/Nouvelle session/).first().waitFor({ timeout: 10000 });
    await A.goto(BASE + "/Dashboard");
    // .first() : la session apparaît aussi dans le bloc « À faire maintenant »
    await A.getByText("Chapitre 4").first().waitFor({ timeout: 10000 });
    await A.goto(BASE + "/Sessions");
    await A.getByRole("link", { name: /Rejoindre l'appel vidéo/ }).waitFor({ timeout: 10000 });
  });

  await step("Profil d'un binôme : ouvert depuis la conversation, matières en commun", async () => {
    await B.goto(BASE + "/Messages");
    await B.getByRole("button", { name: new RegExp(U.alice.name) }).click();
    await B.getByRole("link", { name: new RegExp(U.alice.name) }).click();
    await B.waitForURL(/Student\?id=/);
    await B.getByRole("heading", { name: U.alice.name }).waitFor({ timeout: 10000 });
    await B.getByText("En commun avec toi").first().waitFor();
    await B.getByRole("link", { name: /Écrire/ }).waitFor();
  });
  await step("Appel vidéo : page d'appel réservée au binôme (sans clé Daily : message clair)", async () => {
    await B.getByRole("link", { name: /Appel vidéo/ }).click();
    await B.waitForURL(/Call\?type=pair/);
    await B.getByText(/pas encore activés|ne répond pas/).waitFor({ timeout: 20000 });
    await E.goto(B.url());
    await E.getByText(/réservé aux membres/).waitFor({ timeout: 20000 });
  });

  await step("Tableau blanc : Alice dessine, Bob voit le trait", async () => {
    await A.goto(BASE + "/Messages");
    await A.getByRole("button", { name: new RegExp(U.bob.name) }).click();
    await A.getByRole("button", { name: /Ouvrir le Tableau Blanc/ }).click();
    await A.waitForURL(/Whiteboard/);
    await sleep(1000);
    const box = await A.locator("canvas").boundingBox();
    await A.mouse.move(box.x + 100, box.y + 100);
    await A.mouse.down();
    for (let i = 0; i < 25; i++) await A.mouse.move(box.x + 100 + i * 15, box.y + 100 + i * 6);
    await A.mouse.up();
    await sleep(1500);
    await B.goto(BASE + "/Sessions");
    await B.getByRole("button", { name: /tableau blanc/i }).first().click();
    await B.waitForURL(/Whiteboard/);
    await sleep(2500);
    const painted = await B.evaluate(() => {
      const c = document.querySelector("canvas");
      const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
      return n;
    });
    if (painted < 100) throw new Error(`canvas de Bob vide (${painted} pixels)`);
  });
  await step("Tableau blanc : « Défaire » n'annule que ses propres traits", async () => {
    await B.getByRole("button", { name: "Défaire" }).waitFor();
    if (await B.getByRole("button", { name: "Défaire" }).isEnabled()) throw new Error("Bob peut défaire le trait d'Alice");
  });
  await step("Tableau blanc : nouvelle page vierge, puis retour à la page 1", async () => {
    const painted = () => B.evaluate(() => {
      const c = document.querySelector("canvas");
      const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
      return n;
    });
    await B.getByRole("button", { name: "Ajouter une page" }).click();
    await B.getByText("2 / 2").waitFor({ timeout: 10000 });
    await sleep(500);
    if (await painted() > 0) throw new Error("la nouvelle page n'est pas vierge");
    await B.getByRole("button", { name: "Page précédente" }).click();
    await B.getByText("1 / 2").waitFor();
    await sleep(500);
    if (await painted() < 100) throw new Error("le trait de la page 1 a disparu");
  });
  await step("Tableau blanc : import d'un PDF (2 pages en fond)", async () => {
    // PDF de 2 pages fabriqué par Chrome lui-même
    const maker = await B.context().newPage();
    await maker.setContent(`<h1 style="font:48px sans-serif">Chapitre 1</h1><div style="page-break-after:always"></div><h1 style="font:48px sans-serif">Chapitre 2</h1>`);
    mkdirSync(OUTPUT, { recursive: true });
    const pdfPath = `${OUTPUT}/cours.pdf`;
    await maker.pdf({ path: pdfPath, format: "A4" });
    await maker.close();
    await B.locator('input[type="file"][accept="application/pdf"]').setInputFiles(pdfPath);
    await B.getByText(/2 pages importées/).waitFor({ timeout: 60000 });
    await B.getByText("3 / 4").waitFor();
    await B.locator("img[src*='wb_']").waitFor({ timeout: 15000 });
  });
  await step("Groupe : Alice crée un groupe et ajoute Bob", async () => {
    await A.goto(BASE + "/Groups");
    await A.getByRole("button", { name: /Nouveau groupe/ }).first().click();
    await A.locator("#group-name").fill(`Révisions ${RUN}`);
    await A.locator("#group-subject").fill("Mathématiques");
    await A.getByRole("button", { name: "Créer le groupe" }).click();
    await A.getByText("Groupe créé.").waitFor({ timeout: 10000 });
    await A.getByRole("combobox", { name: "Ajouter un binôme…" }).click();
    await A.getByRole("option", { name: new RegExp(U.bob.name) }).click();
    await A.getByRole("button", { name: "Ajouter", exact: true }).click();
    await A.getByText(/a rejoint le groupe/).waitFor({ timeout: 10000 });
  });
  await step("Groupe : Bob voit le groupe, écrit, Alice reçoit", async () => {
    await B.goto(BASE + "/Groups");
    await B.getByRole("button", { name: new RegExp(`Révisions ${RUN}`) }).click();
    await B.getByPlaceholder("Écrire au groupe…").fill("Bonjour le groupe !");
    await B.getByRole("button", { name: "Envoyer" }).click();
    await A.getByText("Bonjour le groupe !").waitFor({ timeout: 10000 });
  });
  await step("Groupe : tableau blanc du groupe accessible aux membres", async () => {
    await B.getByRole("button", { name: /Tableau blanc/ }).click();
    await B.waitForURL(/Whiteboard\?sessionId=grp-/);
    await B.getByRole("heading", { name: `Révisions ${RUN}` }).waitFor({ timeout: 10000 });
    await B.getByText("1 / 1").waitFor();
  });

  await step("Changement de nom : Bob voit le nouveau nom d'Alice dans ses contacts", async () => {
    const newName = `Alice-Marie ${RUN}`;
    await A.goto(BASE + "/Profile");
    await A.getByRole("button", { name: /Modifier le profil/ }).click();
    await A.locator("#profile-name").fill(newName);
    await A.getByRole("button", { name: /Enregistrer/ }).click();
    await A.waitForURL(/Dashboard/, { timeout: 10000 });
    await B.goto(BASE + "/Messages");
    await B.getByRole("button", { name: new RegExp(newName) }).waitFor({ timeout: 20000 });
    U.alice.name = newName;
  });

  await step("Session terminée → avis demandé et enregistré", async () => {
    await B.goto(BASE + "/Sessions");
    await B.getByRole("button", { name: /Terminée/ }).first().click();
    await B.getByRole("radio", { name: "2 étoiles" }).click();
    await B.getByRole("dialog").getByRole("button", { name: "Envoyer" }).click();
    await B.getByText("Merci pour ton avis").waitFor({ timeout: 10000 });
  });

  await step("Mobile : liste OU conversation, avec retour", async () => {
    const M = await newUser(browser, { viewport: { width: 390, height: 844 }, mobile: true });
    await googleLogin(M, { ...U.bob, create: false });
    await M.goto(BASE + "/Messages");
    await M.getByRole("button", { name: new RegExp(U.alice.name) }).click();
    await M.getByText("Dispo demain ?").waitFor({ timeout: 10000 });
    await M.getByRole("button", { name: "Retour aux contacts" }).click();
    await M.getByRole("button", { name: new RegExp(U.alice.name) }).waitFor();
    await M.context().close();
  });

  // Audit d'affichage sur téléphone (Android via Chrome, iPhone via WebKit s'il est installé) :
  // toutes les pages publiques et connectées, plus les fenêtres principales.
  const mobileTargets = [{ name: "Android", launch: async () => browser, device: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } }];
  // iPhone (WebKit) : sur demande (E2E_IPHONE=1). En fin de long scénario, WebKit cumule les
  // connexions d'écoute vers l'émulateur Firestore et finit parfois sur une page blanche, ce qui
  // n'arrive pas en production ; l'audit iPhone seul, lui, est fiable.
  if (process.env.E2E_IPHONE && existsSync(webkit.executablePath())) {
    mobileTargets.push({ name: "iPhone", launch: () => webkit.launch(), device: devices["iPhone 13"] });
  }
  for (const target of process.env.SKIP_MOBILE_AUDIT ? [] : mobileTargets) {
    await step(`Affichage mobile (${target.name}) : aucune page cassée`, async () => {
      const engine = await target.launch();
      const ctx = await engine.newContext({ ...target.device, locale: "fr-FR" });
      ctx.setDefaultTimeout(15000);
      const M = await ctx.newPage();
      const errors = [];
      // WebKit signale l'arrêt des connexions d'écoute de l'émulateur Firestore (autre port) à
      // chaque changement de page : propre à l'environnement de test, ignoré
      M.on("pageerror", (e) => { if (!/Firestore\/Listen\/channel|access control checks/.test(e.message)) errors.push(e.message); });
      openPages.push(M);
      const report = [];
      let where = "";
      const audit = async (path, extra) => {
        where = path;
        await M.goto(BASE + path, { waitUntil: "load" });
        await M.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
        // Une nouvelle tentative après rechargement : sous WebKit, les connexions d'écoute vers
        // l'émulateur Firestore s'accumulent d'une page à l'autre et retardent parfois les données
        if (extra) await extra().catch(async () => { await M.reload({ waitUntil: "load" }); await extra(); });
        for (const i of await auditPage(M)) report.push(`${path} [${i.type}] ${i.detail}`);
      };
      const auditOpenDialog = async (path, open) => {
        where = `${path} (ouverture de la fenêtre)`;
        await M.goto(BASE + path, { waitUntil: "load" });
        await open();
        await M.getByRole("dialog").first().waitFor({ timeout: 10000 });
        for (const i of await auditDialog(M)) report.push(`${path} (fenêtre) [${i.type}] ${i.detail}`);
        await M.keyboard.press("Escape");
      };
      // Garde-fou : un navigateur bloqué ne doit pas suspendre tout le scénario
      let timer;
      const watchdog = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("délai dépassé")), 6 * 60000); });
      try {
        await Promise.race([watchdog, (async () => {
        for (const p of ["/", "/About", "/Etablissements", "/Legal", "/Privacy"]) await audit(p);
        await auditOpenDialog("/", () => M.getByRole("button", { name: /Trouver mon binôme|Commencer|S'inscrire|Inscription/ }).first().click());
        await googleLogin(M, { ...U.alice, create: false });
        const bobUid = await uidOf(U.bob.name);
        const eveUid = await uidOf(U.eve.name);
        for (const p of ["/", "/Dashboard", "/Search", "/Messages", "/Sessions", "/Groups", "/Profile",
          "/Settings", "/Settings?tab=appearance", "/Settings?tab=notifications", "/Settings?tab=privacy", `/Student?id=${bobUid}`]) await audit(p);
        await audit("/Messages", () => M.getByRole("button", { name: new RegExp(U.bob.name) }).first().click());
        await audit("/Groups", () => M.getByText(/Groupe/).first().click().catch(() => {}));
        await auditOpenDialog("/Sessions", () => M.getByRole("button", { name: /Nouvelle session/ }).first().click());
        await auditOpenDialog(`/Search?contact=${eveUid}`, async () => {});
        })()]);
      } catch (e) {
        // Capture de l'écran du téléphone et des boutons présents, pour comprendre l'échec
        await M.screenshot({ path: `${OUTPUT}/mobile-${target.name}.png` }).catch(() => {});
        const buttons = await M.getByRole("button").allInnerTexts().catch(() => []);
        console.log(`        boutons visibles : ${buttons.map((b) => b.replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 15).join(" | ")}`);
        throw new Error(`${where} : ${e.message.split("\n")[0]}`);
      } finally {
        clearTimeout(timer);
        await ctx.close().catch(() => {});
        if (engine !== browser) await engine.close().catch(() => {});
      }
      if (errors.length) report.push(`erreurs JavaScript : ${[...new Set(errors)].join(" | ")}`);
      if (report.length) {
        console.log(report.map((r) => `        ${r}`).join("\n"));
        throw new Error(`${report.length} défaut(s) d'affichage mobile (détail ci-dessus)`);
      }
    });
  }

  await step("Bob signale Eve, puis la bloque : elle disparaît de sa recherche", async () => {
    await B.goto(BASE + "/Search");
    await card(B, U.eve.name).getByRole("button", { name: "Signaler" }).click();
    const dlg = B.getByRole("dialog");
    await dlg.getByRole("combobox").click();
    await B.getByRole("option").first().click();
    await dlg.getByRole("button", { name: /Envoyer|Confirmer|Signaler/ }).last().click();
    await sleep(1000);
    await card(B, U.eve.name).getByRole("button", { name: "Signaler" }).click();
    await B.getByRole("dialog").getByRole("button", { name: "Bloquer" }).click();
    await sleep(1500);
    if (await card(B, U.eve.name).count()) throw new Error("Eve toujours visible");
  });
  await step("Eve ne peut plus envoyer de demande à Bob (règles)", async () => {
    await E.goto(BASE + "/Search");
    await card(E, U.bob.name).getByRole("button", { name: /Contacter/ }).click();
    await E.getByRole("dialog").locator("textarea").fill("coucou");
    await E.getByRole("dialog").getByRole("button", { name: /Envoyer/ }).click();
    await E.getByText(/Erreur|impossible|échoué/i).first().waitFor({ timeout: 10000 });
  });

  await step("Modération : Alice (admin) bannit Eve depuis le signalement", async () => {
    const aliceUid = await uidOf(U.alice.name);
    await fetch(`${FIRESTORE}/admins?documentId=${aliceUid}`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer owner" },
      body: JSON.stringify({ fields: { since: { stringValue: "e2e" } } }),
    });
    await A.goto(BASE + "/Dashboard");
    await A.reload();
    await A.locator("aside").getByRole("link", { name: "Modération" }).click({ timeout: 15000 });
    await A.getByText(U.eve.name).waitFor({ timeout: 10000 });
    await A.getByRole("button", { name: "Bannir" }).first().click();
    await A.getByText(/est banni/).waitFor({ timeout: 10000 });
    await A.getByText("2", { exact: false }).first().waitFor(); // avis négatif (2 étoiles) listé
  });
  await step("Modération : statistiques et analyse des anciennes données", async () => {
    await A.getByText("Binômes formés").waitFor({ timeout: 20000 });
    await A.getByText("Inscriptions par semaine").first().waitFor();
    await A.getByRole("button", { name: "Analyser" }).click();
    await A.getByText("Aucune ancienne donnée à nettoyer.").waitFor({ timeout: 20000 });
  });
  await step("Eve bannie n'apparaît plus dans la recherche", async () => {
    await A.goto(BASE + "/Search");
    await sleep(2000);
    if (await card(A, U.eve.name).count()) throw new Error("Eve encore visible");
  });

  await step("Retrait du binôme : la conversation disparaît des deux côtés", async () => {
    await A.goto(BASE + "/Messages");
    await A.getByRole("button", { name: new RegExp(U.bob.name) }).click();
    await A.getByRole("button", { name: "Retirer ce binôme" }).click();
    await A.getByRole("dialog").getByRole("button", { name: "Retirer" }).click();
    await sleep(1500);
    await B.goto(BASE + "/Messages");
    await sleep(2000);
    if (await B.getByRole("button", { name: new RegExp(U.alice.name) }).count()) throw new Error("Alice encore dans les contacts de Bob");
  });

  await step("Inscription par e-mail, bandeau de vérification, suppression du compte", async () => {
    const Z = await newUser(browser);
    await Z.goto(BASE + "/Dashboard");
    await Z.getByRole("button", { name: "Se connecter", exact: true }).click();
    await Z.getByRole("button", { name: "Créer un compte" }).click();
    await Z.locator("#auth-name").fill(`Zoé ${RUN}`);
    await Z.locator("#auth-email").fill(`zoe_${RUN}@test.com`);
    await Z.locator("#auth-password").fill("motdepasse-solide");
    await Z.getByRole("button", { name: "Créer mon compte" }).click();
    await Z.getByText(/Vérifie ton adresse e-mail/).waitFor({ timeout: 15000 });
    // Nouveau compte : la page de création du profil s'ouvre, avec le nom saisi à l'inscription
    await Z.getByText("Bienvenue sur BuddyEtude").first().waitFor({ timeout: 15000 });
    if ((await Z.locator("#profile-name").inputValue()) !== `Zoé ${RUN}`) throw new Error("nom saisi à l'inscription absent du profil");
    // « C'est fait » avant d'avoir cliqué sur le lien : message explicatif
    await Z.getByRole("button", { name: "C'est fait" }).click();
    await Z.getByText(/pas encore vérifiée/).first().waitFor({ timeout: 10000 });
    // Clic sur le lien de l'e-mail (émulateur Auth), puis « C'est fait » : bandeau retiré
    const oob = await (await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT}/oobCodes`)).json();
    const link = oob.oobCodes.reverse().find((c) => c.email === `zoe_${RUN}@test.com` && c.requestType === "VERIFY_EMAIL")?.oobLink;
    if (!link) throw new Error("e-mail de vérification non envoyé");
    await fetch(link);
    await Z.getByRole("button", { name: "C'est fait" }).click();
    await Z.getByText("Adresse e-mail vérifiée").first().waitFor({ timeout: 10000 });
    await Z.getByText(/Vérifie ton adresse e-mail/).waitFor({ state: "detached", timeout: 10000 });
    await Z.goto(BASE + "/Settings");
    await Z.getByRole("button", { name: "Supprimer mon compte" }).last().click();
    await Z.locator("#delete-confirm").fill("SUPPRIMER");
    await Z.locator("#delete-password").fill("motdepasse-solide");
    await Z.getByRole("button", { name: "Supprimer définitivement" }).click();
    await Z.waitForURL(BASE + "/", { timeout: 20000 });
    if ((await firestoreQuery("users", "display_name", `Zoé ${RUN}`)).length) throw new Error("profil non supprimé");
    await Z.context().close();
  });

  const consoleErrors = [...new Set([...A.errors, ...B.errors, ...E.errors])]
    // Refus attendus des règles (Eve bloquée) et ressources externes indisponibles hors ligne
    .filter((e) => !/permission|insufficient|Missing or insufficient|ERR_INTERNET|Failed to load resource/i.test(e));
  await step("Aucune erreur inattendue dans la console", async () => {
    if (consoleErrors.length) throw new Error(consoleErrors.join(" | "));
  });
}

// ------------------------------------------------------------------ Lancement
let browser;
try {
  await waitForServer();
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });
  await scenario(browser);
} catch (e) {
  results.push({ ok: false, name: "lancement", error: e.message });
  console.error(e);
} finally {
  await browser?.close();
  stopVite();
}
const failed = results.filter((r) => !r.ok);
console.log(`\nScénario : ${results.length - failed.length} étape(s) réussie(s), ${failed.length} échec(s)`);
process.exit(failed.length ? 1 : 0);
