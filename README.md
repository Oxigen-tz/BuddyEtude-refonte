# BuddyEtude

Plateforme de mise en relation entre étudiants pour réviser à deux : recherche de binômes par matière, niveau et ville, messagerie avec partage de fichiers, planification de sessions et tableau blanc collaboratif en temps réel.

## Stack

- **React 18** + **Vite 6**, routage avec `react-router-dom`
- **Tailwind CSS** et composants **shadcn/ui** (`src/components/ui`)
- **Firebase** : Authentication (Google), Firestore, Storage
- **i18next** : interface en français et en anglais (`src/i18n.js`)

## Démarrer en local

Prérequis : Node.js 18 ou plus récent.

```bash
npm install
npm run dev
```

L'application est servie sur http://localhost:5173.

## Scripts

| Commande          | Rôle                                     |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Serveur de développement                 |
| `npm run build`   | Build de production dans `dist/`         |
| `npm run preview` | Sert le build de production en local     |
| `npm run lint`    | Vérification ESLint                      |

## Structure

```
src/
  pages/        Une page par fichier, déclarée dans pages.config.js
  components/   Composants par domaine (home, profile, search) + ui/ (shadcn)
  firebase/     Initialisation Firebase et services
  lib/          Contexte d'authentification, préférences locales, page 404
  i18n.js       Traductions FR / EN
```

## Données Firestore

| Collection    | Contenu                                                         |
| ------------- | --------------------------------------------------------------- |
| `users`       | Profil étudiant (id = uid Firebase)                             |
| `requests`    | Demandes de binôme (`pending` → `accepted`, supprimée si refus) |
| `messages`    | Messages, regroupés par `chatId` (emails triés, joints par `_`) |
| `sessions`    | Sessions de révision planifiées                                 |
| `whiteboards` | Image du tableau blanc partagé (id = `chatId` du binôme)        |
| `reports`     | Signalements de profils                                         |
| `stats`       | Document `public` : compteur `studentCount` affiché sur l'accueil |

### Compteur d'étudiants (accueil)

L'accueil lit `stats/public.studentCount`, lisible sans compte. `Profile.jsx` l'incrémente de 1
quand un profil est complété pour la première fois. Les règles correspondantes sont dans
`firestore.rules` (bloc `stats/public`).

Pour initialiser le compteur avec les profils déjà existants, créer à la main dans la console le
document `stats/public` avec un champ `studentCount` (nombre) égal au nombre de documents `users`
dont `profile_complete` vaut `true`.

## Ajouter une traduction

Toute chaîne affichée passe par `t('clé')`. Ajouter la clé dans les deux blocs `fr` et `en` de `src/i18n.js`.

## Règles de sécurité Firestore

Elles sont versionnées dans `firestore.rules` (référencé par `firebase.json`). Pour les déployer :

```bash
firebase deploy --only firestore:rules,storage
```

Chaque collection n'est accessible qu'aux personnes concernées : les messages, sessions et
tableaux blancs portent un champ `participants` (les deux emails) que les règles vérifient.

Les règles Storage (`storage.rules`) rangent les pièces jointes du chat dans
`chat_files/<uid>/` : chacun n'écrit que dans son dossier, 10 Mo maximum, sans exécutables,
et un fichier envoyé ne peut pas être remplacé.

## Déploiement

Le projet est configuré pour Vercel (`vercel.json`) et Firebase Hosting (`firebase.json`) : les deux redirigent toutes les routes vers `index.html`.
