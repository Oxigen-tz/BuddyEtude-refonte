import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Monitor, Users, Send } from "lucide-react";

const LEVEL_LABELS = {
  college: "Collège", lycee: "Lycée", prepa: "Prépa", bts_iut: "BTS/IUT",
  licence: "Licence", master: "Master", doctorat: "Doctorat", autre: "Autre"
};

const SUBJECT_LEVELS = {
  debutant: "💡 Débutant",
  intermediaire: "🤝 Intermédiaire",
  avance: "🚀 Avancé"
};

export default function BuddyCard({ profile, onRequest, alreadyRequested, isOwnProfile }) {
  const name = profile.display_name || profile.full_name || "Étudiant";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Couleurs neutres et élégantes pour les avatars
  const colors = [
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  ];
  const colorIndex = name.length % colors.length;

  return (
    <div className="border border-gray-100 dark:border-[#333537] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group bg-white dark:bg-[#1e1f20]">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 rounded-xl">
            <AvatarFallback className={`${colors[colorIndex]} rounded-xl text-lg font-bold`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {/* Titre blanc pur en mode sombre */}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">{name}</h3>
            
            {/* Textes secondaires gris neutre (pas de bleu) */}
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              {profile.level && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {LEVEL_LABELS[profile.level] || profile.level}
                </span>
              )}
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.city}
                </span>
              )}
              {profile.is_online && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Monitor className="w-3.5 h-3.5" /> En ligne
                </span>
              )}
              {profile.is_in_person && (
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Users className="w-3.5 h-3.5" /> Présentiel
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio : Gris clair pour être lisible mais pas agressif */}
        {profile.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 line-clamp-2 leading-relaxed h-10">
            {profile.bio}
          </p>
        )}

        <div className="space-y-3 mt-4">
          {profile.subjects && profile.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.subjects.slice(0, 4).map((s, idx) => {
                const subjectName = typeof s === "string" ? s : s.name;
                const subjectLevel = typeof s === "object" && s.level ? s.level : "intermediaire";
                
                return (
                  <Badge key={idx} variant="secondary" className="bg-gray-100 dark:bg-[#282a2c] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333537] font-medium text-[10px] md:text-xs flex items-center gap-1.5 py-1 transition-colors">
                    <span>{subjectName}</span>
                    <span className="pl-1.5 border-l border-gray-200 dark:border-gray-600 opacity-80 font-normal">
                      {SUBJECT_LEVELS[subjectLevel]}
                    </span>
                  </Badge>
                );
              })}
              {profile.subjects.length > 4 && (
                <Badge variant="secondary" className="bg-gray-100 dark:bg-[#282a2c] text-gray-500 dark:text-gray-400 text-[10px]">
                  +{profile.subjects.length - 4}
                </Badge>
              )}
            </div>
          )}
        </div>

        {!isOwnProfile && (
          <div className="mt-5">
            <Button
              className={`w-full rounded-xl font-medium transition-all ${
                alreadyRequested
                  ? "bg-gray-100 dark:bg-[#282a2c] text-gray-400 dark:text-gray-500 cursor-not-allowed border-0 hover:bg-gray-100 dark:hover:bg-[#282a2c]"
                  : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-sm"
              }`}
              disabled={alreadyRequested}
              onClick={() => onRequest(profile)}
            >
              {alreadyRequested ? "Demande envoyée" : <><Send className="w-4 h-4 mr-2" /> Demander comme binôme</>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}