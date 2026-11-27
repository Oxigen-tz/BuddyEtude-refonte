// Tests du filtre de mots (functions/screening.js), sans émulateur.
// Lancement : npm run test:screening
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { scanText } = require("../../functions/screening.js");

let pass = 0;
const failures = [];
const flagged = (text, category) => {
  const hits = scanText(text);
  const ok = category ? hits.some((h) => h.category === category) : hits.length > 0;
  (ok ? pass++ : failures.push(`non repéré : « ${text} »${category ? ` (${category})` : ""}`));
};
const clean = (text) => {
  const hits = scanText(text);
  (hits.length === 0 ? pass++ : failures.push(`faux positif : « ${text} » → ${hits.map((h) => h.term).join(", ")}`));
};

// Insultes et contournements
flagged("Le Connard", "insult");
flagged("CONNARD", "insult");
flagged("c0nn4rd", "insult");
flagged("connnnaaaard", "insult");
flagged("c o n n a r d", "insult");
flagged("c.o.n.n.a.r.d", "insult");
flagged("sale-connard", "insult");
flagged("Gros con", "insult");
flagged("ta gueule", "insult");
flagged("Enculé", "insult");
flagged("fils de pute", "insult");
// Haine, sexuel, drogue
flagged("Heil Hitler", "hate");
flagged("abonne-toi à mon onlyfans", "sexual");
flagged("plan cul ce soir", "sexual");
flagged("je vends de la beuh", "drugs");
// Publicité et coordonnées
flagged("Je vends mes fiches 5 € sur Insta", "contact");
flagged("écris-moi en MP", "contact");
flagged("appelle-moi au 06 12 34 56 78", "contact");
flagged("+33 6 12 34 56 78", "contact");
flagged("mon mail : jean.dupont@gmail.com", "contact");
flagged("va sur www.mes-fiches.fr", "contact");
flagged("suis-moi @fiches_pas_cheres", "contact");
flagged("10 euros de l'heure", "contact");

// Noms et présentations normaux : rien ne doit être repéré
for (const ok of [
  "Conor", "Constance", "Second", "Connor McDavid", "Léa Martin", "Yanis Benali", "Sarah Lopez",
  "Camille Dubois", "Maxence", "Ascension", "Analyse et algèbre", "Prépa MPSI",
  "L2 maths-éco, je cherche quelqu'un pour réviser les partiels le soir.",
  "Passionnée d'analyse, j'adore expliquer au tableau.",
  "M1 économie, je peux aider en statistiques et en anglais.",
  "Étudiant en informatique, je cherche un binôme pour l'algèbre linéaire.",
  "Je révise la biologie cellulaire et la chimie organique.",
  "Disponible le week-end, en ligne ou à Lyon.",
  "Constitution, contrat, consommation : je révise le droit civil.",
  "Session de 2 heures le mardi.",
]) clean(ok);

for (const f of failures) console.log("  ÉCHEC", f);
console.log(`\nFiltre de mots : ${pass} test(s) réussi(s), ${failures.length} échec(s)`);
process.exit(failures.length ? 1 : 0);
