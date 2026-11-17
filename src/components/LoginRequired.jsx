import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

// Affiché à la place d'une page privée (Dashboard, Messages…) quand personne n'est connecté.
// Après la connexion, AuthContext met `user` à jour et la page demandée s'affiche d'elle-même.
export default function LoginRequired() {
  const { t } = useTranslation();
  const { loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      // Fenêtre Google fermée ou refusée : on laisse simplement l'écran en place
      console.error("Connexion annulée :", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center py-16 px-6 bg-white dark:bg-[#1e1f20] rounded-3xl border border-gray-100 dark:border-[#333537] shadow-sm my-12 animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
        <Lock className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("auth.requiredTitle")}</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
        {t("auth.requiredDesc")}
      </p>
      <Button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-6 rounded-xl font-medium shadow-sm"
      >
        {isLoggingIn && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
        {t("auth.login")}
      </Button>
      <Link to="/" className="inline-block mt-5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        {t("auth.backHome")}
      </Link>
    </div>
  );
}
