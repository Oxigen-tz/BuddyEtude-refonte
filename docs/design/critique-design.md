# Critique design de BuddyEtude

Faite le 26/11/2026 à partir de captures :
- de la **page d'accueil en ligne** (buddyetude.com), sur téléphone (390 px) et sur ordinateur (1440 px) ;
- de l'**application en local**, avec les profils de démo (Camille, Léa, Hugo, Sarah).

Grille utilisée : la méthode de critique du dépôt *Impeccable* (charge mentale, 10 heuristiques de Nielsen, personas), lue sans l'installer, et son « socle de qualité ».

Deux principes guident la lecture :
- **La page d'accueil est en mode « Persuader »** : elle doit convaincre et faire agir.
- **L'application est en mode « Opérer »** : elle doit être claire, régulière et rapide sur téléphone.

Personas retenus : **Jordan**, l'étudiant qui découvre (il arrive de TikTok) ; **Casey**, l'étudiant pressé sur téléphone, d'une seule main ; **Riley**, le testeur qui pousse dans les cas limites.

---

## Ce qui fonctionne déjà (à garder)

- **Barre de navigation du bas** avec 5 onglets légendés et un badge de messages non lus : exactement ce qu'il faut sur mobile.
- **Cartes de profil** lisibles. Les badges « 3 matières en commun · Même niveau · Même ville » expliquent le tri sans jargon, et l'action principale est claire (« Contacter », « Répondre à sa demande »).
- **Palette cohérente**, du violet de la marque au citron des accents, avec de bons contrastes sur fond clair.
- **États vides utiles** (« Prochaines sessions », « Nouveaux contacts ») : ils proposent toujours une action.
- **Confiance visible** : « Étudiants vérifiés », « Données hébergées en Europe », signalement, appel « rien n'est enregistré ».
- **Champs de formulaire en 16 px** : pas de zoom intempestif sur iPhone.

---

## Points à corriger, par priorité

### P1 — Fort impact, à faire en premier

**1. Tutoiement et vouvoiement mélangés, parfois dans le même bloc.**
- Accueil public : « Trouvez votre binôme… Ne révisez plus seul » (vous), mais « rejoins les premiers étudiants », « Fais défiler » (tu).
- Section « Comment ça marche » : « Crée ton profil », « Trouve ton binôme »… puis « **Révisez** ensemble ».
- Application : « Prêt à booster **vos** révisions », « Bienvenue sur **votre** espace », mais « Invite **tes** camarades ».
- Pour des 17-25 ans qui arrivent de TikTok, où les vidéos tutoient, choisir **le tutoiement partout**. C'est une modification de textes dans `src/i18n.js`, la mise en page ne change pas.

