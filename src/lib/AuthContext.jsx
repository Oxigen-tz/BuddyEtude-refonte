import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config'; 
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { syncUserProfile } from '../firebase/services'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Variables requises par la nouvelle architecture
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    // On écoute Firebase pour savoir si quelqu'un est connecté
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // On formate l'utilisateur pour que l'interface le comprenne bien
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
      
      // On sauvegarde le profil en BDD
      await syncUserProfile(result.user); 
      
      // 🚀 REDIRECTION AUTOMATIQUE ICI 🚀
      // (Vérifie juste que ton url s'appelle bien "Dashboard" avec une majuscule ou non)
      window.location.href = "/Dashboard"; 
      
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
    // Lance la popup Google
    loginWithGoogle();
  };

  const checkAppState = async () => {
    // Fonction vide pour l'architecture
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