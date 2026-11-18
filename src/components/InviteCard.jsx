import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { UserPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const INVITE_URL = "https://buddyetude.com/?utm_source=invitation";

// Partage du lien d'inscription : feuille de partage du téléphone (WhatsApp, Messenger…)
// quand elle existe, sinon copie du message dans le presse-papiers.
export async function shareInvite(t) {
  const text = t("invite.message");
  try {
    if (navigator.share) {
      await navigator.share({ title: "BuddyEtude", text, url: INVITE_URL });
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return; // partage annulé
  }
  try {
    await navigator.clipboard.writeText(`${text} ${INVITE_URL}`);
    toast.success(t("invite.copied"));
  } catch {
    toast.error(t("invite.copyError"));
  }
}

export default function InviteCard({ compact = false }) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/5 ${compact ? "p-4" : "p-6"}`}>
      <div className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-ink-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
        <UserPlus className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white">{t("invite.title")}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{t("invite.desc")}</p>
      </div>
      <Button onClick={() => shareInvite(t)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
        <Share2 className="w-4 h-4 mr-2" /> {t("invite.button")}
      </Button>
    </div>
  );
}
