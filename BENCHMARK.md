# Benchmark : 10 sites de référence pour BuddyEtude

Fait le 26/11/2026. Cible : étudiants de 17 à 25 ans, qui arrivent surtout de TikTok, sur téléphone.

**Méthode**
- Pages d'accueil publiques uniquement : aucune connexion, aucun compte créé, aucun formulaire envoyé, aucun clic.
- Captures Playwright en 390×844 (mobile) et 1280×800 (bureau), rangées hors du dépôt, dans le dossier temporaire de la session (`scratchpad/benchmark/<site>/`).
- Un sous-agent par site. On retient des **principes**, jamais des textes, logos ou visuels.

**Limites, à garder en tête**
- **Superprof** bloque les navigateurs automatisés (page « accès restreint »). Je ne l'ai pas contourné et l'ai remplacé par **Arc**.
- **Arc** affiche en ce moment une page d'adieu : le navigateur s'arrête le 22/12/2026. Analysée telle quelle.
- **Headspace** montrait une page de promotion, en anglais (version américaine).
- Sur mobile, un **bandeau cookies** masquait une partie du premier écran chez 6 sites sur 10. Les fiches s'appuient alors sur la version bureau et sur le texte de la page.

---

## 1. Fiches par site

### Mise en relation

**Hinge** (hinge.co)
- **Structure :** photo plein écran, une promesse « anti-appli » (l'appli veut que tu la quittes), un mot du titre entouré à la main, un témoignage signé sur fond sombre, la presse.
- **Appel à l'action :** une pastille « télécharger » dans l'en-tête.
- **Preuve sociale :** un seul témoignage, une caution scientifique, aucun chiffre.
- **Style :** titres à empattements éditoriaux, fond crème, un seul accent violet.
- **Mobile :** une idée par écran, alternance de sections claires et sombres.
- **À retenir :** une promesse honnête et décalée, et une annotation manuscrite sur un mot clé.

**Bumble For Friends** (bumble.com/fr/bff)
- **Promesse :** trouver sa « tribu », au tutoiement.
- **Mise en page :** titre énorme, jaune dominant, formes organiques, autocollants inclinés, ton humoristique.
- **Mini-quiz :** des pastilles à toucher (« je n'ai pas la main verte »…) font sentir la mise en relation avant l'inscription.
- **Points faibles :** preuve sociale faible, newsletter avec captcha trop tôt.
- **À retenir :** un mini-quiz à pastilles.

**Meetup** (meetup.com)
- **Structure :** recherche (événement et ville) dès l'en-tête, puis cartes concrètes avec des avatars et « 22 participants », catégories en carrousel, « Comment ça marche » en 3 étapes.
- **Habillage :** des pictogrammes remplacent les mots clés du titre ; des étiquettes ludiques sont posées sur les photos (« Tous les jeudis »).
- **Preuve sociale :** indirecte, par les participants affichés sur chaque carte.
- **À retenir :** montrer de vraies cartes, et des étiquettes de contexte sur les visuels.

*(Superprof : bloqué, voir les limites.)*

### Prise en main et fidélisation

**Duolingo** (fr.duolingo.com)
- **Premier écran :** la mascotte en scène, une promesse qui met le « fun » avant l'efficacité.
- **Boutons :** un seul bouton plein, tutoyé, et un bouton secondaire « J'ai déjà un compte », répétés en fin de page.
- **Style :** boutons épais avec une ombre basse, effet tactile.
- **Mobile :** pas de menu, une idée par écran. Le ton tutoie partout, jusqu'au bandeau cookies, écrit avec la voix de la mascotte.
- **À retenir :** la mascotte au premier écran, et « J'ai déjà un compte » à côté du bouton principal.

**Headspace** (headspace.com)
- **Sélecteur d'intention :** « quel genre de… cherches-tu ? », 6 lignes tactiles (stress, sommeil…), chacune avec une icône et une flèche.
- **Bouton principal :** une pilule de couleur contrastée, répétée dans l'en-tête, avec une ligne de réassurance juste en dessous.
- **Preuve sociale :** très fournie (avis, logos, chiffres, note de la boutique d'applications).
- **Style :** mascotte simple et rassurante, couleurs chaudes saturées.
- **À retenir :** le sélecteur « Tu cherches quoi ? » qui mène à l'inscription.

**BeReal** (bereal.com)
- **Structure :** fond noir, promesse courte au tutoiement sur une photo de vrais amis, puis 3 blocs (titre court, 2 lignes, capture de téléphone). La page fait environ 4 écrans.
- **Ce qui manque :** aucun chiffre, aucun avis, et le bouton est un simple lien texte.
- **À retenir :** un bloc = un titre, deux lignes et une capture. Et la brièveté.

### Pages produit

**Linear** (linear.app)
- **Premier écran :** une vraie capture de l'appli démarre dès le premier écran sur mobile, rognée sur le bord pour inviter à défiler.
- **Rythme :** chaque section suit le même gabarit court (visuel, titre, une phrase, un lien).
- **Bouton :** l'inscription est dans la barre fixe du haut.
- **Style :** quasi monochrome, beaucoup d'air.
- **À retenir :** le produit visible au premier écran.

**Notion** (notion.com/fr)
- **Au-dessus du titre :** une rangée d'avatars dessinés.
- **Le titre :** un mot mis en valeur dans une pastille colorée.
- **Le bouton :** « gratuitement » figure dans chaque bouton.
- **Preuve sociale :** logos, 3 témoignages, chiffres.
- **Style :** fond blanc, un seul accent.
- **À retenir :** mettre « gratuit » dans le texte même du bouton, et un mot surligné plutôt qu'un dégradé.

**Raycast** (raycast.com)
- **Premier écran :** fond quasi noir, un seul visuel d'ambiance (bandes diagonales avec du grain), un titre très court.
- **Défaut :** sur mobile, aucun bouton de conversion au premier écran, et une page d'environ 19 écrans.
- **À retenir :** un seul visuel d'ambiance plutôt que plusieurs halos. L'erreur à éviter : un premier écran mobile sans bouton.

**Arc** (arc.net, page d'adieu)
- **Mise en page :** un seul message et un seul bouton au premier écran, des signatures manuscrites d'utilisateurs en filigrane, une FAQ repliée en fin de page.
- **Style :** titres à empattements expressifs et corps sobre.
- **À retenir :** un mur de prénoms en filigrane, uniquement avec de vrais prénoms et l'accord des étudiants.

---

## 2. TOP 10 des améliorations pour BuddyEtude

Classées par rapport impact / effort (S = moins d'une demi-journée, M = 1 à 2 jours, L = plus).

| # | Amélioration | Effort | Inspiré de |
|---|---|---|---|
| 1 | Barre d'action fixe sur mobile et lien « Connexion » visible | S | Headspace, Duolingo, Linear |
| 2 | Bouton principal plus explicite, avec « gratuit » | S | Notion, Duolingo |
| 3 | Un mot surligné en citron au lieu du titre en dégradé | S | Notion, Hinge |
| 4 | Retirer les surtitres, les numéros et « Fais défiler » | S | Linear, BeReal |
| 5 | Le produit visible dès le premier écran mobile | M | Linear, BeReal |
| 6 | « Tu cherches quoi ? » : binôme, aide ou groupe | M | Headspace, Bumble |
| 7 | Remplacer la galerie horizontale par 3 blocs courts | M | BeReal, Linear |
| 8 | Raccourcir la page : 8 sections, c'est long | M | BeReal, Meetup |
| 9 | Une vraie preuve sociale, signée | S (code) | Hinge, Meetup, Arc |
| 10 | Orbi sur le site, pas seulement sur TikTok | M | Duolingo, Headspace |

**1. Barre d'action fixe sur mobile et lien « Connexion » visible**
- **Problème actuel :**
  - Sur téléphone, le bouton d'inscription disparaît dès qu'on défile.
  - « Connexion » est masqué ([HomeNavbar.jsx:59](src/components/home/HomeNavbar.jsx#L59), `hidden sm:inline-flex`). Un étudiant qui revient depuis TikTok ne trouve pas comment se connecter.
- **Modification :**
  - Une barre fixe en bas, visible sur mobile une fois le premier écran passé. Elle contient le bouton principal et un lien « J'ai déjà un compte », avec la marge de sécurité de l'iPhone.
  - Afficher « Connexion » dans l'en-tête dès 390 px, en lien texte.

**2. Bouton principal plus explicite, avec « gratuit »**
- **Problème actuel :**
  - Le bouton dit « C'est parti ! » ([i18n.js:520](src/i18n.js#L520)) : ça ne dit ni l'action, ni le prix.
  - Ce texte est en plus le même que celui de Duolingo.
- **Modification :** un texte qui nomme l'action (du type « Trouver mon binôme »), avec la mention « gratuit » dans le bouton ou juste en dessous. La ligne de confiance existe déjà ([HeroSection.jsx:113](src/components/home/HeroSection.jsx#L113)) : la rapprocher du bouton.

**3. Un mot surligné en citron au lieu du titre en dégradé**
- **Problème actuel :** le titre utilise `text-gradient animate-shine` ([HeroSection.jsx:83](src/components/home/HeroSection.jsx#L83)), comme le manifeste ([Manifesto.jsx:10](src/components/home/Manifesto.jsx#L10)). C'est un code typique des sites générés.
- **Modification :** titre blanc, avec un seul mot (« binôme ») surligné au feutre citron, ou entouré d'un trait dessiné à la main en SVG. C'est le surligneur des vidéos TikTok, ce qui relie le site et les vidéos.

**4. Retirer les surtitres, les numéros et « Fais défiler »**
- **Problème actuel :**
  - Surtitres en petites capitales : [SectionHeading.jsx:19](src/components/home/SectionHeading.jsx#L19), utilisé par la FAQ, le mentorat et la sécurité ; [FeaturesSection.jsx:141](src/components/home/FeaturesSection.jsx#L141) ; [HowItWorks.jsx:132](src/components/home/HowItWorks.jsx#L132).
  - Numéros « 01 », « 02 »… sur les cartes ([FeaturesSection.jsx:108](src/components/home/FeaturesSection.jsx#L108)).
  - Indication « Fais défiler » ([HeroSection.jsx:141](src/components/home/HeroSection.jsx#L141)).
- **Modification :** les supprimer et laisser les titres porter les sections. Le rythme vient de l'alternance des fonds, comme chez Hinge.

**5. Le produit visible dès le premier écran mobile**
- **Problème actuel :** sur téléphone, le premier écran ne montre que du texte. La maquette de l'appli ([HeroSection.jsx](src/components/home/HeroSection.jsx), bloc `stageRef`) n'arrive qu'après défilement, et les cartes flottantes sont masquées sous 640 px (`hidden sm:block`).
- **Modification :** faire dépasser le haut d'une vraie carte de binôme (initiales, badges « 3 matières en commun · Même niveau », bouton « Contacter ») sous les boutons, rognée par le bas de l'écran. Retirer l'inclinaison 3D sur mobile.

**6. « Tu cherches quoi ? » : binôme, aide ou groupe**
- **Problème actuel :** l'accueil présente tout au même niveau. Pourtant, l'appli distingue déjà deux modes, « Trouver un binôme » et « Trouver de l'aide » ([Search.jsx](src/pages/Search.jsx), `mode`), en plus des groupes.
- **Modification :**
  - Juste après le premier écran, 3 lignes tactiles avec une icône et une flèche : « Réviser à deux », « Débloquer une matière », « Réviser en groupe ».
  - Chacune ouvre l'inscription ([AuthDialog.jsx](src/components/AuthDialog.jsx)), puis amène sur le bon mode après la création du profil.
  - Variante plus ludique, inspirée de Bumble : des pastilles d'habitudes (« plutôt le soir », « en dernière minute »).

**7. Remplacer la galerie horizontale par 3 blocs courts**
- **Problème actuel :** la galerie fait défiler 6 cartes identiques de droite à gauche pendant qu'on fait défiler la page vers le bas ([FeaturesSection.jsx](src/components/home/FeaturesSection.jsx), hauteur `100svh + distance`). Sur téléphone, c'est long et déroutant.
- **Modification :** 3 blocs verticaux : trouver, discuter et réviser en visio, tableau blanc. Chacun a un titre, 2 lignes et une capture réelle de l'appli. Les 3 autres fonctions passent en une ligne d'icônes.

**8. Raccourcir la page : 8 sections, c'est long**
- **Problème actuel :** [Home.jsx:34-41](src/pages/Home.jsx#L34-L41) enchaîne le premier écran, le manifeste, « Comment ça marche », la galerie, le mentorat, la sécurité, la FAQ et l'appel final. Le manifeste (texte qui s'éclaire mot à mot) et « Comment ça marche » se recoupent.
- **Modification :** fondre le manifeste dans « Comment ça marche ». Viser environ 5 sections sur mobile : premier écran, intention, 3 blocs, confiance et FAQ, appel final.

**9. Une vraie preuve sociale, signée**
- **Problème actuel :** la seule preuve sociale est un compteur d'étudiants, affiché uniquement au-dessus d'un seuil ([HeroSection.jsx:31](src/components/home/HeroSection.jsx#L31), `SOCIAL_PROOF_THRESHOLD`). Il n'y a ni témoignage, ni activité visible.
- **Modification :**
  - Un témoignage unique, signé (prénom, filière, ville), sur un bloc violet sombre.
  - Plus tard, quand les chiffres le permettront, un compteur « sessions organisées cette semaine ».
- **Condition :** uniquement de vrais retours, recueillis avec l'accord des étudiants. Le code est rapide, le délai dépend de la collecte des retours.

**10. Orbi sur le site, pas seulement sur TikTok**
- **Problème actuel :** la mascotte n'existe que dans les vidéos ([video/src/engine/Mascotte.tsx](video/src/engine/Mascotte.tsx)). Quelqu'un qui vient de TikTok ne la retrouve pas sur le site.
- **Modification :**
  - Exporter des images fixes d'Orbi depuis le projet vidéo (`npm run still`), en WebP transparent.
  - Les placer au premier écran (petite, à côté du titre), dans les états vides de l'appli et sur la page d'erreur 404.
  - Aucune nouvelle dépendance.

**Pistes plus lourdes, hors TOP 10 (L)**
- Un aperçu anonymisé de profils avant l'inscription, comme Meetup et ses cartes. Il faut revoir les règles Firestore et la confidentialité.
- Une « série » de sessions hebdomadaires, comme les séries de Duolingo, pour la fidélisation. À doser pour ne pas culpabiliser.

---

## 3. Ce que BuddyEtude fait déjà mieux

- **Aucun bandeau cookies**, puisqu'il n'y a aucun outil de suivi.
  - Chez 6 sites sur 10, le bandeau masquait le titre ou le bouton du premier écran sur mobile.
  - C'est un vrai avantage : il faut le garder, et donc refuser les pixels publicitaires.
- **Le tutoiement**, désormais cohérent dans tout le site, et le même que dans les vidéos. Seuls BeReal, Bumble et Duolingo le font aussi.
- **La confiance visible près du bouton :** « Étudiants vérifiés », « Données en Europe », « 100 % gratuit ».
  - Aucun site de mise en relation analysé n'affiche de vérification.
  - Headspace et Notion parlent de gratuité, mais à travers une promotion ou un essai.
- **Une mise en relation expliquée.**
  - Les badges disent pourquoi un profil est proposé : matières en commun, même niveau.
  - Hinge et Bumble restent opaques sur leur algorithme.
  - Les maquettes de l'accueil n'affichent plus les faux pourcentages : elles montrent les mêmes badges que l'appli.
- **Tout au même endroit :** messagerie, appel vidéo et tableau blanc intégrés. Meetup ou Bumble envoient vers d'autres outils une fois le contact établi.
- **Une FAQ structurée pour Google** (données structurées FAQPage), et maintenant les comptes TikTok et Instagram déclarés (`sameAs`).
- **Dans l'appli :** une navigation en bas d'écran et le bloc « À faire maintenant ». Aucune des pages produit étudiées (Linear, Notion, Raycast) ne montre son expérience mobile en vrai.
