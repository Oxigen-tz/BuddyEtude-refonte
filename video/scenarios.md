# BuddyEtude — la mini-série : 10 scénarios

Rédigé le 24/11/2026. Ces scénarios reprennent les 10 concepts de [docs/video/concepts.md](../docs/video/concepts.md), réécrits au format mini-série 3D low-poly, avec la signature validée dans [out/signature-test.mp4](out/signature-test.mp4).

## La bible de la série

**Les personnages**

| Personnage | Rôle | Apparence (moteur) |
|---|---|---|
| **Camille** | L'héroïne, en L2. Révise souvent seule, galère, mais finit toujours par trouver la bonne personne. | Tenue `hero` (sweat bleu) |
| **Léa** | Sa binôme, en L2 maths, même fac. Celle qui répond « Carrément ! ». | Tenue `binome` (rose), cheveux longs |
| **Hugo** | Étudiant en L3, niveau « Avancé » : il aide en mentorat. | Tenue `mentor` (vert) |
| **Sarah** | En L1 droit. Celle qui a « rien révisé » et qui a 18. | À créer (variante de tenue) |
| **Yanis** | En prépa MP, seul depuis septembre (épisode 10). | À créer |
| **Inès** | En prépa MP, même lycée que Yanis (épisode 10). | À créer |
| **Théo** | Le binôme fantôme. **On ne le voit jamais** : seulement sa fenêtre éteinte et « Vu à 14 h 02 ». | — |
| **Orbi** | La mascotte. Elle ne parle pas : elle apparaît, réagit, et c'est **elle qui tire le fil citron** entre deux fenêtres. | Mascotte `orbi` |

**Ce qui revient dans chaque épisode**
1. **La façade « deux fenêtres »**, au début ou au moment clé.
2. **Le citron réservé au lien** : il n'apparaît que lorsque deux personnes se connectent (le fil, les rebords qui s'allument, les cartes qui passent du violet au citron).
3. **Les phrases en bulles de discussion** (« … » puis le texte), avec les mots-clés passés au surligneur.
4. **La fin signature** : les deux anneaux du logo s'emboîtent (2 s, toujours identique).

**Les cartes d'interface**
- Elles sont en verre violet foncé, avec un bord qui devient citron quand un lien se crée.
- Elles reprennent **les vrais libellés du site** (vérifiés dans [src/i18n.js](../src/i18n.js)) avec des données de démo fictives, jamais de vraies données d'utilisateurs.
- **Correction importante** : le site n'affiche **pas** de pourcentage de compatibilité. Il trie les profils du plus compatible au moins compatible et affiche des badges : « 2 matières en commun », « Même niveau », « Même école », « Même ville ». Les cartes reprennent ces badges.

**Narration**
- Une voix enregistrée (la tienne ou une voix de synthèse), sur un ton parlé et étudiant.
- Débit visé : environ 2,5 mots par seconde.
- La bulle reprend **une version courte** de la phrase dite.
- Je livrerai pour chaque épisode un fichier de timings ; la piste audio reste vide.

