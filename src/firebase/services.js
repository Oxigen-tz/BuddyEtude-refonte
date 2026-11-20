import { doc, setDoc, getDoc, deleteField } from "firebase/firestore";
import { db } from "./config";

// Création du profil à la première connexion. L'email n'y est PAS stocké : le profil est
// lisible par les autres étudiants, l'email reste dans le compte de connexion (Auth).
export const syncUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      // Pas de nom par défaut : le nouvel inscrit choisit le sien en créant son profil
      full_name: user.displayName || "",
      display_name: user.displayName || "",
      photo_url: user.photoURL || "",
      createdAt: new Date().toISOString(),
      profile_complete: false, // Indique s'il a rempli son niveau/matières
      profile_visible: true,   // Réglage "Visibilité du profil" (Paramètres)
    });
  }
};

// Appelé à chaque ouverture de session :
//  - crée le profil s'il n'existe pas (connexion par e-mail ou Microsoft, session restaurée) ;
//  - ajoute profile_visible aux anciens profils (la recherche filtre sur ce champ) ;
//  - retire l'email des anciens profils (il était visible par tous les inscrits).
export const ensureProfileDefaults = async (user) => {
  if (!user?.uid) return;
  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await syncUserProfile(user);
      return;
    }
    const data = snap.data();
    const patch = {};
    if (typeof data.profile_visible !== "boolean") patch.profile_visible = true;
    if ("email" in data) patch.email = deleteField();
    if (Object.keys(patch).length) await setDoc(userRef, patch, { merge: true });
  } catch (error) {
    console.warn("Profil : valeurs par défaut non appliquées :", error);
  }
};

// Préférences privées (lisibles par le seul propriétaire et par les Cloud Functions)
export const privateSettingsRef = (uid) => doc(db, "users", uid, "private", "settings");
