import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";

// Téléphone uniquement : une fois le premier écran passé, le bouton d'inscription reste à portée
// de pouce en bas de l'écran, avec un lien pour ceux qui ont déjà un compte.
export default function MobileStickyCta() {
  const { user, openLogin } = useAuth();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      // Masquée en bas de page, où le dernier appel à l'action prend le relais
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 320;
      setVisible(pastHero && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (user) return null;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-50 px-3 pt-3 bg-ink-950/85 backdrop-blur-xl border-t border-white/10 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.75rem)" }}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={openLogin}
        tabIndex={visible ? 0 : -1}
        className="w-full h-12 rounded-2xl bg-lime-300 text-ink-950 font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        {t("home.nav.stickyCta")}
        <span className="text-xs font-semibold rounded-full bg-ink-950/10 px-2 py-0.5">{t("home.nav.stickyFree")}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={openLogin}
        tabIndex={visible ? 0 : -1}
        className="w-full h-10 mt-1 text-sm font-semibold text-white/70 hover:text-white"
      >
        {t("home.nav.hasAccount")}
      </button>
    </div>
  );
}
