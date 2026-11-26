import React from "react";
import { motion } from "framer-motion";
import { Users, Lightbulb, UsersRound, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";
import { INTENT_TARGETS, saveIntent } from "@/lib/intent";
import { reveal } from "./SectionHeading";

// « Tu cherches quoi ? » : trois entrées tactiles juste après le premier écran.
// Connecté : on va directement au bon endroit. Sinon : l'intention est gardée, l'inscription s'ouvre,
// et Layout.jsx amène au bon endroit une fois le profil créé.
const ITEMS = [
  { id: "duo", icon: Users, tone: "bg-brand-500/15 text-brand-200 border-brand-400/30" },
  { id: "help", icon: Lightbulb, tone: "bg-lime-300/10 text-lime-200 border-lime-300/30" },
  { id: "group", icon: UsersRound, tone: "bg-coral-500/15 text-coral-300 border-coral-400/30" },
];

export default function IntentSection() {
  const { t } = useTranslation();
  const { user, openLogin } = useAuth();
  const navigate = useNavigate();

  const choose = (id) => {
    if (user) return navigate(INTENT_TARGETS[id]);
    saveIntent(id);
    openLogin();
  };

  return (
    <section className="px-4 sm:px-6 pt-16 pb-8 sm:pt-24 sm:pb-12">
      <div className="max-w-3xl mx-auto">
        <motion.h2 {...reveal()} className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-white text-center mb-8 sm:mb-10">
          {t("landing.intent.title")}
        </motion.h2>
        <motion.ul {...reveal(0.08)} className="space-y-3">
          {ITEMS.map(({ id, icon: Icon, tone }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => choose(id)}
                className="group w-full min-h-[72px] flex items-center gap-4 text-left rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] px-4 sm:px-5 py-4 transition-all"
              >
                <span className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${tone}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-lg font-bold text-white">{t(`landing.intent.items.${id}.title`)}</span>
                  <span className="block text-sm text-white/60 leading-snug">{t(`landing.intent.items.${id}.desc`)}</span>
                </span>
                <ArrowRight className="shrink-0 w-5 h-5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </button>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
