import React, { useState, useEffect, useMemo } from "react";
import Reveal from "@/components/ui/reveal";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Plus, Clock, MapPin, Monitor, Users, Check, AlertCircle,
  Loader2, Presentation, Video, CalendarPlus, Star, Link2, ExternalLink
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "react-i18next";
import { useRequests, buildRelations } from "@/hooks/useRequests";
import { pairId, callUrl, studentUrl } from "@/lib/pairs";
import {
  parseSessionStart, parseSessionEnd, sessionStartTime as startTime, isSessionOver,
  isSafeMeetingUrl, downloadIcs,
} from "@/lib/sessions";

const EMPTY_FORM = {
  title: "", buddy_uid: "", date: "", time: "",
  duration_minutes: 60, mode: "en_ligne", location: "", meeting_url: "",
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

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  // Session qu'on vient de marquer "terminée" : on propose de donner un avis
  const [feedbackFor, setFeedbackFor] = useState(null);

  // Binômes = demandes acceptées (dans un sens ou dans l'autre)
  const requests = useRequests(user?.uid);
  const buddies = useMemo(() => [...buildRelations(requests).entries()]
    .filter(([, r]) => r.status === "buddy")
    .map(([uid, r]) => ({ uid, name: r.name })), [requests]);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const q = query(collection(db, "sessions"), where("participants", "array-contains", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Erreur de chargement des sessions:", error);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // Date + heure saisies → instant absolu (sert aux rappels envoyés par les Cloud Functions)
  const startDate = () => {
    const [y, m, d] = form.date.split("-").map(Number);
    const [hh, mm] = form.time.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm);
  };

  const handleCreateSession = async () => {
    const start = startDate();
    if (start < new Date()) { toast.error(t('sessions.toast.inPast')); return; }
    if (form.meeting_url.trim() && !isSafeMeetingUrl(form.meeting_url.trim())) {
      toast.error(t('sessions.toast.badLink'));
      return;
    }
    setIsCreating(true);
    try {
      const buddy = buddies.find(b => b.uid === form.buddy_uid);
      await addDoc(collection(db, "sessions"), {
        title: form.title.trim(),
        date: form.date,
        time: form.time,
        start_at: Timestamp.fromDate(start),
        duration_minutes: Number(form.duration_minutes) || 60,
        mode: form.mode,
        location: form.mode === "presentiel" ? form.location.trim() : "",
        meeting_url: form.mode === "en_ligne" ? form.meeting_url.trim() : "",
        organizer_uid: user.uid,
        organizer_name: user.displayName || user.full_name || t('settings.account.defaultStudent'),
        buddy_uid: form.buddy_uid,
        buddy_name: buddy?.name || "",
        participants: [user.uid, form.buddy_uid],
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

  const updateStatus = async (session, status) => {
    try {
      await updateDoc(doc(db, "sessions", session.id), { status });
      toast.success(t('sessions.toast.statusUpdated'));
      if (status === "completed") setFeedbackFor(session);
    } catch (error) {
      console.error(error);
      toast.error(t('sessions.toast.statusError'));
    }
  };

  // Prochaines sessions : la plus proche en premier. Historique : la plus récente en premier.
  // Une session "planned" dont l'heure de fin est passée part dans "À clôturer".
  const now = new Date();
  const allPlanned = sessions.filter(s => s.status === "planned");
  const planned = allPlanned.filter(s => !isSessionOver(s, now)).sort((a, b) => startTime(a) - startTime(b));
  const toClose = allPlanned.filter(s => isSessionOver(s, now)).sort((a, b) => startTime(b) - startTime(a));
  const completed = sessions.filter(s => s.status === "completed").sort((a, b) => startTime(b) - startTime(a));

  const canSubmit = form.title.trim() && form.buddy_uid && form.date && form.time
    && (form.mode !== "presentiel" || form.location.trim())
    && !isCreating;

  const openBoard = (s) => navigate(`${createPageUrl("Whiteboard")}?sessionId=${encodeURIComponent(pairId(s.participants[0], s.participants[1]))}`);

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">

      {/* --- EN-TÊTE --- */}
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
      {buddies.length === 0 && !requests.loading && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl mb-8">
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
            <Skeleton className="h-48 rounded-2xl dark:bg-ink-900" />
            <Skeleton className="h-48 rounded-2xl dark:bg-ink-900" />
          </div>
        ) : planned.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm py-10 text-center bg-white dark:bg-ink-900 rounded-2xl border border-dashed border-gray-200 dark:border-ink-700">
            {t('sessions.noUpcoming')}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {planned.map((s, i) => (
              <Reveal key={s.id} index={i}>
                <SessionCard session={s} myUid={user?.uid} onUpdateStatus={updateStatus} onJoinWhiteboard={() => openBoard(s)} />
              </Reveal>
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
            {toClose.map(s => <SessionCard key={s.id} session={s} myUid={user?.uid} onUpdateStatus={updateStatus} />)}
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
            {completed.map(s => <SessionCard key={s.id} session={s} myUid={user?.uid} onFeedback={() => setFeedbackFor(s)} />)}
          </div>
        </div>
      )}

      {/* --- DIALOG DE CRÉATION --- */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent aria-describedby={undefined} className="rounded-2xl max-w-lg max-h-[90dvh] overflow-y-auto dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('sessions.createDialog.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session-title" className="dark:text-gray-300">{t('sessions.createDialog.titleLabel')}</Label>
              <Input id="session-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t('sessions.createDialog.titlePlaceholder')} maxLength={80}
                className="bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300">{t('sessions.createDialog.buddyLabel')}</Label>
              <Select value={form.buddy_uid} onValueChange={(v) => setForm({ ...form, buddy_uid: v })}>
                <SelectTrigger className="rounded-xl bg-white dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder={t('sessions.createDialog.buddyPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100">
                  {buddies.map(b => (
                    <SelectItem key={b.uid} value={b.uid} className="focus:bg-gray-100 dark:focus:bg-ink-800 cursor-pointer">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-date" className="dark:text-gray-300">{t('sessions.createDialog.dateLabel')}</Label>
                <Input id="session-date" type="date" value={form.date} min={todayISO()} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="bg-white dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-time" className="dark:text-gray-300">{t('sessions.createDialog.timeLabel')}</Label>
                <Input id="session-time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="bg-white dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-duration" className="dark:text-gray-300">{t('sessions.createDialog.durationLabel')}</Label>
                <Input id="session-duration" type="number" min={5} max={480} value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  className="bg-white dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">{t('sessions.createDialog.modeLabel')}</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                  <SelectTrigger className="rounded-xl bg-white dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100">
                    <SelectItem value="en_ligne" className="focus:bg-gray-100 dark:focus:bg-ink-800 cursor-pointer">{t('sessions.createDialog.modeOnline')}</SelectItem>
                    <SelectItem value="presentiel" className="focus:bg-gray-100 dark:focus:bg-ink-800 cursor-pointer">{t('sessions.createDialog.modeInPerson')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.mode === "presentiel" ? (
              <div className="space-y-2">
                <Label htmlFor="session-location" className="dark:text-gray-300">{t('sessions.createDialog.locationLabel')}</Label>
                <Input id="session-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder={t('sessions.createDialog.locationPlaceholder')} maxLength={120}
                  className="bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white rounded-xl" />
              </div>
            ) : (
              // Appel vidéo intégré (page Call) inclus d'office ; un lien externe reste possible
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3.5">
                  <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-900 dark:text-emerald-200">{t('sessions.createDialog.callIncluded')}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-link" className="dark:text-gray-300">{t('sessions.createDialog.meetingLabel')}</Label>
                  <Input id="session-link" type="url" value={form.meeting_url} onChange={(e) => setForm({ ...form, meeting_url: e.target.value })}
                    placeholder="https://zoom.us/j/…" maxLength={300}
                    className="bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-white rounded-xl" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('sessions.createDialog.meetingHint')}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-2 flex gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}
              className="rounded-xl border-gray-200 dark:border-ink-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-800 flex-1 sm:flex-none">
              {t('sessions.createDialog.cancel')}
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl flex-1 sm:flex-none shadow-sm"
              disabled={!canSubmit} onClick={handleCreateSession}>
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : t('sessions.createDialog.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FeedbackDialog session={feedbackFor} myUid={user?.uid} onClose={() => setFeedbackFor(null)} />
    </div>
  );
}

// --- Avis après une session (visible uniquement par la modération) ---
function FeedbackDialog({ session, myUid, onClose }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { setRating(0); setComment(""); }, [session?.id]);

  const submit = async () => {
    if (!session || !rating) return;
    setSaving(true);
    try {
      const otherUid = session.participants.find((p) => p !== myUid);
      await setDoc(doc(db, "feedback", `${session.id}_${myUid}`), {
        sessionId: session.id,
        from_uid: myUid,
        about_uid: otherUid,
        rating,
        comment: comment.trim().slice(0, 500),
        createdAt: serverTimestamp(),
      });
      toast.success(t('sessions.feedback.thanks'));
      onClose();
    } catch (error) {
      // Avis déjà donné pour cette session : les règles refusent un second avis
      console.error(error);
      toast.error(t('sessions.feedback.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!session} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="rounded-2xl max-w-md dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('sessions.feedback.title')}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">{t('sessions.feedback.desc')}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-2 py-2" role="radiogroup" aria-label={t('sessions.feedback.ratingLabel')}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={t('sessions.feedback.stars', { count: n })}
              onClick={() => setRating(n)} className="p-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10">
              <Star className={`w-8 h-8 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
            </button>
          ))}
        </div>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} placeholder={t('sessions.feedback.placeholder')}
          className="h-24 resize-none rounded-xl bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700" />
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">{t('sessions.feedback.skip')}</Button>
          <Button onClick={submit} disabled={!rating || saving} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {t('sessions.feedback.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Carte de session ---
function SessionCard({ session, myUid, onUpdateStatus, onJoinWhiteboard, onFeedback }) {
  const { t, i18n } = useTranslation();
  const isOrganizer = session.organizer_uid === myUid;
  const buddyName = (isOrganizer ? session.buddy_name : session.organizer_name) || "?";
  const otherUid = (session.participants || []).find((p) => p !== myUid);

  const start = parseSessionStart(session);
  const end = parseSessionEnd(session);
  const isPast = session.status === "planned" && end !== null && end < new Date();

  const dateLabel = start
    ? start.toLocaleDateString(i18n.language, { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : session.date;
  const timeLabel = start ? start.toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit" }) : null;

  let badgeClass = "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400";
  let badgeText = t('sessions.status.upcoming');
  if (session.status === "completed") {
    badgeClass = "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    badgeText = t('sessions.status.completed');
  } else if (isPast) {
    badgeClass = "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400";
    badgeText = t('sessions.status.past');
  }

  // Lien externe éventuel (Zoom, Teams…). Les anciens liens meet.jit.si sont remplacés par l'appel intégré.
  const meetingUrl = session.meeting_url && isSafeMeetingUrl(session.meeting_url) && !/^https:\/\/meet\.jit\.si\//.test(session.meeting_url) ? session.meeting_url : null;
  const builtInCall = session.mode === "en_ligne" ? callUrl("session", session.id) : null;
  const copyLink = async (url) => {
    try { await navigator.clipboard.writeText(url); toast.success(t('call.copied')); }
    catch { window.prompt(t('call.copyPrompt'), url); }
  };

  return (
    <div className="bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight break-words">{session.title}</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              {otherUid ? <Link to={studentUrl(otherUid)} className="hover:underline underline-offset-2">{t('sessions.with', { name: buddyName })}</Link> : t('sessions.with', { name: buddyName })}
            </p>
          </div>
          <Badge className={`border-0 shrink-0 ${badgeClass}`}>{badgeText}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <span>{timeLabel ? `${timeLabel} · ` : ""}{session.duration_minutes} min</span>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            {session.mode === "en_ligne" ? (
              <><Monitor className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" /> <span className="text-indigo-600 dark:text-indigo-400 font-medium">{t('sessions.mode.online')}</span></>
            ) : (
              <><MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" /> <span>{session.location || t('sessions.mode.inperson')}</span></>
            )}
          </div>
        </div>

        {session.status === "planned" && (
          <div className="mt-6 flex flex-col gap-3">
            {!isPast && builtInCall && (
              <div className="flex gap-2">
                <Link to={builtInCall}
                  className="flex-1 inline-flex items-center justify-center rounded-xl font-medium py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-sm">
                  <Video className="w-4 h-4 mr-2" /> {t('sessions.joinCall')}
                </Link>
                <Button type="button" variant="outline" onClick={() => copyLink(window.location.origin + builtInCall)}
                  aria-label={t('call.copyLink')} title={t('call.copyLink')} className="shrink-0 rounded-xl px-3">
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            {!isPast && meetingUrl && (
              <div className="flex gap-2">
                <a href={meetingUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-xl font-medium py-2 border border-gray-200 dark:border-ink-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-ink-800 text-sm">
                  <ExternalLink className="w-4 h-4 mr-2" /> {t('sessions.externalLink')}
                </a>
                <Button type="button" variant="outline" onClick={() => copyLink(meetingUrl)}
                  aria-label={t('call.copyLink')} title={t('call.copyLink')} className="shrink-0 rounded-xl px-3">
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            {session.mode === "en_ligne" && onJoinWhiteboard && (
              <Button onClick={onJoinWhiteboard}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium py-5 shadow-sm">
                <Presentation className="w-4 h-4 mr-2" /> {t('sessions.joinWhiteboard')}
              </Button>
            )}
            {!isPast && (
              <Button variant="ghost" size="sm" onClick={() => downloadIcs(session, { withName: t('sessions.with', { name: buddyName }), onlineLabel: t('sessions.mode.online') })}
                className="w-full rounded-xl text-gray-600 dark:text-gray-300">
                <CalendarPlus className="w-4 h-4 mr-2" /> {t('sessions.addToCalendar')}
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm"
                className="flex-1 rounded-xl text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 bg-transparent"
                onClick={() => onUpdateStatus(session, "completed")}>
                {t('sessions.markCompleted')}
              </Button>
              <Button variant="outline" size="sm"
                className="flex-1 rounded-xl text-red-500 dark:text-red-400 border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent"
                onClick={() => onUpdateStatus(session, "cancelled")}>
                {t('sessions.cancel')}
              </Button>
            </div>
          </div>
        )}

        {session.status === "completed" && onFeedback && (
          <Button variant="ghost" size="sm" onClick={onFeedback} className="mt-4 w-full rounded-xl text-gray-600 dark:text-gray-300">
            <Star className="w-4 h-4 mr-2" /> {t('sessions.feedback.give')}
          </Button>
        )}
      </div>
    </div>
  );
}
