// Listes proposées dans les menus (profil et recherche). Le texte libre reste toujours possible :
// ces listes servent à suggérer et à écrire les choses de la même façon, pour que la recherche
// et la compatibilité retrouvent les mêmes matières et les mêmes établissements.

// Niveaux d'études : valeurs techniques, libellés dans buddyCard.levels.<valeur> (i18n.js).
// Ne jamais renommer une valeur existante (elle est enregistrée dans les profils).
export const LEVEL_VALUES = [
  "college", "lycee", "prepa", "bts_iut", "pass_las", "licence", "bachelor",
  "ecole_ingenieur", "ecole_commerce", "master", "doctorat", "formation_continue", "autre",
];

export const POPULAR_SUBJECTS = ["Mathématiques", "Physique", "Chimie", "SVT", "Anglais", "Informatique", "Économie", "Droit"];

// Matières, du collège au doctorat (ordre alphabétique sans importance : trié à l'affichage)
export const SUBJECTS = [
  // Mathématiques et statistiques
  "Mathématiques", "Algèbre", "Algèbre linéaire", "Analyse", "Analyse numérique", "Arithmétique",
  "Calcul différentiel", "Géométrie", "Probabilités", "Statistiques", "Mathématiques financières",
  "Mathématiques discrètes", "Recherche opérationnelle", "Optimisation", "Topologie", "Logique",
  "Équations différentielles", "Mathématiques appliquées", "Mathématiques expertes", "Mathématiques complémentaires",
  "Économétrie", "Data science", "Actuariat",
  // Physique, chimie, sciences de l'ingénieur
  "Physique", "Physique-Chimie", "Mécanique", "Mécanique des fluides", "Mécanique quantique", "Physique quantique",
  "Thermodynamique", "Électromagnétisme", "Électricité", "Électronique", "Électrotechnique", "Optique",
  "Astrophysique", "Physique nucléaire", "Relativité", "Acoustique", "Énergétique", "Résistance des matériaux",
  "Science des matériaux", "Chimie", "Chimie organique", "Chimie inorganique", "Chimie analytique",
  "Chimie physique", "Biochimie", "Génie chimique", "Génie des procédés", "Sciences de l'ingénieur",
  "Génie civil", "Génie électrique", "Génie mécanique", "Génie industriel", "Automatique", "Robotique",
  "Mécatronique", "Systèmes embarqués", "Traitement du signal", "Télécommunications", "Aéronautique",
  "Construction", "BTP", "Topographie", "Productique", "Maintenance industrielle", "Qualité",
  "Logistique", "Supply chain", "Énergies renouvelables", "Environnement", "Développement durable",
  // Informatique et numérique
  "Informatique", "Algorithmique", "Programmation", "Python", "Java", "C", "C++", "C#", "JavaScript",
  "TypeScript", "PHP", "SQL", "Bases de données", "Développement web", "Développement mobile",
  "Génie logiciel", "Architecture logicielle", "Systèmes d'exploitation", "Réseaux", "Cybersécurité",
  "Cloud", "DevOps", "Intelligence artificielle", "Machine learning", "Deep learning", "Big data",
  "Cryptographie", "Compilation", "Théorie des graphes", "Calculabilité", "Infographie", "UX/UI design",
  "NSI", "SNT", "Bureautique", "Excel", "Systèmes d'information",
  // Sciences de la vie, de la Terre et santé
  "SVT", "Biologie", "Biologie cellulaire", "Biologie moléculaire", "Génétique", "Microbiologie",
  "Immunologie", "Physiologie", "Écologie", "Botanique", "Zoologie", "Géologie", "Neurosciences",
  "Biotechnologies", "Agronomie", "Sciences vétérinaires", "Médecine", "Anatomie", "Histologie",
  "Embryologie", "Pharmacologie", "Pharmacie", "Sémiologie", "Santé publique", "Épidémiologie",
  "Biostatistiques", "Odontologie", "Maïeutique", "Kinésithérapie", "Soins infirmiers", "Nutrition",
  "Diététique", "Psychiatrie", "Pédiatrie", "Cardiologie", "Radiologie", "Biophysique",
  "Physiologie de l'exercice", "STAPS", "Éducation physique et sportive", "Ergothérapie", "Orthophonie",
  // Droit et science politique
  "Droit", "Droit civil", "Droit constitutionnel", "Droit administratif", "Droit pénal", "Procédure pénale",
  "Procédure civile", "Droit des contrats", "Droit des obligations", "Droit des affaires", "Droit commercial",
  "Droit des sociétés", "Droit du travail", "Droit fiscal", "Droit international", "Droit européen",
  "Droit de la famille", "Droit immobilier", "Droit de l'environnement", "Droit du numérique",
  "Droit de la propriété intellectuelle", "Libertés fondamentales", "Histoire du droit",
  "Introduction au droit", "Science politique", "Relations internationales", "Institutions politiques",
  // Économie, gestion, commerce
  "Économie", "Microéconomie", "Macroéconomie", "Économie internationale", "Économie monétaire",
  "Sciences économiques et sociales", "Gestion", "Comptabilité", "Comptabilité analytique",
  "Contrôle de gestion", "Audit", "Finance", "Finance d'entreprise", "Finance de marché", "Fiscalité",
  "Marketing", "Marketing digital", "Communication", "Commerce", "Commerce international", "Vente",
  "Négociation", "Management", "Ressources humaines", "Entrepreneuriat", "Stratégie d'entreprise",
  "Gestion de projet", "Achats", "Immobilier", "Banque", "Assurance", "Tourisme", "Hôtellerie",
  "Management des organisations", "Droit-Économie-Gestion",
  // Lettres, langues et sciences humaines
  "Français", "Littérature", "Littérature comparée", "Lettres modernes", "Lettres classiques",
  "Grammaire", "Orthographe", "Rédaction", "Expression écrite", "Culture générale", "Philosophie",
  "Histoire", "Géographie", "Histoire-Géographie", "HGGSP", "Géopolitique", "Archéologie",
  "Histoire de l'art", "Sociologie", "Psychologie", "Anthropologie", "Sciences de l'éducation",
  "Sciences du langage", "Linguistique", "Information-communication", "Journalisme", "Documentation",
  "Humanités, littérature et philosophie", "Éducation morale et civique", "Théologie",
  "Anglais", "Espagnol", "Allemand", "Italien", "Portugais", "Arabe", "Chinois", "Japonais", "Coréen",
  "Russe", "Néerlandais", "Polonais", "Turc", "Grec ancien", "Latin", "Hébreu", "Hindi", "Suédois",
  "Breton", "Occitan", "Basque", "Créole", "Langue des signes française", "Français langue étrangère",
  "LLCER Anglais", "Anglais monde contemporain", "Traduction", "Interprétation",
  // Arts, design, architecture
  "Arts plastiques", "Arts appliqués", "Design", "Design graphique", "Architecture", "Urbanisme",
  "Musique", "Solfège", "Cinéma", "Audiovisuel", "Théâtre", "Danse", "Photographie", "Mode",
  "Histoire du cinéma", "Animation 3D", "Jeu vidéo",
  // Concours et préparations
  "Préparation aux concours", "Concours de la fonction publique", "TOEIC", "TOEFL", "IELTS",
  "Score IAE-Message", "TAGE MAGE", "GMAT", "Code de la route", "Méthodologie", "Prise de parole en public",
];

