import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Users, Bell, Calendar, MessageSquare, Search, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.displayName?.split(" ")[0] || user?.full_name?.split(" ")[0] || "Étudiant";

  // Données factices pour l'affichage (à remplacer par tes vraies requêtes Firebase si besoin)
  const stats = [
    { label: "Binômes", value: "1", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
    { label: "Demandes", value: "0", icon: Bell, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
    { label: "Sessions", value: "0", icon: Calendar, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
    { label: "Messages", value: "—", icon: MessageSquare, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Bonjour, {firstName} <span className="animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Voici un aperçu de votre activité
          </p>
        </div>
        
        <Button 
          onClick={() => navigate(createPageUrl("Search"))}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-sm transition-all"
        >
          <Search className="w-4 h-4 mr-2" />
          Trouver un binôme
        </Button>
      </div>

      {/* --- CARTES DE STATISTIQUES --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-2xl p-5 shadow-sm transition-colors duration-300"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* --- ZONES DE CONTENU (Demandes & Sessions) --- */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Demandes reçues */}
        <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-2xl p-6 shadow-sm flex flex-col min-h-[250px] transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Demandes reçues
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-[#131314] rounded-full flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Aucune demande en attente
            </p>
          </div>
        </div>

        {/* Prochaines sessions */}
        <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-2xl p-6 shadow-sm flex flex-col min-h-[250px] transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Prochaines sessions
            </h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Aucune session planifiée
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate(createPageUrl("Sessions"))}
              className="border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c] rounded-xl"
            >
              Planifier une session
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}