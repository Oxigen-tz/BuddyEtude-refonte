import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase/config';
import {
  onAuthStateChanged, signInWithPopup, GoogleAuthProvider, OAuthProvider, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
  sendEmailVerification, updateProfile,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { syncUserProfile, ensureProfileDefaults } from '../firebase/services';
import AuthDialog from '@/components/AuthDialog';

const AuthContext = createContext();

const toAppUser = (firebaseUser) => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  emailVerified: firebaseUser.emailVerified,
  // Connexion par e-mail : seul le fournisseur "password" exige une vérification de l'adresse
  needsEmailVerification: !firebaseUser.emailVerified
    && firebaseUser.providerData.some((p) => p.providerId === 'password'),
  displayName: firebaseUser.displayName,
  full_name: firebaseUser.displayName,
  name: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState(null);
  // Fenêtre de connexion commune (Google, Microsoft, e-mail)
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  // Incrémenté à chaque connexion réussie : l'accueil s'en sert pour rediriger vers le tableau de bord
  const [loginCount, setLoginCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(toAppUser(firebaseUser));
        setIsAuthenticated(true);
        // Sans attendre : ne doit pas retarder l'affichage de l'app
        ensureProfileDefaults(firebaseUser);
        // Compte de modération : document admins/<uid> créé à la main dans la console
        getDoc(doc(db, 'admins', firebaseUser.uid))
          .then((snap) => setIsAdmin(snap.exists()))
          .catch(() => setIsAdmin(false));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const afterLogin = async (result) => {
    await syncUserProfile(result.user);
    setAuthDialogOpen(false);
    setAuthError(null);
    setLoginCount((n) => n + 1);
    return result;
  };

  const runLogin = async (fn) => {
    try {
      return await fn();
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setAuthError({ type: 'unknown', code: error.code, message: error.message });
      throw error;
    }
  };

  const loginWithGoogle = () => runLogin(async () =>
    afterLogin(await signInWithPopup(auth, new GoogleAuthProvider())));

  // Comptes Microsoft (beaucoup d'écoles fournissent Office 365).
  // Le fournisseur doit être activé dans la console Firebase (Authentication → Méthodes).
  const loginWithMicrosoft = () => runLogin(async () => {
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({ prompt: 'select_account' });
    return afterLogin(await signInWithPopup(auth, provider));
  });

  const loginWithEmail = (email, password) => runLogin(async () =>
    afterLogin(await signInWithEmailAndPassword(auth, email.trim(), password)));

  const signupWithEmail = (name, email, password) => runLogin(async () => {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(result.user, { displayName: name.trim() });
    await sendEmailVerification(result.user).catch(() => {});
    setUser(toAppUser(auth.currentUser));
    return afterLogin(result);
  });

  const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim());

  const resendVerification = async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  };

  // Après un clic sur le lien de vérification (autre onglet), on relit l'état du compte
  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setUser(toAppUser(auth.currentUser));
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/"; // Pour nettoyer complètement l'état de l'app au logout
  };

  const openLogin = useCallback(() => setAuthDialogOpen(true), []);
  const navigateToLogin = openLogin;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      isAdmin,
      authError,
      logout,
      loginWithGoogle,
      loginWithMicrosoft,
      loginWithEmail,
      signupWithEmail,
      resetPassword,
      resendVerification,
      refreshUser,
      openLogin,
      loginCount,
      navigateToLogin,
    }}>
      {children}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
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
