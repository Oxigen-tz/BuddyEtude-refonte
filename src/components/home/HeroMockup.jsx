import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BadgeCheck, CalendarClock, Video, MousePointer2 } from "lucide-react";

// Maquette illustrative du produit (pas une capture) : carte de binôme, tableau blanc partagé,
// conversation et rappel de session, qui flottent doucement.
const float = (delay = 0, distance = 8, duration = 6) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" },
});

export default function HeroMockup() {
  const { t } = useTranslation();
  const subjects = t("landing.mock.subjects", { returnObjects: true });

  return (
    <div className="relative h-[330px] sm:h-[520px] w-full select-none" aria-hidden="true">
      <div className="absolute left-1/2 top-0 w-[520px] h-[520px] -translate-x-1/2 origin-top scale-[0.62] sm:scale-100">

        {/* Tableau blanc partagé */}
        <motion.div {...float(0, 6, 8)} className="absolute right-0 top-0 w-[400px] h-[290px] rounded-3xl bg-white dark:bg-ink-900 border border-gray-200/80 dark:border-ink-700 shadow-lift overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-gray-100 dark:border-ink-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-300" />
              <span className="ml-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t("landing.mock.board")}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-coral-600 bg-coral-100 dark:bg-coral-500/15 dark:text-coral-300 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" /> {t("landing.mock.live")}
            </span>
          </div>
          <div className="relative h-[247px] bg-[radial-gradient(circle,rgba(100,56,245,0.13)_1px,transparent_1px)] [background-size:18px_18px]">
            <svg viewBox="0 0 400 247" className="absolute inset-0 w-full h-full">
              {/* Axes et parabole */}
              <path d="M40 200 H370 M60 220 V30" className="stroke-gray-300 dark:stroke-ink-600" strokeWidth="2" strokeLinecap="round" fill="none" />
              <motion.path
                d="M70 60 Q 160 330 250 70"
                fill="none" stroke="#6438F5" strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }}
              />
              <motion.path
                d="M95 170 Q 160 215 225 170 L 225 200 L 95 200 Z"
                fill="#DCF46B" fillOpacity="0.55"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 2.4 }}
              />
              <text x="262" y="62" className="fill-gray-800 dark:fill-gray-100" style={{ font: "italic 600 22px 'Bricolage Grotesque', serif" }}>∫ x² dx</text>
              <text x="276" y="96" className="fill-brand-600 dark:fill-brand-300" style={{ font: "italic 700 22px 'Bricolage Grotesque', serif" }}>= x³/3</text>
              <motion.path
                d="M262 108 C 290 116, 320 104, 350 110"
                fill="none" stroke="#FF6B42" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 3 }}
              />
            </svg>
            {/* Curseur du binôme, façon outil collaboratif */}
            <motion.div
              className="absolute"
              animate={{ x: [250, 210, 300, 250], y: [140, 110, 150, 140] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <MousePointer2 className="w-5 h-5 text-coral-500 fill-coral-500 -rotate-12" />
              <span className="ml-4 -mt-1 inline-block text-[11px] font-bold text-white bg-coral-500 px-2 py-0.5 rounded-md rounded-tl-none shadow">Léa</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Carte de binôme */}
        <motion.div {...float(0.8, 10, 7)} className="absolute left-0 top-[170px] w-[290px] rounded-3xl bg-white dark:bg-ink-900 border border-gray-200/80 dark:border-ink-700 shadow-lift p-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-400 to-purple-500 flex items-center justify-center text-white font-bold">LM</div>
              <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-sky-500 fill-white dark:fill-ink-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-gray-900 dark:text-white leading-tight">{t("landing.mock.name")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t("landing.mock.meta")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{t("buddyCard.match.subjects", { count: 3 })}</span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200">{t("buddyCard.match.level")}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {Array.isArray(subjects) && subjects.map((s, i) => (
              <span key={s} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                ["bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200", "bg-lime-100 text-lime-500 dark:bg-lime-400/10 dark:text-lime-300", "bg-coral-100 text-coral-600 dark:bg-coral-500/15 dark:text-coral-300"][i % 3]
              }`}>{s}</span>
            ))}
          </div>
          <div className="mt-4 h-9 rounded-xl bg-brand-600 text-white text-sm font-semibold flex items-center justify-center shadow-glow">
            {t("landing.mock.contact")}
          </div>
        </motion.div>

        {/* Conversation */}
        <motion.div {...float(1.6, 7, 6.5)} className="absolute right-0 top-[300px] w-[270px] space-y-2">
          <div className="ml-auto w-fit max-w-[230px] rounded-2xl rounded-br-md bg-brand-600 text-white text-[13px] font-medium px-3.5 py-2.5 shadow-lift">
            {t("landing.mock.chat1")}
          </div>
          <div className="w-fit max-w-[230px] rounded-2xl rounded-bl-md bg-white dark:bg-ink-800 text-gray-800 dark:text-gray-100 text-[13px] font-medium px-3.5 py-2.5 border border-gray-200/80 dark:border-ink-700 shadow-lift">
            {t("landing.mock.chat2")}
          </div>
        </motion.div>

        {/* Rappel de session */}
        <motion.div {...float(2.2, 6, 7.5)} className="absolute left-2 bottom-0 w-[330px] rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-3.5 shadow-lift flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-300 text-gray-900 flex items-center justify-center shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight whitespace-nowrap">{t("landing.mock.session")}</p>
            <p className="text-xs opacity-70 whitespace-nowrap">{t("landing.mock.sessionWhen")}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold bg-white/10 dark:bg-gray-900/5 px-2 py-1 rounded-full whitespace-nowrap">
            <Video className="w-3 h-3" /> {t("landing.mock.video")}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
