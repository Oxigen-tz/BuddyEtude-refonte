import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import AuthDialog from '@/components/AuthDialog';
import { loadFirebase, whenIdle, hasSessionHint, setSessionHint, isBot } from '@/firebase/lazy';

const AuthContext = createContext();

// Lien de l'e-mail de vérification : après validation, bouton « Continuer » vers BuddyEtude
const verificationSettings = () => ({ url: `${window.location.origin}/Dashboard` });

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

// Pages consultables sans compte : on peut les afficher avant que Firebase soit chargé
const PUBLIC_PATH = /^\/($|home$|about$|legal$|privacy$|etablissements$|reviser(\/|$))/i;

// Chargement de Firebase (~130 Ko compressés) :
//  - tout de suite si l'utilisateur était connecté lors de sa dernière visite, ou s'il ouvre
//    une page de l'application ;
//  - sinon (visiteur sur une page publique) : une fois la page affichée et le navigateur au
//    repos, ou dès qu'il ouvre la fenêtre de connexion. Le premier affichage ne l'attend plus.
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
  const started = useRef(null);

  // Charge Firebase une seule fois et écoute l'état de connexion
  const start = useCallback(() => {
    if (!started.current) {
      started.current = loadFirebase().then((fb) => {
        fb.authSdk.onAuthStateChanged(fb.auth, (firebaseUser) => {
          if (firebaseUser) {
            setSessionHint(true);
            setUser(toAppUser(firebaseUser));
            setIsAuthenticated(true);
            // Sans attendre : ne doit pas retarder l'affichage de l'app
            fb.services.ensureProfileDefaults(firebaseUser);
            // Compte de modération : document admins/<uid> créé à la main dans la console
            fb.firestore.getDoc(fb.firestore.doc(fb.db, 'admins', firebaseUser.uid))
              .then((snap) => setIsAdmin(snap.exists()))
              .catch(() => setIsAdmin(false));
          } else {
            setSessionHint(false);
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
          setIsLoadingAuth(false);
        });
        return fb;
      }).catch((error) => {
        // Fichier introuvable après une mise en ligne, réseau coupé… : on laisse réessayer
        console.error("Chargement de Firebase impossible :", error);
        started.current = null;
        setIsLoadingAuth(false);
        throw error;
      });
    }
    return started.current;
  }, []);

  useEffect(() => {
    if (hasSessionHint() || !PUBLIC_PATH.test(window.location.pathname)) {
      start().catch(() => {});
      return undefined;
    }
    // Robot sur une page publique : rien à charger (voir isBot)
    if (isBot()) return undefined;
    return whenIdle(() => start().catch(() => {}));
  }, [start]);

  const afterLogin = async (fb, result) => {
    await fb.services.syncUserProfile(result.user);
    setAuthDialogOpen(false);
    setAuthError(null);
    setLoginCount((n) => n + 1);
    return result;
  };

  const runLogin = async (fn) => {
    try {
      return await fn(await start());
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setAuthError({ type: 'unknown', code: error.code, message: error.message });
      throw error;
    }
  };

  const loginWithGoogle = () => runLogin(async (fb) =>
    afterLogin(fb, await fb.authSdk.signInWithPopup(fb.auth, new fb.authSdk.GoogleAuthProvider())));

  // Comptes Microsoft (beaucoup d'écoles fournissent Office 365).
  // Le fournisseur doit être activé dans la console Firebase (Authentication → Méthodes).
  const loginWithMicrosoft = () => runLogin(async (fb) => {
    const provider = new fb.authSdk.OAuthProvider('microsoft.com');
    provider.setCustomParameters({ prompt: 'select_account' });
    return afterLogin(fb, await fb.authSdk.signInWithPopup(fb.auth, provider));
  });

  const loginWithEmail = (email, password) => runLogin(async (fb) =>
    afterLogin(fb, await fb.authSdk.signInWithEmailAndPassword(fb.auth, email.trim(), password)));

  const signupWithEmail = (name, email, password) => runLogin(async (fb) => {
    const { authSdk, auth, firestore, db } = fb;
    const result = await authSdk.createUserWithEmailAndPassword(auth, email.trim(), password);
    await authSdk.updateProfile(result.user, { displayName: name.trim() });
    // Le profil a pu être créé juste avant (à la détection de la connexion) sans le nom saisi
    await firestore.setDoc(firestore.doc(db, 'users', result.user.uid), { display_name: name.trim(), full_name: name.trim() }, { merge: true }).catch(() => {});
    await authSdk.sendEmailVerification(result.user, verificationSettings()).catch(() => {});
    setUser(toAppUser(auth.currentUser));
    return afterLogin(fb, result);
  });

  const resetPassword = async (email) => {
    const fb = await start();
    return fb.authSdk.sendPasswordResetEmail(fb.auth, email.trim());
  };

  const resendVerification = async () => {
    const fb = await start();
    if (fb.auth.currentUser) await fb.authSdk.sendEmailVerification(fb.auth.currentUser, verificationSettings());
  };

  // Après un clic sur le lien de vérification (autre onglet, application Mail…), on relit l'état
  // du compte. Renvoie true si l'adresse est maintenant vérifiée.
  const refreshUser = useCallback(async () => {
    const { auth } = await start();
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) await auth.currentUser.getIdToken(true).catch(() => {});
    setUser(toAppUser(auth.currentUser));
    return auth.currentUser.emailVerified;
  }, [start]);

  const logout = async () => {
    const fb = await start();
    await fb.authSdk.signOut(fb.auth);
    setSessionHint(false);
    window.location.href = "/"; // Pour nettoyer complètement l'état de l'app au logout
  };

  // La fenêtre de connexion déclenche le chargement de Firebase, s'il n'a pas encore eu lieu
  const openLogin = useCallback(() => {
    start().catch(() => {});
    setAuthDialogOpen(true);
  }, [start]);
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
