import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const env = import.meta.env;

// Configuration du projet Firebase. Les valeurs par défaut sont celles de la production ;
// un projet de test (staging) se branche en définissant les variables VITE_FIREBASE_* (voir
// .env.example). Ces clés ne sont pas secrètes : la sécurité repose sur les règles Firestore
// et Storage, et sur App Check.
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyApvyiWr08dLFF-VvSIB9XSCttJxUI7E0Q",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "buddyetude.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "buddyetude",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "buddyetude.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "499725521618",
  appId: env.VITE_FIREBASE_APP_ID || "1:499725521618:web:e4be390098951a909d130b",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-NV45DCH23X",
};

// Mode développement sur émulateurs locaux (aucune donnée réelle touchée) :
//   firebase emulators:start --only auth,firestore,storage
//   VITE_USE_EMULATORS=true npm run dev
const useEmulators = env.VITE_USE_EMULATORS === "true";

const app = initializeApp(firebaseConfig);

// App Check : Firestore / Storage n'acceptent que les requêtes venant du vrai site (et non d'un
// script qui réutiliserait la clé API). Actif dès que la clé reCAPTCHA v3 est fournie ; à
// "imposer" ensuite dans la console Firebase (App Check → APIs → Appliquer).
if (!useEmulators && env.VITE_APPCHECK_SITE_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(env.VITE_APPCHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn("App Check non initialisé :", error);
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (useEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

// Analytics : pas en mode émulateur, et seulement si le navigateur le permet
export let analytics = null;
if (!useEmulators) {
  isAnalyticsSupported()
    .then((ok) => { if (ok) analytics = getAnalytics(app); })
    .catch(() => {});
}

export default app;