**2. La page d'accueil promet des pourcentages de compatibilité que l'application n'affiche pas.**
- La carte « Binômes compatibles » montre 94 %, 81 % et 67 % ([FeaturesSection.jsx:15](../../src/components/home/FeaturesSection.jsx#L15)). Dans l'application, il n'y a aucun pourcentage : seulement des badges.
- Un nouvel inscrit cherche ce chiffre et ne le trouve pas. Remplacer par les vrais badges (« 3 matières en commun », « Même niveau »).

**3. L'accueil de l'application ne montre pas ce qui attend l'étudiant.**
- Dans la démo, Camille a **une demande d'Hugo en attente** et **un message non lu**. L'accueil ne mentionne ni l'un ni l'autre : on y voit la liste d'étapes du tutoriel (2 sur 3, déjà faites) et deux cartes génériques.
- Il faudrait, en haut, un bloc **« À faire maintenant »** : demandes reçues (Accepter / Voir), messages non lus, prochaine session. La liste d'étapes passerait en version compacte dès que 2 étapes sur 3 sont faites.

**4. Recherche sur mobile : les filtres occupent tout le premier écran.**
- Recherche par nom, matière, ville, niveau, mode, plus l'interrupteur « vérifiés » : le premier profil n'apparaît qu'après défilement. Le texte d'aide est en plus coupé (« Filtrer par matière (ex: Droit, Ciném »).
- Garder **la recherche et la matière**, et mettre le reste derrière un bouton **« Filtres »** qui ouvre un panneau, avec le nombre de filtres actifs. Le premier profil devient visible tout de suite.

### P2 — À faire ensuite

**5. Premier écran de l'accueil sur téléphone : que du texte.**
- Le produit (la maquette du tableau blanc) n'apparaît qu'après défilement. Sur un téléphone, on ne voit qu'un titre et des boutons.
- Trois codes typiques des sites « faits par IA », que la grille Impeccable déconseille explicitement :
  - le **titre en dégradé de couleur** ;
  - la **pastille au-dessus du titre** (« Nouveau : le mentorat… ») et les **surtitres** en petites capitales (« COMMENT ÇA MARCHE », « TOUT AU MÊME ENDROIT ») ;
  - les **numéros de section** (01, 02…) sur des cartes toutes identiques.
- La solution qui colle à la marque : un titre blanc avec **un seul mot surligné en citron**, comme dans les vidéos TikTok, et un aperçu du produit dans le premier écran. On supprime aussi « Fais défiler ».

**6. Pas de bouton « Connexion » visible sur mobile.** L'en-tête ne montre que « Inscription ». Un étudiant qui revient depuis TikTok, donc sur son téléphone, doit deviner que la connexion se trouve dans la fenêtre d'inscription. Ajouter un lien « Connexion » visible.

**7. Conversation sur mobile.**
- Le nom est coupé (« Léa Mar… ») par trois boutons d'icônes.
- L'icône du tableau blanc (un stylo) n'est pas évidente sans libellé.
- Le bouton **« Retirer ce binôme »** est collé aux boutons d'appel : une confirmation existe, mais l'action destructrice n'a rien à faire là.
- Les icônes modifier et supprimer sont affichées en permanence à côté de chaque message.
- Mettre « Retirer le binôme » dans un menu « ⋯ », ajouter des libellés courts (« Appel », « Tableau »), et n'afficher modifier/supprimer qu'au toucher du message.

**8. Nouvelle session : un long formulaire.** Pré-remplir le binôme quand il n'y en a qu'un, et proposer un titre par défaut (« Révision avec Léa »). L'étudiant n'a plus qu'à choisir la date et l'heure.

### P3 — Finitions

**9.** L'icône « signaler » (triangle) sur chaque carte de profil attire l'œil. La placer dans un menu « ⋯ », toujours accessible.

**10.** Le vert sert à la fois aux actions de session et à « Répondre à sa demande », le violet au reste. Vérifier que cette règle de couleurs est voulue et appliquée partout.

**11.** Sur la capture pleine page de l'accueil, de grandes zones paraissent vides. Elles viennent sans doute des animations au défilement, mais c'est à **vérifier sur un vrai téléphone** : si elles apparaissent en défilant vite, on perd du monde.

---

## Notes (sur 4, heuristiques de Nielsen)

| Heuristique | Note | En bref |
|---|---|---|
| Visibilité de l'état du système | 3 | Badges, toasts et progression présents ; l'accueil ne remonte pas les demandes |
| Correspondance avec le monde réel | 3 | Langage simple ; tutoiement et vouvoiement mélangés |
| Contrôle et liberté | 3 | Annuler, retour et confirmations présents |
| Cohérence et standards | 2 | Ton incohérent, promesse de pourcentages absente de l'application |
| Prévention des erreurs | 3 | Confirmations ; action destructrice trop exposée dans la conversation |
| Reconnaissance plutôt que mémoire | 3 | Navigation légendée ; quelques icônes sans libellé |
| Souplesse et efficacité | 2 | Peu de raccourcis ; formulaire de session sans valeurs par défaut |
| Esthétique et minimalisme | 2 | Recherche mobile chargée, codes « IA » sur l'accueil |
| Gestion des erreurs | 3 | Messages clairs dans les textes du site |
| Aide et documentation | 3 | FAQ, tutoriel de démarrage, textes d'aide |
| **Total** | **27 / 40** | **Solide. Les gains viennent surtout de la cohérence et du mobile** |

---

## Ordre conseillé

1. Ton (tutoiement partout) et pourcentages de l'accueil : rapide, et ça touche tout le monde dès aujourd'hui.
2. Bloc « À faire maintenant » sur l'accueil de l'application, et filtres repliés sur la recherche mobile.
3. Premier écran de la page d'accueil sur téléphone, et lien « Connexion ».
4. Conversation, formulaire de session, finitions.

Rien n'a été modifié dans le code : cette critique décrit, elle ne corrige pas.
