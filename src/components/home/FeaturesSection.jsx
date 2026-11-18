import React from "react";
import { Target, MessageCircle, PenTool, Send, CalendarDays, BookOpen, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeading, { reveal } from "./SectionHeading";

// Les textes viennent de features.items.<id> dans i18n.js. Grille « bento » : chaque carte
// a une petite illustration de la fonctionnalité.
const SUBJECTS = [
  "Mathématiques", "Droit", "Médecine", "Physique", "Économie", "Informatique", "Anglais", "Biologie",
  "Histoire", "Philosophie", "Chimie", "Gestion", "Psychologie", "Marketing", "Espagnol", "Statistiques",
];

function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      {...reveal(delay)}
      className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-ink-900 border border-gray-200/80 dark:border-ink-700 p-7 shadow-soft hover:shadow-lift transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Title({ id, icon: Icon, tone }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={`w-11 h-11 rounded-2xl ${tone} flex items-center justify-center mb-5`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">{t(`features.items.${id}.title`)}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t(`features.items.${id}.desc`)}</p>
    </>
  );
}

const MATCHES = [
  { initials: "LM", grad: "from-coral-400 to-purple-500", score: 94, w: "w-[94%]" },
  { initials: "YB", grad: "from-brand-400 to-brand-700", score: 81, w: "w-[81%]" },
  { initials: "SA", grad: "from-lime-300 to-lime-500", score: 67, w: "w-[67%]" },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow={t("landing.featuresEyebrow")} title={t("features.title")} subtitle={t("features.subtitle")} />

        <div className="grid md:grid-cols-3 gap-5">
          {/* Compatibilité */}
          <Card className="md:col-span-2 grid sm:grid-cols-2 gap-8 items-center">
            <div><Title id="filters" icon={Target} tone="bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300" /></div>
            <div className="space-y-3" aria-hidden="true">
              {MATCHES.map((m, i) => (
                <div key={m.initials} className="flex items-center gap-3 rounded-2xl bg-gray-50 dark:bg-ink-850 border border-gray-100 dark:border-ink-700 p-3">
                  <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.grad} text-white text-xs font-bold flex items-center justify-center shrink-0`}>{m.initials}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200/80 dark:bg-ink-700 overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                      className={`h-full ${m.w} origin-left rounded-full bg-gradient-to-r from-brand-500 to-coral-400`}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white w-10 text-right">{m.score}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat */}
          <Card delay={0.05}>
            <Title id="chat" icon={MessageCircle} tone="bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300" />
            <div className="mt-6 space-y-2" aria-hidden="true">
              <div className="w-fit rounded-2xl rounded-bl-md bg-gray-100 dark:bg-ink-800 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" /> fiche-chapitre-3.pdf
              </div>
              <div className="ml-auto w-fit rounded-2xl rounded-br-md bg-brand-600 px-3 py-2 text-xs font-medium text-white">{t("landing.mock.thanks")}</div>
            </div>
          </Card>

          {/* Tableau blanc */}
          <Card delay={0.1}>
            <Title id="whiteboard" icon={PenTool} tone="bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300" />
            <svg viewBox="0 0 240 70" className="mt-5 w-full h-16" aria-hidden="true">
              <motion.path d="M8 50 C 40 10, 70 10, 95 40 S 150 70, 175 30 S 220 20, 232 35" fill="none" stroke="#B83DF5" strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeInOut" }} />
              <motion.circle cx="120" cy="22" r="10" fill="none" stroke="#FF6B42" strokeWidth="3"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1 }} />
            </svg>
          </Card>

          {/* Sessions */}
          <Card delay={0.15}>
            <Title id="schedule" icon={CalendarDays} tone="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" />
            <div className="mt-6 grid grid-cols-7 gap-1.5" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center ${
                  i === 9 ? "bg-brand-600 text-white shadow-glow" : i === 4 || i === 12 ? "bg-lime-200 text-gray-900 dark:bg-lime-400/20 dark:text-lime-200" : "bg-gray-100 text-gray-400 dark:bg-ink-800 dark:text-gray-500"
                }`}>{i + 10}</span>
              ))}
            </div>
          </Card>

          {/* Demandes */}
          <Card delay={0.2}>
            <Title id="requests" icon={Send} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" />
          </Card>

          {/* Matières */}
          <Card className="md:col-span-3 !p-0" delay={0.05}>
            <div className="p-7 pb-5 sm:flex sm:items-end sm:justify-between gap-8">
              <div className="max-w-xl"><Title id="subjects" icon={BookOpen} tone="bg-coral-100 text-coral-600 dark:bg-coral-500/15 dark:text-coral-300" /></div>
            </div>
            <div className="relative overflow-hidden pb-7 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" aria-hidden="true">
              <div className="flex w-max gap-3 animate-marquee group-hover:[animation-play-state:paused]">
                {[...SUBJECTS, ...SUBJECTS].map((s, i) => (
                  <span key={i} className={`px-4 py-2 rounded-full text-sm font-semibold border whitespace-nowrap ${
                    ["bg-brand-50 border-brand-100 text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-200",
                     "bg-white border-gray-200 text-gray-700 dark:bg-ink-850 dark:border-ink-700 dark:text-gray-200",
                     "bg-lime-100 border-lime-200 text-gray-800 dark:bg-lime-400/10 dark:border-lime-400/20 dark:text-lime-200",
                     "bg-coral-100 border-coral-100 text-coral-600 dark:bg-coral-500/10 dark:border-coral-500/20 dark:text-coral-300"][i % 4]
                  }`}>{s}</span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
