import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "./firebase/config"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { getRequestAlertsEnabled } from "@/lib/preferences";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Search, LayoutDashboard, MessageSquare, Calendar,
  User, LogOut, Menu, X, GraduationCap, Settings as SettingsIcon, Bell, CheckCircle2, Globe, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// On ne stocke plus que la clé de page ici : le libellé affiché vient
// de layout.nav.<page> via t(), résolu au moment du rendu.
const navItems = [
  { navKey: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { navKey: "Search", page: "Search", icon: Search },
  { navKey: "Messages", page: "Messages", icon: MessageSquare },
  { navKey: "Sessions", page: "Sessions", icon: Calendar },
  { navKey: "Profile", page: "Profile", icon: User },
];

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 🔔 États pour gérer les notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Pastille "messages non lus" sur l'entrée Messages du menu
  const unread = useUnreadMessages(user?.email);
  const renderUnreadBadge = (page) =>
    page === "Messages" && unread.total > 0 ? (
      <span
        className="ml-auto min-w-[1.25rem] h-5 px-1.5 text-[11px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center"
        aria-label={t('layout.unreadMessages', { count: unread.total })}
      >
        {unread.total > 99 ? "99+" : unread.total}
      </span>
    ) : null;

  // 🌐 Bascule de langue
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    if (!user?.email) return;

    const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const notify = ({ id, type, title, message, toastTitle, target = "Messages" }) => {
      // Réglage "Alertes de demandes" (page Paramètres) : s'il est coupé, on ne notifie pas
      if (!getRequestAlertsEnabled()) return;

      setNotifications(prev => [{ id, type, title, message, target, time: formatTime() }, ...prev]);
      toast.success(toastTitle, {
        description: message,
        action: { label: t('layout.notifications.view'), onClick: () => navigate(createPageUrl(target)) }
      });
    };

    // 🛠️ CORRIGÉ : quand une demande passe de "pending" à "accepted", le document ENTRE dans le
    // résultat de cette requête (filtrée sur status == accepted) : Firestore le signale comme "added",
    // pas "modified". L'ancien code ne traitait que "modified", donc la notification d'acceptation
    // ne se déclenchait jamais. Le premier snapshot (état initial) est ignoré pour ne pas notifier
    // à chaque chargement de page.
    let acceptedReady = false;
    let inviteReady = false;
    let sessionsReady = false;

    const unsubAccepted = onSnapshot(
      query(collection(db, "requests"), where("from_email", "==", user.email), where("status", "==", "accepted")),
      (snapshot) => {
        if (!acceptedReady) { acceptedReady = true; return; }
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "added") return;
          const data = change.doc.data();
          notify({
            id: `accepted-${change.doc.id}`,
            type: "accepted",
            title: t('layout.notifications.acceptedTitle'),
            message: t('layout.notifications.acceptedBody', { name: data.to_name }),
            toastTitle: t('layout.notifications.acceptedToast'),
          });
        });
      },
      (error) => console.error("Erreur notifications (acceptations):", error)
    );

    // Les clés layout.notifications.invite* existaient dans i18n.js sans jamais être utilisées :
    // personne n'était prévenu qu'une demande lui était adressée.
    const unsubInvites = onSnapshot(
      query(collection(db, "requests"), where("to_email", "==", user.email), where("status", "==", "pending")),
      (snapshot) => {
        if (!inviteReady) { inviteReady = true; return; }
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "added") return;
          const data = change.doc.data();
          if (data.from_email === user.email) return;
          notify({
            id: `invite-${change.doc.id}`,
            type: "invite",
            title: t('layout.notifications.inviteTitle'),
            message: t('layout.notifications.inviteBody', { name: data.from_name }),
            toastTitle: t('layout.notifications.inviteToast', { name: data.from_name }),
          });
        });
      },
      (error) => console.error("Erreur notifications (invitations):", error)
    );

    // Nouvelle session planifiée par le binôme : avant, il ne la découvrait qu'en ouvrant Sessions
    const unsubSessions = onSnapshot(
      query(collection(db, "sessions"), where("participants", "array-contains", user.email)),
      (snapshot) => {
        if (!sessionsReady) { sessionsReady = true; return; }
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "added") return;
          const data = change.doc.data();
          if (data.organizer_email === user.email || data.status !== "planned") return;
          notify({
            id: `session-${change.doc.id}`,
            type: "session",
            title: t('layout.notifications.sessionTitle'),
            message: t('layout.notifications.sessionBody', { name: data.organizer_name || data.organizer_email, title: data.title }),
            toastTitle: t('layout.notifications.sessionToast'),
            target: "Sessions",
          });
        });
      },
      (error) => console.error("Erreur notifications (sessions):", error)
    );

    return () => { unsubAccepted(); unsubInvites(); unsubSessions(); };
  }, [user, navigate, t]);

  const initials = (user?.displayName || user?.full_name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  // 🛠️ CORRIGÉ : ce n'est plus un composant défini dans le composant (il était recréé à chaque rendu,
  // donc démonté/remonté en permanence) mais une fonction qui renvoie du JSX. Le positionnement est
  // passé en paramètre : sur mobile, les classes "absolute bottom-16" de la version desktop
  // plaçaient le panneau hors de l'écran.
  const renderNotificationsPanel = (positionClass) => (
    <div className={`${positionClass} bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4`}>
      <div className="p-4 border-b border-gray-100 dark:border-[#333537] flex justify-between items-center bg-gray-50 dark:bg-[#131314]">
        <h3 className="font-bold text-gray-900 dark:text-white">{t('layout.notifications.title')}</h3>
        {notifications.length > 0 && (
          <button onClick={clearNotifications} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            {t('layout.notifications.markAllRead')}
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            {t('layout.notifications.empty')}
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3 mb-1 hover:bg-gray-50 dark:hover:bg-[#282a2c] rounded-xl cursor-pointer transition-colors"
              onClick={() => { setShowNotifications(false); navigate(createPageUrl(notif.target || "Messages")); }}
            >
              <div className="flex gap-3">
                <div className="mt-1">
                  {notif.type === "invite"
                    ? <UserPlus className="w-5 h-5 text-indigo-500" />
                    : notif.type === "session"
                      ? <Calendar className="w-5 h-5 text-amber-500" />
                      : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{notif.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#131314] flex flex-col md:flex-row transition-colors duration-300">
      {/* Le <Toaster> sonner est déjà monté dans App.jsx : un second ici affichait chaque toast en double */}

      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-[#1e1f20] border-r border-gray-100 dark:border-[#333537] h-screen sticky top-0 transition-colors duration-300">
        
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">BuddyEtude</span>
        </Link>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                {t(`layout.nav.${item.navKey}`)}
                {renderUnreadBadge(item.page)}
              </Link>
            );
          })}
        </nav>

        {/* --- BLOC DU BAS (Langue + Notifications + Paramètres + Profil) --- */}
        <div className="p-4 border-t border-gray-100 dark:border-[#333537] flex flex-col gap-2 relative">

          {/* 🌐 BOUTON LANGUE DESKTOP : layout.language contient déjà la langue cible */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
          >
            <Globe className="w-5 h-5" />
            {t('layout.language')}
          </button>
          
          {/* 🔔 BOUTON NOTIFICATIONS DESKTOP */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-expanded={showNotifications}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full ${
              showNotifications
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
            }`}
          >
            <div className="relative">
              <Bell className={`w-5 h-5 ${showNotifications ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-[#1e1f20]"></span>
                </span>
              )}
            </div>
            {t('layout.notifications.title')}
          </button>

          {showNotifications && renderNotificationsPanel("absolute bottom-24 left-64 w-80 z-50")}

          <Link
            to={createPageUrl("Settings")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentPageName === "Settings"
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
            }`}
          >
            <SettingsIcon className={`w-5 h-5 ${currentPageName === "Settings" ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
            {t(`layout.nav.Settings`)}
          </Link>

          <div className="flex items-center gap-3 px-4 py-2 mt-2">
            <Avatar className="h-9 w-9 border border-gray-100 dark:border-[#333537]">
              <AvatarFallback className="bg-indigo-100 dark:bg-[#282a2c] text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.displayName || user?.full_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl mt-1">
            <LogOut className="w-5 h-5" />
            {t('layout.logout')}
          </Button>
        </div>
      </aside>

      {/* --- MENU MOBILE --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white dark:bg-[#1e1f20] border-b border-gray-100 dark:border-[#333537] p-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
           
           <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
             <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight">BuddyEtude</span>
           </Link>

           <div className="flex items-center gap-4">
             {/* 🔔 BOUTON NOTIFICATIONS MOBILE */}
             <button
               onClick={() => setShowNotifications(!showNotifications)}
               aria-label={t('layout.notifications.title')}
               aria-expanded={showNotifications}
               className="relative text-gray-600 dark:text-gray-300"
             >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-[#1e1f20]"></span>
                  </span>
                )}
             </button>

             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               aria-label={t('layout.menu')}
               aria-expanded={mobileMenuOpen}
               className="relative text-gray-900 dark:text-gray-100"
             >
               {mobileMenuOpen ? <X /> : <Menu />}
               {/* Sur mobile, le menu est replié : on signale les messages non lus sur son bouton */}
               {!mobileMenuOpen && unread.total > 0 && (
                 <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-[#1e1f20]" />
               )}
             </button>
           </div>
        </header>

        {/* PANNEAU NOTIFICATIONS MOBILE (s'affiche sous le header) */}
        {showNotifications && renderNotificationsPanel("md:hidden fixed inset-x-4 top-20 z-50")}

        {mobileMenuOpen && (
          <nav className="md:hidden fixed inset-0 top-[73px] bg-white dark:bg-[#1e1f20] z-30 p-4 flex flex-col gap-2 transition-colors duration-300">
            {navItems.map((item) => (
              <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${currentPageName === item.page ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
                <item.icon className="w-5 h-5" />
                {t(`layout.nav.${item.navKey}`)}
                {renderUnreadBadge(item.page)}
              </Link>
            ))}

            {/* 🌐 BOUTON LANGUE MOBILE */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-3 px-4 py-4 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
            >
              <Globe className="w-5 h-5" />
              {t('layout.language')}
            </button>

            <Link to={createPageUrl("Settings")} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${currentPageName === "Settings" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
              <SettingsIcon className="w-5 h-5" />
              {t(`layout.nav.Settings`)}
            </Link>
            <Button onClick={logout} className="mt-auto bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20">
              <LogOut className="w-5 h-5 mr-2" /> {t('layout.logout')}
            </Button>
          </nav>
        )}

        <main className="flex-1 p-4 md:p-8 text-gray-900 dark:text-gray-100 relative z-0">{children}</main>
      </div>
    </div>
  );
}