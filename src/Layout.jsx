import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "./firebase/config"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "react-i18next";
import { Toaster, toast } from "sonner";
import {
  Home, Search, LayoutDashboard, MessageSquare, Calendar,
  User, LogOut, Menu, X, GraduationCap, Settings as SettingsIcon, Bell, CheckCircle2, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { name: "Tableau de bord", page: "Dashboard", icon: LayoutDashboard },
  { name: "Rechercher", page: "Search", icon: Search },
  { name: "Messages", page: "Messages", icon: MessageSquare },
  { name: "Sessions", page: "Sessions", icon: Calendar },
  { name: "Mon profil", page: "Profile", icon: User },
];

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 🔔 États pour gérer les notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // 🌐 Bascule de langue
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };
  const isFr = i18n.language.startsWith('fr');

  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(db, "requests"), where("from_email", "==", user.email), where("status", "==", "accepted"));
    const unsub = onSnapshot(q, (snapshot) => {
      const newNotifs = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const data = change.doc.data();
          
          newNotifs.push({
            id: change.doc.id,
            title: "Demande acceptée 🎉",
            message: `${data.to_name} a accepté votre demande de binôme !`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });

          toast.success(`🎉 Bonne nouvelle !`, {
            description: `${data.to_name} a accepté votre demande !`,
            action: { label: "Voir", onClick: () => navigate(createPageUrl("Messages")) }
          });
        }
      });
      
      if (newNotifs.length > 0) {
        setNotifications(prev => [...newNotifs, ...prev]);
      }
    });
    return () => unsub();
  }, [user, navigate]);

  const initials = (user?.displayName || user?.full_name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const NotificationsPanel = () => (
    <div className="absolute bottom-16 left-4 md:bottom-24 md:left-64 w-80 bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-xl rounded-2xl z-50 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">
      <div className="p-4 border-b border-gray-100 dark:border-[#333537] flex justify-between items-center bg-gray-50 dark:bg-[#131314]">
        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
        {notifications.length > 0 && (
          <button onClick={clearNotifications} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            Tout marquer comme lu
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            Aucune nouvelle notification.
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <div key={idx} className="p-3 mb-1 hover:bg-gray-50 dark:hover:bg-[#282a2c] rounded-xl cursor-pointer transition-colors" onClick={() => navigate(createPageUrl("Messages"))}>
              <div className="flex gap-3">
                <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
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
      <Toaster position="bottom-right" richColors />

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
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* --- BLOC DU BAS (Langue + Notifications + Paramètres + Profil) --- */}
        <div className="p-4 border-t border-gray-100 dark:border-[#333537] flex flex-col gap-2 relative">

          {/* 🌐 BOUTON LANGUE DESKTOP */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
          >
            <Globe className="w-5 h-5" />
            {isFr ? "English" : "Français"}
          </button>
          
          {/* 🔔 BOUTON NOTIFICATIONS DESKTOP */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
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
            Notifications
          </button>

          {showNotifications && <NotificationsPanel />}

          <Link
            to={createPageUrl("Settings")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentPageName === "Settings"
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
            }`}
          >
            <SettingsIcon className={`w-5 h-5 ${currentPageName === "Settings" ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
            Paramètres
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
            Déconnexion
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
             <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-gray-600 dark:text-gray-300">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-[#1e1f20]"></span>
                  </span>
                )}
             </button>

             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 dark:text-gray-100">
               {mobileMenuOpen ? <X /> : <Menu />}
             </button>
           </div>
        </header>

        {/* PANNEAU NOTIFICATIONS MOBILE (S'affiche sous le header) */}
        {showNotifications && (
          <div className="md:hidden fixed inset-x-4 top-20 z-50">
            <NotificationsPanel />
          </div>
        )}

        {mobileMenuOpen && (
          <nav className="md:hidden fixed inset-0 top-[73px] bg-white dark:bg-[#1e1f20] z-30 p-4 flex flex-col gap-2 transition-colors duration-300">
            {navItems.map((item) => (
              <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${currentPageName === item.page ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}

            {/* 🌐 BOUTON LANGUE MOBILE */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-3 px-4 py-4 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
            >
              <Globe className="w-5 h-5" />
              {isFr ? "English" : "Français"}
            </button>

            <Link to={createPageUrl("Settings")} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${currentPageName === "Settings" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
              <SettingsIcon className="w-5 h-5" />
              Paramètres
            </Link>
            <Button onClick={logout} className="mt-auto bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20">
              <LogOut className="w-5 h-5 mr-2" /> Déconnexion
            </Button>
          </nav>
        )}

        <main className="flex-1 p-4 md:p-8 text-gray-900 dark:text-gray-100 relative z-0">{children}</main>
      </div>
    </div>
  );
}