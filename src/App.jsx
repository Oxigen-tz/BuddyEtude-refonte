import { Toaster as ShadcnToaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner" // Indispensable pour mes notifications toast.success
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Import de la nouvelle page Whiteboard
import Whiteboard from './pages/Whiteboard';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// 🛠️ NOUVEAU : Wrapper intelligent qui gère l'affichage du menu latéral
const LayoutWrapper = ({ children, currentPageName }) => {
  const location = useLocation();
  
  // On définit ici les pages qui NE DOIVENT PAS avoir de menu latéral (ex: l'accueil)
  const hideSidebarRoutes = ['/', '/login', '/register']; 
  
  // On affiche le Layout (menu) seulement si on n'est pas sur l'accueil
  const showSidebar = Layout && !hideSidebarRoutes.includes(location.pathname);

  return showSidebar ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    // Si on est sur l'accueil, on affiche le contenu en plein écran avec le fond Gemini
    <div className="min-h-screen bg-slate-50 dark:bg-[#131314] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {children}
    </div>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Affichage du spinner pendant le chargement
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-[#131314] transition-colors duration-300">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-[#333537] border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
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

      {/* Génération dynamique des autres pages depuis pages.config */}
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}

      {/* Route Whiteboard */}
      <Route 
        path="/whiteboard" 
        element={
          <LayoutWrapper currentPageName="Whiteboard">
            <Whiteboard />
          </LayoutWrapper>
        } 
      />

      {/* Page 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        {/* On garde les deux Toasters pour la compatibilité */}
        <ShadcnToaster />
        <SonnerToaster position="bottom-right" richColors theme="system" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App;