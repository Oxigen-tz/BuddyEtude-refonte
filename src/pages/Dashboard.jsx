import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Calendar, Sparkles, Check, X, ArrowRight } from "lucide-react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [hasBuddy, setHasBuddy] = useState(false);
  
  const [hasLaunchedSession, setHasLaunchedSession] = useState(localStorage.getItem("tuto_step3") === "true");
  const [showTutorial, setShowTutorial] = useState(localStorage.getItem("tuto_hidden") !== "true");

  const firstName = user?.displayName?.split(" ")[0] || user?.full_name?.split(" ")[0] || "Étudiant";

  useEffect(() => {
    if (!user?.email) return;

    const checkUserProgress = async () => {
      try {
        const userQuery = query(collection(db, "users"), where("email", "==", user.email));
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          const userData = userSnap.docs[0].data();
          setIsProfileComplete(!!userData.profile_complete);
        }

        const reqQueryTo = query(collection(db, "requests"), where("to_email", "==", user.email), where("status", "==", "accepted"));
        const reqQueryFrom = query(collection(db, "requests"), where("from_email", "==", user.email));
        
        const [toSnap, fromSnap] = await Promise.all([getDocs(reqQueryTo), getDocs(reqQueryFrom)]);
        if (!toSnap.empty || !fromSnap.empty) {
          setHasBuddy(true);
        }
      } catch (error) {
        console.error("Erreur progression :", error);
      }
    };

    checkUserProgress();
  }, [user]);

  const hideTutorialBanner = () => {
    localStorage.setItem("tuto_hidden", "true");
    setShowTutorial(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Bonjour, {firstName} <span className="animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-sans">
            Prêt à booster vos révisions aujourd'hui ?
          </p>
        </div>
        
        <Button 
          onClick={() => navigate(createPageUrl("Search"))}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          <Search className="w-4 h-4 mr-2" />
          Trouver un binôme
        </Button>
      </div>

      {/* --- BANNIÈRE D'ONBOARDING --- */}
      {showTutorial && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden transition-all duration-500">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" /> 
                {isProfileComplete && hasBuddy && hasLaunchedSession ? "Félicitations, vous êtes prêt !" : "Bienvenue sur votre espace !"}
              </h2>
              <button onClick={hideTutorialBanner} className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Étape 1 */}
              <div onClick={() => !isProfileComplete && navigate(createPageUrl("Profile"))} className={`rounded-lg p-4 border transition-all ${isProfileComplete ? "bg-muted/50 border-transparent opacity-70" : "bg-card border-border hover:border-primary cursor-pointer"}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center mb-3 text-xs font-bold ${isProfileComplete ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"}`}>
                  {isProfileComplete ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <h3 className="font-semibold text-sm mb-1 text-foreground">Compléter mon profil</h3>
                <p className="text-xs text-muted-foreground">{isProfileComplete ? "Profil validé." : "Ajoutez vos matières."}</p>
              </div>

              {/* Étape 2 */}
              <div onClick={() => !hasBuddy && navigate(createPageUrl("Search"))} className={`rounded-lg p-4 border transition-all ${hasBuddy ? "bg-muted/50 border-transparent opacity-70" : "bg-card border-border hover:border-primary cursor-pointer"}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center mb-3 text-xs font-bold ${hasBuddy ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"}`}>
                  {hasBuddy ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <h3 className="font-semibold text-sm mb-1 text-foreground">Trouver un binôme</h3>
                <p className="text-xs text-muted-foreground">{hasBuddy ? "Partenaires trouvés." : "Cherchez des étudiants."}</p>
              </div>

              {/* Étape 3 */}
              <div onClick={() => {
                  if (isProfileComplete && hasBuddy && !hasLaunchedSession) {
                    localStorage.setItem("tuto_step3", "true"); setHasLaunchedSession(true); navigate(createPageUrl("Sessions"));
                  } else if (hasLaunchedSession) navigate(createPageUrl("Sessions"));
                }}
                className={`rounded-lg p-4 border transition-all ${hasLaunchedSession ? "bg-muted/50 border-transparent opacity-70" : isProfileComplete && hasBuddy ? "bg-card border-border hover:border-primary cursor-pointer" : "bg-muted/30 border-transparent opacity-50 cursor-not-allowed"}`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center mb-3 text-xs font-bold ${hasLaunchedSession ? "bg-emerald-500 text-white" : isProfileComplete && hasBuddy ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                  {hasLaunchedSession ? <Check className="w-4 h-4" /> : "3"}
                </div>
                <h3 className="font-semibold text-sm mb-1 text-foreground">Lancer une session</h3>
                <p className="text-xs text-muted-foreground">{hasLaunchedSession ? "Session planifiée." : "Organisez un tableau blanc."}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ZONES DE CONTENU DENSES --- */}
      <div className="grid md:grid-cols-2 gap-4">
        
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Développer votre réseau</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                Découvrez les étudiants qui partagent vos matières et proposez-leur de travailler sur un tableau blanc collaboratif.
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="ghost" onClick={() => navigate(createPageUrl("Search"))} className="text-primary hover:text-primary hover:bg-primary/10">
              Explorer les profils <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Prochaines sessions</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                Votre agenda est actuellement vide. Planifiez une session de révision avec vos binômes pour structurer votre travail.
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="ghost" onClick={() => navigate(createPageUrl("Sessions"))} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
              Planifier <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}