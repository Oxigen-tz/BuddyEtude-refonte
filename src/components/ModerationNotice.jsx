import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { ShieldAlert, X } from "lucide-react";
import { db } from "@/firebase/config";
import { useAuth } from "@/lib/AuthContext";

// Bandeau qui explique à l'étudiant une mesure de modération sur son profil (moderation/<uid>) :
// photo ou présentation retirée, profil masqué, compte restreint. La restriction reste affichée
// tant qu'elle dure ; les autres messages peuvent être fermés (mémorisé sur cet appareil).
const CONTACT = "contact@buddyetude.com";

export function useModeration() {
  const { user } = useAuth();
  const [mod, setMod] = useState(null);
  useEffect(() => {
    if (!user?.uid) return undefined;
    return onSnapshot(doc(db, "moderation", user.uid),
      (snap) => setMod(snap.exists() ? snap.data() : {}),
      () => setMod({}));
  }, [user?.uid]);
  return mod;
}

export default function ModerationNotice() {
  const { t } = useTranslation();
  const mod = useModeration();
  const notice = mod?.notice;
  const key = notice ? `moderation_notice_${notice.at}` : null;
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    try { setClosed(key ? localStorage.getItem(key) === "1" : false); } catch { setClosed(false); }
  }, [key]);

  const restricted = mod?.restricted === true;
  const hidden = mod?.hidden === true;
  const lasting = restricted || hidden; // mesure durable : le bandeau reste affiché
  if (!mod || (!lasting && (!notice || closed))) return null;

  const hideReason = notice?.action === "hide" ? notice.reason : null;
  const action = restricted ? "restrict" : hidden ? (hideReason === "name" ? "hideName" : "hide") : notice.action;
  const reason = notice?.reason ? t(`moderationNotice.reasons.${notice.reason}`, notice.reason) : "";
  const close = () => { try { localStorage.setItem(key, "1"); } catch { /* stockage indisponible */ } setClosed(true); };

  return (
    <div role="status" className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4 flex gap-3">
      <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-300 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
        <p className="font-semibold">{t(`moderationNotice.${action}`, { reason })}</p>
        <p className="mt-1 text-amber-800/80 dark:text-amber-100/70">{t("moderationNotice.contact", { email: CONTACT })}</p>
      </div>
      {!lasting && (
        <button type="button" onClick={close} aria-label={t("moderationNotice.close")} className="shrink-0 text-amber-700 dark:text-amber-200 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
