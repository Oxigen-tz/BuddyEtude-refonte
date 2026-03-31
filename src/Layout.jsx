import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "./firebase/config"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { Toaster, toast } from "sonner";
import {
  Home, Search, LayoutDashboard, MessageSquare, Calendar,
  User, LogOut, Menu, X, GraduationCap, Settings as SettingsIcon
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(db, "requests"), where("from_email", "==", user.email), where("status", "==", "accepted"));
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const data = change.doc.data();
          toast.success(`🎉 Bonne nouvelle !`, {
            description: `${data.to_name} a accepté votre demande !`,
            action: { label: "Voir", onClick: () => navigate(createPageUrl("Messages")) }
          });
        }
      });
    });
    return () => unsub();
  }, [user, navigate]);

  const initials = (user?.displayName || user?.full_name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#131314] flex flex-col md:flex-row transition-colors duration-300">
      <Toaster position="bottom-right" richColors />

      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-[#1e1f20] border-r border-gray-100 dark:border-[#333537] h-screen sticky top-0 transition-colors duration-300">
        
        {/* 🎯 NOUVEAU : Logo cliquable (Desktop) */}
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

        {/* --- BLOC DU BAS (Paramètres + Profil) --- */}
        <div className="p-4 border-t border-gray-100 dark:border-[#333537] flex flex-col gap-2">
          
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

          <div className="flex items-center gap-3 px-4 py-2">
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
          
          <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* --- MENU MOBILE --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white dark:bg-[#1e1f20] border-b border-gray-100 dark:border-[#333537] p-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
           
           {/* 🎯 NOUVEAU : Logo cliquable (Mobile) */}
           <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
             <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight">BuddyEtude</span>
           </Link>

           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 dark:text-gray-100">
             {mobileMenuOpen ? <X /> : <Menu />}
           </button>
        </header>

        {mobileMenuOpen && (
          <nav className="md:hidden fixed inset-0 top-[73px] bg-white dark:bg-[#1e1f20] z-30 p-4 flex flex-col gap-2 transition-colors duration-300">
            {navItems.map((item) => (
              <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${currentPageName === item.page ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            <Link to={createPageUrl("Settings")} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${currentPageName === "Settings" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
              <SettingsIcon className="w-5 h-5" />
              Paramètres
            </Link>
            <Button onClick={logout} className="mt-auto bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20">
              <LogOut className="w-5 h-5 mr-2" /> Déconnexion
            </Button>
          </nav>
        )}

        <main className="flex-1 p-4 md:p-8 text-gray-900 dark:text-gray-100">{children}</main>
      </div>
    </div>
  );
}