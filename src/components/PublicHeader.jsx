import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import Logo from "@/components/Logo";

// En-tête des pages vues sans être connecté (À propos, Mentions légales, Connexion requise…),
// à la place de la barre latérale réservée aux comptes.
export default function PublicHeader() {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language?.startsWith("fr");

  return (
    <header className="sticky top-0 z-40 bg-white/75 dark:bg-ink-950/75 backdrop-blur-xl border-b border-gray-200/70 dark:border-ink-700" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo markClassName="w-8 h-8" />
        </Link>
        <button
          onClick={() => i18n.changeLanguage(isFr ? "en" : "fr")}
          aria-label={t("home.nav.switchLanguage")}
          className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-ink-800 transition-colors"
        >
          <Globe className="w-4 h-4" />
          {isFr ? "EN" : "FR"}
        </button>
      </div>
    </header>
  );
}
