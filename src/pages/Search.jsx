import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, Filter, Users, Loader2, MapPin, Monitor } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BuddyCard from "../components/search/BuddyCard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // Nouveau filtre
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
    // Filtre par Niveau
    if (levelFilter !== "all" && p.level !== levelFilter) return false;
    
    // Filtre par Type (En ligne / Présentiel)
    if (typeFilter === "online" && !p.is_online) return false;
    if (typeFilter === "inperson" && !p.is_in_person) return false;

    // Recherche par texte
    if (search) {
      const q = search.toLowerCase();
      const matchName = (p.display_name || p.full_name || "").toLowerCase().includes(q);
      
      const matchSubject = p.subjects?.some(s => {
        const subjectName = typeof s === "string" ? s : s.name;
        return subjectName?.toLowerCase().includes(q);
      });
      
      const matchCity = (p.city || "").toLowerCase().includes(q);
      const matchSchool = (p.school || "").toLowerCase().includes(q);
      return matchName || matchSubject || matchCity || matchSchool;
    }
    return true;
  });

  const sentToEmails = myRequests.map(r => r.to_email);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Trouver un binôme</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Parcourez les profils et envoyez vos demandes d'étude</p>
        </div>
      </div>

      {/* --- BARRE DE RECHERCHE ET FILTRES MULTIPLES --- */}
      <div className="bg-white dark:bg-[#1e1f20] p-4 rounded-2xl border border-gray-100 dark:border-[#333537] shadow-sm mb-8 flex flex-col md:flex-row gap-4 transition-colors duration-300">
        
        {/* Champ de texte */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Matière, ville, nom de l'école..."
            className="pl-11 py-6 h-full rounded-xl border-gray-200 dark:border-[#333537] bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-indigo-500/50"
          />
        </div>
        
        {/* Les 2 filtres (Sélecteurs) */}
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 py-0 rounded-xl border-gray-200 dark:border-[#333537] bg-white dark:bg-[#1e1f20] text-gray-700 dark:text-gray-300">
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
            <SelectTrigger className="w-full sm:w-[200px] h-12 py-0 rounded-xl border-gray-200 dark:border-[#333537] bg-white dark:bg-[#1e1f20] text-gray-700 dark:text-gray-300">
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
            onClick={() => {setSearch(""); setLevelFilter("all"); setTypeFilter("all");}}
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
            placeholder="Bonjour ! J'ai vu que tu préparais aussi les mêmes examens. Ça te dirait qu'on révise ensemble sur le tableau blanc ce week-end ?"
            className="h-32 mt-6 resize-none bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-indigo-500/50 rounded-2xl p-4"
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
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-sm flex-1 sm:flex-none py-6 font-medium"
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