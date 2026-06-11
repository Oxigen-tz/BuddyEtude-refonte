import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Calendar, Sparkles, Check, X } from "lucide-react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [hasBuddy, setHasBuddy] = useState(false);
  
  // NOUVEAU : On gère l'état de l'étape 3 et la visibilité du tutoriel via le localStorage
  const [hasLaunchedSession, setHasLaunchedSession] = useState(localStorage.getItem("tuto_step3") === "true");
  const [showTutorial, setShowTutorial] = useState(localStorage.getItem("tuto_hidden") !== "true");

  const firstName = user?.displayName?.split(" ")[0] || user?.full_name?.split(" ")[0] || "Étudiant";

  useEffect(() => {
    if (!user?.email) return;

    const checkUserProgress = async () => {
      try {
        // 1. Profil complété ?
        const userQuery = query(collection(db, "users"), where("email", "==", user.email));
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          const userData = userSnap.docs[0].data();
          setIsProfileComplete(!!userData.profile_complete);
        }

        // 2. Binôme trouvé ?
        const reqQueryTo = query(collection(db, "requests"), where("to_email", "==", user.email), where("status", "==", "accepted"));
        const reqQueryFrom = query(collection(db, "requests"), where("from_email", "==", user.email), where("status", "==", "accepted"));
        
        const [toSnap, fromSnap] = await Promise.all([getDocs(reqQueryTo), getDocs(reqQueryFrom)]);
        if (!toSnap.empty || !fromSnap.empty) {
          setHasBuddy(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la progression :", error);
      }
    };

    checkUserProgress();
  }, [user]);

  // Fonction pour masquer définitivement le tutoriel
  const hideTutorialBanner = () => {
    localStorage.setItem("tuto_hidden", "true");
    setShowTutorial(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Bonjour, {firstName} <span className="animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Prêt à booster vos révisions aujourd'hui ?
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

      {/* --- BANNIÈRE D'ONBOARDING DYNAMIQUE --- */}
      {showTutorial && (
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400 opacity-20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" /> 
                {isProfileComplete && hasBuddy && hasLaunchedSession ? "Félicitations, vous êtes prêt !" : "Bienvenue sur votre espace !"}
              </h2>
              
              {/* NOUVEAU : Bouton pour fermer le tuto */}
              <button onClick={hideTutorialBanner} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors" title="Masquer le tutoriel">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-indigo-100 mb-8 max-w-xl text-sm md:text-base leading-relaxed">
              {isProfileComplete && hasBuddy && hasLaunchedSession
                ? "Vous avez accompli toutes les étapes de base. Vous pouvez maintenant fermer ce tutoriel et profiter pleinement de BuddyEtude !" 
                : "Suivez ces 3 étapes simples pour débloquer tout le potentiel de BuddyEtude et commencer à réviser à plusieurs."}
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Étape 1 : Compléter le profil */}
              <div 
                onClick={() => !isProfileComplete && navigate(createPageUrl("Profile"))}
                className={`rounded-2xl p-5 transition-all ${isProfileComplete ? "bg-white/5 border border-white/10 opacity-70 cursor-default" : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 cursor-pointer group"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 font-bold shadow-sm transition-transform ${isProfileComplete ? "bg-emerald-400 text-white" : "bg-white text-indigo-700 group-hover:scale-110"}`}>
                  {isProfileComplete ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <h3 className="font-semibold text-white mb-1">Compléter mon profil</h3>
                <p className="text-sm text-indigo-100">{isProfileComplete ? "Profil validé et visible." : "Ajoutez vos matières et votre niveau."}</p>
              </div>

              {/* Étape 2 : Trouver un binôme */}
              <div 
                onClick={() => !hasBuddy && navigate(createPageUrl("Search"))}
                className={`rounded-2xl p-5 transition-all ${hasBuddy ? "bg-white/5 border border-white/10 opacity-70 cursor-default" : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 cursor-pointer group"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 font-bold shadow-sm transition-transform ${hasBuddy ? "bg-emerald-400 text-white" : "bg-white text-indigo-700 group-hover:scale-110"}`}>
                  {hasBuddy ? <Check className="w-5 h-5" /> : "2"}
                </div>
                <h3 className="font-semibold text-white mb-1">Trouver un binôme</h3>
                <p className="text-sm text-indigo-100">{hasBuddy ? "Vous avez des partenaires d'étude." : "Cherchez des étudiants compatibles."}</p>
              </div>

              {/* Étape 3 : Lancer une session (Maintenant elle se valide !) */}
              <div 
                onClick={() => {
                  if (isProfileComplete && hasBuddy && !hasLaunchedSession) {
                    localStorage.setItem("tuto_step3", "true"); // On sauvegarde la validation
                    setHasLaunchedSession(true); // On met à jour l'icône direct
                    navigate(createPageUrl("Sessions"));
                  } else if (hasLaunchedSession) {
                     navigate(createPageUrl("Sessions"));
                  }
                }}
                className={`rounded-2xl p-5 transition-all ${hasLaunchedSession ? "bg-white/5 border border-white/10 opacity-70 cursor-default" : isProfileComplete && hasBuddy ? "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 cursor-pointer group shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "bg-white/5 border border-white/10 opacity-60 cursor-not-allowed"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 font-bold transition-transform ${hasLaunchedSession ? "bg-emerald-400 text-white shadow-sm" : isProfileComplete && hasBuddy ? "bg-white text-indigo-700 group-hover:scale-110 shadow-sm" : "bg-white/30 text-indigo-900"}`}>
                  {hasLaunchedSession ? <Check className="w-5 h-5" /> : "3"}
                </div>
                <h3 className="font-semibold text-white mb-1">Lancer une session</h3>
                <p className="text-sm text-indigo-200">{hasLaunchedSession ? "Première session planifiée !" : isProfileComplete && hasBuddy ? "Organisez votre premier tableau blanc !" : "Disponible une fois votre binôme trouvé."}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ZONES DE CONTENU --- */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Demandes reçues */}
        <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 shadow-sm flex flex-col min-h-[250px] transition-colors duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-500" />
              Nouveaux contacts
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-1">
              Faites le premier pas !
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-[250px]">
              Découvrez les étudiants qui partagent vos matières et proposez-leur de travailler.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate(createPageUrl("Search"))}
              className="border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl"
            >
              Explorer les profils
            </Button>
          </div>
        </div>

        {/* Prochaines sessions */}
        <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 shadow-sm flex flex-col min-h-[250px] transition-colors duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Prochaines sessions
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-1">
              Votre agenda est vide
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-[250px]">
              Il est temps d'organiser votre prochaine session de révision au tableau blanc.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl("Sessions"))}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl shadow-sm"
            >
              Planifier une session
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}