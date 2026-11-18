import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Eraser, Loader2 } from "lucide-react";
import { functions } from "../../firebase/config";
import { Button } from "@/components/ui/button";

const KEYS = ["messages", "files", "requests", "sessions", "whiteboards", "profiles"];

// Nettoyage des données de l'ancien format (e-mail au lieu de uid) : d'abord une simulation
// qui compte, puis la suppression réelle après confirmation.
export default function LegacyCleanup() {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (dryRun) => {
    setBusy(true);
    try {
      const { data } = await httpsCallable(functions, "adminCleanupLegacy", { timeout: 540000 })({ dryRun });
      if (dryRun) {
        setPreview(data);
      } else {
        setPreview(null);
        toast.success(t("admin.cleanup.done"));
      }
    } catch (e) {
      console.error(e);
      toast.error(t("admin.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  const total = preview ? KEYS.reduce((n, k) => n + (k === "files" ? 0 : preview[k]), 0) : 0;

  return (
    <section className="mt-12 p-5 bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-2xl">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t("admin.cleanup.title")}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("admin.cleanup.desc")}</p>

      {preview && (
        total === 0 ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-4">{t("admin.cleanup.nothing")}</p>
        ) : (
          <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
            {KEYS.map((k) => <li key={k}>{t(`admin.cleanup.items.${k}`, { count: preview[k] })}</li>)}
          </ul>
        )
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={busy} onClick={() => run(true)} className="rounded-xl">
          {busy ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Eraser className="w-4 h-4 mr-1.5" />} {t("admin.cleanup.preview")}
        </Button>
        {preview && total > 0 && (
          <Button size="sm" disabled={busy} onClick={() => run(false)} className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
            {t("admin.cleanup.confirm")}
          </Button>
        )}
      </div>
    </section>
  );
}
