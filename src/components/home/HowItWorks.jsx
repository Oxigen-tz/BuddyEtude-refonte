import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UserRoundPen, Sparkles, PenLine } from "lucide-react";
import SectionHeading, { reveal } from "./SectionHeading";

const STEPS = [
  { id: "profile", icon: UserRoundPen, tone: "bg-brand-600 text-white" },
  { id: "match", icon: Sparkles, tone: "bg-coral-500 text-white" },
  { id: "study", icon: PenLine, tone: "bg-lime-300 text-gray-900" },
];

export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section id="how" className="relative py-20 sm:py-28 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow={t("landing.how.eyebrow")} title={t("landing.how.title")} subtitle={t("landing.how.subtitle")} />

        <div className="relative grid md:grid-cols-3 gap-5">
          {/* Fil qui relie les étapes (ordinateur) */}
          <svg className="hidden md:block absolute top-[52px] left-[16%] w-[68%] h-4 text-gray-300 dark:text-ink-600" preserveAspectRatio="none" viewBox="0 0 100 4" aria-hidden="true">
            <line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          </svg>
          {STEPS.map(({ id, icon: Icon, tone }, i) => (
            <motion.div key={id} {...reveal(i * 0.1)} className="relative rounded-3xl bg-white dark:bg-ink-900 border border-gray-200/80 dark:border-ink-700 p-7 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className={`relative w-14 h-14 rounded-2xl ${tone} flex items-center justify-center shadow-soft`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-display text-6xl font-extrabold text-gray-100 dark:text-ink-800 leading-none">0{i + 1}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">{t(`landing.how.steps.${id}.title`)}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t(`landing.how.steps.${id}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