**Comment lire les tableaux**
- **Plan** : `3D façade`, `3D chambre`, `3D amphi`, `3D BU` (bibliothèque) ou `UI` (carte d'interface en plein écran ou incrustée).
- **Bulle** : le texte à l'écran ; les `*mots*` entre astérisques sont surlignés.
- Les temps sont donnés en secondes.

---

## Classement et vue d'ensemble

| # | Titre | Galère de départ | Durée | Ce que l'épisode montre du site |
|---|---|---|---|---|
| 1 | 23 h 47 | Seule la veille du partiel | 40 s | Recherche, demande, messages, tableau blanc |
| 2 | Les 3 types | Humour : la faune des partiels | 35 s | Profil et session planifiée |
| 3 | Mets pause | Bloquée sur un exercice | 32 s | Appel vidéo et tableau blanc |
| 4 | Le binôme fantôme | Groupe de projet mort | 42 s | Groupes (jusqu'à 6) : discussion et tableau blanc communs |
| 5 | Deux versions | Seule ou à deux, la même soirée | 34 s | Messages, appel, tableau blanc, PDF |
| 6 | 4 gestes | « Trouver quelqu'un, c'est compliqué » | 30 s | Recherche → demande → acceptation |
| 7 | Le PDF | Le cours incompréhensible | 33 s | Import d'un PDF et annotations en direct |
| 8 | 5 erreurs | Les mauvaises habitudes | 40 s | Session planifiée et rappels |
| 9 | Hugo | Bloquée en physique | 40 s | Mentorat (« Trouver de l'aide ») |
| 10 | Prépa | Seul depuis septembre | 34 s | Badges, messages, session, tableau blanc |

---

## Épisode 1 — « 23 h 47 » (40 s)

> Camille révise seule la veille de son partiel, bloque, et trouve Léa.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | 3D façade | Deux fenêtres allumées dans la nuit, Camille en haut et Léa en bas, chacune à son bureau | *23 h 47.* | « Vingt-trois heures quarante-sept. » |
| 2,5-5 | 3D façade | Lent zoom sur la fenêtre de Camille | Partiel d'analyse *demain 8 h*. | « Camille a son partiel d'analyse demain, huit heures. » |
| 5-8 | 3D chambre | Camille, la tête dans les mains, expression fatiguée | Chapitre 3 : *rien compris*. | « Et le chapitre trois, elle n'y a rien compris. » |
| 8-11 | 3D chambre | Elle prend son téléphone, l'air inquiet | Le groupe de promo ? *Silence radio.* | « Le groupe de promo ? Personne ne répond. » |
| 11-13,5 | 3D chambre | Orbi apparaît en rebondissant à côté d'elle, et elle relève la tête | Sauf que… | (silence) |
| 13,5-19 | UI | Recherche « Analyse » : 3 profils triés. En premier, **Léa** (L2 Maths, badges « 2 matières en commun », « Même niveau », « Même école ») | Léa. Même fac. *Même chapitre.* | « Léa. Même fac, même niveau, même chapitre à bosser. » |
| 19-22 | 3D façade | Orbi tire le fil citron de la fenêtre de Camille vers celle de Léa | Une demande, *un petit mot*. | « Une demande, avec un petit mot. » |
| 22-26 | UI | Notification « Demande acceptée 🎉 », puis messages : « On attaque les intégrales ? » → « Carrément ! Tableau blanc dans 5 min 🙌 » | Elle *accepte*. | « Elle accepte. » |
| 26-32 | 3D chambre + UI incrustée | Camille tape, contente. En incrustation, le tableau blanc où deux traits de couleurs différentes avancent en même temps | Au tableau blanc, *à deux*. | « Et à deux, sur le même tableau blanc, le chapitre trois finit par rentrer. » |
| 32-36 | 3D façade | Les deux rebords sont citron et les deux étudiantes travaillent | *1 h 12.* Chapitre bouclé. | « Une heure douze. Chapitre bouclé. » |
| 36-38 | 3D façade | Lent recul de la caméra | Réviser seul, c'est *fini*. | « Réviser seul la veille, c'est fini. » |
| 38-40 | Fin signature | Anneaux, BuddyEtude, buddyetude.com | — | — |

**Légende** : « la veille du partiel c'est toujours la même histoire 😮‍💨 #etudiant #partiels #revisions #studytok #fac »

---

## Épisode 2 — « Les 3 types » (35 s)

> Humour : Orbi présente trois personnages typiques des partiels dans un amphi.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | 3D amphi | Trois étudiants assis au même rang, sous la lumière bleutée du projecteur. Orbi flotte au-dessus | Les 3 types d'étudiants *en partiels*. | « Les trois types d'étudiants en partiels. » |
| 2,5-8 | 3D amphi | Gros plan sur **Yanis**, qui surligne sa feuille ; elle devient entièrement citron | 1. Celui qui *surligne tout*. | « Un : celui qui surligne tout. Absolument tout. » |
| 8-9,5 | 3D amphi | Zoom sur la feuille, même le titre est surligné | (même le titre) | « Même le titre. » |
| 9,5-12 | 3D amphi | **Sarah** prend un air catastrophé | 2. Celle qui a *« rien révisé »*… | « Deux : celle qui n'a « rien révisé »… » |
| 12-15 | 3D amphi | Une copie notée 18/20 tombe devant elle et les deux autres la fixent | …et qui a *18*. | « …et qui a dix-huit. » |
| 15-22 | 3D amphi | **Camille**, sereine, téléphone en main, Orbi à côté d'elle | 3. Celle qui ne révise *jamais seule*. | « Trois : celle qui ne révise jamais seule. » |
| 22-28 | UI | Profil de Léa (badges), puis carte session « Révision d'analyse · Demain 18:00 · Appel vidéo inclus » | Binôme trouvé, *session calée*. | « Elle a trouvé un binôme, calé une session, et elle arrive sereine. » |
| 28-33 | 3D amphi | Les trois personnages de face, Orbi au-dessus avec un « ? » | Et toi, t'es *lequel* ? 👇 | « Et toi, t'es lequel ? Dis-le en commentaire. » |
| 33-35 | Fin signature | | | |

**Légende** : « sois honnête 👀 #etudiant #partiels #studytok #humouretudiant #fac »

---

## Épisode 3 — « Mets pause » (32 s)

> Un quiz : Camille bloque sur une intégrale et Léa l'aide à la résoudre en appel vidéo.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | UI (tableau blanc plein écran) | L'énoncé est déjà écrit : **∫₀^π sin(x) dx = ?** | Tu sais résoudre ça ? *Mets pause.* | « Tu sais résoudre ça ? Mets pause. » |
| 2,5-5,5 | UI | Compte à rebours ; Orbi rebondit à chaque chiffre | 3… 2… 1… | « Trois, deux, un. » |
| 5,5-10 | 3D chambre | Camille, perplexe, se gratte la tête au-dessus de sa feuille | Camille, elle, *bloque*. | « Camille, elle, bloque. » |
| 10-13 | 3D façade | Le fil citron part vers la fenêtre de Léa. Une icône d'appel vidéo apparaît sur les deux fenêtres | Alors elle appelle *Léa*. | « Alors elle appelle Léa. » |
| 13-17 | UI (tableau blanc) | Trait violet de Camille : « primitive de sin x = −cos x » | Primitive : *−cos x*. | « La primitive de sinus, c'est moins cosinus. » |
| 17-21 | UI | Trait citron de Léa, en même temps : « [−cos x]₀^π = −cos π + cos 0 » | On évalue *entre 0 et π*. | « On évalue entre zéro et pi… » |
| 21-25 | UI | « = 1 + 1 = 2 » s'entoure en citron | = *2* ✅ | « …un plus un : deux. » |
| 25-30 | 3D façade | Les deux rebords sont citron, Camille lève les bras (pose victoire) | T'avais trouvé ? *Réponds* 👇 | « T'avais trouvé ? Réponds en commentaire. » |
| 30-32 | Fin signature | | | |

Calcul vérifié : −cos π + cos 0 = 1 + 1 = 2. **Déclinable en série** avec un énoncé par matière.

**Légende** : « niveau L1, ça passe ou pas ? 🤔 #maths #etudiant #studytok #revisions #defi »

---

## Épisode 4 — « Le binôme fantôme » (42 s)

> Un groupe de projet où personne ne bosse, et Théo qui ne répond jamais.

La messagerie de la scène d'ouverture est **générique** : elle n'imite l'interface ni le logo d'aucune vraie appli.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-3 | 3D chambre | Camille sur son téléphone (pose téléphone) | Projet de groupe. *Rendu vendredi.* | « Projet de groupe, rendu vendredi. » |
| 3-8 | UI (messagerie générique) | Groupe « Projet éco 📊 » : les messages défilent (« qqn a commencé ? », « jsp », « mdr », « on fait ça demain »), compteur 87 | 87 messages. *0 slide.* | « Quatre-vingt-sept messages. Zéro slide. » |
| 8-12 | 3D façade | La fenêtre du bas est **éteinte** : chaise vide, lampe éteinte. Une étiquette flotte : « Théo · Vu à 14:02 » | Et Théo ? *Vu à 14 h 02.* | « Et Théo ? Vu à quatorze heures deux. Depuis, rien. » |
| 12-15 | 3D chambre | Camille, la tête dans les mains | Le binôme *fantôme*. | « Le classique binôme fantôme. » |
| 15-17 | 3D chambre | Orbi apparaît | Plan B. | « Plan B. » |
| 17-23 | UI | Carte « Créer un groupe » : nom « Partiels de L2 éco », matière « Macro ». Les membres s'ajoutent un par un (Léa, Hugo, Sarah), compteur 4 / 6 | Un groupe avec *tes binômes*. | « Tu crées un groupe avec tes binômes. Jusqu'à six. Ceux qui bossent vraiment. » |
| 23-29 | UI | Discussion du groupe, puis le tableau blanc commun qui se remplit de 4 couleurs | Discussion *et* tableau blanc communs. | « Une discussion, un tableau blanc commun, et tout le monde avance. » |
| 29-35 | 3D façade (4 fenêtres) | Quatre fenêtres allumées, reliées par des fils citron | Vendredi : *rendu*. | « Vendredi : rendu. » |
| 35-40 | 3D façade | Zoom sur la fenêtre de Théo, toujours éteinte | Théo : *toujours* vu à 14 h 02. | « Et Théo ? Toujours vu à quatorze heures deux. » |
| 40-42 | Fin signature | | | |

Ce que je ne fais pas dire : on ne prétend pas que BuddyEtude sert à faire des diapositives ou à partager des documents de projet. On montre seulement la discussion et le tableau blanc du groupe, qui existent ([Groups.jsx](../src/pages/Groups.jsx)). Un groupe ne contient que des binômes déjà acceptés.

**Légende** : « on a tous un Théo 💀 #etudiant #projetdegroupe #fac #studytok #promo »

---

## Épisode 5 — « Deux versions » (34 s)

> La même soirée vécue deux fois : fenêtre du haut, Camille seule ; fenêtre du bas, Camille avec Léa.

Sur la façade, une petite étiquette indique « SEULE » sur la fenêtre du haut et « À DEUX » sur celle du bas.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | 3D façade | Les deux fenêtres avec leurs étiquettes | Même soirée. *Deux versions.* | « Même soirée, deux versions. » |
| 2,5-7 | 3D façade + UI incrustée | En haut : elle relit la même page. En bas : carte message « on fait le chap. 3 ? » | *20 h* | « Vingt heures. En haut, Camille relit la même page. En bas, elle écrit à Léa. » |
| 7-12 | 3D façade + UI | En haut : pose téléphone, visage éclairé par l'écran. En bas : carte appel vidéo + tableau blanc | *21 h* | « Vingt-et-une heures. En haut, petite pause téléphone. En bas, appel vidéo et tableau blanc. » |
| 12-17 | 3D façade + UI | En haut : toujours au téléphone, l'air fatigué. En bas : carte PDF annoté à deux | *22 h* | « Vingt-deux heures. En haut, la pause continue. En bas, elles annotent le cours ensemble. » |
| 17-22 | 3D façade | En haut : la tête dans les mains, un « ? » au-dessus. En bas : Camille lève les bras | *23 h* | « Vingt-trois heures. En haut, bloquée. En bas, l'exercice est enfin compris. » |
| 22-27 | UI (deux cartes) | Haut : « 1 exercice ». Bas : « Chapitre bouclé ✅ ». La carte du bas passe au citron | *Bilan.* | « Bilan. » |
| 27-32 | 3D façade | Les deux fenêtres côte à côte, Orbi entre les deux | Laquelle t'es *ce soir* ? | « Et toi, t'es laquelle ce soir ? » |
| 32-34 | Fin signature | | | |

**Légende** : « la différence est violente 😭 #etudiant #revisions #studytok #partiels #motivation »

---

## Épisode 6 — « 4 gestes » (30 s)

> Trouver un binôme, montré en quatre étapes avec Sarah.

On remplace le concept « en 7 secondes » : ce temps avait été mesuré avec une saisie automatique, alors qu'une vraie personne va moins vite. Compter les étapes, en revanche, est exact.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | 3D chambre | Sarah à son bureau ; Orbi lève quatre « doigts » lumineux | Trouver un binôme en *4 gestes*. | « Trouver un binôme d'études, en quatre gestes. » |
| 2,5-7 | UI | Champ « Filtrer par matière » : on tape « Droit des contrats » | 1. Ta *matière*. | « Un : tu tapes ta matière. » |
| 7-12 | UI | Liste triée. En premier, Camille, avec les badges « Même école » et « 2 matières en commun » | 2. Le plus *compatible* en premier. | « Deux : les profils les plus compatibles sont en haut. » |
| 12-17 | UI | Bouton « Contacter », puis le petit mot « Hello ! On révise les contrats ensemble jeudi ? » | 3. Un *petit mot*. | « Trois : tu te présentes en une phrase. » |
| 17-21 | UI | « Envoyer » → « Demande envoyée » | 4. *Envoyé.* | « Quatre : envoyé. » |
| 21-26 | 3D façade | Le fil va de la fenêtre de Sarah à celle de Camille, puis notification « Demande acceptée 🎉 » | Si elle accepte, *la discussion s'ouvre*. | « Si elle accepte, la discussion s'ouvre. » |
| 26-28 | 3D façade | Les deux rebords citron | Gratuit. Lien *en bio*. | « C'est gratuit, le lien est en bio. » |
| 28-30 | Fin signature | | | |

Ici, « gratuit » est dit en fin de vidéo, pas dans l'accroche (voir [recherche](../docs/video/recherche.md) §2.4).

**Légende** : « c'est vraiment tout 🤷 #etudiant #droit #studytok #revisions #binome »

---

## Épisode 7 — « Le PDF » (33 s)

> Camille et Léa, chacune chez elle, annotent le même cours en direct.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | UI (tableau blanc) | Le résultat d'emblée : une page de cours couverte d'annotations violettes et citron | Ton cours PDF, *annoté à deux*. | « Ton cours en PDF, annoté à deux. » |
| 2,5-6 | 3D chambre | Camille devant son écran, perdue | Le cours de bio cell. *Incompréhensible.* | « Le prof a mis le cours en ligne. Et personne n'y comprend rien. » |
| 6-10 | 3D façade | Les deux fenêtres, ordinateur allumé de chaque côté | Camille et Léa, *chacune chez soi*. | « Camille et Léa sont chacune chez elles. » |
| 10-14 | UI | « Importer un PDF », puis « Import 2/3 », puis « 3 pages importées : annotez-les ! » | Elle importe *le PDF*… | « Camille importe le PDF dans le tableau blanc… » |
| 14-21 | 3D façade + UI | Les deux écrans montrent la même page : le trait que trace Camille apparaît chez Léa, et le fil citron pulse | …et Léa le voit *en direct*. | « …et chaque trait qu'elle trace apparaît en direct chez Léa. » |
| 21-26 | UI | « Page suivante », puis « Exporter » | Page suivante, *export en image*. | « Page suivante, et à la fin, on exporte en image. » |
| 26-31 | 3D façade | Les deux fenêtres citron | Fini les captures du cours *en vrac*. | « Fini les captures d'écran envoyées en vrac. » |
| 31-33 | Fin signature | | | |

Vérifié dans [Whiteboard.jsx](../src/pages/Whiteboard.jsx) : PDF de 30 Mo maximum, plusieurs pages, export en image. Ce sont les **annotations** qui se synchronisent en direct ; le PDF sert de fond à la page.

**Légende** : « fini les captures d'écran du cours 🙃 #etudiant #revisions #studytok #fac #astuce »

---

## Épisode 8 — « 5 erreurs » (40 s)

> Orbi présente cinq erreurs de révision ; Camille les commet une par une.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | 3D chambre | Camille, avec un grand ❌ citron qui se dessine devant elle | 5 erreurs qui ruinent *tes révisions*. | « Cinq erreurs qui ruinent tes révisions. » |
| 2,5-8 | 3D chambre | Elle relit en boucle, les paupières qui tombent | 1. Relire sans *se tester*. | « Un : relire, relire, relire… sans jamais se tester. » |
| 8-13 | 3D chambre | Les feuilles deviennent entièrement citron | 2. Tout *surligner*. | « Deux : tout surligner. Donc rien. » |
| 13-18 | 3D chambre | Le téléphone vibre sur le bureau et elle le prend | 3. Le téléphone *à côté*. | « Trois : le téléphone posé à côté. « Juste deux minutes. » » |
| 18-23 | UI | Calendrier de la semaine : tout est empilé sur la veille | 4. Tout garder pour *la veille*. | « Quatre : tout garder pour la veille. » |
| 23-30 | 3D chambre → 3D façade | La tête dans les mains, puis Orbi tire le fil vers Léa | 5. Rester *bloqué seul*. | « Et cinq : rester bloqué seul une heure, alors qu'une explication de cinq minutes aurait suffi. » |
| 30-35 | UI | Carte session « Révision d'analyse · Jeudi 18:00 · Appel vidéo inclus · Rappel la veille et 1 h avant » | Une session *calée à l'avance*. | « Une session calée à l'avance, avec un rappel la veille : ça règle la quatre et la cinq. » |
| 35-38 | 3D chambre | Camille, sereine | Enregistre pour *tes partiels* 📌 | « Enregistre la vidéo pour tes partiels. » |
| 38-40 | Fin signature | | | |

Les conseils restent du **bon sens**, sans chiffres ni études inventées. Les rappels par e-mail la veille et une heure avant sont vérifiés dans [functions/index.js](../functions/index.js) (`sessionReminders`).

**Légende** : « la 3 c'est tout le monde 💀 #revisions #methodedetravail #etudiant #studytok #partiels »

---

## Épisode 9 — « Hugo » (40 s)

> Camille bloque en physique et demande de l'aide à Hugo, un étudiant avancé.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | 3D chambre | Camille devant un schéma d'onde, avec un petit nuage de fumée au-dessus de la tête | Bloquée en physique ? *Demande à un avancé.* | « Bloquée en physique ? Demande à un étudiant avancé. » |
| 2,5-6 | 3D chambre | Elle se prend la tête dans les mains | Ondes stationnaires. *Le néant.* | « Ondes stationnaires. Le néant total. » |
| 6-11 | UI | Onglet « Trouver de l'aide » : « Hugo · L3 Physique · Avancé · Peut t'aider en Physique » | Des étudiants *avancés* qui aident. | « Dans l'onglet « Trouver de l'aide », il y a des étudiants avancés qui acceptent d'aider. » |
| 11-15 | UI | « Demande d'aide en Physique » : « Je bloque sur les ondes stationnaires, tu aurais 30 min cette semaine ? » | Tu dis *où* tu bloques. | « Tu dis précisément où tu bloques. » |
| 15-20 | 3D BU | Hugo à une table de la bibliothèque, lampe verte. Il reçoit la notification et regarde son écran | Hugo accepte *s'il a le temps*. | « Hugo, en L3, accepte s'il a le temps. Rien n'est obligatoire. » |
| 20-23 | 3D façade | Le fil va de la fenêtre de Camille à celle d'Hugo | La discussion *s'ouvre*. | « La discussion s'ouvre. » |
| 23-31 | UI (tableau blanc) | Hugo dessine l'onde ; les étiquettes « nœud » et « ventre » apparaissent | Nœuds, ventres… *ah, d'accord.* | « Il dessine l'onde, les nœuds, les ventres… et d'un coup, ça devient logique. » |
| 31-36 | 3D chambre | Camille, pose victoire | Et un jour, *c'est toi* qui aideras. | « Et dans une matière où tu es avancé, un jour, c'est toi qui aideras. » |
| 36-38 | 3D chambre | Orbi avec un « ? » | Tu bloques sur quoi *en ce moment* ? 👇 | « Tu bloques sur quoi en ce moment ? » |
| 38-40 | Fin signature | | | |

Vérifié : l'onglet « Trouver de l'aide », le niveau « Avancé » par matière, « Peut t'aider en… », la « Demande d'aide en {matière} », et le fait que les avancés choisissent d'aider ou non (`landing.mentor`, [Search.jsx](../src/pages/Search.jsx)).

**Légende** : « l'entraide entre étudiants >>> #physique #etudiant #studytok #entraide #fac »

---

## Épisode 10 — « Prépa » (34 s)

> Yanis, en prépa, révise seul depuis septembre, jusqu'à ce qu'Orbi le relie à Inès. Un ton plus sombre, avec des coupes sèches.

| Temps | Plan | Ce qui se passe | Bulle | Narration |
|---|---|---|---|---|
| 0-2,5 | 3D chambre (lampe seule, presque noir) | Yanis, de dos, sous la lampe | Personne ne révisera *à ta place*. | « Personne ne révisera à ta place. » |
| 2,5-4,5 | 3D chambre (gros plan) | La pile de livres | Pas ton prof. | « Pas ton prof. » |
| 4,5-6,5 | 3D chambre (gros plan) | Le téléphone, écran éteint | Pas le groupe de promo. | « Pas le groupe de promo. » |
| 6,5-9 | 3D chambre (gros plan) | Le réveil : 01:12 | Pas la veille au soir. | « Pas la veille au soir. » |
| 9-14 | 3D façade (une seule fenêtre allumée dans tout l'immeuble) | Lent zoom arrière sur la fenêtre de Yanis | Yanis, prépa MP. *Seul depuis septembre.* | « Yanis, prépa MP. Il révise seul depuis septembre. » |
| 14-17 | Noir | Écran noir | Mais… | « Mais… » |
| 17-21 | 3D façade | Orbi s'allume, le fil traverse la façade et une deuxième fenêtre s'allume : **Inès** | quelqu'un peut réviser *avec* toi. | « …quelqu'un peut réviser avec toi. » |
| 21-27 | UI (4 cartes de 1,5 s) | Profil « Prépa · Même école · 3 matières en commun », message « Khôlle de maths lundi, on s'entraîne ? », session « Dim. 15:00 · Appel vidéo inclus », tableau blanc | Même prépa. *Même rythme.* | « Même prépa, même rythme, mêmes khôlles. » |
| 27-32 | 3D façade | Les deux fenêtres citron, tous deux au travail | Lock in. *À deux.* | « Lock in. Mais à deux. » |
| 32-34 | Fin signature | | | |

Vérifié : le niveau « Prépa » et le badge « Même école » existent ([src/i18n.js](../src/i18n.js), `search.levels`, `buddyCard.match`).

**Légende** : « lock in 🔒 #prepa #cpge #etudiant #studytok #motivation »

---

## Ce qu'il faudra construire pour l'étape 3

| Élément | Épisodes | État |
|---|---|---|
| Façade 2 fenêtres, fil, Orbi | tous | ✅ fait |
| Chambre, Personnage (poses, expressions), fin signature, bulles | tous | ✅ fait |
| Façade avec **N fenêtres**, fenêtre éteinte, étiquettes (« SEULE », « Vu à 14:02 ») | 4, 5, 10 | à faire |
| **CarteUI** : recherche/profil avec badges, demande et notification, messages, session, tableau blanc animé (traits, texte, PDF), groupe, aide, import PDF, calendrier, bilan, messagerie générique | tous | à faire |
| Décor **amphi** | 2 | à faire |
| Décor **bibliothèque (BU)** | 9 | à faire |
| Accessoires : feuille surlignée, copie 18/20, téléphone qui vibre, réveil, pile de livres, nuage de fumée, « ? » | 2, 8, 9, 10 | à faire |
| Nouvelles tenues : Sarah, Yanis, Inès | 2, 6, 10 | à faire |
| Fichier de timings de narration par épisode | tous | à faire |

**À toi de choisir** : dis-moi les épisodes à produire (tous, ou les premiers pour commencer), et tes corrections éventuelles de texte ou de narration.
