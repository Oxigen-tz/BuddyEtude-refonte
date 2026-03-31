import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Plus, Clock, MapPin, Monitor, Users, X, Check, 
  Loader2, Presentation
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Sessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", buddy_email: "", subject: "", date: "", time: "",
    duration_minutes: 60, mode: "en_ligne", location: "", notes: ""
  });

  const [buddies, setBuddies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // 1. Charger les binômes (requêtes acceptées)
  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, "requests"), where("status", "==", "accepted"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.from_email === user.email) list.push({ email: data.to_email, name: data.to_name });
        else if (data.to_email === user.email) list.push({ email: data.from_email, name: data.from_name });
      });
      const unique = list.filter((v, i, a) => a.findIndex(t => t.email === v.email) === i);
      setBuddies(unique);
    });

    return () => unsub();
  }, [user]);

  // 2. Charger les sessions avec sécurité
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "sessions"), where("participants", "array-contains", user.email));
    const unsub = onSnapshot(q, (snapshot) => {
      const sessList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setSessions(sessList.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    }, (error) => {
      console.error("Erreur de chargement des sessions:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // 3. Créer une session
  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const buddy = buddies.find(b => b.email === form.buddy_email);
      await addDoc(collection(db, "sessions"), {
        ...form,
        organizer_email: user.email,
        organizer_name: user.displayName || "Moi",
        buddy_name: buddy?.name || "Binôme",
        participants: [user.email, form.buddy_email],
        status: "planned",
        createdAt: serverTimestamp(),
      });
      setShowCreate(false);
      setForm({ title: "", buddy_email: "", subject: "", date: "", time: "", duration_minutes: 60, mode: "en_ligne", location: "", notes: "" });
      toast.success("Session planifiée !");
    } catch (error) {
      toast.error("Erreur lors de la création");
    } finally {
      setIsCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "sessions", id), { status });
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const planned = sessions.filter(s => s.status === "planned");
  const completed = sessions.filter(s => s.status === "completed");

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions d'étude</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Planifiez et suivez vos sessions</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreate(true)} 
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium shadow-sm"
          disabled={buddies.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" /> Nouvelle session
        </Button>
      </div>

      {/* --- MESSAGE D'ALERTE (Pas de binômes) --- */}
      {buddies.length === 0 && !loading && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl mb-8 transition-colors duration-300">
          <div className="p-6 text-center">
            <Users className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto mb-3" />
            <p className="text-amber-800 dark:text-amber-300 font-medium">Vous n'avez pas encore de binôme accepté.</p>
            <p className="text-amber-600 dark:text-amber-400/80 text-sm mt-1">Allez dans l'onglet Recherche pour trouver un partenaire !</p>
          </div>
        </div>
      )}

      {/* --- SESSIONS À VENIR --- */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Prochaines sessions ({planned.length})
        </h2>
        
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            <Skeleton className="h-48 rounded-2xl dark:bg-[#1e1f20]" />
            <Skeleton className="h-48 rounded-2xl dark:bg-[#1e1f20]" />
          </div>
        ) : planned.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm py-10 text-center bg-white dark:bg-[#1e1f20] rounded-2xl border border-dashed border-gray-200 dark:border-[#333537] transition-colors duration-300">
            Aucune session prévue
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {planned.map(s => (
              <SessionCard 
                key={s.id} 
                session={s} 
                userEmail={user?.email} 
                onUpdateStatus={updateStatus} 
                onJoinWhiteboard={() => navigate(createPageUrl("Whiteboard", { sessionId: s.id }))}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- SESSIONS TERMINÉES --- */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> Historique ({completed.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-5 opacity-75">
            {completed.map(s => <SessionCard key={s.id} session={s} userEmail={user?.email} />)}
          </div>
        </div>
      )}

      {/* --- DIALOG DE CRÉATION --- */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl max-w-lg dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Nouvelle session d'étude</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Titre de la session</Label>
              <Input 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                placeholder="Ex: Révision Algèbre" 
                className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl" 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Choisir un binôme</Label>
              <Select value={form.buddy_email} onValueChange={(v) => setForm({ ...form, buddy_email: v })}>
                <SelectTrigger className="rounded-xl bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white">
                  <SelectValue placeholder="Sélectionnez un binôme" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
                  {buddies.map(b => (
                    <SelectItem key={b.email} value={b.email} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Date</Label>
                <Input 
                  type="date" 
                  value={form.date} 
                  onChange={(e) => setForm({ ...form, date: e.target.value })} 
                  className="bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Heure</Label>
                <Input 
                  type="time" 
                  value={form.time} 
                  onChange={(e) => setForm({ ...form, time: e.target.value })} 
                  className="bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Durée (min)</Label>
                <Input 
                  type="number" 
                  value={form.duration_minutes} 
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} 
                  className="bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Mode</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                  <SelectTrigger className="rounded-xl bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
                    <SelectItem value="en_ligne" className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">En ligne (Tableau blanc)</SelectItem>
                    <SelectItem value="presentiel" className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">Présentiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowCreate(false)} 
              className="rounded-xl border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c] flex-1 sm:flex-none"
            >
              Annuler
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl flex-1 sm:flex-none shadow-sm"
              disabled={!form.title || !form.buddy_email || !form.date || isCreating}
              onClick={handleCreateSession}
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Planifier la session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant Carte de Session (Refondu avec des div simples)
function SessionCard({ session, userEmail, onUpdateStatus, onJoinWhiteboard }) {
  const isOrganizer = session.organizer_email === userEmail;
  const buddyName = isOrganizer ? session.buddy_name : session.organizer_name;

  return (
    <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        
        {/* En-tête carte */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{session.title}</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">Avec {buddyName}</p>
          </div>
          <Badge className={`border-0 ${session.status === "completed" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
            {session.status === "planned" ? "À venir" : "Terminée"}
          </Badge>
        </div>
        
        {/* Détails carte */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{session.time} ({session.duration_minutes} min)</span>
          </div>
          <div className="flex items-center gap-2">
            {session.mode === "en_ligne" ? (
              <><Monitor className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> <span className="text-indigo-600 dark:text-indigo-400 font-medium">En ligne</span></>
            ) : (
              <><MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" /> <span>Présentiel</span></>
            )}
          </div>
        </div>

        {/* Actions */}
        {session.status === "planned" && (
          <div className="mt-6 flex flex-col gap-3">
            {session.mode === "en_ligne" && (
              <Button 
                onClick={onJoinWhiteboard}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium py-5 shadow-sm"
              >
                <Presentation className="w-4 h-4 mr-2" /> Rejoindre le tableau blanc
              </Button>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 rounded-xl text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 bg-transparent"
                onClick={() => onUpdateStatus(session.id, "completed")}
              >
                Terminée
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 rounded-xl text-red-500 dark:text-red-400 border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent"
                onClick={() => onUpdateStatus(session.id, "cancelled")}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}