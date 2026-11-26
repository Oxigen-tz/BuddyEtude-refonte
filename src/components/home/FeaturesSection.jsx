import React, { useLayoutEffect, useRef, useState } from "react";
import { Target, MessageCircle, PenTool, Send, CalendarDays, BookOpen, Paperclip, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLiteMotion, isLiteDevice } from "@/hooks/useLiteMotion";
const LITE = isLiteDevice();
import { useTranslation } from "react-i18next";

// Galerie horizontale : en faisant défiler la page, les cartes glissent de droite à gauche.
// Les textes viennent de features.items.<id> dans i18n.js.
const SUBJECTS = ["Mathématiques", "Droit", "Médecine", "Physique", "Économie", "Informatique", "Anglais", "Biologie", "Histoire", "Philosophie", "Chimie", "Gestion"];

// Mêmes repères que sur les cartes de la recherche (buddyCard.match) : l'application n'affiche aucun pourcentage.
function MatchArt() {
  const { t } = useTranslation();
  const rows = [
    ["LM", "from-coral-400 to-purple-500", [t("buddyCard.match.subjects", { count: 3 }), t("buddyCard.match.level")]],
    ["YB", "from-brand-400 to-brand-700", [t("buddyCard.match.subjects", { count: 2 }), t("buddyCard.match.school")]],
    ["SA", "from-lime-300 to-lime-500", [t("buddyCard.match.subjects", { count: 1 }), t("buddyCard.match.city")]],
  ];
  return (
    <div className="space-y-2.5">
      {rows.map(([ini, g, badges], i) => (
        <motion.div key={ini} initial={LITE ? false : { opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/10 p-2.5">
          <span className={`shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${g} text-white text-[11px] font-bold flex items-center justify-center`}>{ini}</span>
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {badges.map((b, j) => (
              <span key={b} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${j === 0 ? "bg-lime-300/10 border-lime-300/30 text-lime-200" : "bg-white/[0.06] border-white/10 text-white/75"}`}>{b}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
function ChatArt() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-[13px] font-medium">
      <div className="w-fit rounded-2xl rounded-bl-md bg-white/[0.08] text-white/85 px-3 py-2">{t("landing.mock.chat1")}</div>
      <div className="w-fit rounded-2xl rounded-bl-md bg-white/[0.08] text-white/85 px-3 py-2 flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> {t("landing.story.file")}</div>
      <div className="ml-auto w-fit rounded-2xl rounded-br-md bg-brand-600 text-white px-3 py-2">{t("landing.mock.thanks")}</div>
    </div>
  );
}
function BoardArt() {
  return (
    <svg viewBox="0 0 300 130" className="w-full h-32">
      <motion.path d="M10 90 C 60 0, 110 0, 150 60 S 220 110, 290 20" fill="none" stroke="#DE9DFF" strokeWidth="5" strokeLinecap="round"
        initial={LITE ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeInOut" }} />
      <motion.circle cx="150" cy="40" r="16" fill="none" stroke="#FF8A66" strokeWidth="3.5"
        initial={LITE ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1.2 }} />
      <text x="196" y="122" fill="#DCF46B" style={{ font: "italic 700 22px 'Bricolage Grotesque', serif" }}>f′(x) = 0</text>
    </svg>
  );
}
function CalendarArt() {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {Array.from({ length: 21 }, (_, i) => (
        <span key={i} className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center ${
          i === 11 ? "bg-brand-500 text-white shadow-glow" : [4, 16].includes(i) ? "bg-lime-300 text-gray-900" : "bg-white/[0.06] text-white/40"
        }`}>{i + 3}</span>
      ))}
    </div>
  );
}
function RequestArt() {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
      <p className="text-[13px] text-white/80 leading-relaxed">« {t("landing.mock.chat1")} »</p>
      <div className="mt-3 flex gap-2">
        <span className="flex-1 h-9 rounded-xl bg-white text-gray-900 text-xs font-bold flex items-center justify-center">{t("landing.mentor.card.accept")}</span>
        <span className="w-9 h-9 rounded-xl border border-white/15 text-white/50 flex items-center justify-center">×</span>
      </div>
    </div>
  );
}
function SubjectsArt() {
  return (
    <div className="flex flex-wrap gap-2">
      {SUBJECTS.map((s, i) => (
        <span key={s} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
          ["bg-brand-500/15 border-brand-400/30 text-brand-200", "bg-white/[0.06] border-white/10 text-white/80", "bg-lime-300/10 border-lime-300/30 text-lime-200", "bg-coral-500/15 border-coral-400/30 text-coral-300"][i % 4]
        }`}>{s}</span>
      ))}
    </div>
  );
}

const CARDS = [
  { id: "filters", icon: Target, Art: MatchArt, glow: "bg-brand-500" },
  { id: "chat", icon: MessageCircle, Art: ChatArt, glow: "bg-sky-500" },
  { id: "whiteboard", icon: PenTool, Art: BoardArt, glow: "bg-purple-500" },
  { id: "schedule", icon: CalendarDays, Art: CalendarArt, glow: "bg-lime-400" },
  { id: "requests", icon: Send, Art: RequestArt, glow: "bg-coral-500" },
  { id: "subjects", icon: BookOpen, Art: SubjectsArt, glow: "bg-brand-400" },
];

function FeatureCard({ id, icon: Icon, Art, glow, index, fluid = false }) {
  const { t } = useTranslation();
  return (
    <article className={`group relative ${fluid ? "w-full min-h-[420px]" : "shrink-0 w-[82vw] sm:w-[420px] h-[460px] sm:h-[500px]"} rounded-[2rem] bg-gradient-to-b from-white/[0.09] to-white/[0.02] border border-white/10 p-7 sm:p-8 overflow-hidden flex flex-col`}>
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full ${glow} opacity-25 blur-[80px] transition-opacity duration-500 group-hover:opacity-50`} />
      <div className="relative flex items-center justify-between">
        <span className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-white flex items-center justify-center"><Icon className="w-5 h-5" /></span>
        <span className="font-display text-5xl font-extrabold text-white/[0.07]">0{index + 1}</span>
      </div>
      <h3 className="relative mt-6 font-display text-2xl font-bold text-white">{t(`features.items.${id}.title`)}</h3>
      <p className="relative mt-2 text-white/60 leading-relaxed text-[15px]">{t(`features.items.${id}.desc`)}</p>
      <div className="relative mt-auto pt-6" aria-hidden="true"><Art /></div>
    </article>
  );
}

export default function FeaturesSection() {
  const { t } = useTranslation();
  const reduce = useLiteMotion();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current) setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const intro = (
    <div className="shrink-0 w-[82vw] sm:w-[400px] flex flex-col justify-center pr-4">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300 mb-4">{t("landing.featuresEyebrow")}</span>
      <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.02] text-white">{t("features.title")}</h2>
      <p className="mt-5 text-white/60 text-lg leading-relaxed">{t("features.subtitle")}</p>
      {!reduce && <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/50">{t("landing.scrollHint")} <ArrowRight className="w-4 h-4 animate-pulse" /></span>}
    </div>
  );

  if (reduce) {
    return (
      <section className="px-4 sm:px-6 py-24">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="sm:col-span-2 lg:col-span-3 [&>div]:w-full [&>div]:pr-0">{intro}</div>
          {CARDS.map((c, i) => <FeatureCard key={c.id} {...c} index={i} fluid />)}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex gap-5 sm:gap-6 w-max px-[6vw] sm:px-[8vw] items-center">
          {intro}
          {CARDS.map((c, i) => <FeatureCard key={c.id} {...c} index={i} />)}
        </motion.div>
        <div className="mt-10 mx-auto w-48 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div style={{ width: progress }} className="h-full rounded-full bg-gradient-to-r from-brand-400 to-lime-300" />
        </div>
      </div>
    </section>
  );
}
