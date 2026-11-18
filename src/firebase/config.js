import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApvyiWr08dLFF-VvSIB9XSCttJxUI7E0Q",
  authDomain: "buddyetude.firebaseapp.com",
  projectId: "buddyetude",
  storageBucket: "buddyetude.firebasestorage.app",
  messagingSenderId: "499725521618",
  appId: "1:499725521618:web:e4be390098951a909d130b",
  measurementId: "G-NV45DCH23X"
};

// Mode développement sur émulateurs locaux (aucune donnée réelle touchée) :
//   firebase emulators:start --only auth,firestore,storage
//   VITE_USE_EMULATORS=true npm run dev
// Jamais actif en production : la variable n'est définie que pour ce lancement.
const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export des services pour les utiliser dans le reste de l'app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (useEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

// Analytics : pas en mode émulateur, et seulement si le navigateur le permet
// (getAnalytics plantait l'app dans les environnements sans cookies / IndexedDB)
export let analytics = null;
if (!useEmulators) {
  isAnalyticsSupported()
    .then((ok) => { if (ok) analytics = getAnalytics(app); })
    .catch(() => {});
}

export default app;
