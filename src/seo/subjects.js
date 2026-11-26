// Pages « Réviser <matière> à deux » : contenu public, indexable, en français.
// Lu par l'application (pages/Reviser.jsx) ET à la compilation (scripts/vite-plugin-seo.js :
// HTML pré-rempli, sitemap, données structurées FAQ). ⚠️ Données seulement : aucun import.
//
// Chaque page doit apporter un vrai contenu propre à la matière (méthodes de travail à deux,
// questions fréquentes) : pas de texte recopié d'une page à l'autre.

export const SUBJECTS = [
  {
    slug: "mathematiques",
    term: "math", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Mathématiques",
    title: "Réviser les maths à deux : trouve ton binôme · BuddyEtude",
    description: "Trouve un étudiant de ton niveau pour réviser les mathématiques à deux : exercices, démonstrations, tableau blanc partagé et appel vidéo. Gratuit.",
    h1: "Réviser les maths à deux",
    intro: "En maths, on croit avoir compris un cours jusqu'au moment de refaire l'exercice seul. Travailler avec quelqu'un de ton niveau change tout : tu expliques ta démarche, l'autre repère l'étape qui coince, et vous avancez plus vite sur les chapitres qui bloquent.",
    methods: [
      ["Explique ta démarche à voix haute", "Résoudre un exercice en expliquant chaque étape à ton binôme oblige à justifier ce que tu fais. C'est souvent là qu'on découvre la propriété mal comprise."],
      ["Chacun prépare, puis vous comparez", "Faites le même exercice chacun de votre côté pendant vingt minutes, puis comparez vos rédactions. Deux méthodes différentes pour un même résultat, c'est deux fois plus d'outils pour le jour de l'examen."],
      ["Refaites les démonstrations du cours", "L'un énonce le théorème, l'autre refait la démonstration sans notes. Puis vous inversez. C'est la meilleure façon de vérifier que le cours est vraiment su."],
    ],
    tools: "Sur BuddyEtude, le tableau blanc partagé permet d'écrire des formules, de tracer des courbes et d'annoter un sujet en PDF à deux, pendant l'appel vidéo.",
    faq: [
      ["Je suis en terminale, puis-je trouver un binôme ?", "Oui. BuddyEtude s'adresse aux lycéens comme aux étudiants. Indique ton niveau en maths sur ton profil : la recherche te propose des personnes avec un niveau proche."],
      ["Et si je suis vraiment perdu en maths ?", "Utilise le mode « Trouver de l'aide » : il affiche des étudiants de niveau avancé en mathématiques qui acceptent d'aider ceux qui débutent."],
      ["Peut-on travailler sur un sujet d'annale ?", "Oui. Importe le sujet en PDF dans le tableau blanc : vous pouvez l'annoter à deux en temps réel."],
    ],
  },
  {
    slug: "droit",
    term: "droit", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Droit",
    title: "Réviser le droit à deux : trouve ton binôme · BuddyEtude",
    description: "Fiches d'arrêt, cas pratiques, dissertations : trouve un étudiant en droit de ton niveau pour réviser à deux, en visio ou en présentiel. Gratuit.",
    h1: "Réviser le droit à deux",
    intro: "Le droit demande beaucoup de par cœur et une méthode très précise : fiche d'arrêt, commentaire, cas pratique, dissertation. À deux, tu vérifies que tes définitions sont exactes, tu t'entraînes à construire un plan et tu prépares les oraux dans des conditions proches de l'examen.",
    methods: [
      ["Interrogez-vous sur les définitions", "Chacun pose à l'autre dix questions de cours précises : une notion, une condition, un arrêt de principe. Les erreurs ressortent tout de suite."],
      ["Construisez un plan ensemble", "Prenez un sujet de dissertation et cherchez chacun une problématique et un plan en deux parties. Comparez ensuite : discuter des deux plans aide à comprendre ce qu'attend le correcteur."],
      ["Simulez l'oral", "L'un joue l'examinateur, l'autre présente un cas pratique en dix minutes. Puis vous échangez les rôles. C'est le meilleur entraînement pour les oraux de fin de semestre."],
    ],
    tools: "La messagerie de BuddyEtude permet d'échanger vos fiches et vos plans, et l'appel vidéo intégré sert pour les simulations d'oral, sans installer de logiciel.",
    faq: [
      ["Je suis en L1 de droit : avec qui vais-je réviser ?", "La recherche classe les étudiants selon vos matières en commun, votre niveau, votre établissement et votre ville. Tu peux donc trouver quelqu'un de la même fac et de la même année."],
      ["Peut-on réviser en groupe pour les TD ?", "Oui, les groupes de révision réunissent jusqu'à six personnes, avec une discussion et un tableau blanc communs."],
      ["Un étudiant de master peut-il m'aider ?", "Avec le mode « Trouver de l'aide », tu trouves des étudiants avancés dans la matière qui acceptent d'aider. Tu leur expliques sur quoi tu bloques, et ils choisissent d'accepter."],
    ],
  },
  {
    slug: "medecine",
    term: "médecine", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Médecine (PASS / LAS)",
    title: "Réviser la médecine à deux (PASS, LAS) · BuddyEtude",
    description: "PASS, LAS, études de santé : trouve un étudiant de ton niveau pour réviser à deux, t'interroger sur les QCM et tenir ton planning. Gratuit et sans pub.",
    h1: "Réviser la médecine à deux",
    intro: "En PASS ou en LAS, le volume de cours est énorme et le rythme ne laisse pas de place au retard. Un binôme sérieux aide à tenir son planning, à s'interroger régulièrement et à ne pas rester seul face à la pression des examens.",
    methods: [
      ["Interrogez-vous en QCM", "Chacun rédige quelques QCM sur le cours de la veille et les pose à l'autre. Écrire les pièges soi-même est une excellente façon de les repérer le jour de l'épreuve."],
      ["Fixez des créneaux réguliers", "Une courte session à heure fixe, plusieurs fois par semaine, vaut mieux qu'une longue séance de temps en temps. Planifiez-les dans BuddyEtude : un rappel arrive avant chaque session."],
      ["Partagez-vous les synthèses", "Sur un chapitre très long, chacun fait la synthèse d'une moitié, puis l'explique à l'autre. Vous gagnez du temps et vous vérifiez votre compréhension."],
    ],
    tools: "Les sessions planifiées de BuddyEtude créent un lien d'appel vidéo, s'ajoutent à ton agenda et envoient un rappel par e-mail la veille et une heure avant.",
    faq: [
      ["Réviser à deux, ce n'est pas risqué en concours ?", "Réviser avec quelqu'un ne veut pas dire tout partager. Beaucoup d'étudiants s'interrogent mutuellement sur le cours, puis gardent leur propre méthode pour les entraînements. C'est à vous de fixer le cadre."],
      ["Puis-je trouver quelqu'un de la même faculté ?", "Oui : la recherche tient compte de l'établissement et de la ville. Tu peux aussi réviser à distance avec l'appel vidéo intégré."],
      ["BuddyEtude remplace-t-il une prépa privée ?", "Non. BuddyEtude met en relation des étudiants pour réviser ensemble, gratuitement. Ce n'est pas un organisme de préparation et il ne fournit pas de cours."],
    ],
  },
  {
    slug: "physique-chimie",
    term: "physique", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Physique-chimie",
    title: "Réviser la physique-chimie à deux · BuddyEtude",
    description: "Exercices, unités, schémas : trouve un étudiant de ton niveau pour réviser la physique et la chimie à deux, avec un tableau blanc partagé. Gratuit.",
    h1: "Réviser la physique-chimie à deux",
    intro: "En physique comme en chimie, les erreurs viennent souvent d'un détail : une unité oubliée, un signe, une hypothèse mal posée. À deux, vous vous relisez mutuellement et vous comprenez mieux le sens physique derrière les formules.",
    methods: [
      ["Commencez toujours par le schéma", "Avant tout calcul, chacun dessine la situation : forces, circuit, montage. Comparer vos schémas révèle souvent le point de l'énoncé mal compris."],
      ["Vérifiez les unités de l'autre", "Échangez vos copies et contrôlez uniquement l'homogénéité des résultats. C'est rapide, et ça évite beaucoup de points perdus."],
      ["Expliquez le phénomène sans formule", "L'un explique ce qui se passe avec des mots simples, l'autre complète. Si personne n'y arrive, c'est le chapitre à retravailler."],
    ],
    tools: "Le tableau blanc partagé de BuddyEtude permet de dessiner schémas et montages à deux et d'annoter un énoncé en PDF pendant l'appel vidéo.",
    faq: [
      ["Je suis en prépa : BuddyEtude est-il adapté ?", "Oui. Indique ta filière et ton niveau sur ton profil : la recherche te propose des étudiants qui travaillent les mêmes matières que toi."],
      ["Peut-on réviser la physique et la chimie séparément ?", "Oui. Tu ajoutes chaque matière à ton profil avec ton niveau, et la recherche tient compte de chacune."],
      ["Comment se passe une session à distance ?", "Tu planifies une session avec ton binôme : un lien d'appel vidéo est créé, et vous travaillez sur le même tableau blanc en temps réel."],
    ],
  },
  {
    slug: "economie-gestion",
    term: "économie", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Économie et gestion",
    title: "Réviser l'économie et la gestion à deux · BuddyEtude",
    description: "Graphiques, études de cas, comptabilité : trouve un étudiant de ton niveau pour réviser l'économie et la gestion à deux. Gratuit et sans pub.",
    h1: "Réviser l'économie et la gestion à deux",
    intro: "L'économie demande de relier des mécanismes, des graphiques et des exemples concrets. La gestion et la comptabilité reposent sur des exercices répétés. Dans les deux cas, un binôme t'aide à vérifier ton raisonnement et à t'entraîner plus régulièrement.",
    methods: [
      ["Racontez le mécanisme", "L'un explique un mécanisme, par exemple l'effet d'une hausse des taux d'intérêt, l'autre l'illustre avec un graphique. Puis vous inversez sur un autre chapitre."],
      ["Enchaînez les exercices de comptabilité", "Faites la même écriture ou le même bilan chacun de votre côté, puis comparez. En comptabilité, c'est la répétition qui fait gagner du temps à l'examen."],
      ["Préparez une étude de cas à deux", "Lisez le même cas, listez chacun les problèmes de l'entreprise, puis construisez ensemble les recommandations. Deux regards repèrent plus de pistes."],
    ],
    tools: "Sur BuddyEtude, vous échangez vos fiches par messagerie et vous tracez vos graphiques ensemble sur le tableau blanc partagé.",
    faq: [
      ["Je suis en BTS ou en BUT : puis-je m'inscrire ?", "Oui. BuddyEtude s'adresse à toutes les formations : lycée, BTS, BUT, université, écoles et prépas."],
      ["Peut-on réviser en groupe ?", "Oui, les groupes de révision réunissent jusqu'à six personnes, avec une discussion et un tableau blanc communs."],
      ["Est-ce vraiment gratuit ?", "Oui, BuddyEtude est entièrement gratuit et sans publicité, et tes données sont hébergées dans l'Union européenne."],
    ],
  },
  {
    slug: "informatique",
    term: "informatique", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Informatique",
    title: "Réviser l'informatique à deux : binôme de code · BuddyEtude",
    description: "Algorithmique, programmation, bases de données : trouve un étudiant de ton niveau pour réviser l'informatique à deux et coder en binôme. Gratuit.",
    h1: "Réviser l'informatique à deux",
    intro: "En informatique, travailler à deux est une méthode reconnue : la programmation en binôme. L'un écrit le code, l'autre relit et pose des questions, puis vous échangez. C'est aussi la meilleure façon de réviser l'algorithmique avant un partiel.",
    methods: [
      ["Codez en binôme", "Toutes les quinze minutes, celui qui écrit et celui qui relit échangent leurs rôles. Le relecteur repère les erreurs de logique avant même l'exécution."],
      ["Déroulez un algorithme à la main", "Prenez un algorithme du cours et déroulez-le pas à pas sur un petit exemple, en notant l'état des variables. Expliquer chaque étape à l'autre fixe le raisonnement."],
      ["Écrivez des questions de partiel", "Chacun invente une question sur un chapitre (complexité, requête SQL, structure de données) et la pose à l'autre. Inventer les questions oblige à comprendre ce qui est important."],
    ],
    tools: "Le tableau blanc de BuddyEtude sert à dessiner arbres, graphes et schémas de base de données, et l'appel vidéo intégré permet de partager vos explications en direct.",
    faq: [
      ["Je suis en BUT informatique : vais-je trouver quelqu'un ?", "La recherche te propose les étudiants qui ont l'informatique dans leur profil, classés selon votre niveau, votre établissement et vos disponibilités."],
      ["Peut-on partager du code ?", "Oui, la messagerie permet d'envoyer des fichiers. Pour coder en direct à deux, vous pouvez utiliser l'outil de votre choix pendant l'appel vidéo."],
      ["Je débute complètement, quelqu'un peut-il m'aider ?", "Oui, avec le mode « Trouver de l'aide », qui affiche des étudiants avancés en informatique prêts à aider."],
    ],
  },
  {
    slug: "anglais",
    term: "anglais", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Anglais et langues",
    title: "Réviser l'anglais à deux : pratique l'oral · BuddyEtude",
    description: "Oral, vocabulaire, compréhension : trouve un étudiant de ton niveau pour réviser l'anglais et les langues à deux, en visio. Gratuit et sans pub.",
    h1: "Réviser l'anglais et les langues à deux",
    intro: "Une langue s'apprend en la parlant, et c'est justement ce qu'on fait le moins quand on révise seul. Avec un binôme, tu pratiques l'oral, tu te corriges mutuellement et tu gagnes en aisance avant les examens.",
    methods: [
      ["Parlez uniquement dans la langue", "Fixez une règle simple : pendant vingt minutes, interdiction de parler français. Choisissez un sujet de l'actualité ou du programme."],
      ["Faites-vous des dictées de vocabulaire", "Chacun prépare une liste de mots du chapitre et la fait traduire à l'autre, dans les deux sens. Notez ceux qui posent problème pour la séance suivante."],
      ["Préparez l'oral comme le jour J", "L'un présente un document en cinq minutes, l'autre pose des questions comme un examinateur. Puis vous inversez."],
    ],
    tools: "L'appel vidéo intégré de BuddyEtude fonctionne sans logiciel ni compte supplémentaire : idéal pour pratiquer l'oral à distance.",
    faq: [
      ["Puis-je réviser une autre langue que l'anglais ?", "Oui. La matière est libre : ajoute l'espagnol, l'allemand ou une autre langue à ton profil et vois qui la travaille aussi."],
      ["Mon niveau est faible, est-ce un problème ?", "Non. Indique ton niveau honnêtement : la recherche te propose des personnes proches de toi, ou des étudiants plus avancés avec le mode « Trouver de l'aide »."],
      ["Faut-il se voir en vrai ?", "Non. Tu peux réviser entièrement à distance grâce à l'appel vidéo, ou en présentiel si vous êtes dans la même ville."],
    ],
  },
  {
    slug: "biologie",
    term: "biologie", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Biologie",
    title: "Réviser la biologie à deux : trouve ton binôme · BuddyEtude",
    description: "Schémas, cycles, mémorisation : trouve un étudiant de ton niveau pour réviser la biologie et les SVT à deux. Gratuit et sans publicité.",
    h1: "Réviser la biologie à deux",
    intro: "La biologie mélange mémorisation et compréhension de mécanismes : cycles, voies métaboliques, schémas à connaître par cœur. À deux, vous vous interrogez plus souvent et vous retenez mieux en expliquant.",
    methods: [
      ["Refaites les schémas de mémoire", "Chacun redessine un schéma du cours sans le regarder, puis vous comparez avec l'original. Les légendes oubliées montrent ce qu'il faut revoir."],
      ["Racontez un mécanisme étape par étape", "L'un explique une voie métabolique ou un cycle, l'autre l'arrête à chaque étape oubliée. Raconter un mécanisme le fixe bien mieux que le relire."],
      ["Espacez les interrogations", "Reprenez les mêmes questions deux jours, puis une semaine plus tard. Planifier ces rappels avec ton binôme t'évite d'oublier de les faire."],
    ],
    tools: "Le tableau blanc partagé de BuddyEtude permet de dessiner et de légender des schémas à deux pendant l'appel vidéo.",
    faq: [
      ["BuddyEtude convient-il aux SVT du lycée ?", "Oui, les lycéens peuvent s'inscrire dès 15 ans (avant, avec l'accord d'un parent) et indiquer les SVT dans leur profil."],
      ["Je suis en licence de biologie : qui vais-je trouver ?", "Des étudiants qui ont la biologie dans leur profil, classés selon votre niveau, votre établissement, votre ville et vos disponibilités."],
      ["Peut-on réviser en groupe avant un partiel ?", "Oui, les groupes de révision réunissent jusqu'à six personnes, avec une discussion et un tableau blanc communs."],
    ],
  },
  {
    slug: "histoire-geographie",
    term: "histoire", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Histoire-géographie",
    title: "Réviser l'histoire-géo à deux · BuddyEtude",
    description: "Dates, croquis, dissertations : trouve un étudiant de ton niveau pour réviser l'histoire et la géographie à deux. Gratuit et sans publicité.",
    h1: "Réviser l'histoire-géographie à deux",
    intro: "En histoire-géo, il faut à la fois retenir des repères et savoir les mettre en perspective dans une dissertation ou un croquis. Un binôme t'aide à vérifier tes connaissances et à t'entraîner à construire un plan.",
    methods: [
      ["Construisez une frise ensemble", "Sur un chapitre, placez chacun les dates clés de mémoire, puis fusionnez vos frises. Les trous apparaissent tout de suite."],
      ["Entraînez-vous au croquis", "Chacun réalise le même croquis avec sa légende, puis vous comparez l'organisation. C'est souvent la légende qui fait la différence à l'examen."],
      ["Défendez un plan", "Prenez un sujet de dissertation, proposez chacun un plan, puis défendez-le devant l'autre. Il faut savoir justifier chaque partie."],
    ],
    tools: "Sur BuddyEtude, le tableau blanc partagé sert à faire vos croquis et vos frises à deux, et la messagerie à échanger vos fiches.",
    faq: [
      ["Je prépare le bac : puis-je trouver un binôme ?", "Oui, BuddyEtude est ouvert aux lycéens dès 15 ans (avant, avec l'accord d'un parent) comme aux étudiants."],
      ["Peut-on réviser en présentiel ?", "Oui. La recherche tient compte de la ville : tu peux trouver quelqu'un près de chez toi, ou réviser à distance en visio."],
      ["Combien ça coûte ?", "Rien. BuddyEtude est entièrement gratuit et sans publicité."],
    ],
  },
  {
    slug: "philosophie",
    term: "philo", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Philosophie",
    title: "Réviser la philosophie à deux : dissertation · BuddyEtude",
    description: "Problématique, dissertation, explication de texte : trouve un étudiant de ton niveau pour réviser la philosophie à deux. Gratuit et sans pub.",
    h1: "Réviser la philosophie à deux",
    intro: "La philosophie se travaille mal seul : il faut confronter ses idées, tester ses arguments et trouver des objections. Discuter avec un binôme est exactement l'exercice demandé dans une dissertation.",
    methods: [
      ["Cherchez la problématique à deux", "Prenez un sujet, notez chacun en cinq minutes ce qui pose problème dans la question, puis comparez. Une bonne problématique naît souvent de cette discussion."],
      ["Jouez l'objection", "L'un défend une thèse, l'autre cherche systématiquement l'objection. C'est le meilleur entraînement pour la deuxième partie d'une dissertation."],
      ["Expliquez un auteur simplement", "Chacun résume la pensée d'un auteur du programme en trois phrases, avec un exemple. Si l'autre ne comprend pas, il faut reformuler."],
    ],
    tools: "L'appel vidéo intégré de BuddyEtude permet de débattre à distance, et la messagerie d'échanger vos plans et vos fiches d'auteurs.",
    faq: [
      ["Je suis en terminale : BuddyEtude est-il pour moi ?", "Oui. Ajoute la philosophie à ton profil : la recherche te propose des personnes de ton niveau qui la travaillent aussi."],
      ["Peut-on réviser en groupe ?", "Oui, les groupes de révision réunissent jusqu'à six personnes : idéal pour débattre d'un sujet."],
      ["Mes données sont-elles protégées ?", "Oui. Elles ne sont jamais vendues et sont hébergées dans l'Union européenne. Un avertissement apparaît avant d'envoyer un numéro ou un lien à quelqu'un que tu ne connais pas encore."],
    ],
  },
  {
    slug: "psychologie",
    term: "psycho", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Psychologie",
    title: "Réviser la psychologie à deux : trouve ton binôme · BuddyEtude",
    description: "Statistiques, théories, études expérimentales : trouve un étudiant en psychologie de ton niveau pour réviser à deux. Gratuit et sans pub.",
    h1: "Réviser la psychologie à deux",
    intro: "La licence de psychologie mélange des cours très théoriques, beaucoup de références d'auteurs et des statistiques qui surprennent souvent en première année. À deux, tu fixes mieux les notions et tu t'entraînes sur les exercices de méthodologie.",
    methods: [
      ["Reliez chaque théorie à une expérience", "Pour chaque auteur du cours, l'un cite l'expérience ou l'observation qui fonde la théorie, l'autre en explique les limites. C'est exactement ce qu'on attend dans une copie."],
      ["Faites les statistiques ensemble", "Prenez le même jeu de données et faites chacun le test demandé, puis comparez vos résultats et votre interprétation. Les erreurs de raisonnement apparaissent tout de suite."],
      ["Construisez des tableaux comparatifs", "Sur un chapitre, remplissez à deux un tableau qui compare les courants : idée principale, auteurs, méthodes, critiques. Un bon support pour les révisions de dernière minute."],
    ],
    tools: "Le tableau blanc partagé de BuddyEtude permet de faire vos tableaux comparatifs et vos calculs à deux, pendant l'appel vidéo.",
    faq: [
      ["Je suis en L1 de psychologie : avec qui vais-je réviser ?", "Avec des étudiants qui ont la psychologie dans leur profil, classés selon votre niveau, votre établissement, votre ville et vos disponibilités."],
      ["Les statistiques me bloquent, quelqu'un peut-il m'aider ?", "Oui, avec le mode « Trouver de l'aide » : il affiche des étudiants avancés dans la matière qui acceptent d'aider ceux qui débutent."],
      ["Peut-on réviser en groupe pour les partiels ?", "Oui, les groupes de révision réunissent jusqu'à six personnes, avec une discussion et un tableau blanc communs."],
    ],
  },
  {
    slug: "sciences-politiques",
    term: "science", // filtre pré-rempli dans la recherche (/Search?subject=…)
    name: "Sciences politiques",
    title: "Réviser les sciences politiques à deux · BuddyEtude",
    description: "Culture générale, actualité, oraux : trouve un étudiant de ton niveau pour réviser les sciences politiques à deux. Gratuit et sans publicité.",
    h1: "Réviser les sciences politiques à deux",
    intro: "Les sciences politiques demandent une solide culture générale, un suivi régulier de l'actualité et beaucoup d'entraînement à l'écrit comme à l'oral. Un binôme t'aide à tenir le rythme et à confronter tes arguments.",
    methods: [
      ["Faites une revue de presse à deux", "Chaque semaine, chacun choisit deux sujets d'actualité et les présente à l'autre en trois minutes, avec les enjeux et un lien avec le cours."],
      ["Débattez d'un sujet", "L'un défend une position, l'autre la position contraire, puis vous changez. C'est un excellent entraînement pour les oraux et pour la discussion d'une dissertation."],
      ["Fixez les notions clés", "Interrogez-vous sur les définitions et les auteurs du programme : régime, souveraineté, légitimité… Une notion mal définie fragilise toute une copie."],
    ],
    tools: "L'appel vidéo intégré de BuddyEtude sert pour vos débats et vos simulations d'oral, et la messagerie pour échanger vos fiches et vos articles.",
    faq: [
      ["Je prépare un concours d'IEP : BuddyEtude peut-il m'aider ?", "BuddyEtude te permet de trouver d'autres étudiants qui préparent les mêmes épreuves pour réviser ensemble. Ce n'est pas une préparation officielle et il ne fournit pas de cours."],
      ["Peut-on réviser à distance ?", "Oui, entièrement : l'appel vidéo est intégré, sans logiciel ni compte supplémentaire."],
      ["Combien ça coûte ?", "Rien. BuddyEtude est entièrement gratuit et sans publicité."],
    ],
  },
  {
    slug: "prepa",
    term: "", // niveau d'études et non matière : recherche sans filtre de matière
    name: "Classes prépa",
    title: "Réviser en prépa à deux : trouve ton binôme · BuddyEtude",
    description: "MPSI, PCSI, ECG, khâgne : trouve un étudiant de prépa de ton niveau pour préparer les colles et les concours à deux. Gratuit et sans pub.",
    h1: "Réviser en prépa à deux",
    intro: "En classe préparatoire, le rythme est intense : colles chaque semaine, devoirs surveillés, programme très dense. Travailler avec un binôme de ta filière t'aide à préparer les colles, à vérifier tes démonstrations et à garder le moral.",
    methods: [
      ["Préparez les colles comme le jour J", "L'un joue le colleur et pose une question de cours puis un exercice, l'autre répond au tableau en temps limité. Puis vous inversez."],
      ["Refaites les démonstrations de cours", "Chaque semaine, listez les démonstrations à connaître et refaites-les devant l'autre, sans notes. Ce qui n'est pas su ressort immédiatement."],
      ["Corrigez-vous mutuellement les DS", "Après un devoir, échangez vos copies et repérez les erreurs de l'autre avant de lire le corrigé. On comprend mieux une erreur quand on la cherche chez quelqu'un d'autre."],
    ],
    tools: "Sur BuddyEtude, le tableau blanc partagé remplace le tableau de la colle, et les sessions planifiées envoient un rappel avant chaque séance.",
    faq: [
      ["Ma filière est-elle prise en compte ?", "Indique ta formation et tes matières sur ton profil : la recherche te propose des étudiants qui travaillent les mêmes matières, à un niveau proche."],
      ["BuddyEtude remplace-t-il les colles ?", "Non. Il permet de s'entraîner entre étudiants, en plus de ta prépa. Ce n'est pas un organisme de préparation."],
      ["Peut-on réviser tard le soir ?", "Oui : tu indiques tes disponibilités sur ton profil, et vous planifiez vos sessions aux horaires qui vous conviennent."],
    ],
  },
  {
    slug: "bts",
    term: "", // niveau d'études et non matière : recherche sans filtre de matière
    name: "BTS",
    title: "Réviser son BTS à deux : trouve ton binôme · BuddyEtude",
    description: "Épreuves écrites, oraux, dossiers : trouve un étudiant de BTS pour réviser à deux et préparer tes examens. Gratuit et sans publicité.",
    h1: "Réviser son BTS à deux",
    intro: "En BTS, les examens mêlent épreuves générales, épreuves professionnelles et oraux sur dossier. Un binôme t'aide à répartir le travail, à t'entraîner à l'oral et à rester régulier jusqu'aux épreuves.",
    methods: [
      ["Entraînez-vous à présenter votre dossier", "Chacun présente son dossier ou son expérience de stage en dix minutes, l'autre pose les questions d'un jury. Puis vous échangez les rôles."],
      ["Refaites les sujets des années précédentes", "Faites le même sujet chacun de votre côté, en temps limité, puis comparez vos réponses point par point."],
      ["Partagez-vous les fiches", "Sur les matières générales, chacun prépare la fiche d'un chapitre et l'explique à l'autre. Vous avancez deux fois plus vite."],
    ],
    tools: "L'appel vidéo intégré de BuddyEtude permet de simuler les oraux à distance, et la messagerie d'échanger vos fiches et vos sujets.",
    faq: [
      ["Je suis en alternance, est-ce adapté ?", "Oui. Tu indiques tes disponibilités sur ton profil, et vous révisez aux horaires qui vous conviennent, en visio ou en présentiel."],
      ["Puis-je trouver quelqu'un du même BTS ?", "La recherche tient compte de tes matières, de ton établissement et de ta ville. Indique la spécialité de ton BTS dans ton profil."],
      ["Est-ce vraiment gratuit ?", "Oui, BuddyEtude est entièrement gratuit et sans publicité."],
    ],
  },
];

export const SUBJECTS_HUB = {
  title: "Réviser à deux par matière : trouve ton binôme · BuddyEtude",
  description: "Maths, droit, médecine, langues, informatique… Choisis ta matière et trouve un étudiant de ton niveau pour réviser à deux, gratuitement.",
  h1: "Réviser à deux, matière par matière",
  intro: "Chaque matière a ses méthodes de révision à deux. Choisis la tienne : tu y trouveras des conseils concrets pour travailler avec un binôme, et la façon de trouver le bon sur BuddyEtude.",
};

export const subjectPath = (slug) => `/reviser/${slug}`;
