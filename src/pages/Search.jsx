import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, Filter, Users, Loader2 } from "lucide-react";
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

export default function Search() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
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
    if (levelFilter !== "all" && p.level !== levelFilter) return false;
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
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trouver un binôme</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Parcourez les profils et envoyez une demande</p>
        </div>
      </div>

      {/* --- BARRE DE RECHERCHE ET FILTRE --- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, matière, ville..."
            className="pl-11 py-6 rounded-xl border-gray-200 dark:border-[#333537] bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-indigo-500/50 shadow-sm transition-colors duration-300"
          />
        </div>
        
        {/* Le Select de Shadcn est parfois difficile à styliser en mode sombre, on force les couleurs */}
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-52 py-6 rounded-xl border-gray-200 dark:border-[#333537] bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-gray-100 shadow-sm transition-colors duration-300">
            <Filter className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
            {LEVEL_OPTIONS.map(l => (
              <SelectItem key={l.value} value={l.value} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Aucun profil trouvé</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Essayez de modifier vos filtres de recherche</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        {/* On s'assure que le contenu du Dialog prend les couleurs sombres */}
        <DialogContent className="rounded-2xl sm:rounded-2xl dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Demande de binôme</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Envoyez un message à <strong className="text-gray-900 dark:text-white">{requestDialog?.display_name || requestDialog?.full_name}</strong> pour lui proposer d'étudier ensemble.
          </p>
          <Textarea
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Bonjour ! J'aimerais étudier avec toi..."
            className="h-28 mt-4 resize-none bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-indigo-500/50 rounded-xl"
          />
          <DialogFooter className="mt-6 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setRequestDialog(null)} 
              className="rounded-xl border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c] flex-1 sm:flex-none"
            >
              Annuler
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-sm flex-1 sm:flex-none"
              disabled={isSending}
              onClick={handleSendRequest}
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}