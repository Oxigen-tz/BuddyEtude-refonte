import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useLiteMotion } from "@/hooks/useLiteMotion";
import { useTranslation } from "react-i18next";
import { UserRoundPen, Sparkles, PenLine, BadgeCheck, Video, Mic, CalendarClock } from "lucide-react";

const STEPS = [
  { id: "profile", icon: UserRoundPen },
  { id: "match", icon: Sparkles },
  { id: "study", icon: PenLine },
];
const EASE = [0.22, 1, 0.36, 1];

// --- Visuels de chaque étape ---------------------------------------------------------------
function ProfileVisual() {
  const { t } = useTranslation();
  const subjects = [
    ["Mathématiques", "advanced", "bg-lime-300 text-gray-900"],
    ["Physique", "beginner", "bg-coral-400 text-white"],
    ["Anglais", "intermediate", "bg-brand-500 text-white"],
  ];
  return (
    <div className="w-full max-w-md rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl p-6 shadow-lift">
      <div className="flex items-center gap-4">
        <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-600 text-white text-xl font-bold flex items-center justify-center">CA</span>
        <div>
          <p className="font-display text-xl font-bold text-white">Camille A.</p>
          <p className="text-sm text-white/50">{t("landing.story.profileTitle")} · L1 Sciences · Rennes</p>
        </div>
      </div>
      <p className="mt-6 mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white/40">{t("landing.story.subjects")}</p>
      <div className="space-y-2">
        {subjects.map(([name, lvl, tone], i) => (
          <motion.div key={name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1, ease: EASE }}
            className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2.5">
            <span className="text-sm font-semibold text-white">{name}</span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tone}`}>{t(`landing.story.${lvl}`)}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white/40">{t("landing.story.avail")}</p>
      <div className="flex gap-2">
        {["evening", "weekend", "online"].map((k, i) => (
          <motion.span key={k} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/85 border border-white/10">{t(`landing.story.${k}`)}</motion.span>
        ))}
      </div>
    </div>
  );
}

function MatchVisual() {
  const { t } = useTranslation();
  const people = [
    // [initiales, nom, infos, matières en commun, repère secondaire, dégradé, vérifié] : mêmes badges que la recherche
    ["LM", "Léa M.", "L2 Maths · Lyon", 3, "level", "from-coral-400 to-purple-500", true],
    ["YB", "Yanis B.", "Prépa MPSI · Lyon", 2, "city", "from-brand-400 to-brand-700", false],
    ["SA", "Sarah A.", "L1 Éco · En ligne", 1, "level", "from-lime-300 to-lime-500", true],
  ];
  return (
    <div className="w-full max-w-md space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40 mb-1">{t("landing.story.results")}</p>
      {people.map(([ini, name, meta, common, other, grad, verified], i) => (
        <motion.div key={ini} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, ease: EASE }}
          className={`flex items-center gap-3.5 rounded-2xl border backdrop-blur-xl p-4 ${i === 0 ? "bg-white/[0.1] border-brand-400/50 shadow-glow" : "bg-white/[0.05] border-white/10"}`}>
          <span className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${grad} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
            {ini}{verified && <BadgeCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-sky-400 fill-ink-900" />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white">{name}</p>
            <p className="text-xs text-white/50 truncate">{meta}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-lime-300/10 border-lime-300/30 text-lime-200">{t("buddyCard.match.subjects", { count: common })}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-white/[0.06] border-white/10 text-white/75">{t(`buddyCard.match.${other}`)}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StudyVisual() {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-md space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[["LM", "from-coral-400 to-purple-500", "Léa"], ["CA", "from-brand-400 to-purple-600", "Camille"]].map(([ini, grad, name], i) => (
          <motion.div key={ini} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, ease: EASE }}
            className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-ink-800 to-ink-900 border border-white/10 flex items-center justify-center overflow-hidden">
            <span className={`w-14 h-14 rounded-full bg-gradient-to-br ${grad} text-white font-bold flex items-center justify-center ${i === 0 ? "ring-4 ring-lime-300/60" : ""}`}>{ini}</span>
            <span className="absolute bottom-2 left-2 text-[11px] font-semibold text-white bg-black/40 rounded-md px-1.5 py-0.5 flex items-center gap-1"><Mic className="w-3 h-3" /> {name}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ease: EASE }}
        className="relative h-40 rounded-2xl bg-white/[0.05] border border-white/10 overflow-hidden bg-[radial-gradient(circle,rgba(152,125,255,0.18)_1px,transparent_1px)] [background-size:16px_16px]">
        <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full">
          <motion.path d="M30 120 C 80 20, 140 20, 190 90 S 300 150, 370 40" fill="none" stroke="#987DFF" strokeWidth="5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 1.4, ease: "easeInOut" }} />
          <motion.text x="250" y="60" fill="#DCF46B" style={{ font: "italic 700 26px 'Bricolage Grotesque', serif" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>sin(x)</motion.text>
        </svg>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease: EASE }}
        className="flex items-center gap-3 rounded-2xl bg-white text-gray-900 p-3.5">
        <span className="w-10 h-10 rounded-xl bg-lime-300 flex items-center justify-center"><CalendarClock className="w-5 h-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{t("landing.mock.session")}</p>
          <p className="text-xs text-gray-500">{t("landing.mock.sessionWhen")}</p>
        </div>
        <span className="text-xs font-bold bg-brand-600 text-white rounded-lg px-2.5 py-1.5 flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {t("landing.story.call")}</span>
      </motion.div>
    </div>
  );
}

const VISUALS = [ProfileVisual, MatchVisual, StudyVisual];

// --- Section : les étapes restent à l'écran pendant qu'on fait défiler -----------------------
export default function HowItWorks() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const reduce = useLiteMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)))));
  const barHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const Visual = VISUALS[active];

  const header = (
    <div className="mb-8 lg:mb-12">
      <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-lime-300 mb-3">{t("landing.how.eyebrow")}</span>
      <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-white">{t("landing.how.title")}</h2>
    </div>
  );

  if (reduce) {
    return (
      <section id="how" className="px-4 sm:px-6 py-24 max-w-6xl mx-auto scroll-mt-10">
        {header}
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map(({ id, icon: Icon }) => (
            <div key={id} className="rounded-3xl bg-white/[0.05] border border-white/10 p-6">
              <Icon className="w-6 h-6 text-lime-300 mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-2">{t(`landing.how.steps.${id}.title`)}</h3>
              <p className="text-white/60">{t(`landing.how.steps.${id}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="how" ref={ref} className="relative h-[320vh] scroll-mt-0">
      <div className="sticky top-0 h-[100svh] flex items-center overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[640px] max-h-[640px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          <div className="pt-16 lg:pt-0">
            {header}
            <div className="relative flex gap-5 sm:gap-7">
              {/* Barre de progression verticale */}
              <div className="relative w-1 rounded-full bg-white/10 shrink-0">
                <motion.div style={{ height: barHeight }} className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-brand-400 via-purple-400 to-lime-300" />
              </div>
              <ol className="space-y-5 sm:space-y-8">
                {STEPS.map(({ id, icon: Icon }, i) => {
                  const on = i === active;
                  return (
                    <li key={id} className={`transition-all duration-500 ${on ? "opacity-100" : "opacity-35"} ${!on ? "hidden sm:block" : ""}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${on ? "bg-lime-300 text-gray-900" : "bg-white/10 text-white"}`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-xs font-bold text-white/40">0{i + 1}</span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">{t(`landing.how.steps.${id}.title`)}</h3>
                      <p className={`mt-2 text-white/60 leading-relaxed max-w-md transition-all duration-500 ${on ? "max-h-40" : "max-h-0 sm:max-h-40 overflow-hidden"}`}>{t(`landing.how.steps.${id}.desc`)}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="relative flex justify-center items-center min-h-[340px] sm:min-h-[460px] scale-[0.82] sm:scale-100 origin-top">
            <AnimatePresence mode="wait">
              <motion.div key={active} className="w-full flex justify-center"
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease: EASE }}>
                <Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