const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// Suggestions de matières : commence par le texte tapé d'abord, puis contient le texte tapé
export function suggestSubjects(text, exclude = [], max = 12) {
  const q = strip(text || "");
  if (!q) return [];
  const excluded = new Set(exclude.map(strip));
  const unique = [...new Set(SUBJECTS)].filter((s) => !excluded.has(strip(s)));
  const starts = unique.filter((s) => strip(s).startsWith(q));
  const contains = unique.filter((s) => !strip(s).startsWith(q) && strip(s).includes(q));
  return [...starts.sort((a, b) => a.localeCompare(b, "fr")), ...contains.sort((a, b) => a.localeCompare(b, "fr"))].slice(0, max);
}

// Communes de France (API officielle geo.api.gouv.fr, toutes les communes)
export async function suggestCities(text) {
  if (!text || text.trim().length < 2) return [];
  const res = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(text.trim())}&fields=nom,codeDepartement&boost=population&limit=8`);
  if (!res.ok) return [];
  const data = await res.json();
  return [...new Set(data.map((c) => c.nom))];
}

// Établissements (API Parcoursup du ministère de l'Enseignement supérieur : universités, écoles,
// IUT, lycées avec BTS ou prépa…) ; les mots tapés doivent tous apparaître dans le nom
export async function suggestSchools(text) {
  const words = (text || "").trim().split(/\s+/).filter((w) => w.length >= 2).slice(0, 4);
  if (!words.length) return [];
  const where = words.map((w) => `search(g_ea_lib_vx,"${w.replace(/"/g, "")}")`).join(" and ");
  const url = "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/records"
    + `?select=g_ea_lib_vx&group_by=g_ea_lib_vx&limit=10&where=${encodeURIComponent(where)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((r) => r.g_ea_lib_vx).filter(Boolean);
}
