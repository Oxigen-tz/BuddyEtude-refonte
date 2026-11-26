import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { takeIntentTarget } from "@/lib/intent";
import { db } from "./firebase/config"; 
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { getRequestAlertsEnabled } from "@/lib/preferences";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Search, LayoutDashboard, MessageSquare, Calendar,
  User, LogOut, Menu, X, Settings as SettingsIcon, Bell, CheckCircle2, Globe, UserPlus, ShieldAlert, MailWarning, UsersRound, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

// On ne stocke plus que la clé de page ici : le libellé affiché vient
// de layout.nav.<page> via t(), résolu au moment du rendu.
const navItems = [
  { navKey: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { navKey: "Search", page: "Search", icon: Search },
  { navKey: "Messages", page: "Messages", icon: MessageSquare },
  { navKey: "Sessions", page: "Sessions", icon: Calendar },
  { navKey: "Groups", page: "Groups", icon: UsersRound },
  { navKey: "Profile", page: "Profile", icon: User },
];

export default function Layout({ children, currentPageName }) {
  const { user, logout, isAdmin, resendVerification, refreshUser } = useAuth();
  // Entrée "Modération" visible uniquement des comptes administrateurs
  const menuItems = isAdmin ? [...navItems, { navKey: "Admin", page: "Admin", icon: ShieldAlert }] : navItems;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Vérification de l'adresse e-mail : bouton « C'est fait » avec un retour clair, et nouvelle
  // vérification automatique quand on revient sur l'onglet (après avoir cliqué sur le lien reçu)
  const [checkingEmail, setCheckingEmail] = useState(false);
  const checkEmailVerified = async () => {
    setCheckingEmail(true);
    try {
      if (await refreshUser()) toast.success(t('auth.verifyOk'));
      else toast.info(t('auth.verifyNotYet'), { duration: 8000 });
    } catch {
      toast.error(t('auth.errors.generic'));
    } finally {
      setCheckingEmail(false);
    }
  };
  useEffect(() => {
    if (!user?.needsEmailVerification) return;
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      refreshUser().then((ok) => { if (ok) toast.success(t('auth.verifyOk')); }).catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [user?.needsEmailVerification, refreshUser, t]);

  // Profil pas encore créé : on ramène vers la page Profil (sauf Paramètres, pour pouvoir
  // supprimer son compte). Avant, un nouvel inscrit naviguait avec le nom « Étudiant ».
  const [profileComplete, setProfileComplete] = useState(null);
  useEffect(() => {
    if (!user?.uid) return;
    return onSnapshot(doc(db, "users", user.uid),
      (snap) => setProfileComplete(snap.exists() ? snap.data().profile_complete === true : false),
      () => setProfileComplete(true)); // en cas d'erreur, on ne bloque pas l'application
  }, [user?.uid]);
  useEffect(() => {
    if (profileComplete === false && !["Profile", "Settings"].includes(currentPageName)) {
      navigate(createPageUrl("Profile"), { replace: true });
    } else if (profileComplete === true) {
      // Intention choisie sur l'accueil avant l'inscription (« Tu cherches quoi ? »), lue une seule fois
      const target = takeIntentTarget();
      if (target) navigate(target, { replace: true });
    }
  }, [profileComplete, currentPageName, navigate]);
  
  // 🔔 États pour gérer les notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Pastille sur l'entrée Messages du menu : messages non lus + demandes de binôme en attente
  // (avant, une demande reçue pendant qu'on était déconnecté n'était signalée nulle part)
  const unread = useUnreadMessages(user?.uid);
  const [pendingCount, setPendingCount] = useState(0);
  const messagesBadgeCount = unread.total + pendingCount;
  const renderUnreadBadge = (page) =>
    page === "Messages" && messagesBadgeCount > 0 ? (
      <span
        className="ml-auto min-w-[1.25rem] h-5 px-1.5 text-[11px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center"
        aria-label={t('layout.unreadMessages', { count: messagesBadgeCount })}
      >
        {messagesBadgeCount > 99 ? "99+" : messagesBadgeCount}
      </span>
    ) : null;

  // 🌐 Bascule de langue
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    if (!user?.uid) return;

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
      query(collection(db, "requests"), where("from_uid", "==", user.uid), where("status", "==", "accepted")),
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
      query(collection(db, "requests"), where("to_uid", "==", user.uid), where("status", "==", "pending")),
      (snapshot) => {
        const pendingDocs = snapshot.docs.filter((d) => d.data().from_uid !== user.uid);
        setPendingCount(pendingDocs.length);

        if (!inviteReady) {
          inviteReady = true;
          // Demandes déjà en attente à l'ouverture : listées dans le panneau, sans toast
          // (sinon, reçues pendant qu'on était déconnecté, elles passaient inaperçues)
          if (getRequestAlertsEnabled() && pendingDocs.length > 0) {
            setNotifications(pendingDocs.map((d) => ({
              id: `invite-${d.id}`,
              type: "invite",
              title: t('layout.notifications.inviteTitle'),
              message: t('layout.notifications.inviteBody', { name: d.data().from_name }),
              target: "Messages",
              time: "",
            })));
          }
          return;
        }
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "added") return;
          const data = change.doc.data();
          if (data.from_uid === user.uid) return;
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
      query(collection(db, "sessions"), where("participants", "array-contains", user.uid)),
      (snapshot) => {
        if (!sessionsReady) { sessionsReady = true; return; }
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "added") return;
          const data = change.doc.data();
          if (data.organizer_uid === user.uid || data.status !== "planned") return;
          notify({
            id: `session-${change.doc.id}`,
            type: "session",
            title: t('layout.notifications.sessionTitle'),
            message: t('layout.notifications.sessionBody', { name: data.organizer_name || "?", title: data.title }),
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

  // Fermeture du panneau : touche Échap ou clic en dehors (hors boutons qui l'ouvrent)
  const panelRef = useRef(null);
  useEffect(() => {
    if (!showNotifications) return;
    const onKey = (e) => { if (e.key === "Escape") setShowNotifications(false); };
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (e.target.closest?.("[data-notif-toggle]")) return;
      setShowNotifications(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [showNotifications]);

  // Un seul panneau, rendu dans <body> via un portail : placé dans la barre latérale (sticky,
  // donc son propre contexte d'empilement), il passait SOUS le contenu de la page et le footer
  // malgré son z-index. Sur ordinateur il s'ouvre à droite de la barre latérale, sur mobile
  // sous l'en-tête.
  const renderNotificationsPanel = () => createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label={t('layout.notifications.title')}
      className="fixed z-[200] inset-x-4 top-20 sm:inset-x-auto sm:right-4 sm:w-96 lg:right-auto lg:top-auto lg:left-[17.5rem] lg:bottom-4 bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-lift rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="p-4 border-b border-gray-100 dark:border-ink-700 flex justify-between items-center bg-gray-50 dark:bg-ink-950">
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
              className="p-3 mb-1 hover:bg-gray-50 dark:hover:bg-ink-800 rounded-xl cursor-pointer transition-colors"
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
                  {notif.time && <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>,
    document.body
  );

  const navLinkClass = (active) =>
    `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      active
        ? "bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-glow"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-ink-800"
    }`;
  const utilityClass = (active) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all w-full ${
      active
        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-ink-800"
    }`;
  const notificationDot = notifications.length > 0 && (
    <span className="absolute -top-1 -right-1 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-coral-500 border-2 border-white dark:border-ink-900"></span>
    </span>
  );
  // Barre d'onglets du bas sur mobile : les 5 pages les plus utilisées (le reste est dans le menu)
  const tabItems = navItems.filter((item) => ["Dashboard", "Search", "Messages", "Sessions", "Profile"].includes(item.page));

  return (
    <div className="min-h-screen app-backdrop flex flex-col lg:flex-row transition-colors duration-300">
      {/* Le <Toaster> sonner est déjà monté dans App.jsx */}

      {/* --- BARRE LATÉRALE (ordinateur, à partir de 1024 px) --- */}
      <aside className="hidden lg:flex w-[17rem] shrink-0 flex-col h-screen sticky top-0 p-3">
        <div className="flex-1 min-h-0 flex flex-col rounded-3xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-xl border border-gray-200/70 dark:border-ink-700 shadow-soft">
          <Link to="/" className="px-5 pt-5 pb-6 hover:opacity-90 transition-opacity">
            <Logo />
          </Link>

          <nav className="flex-1 min-h-0 overflow-y-auto px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link key={item.page} to={createPageUrl(item.page)} aria-current={isActive ? "page" : undefined} className={navLinkClass(isActive)}>
                  <item.icon className={`w-[18px] h-[18px] ${isActive ? "" : "text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-300"}`} />
                  {t(`layout.nav.${item.navKey}`)}
                  {renderUnreadBadge(item.page)}
                </Link>
              );
            })}
          </nav>

          {/* --- BAS : langue, notifications, paramètres, profil --- */}
          <div className="p-3 mt-3 border-t border-gray-100 dark:border-ink-700 flex flex-col gap-0.5">
            <button onClick={toggleLanguage} className={utilityClass(false)} title={t('home.nav.switchLanguage')} aria-label={t('home.nav.switchLanguage')}>
              <Globe className="w-[18px] h-[18px]" />
              {t('layout.language')}
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              data-notif-toggle
              aria-expanded={showNotifications}
              className={utilityClass(showNotifications)}
            >
              <span className="relative">
                <Bell className="w-[18px] h-[18px]" />
                {notificationDot}
              </span>
              {t('layout.notifications.title')}
            </button>
            {showNotifications && renderNotificationsPanel()}
            <Link to={createPageUrl("Settings")} className={utilityClass(currentPageName === "Settings")}>
              <SettingsIcon className="w-[18px] h-[18px]" />
              {t(`layout.nav.Settings`)}
            </Link>

            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gray-50 dark:bg-ink-850 border border-gray-100 dark:border-ink-700 p-2.5">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.displayName || user?.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                aria-label={t('layout.logout')}
                title={t('layout.logout')}
                className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MOBILE ET TABLETTE --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl border-b border-gray-200/70 dark:border-ink-700 transition-colors duration-300" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="h-16 px-4 flex items-center justify-between">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-90 transition-opacity">
              <Logo markClassName="w-8 h-8" />
            </Link>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                data-notif-toggle
                aria-label={t('layout.notifications.title')}
                aria-expanded={showNotifications}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-ink-800"
              >
                <span className="relative">
                  <Bell className="w-5 h-5" />
                  {notificationDot}
                </span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={t('layout.menu')}
                aria-expanded={mobileMenuOpen}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-ink-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <nav className="lg:hidden fixed inset-x-0 bottom-0 top-16 bg-white/95 dark:bg-ink-950/95 backdrop-blur-xl z-30 p-4 flex flex-col gap-1.5 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200" style={{ marginTop: "env(safe-area-inset-top, 0px)" }}>
            {menuItems.map((item) => (
              <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileMenuOpen(false)} className={`${navLinkClass(currentPageName === item.page)} py-3.5 text-base`}>
                <item.icon className="w-5 h-5" />
                {t(`layout.nav.${item.navKey}`)}
                {renderUnreadBadge(item.page)}
              </Link>
            ))}
            <div className="my-2 h-px bg-gray-200/70 dark:bg-ink-700" />
            <button onClick={toggleLanguage} className={`${utilityClass(false)} py-3.5 text-base`} aria-label={t('home.nav.switchLanguage')}>
              <Globe className="w-5 h-5" />
              {t('layout.language')}
            </button>
            <Link to={createPageUrl("Settings")} onClick={() => setMobileMenuOpen(false)} className={`${utilityClass(currentPageName === "Settings")} py-3.5 text-base`}>
              <SettingsIcon className="w-5 h-5" />
              {t(`layout.nav.Settings`)}
            </Link>
            <Button onClick={logout} variant="ghost" className="mt-auto mb-20 h-12 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20">
              <LogOut className="w-5 h-5" /> {t('layout.logout')}
            </Button>
          </nav>
        )}

        <main className="flex-1 p-4 md:p-8 pb-[calc(84px+env(safe-area-inset-bottom,0px))] md:pb-[calc(100px+env(safe-area-inset-bottom,0px))] lg:pb-8 text-gray-900 dark:text-gray-100 relative z-0">
          {/* Compte e-mail pas encore vérifié : rappel discret, avec renvoi du lien */}
          {user?.needsEmailVerification && (
            <div role="status" className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-sm text-amber-900 dark:text-amber-200">
              <MailWarning className="w-5 h-5 shrink-0" />
              <span className="flex-1">{t('auth.verifyBanner', { email: user.email })}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => resendVerification().then(() => toast.success(t('auth.verifySent'))).catch(() => toast.error(t('auth.errors.generic')))}>
                  {t('auth.verifyResend')}
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl bg-transparent" disabled={checkingEmail} onClick={checkEmailVerified}>
                  {checkingEmail && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                  {t('auth.verifyDone')}
                </Button>
              </div>
            </div>
          )}
          {currentPageName === "Whiteboard" ? children : (
            // Transition à chaque changement de page (l'opacité seule ne crée pas de bloc
            // conteneur, donc les fenêtres « fixed » des pages restent bien placées)
            <motion.div key={currentPageName} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}>
              {children}
            </motion.div>
          )}
        </main>

        {/* --- BARRE D'ONGLETS (mobile et tablette) --- */}
        <nav aria-label={t('layout.menu')} className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)]">
          <div className="max-w-md mx-auto h-[60px] grid grid-cols-5 rounded-2xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl border border-gray-200/70 dark:border-ink-700 shadow-lift">
            {tabItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                    isActive ? "text-brand-600 dark:text-brand-300" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <span className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all ${isActive ? "bg-brand-100 dark:bg-brand-500/20" : ""}`}>
                    <item.icon className="w-5 h-5" />
                    {item.page === "Messages" && messagesBadgeCount > 0 && (
                      <span className="absolute -top-1 right-0 min-w-[1.1rem] h-[1.1rem] px-1 text-[9px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-ink-900">
                        {messagesBadgeCount > 9 ? "9+" : messagesBadgeCount}
                      </span>
                    )}
                  </span>
                  <span className="truncate max-w-full px-0.5">{t(`layout.tabs.${item.navKey}`)}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
