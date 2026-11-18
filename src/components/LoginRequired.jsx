import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

// Affiché à la place d'une page privée (Dashboard, Messages…) quand personne n'est connecté.
// Après la connexion, AuthContext met `user` à jour et la page demandée s'affiche d'elle-même.
export default function LoginRequired() {
  const { t } = useTranslation();
  const { openLogin } = useAuth();

  return (
    <div className="relative max-w-md mx-auto my-12 sm:my-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="absolute -inset-10 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="relative text-center py-12 px-6 sm:px-10 bg-white dark:bg-ink-900 rounded-[2rem] border border-gray-200/80 dark:border-ink-700 shadow-lift">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-glow">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("auth.requiredTitle")}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">{t("auth.requiredDesc")}</p>
        <Button onClick={openLogin} className="w-full h-12 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-glow">
          {t("auth.login")}
        </Button>
        <Link to="/" className="inline-block mt-5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
          {t("auth.backHome")}
        </Link>
      </div>
    </div>
  );
}
