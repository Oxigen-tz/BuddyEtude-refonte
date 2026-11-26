/**
 * pages.config.js - Configuration du routage
 *
 * Chaque clé de PAGES devient une route "/<Clé>" (voir App.jsx).
 * mainPage : page affichée sur "/".
 *
 * Les pages sont chargées à la demande (React.lazy) : le visiteur de l'accueil ne télécharge
 * pas le code du tableau blanc, de la messagerie, etc. Seule la page d'accueil est importée
 * directement, puisque c'est la première affichée.
 */
import { lazy } from 'react';
import Home from './pages/Home';
// Mise en page de l'application connectée (barre latérale, notifications) : chargée à la demande,
// elle utilise Firebase et n'est jamais affichée aux visiteurs des pages publiques.
const __Layout = lazy(() => import('./Layout.jsx'));

export const PAGES = {
    "Home": Home,
    "Profile": lazy(() => import('./pages/Profile')),
    "Search": lazy(() => import('./pages/Search')),
    "Dashboard": lazy(() => import('./pages/Dashboard')),
    "Messages": lazy(() => import('./pages/Messages')),
    "Sessions": lazy(() => import('./pages/Sessions')),
    "Settings": lazy(() => import('./pages/Settings')),
    "Whiteboard": lazy(() => import('./pages/Whiteboard')),
    "Legal": lazy(() => import('./pages/Legal')),
    "Privacy": lazy(() => import('./pages/Privacy')),
    "About": lazy(() => import('./pages/About')),
    "Admin": lazy(() => import('./pages/Admin')),
    "Groups": lazy(() => import('./pages/Groups')),
    "Etablissements": lazy(() => import('./pages/Etablissements')),
    "Call": lazy(() => import('./pages/Call')),
    "Student": lazy(() => import('./pages/Student')),
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
