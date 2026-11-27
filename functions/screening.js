// Filtre de mots pour la modération des profils (nom et présentation).
// Il ne sanctionne personne : il signale les profils à vérifier dans la page Modération
// (collection screening/, lisible par la modération seule). Aucune donnée n'est envoyée à
// un service extérieur.
//
// Contournements reconnus : majuscules, accents, chiffres à la place des lettres (« c0nn4rd »),
// lettres répétées (« connnaaard »), lettres séparées (« c o n n a r d », « c.o.n.n.a.r.d »).
// Les mots courts ne comptent que s'ils sont isolés (« con » oui, « Conor » ou « second » non).
//
// Pour ajouter un mot : l'écrire en minuscules, sans accent, dans la bonne catégorie.

const LISTS = {
  insult: [
    "con", "conne", "connard", "connasse", "salope", "salop", "salaud", "pute", "putain", "pouffiasse",
    "petasse", "encule", "enculer", "enculee", "batard", "batarde", "merde", "merdeux", "fdp", "ntm",
    "nique", "niquer", "niquez", "tg", "ta gueule", "ferme ta gueule", "abruti", "debile", "cretin",
    "enfoire", "chienne", "grognasse", "trouduc", "trou du cul", "branleur", "fils de pute",
    "fuck", "fucker", "fucking", "shit", "bitch", "asshole", "dickhead", "cunt", "motherfucker", "bastard",
  ],
  hate: [
    "negre", "negro", "bougnoule", "youpin", "pedale", "tapette", "gouine", "nazi", "hitler", "heil",
    "kkk", "sieg heil", "sale arabe", "sale noir", "sale juif", "sale pd", "pd",
  ],
  sexual: [
    "porno", "porn", "xxx", "nude", "nudes", "sexy", "sexe", "baise", "baiser", "suce", "sucer",
    "chatte", "nichons", "bite", "escort", "plan cul", "sugar daddy", "sugar baby", "onlyfans", "mym",
    "camgirl", "webcam sexe",
  ],
  drugs: ["cannabis", "beuh", "weed", "shit a vendre", "cocaine", "coke", "ecstasy", "mdma", "lsd", "dealer"],
  contact: [
    "insta", "instagram", "snap", "snapchat", "whatsapp", "telegram", "discord", "tiktok", "facebook",
    "paypal", "lydia", "venmo", "revolut", "mp", "dm", "ecris moi en mp", "a vendre", "je vends", "vends",
    "payant", "tarif", "tarifs", "euros", "euro", "cours particuliers payants",
  ],
};

// Motifs bruts (sur le texte d'origine) : coordonnées et argent
const PATTERNS = [
  { category: "contact", label: "numéro de téléphone", re: /(?:\+33|0033|\b0)\s*[1-9](?:[\s.-]*\d{2}){4}\b/ },
  { category: "contact", label: "adresse e-mail", re: /[^\s@]+@[^\s@]+\.[a-z]{2,}/i },
  { category: "contact", label: "lien", re: /\b(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|fr|net|org|io|me|ly|gg)\b/i },
  { category: "contact", label: "pseudo @", re: /(?:^|\s)@[a-z0-9._]{3,}/i },
  { category: "contact", label: "prix", re: /\d+\s?(?:€|euros?\b)|€\s?\d+/i },
];

const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", 8: "b", "@": "a", $: "s", "!": "i" };

// Minuscules, sans accents, chiffres « leet » remplacés, tout le reste en espaces
function normalize(text) {
  return String(text || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[0134578@$!]/g, (c) => LEET[c] || c)
    .replace(/[^a-z]+/g, " ")
    .trim();
}
// Lettres répétées ramenées à une seule (« connnaard » → « conard »)
const squeeze = (s) => s.replace(/(.)\1+/g, "$1");

// Index : chaque terme sous sa forme « squeezée », avec sa catégorie
const TERMS = Object.entries(LISTS).flatMap(([category, words]) =>
  words.map((term) => ({ term, category, key: squeeze(normalize(term)), multi: term.includes(" ") })));

// Renvoie [{ category, term }] (sans doublon) pour un texte
function scanText(text) {
  const raw = String(text || "");
  const norm = normalize(raw);
  if (!norm && !raw) return [];
  const tokens = norm.split(" ").filter(Boolean).map(squeeze);
  const tokenSet = new Set(tokens);
  const joined = ` ${tokens.join(" ")} `;
  // Lettres isolées mises bout à bout : « c o n n a r d » → « connard »
  const spelled = squeeze(norm.replace(/\b([a-z]) (?=[a-z]\b)/g, "$1"));
  const spelledTokens = new Set(spelled.split(" ").filter(Boolean));
  const hits = new Map();
  for (const { term, category, key, multi } of TERMS) {
    const found = multi
      ? joined.includes(` ${key} `)
      : tokenSet.has(key) || spelledTokens.has(key)
        // Mot long collé à d'autres (« sale-connard », « connardd ») : recherche dans le texte compacté
        || (key.length >= 6 && squeeze(norm.replace(/ /g, "")).includes(key));
    if (found && !hits.has(term)) hits.set(term, { category, term });
  }
  for (const { category, label, re } of PATTERNS) {
    const m = raw.match(re);
    if (m) hits.set(`pattern:${label}`, { category, term: label, excerpt: m[0].trim().slice(0, 40) });
  }
  // Un mot déjà compris dans une expression repérée n'est pas répété (« mp » dans « ecris moi en mp »)
  const list = [...hits.values()];
  const phrases = list.filter((h) => h.term.includes(" ")).map((h) => ` ${h.term} `);
  return list.filter((h) => h.term.includes(" ") || !phrases.some((p) => p.includes(` ${h.term} `)));
}

// Analyse d'un profil : { name: [...], bio: [...] } ; null si rien n'est repéré
function screenProfile({ display_name, bio }) {
  const result = { name: scanText(display_name), bio: scanText(bio) };
  return result.name.length || result.bio.length ? result : null;
}

module.exports = { scanText, screenProfile, normalize };
