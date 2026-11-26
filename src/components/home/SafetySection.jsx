import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BadgeCheck, ShieldAlert, Flag, LockKeyhole } from "lucide-react";
import SectionHeading, { reveal } from "./SectionHeading";

const ITEMS = [
  { id: "verified", icon: BadgeCheck, tone: "text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-sky-500/15" },
  { id: "contact", icon: ShieldAlert, tone: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15" },
  { id: "report", icon: Flag, tone: "text-coral-600 bg-coral-100 dark:text-coral-300 dark:bg-coral-500/15" },
  { id: "privacy", icon: LockKeyhole, tone: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/15" },
];

export default function SafetySection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={t("landing.safety.title")} subtitle={t("landing.safety.subtitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map(({ id, icon: Icon, tone }, i) => (
            <motion.div key={id} {...reveal(i * 0.08)} className="rounded-3xl p-6 bg-white dark:bg-ink-900 border border-gray-200/80 dark:border-ink-700 shadow-soft hover:-translate-y-1 hover:shadow-lift transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl ${tone} flex items-center justify-center mb-5`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">{t(`landing.safety.items.${id}.title`)}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t(`landing.safety.items.${id}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
