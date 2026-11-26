import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "react-i18next";
import Logo from "@/components/Logo";
import { chooseLanguage } from "@/i18n";

// Barre flottante en « pilule » : transparente en haut de page, vitrée dès qu'on défile.
export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, openLogin } = useAuth();
  const { t, i18n } = useTranslation();
  const isFr = i18n.language.startsWith("fr");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4" style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 0.75rem)" }}>
      <nav
        className={`max-w-6xl mx-auto flex items-center justify-between gap-3 rounded-2xl pl-3 pr-2 sm:pl-4 py-2 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-ink-900/80 backdrop-blur-xl border border-gray-200/70 dark:border-ink-700 shadow-soft"
            : "bg-transparent border border-transparent"
        }`}
      >
        <Link to="/" aria-label="BuddyEtude" className="shrink-0">
          <Logo markClassName="w-8 h-8 sm:w-9 sm:h-9" textClassName="text-lg sm:text-xl text-gray-900 dark:text-white" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => chooseLanguage(isFr ? "en" : "fr")}
            aria-label={t("home.nav.switchLanguage")}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 h-10 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-ink-800 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {isFr ? "FR" : "EN"}
          </button>

          {user ? (
            <Button asChild className="rounded-xl px-4 sm:px-5 group">
              <Link to={createPageUrl("Dashboard")}>
                {t("home.nav.dashboard")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={openLogin}
                className="rounded-xl px-3 sm:px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-ink-800"
              >
                {t("home.nav.login")}
              </Button>
              <Button onClick={openLogin} className="hidden sm:inline-flex rounded-xl px-4 sm:px-5 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-none">
                {t("home.nav.signup")}
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
