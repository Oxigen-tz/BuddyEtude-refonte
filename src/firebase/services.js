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
      profile_complete: false // Indique s'il a rempli son niveau/matières
    });
  }
};