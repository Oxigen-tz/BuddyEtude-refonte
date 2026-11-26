import React from "react";
import { Target, MessageCircle, PenTool, Send, CalendarDays, BookOpen, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import { isLiteDevice } from "@/hooks/useLiteMotion";
import { reveal } from "./SectionHeading";
const LITE = isLiteDevice();
import { useTranslation } from "react-i18next";

// Fonctions de l’appli : trois blocs illustrés et une ligne d’icônes.
// Les textes viennent de features.items.<id> dans i18n.js.

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
// Trois blocs verticaux (trouver, discuter et appeler, tableau blanc), puis les autres fonctions
// en une ligne d'icônes. Remplace l'ancienne galerie horizontale, longue et déroutante sur téléphone.
const BLOCKS = [
  // shot : vraie capture de l'appli (comptes fictifs sur les émulateurs), dans public/app/
  { id: "filters", icon: Target, Art: MatchArt, glow: "bg-brand-500", shot: { src: "/app/search.webp", w: 1200, h: 566, mobile: "/app/search-mobile.webp" } },
  { id: "chat", icon: MessageCircle, Art: ChatArt, glow: "bg-sky-500", shot: { src: "/app/messages.webp", w: 900, h: 505 } },
  { id: "whiteboard", icon: PenTool, Art: BoardArt, glow: "bg-purple-500" },
];
const MORE = [
  { id: "schedule", icon: CalendarDays },
  { id: "requests", icon: Send },
  { id: "subjects", icon: BookOpen },
];

function FeatureBlock({ id, icon: Icon, Art, glow, flip, shot }) {
  const { t } = useTranslation();
  return (
    <motion.article {...reveal()} className="relative grid md:grid-cols-2 gap-6 md:gap-12 items-center">
      <div className={flip ? "md:order-2" : ""}>
        <span className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-white flex items-center justify-center mb-5"><Icon className="w-5 h-5" /></span>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">{t(`features.items.${id}.title`)}</h3>
        <p className="mt-3 text-white/60 leading-relaxed text-[15px] sm:text-base max-w-md">{t(`features.items.${id}.desc`)}</p>
      </div>
      <div className="relative rounded-[2rem] bg-gradient-to-b from-white/[0.09] to-white/[0.02] border border-white/10 p-6 sm:p-8 overflow-hidden" aria-hidden="true">
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full ${glow} opacity-25 blur-[80px]`} />
        {shot ? (
          <picture>
            {/* Téléphone : recadrage sur deux cartes, lisible sur un petit écran */}
            {shot.mobile && <source media="(max-width: 639px)" srcSet={shot.mobile} />}
            <img src={shot.src} width={shot.w} height={shot.h} alt="" loading="lazy" decoding="async"
              className="relative w-full h-auto rounded-2xl shadow-lift ring-1 ring-white/10" />
          </picture>
        ) : (
          <div className="relative"><Art /></div>
        )}
      </div>
    </motion.article>
  );
}

export default function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section id="features" className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto">
        <motion.div {...reveal()} className="max-w-2xl mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-white">{t("features.title")}</h2>
          <p className="mt-4 text-white/60 text-lg leading-relaxed">{t("features.subtitle")}</p>
        </motion.div>
        <div className="space-y-14 sm:space-y-20">
          {BLOCKS.map((b, i) => <FeatureBlock key={b.id} {...b} flip={i % 2 === 1} />)}
        </div>
        <motion.ul {...reveal()} className="mt-16 sm:mt-20 grid sm:grid-cols-3 gap-3">
          {MORE.map(({ id, icon: Icon }) => (
            <li key={id} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3.5">
              <span className="shrink-0 w-10 h-10 rounded-xl bg-white/10 text-lime-300 flex items-center justify-center"><Icon className="w-5 h-5" /></span>
              <span className="text-sm font-semibold text-white">{t(`features.items.${id}.title`)}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
