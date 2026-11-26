import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { i18nReady } from './i18n' // Initialisation du système de langues

// Suivi des erreurs (Sentry) : uniquement si VITE_SENTRY_DSN est défini. Chargé à part pour ne
// pas alourdir le premier affichage ; les erreurs survenant avant son chargement sont perdues.
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.MODE,
      // Pas d'adresses e-mail ni d'IP envoyées à Sentry
      sendDefaultPii: false,
      tracesSampleRate: 0,
    });
  }).catch(() => {});
}

// Application installable et notifications push : service worker en production seulement
// (en développement, il garderait d'anciennes versions en cache).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Après une mise en ligne, un onglet resté ouvert (fréquent sur téléphone) réclame des fichiers
// de l'ancienne version, qui n'existent plus : la page ne réagissait plus (ex. « Accéder à mon
// espace »). On recharge alors une fois la page pour récupérer la nouvelle version.
window.addEventListener('vite:preloadError', (event) => {
  try {
    const last = Number(sessionStorage.getItem('reloadedForUpdate') || 0);
    if (Date.now() - last < 60000) return; // déjà rechargé il y a moins d'une minute : on n'insiste pas
    sessionStorage.setItem('reloadedForUpdate', String(Date.now()));
  } catch { /* stockage indisponible : on recharge quand même */ }
  event.preventDefault();
  window.location.reload();
});

// En anglais, on attend le chargement des textes anglais (en français : immédiat)
i18nReady.then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
