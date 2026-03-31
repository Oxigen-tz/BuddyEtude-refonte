import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config'; // Vérifie que ce chemin est bon !
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { syncUserProfile } from '../firebase/services'; // Vérifie que ce chemin est bon !

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Variables requises par la nouvelle architecture générée par l'IA
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    // On écoute Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // On formate l'utilisateur pour que la nouvelle UI le comprenne bien
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
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user); // On sauvegarde le profil en BDD !
      return result;
    } catch (error) {
      console.error("Erreur connexion Google:", error);
      setAuthError({ type: 'unknown', message: error.message });
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/"; // Retour à l'accueil
  };

  const navigateToLogin = () => {
    // Si l'app veut rediriger vers le login, on lance la popup Google
    loginWithGoogle();
  };

  const checkAppState = async () => {
    // Fonction vide pour satisfaire le App.jsx de l'IA
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
      loginWithGoogle, // J'ajoute notre vraie fonction
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