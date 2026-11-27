import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ShieldAlert, Ban, CheckCircle2, Star, Loader2, UserSearch } from "lucide-react";
import { db } from "../firebase/config";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminStats from "@/components/admin/AdminStats";
import LegacyCleanup from "@/components/admin/LegacyCleanup";
import ProfileModeration from "@/components/admin/ProfileModeration";

// Modération : signalements en attente et avis négatifs après les sessions.
// Accès : comptes listés dans la collection "admins" (document admins/<uid> créé à la main dans
// la console Firebase). Les règles Firestore refusent ces lectures à tous les autres.
export default function Admin() {
  const { user, isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  // Profil ouvert dans la section « Profils » depuis un signalement
  const [focusUid, setFocusUid] = useState(null);
  const openProfile = (uid) => {
    setFocusUid(uid);
    requestAnimationFrame(() => document.getElementById("profile-moderation")?.scrollIntoView({ behavior: "smooth" }));
  };

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    const unsubReports = onSnapshot(
      query(collection(db, "reports"), where("status", "==", "pending"), orderBy("createdAt", "desc")),
      (snap) => { setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      (error) => { console.error(error); setLoading(false); }
    );
    const unsubFeedback = onSnapshot(
      query(collection(db, "feedback"), where("rating", "<=", 2)),
      (snap) => setFeedback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (error) => console.error(error)
    );
    return () => { unsubReports(); unsubFeedback(); };
  }, [isAdmin]);

  const formatDate = (ts) => (typeof ts?.toDate === "function"
    ? ts.toDate().toLocaleString(i18n.language, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "");

  const closeReport = async (report, status) => {
    await updateDoc(doc(db, "reports", report.id), { status, handledAt: serverTimestamp(), handledBy: user.uid });
  };

  // Bannir : profil masqué de la recherche + plus aucune création possible (règles Firestore)
  const ban = async (report) => {
    setBusyId(report.id);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "users", report.reported_uid), { banned: true, profile_visible: false });
      batch.update(doc(db, "reports", report.id), { status: "banned", handledAt: serverTimestamp(), handledBy: user.uid });
      await batch.commit();
      toast.success(t('admin.toast.banned', { name: report.reported_user_name }));
    } catch (error) {
      console.error(error);
      toast.error(t('admin.toast.error'));
    } finally {
      setBusyId(null);
    }
  };

  const dismiss = async (report) => {
    setBusyId(report.id);
    try {
      await closeReport(report, "dismissed");
      toast.success(t('admin.toast.dismissed'));
    } catch (error) {
      console.error(error);
      toast.error(t('admin.toast.error'));
    } finally {
      setBusyId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <ShieldAlert className="w-10 h-10 mx-auto text-gray-400 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.forbidden')}</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.subtitle')}</p>
        </div>
      </div>

      <AdminStats />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('admin.reports')} ({reports.length})</h2>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        ) : reports.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center bg-white dark:bg-ink-900 rounded-2xl border border-dashed border-gray-200 dark:border-ink-700">{t('admin.noReports')}</p>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="p-5 bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 rounded-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{r.reported_user_name || r.reported_uid}</span>
                  <Badge className="border-0 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400">{t(`buddyCard.reportDialog.reasons.${r.reason}`, r.reason)}</Badge>
                  <span className="text-xs text-gray-400 ml-auto">{formatDate(r.createdAt)}</span>
                </div>
                {r.details && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{r.details}</p>}
                <p className="text-xs text-gray-400 mt-2 break-all">uid : {r.reported_uid}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button size="sm" disabled={busyId === r.id} onClick={() => ban(r)} className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
                    <Ban className="w-4 h-4 mr-1.5" /> {t('admin.ban')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openProfile(r.reported_uid)} className="rounded-xl">
                    <UserSearch className="w-4 h-4 mr-1.5" /> {t('admin.profiles.open')}
                  </Button>
                  <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => dismiss(r)} className="rounded-xl">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> {t('admin.dismiss')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProfileModeration focusUid={focusUid} />

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('admin.feedback')} ({feedback.length})</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('admin.feedbackDesc')}</p>
        {feedback.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center bg-white dark:bg-ink-900 rounded-2xl border border-dashed border-gray-200 dark:border-ink-700">{t('admin.noFeedback')}</p>
        ) : (
          <ul className="space-y-3">
            {feedback.map((f) => (
              <li key={f.id} className="p-4 bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 rounded-2xl text-sm">
                <div className="flex items-center gap-1 mb-1" aria-label={t('sessions.feedback.stars', { count: f.rating })}>
                  {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`w-4 h-4 ${n <= f.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />)}
                  <span className="text-xs text-gray-400 ml-auto">{formatDate(f.createdAt)}</span>
                </div>
                {f.comment && <p className="text-gray-700 dark:text-gray-300 break-words">{f.comment}</p>}
                <p className="text-xs text-gray-400 mt-2 break-all">{t('admin.about')} : {f.about_uid}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <LegacyCleanup />
    </div>
  );
}
