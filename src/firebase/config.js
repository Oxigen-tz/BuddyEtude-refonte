import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, ReCaptchaV3Provider } from "firebase/app-check";

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
// script qui réutiliserait la clé API). Actif dès que la clé est fournie ; à "imposer" ensuite
// dans la console Firebase (App Check → APIs → Appliquer).
// Fournisseur : Fraud Defense / reCAPTCHA Enterprise par défaut ; VITE_APPCHECK_PROVIDER=v3 pour
// l'ancien reCAPTCHA v3 (obsolète).
if (!useEmulators && env.VITE_APPCHECK_SITE_KEY) {
  try {
    const AppCheckProvider = env.VITE_APPCHECK_PROVIDER === "v3" ? ReCaptchaV3Provider : ReCaptchaEnterpriseProvider;
    initializeAppCheck(app, {
      provider: new AppCheckProvider(env.VITE_APPCHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn("App Check non initialisé :", error);
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Fonctions appelables (page Modération), même région que les Cloud Functions
export const functions = getFunctions(app, "europe-west1");

// Ports des émulateurs : ceux de firebase.json par défaut, modifiables (VITE_EMULATOR_*_PORT)
// pour lancer une seconde série d'émulateurs à côté d'une première.
if (useEmulators) {
  const port = (name, fallback) => Number(env[`VITE_EMULATOR_${name}_PORT`]) || fallback;
  connectAuthEmulator(auth, `http://127.0.0.1:${port("AUTH", 9099)}`, { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", port("FIRESTORE", 8080));
  connectStorageEmulator(storage, "127.0.0.1", port("STORAGE", 9199));
  connectFunctionsEmulator(functions, "127.0.0.1", port("FUNCTIONS", 5001));
}

// Pas de Google Analytics : il dépose des cookies de mesure d'audience qui exigent un
// bandeau de consentement (CNIL). Les statistiques d'usage sont dans la page Modération.

export default app;
