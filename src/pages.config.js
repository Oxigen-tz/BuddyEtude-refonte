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
import Settings from './pages/Settings';
import Whiteboard from './pages/Whiteboard';
import Legal from './pages/Legal';       
import Privacy from './pages/Privacy';   
import About from './pages/About';       
import __Layout from './Layout.jsx';

export const PAGES = {
    "Home": Home,
    "Profile": Profile,
    "Search": Search,
    "Dashboard": Dashboard,
    "Messages": Messages,
    "Sessions": Sessions,
    "Settings": Settings,
    "Whiteboard": Whiteboard,
    "Legal": Legal,       
    "Privacy": Privacy,   
    "About": About,       
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};