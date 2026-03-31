import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  User, Palette, Settings2, Moon, Sun, 
  Mail, CheckCircle2, ChevronRight, Bell, Shield 
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  
  // Gestion du thème
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  const setTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("buddyetude_theme", "dark");
      setIsDarkMode(true);
      toast.success("Mode sombre activé");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("buddyetude_theme", "light");
      setIsDarkMode(false);
      toast.success("Mode clair activé");
    }
  };

  // On a fusionné Notifications et Confidentialité dans "Préférences"
  const TABS = [
    { id: "account", label: "Mon Compte", icon: User },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "preferences", label: "Préférences", icon: Settings2 },
  ];

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Paramètres</h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-2">Consultez vos informations et personnalisez votre expérience.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* --- MENU LATÉRAL --- */}
        <aside className="w-full md:w-[280px] shrink-0">
          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-medium transition-all ${
                    isActive 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#282a2c] hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* --- CONTENU DE L'ONGLET --- */}
        <main className="flex-1">
          
          {/* 👤 ONGLET : MON COMPTE */}
          {activeTab === "account" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Informations du compte</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        disabled 
                        value={user?.email || ""} 
                        className="pl-12 py-7 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-600 dark:text-gray-300 rounded-2xl cursor-not-allowed text-base border-dashed" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        disabled 
                        value={user?.displayName || user?.full_name || "Étudiant"} 
                        className="pl-12 py-7 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-600 dark:text-gray-300 rounded-2xl cursor-not-allowed text-base border-dashed" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 p-5 rounded-2xl bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10">
                  <p className="text-sm text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 
                    Ces informations sont synchronisées avec votre compte Google / Firebase.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 🎨 ONGLET : APPARENCE */}
          {activeTab === "appearance" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thème de l'application</h2>
                <p className="text-base text-gray-500 dark:text-gray-400 mb-10">Choisissez l'ambiance visuelle qui vous convient le mieux.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Mode Clair */}
                  <button 
                    onClick={() => setTheme("light")}
                    className={`relative p-6 rounded-3xl border-2 text-left transition-all group ${!isDarkMode ? "border-indigo-600 bg-indigo-50/50" : "border-gray-100 dark:border-[#333537] hover:border-gray-300 dark:hover:border-gray-600"}`}
                  >
                    <div className="w-full h-40 bg-gray-50 rounded-2xl border border-gray-200 mb-6 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                       <Sun className="w-12 h-12 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Mode Clair</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Luminosité maximale pour une concentration diurne.</p>
                    {!isDarkMode && <div className="absolute top-6 right-6 bg-indigo-600 rounded-full p-1"><CheckCircle2 className="w-5 h-5 text-white" /></div>}
                  </button>

                  {/* Mode Sombre */}
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`relative p-6 rounded-3xl border-2 text-left transition-all group ${isDarkMode ? "border-indigo-500 bg-indigo-500/10" : "border-gray-100 dark:border-[#333537] hover:border-gray-300 dark:hover:border-gray-600"}`}
                  >
                    <div className="w-full h-40 bg-[#131314] rounded-2xl border border-[#333537] mb-6 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                       <Moon className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Mode Sombre</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Style élégant et reposant, idéal pour les sessions nocturnes.</p>
                    {isDarkMode && <div className="absolute top-6 right-6 bg-indigo-500 rounded-full p-1"><CheckCircle2 className="w-5 h-5 text-white" /></div>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ⚙️ ONGLET : PRÉFÉRENCES (Fusion Notifications + Confidentialité) */}
          {activeTab === "preferences" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">Préférences Générales</h2>
                
                <div className="space-y-12">
                  
                  {/* Section Notifications */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                      <Bell className="w-5 h-5 text-indigo-500" /> Notifications
                    </h3>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">Alertes de messagerie</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recevoir une notification lors d'un nouveau message.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">Rappels de calendrier</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Être prévenu avant le début d'une session d'étude.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gray-100 dark:bg-[#333537]"></div>

                  {/* Section Confidentialité */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5 text-emerald-500" /> Confidentialité
                    </h3>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">Visibilité du profil</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Permettre aux autres étudiants de vous trouver via la recherche.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">Statut de connexion</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Afficher quand vous êtes en train de travailler sur le site.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}