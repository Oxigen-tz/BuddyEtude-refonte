import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { 
  LayoutDashboard, Search, MessageSquare, Calendar, 
  User, Settings, LogOut, Menu, X 
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", label: "Tableau de bord", icon: LayoutDashboard, path: "/Dashboard" },
    { name: "Search", label: "Rechercher", icon: Search, path: "/Search" },
    { name: "Messages", label: "Messages", icon: MessageSquare, path: "/Messages" },
    { name: "Sessions", label: "Sessions", icon: Calendar, path: "/Sessions" },
    { name: "Profile", label: "Mon profil", icon: User, path: "/Profile" },
    { name: "Settings", label: "Paramètres", icon: Settings, path: "/Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131314] text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#1e1f20] border-r border-gray-200 dark:border-[#333537] p-6 shrink-0">
        
        {/* Logo / Marque */}
        <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer" onClick={() => navigate("/Dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            B
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BuddyEtude
          </span>
        </div>

        {/* Liens de navigation */}
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || currentPageName === item.name;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#282a2c] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Section utilisateur & déconnexion en bas */}
        <div className="pt-6 border-t border-gray-100 dark:border-[#333537]">
          {user && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm shrink-0">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "E"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">
                  {user.displayName || user.full_name || "Étudiant"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* --- CONTENEUR PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar Mobile */}
        <header className="md:hidden flex items-center justify-between bg-white dark:bg-[#1e1f20] border-b border-gray-200 dark:border-[#333537] px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/Dashboard")}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BuddyEtude
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Menu Mobile déroulant */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#1e1f20] border-b border-gray-200 dark:border-[#333537] p-4 space-y-2 sticky top-[73px] z-30 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || currentPageName === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#282a2c]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-gray-100 dark:border-[#333537]">
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>
        )}

        {/* --- ZONE D'AFFICHAGE DES PAGES --- */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}