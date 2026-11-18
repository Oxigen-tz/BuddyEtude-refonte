import { useEffect, Suspense } from "react";
import { Toaster as SonnerToaster } from "sonner" // Indispensable pour mes notifications toast.success
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Footer from '@/components/Footer';
import PublicHeader from '@/components/PublicHeader';
import LoginRequired from '@/components/LoginRequired';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = (mainPageKey && Pages[mainPageKey]) || (() => null);

// Pages consultables sans compte. Toutes les autres affichent l'écran "Connexion requise"
// aux visiteurs : avant, /Dashboard affichait "Bonjour, Étudiant" avec un bouton Déconnexion,
// et /Profile restait bloquée sur son squelette de chargement.
const PUBLIC_PAGES = [mainPageKey, 'About', 'Legal', 'Privacy'];

const LayoutWrapper = ({ children, currentPageName }) => {
  const { user } = useAuth();
  const isHome = currentPageName === mainPageKey;
  const isPublic = PUBLIC_PAGES.includes(currentPageName);

  // Connecté : barre latérale sur toutes les pages sauf l'accueil (qui a sa propre navbar).
  // Le footer (pensé pour le site vitrine) n'apparaît plus sous les pages de l'application
  // (tableau de bord, messages…) : seulement sur les pages publiques À propos / Mentions /
  // Confidentialité. Ces pages restent accessibles depuis Paramètres.
  if (user && Layout && !isHome) {
    return (
      <Layout currentPageName={currentPageName}>
        {isPublic ? (
          <div className="flex flex-col min-h-full">
            <div className="flex-1 pb-10">{children}</div>
            <Footer />
          </div>
        ) : (
          children
        )}
      </Layout>
    );
  }

  // Visiteur (ou accueil) : plein écran, sans barre latérale
  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {!isHome && <PublicHeader />}
      <div className={isHome ? "flex-1" : "flex-1 px-4"}>{isPublic ? children : <LoginRequired />}</div>
      <Footer />
    </div>
  );
};

const FullScreenSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background transition-colors duration-300">
    <div className="w-8 h-8 border-4 border-slate-200 dark:border-ink-700 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin"></div>
  </div>
);

// Affiché dans la zone de contenu (sidebar conservée) pendant le téléchargement d'une page
const PageSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-4 border-slate-200 dark:border-ink-700 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Affichage du spinner pendant le chargement
  if (isLoadingPublicSettings || isLoadingAuth) {
    return <FullScreenSpinner />;
  }

  // Gestion des erreurs d'authentification
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />

      {/* Génération dynamique de TOUTES les pages depuis pages.config (Whiteboard inclus) */}
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Suspense fallback={<PageSpinner />}>
                <Page />
              </Suspense>
            </LayoutWrapper>
          }
        />
      ))}

      {/* Page 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  // 🌓 NOUVEAU : Sauvegarde et application du Mode Sombre au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Si c'est la première visite, on regarde si l'ordinateur de l'utilisateur est en mode sombre par défaut
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        {/* Active dès maintenant les comportements de React Router v7 (et supprime les avertissements console) */}
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthenticatedApp />
        </Router>
        {/* Un seul système de toasts (sonner). Le Toaster shadcn, inutilisé, posait sur mobile une
            zone invisible en haut de l'écran qui bloquait les boutons de l'en-tête (cloche, menu). */}
        <SonnerToaster position="bottom-right" richColors theme="system" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App;