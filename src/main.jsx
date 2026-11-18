import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n' // <-- Initialisation du système de langues

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
