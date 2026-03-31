import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // <-- 1. Nouvel import ajouté ici

const firebaseConfig = {
  apiKey: "AIzaSyApvyiWr08dLFF-VvSIB9XSCttJxUI7E0Q",
  authDomain: "buddyetude.firebaseapp.com",
  projectId: "buddyetude",
  storageBucket: "buddyetude.firebasestorage.app",
  messagingSenderId: "499725521618",
  appId: "1:499725521618:web:e4be390098951a909d130b",
  measurementId: "G-NV45DCH23X"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export des services pour les utiliser dans le reste de l'app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app); // <-- 2. Nouvel export ajouté ici

export default app;