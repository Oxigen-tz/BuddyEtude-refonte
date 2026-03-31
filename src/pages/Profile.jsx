import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, CheckCircle, Edit, MapPin, GraduationCap, 
  Monitor, Users, BookOpen, Target, Clock, ArrowLeft 
} from "lucide-react";
import ProfileForm from "../components/profile/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const LEVEL_LABELS = {
  college: "Collège", lycee: "Lycée", prepa: "Prépa", bts_iut: "BTS/IUT",
  licence: "Licence", master: "Master", doctorat: "Doctorat", autre: "Autre"
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          if (!data.profile_complete) setIsEditing(true);
        } else {
          setProfile({
            display_name: user.displayName || "",
            subjects: [], goals: [], availability: [], profile_complete: false
          });
          setIsEditing(true); 
        }
      } catch (error) {
        console.error("Erreur Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (formData) => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);
      const dataToSave = { 
        ...formData, email: user.email, profile_complete: true, updatedAt: new Date().toISOString() 
      };
      await setDoc(docRef, dataToSave, { merge: true });
      setProfile(dataToSave);
      
      toast.success("Profil enregistré avec succès ! 🎉", {
        description: "Redirection vers votre tableau de bord..."
      });
      
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 1500);

    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 dark:bg-[#1e1f20]" />
        <Skeleton className="h-[600px] rounded-2xl dark:bg-[#1e1f20]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE DE PAGE --- */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon profil</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gérez vos informations et vos préférences</p>
        </div>
        {profile?.profile_complete && !isEditing && (
          <div className="ml-auto flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Profil public</span>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          {/* --- CARTE PRINCIPALE (Remplace Shadcn Card) --- */}
          <div className="border border-gray-100 dark:border-[#333537] shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-[#1e1f20] transition-colors duration-300">
            
            {/* Bannière dégradée */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 dark:border-[#333537]">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.display_name || "Étudiant"}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {profile.school && <span className="font-medium text-indigo-700 dark:text-indigo-400">{profile.school}</span>}
                  {profile.level && <span>• {LEVEL_LABELS[profile.level] || profile.level}</span>}
                  {profile.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.city}</span>}
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="bg-white dark:bg-[#282a2c] text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-[#333537] border border-indigo-100 dark:border-[#333537] rounded-xl shadow-sm">
                <Edit className="w-4 h-4 mr-2" /> Modifier
              </Button>
            </div>
            
            {/* Contenu du profil */}
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Bio */}
              {profile.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">À propos de moi</h3>
                  {/* Fond #131314 pour créer un effet d'enfoncement très propre */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#131314] p-4 rounded-xl border border-transparent dark:border-[#333537]">
                    {profile.bio}
                  </p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Matières */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Matières & Niveaux
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects?.map((s, index) => {
                      const name = typeof s === "string" ? s : s.name;
                      const level = typeof s === "string" ? "" : s.level;
                      const levelLabel = level === "debutant" ? "💡 Débutant" : level === "avance" ? "🚀 Avancé" : "🤝 Intermédiaire";
                      
                      return (
                        <Badge key={index} variant="secondary" className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 shadow-sm border border-transparent dark:border-indigo-500/20">
                          <span className="font-bold">{name}</span>
                          {level && <span className="ml-2 pl-2 border-l border-indigo-200 dark:border-indigo-500/30 text-xs opacity-80">{levelLabel}</span>}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                
                {/* Objectifs */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Objectifs
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.goals?.map(g => (
                      <Badge key={g} variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 dark:bg-purple-500/5">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Disponibilités */}
              <div className="pt-6 border-t border-gray-100 dark:border-[#333537]">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Préférences & Disponibilités
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  {profile.availability?.map(a => (
                    <span key={a} className="text-sm font-medium bg-gray-100 dark:bg-[#282a2c] text-gray-700 dark:text-gray-300 border border-transparent dark:border-[#333537] px-3 py-1.5 rounded-lg">
                      {a}
                    </span>
                  ))}
                  <div className="h-6 w-px bg-gray-200 dark:bg-[#333537] mx-2 hidden md:block"></div>
                  {profile.is_online && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg border border-transparent dark:border-green-500/20">
                      <Monitor className="w-4 h-4" /> En ligne
                    </span>
                  )}
                  {profile.is_in_person && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-transparent dark:border-blue-500/20">
                      <Users className="w-4 h-4" /> Présentiel
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* --- MODE ÉDITION --- */
        <div className="border border-gray-100 dark:border-[#333537] shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-[#1e1f20] transition-colors duration-300">
          <div className="p-6 md:p-8 border-b border-gray-50 dark:border-[#333537] flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Modifier mes informations</h2>
            {profile?.profile_complete && (
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a2c]">
                <ArrowLeft className="w-4 h-4 mr-2" /> Annuler
              </Button>
            )}
          </div>
          <div className="p-6 md:p-8">
            <ProfileForm profile={profile} onSave={handleSave} saving={isSaving} />
          </div>
        </div>
      )}
    </div>
  );
}