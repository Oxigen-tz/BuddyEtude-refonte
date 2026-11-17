import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Globe } from "lucide-react";

// En-tête des pages vues sans être connecté (À propos, Mentions légales, Connexion requise…),
// à la place de la barre latérale réservée aux comptes.
export default function PublicHeader() {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language?.startsWith("fr");

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#333537]" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">BuddyEtude</span>
        </Link>
        <button
          onClick={() => i18n.changeLanguage(isFr ? "en" : "fr")}
          aria-label={t("home.nav.switchLanguage")}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors"
        >
          <Globe className="w-4 h-4" />
          {isFr ? "EN" : "FR"}
        </button>
      </div>
    </header>
  );
}
