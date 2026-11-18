import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Plus, Clock, MapPin, Monitor, Users, Check, AlertCircle,
  Loader2, Presentation
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "react-i18next";
import { parseSessionStart, parseSessionEnd, sessionStartTime as startTime, isSessionOver } from "@/lib/sessions";

const EMPTY_FORM = {
  title: "", buddy_email: "", subject: "", date: "", time: "",
  duration_minutes: 60, mode: "en_ligne", location: "", notes: ""
};

// Anciennes sessions : organizer_name valait "Moi" / "Me" (user.displayName n'existait pas).
const LEGACY_PLACEHOLDER_NAMES = ["Moi", "Me"];

// Identifiant du tableau blanc d'un binôme : même calcul que le chatId de Messages.jsx
const getPairBoardId = (session) => {
  const emails = Array.isArray(session.participants) && session.participants.length === 2
    ? session.participants
    : [session.organizer_email, session.buddy_email];
  return [...emails].sort().join("_");
};

const todayISO = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export default function Sessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [buddies, setBuddies] = useState([]);
  const [buddiesLoading, setBuddiesLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // 1. Charger les binômes (requêtes acceptées).
  // 🛠️ CORRIGÉ : l'ancienne requête récupérait TOUTES les demandes acceptées de TOUS les utilisateurs
  // puis filtrait côté navigateur. On interroge maintenant uniquement les demandes qui nous concernent.
  useEffect(() => {
    if (!user?.email) return;

    let fromList = [];
    let toList = [];
    let fromReady = false;
    let toReady = false;

    const update = () => {
      const combined = [...fromList, ...toList].filter(b => b.email && b.email !== user.email);
      const unique = combined.filter((v, i, a) => a.findIndex(item => item.email === v.email) === i);
      setBuddies(unique);
      if (fromReady && toReady) setBuddiesLoading(false);
    };

    const unsubFrom = onSnapshot(
      query(collection(db, "requests"), where("from_email", "==", user.email), where("status", "==", "accepted")),
      (snapshot) => {
        fromList = snapshot.docs.map(d => {
          const data = d.data();
          return { email: data.to_email, name: data.to_name || data.to_email };
        });
        fromReady = true;
        update();
      },
      (error) => { console.error("Erreur de chargement des binômes:", error); fromReady = true; update(); }
    );

    const unsubTo = onSnapshot(
      query(collection(db, "requests"), where("to_email", "==", user.email), where("status", "==", "accepted")),
      (snapshot) => {
        toList = snapshot.docs.map(d => {
          const data = d.data();
          return { email: data.from_email, name: data.from_name || data.from_email };
        });
        toReady = true;
        update();
      },
      (error) => { console.error("Erreur de chargement des binômes:", error); toReady = true; update(); }
    );

    return () => { unsubFrom(); unsubTo(); };
  }, [user]);

  // 2. Charger les sessions avec sécurité
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "sessions"), where("participants", "array-contains", user.email));
    const unsub = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
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
        title: form.title.trim(),
        duration_minutes: Number(form.duration_minutes) || 60,
        location: form.mode === "presentiel" ? form.location.trim() : "",
        organizer_email: user.email,
        // 🛠️ CORRIGÉ : on ne stocke plus un libellé traduit ("Moi") mais le vrai nom.
        organizer_name: user.displayName || user.full_name || user.name || user.email,
        buddy_name: buddy?.name || form.buddy_email,
        participants: [user.email, form.buddy_email],
        status: "planned",
        createdAt: serverTimestamp(),
      });
      setShowCreate(false);
      setForm(EMPTY_FORM);
      toast.success(t('sessions.toast.created'));
    } catch (error) {
      console.error(error);
      toast.error(t('sessions.toast.createError'));
    } finally {
      setIsCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "sessions", id), { status });
      toast.success(t('sessions.toast.statusUpdated'));
    } catch (error) {
      console.error(error);
      toast.error(t('sessions.toast.statusError'));
    }
  };

  // Prochaines sessions : la plus proche en premier. Historique : la plus récente en premier.
  // Une session "planned" dont l'heure de fin est passée n'est plus "à venir" : elle part dans
  // "À clôturer" (avant, elle restait mêlée aux prochaines sessions avec un badge "passée")
  const now = new Date();
  const allPlanned = sessions.filter(s => s.status === "planned");
  const planned = allPlanned.filter(s => !isSessionOver(s, now)).sort((a, b) => startTime(a) - startTime(b));
  const toClose = allPlanned.filter(s => isSessionOver(s, now)).sort((a, b) => startTime(b) - startTime(a));
  const completed = sessions.filter(s => s.status === "completed").sort((a, b) => startTime(b) - startTime(a));

  const canSubmit = form.title.trim() && form.buddy_email && form.date && form.time
    && (form.mode !== "presentiel" || form.location.trim())
    && !isCreating;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      {/* Sur mobile, titre et bouton s'empilent : côte à côte, le titre se cassait sur deux lignes */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sessions.title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('sessions.subtitle')}</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreate(true)} 
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium shadow-sm"
          disabled={buddies.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" /> {t('sessions.newSession')}
        </Button>
      </div>

      {/* --- MESSAGE D'ALERTE (Pas de binômes) --- */}
      {buddies.length === 0 && !buddiesLoading && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl mb-8 transition-colors duration-300">
          <div className="p-6 text-center">
            <Users className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto mb-3" />
            <p className="text-amber-800 dark:text-amber-300 font-medium">{t('sessions.noBuddyAlert.title')}</p>
            <p className="text-amber-600 dark:text-amber-400/80 text-sm mt-1">{t('sessions.noBuddyAlert.desc')}</p>
          </div>
        </div>
      )}

      {/* --- SESSIONS À VENIR --- */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" /> {t('sessions.upcoming')} ({planned.length})
        </h2>
        
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            <Skeleton className="h-48 rounded-2xl dark:bg-[#1e1f20]" />
            <Skeleton className="h-48 rounded-2xl dark:bg-[#1e1f20]" />
          </div>
        ) : planned.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm py-10 text-center bg-white dark:bg-[#1e1f20] rounded-2xl border border-dashed border-gray-200 dark:border-[#333537] transition-colors duration-300">
            {t('sessions.noUpcoming')}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {planned.map(s => (
              <SessionCard 
                key={s.id} 
                session={s} 
                userEmail={user?.email} 
                onUpdateStatus={updateStatus} 
                // Même tableau que le bouton de Messages.jsx : il est identifié par le binôme
                // (emails triés), pas par la session. Avant, ouvrir le tableau depuis une session
                // ou depuis la conversation donnait deux tableaux différents pour les mêmes personnes.
                onJoinWhiteboard={() => navigate(`${createPageUrl("Whiteboard")}?sessionId=${encodeURIComponent(getPairBoardId(s))}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- SESSIONS PASSÉES À CLÔTURER --- */}
      {toClose.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" /> {t('sessions.toClose')} ({toClose.length})
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('sessions.toCloseDesc')}</p>
          <div className="grid md:grid-cols-2 gap-5">
            {toClose.map(s => (
              <SessionCard key={s.id} session={s} userEmail={user?.email} onUpdateStatus={updateStatus} />
            ))}
          </div>
        </div>
      )}

      {/* --- SESSIONS TERMINÉES --- */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> {t('sessions.history')} ({completed.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-5 opacity-75">
            {completed.map(s => <SessionCard key={s.id} session={s} userEmail={user?.email} />)}
          </div>
        </div>
      )}

      {/* --- DIALOG DE CRÉATION --- */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent aria-describedby={undefined} className="rounded-2xl max-w-lg dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('sessions.createDialog.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            
            <div className="space-y-2">
              <Label className="dark:text-gray-300">{t('sessions.createDialog.titleLabel')}</Label>
              <Input 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                placeholder={t('sessions.createDialog.titlePlaceholder')} 
                maxLength={80}
                className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl" 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="dark:text-gray-300">{t('sessions.createDialog.buddyLabel')}</Label>
              <Select value={form.buddy_email} onValueChange={(v) => setForm({ ...form, buddy_email: v })}>
                <SelectTrigger className="rounded-xl bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white">
                  <SelectValue placeholder={t('sessions.createDialog.buddyPlaceholder')} />
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
                <Label className="dark:text-gray-300">{t('sessions.createDialog.dateLabel')}</Label>
                <Input 
                  type="date" 
                  value={form.date} 
                  min={todayISO()}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} 
                  className="bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">{t('sessions.createDialog.timeLabel')}</Label>
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
                <Label className="dark:text-gray-300">{t('sessions.createDialog.durationLabel')}</Label>
                <Input 
                  type="number" 
                  min={5}
                  max={480}
                  value={form.duration_minutes} 
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} 
                  className="bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">{t('sessions.createDialog.modeLabel')}</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                  <SelectTrigger className="rounded-xl bg-white dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
                    <SelectItem value="en_ligne" className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">{t('sessions.createDialog.modeOnline')}</SelectItem>
                    <SelectItem value="presentiel" className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">{t('sessions.createDialog.modeInPerson')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Une session en présentiel sans lieu ne sert à rien */}
            {form.mode === "presentiel" && (
              <div className="space-y-2">
                <Label className="dark:text-gray-300">{t('sessions.createDialog.locationLabel')}</Label>
                <Input 
                  value={form.location} 
                  onChange={(e) => setForm({ ...form, location: e.target.value })} 
                  placeholder={t('sessions.createDialog.locationPlaceholder')} 
                  maxLength={120}
                  className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-white rounded-xl" 
                />
              </div>
            )}

          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowCreate(false)} 
              className="rounded-xl border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c] flex-1 sm:flex-none"
            >
              {t('sessions.createDialog.cancel')}
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl flex-1 sm:flex-none shadow-sm"
              disabled={!canSubmit}
              onClick={handleCreateSession}
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : t('sessions.createDialog.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant Carte de Session
function SessionCard({ session, userEmail, onUpdateStatus, onJoinWhiteboard }) {
  const { t, i18n } = useTranslation();
  const isOrganizer = session.organizer_email === userEmail;

  const rawName = isOrganizer ? session.buddy_name : session.organizer_name;
  const buddyName = !rawName || LEGACY_PLACEHOLDER_NAMES.includes(rawName)
    ? (isOrganizer ? session.buddy_email : session.organizer_email)
    : rawName;

  const start = parseSessionStart(session);
  const end = parseSessionEnd(session);
  // Une session "planned" dont l'heure de fin est dépassée n'est plus "à venir"
  const isPast = session.status === "planned" && end !== null && end < new Date();

  const dateLabel = start
    ? start.toLocaleDateString(i18n.language, { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : session.date;
  const timeLabel = session.time && start
    ? start.toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit" })
    : null;

  let badgeClass = "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400";
  let badgeText = t('sessions.status.upcoming');
  if (session.status === "completed") {
    badgeClass = "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    badgeText = t('sessions.status.completed');
  } else if (isPast) {
    badgeClass = "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400";
    badgeText = t('sessions.status.past');
  }

  return (
    <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        
        {/* En-tête carte */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{session.title}</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">{t('sessions.with', { name: buddyName })}</p>
          </div>
          <Badge className={`border-0 ${badgeClass}`}>{badgeText}</Badge>
        </div>
        
        {/* Détails carte */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{timeLabel ? `${timeLabel} · ` : ""}{session.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            {session.mode === "en_ligne" ? (
              <><Monitor className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> <span className="text-indigo-600 dark:text-indigo-400 font-medium">{t('sessions.mode.online')}</span></>
            ) : (
              <><MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" /> <span>{session.location || t('sessions.mode.inperson')}</span></>
            )}
          </div>
        </div>

        {/* Actions */}
        {session.status === "planned" && (
          <div className="mt-6 flex flex-col gap-3">
            {/* Pas de tableau blanc pour une session déjà passée (section "À clôturer") */}
            {session.mode === "en_ligne" && onJoinWhiteboard && (
              <Button 
                onClick={onJoinWhiteboard}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium py-5 shadow-sm"
              >
                <Presentation className="w-4 h-4 mr-2" /> {t('sessions.joinWhiteboard')}
              </Button>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 rounded-xl text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 bg-transparent"
                onClick={() => onUpdateStatus(session.id, "completed")}
              >
                {t('sessions.markCompleted')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 rounded-xl text-red-500 dark:text-red-400 border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent"
                onClick={() => onUpdateStatus(session.id, "cancelled")}
              >
                {t('sessions.cancel')}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}