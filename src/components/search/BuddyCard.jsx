import React, { useState } from "react";
import { Link } from "react-router-dom";
import { studentUrl } from "@/lib/pairs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Send, Check, AlertTriangle, Loader2, MessageSquare, Inbox, Ban, Sparkles, BadgeCheck, HandHelping } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "react-i18next";
import { blockUser } from "@/hooks/useBlocks";

const REPORT_REASON_VALUES = ["harassment", "spam", "fake", "inappropriate", "other"];

// relation : null (aucune), "sent" (demande envoyée), "received" (demande reçue), "buddy" (binôme)
// match : compatibilité calculée par lib/matching.js (matières en commun, niveau, ville)
export default function BuddyCard({ profile, match, help = [], mode = "buddy", onRequest, onOpenConversation, relation, isOwnProfile }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  const name = profile.display_name || profile.full_name || t('buddyCard.defaultStudent');
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSendReport = async () => {
    if (!reportReason) return toast.error(t('buddyCard.reportDialog.missingReason'));
    setIsReporting(true);
    try {
      await addDoc(collection(db, "reports"), {
        reporter_uid: user.uid,
        reported_uid: profile.id,
        reported_user_name: name,
        reason: reportReason,
        details: reportDetails,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success(t('buddyCard.reportDialog.success'));
      setReportDialogOpen(false);
      setReportReason("");
      setReportDetails("");
    } catch (error) {
      console.error(error);
      toast.error(t('buddyCard.reportDialog.error'));
    } finally {
      setIsReporting(false);
    }
  };

  // Bloquer : la personne disparaît de la recherche et ne peut plus nous écrire
  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      await blockUser(user.uid, profile.id, name);
      toast.success(t('buddyCard.blocked', { name }));
      setReportDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t('buddyCard.blockError'));
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* --- LISERÉ D'ACCENT : rompt l'effet bloc rigide --- */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500" />

      <div className="p-5 flex-1 flex flex-col">

        {/* --- EN-TÊTE --- */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar className="h-12 w-12 rounded-xl shrink-0 border border-gray-100 dark:border-ink-700">
              {/* Photo de profil (Google) : un visage inspire plus confiance que des initiales */}
              {profile.photo_url && !photoFailed && (
                <AvatarImage src={profile.photo_url} alt="" referrerPolicy="no-referrer" onError={() => setPhotoFailed(true)} className="rounded-xl object-cover" />
              )}
              <AvatarFallback className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold font-sans">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-base truncate font-serif flex items-center gap-1.5">
                <Link to={studentUrl(profile.id)} className="truncate hover:text-brand-600 dark:hover:text-brand-300 hover:underline underline-offset-2" title={t('student.viewProfile')}>{name}</Link>
                {profile.verified_domain && (
                  <BadgeCheck className="w-4 h-4 shrink-0 text-sky-500" aria-label={t('buddyCard.verified', { domain: profile.verified_domain })}>
                    <title>{t('buddyCard.verified', { domain: profile.verified_domain })}</title>
                  </BadgeCheck>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-sans font-medium">
                {profile.level && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    {t(`buddyCard.levels.${profile.level}`)}
                  </span>
                )}
                {profile.school && (
                  <span className="truncate max-w-[12rem]" title={profile.school}>{profile.school}</span>
                )}
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {profile.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={() => setReportDialogOpen(true)}
              className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors p-1 shrink-0"
              title={t('buddyCard.report')}
              aria-label={t('buddyCard.report')}
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* --- BIO : bloc distinct, avec repli si vide --- */}
        <div className="mt-3.5 bg-gray-50 dark:bg-ink-950 rounded-xl p-3.5 border border-transparent dark:border-ink-800">
          {profile.bio ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed font-sans">
              {profile.bio}
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-600 italic font-sans">
              {t('buddyCard.noBio')}
            </p>
          )}
        </div>

        {/* --- MATIÈRES --- */}
        {profile.subjects?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.subjects.slice(0, 4).map((s, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-transparent dark:border-indigo-500/20 font-medium text-[11px] px-2.5 py-1 rounded-lg"
              >
                {typeof s === "string" ? s : s.name}
              </Badge>
            ))}
          </div>
        )}

        {/* --- MENTORAT : peut m'aider dans ces matières --- */}
        {!isOwnProfile && help.length > 0 && (
          <div className="mt-3 flex items-start gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
            <HandHelping className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t('buddyCard.canHelp', { subjects: help.slice(0, 3).join(", ") })}</span>
          </div>
        )}

        {/* --- COMPATIBILITÉ --- */}
        {!isOwnProfile && match && (match.sharedSubjects.length > 0 || match.sameSchool || match.sameLevel || match.sameCity) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            {match.sharedSubjects.length > 0 && <span>{t('buddyCard.match.subjects', { count: match.sharedSubjects.length })}</span>}
            {match.sameSchool && <span>{t('buddyCard.match.school')}</span>}
            {match.sameLevel && <span>{t('buddyCard.match.level')}</span>}
            {match.sameCity && <span>{t('buddyCard.match.city')}</span>}
          </div>
        )}
      </div>

      {/* --- ACTION --- */}
      {!isOwnProfile && (
        <div className="px-5 pb-5 pt-1">
          {relation === "buddy" ? (
            // Déjà binôme : on ouvre directement la conversation
            <Button
              size="sm"
              variant="outline"
              className="w-full rounded-xl font-medium text-sm py-5 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 bg-transparent"
              onClick={onOpenConversation}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" /> {t('buddyCard.openChat')}
            </Button>
          ) : relation === "received" ? (
            // Il/elle nous a déjà écrit : on répond à sa demande plutôt que d'en créer une seconde
            <Button
              size="sm"
              className="w-full rounded-xl font-medium text-sm py-5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-sm"
              onClick={onOpenConversation}
            >
              <Inbox className="w-4 h-4 mr-1.5" /> {t('buddyCard.answerRequest')}
            </Button>
          ) : relation === "sent" ? (
            <Button
              size="sm"
              disabled
              className="w-full rounded-xl font-medium text-sm py-5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 disabled:opacity-100"
            >
              <Check className="w-4 h-4 mr-1.5" /> {t('buddyCard.requestSent')}
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full rounded-xl font-medium text-sm py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm"
              onClick={() => onRequest(profile)}
            >
              {mode === "help"
                ? <><HandHelping className="w-4 h-4 mr-1.5" /> {t('buddyCard.askHelp')}</>
                : <><Send className="w-4 h-4 mr-1.5" /> {t('buddyCard.contact')}</>}
            </Button>
          )}
        </div>
      )}

      {/* --- MODALE DE SIGNALEMENT --- */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent aria-describedby={undefined} className="rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 text-gray-900 dark:text-gray-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 font-serif">
              <AlertTriangle className="text-red-500 w-5 h-5" /> {t('buddyCard.reportDialog.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 font-sans">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('buddyCard.reportDialog.reasonLabel')}</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-xs">
                  <SelectValue placeholder={t('buddyCard.reportDialog.reasonPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100 rounded-xl">
                  {REPORT_REASON_VALUES.map(value => (
                    <SelectItem key={value} value={value}>
                      {t(`buddyCard.reportDialog.reasons.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('buddyCard.reportDialog.detailsLabel')}</label>
              <Textarea
                placeholder={t('buddyCard.reportDialog.detailsPlaceholder')}
                className="rounded-xl h-20 bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-xs resize-none p-3"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2 sm:justify-between">
            <Button variant="ghost" size="sm" onClick={handleBlock} disabled={isBlocking} className="rounded-xl text-xs text-gray-600 dark:text-gray-300 sm:mr-auto">
              {isBlocking ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Ban className="w-3.5 h-3.5 mr-1.5" />} {t('buddyCard.block')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setReportDialogOpen(false)} className="rounded-xl text-xs">{t('buddyCard.reportDialog.cancel')}</Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs" onClick={handleSendReport} disabled={isReporting}>
              {isReporting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />} {t('buddyCard.reportDialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}