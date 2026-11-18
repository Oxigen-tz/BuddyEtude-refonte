import React, { useCallback, useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { useTranslation } from "react-i18next";
import { Loader2, RefreshCw } from "lucide-react";
import { functions } from "../../firebase/config";
import { Button } from "@/components/ui/button";

// Statistiques d'usage (fonction adminStats, réservée à la modération)
export default function AdminStats() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await httpsCallable(functions, "adminStats")();
      setStats(data);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const nf = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 });
  const tiles = stats ? [
    { key: "accounts", value: stats.accounts },
    { key: "students", value: stats.students },
    { key: "buddies", value: stats.buddies },
    { key: "messages7d", value: stats.messages7d },
    { key: "upcomingSessions", value: stats.upcomingSessions },
    { key: "completedSessions", value: stats.completedSessions },
    { key: "rating", value: stats.ratingAverage == null ? "–" : `${nf.format(stats.ratingAverage)} / 5`, hint: t("admin.stats.ratingCount", { count: stats.ratingCount }) },
    { key: "pendingRequests", value: stats.pendingRequests },
    { key: "pendingReports", value: stats.pendingReports },
  ] : [];

  return (
    <section className="mb-12" aria-labelledby="admin-stats-title">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 id="admin-stats-title" className="text-lg font-bold text-gray-900 dark:text-white">{t("admin.stats.title")}</h2>
        <Button size="sm" variant="ghost" onClick={load} disabled={loading} className="rounded-xl text-gray-500" aria-label={t("admin.stats.refresh")}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{t("admin.stats.error")}</p>
      ) : !stats ? (
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {tiles.map((tile) => (
              <div key={tile.key} className="p-4 bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-2xl">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t(`admin.stats.${tile.key}`)}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">
                  {typeof tile.value === "number" ? nf.format(tile.value) : tile.value}
                </div>
                {tile.hint && <div className="text-xs text-gray-400 mt-0.5">{tile.hint}</div>}
              </div>
            ))}
          </div>
          <SignupsChart weeks={stats.weeks} />
        </>
      )}
    </section>
  );
}

// Inscriptions par semaine : une seule série, barres fines, survol pour la valeur exacte
function SignupsChart({ weeks }) {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState(null);
  const max = Math.max(1, ...weeks.map((w) => w.count));
  const label = (w) => new Date(w.start).toLocaleDateString(i18n.language, { day: "numeric", month: "short" });
  const shown = active ?? weeks.length - 1;

  return (
    <figure className="p-5 bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-2xl">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{t("admin.stats.signupsTitle")}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums" aria-live="polite">
          {t("admin.stats.weekOf", { date: label(weeks[shown]) })} : <strong className="text-gray-900 dark:text-white">{weeks[shown].count}</strong>
        </span>
      </figcaption>

      <div className="relative h-40 border-b border-gray-200 dark:border-[#333537]" aria-hidden="true">
        <div className="absolute inset-0 flex items-end gap-[2px]">
          {weeks.map((w, i) => (
            <div
              key={w.start}
              className="flex-1 h-full flex items-end justify-center cursor-default"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div
                className={`w-full max-w-[28px] rounded-t-[4px] transition-opacity bg-indigo-500 dark:bg-indigo-400 ${active !== null && active !== i ? "opacity-40" : ""}`}
                style={{ height: `${(w.count / max) * 100}%`, minHeight: w.count ? 2 : 0 }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-[2px] mt-2" aria-hidden="true">
        {weeks.map((w, i) => (
          <span key={w.start} className={`flex-1 text-center text-[10px] text-gray-400 truncate ${i % 2 ? "hidden sm:block" : ""}`}>{label(w)}</span>
        ))}
      </div>

      {/* Version tableau pour les lecteurs d'écran */}
      <table className="sr-only">
        <caption>{t("admin.stats.signupsTitle")}</caption>
        <thead><tr><th>{t("admin.stats.week")}</th><th>{t("admin.stats.signups")}</th></tr></thead>
        <tbody>{weeks.map((w) => <tr key={w.start}><td>{label(w)}</td><td>{w.count}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
