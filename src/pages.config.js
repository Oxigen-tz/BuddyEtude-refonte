/**
 * pages.config.js - Page routing configuration
 * * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 */
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Sessions from './pages/Sessions';
import Settings from './pages/Settings';     // <-- NOUVEAU
import Whiteboard from './pages/Whiteboard'; // <-- NOUVEAU
import __Layout from './Layout.jsx';

export const PAGES = {
    "Home": Home,
    "Profile": Profile,
    "Search": Search,
    "Dashboard": Dashboard,
    "Messages": Messages,
    "Sessions": Sessions,
    "Settings": Settings,     // <-- NOUVEAU
    "Whiteboard": Whiteboard, // <-- NOUVEAU
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};