import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";

export const syncUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // Si l'utilisateur se connecte pour la toute première fois, on le sauvegarde
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      full_name: user.displayName || "Étudiant",
      display_name: user.displayName || "Étudiant",
      photoURL: user.photoURL || "",
      createdAt: new Date().toISOString(),
      profile_complete: false, // Indique s'il a rempli son niveau/matières
      profile_visible: true,   // Réglage "Visibilité du profil" (Paramètres)
    });
  }
};

// Les profils créés avant l'application de la visibilité dans les règles Firestore n'ont pas le
// champ profile_visible : ils n'apparaîtraient plus dans la recherche (qui filtre sur == true).
// Appelé à chaque ouverture de session : ajoute la valeur par défaut si elle manque.
export const ensureProfileDefaults = async (uid) => {
  if (!uid) return;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists() && typeof snap.data().profile_visible !== "boolean") {
      await setDoc(userRef, { profile_visible: true }, { merge: true });
    }
  } catch (error) {
    console.warn("Profil : valeurs par défaut non appliquées :", error);
  }
};
