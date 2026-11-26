# Vidéos courtes BuddyEtude — Étape 1 : recherche

Rédigé le 24/11/2026. Objectif : savoir **quoi montrer** (ce que le site fait réellement) et **comment le montrer** (formats qui marchent en ce moment sur TikTok, Reels et Shorts), avant d'écrire le moindre concept.

---

## 1. Ce que le site fait réellement (vérifié dans le code)

Chaque ligne renvoie au code qui la prouve. Rien n'est supposé.

| Fonctionnalité | Ce qu'on voit à l'écran | Preuve dans le code | Intérêt visuel |
|---|---|---|---|
| Recherche de binômes classés par compatibilité (matières, niveau, école, ville, créneaux) avec filtres matière, ville, niveau et mode en ligne / présentiel | Cartes de profils triées par compatibilité, avec des badges (« 2 matières en commun », « Même niveau »…), sans pourcentage affiché | [Search.jsx:253-257](../../src/pages/Search.jsx#L253-L257), [functions/matching.js](../../functions/matching.js), `features.items.filters` dans [i18n.js](../../src/i18n.js) | ★★★ |
| Onglet « Trouver de l'aide » (mentorat) : un débutant envoie une demande ciblée sur une matière à un étudiant « Avancé » | Carte « Demande d'aide en Physique », bouton Accepter | [Search.jsx:257](../../src/pages/Search.jsx#L257) (`mode === "help"`), `landing.mentor` | ★★ |
| Demande de binôme avec un petit mot, puis acceptation qui ouvre la discussion | Notification « Demande acceptée 🎉 » | `messages.pendingRequest`, `layout.notifications`, [functions/index.js:142-163](../../functions/index.js#L142) | ★★ |
| Messagerie en temps réel : fichiers jusqu'à 10 Mo, modification et suppression des messages | Bulles de chat, indicateur « Léa écrit… », pièce jointe PDF | [Messages.jsx](../../src/pages/Messages.jsx), `messages.toast.fileTooLarge` | ★★★ |
| Tableau blanc partagé en temps réel : stylo, texte, gomme, couleurs, plusieurs pages, **import d'un PDF pour l'annoter à plusieurs** (30 Mo maximum), export | Deux personnes qui écrivent en même temps sur un cours | [Whiteboard.jsx](../../src/pages/Whiteboard.jsx), `whiteboard.pdf` | ★★★ (le plus visuel) |
| Appel vidéo intégré (Daily), sans rien installer, non enregistré | Fenêtre d'appel avec bouton vers le tableau blanc | [Call.jsx](../../src/pages/Call.jsx), [functions/index.js:389](../../functions/index.js#L389) | ★★ (simulé dans les vidéos : la clé Daily n'existe pas en local) |
| Sessions planifiées : date, heure, en ligne ou en présentiel, appel inclus, ajout à l'agenda, rappels par e-mail la veille et une heure avant, avis après la session | Carte « Révision d'analyse · Demain 18:00 » | [Sessions.jsx](../../src/pages/Sessions.jsx), [functions/index.js:265](../../functions/index.js#L265) | ★★ |
| Groupes de révision (jusqu'à 6 personnes) avec une discussion et un tableau blanc communs | Liste des membres et discussion de groupe | [Groups.jsx](../../src/pages/Groups.jsx), `groups.subtitle` | ★★ |
| Badge « étudiant vérifié » obtenu par un code envoyé sur l'adresse de l'établissement | Coche ✓ et domaine (ex. univ-rennes.fr) sur le profil | `verification`, [functions/index.js:754](../../functions/index.js#L754) | ★ |
| Sécurité : avertissement avant d'envoyer des coordonnées, blocage, signalement, modération | Bandeau d'avertissement dans le chat | `messages.pendingRequest.contactWarning`, `landing.safety` | ★ |
| E-mail du lundi qui présente les nouveaux inscrits compatibles, notifications push | — (pas visuel) | [functions/index.js:732](../../functions/index.js#L732) | — |
| Gratuit, sans publicité, données hébergées dans l'UE | Texte | `landing.trust`, `privacy` | argument pour la légende |

### Ce que le site **ne fait pas** (à ne jamais montrer ni sous-entendre)
- Pas de minuteur Pomodoro ni de chrono de travail.
- Pas de salle « study with me » en direct, ni de salle publique ouverte à des inconnus : on ne rencontre quelqu'un qu'après qu'il a accepté une demande.
- Pas d'IA (ni résumé, ni fiches, ni quiz automatiques).
- Pas de classement, de série de jours (« streak ») ni de statistiques de révision personnelles.
- Pas d'application mobile à télécharger : c'est un site web, qui s'utilise aussi sur téléphone. Il ne faut donc jamais dire « télécharge l'appli », seulement « lien en bio ».
- Pas de chiffres d'utilisateurs à afficher : le compteur d'inscrits de la page d'accueil reste en mode « lancement » tant qu'il y a peu d'inscrits (`hero.social.early`).

**Conséquence :** les formats les plus populaires en 2026 chez les applis d'étude reposent sur l'IA ou sur un minuteur (voir §2). On ne peut pas les copier tels quels. Il faut les adapter à **notre vraie différence : l'humain, réviser avec quelqu'un.**

---

## 2. Formats qui marchent en ce moment

La grille de lecture est la même pour chaque format. Une précision honnête sur les sources : la plupart sont des blogs d'agences ou d'outils, et deux articles sont sponsorisés. Je donne leurs chiffres tels quels, en indiquant **qui les a mesurés**. Quand une source n'indique pas quelque chose, c'est noté « non précisé ». Quand je n'ai trouvé aucune source, c'est noté « non vérifié ».

### 2.1 Applis d'étude / StudyTok

| # | Format | Accroche (0-2 s) | Structure | Durée | Sous-titres | Son | Source |
|---|---|---|---|---|---|---|---|
| A | **POV « remontée spectaculaire » (Knowunity)** | Le résultat d'abord : « POV: when the exam results come back and u realize u just pulled off the greatest academic comeback of ur career » | Petite scène autour des résultats. L'appli n'est **pas expliquée**, juste citée dans la légende (#knowunity) | non précisé | Texte à l'écran, une seule phrase | Le **même son** sur 17 des 18 versions tournées (le son n'est pas nommé) | [viral.app](https://viral.app/blog/insights/knowunity-studytok-grade-rescue) : meilleure vidéo à 1,8 M de vues, médiane de la série à 10 600 (mesuré par viral.app sur les pages TikTok publiques) |
| B | **Galère d'abord (Knowunity)** | Une situation que tout le monde reconnaît : « When we start a new topic in math but I still haven't understood the old one: » | La galère, puis l'appli comme solution | non précisé | Texte à l'écran | non précisé | même source : meilleure vidéo à 518 400 vues (sponsorisée **après** avoir déjà bien marché seule) |
| C | **« Les mains occupées »** | Une image : quelqu'un épluche une orange ou prépare un thé en parlant face caméra | Conseils de méthode de révision, l'outil n'apparaît qu'**à la fin** | non précisé | non précisé | non précisé | [Social Growth Engineers](https://www.socialgrowthengineers.com/studytok-formats-that-keep-winning) (article **sponsorisé**, source des chiffres non indiquée) : 1,4 à 1,7 M de vues |
| D | **Sketch du prof qui craque** | Point de départ absurde : le prof s'effondre parce que la classe a utilisé ChatGPT | Sketch chaotique, l'outil comme chute | non précisé | non précisé | non précisé | même source : 3,2 M et 9,5 M de vues |
| E | **« Motivation toxique »** | Phrase courte et sèche : « Lock in. » « No one is coming to save you. » « You're not tired, you're distracted. » | Récit construit autour de la phrase, retour à l'appli à la fin. Existe aussi sans visage | non précisé | non précisé | non précisé | même source : 4,9 M et 2,2 M de vues (version sans visage) |
| F | **« Tu as quelle moyenne ? / Tu révises avec quoi ? »** | Une question posée à un groupe d'étudiants | Deux camps opposés : mauvaise moyenne contre bonne moyenne avec le bon outil. Il existe aussi une variante en diaporama | non précisé | non précisé | non précisé | même source : 235 000 et 448 600 vues |
| G | **Routine d'étude avec l'appli dedans** | Titre façon routine : « 3 am school morning routine » | La journée filmée de bout en bout, l'appli n'est qu'une étape | non précisé | non précisé | non précisé | [Social Growth Engineers](https://www.socialgrowthengineers.com/two-studytok-formats-still-pulling-millions-of-views) (**sponsorisé**) : 4,8 M de vues |
| H | **Diaporama « ce qu'il ne faut pas faire »** | Titre : « the best study method » | Diaporama rapide des **erreurs** de révision, pas des bonnes habitudes | non précisé | Texte sur images | non précisé | même source : 6,2 M de vues |
| I | **« Study with me » / vidéo de compagnie** | Une ambiance : bureau, lumière, début de session | Longue session silencieuse ou en direct, qu'on laisse tourner en fond | souvent long (non précisé) | peu ou pas de texte | lo-fi, en général (**non vérifié**) | [Gain](https://blog.gainapp.com/tiktok-trends/), [Save My Exams](https://www.savemyexams.com/learning-hub/tiktok/biggest-tiktok-study-trends/), sans chiffres |
| J | **Quiz « mets pause et essaie »** | Une question posée au spectateur | Question, pause, réponse | non précisé | Grand texte | non précisé | [Viryze](https://viryze.com/blog/tiktok-education-trends-2026) : suscite commentaires, revisionnages et enregistrements (sans chiffres) |

Formats exclus pour BuddyEtude :
- D et les variantes « voix d'IA » (« AI Voice Tutoring », « l'IA oublie qu'elle n'est pas humaine », mêmes sources) : elles reposent sur une IA que le site n'a pas.
- I tel quel : il n'y a pas de salle d'étude en direct.

### 2.2 Applis de mise en relation

Je n'ai trouvé **aucune source sérieuse** sur la stratégie TikTok organique de Bumble BFF, de Hinge ou de Timeleft. Voici ce qui est documenté :

| # | Format / approche | Accroche | Structure | Durée | Sous-titres | Son | Source |
|---|---|---|---|---|---|---|---|
| K | **« Don't make ads, make TikToks » (Bumble)** | Une expérience vécue, racontée par un créateur | Plusieurs créateurs racontent ou jouent leur vécu avec l'appli | non précisé | non précisé | non précisé | [TikTok for Business, étude de cas Bumble](https://ads.tiktok.com/business/en/inspiration/bumble-81) (publicité **payante**, pas organique) |
| L | **La solitude comme angle (Timeleft)** | Des jeunes qui partent dîner avec des inconnus | Montrer la rencontre et le moment partagé, pas les fonctions de l'appli | non précisé | non précisé | non précisé | [RTE](https://www.rte.ie/lifestyle/living/2024/0319/1438734-would-you-dine-with-5-strangers-this-new-app-will-set-you-up), [interview du PDG](https://timfrin.substack.com/p/inside-timelefts-journey-to-connecting). Croissance surtout **payante** ; rien de propre à TikTok |

À retenir : ces marques vendent **le moment humain** (« enfin quelqu'un avec qui… »), pas leurs fonctionnalités.

### 2.3 Startups SaaS en croissance organique

| # | Format | Accroche | Structure | Durée | Sous-titres | Son | Source |
|---|---|---|---|---|---|---|---|
| M | **Démo du produit en 15 s** | Le résultat d'abord | Une seule fonctionnalité, montrée en entier | ~15 s | non précisé | non précisé | [Stackmatix](https://www.stackmatix.com/blog/tiktok-for-startups) |
| N | **Diaporama en 9 images (sans visage)** | Image 1 = accroche | Images 2 à 7 : une idée chacune · image 8 : la preuve · image 9 : **un seul** appel à l'action | non précisé | Texte sur chaque image | non précisé | [SlideTik](https://www.slidetik.ai/blog/tiktok-for-saas-founders-without-showing-face) (vend un outil de diaporamas) |
| O | **Point de vue du fondateur** | « Le problème qu'on entend tout le temps » ou « mon erreur de fondateur » | Le fondateur parle face caméra : un problème, puis ce qu'il a construit pour le résoudre | non précisé | non précisé | non précisé | [Stackmatix](https://www.stackmatix.com/blog/tiktok-for-startups), [ProdShort](https://prodshort.com/blog/how-to-grow-on-tiktok) |
| P | **Formats d'accroche mesurés** (TikTok en général) | 1. Montrer le résultat · 2. Poser son expertise · 3. Contredire une idée reçue · 4. Donner un chiffre précis · 5. Donner un ordre (« Arrête de scroller si… ») | — | — | — | — | [OpusClip](https://www.opus.pro/blog/tiktok-hooks-that-go-viral-2026), d'après **34 635 extraits** de janvier à mars 2026 analysés par OpusClip. « Montrer le résultat » arrive en tête (6 037 vues en moyenne à 7 jours, environ 2× le dernier type) |

**Accroches à éviter**, selon OpusClip : « Salut tout le monde, aujourd'hui… », « Alors… », « Tu t'es déjà demandé… », « Je vais te raconter la fois où… ».

### 2.4 Ce que les sources disent du « comment »

- **Les 3 premières secondes.** La plupart des guides en font le moment décisif. Une source fondée sur Reddit ([Wild & Free Tools](https://wildandfreetools.com/blog/best-tiktok-hooks-reddit-2026/)) estime que la règle « tout se joue en 1 seconde » s'est assouplie au profit d'une rétention sur 5 à 7 s, et que les accroches « POV: » ont **perdu en efficacité en 2025**. Les deux affirmations sont **non vérifiées**, et elles contredisent le succès du format A en 2026. Je suggère de tester les deux.
- **Fait main plutôt que trop léché.** Le contenu peu produit marche mieux que le contenu de studio ([Gain](https://blog.gainapp.com/tiktok-trends/)). C'est cohérent avec Knowunity : ses vidéos signalées comme publicités ont eu bien moins de « j'aime » que les autres ([viral.app](https://viral.app/blog/insights/knowunity-studytok-grade-rescue)).
- **Dire « gratuit » n'aide pas.** Sur environ 1 200 vidéos StudyTok dont la légende contient « free », la médiane est de 891 vues, contre 1 043 sans ce mot ([viral.app](https://viral.app/blog/insights/knowunity-studytok-grade-rescue)). « Gratuit » va donc dans la légende, pas dans l'accroche.
- **Le même son sur toute une série** : Knowunity a gardé le même son pour ses 17 versions d'un même format.
- **Les créateurs étudiants battent la marque.** Une vidéo d'un compte étudiant à 10 000 abonnés a fait 728 000 vues ; la meilleure vidéo du compte officiel de Notion, 62 800 ([Virlo](https://virlo.ai/resources/notion-marketing-strategy), analyse de 404 vidéos). Pour BuddyEtude, c'est un argument pour que **tu apparaisses toi-même à l'écran**, en tant qu'étudiant fondateur.
- **Rythme de publication** : 3 à 5 vidéos par semaine ([Stackmatix](https://www.stackmatix.com/blog/tiktok-growth-strategies-2026)). Il vaut mieux décliner quelques formats qui marchent que multiplier les vidéos uniques.
- **France** : POV sur Parcoursup ou les partiels ([75secondes](https://www.75secondes.fr/etudes/parcoursup/les-meilleurs-tik-tok-parcoursup)) ; tendance #minuteetudiante, sans doute antérieure à 2025 ([Le Bonbon](https://www.lebonbon.fr/paris/news/la-minute-etudiant-nouvelle-trend-tiktok/)) ; le compte @etreetudiant a été primé aux TikTok Awards 2025 France pour ses conseils pratiques ([Metricool](https://metricool.com/fr/tiktok-awards-2025-france/)). Je n'ai **pas trouvé** de source fiable sur les tendances « partiels » de 2025-2026 en France.

### 2.5 Zones sûres (1080×1920)

Les sources ne sont pas d'accord entre elles, et TikTok ne publie pas de chiffres officiels ([ManyPixels](https://www.manypixels.co/blog/social-media-design/tiktok-ad-specs), [Reap](https://reap.video/blog/short-form-video-safe-zones), [Adaptly](https://adaptlypost.com/blog/social-media-safe-zones-2026-complete-guide)) :

| Bord | Fourchette trouvée | Règle retenue |
|---|---|---|
| Haut | 108 à 240 px | 15 % = **288 px** libres |
| Bas | 320 à 480 px | 15 % = 288 px imposés par ton brief → je garde plutôt **420 px** libres pour les sous-titres (légende et nom du son de TikTok) |
| Droite | 120 à 173 px | **180 px** libres |
| Gauche | ~60 px | 60 px |

Je vérifierai sur une capture de l'interface TikTok avant chaque rendu final.

---

## 3. Ce que j'en retiens pour BuddyEtude

1. **Montrer le résultat ou la galère dès la première image**, jamais le logo. Cela correspond aux formats A, B et P1.
2. **Vendre le moment humain** : « enfin quelqu'un pour réviser ». C'est la vraie différence face aux applis d'IA (formats K et L).
3. **Des captures du vrai site, mais brèves** : 1 à 2 s par écran, une seule fonctionnalité par vidéo (format M). La plus visuelle est le tableau blanc avec un PDF annoté à deux.
4. **Toi face caméra**, au moins sur une partie des vidéos : point de vue du fondateur (O), galère vécue (B), « mains occupées » (C). Les comptes étudiants battent les comptes de marque.
5. **Des séries** : un même format décliné 5 à 10 fois avec le même son, plutôt que 10 formats tous différents.
6. **Pas de « gratuit » dans l'accroche**, pas de vocabulaire commercial. Pas de « télécharge l'appli » : c'est un site.

### Ce qui reste incertain
- Aucun chiffre ci-dessus ne concerne la France ni le public francophone.
- Les chiffres de vues de Social Growth Engineers viennent d'articles sponsorisés et ne précisent pas qui les a mesurés.
- Aucune source ne donne la durée, le style de sous-titres ou le type de musique pour ces formats. Mes choix sur ces points (sous-titres mot par mot, 15-30 s) viennent de la pratique courante, **pas d'une source**.

---

## 4. Tes vidéos de référence

_À remplir quand tu m'enverras tes liens et tes descriptions. Je les analyserai avec la même grille (accroche, structure, durée, sous-titres, son, source)._

| # | Lien | Accroche (0-2 s) | Structure | Durée | Sous-titres | Son | Ce qu'on peut reprendre |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
