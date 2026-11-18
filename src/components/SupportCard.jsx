import React from "react";
import { Heart, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

// Lien « Soutenir le projet » (page Ko-fi, Buy Me a Coffee, Stripe…), renseigné dans la
// variable d'environnement VITE_SUPPORT_URL (Vercel → Environment Variables).
// Tant qu'elle est vide, rien n'est affiché. Le paiement se fait entièrement sur le site
// du prestataire : BuddyEtude ne voit ni ne stocke aucune donnée de paiement.
export const SUPPORT_URL = (import.meta.env.VITE_SUPPORT_URL || "").trim();

// Version carte (Paramètres, À propos)
export default function SupportCard({ className = "" }) {
  const { t } = useTranslation();
  if (!SUPPORT_URL) return null;
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-coral-200 dark:border-coral-500/25 bg-gradient-to-br from-coral-50 via-white to-brand-50 dark:from-coral-500/10 dark:via-ink-900 dark:to-brand-500/10 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-9 h-9 rounded-xl bg-coral-500 text-white flex items-center justify-center shadow-soft">
          <Heart className="w-4 h-4 fill-current" />
        </span>
        <div className="min-w-0">
          <p className="font-display font-bold text-gray-900 dark:text-white">{t("support.title")}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">{t("support.desc")}</p>
        </div>
      </div>
      <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer"
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:opacity-90 transition-opacity">
        {t("support.button")} <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
}

// Version lien (pied de page)
export function SupportLink({ className = "" }) {
  const { t } = useTranslation();
  if (!SUPPORT_URL) return null;
  return (
    <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${className}`}>
      <Heart className="w-4 h-4 shrink-0 text-coral-500" /> {t("support.button")}
    </a>
  );
}
