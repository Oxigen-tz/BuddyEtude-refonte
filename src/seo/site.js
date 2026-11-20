// Référencement : source unique pour les titres, descriptions, pages publiques et la FAQ.
// Utilisé à la fois par l'application (components/SeoManager.jsx, section FAQ de l'accueil)
// et à la compilation (vite.config.js : pages HTML pré-remplies, sitemap.xml).
// ⚠️ Pas d'import ici (ni "@/…", ni React) : ce fichier est aussi lu par Node.

export const SITE = {
  url: "https://buddyetude.com",
  name: "BuddyEtude",
  ogImage: "https://buddyetude.com/og-image.png",
  email: "contact@buddyetude.com",
};

// Autres façons d'écrire le nom (recherches « buddy etude », « buddy étude »…)
export const ALT_NAMES = ["Buddy Etude", "Buddy Étude", "BuddyÉtude"];

// Pages indexables. La version anglaise de l'accueil est servie sur /?lang=en.
export const PUBLIC_PAGES = {
  "/": {
    priority: "1.0", changefreq: "weekly",
    fr: {
      title: "BuddyEtude · Trouve ton binôme d'études et révise à deux",
      description: "Trouve des étudiants de ton niveau pour réviser à deux : matières en commun, messagerie, sessions en visio et tableau blanc partagé. Gratuit et sans pub.",
    },
    en: {
      title: "BuddyEtude · Find a study buddy and revise together",
      description: "Find students at your level to study with: shared subjects, messaging, video sessions and a shared whiteboard. Free, no ads.",
    },
  },
  "/About": {
    priority: "0.6", changefreq: "monthly",
    fr: { title: "À propos · BuddyEtude", description: "BuddyEtude a été créé par un étudiant pour que personne ne révise seul : l'histoire et les objectifs du projet." },
    en: { title: "About · BuddyEtude", description: "BuddyEtude was built by a student so that nobody has to study alone: the story and goals of the project." },
  },
  "/Etablissements": {
    priority: "0.7", changefreq: "monthly",
    fr: { title: "BuddyEtude pour les établissements · Tutorat entre étudiants", description: "Universités, écoles, BDE : organisez le tutorat et l'entraide entre étudiants avec BuddyEtude. Mise en relation par niveau, mentorat, visio, tableau blanc. Établissements pilotes recherchés." },
    en: { title: "BuddyEtude for schools · Peer tutoring", description: "Universities, schools, student unions: organise peer tutoring and student support with BuddyEtude. Level-based matching, mentoring, video, whiteboard. Pilot schools wanted." },
  },
  "/Legal": {
    priority: "0.3", changefreq: "yearly",
    fr: { title: "Mentions légales et CGU · BuddyEtude", description: "Mentions légales et conditions générales d'utilisation de BuddyEtude, la plateforme gratuite pour trouver un binôme d'études." },
    en: { title: "Legal notice and terms · BuddyEtude", description: "Legal notice and terms of use of BuddyEtude, the free platform to find a study buddy." },
  },
  "/Privacy": {
    priority: "0.3", changefreq: "yearly",
    fr: { title: "Politique de confidentialité · BuddyEtude", description: "Les données que BuddyEtude collecte, pourquoi, combien de temps elles sont gardées et comment exercer tes droits. Données hébergées dans l'Union européenne." },
    en: { title: "Privacy policy · BuddyEtude", description: "What data BuddyEtude collects, why, how long it is kept and how to exercise your rights. Data hosted in the European Union." },
  },
};

// Pages de l'application (connexion requise) : jamais indexées
export const PRIVATE_PATHS = ["/Dashboard", "/Search", "/Messages", "/Sessions", "/Settings", "/Whiteboard", "/Profile", "/Admin", "/Groups", "/Call", "/Student"];

// Questions fréquentes : affichées sur l'accueil et décrites aux moteurs (données structurées FAQPage)
export const FAQ = {
  fr: [
    { q: "Qu'est-ce que BuddyEtude ?", a: "Une plateforme gratuite qui met en relation des étudiants pour réviser à deux ou en petit groupe : recherche de binôme selon tes matières et ton niveau, messagerie, sessions avec appel vidéo et tableau blanc partagé." },
    { q: "Comment trouver un binôme de révision ?", a: "Crée ton profil avec tes matières, ton niveau dans chacune, ton établissement et tes disponibilités. BuddyEtude te propose les étudiants les plus compatibles : tu leur envoies une demande avec un petit message, et vous pouvez discuter dès qu'elle est acceptée." },
    { q: "BuddyEtude est-il gratuit ?", a: "Oui, entièrement gratuit et sans publicité. Tes données ne sont jamais vendues et sont hébergées dans l'Union européenne." },
    { q: "Peut-on réviser à distance ?", a: "Oui. L'appel vidéo est intégré à BuddyEtude, sans logiciel ni compte supplémentaire, et le tableau blanc partagé permet de dessiner, d'écrire et d'annoter des cours en PDF à plusieurs, en temps réel." },
    { q: "Je bloque dans une matière : quelqu'un peut-il m'aider ?", a: "Avec le mode « Trouver de l'aide », tu trouves des étudiants de niveau avancé dans la matière qui acceptent d'aider ceux qui débutent. Tu leur expliques sur quoi tu bloques, et ils choisissent d'accepter." },
    { q: "À qui s'adresse BuddyEtude ?", a: "Aux élèves et étudiants à partir de 15 ans (avant, avec l'accord d'un parent) : lycée, prépa, BTS, BUT, université ou école. Un badge « étudiant vérifié » confirme l'adresse e-mail de l'établissement." },
  ],
  en: [
    { q: "What is BuddyEtude?", a: "A free platform that connects students to study in pairs or small groups: find a study buddy by subject and level, messaging, sessions with video calls and a shared whiteboard." },
    { q: "How do I find a study buddy?", a: "Create your profile with your subjects, your level in each, your school and your availability. BuddyEtude suggests the most compatible students: send them a request with a short message, and you can chat as soon as it's accepted." },
    { q: "Is BuddyEtude free?", a: "Yes, completely free and ad-free. Your data is never sold and is hosted in the European Union." },
    { q: "Can we study remotely?", a: "Yes. Video calls are built into BuddyEtude, with no extra software or account, and the shared whiteboard lets you draw, write and annotate PDF notes together, in real time." },
    { q: "I'm stuck in a subject: can someone help me?", a: "With “Find help” mode, you find students with an advanced level in the subject who are happy to help beginners. Tell them what you're stuck on, and they choose whether to accept." },
    { q: "Who is BuddyEtude for?", a: "Students aged 15 and over (younger with a parent's consent): high school, prep classes, vocational degrees, university or other schools. A “verified student” badge confirms the school email address." },
  ],
};

// Données structurées communes (Organisation, site, application)
export function baseJsonLd() {
  return [
    { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, alternateName: ALT_NAMES, url: SITE.url, logo: `${SITE.url}/icon-512.png`, email: SITE.email },
    { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, alternateName: ALT_NAMES, url: SITE.url, inLanguage: ["fr", "en"] },
    {
      "@context": "https://schema.org", "@type": "WebApplication", name: SITE.name, url: SITE.url,
      applicationCategory: "EducationalApplication", operatingSystem: "Web",
      description: PUBLIC_PAGES["/"].fr.description, inLanguage: "fr",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    },
  ];
}

export function faqJsonLd(lang = "fr") {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQ[lang].map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
