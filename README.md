# BuddyEtude

Plateforme de mise en relation entre étudiants pour réviser à deux : recherche de binômes par
compatibilité (matières, niveau, ville), messagerie avec pièces jointes, sessions avec lien d'appel
vidéo et rappels, tableau blanc collaboratif en temps réel, modération.

## Stack

- **React 18** + **Vite 6**, routage `react-router-dom`, **Tailwind CSS** + composants **shadcn/ui**
- **Firebase** : Authentication (Google, Microsoft, e-mail), Firestore, Storage, Cloud Functions, App Check
- **i18next** : interface en français et en anglais (`src/i18n.js`)
- **Sentry** (facultatif) : suivi des erreurs

## Démarrer en local

Prérequis : Node.js 24, et Java 21 pour les émulateurs Firebase.

```bash
npm install
npm run dev          # http://localhost:5173, branché sur le projet Firebase de production
```

### Travailler sans toucher aux vraies données (émulateurs)

```bash
npm run emulators                         # terminal 1 : auth, Firestore, Storage, Functions
VITE_USE_EMULATORS=true npm run dev       # terminal 2 (Git Bash)
```

Sous PowerShell : `$env:VITE_USE_EMULATORS="true"; npm run dev`. La connexion Google propose de
faux comptes (« Add new account »). Données et e-mails générés (collection `mail`) :
http://127.0.0.1:4000.

## Tests

| Commande                 | Ce qui est vérifié                                                         |
| ------------------------ | -------------------------------------------------------------------------- |
| `npm run lint`           | ESLint                                                                     |
| `npm run test:rules`     | 89 cas : règles Firestore et Storage (qui peut lire / écrire quoi)          |
| `npm run test:functions` | 8 cas : e-mails, anti-spam, rappels de session, compteur public             |
| `npm run test:e2e`       | Scénario complet dans Chrome avec trois étudiants (23 étapes)              |
| `npm test`               | Les trois suites de tests                                                  |

Les tests tournent sur les émulateurs (projet fictif `demo-buddyetude`). Le scénario de bout en
bout utilise Google Chrome installé (ou `CHROME_PATH=/chemin/vers/chrome`) ; en cas d'échec, une
capture de chaque navigateur est enregistrée dans `tests/e2e/output/`.

GitHub Actions (`.github/workflows/ci.yml`) lance lint, build et les trois suites à chaque push
sur `main` et à chaque pull request.

> **Windows** : il arrive qu'un émulateur reste ouvert après un test (« port taken » au lancement
> suivant). Le fermer dans le Gestionnaire des tâches (processus `java.exe`) ou redémarrer le
> terminal.

## Structure

```
src/
  pages/        Une page par fichier, déclarée dans pages.config.js (chargement à la demande)
  components/   Composants par domaine + ui/ (shadcn) + AuthDialog (fenêtre de connexion)
  hooks/        useRequests, useUnreadMessages, useBlocks
  lib/          AuthContext, pairs (id de paire), matching (compatibilité), sessions (dates, .ics)
  firebase/     Configuration et services
  i18n.js       Traductions FR / EN
functions/      Cloud Functions (e-mails, rappels, compteur)
tests/          rules/, functions/, e2e/
```

## Modèle de données

Tout est identifié par **uid** ; l'email n'est jamais stocké dans les données lisibles par les
autres utilisateurs. Une paire d'étudiants a un identifiant fixe `<uid1>_<uid2>` (uids triés).

| Collection                       | Contenu                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `users/{uid}`                    | Profil public (visible si `profile_visible == true`)                    |
| `users/{uid}/private/settings`   | Privé : tranche d'âge, accord parental, préférence e-mails              |
| `requests/{paire}`               | Demande de binôme : `pending` → `accepted` ; supprimée si refus/retrait |
| `messages`                       | `chatId` = paire, `participants`, `unreadBy` (non-lus)                  |
| `sessions`                       | Sessions (`start_at`, lien d'appel, rappels envoyés)                    |
| `feedback/{session}_{uid}`       | Avis après session (lisible par la modération uniquement)               |
| `whiteboards/{paire}/strokes`    | Un document par trait du tableau blanc                                  |
| `blocks/{bloqueur}_{bloqué}`     | Blocages                                                                |
| `reports`                        | Signalements (traités dans la page Modération)                          |
| `admins/{uid}`                   | Comptes de modération (créés à la main dans la console)                 |
| `stats/public`                   | Compteur d'étudiants de l'accueil (tenu par une Cloud Function)         |
| `mail`                           | File d'e-mails, lue par l'extension « Trigger Email »                   |

Les règles (`firestore.rules`) imposent notamment : messages, sessions et tableau blanc réservés
aux binômes (demande acceptée), plus aucune création pour un compte banni, aucune demande possible
vers quelqu'un qui vous a bloqué.

## Mise en production

À faire dans cet ordre (le nouveau code et les nouvelles règles vont ensemble) :

1. **Déployer le site** sur Vercel (push sur `main`), et attendre la fin du déploiement.
2. **Déployer les règles, les index et les fonctions** :
   ```bash
   firebase deploy --only firestore,storage,functions
   ```
   Les Cloud Functions demandent le plan Blaze (déjà actif). Adresse du site utilisée dans les
   e-mails : paramètre `APP_URL` (demandé au premier déploiement, défaut `https://buddyetude.fr`).
3. **Installer l'extension « Trigger Email from Firestore »** (console Firebase → Extensions),
   collection `mail`, avec le serveur SMTP d'un service d'envoi (Brevo, Mailjet… ont des offres
   gratuites). Sans elle, les e-mails restent dans la collection `mail` sans être envoyés.
4. **Activer les connexions Microsoft et e-mail** : console Firebase → Authentication → Méthodes
   de connexion. Microsoft demande une « inscription d'application » dans Azure (Microsoft Entra ID)
   pour obtenir l'identifiant et le secret client. Le bouton « Continuer avec Microsoft » n'apparaît qu'avec la
   variable `VITE_ENABLE_MICROSOFT=true` (Vercel, puis redéployer). L'inscription Azure demande
   un annuaire Microsoft Entra (compte Azure gratuit) : un compte Microsoft personnel seul ne suffit pas.
5. **Créer les comptes de modération** : Firestore → collection `admins` → document dont l'id est
   le uid du compte (Authentication → Utilisateurs), avec un champ quelconque.
6. **Initialiser le compteur** `stats/public.studentCount` au nombre de profils complets existants
   (la fonction le tient ensuite à jour).
7. **App Check** (protection contre l'usage de la clé API hors du site) : console Firebase →
   App Check → enregistrer l'app web avec reCAPTCHA v3, mettre la clé de site dans la variable
   `VITE_APPCHECK_SITE_KEY` (Vercel), redéployer, vérifier les métriques, puis « Appliquer ».
8. **Facultatif** : `VITE_SENTRY_DSN` pour le suivi des erreurs (sentry.io).

Variables d'environnement : voir `.env.example`. Un projet Firebase de test (staging) se branche
avec les variables `VITE_FIREBASE_*`.

### Données existantes

Le passage de l'email à l'uid rend invisibles les anciennes demandes, conversations et sessions
(créées au format email). Les profils sont conservés : leur email est retiré automatiquement à la
prochaine connexion de chacun.

## Ajouter une traduction

Toute chaîne affichée passe par `t('clé')` : ajouter la clé dans les blocs `fr` **et** `en` de
`src/i18n.js`. Les pluriels utilisent les suffixes `_one` / `_other`.
