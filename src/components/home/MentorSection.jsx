import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, GraduationCap, HandHeart, Sparkles } from "lucide-react";
import SectionHeading, { reveal } from "./SectionHeading";

// Bandeau sombre sur le mentorat : contraste avec le reste de la page.
export default function MentorSection() {
  const { t } = useTranslation();
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6">
      <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-ink-950 dark:bg-ink-900 dark:border dark:border-ink-700 px-6 py-14 sm:p-16">
        <div className="absolute inset-0 bg-grid opacity-40 mask-radial" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 left-10 w-80 h-80 rounded-full bg-purple-600/25 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading dark align="left" eyebrow={t("landing.mentor.eyebrow")} title={t("landing.mentor.title")} subtitle={t("landing.mentor.desc")} />
            <ul className="-mt-4 space-y-3">
              {["p1", "p2", "p3"].map((k, i) => (
                <motion.li key={k} {...reveal(0.1 + i * 0.08)} className="flex items-center gap-3 text-white/90 font-medium">
                  <span className="w-6 h-6 rounded-full bg-lime-300 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3} />
                  </span>
                  {t(`landing.mentor.points.${k}`)}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Illustration : une demande d'aide reçue par un étudiant « Avancé » */}
          <motion.div {...reveal(0.15)} className="relative max-w-md mx-auto w-full" aria-hidden="true">
            <div className="absolute -top-6 -left-4 sm:-left-8 z-10 rotate-[-6deg] inline-flex items-center gap-2 rounded-2xl bg-lime-300 text-gray-900 px-4 py-2 text-sm font-extrabold shadow-lift">
              <GraduationCap className="w-4 h-4" /> {t("landing.mentor.card.badge")}
            </div>
            <div className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl p-6 shadow-lift">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-brand-500 flex items-center justify-center text-white font-bold">T</div>
                <div>
                  <p className="text-white font-display font-bold">{t("landing.mentor.card.title")}</p>
                  <p className="text-white/60 text-sm">{t("landing.mentor.card.from")}</p>
                </div>
                <HandHeart className="ml-auto w-6 h-6 text-coral-400" />
              </div>
              <p className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 text-white/85 leading-relaxed">« {t("landing.mentor.card.msg")} »</p>
              <div className="mt-5 flex gap-2">
                <span className="flex-1 h-11 rounded-xl bg-white text-gray-900 font-bold text-sm flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" /> {t("landing.mentor.card.accept")}
                </span>
                <span className="w-11 h-11 rounded-xl border border-white/15 flex items-center justify-center text-white/60 text-lg">×</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
