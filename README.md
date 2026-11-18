# BuddyEtude

Plateforme de mise en relation entre étudiants pour réviser à deux ou en groupe : recherche de
binômes par compatibilité (matières, école, niveau, ville), messagerie avec pièces jointes, groupes
de révision, sessions avec lien d'appel vidéo et rappels, tableau blanc collaboratif multipage
(import de PDF), notifications par e-mail et push, application installable, modération.

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

Sous PowerShell : `$env:VITE_USE_EMULATORS="true"; npm run dev`. Les fonctions ont besoin de deux fichiers locaux
(non versionnés) : `functions/.env.local` avec `APP_URL=http://localhost:5173` et
`SMTP_USER=test@smtp.local`, et `functions/.secret.local` avec `SMTP_PASSWORD=emulator`
(aucun e-mail réel n'est envoyé en local). La connexion Google propose de
faux comptes (« Add new account »). Données et e-mails générés (collection `mail`) :
http://127.0.0.1:4000.

## Tests

| Commande                 | Ce qui est vérifié                                                         |
| ------------------------ | -------------------------------------------------------------------------- |
| `npm run lint`           | ESLint                                                                     |
| `npm run test:rules`     | 112 cas : règles Firestore et Storage (qui peut lire / écrire quoi)         |
| `npm run test:functions` | 15 cas : e-mails, rappels, résumé du lundi, statistiques, nettoyage, purges |
| `npm run test:e2e`       | Scénario complet dans Chrome avec trois étudiants (29 étapes)              |
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
functions/      Cloud Functions (e-mails, rappels, compteur, modération, purges)
tests/          rules/, functions/, e2e/
```

## Modèle de données

Tout est identifié par **uid** ; l'email n'est jamais stocké dans les données lisibles par les
autres utilisateurs. Une paire d'étudiants a un identifiant fixe `<uid1>_<uid2>` (uids triés).

| Collection                       | Contenu                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `users/{uid}`                    | Profil public (visible si `profile_visible == true`)                    |
| `users/{uid}/private/settings`   | Privé : tranche d'âge, accord parental, préférences e-mails / résumé    |
| `users/{uid}/private/push`       | Privé : jetons des appareils pour les notifications push                |
| `requests/{paire}`               | Demande de binôme : `pending` → `accepted` ; supprimée si refus/retrait |
| `messages`                       | `chatId` = paire, `participants`, `unreadBy` (non-lus)                  |
| `sessions`                       | Sessions (`start_at`, lien d'appel, rappels envoyés)                    |
| `feedback/{session}_{uid}`       | Avis après session (lisible par la modération uniquement)               |
| `whiteboards/{paire ou grp-id}`  | Tableau blanc : `pageCount`, fonds PDF (`backgrounds`), traits (`strokes`) |
| `groups/{id}` (+ `messages`)     | Groupes de révision (6 membres max) et leur discussion                  |
| `blocks/{bloqueur}_{bloqué}`     | Blocages                                                                |
| `reports`                        | Signalements (traités dans la page Modération, purgés après 1 an)       |
| `admins/{uid}`                   | Comptes de modération (créés à la main dans la console)                 |
| `stats/public`                   | Compteur d'étudiants de l'accueil (tenu par une Cloud Function)         |
| `mail`                           | File d'e-mails, envoyés par la fonction `deliverMail` (SMTP Brevo)     |

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
   e-mails : paramètre `APP_URL` (demandé au premier déploiement, défaut `https://buddyetude.com`).
3. **Configurer l'envoi des e-mails** (Brevo, offre gratuite : 300 e-mails/jour). Domaine
   authentifié dans Brevo (enregistrements DNS DKIM/DMARC), expéditeur
   `notifications@buddyetude.com`, puis une clé SMTP (SMTP et API → Générer une clé SMTP) :
   ```bash
   firebase functions:secrets:set SMTP_PASSWORD     # coller la clé SMTP Brevo
   firebase deploy --only functions                 # demande SMTP_USER (identifiant « Connexion »)
   ```
   La fonction `deliverMail` envoie chaque document de la collection `mail` et note le résultat
   dans son champ `delivery.state` (`SUCCESS` ou `ERROR` avec `delivery.error`). Aucune
   extension Firebase n'est nécessaire.
4. **Activer les connexions Microsoft et e-mail** : console Firebase → Authentication → Méthodes
   de connexion. Microsoft demande une « inscription d'application » dans Azure (Microsoft Entra ID)
   pour obtenir l'identifiant et le secret client. Le bouton « Continuer avec Microsoft » n'apparaît qu'avec la
   variable `VITE_ENABLE_MICROSOFT=true` (Vercel, puis redéployer). L'inscription Azure demande
   un annuaire Microsoft Entra (compte Azure gratuit) : un compte Microsoft personnel seul ne suffit pas.
5. **Créer les comptes de modération** : Firestore → collection `admins` → document dont l'id est
   le uid du compte (Authentication → Utilisateurs), avec un champ quelconque.
6. **Initialiser le compteur** `stats/public.studentCount` au nombre de profils complets existants
   (la fonction le tient ensuite à jour).
7. **App Check** (protection contre l'usage de la clé API hors du site) : créer une clé
   **Fraud Defense** (ancien reCAPTCHA Enterprise, console Google Cloud → Sécurité), type site web,
   domaines du site ; l'enregistrer dans Firebase → App Check → app web → Fraud Defense ; mettre la
   même clé dans la variable `VITE_APPCHECK_SITE_KEY` (Vercel), redéployer, vérifier les métriques,
   puis « Appliquer ».
8. **Facultatif** : `VITE_SENTRY_DSN` pour le suivi des erreurs (sentry.io).
9. **Notifications push** : console Firebase → Paramètres du projet → Cloud Messaging →
   Certificats Web Push → Générer une paire de clés ; mettre la clé dans `VITE_FCM_VAPID_KEY`
   (Vercel) et redéployer. Le réglage « Notifications sur cet appareil » apparaît alors dans
   Paramètres (sur iPhone : seulement une fois le site ajouté à l'écran d'accueil).
10. **Export des pages PDF du tableau blanc** (facultatif) : autoriser la lecture des images depuis
   le site : `gcloud storage buckets update gs://buddyetude.firebasestorage.app --cors-file=storage.cors.json`.
   Sans cela, l'export d'une page avec un PDF en fond ne contient que les dessins.

Variables d'environnement : voir `.env.example`. Un projet Firebase de test (staging) se branche
avec les variables `VITE_FIREBASE_*`.

### Données existantes

Le passage de l'email à l'uid rend invisibles les anciennes demandes, conversations et sessions
(créées au format email). Les profils sont conservés : leur email est retiré automatiquement à la
prochaine connexion de chacun.

## Modération et vie privée

- **Page Modération** (comptes listés dans `admins`) : statistiques (fonction `adminStats`),
  signalements, avis négatifs, et nettoyage des données de l'ancien format
  (`adminCleanupLegacy` : « Analyser » compte sans rien supprimer, puis confirmation).
- **Purge quotidienne** (`dailyPurge`, 4 h) : e-mails envoyés après 30 jours, avis et
  signalements traités après 1 an, comptes sans connexion depuis 3 ans (sauf modération).
- **Suppression d'un compte** (`onUserDeleted`) : efface aussi les données privées et les avis.
- Pas de Google Analytics (cookies soumis à consentement) : les chiffres d'usage sont dans la
  page Modération.

Ces durées sont celles annoncées dans la Politique de confidentialité (`privacy.sections` dans
`src/i18n.js`) : les modifier aux deux endroits.

## Ajouter une traduction

Toute chaîne affichée passe par `t('clé')` : ajouter la clé dans les blocs `fr` **et** `en` de
`src/i18n.js`. Les pluriels utilisent les suffixes `_one` / `_other`.
