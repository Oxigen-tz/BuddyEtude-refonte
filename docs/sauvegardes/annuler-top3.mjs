// Annule les modifications 1, 2 et 3 du benchmark (barre mobile, bouton « gratuit », surligneur citron).
// Usage, depuis la racine du projet :  node docs/sauvegardes/annuler-top3.mjs          (annule)
//                                      node docs/sauvegardes/annuler-top3.mjs --test   (vérifie sans rien écrire)
// Les autres changements (tutoiement, badges, À faire maintenant, filtres, réseaux) ne sont pas touchés.
import fs from "fs";
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const TEST = process.argv.includes("--test");
function edit(f, pairs) {
  let s = fs.readFileSync(f, "utf8"); const crlf = s.includes(CR + LF); s = s.split(CR + LF).join(LF);
  for (const [b, a] of pairs) { if (!s.includes(a)) throw new Error(f + " absent: " + a.slice(0, 80)); s = s.replace(a, b); }
  if (!TEST) fs.writeFileSync(f, crlf ? s.split(LF).join(CR + LF) : s);
}

// 1. En-tête : « Connexion » visible sur téléphone (lien texte), « Inscription » à partir de sm
edit("src/components/home/HomeNavbar.jsx", [
  [`className="hidden sm:inline-flex rounded-xl text-gray-700`, `className="rounded-xl px-3 sm:px-4 text-gray-700`],
  [`<Button onClick={openLogin} className="rounded-xl px-4 sm:px-5 bg-gray-900`, `<Button onClick={openLogin} className="hidden sm:inline-flex rounded-xl px-4 sm:px-5 bg-gray-900`],
]);

// 1. Barre d'action fixe en bas, sur l'accueil
edit("src/pages/Home.jsx", [
  [`import CTASection from "../components/home/CTASection";`, `import CTASection from "../components/home/CTASection";
import MobileStickyCta from "../components/home/MobileStickyCta";`],
  [`        <CTASection />
      </main>`, `        <CTASection />
      </main>
      <MobileStickyCta />`],
]);

// 2. Bouton principal + ligne de confiance rapprochée ; 3. mot surligné au lieu du dégradé
edit("src/components/home/HeroSection.jsx", [
  [`className={\`inline-block \${x.hl ? "text-gradient animate-shine pb-2" : ""}\`}`, `className={\`inline-block \${x.hl ? "hl-marker" : ""}\`}`],
  [`className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm font-medium text-white/60">`, `className="mt-5 flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm font-medium text-white/60">`],
]);

// 3. Manifeste : nom de la marque en citron, plus de dégradé
edit("src/components/home/Manifesto.jsx", [
  [`className={\`inline-block \${accent ? "text-gradient" : ""}\`}`, `className={\`inline-block \${accent ? "text-lime-300" : ""}\`}`],
  [`i >= brandIndex ? "text-gradient" : ""`, `i >= brandIndex ? "text-lime-300" : ""`],
]);

edit("src/index.css", [
  [`  /* Quadrillage discret (fonds de sections) */`, `  /* Mot clé du titre de l'accueil en citron : il passe du blanc au citron après l'apparition des mots */
  .hl-marker {
    color: #dcf46b;
    animation: hl-tint 0.8s ease-out 0.9s both;
  }
  @keyframes hl-tint {
    from { color: #fff; }
    to { color: #dcf46b; }
  }
  @media (prefers-reduced-motion: reduce) {
    .hl-marker { animation: none; }
  }
  /* Quadrillage discret (fonds de sections) */`],
]);

// 2. Textes
edit("src/i18n.js", [
  [`        btn_start: "C'est parti !",`, `        btn_start: "Trouver mon binôme gratuitement",`],
  [`        btn_start: "Let's get started!",`, `        btn_start: "Find my study buddy for free",`],
  [`          signup: "Inscription",`, `          signup: "Inscription",
          stickyCta: "Trouver mon binôme",
          stickyFree: "Gratuit",
          hasAccount: "J'ai déjà un compte",`],
  [`          signup: "Sign Up",`, `          signup: "Sign Up",
          stickyCta: "Find my study buddy",
          stickyFree: "Free",
          hasAccount: "I already have an account",`],
]);
if (!TEST && fs.existsSync("src/components/home/MobileStickyCta.jsx")) fs.unlinkSync("src/components/home/MobileStickyCta.jsx");
console.log(TEST ? "test ok : tout peut être annulé" : "annulé");
