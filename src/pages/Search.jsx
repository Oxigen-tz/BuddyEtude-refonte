import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, Filter, Users, Loader2, MapPin, Monitor, BookOpen, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BuddyCard from "@/components/search/BuddyCard";
import Autocomplete from "@/components/ui/Autocomplete";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LEVEL_OPTIONS = [
  { value: "all", label: "Tous les niveaux" },
  { value: "college", label: "Collège" },
  { value: "lycee", label: "Lycée" },
  { value: "prepa", label: "Prépa" },
  { value: "bts_iut", label: "BTS / IUT" },
  { value: "licence", label: "Licence" },
  { value: "master", label: "Master" },
  { value: "doctorat", label: "Doctorat" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "En ligne & Présentiel" },
  { value: "online", label: "En ligne uniquement" },
  { value: "inperson", label: "Présentiel uniquement" },
];

export default function Search() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); 

  const [requestDialog, setRequestDialog] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  
  const [profiles, setProfiles] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const qProfiles = query(collection(db, "users"), where("profile_complete", "==", true));
    const unsubProfiles = onSnapshot(qProfiles, (snapshot) => {
      const pList = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.email !== user.email); 
      setProfiles(pList);
      setIsLoading(false);
    });

    const qRequests = query(collection(db, "requests"), where("from_email", "==", user.email));
    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      setMyRequests(snapshot.docs.map(d => d.data()));
    });

    return () => {
      unsubProfiles();
      unsubRequests();
    };
  }, [user]);

  // Si l'utilisateur n'est pas connecté, on bloque l'accès avec un écran propre
  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-6 bg-white dark:bg-[#1e1f20] rounded-3xl border border-gray-100 dark:border-[#333537] shadow-sm my-12 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Connexion requise</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          Tu dois être connecté à ton compte BuddyEtude pour accéder à la recherche de binômes et contacter des étudiants.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-6 rounded-xl font-medium shadow-sm transition-all"
        >
          Retourner à l'accueil / Se connecter
        </Button>
      </div>
    );
  }

  // 1. Recherche dynamique des Villes via l'API officielle française
  const searchFrenchCities = async (queryText) => {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(queryText)}&fields=nom&boost=population&limit=6`
    );
    const data = await response.json();
    return data.map((commune) => commune.nom);
  };

  // 2. Recherche dynamique des Matières sur le web avec filtre anti-géographie
  const searchSubjects = async (queryText) => {
    if (!queryText || queryText.trim().length < 2) return [];

    try {
      const response = await fetch(
        `https://fr.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(queryText)}&limit=15&namespace=0&format=json&origin=*`
      );
      const data = await response.json();
      const results = data[1] || [];

      const forbiddenWords = [
        "nord", "pas-de-calais", "france", "paris", "lyon", "marseille", 
        "region", "département", "académie", "canton", "arrondissement",
        "territoire", "provence", "bretagne", "corse", "guadeloupe"
      ];

      const cleanResults = results.filter(item => {
        const lower = item.toLowerCase();
        const hasForbiddenWord = forbiddenWords.some(word => lower.includes(word));
        const isTooComplex = lower.includes(" du ") || lower.includes(" de la ") || lower.split(" ").length > 4;

        return !hasForbiddenWord && !isTooComplex;
      });

      return cleanResults.slice(0, 6);
    } catch (error) {
      console.error("Erreur de recherche:", error);
      return [];
    }
  };

  const handleSendRequest = async () => {
    if (!requestDialog || !user) return;
    
    setIsSending(true);
    try {
      let defaultSubject = "Général";
      if (Array.isArray(requestDialog.subjects) && requestDialog.subjects.length > 0) {
        defaultSubject = typeof requestDialog.subjects[0] === "string" 
          ? requestDialog.subjects[0] 
          : requestDialog.subjects[0].name;
      }

      await addDoc(collection(db, "requests"), {
        from_email: user.email,
        from_name: user.displayName || user.full_name || "Étudiant",
        to_email: requestDialog.email,
        to_name: requestDialog.display_name || requestDialog.full_name,
        message: requestMessage,
        status: "pending",
        subject: defaultSubject,
        createdAt: serverTimestamp(),
      });

      toast.success("Demande envoyée avec succès !");
      setRequestDialog(null);
      setRequestMessage("");
    } catch (error) {
      toast.error("Impossible d'envoyer la demande");
    } finally {
      setIsSending(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    if (levelFilter !== "all" && p.level !== levelFilter) return false;
    if (typeFilter === "online" && !p.is_online) return false;
    if (typeFilter === "inperson" && !p.is_in_person) return false;
    if (cityFilter && !p.city?.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (subjectFilter) {
      const hasSubject = p.subjects?.some(s => {
        const subjectName = typeof s === "string" ? s : s.name;
        return subjectName?.toLowerCase().includes(subjectFilter.toLowerCase());
      });
      if (!hasSubject) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = (p.display_name || p.full_name || "").toLowerCase().includes(q);
      const matchSchool = (p.school || "").toLowerCase().includes(q);
      return matchName || matchSchool;
    }
    return true;
  });

  const sentToEmails = myRequests.map(r => r.to_email);

  const resetFilters = () => {
    setSearch("");
    setSubjectFilter("");
    setCityFilter("");
    setLevelFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Trouver un binôme</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Filtrez les profils pour trouver le partenaire d'étude idéal</p>
        </div>
      </div>

      {/* --- PANNEAU DE FILTRES MULTIPLES --- */}
      <div className="bg-white dark:bg-[#1e1f20] p-5 rounded-2xl border border-gray-100 dark:border-[#333537] shadow-sm mb-8 space-y-4 transition-colors duration-300">
        
        {/* Ligne 1 : Recherche générale & Matière avec Autocomplétion dynamique */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou école..."
              className="pl-11 h-[50px] rounded-xl border-gray-200 dark:border-[#333537] bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-500/50"
            />
          </div>
          
          <div className="flex-1">
            <Autocomplete
              fetchOptions={searchSubjects}
              value={subjectFilter}
              onChange={setSubjectFilter}
              placeholder="Filtrer par matière (ex: Droit, Cinéma...)"
              icon={BookOpen}
            />
          </div>
        </div>

        {/* Ligne 2 : Ville (API infinie) & Menus déroulants */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Autocomplete
              fetchOptions={searchFrenchCities}
              value={cityFilter}
              onChange={setCityFilter}
              placeholder="Filtrer par ville..."
              icon={MapPin}
            />
          </div>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-[220px] h-[50px] rounded-xl border-gray-200 dark:border-[#333537] bg-white dark:bg-[#1e1f20] text-gray-700 dark:text-gray-300">
              <Filter className="w-4 h-4 mr-2 text-indigo-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 rounded-xl">
              {LEVEL_OPTIONS.map(l => (
                <SelectItem key={l.value} value={l.value} className="focus:bg-indigo-50 dark:focus:bg-indigo-500/10 cursor-pointer rounded-lg">
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[240px] h-[50px] rounded-xl border-gray-200 dark:border-[#333537] bg-white dark:bg-[#1e1f20] text-gray-700 dark:text-gray-300">
              {typeFilter === "online" ? <Monitor className="w-4 h-4 mr-2 text-emerald-500" /> : <MapPin className="w-4 h-4 mr-2 text-blue-500" />}
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 rounded-xl">
              {TYPE_OPTIONS.map(t => (
                <SelectItem key={t.value} value={t.value} className="focus:bg-indigo-50 dark:focus:bg-indigo-500/10 cursor-pointer rounded-lg">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- RÉSULTATS --- */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl dark:bg-[#1e1f20]" />
          ))}
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1e1f20] rounded-2xl border border-dashed border-gray-200 dark:border-[#333537] transition-colors duration-300">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#131314] rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-bold">Aucun profil ne correspond</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-sm mx-auto">
            Essayez d'élargir votre recherche en retirant certains filtres ou en modifiant vos mots-clés.
          </p>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="mt-6 rounded-xl border-gray-200 dark:border-[#333537] hover:bg-gray-50 dark:hover:bg-[#282a2c]"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(p => (
            <BuddyCard
              key={p.id}
              profile={p}
              onRequest={(profile) => setRequestDialog(profile)}
              alreadyRequested={sentToEmails.includes(p.email)}
              isOwnProfile={p.email === user?.email}
            />
          ))}
        </div>
      )}

      {/* --- POPUP DEMANDE DE BINÔME --- */}
      <Dialog open={!!requestDialog} onOpenChange={() => setRequestDialog(null)}>
        <DialogContent className="rounded-3xl sm:rounded-3xl dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Proposer une session</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Envoyez un petit mot à <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{requestDialog?.display_name || requestDialog?.full_name}</strong> pour vous présenter et proposer d'étudier ensemble.
          </p>
          <Textarea
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Bonjour ! J'ai vu que tu préparais aussi les mêmes examens..."
            className="h-32 mt-6 resize-none bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-500/50 rounded-2xl p-4"
          />
          <DialogFooter className="mt-8 flex gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={() => setRequestDialog(null)} 
              className="rounded-xl border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c] flex-1 sm:flex-none py-6 font-medium"
            >
              Annuler
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-sm flex-1 sm:flex-none py-6 font-medium"
              disabled={isSending || !requestMessage.trim()}
              onClick={handleSendRequest}
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Envoyer ma demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}