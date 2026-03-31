import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config'; 
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { syncUserProfile } from '../firebase/services'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. ON FORCE L'UTILISATEUR (Faux profil pour la démo)
  const [user, setUser] = useState({
    uid: "demo-12345",
    email: "jury@pepite.fr",
    full_name: "Jury Pépite",
    name: "Jury",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jury"
  });
  
  // 2. ON DIT AU SITE QU'ON EST DÉJÀ CONNECTÉ
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false); // Fini de charger
  
  // Variables requises par la nouvelle architecture
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    // --- DÉSACTIVATION TEMPORAIRE DE FIREBASE ---
    /* const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });
    
    return () => unsubscribe();
    */
    // ---------------------------------------------
  }, []);

  const loginWithGoogle = async () => {
    // --- DÉSACTIVATION TEMPORAIRE DE LA POPUP GOOGLE ---
    /*
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user); 
      return result;
    } catch (error) {
      console.error("Erreur connexion Google:", error);
      setAuthError({ type: 'unknown', message: error.message });
      throw error;
    }
    */
    console.log("Connexion Google désactivée en mode Démo.");
  };

  const logout = async () => {
    // --- DÉSACTIVATION TEMPORAIRE DE LA DÉCONNEXION ---
    /*
    await signOut(auth);
    window.location.href = "/"; 
    */
    console.log("Déconnexion désactivée en mode Démo.");
  };

  const navigateToLogin = () => {
    // On ne fait rien en mode démo puisqu'on est déjà connecté
  };

  const checkAppState = async () => {
    // Fonction vide pour satisfaire le App.jsx
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      loginWithGoogle,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};