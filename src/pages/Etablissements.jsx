import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight, Mail, UsersRound, HandHelping, Video, PenTool, ShieldCheck, Target,
  Building2, ClipboardList, BarChart3, Megaphone, CloudOff, FileSpreadsheet, Frown, Sparkles, Check,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";
import { IconTile } from "@/components/settings/SettingsUI";

// Page de présentation pour les universités, écoles et BDE (recherche d'établissements pilotes).
// Les fonctions « existantes » sont réellement disponibles ; celles « avec les pilotes » sont
// annoncées comme à construire ensemble, sans engagement de date ni de prix.
const CONTACT = "contact@buddyetude.com";

const PROBLEMS = [
  ["isolation", Frown, "coral"],
  ["spreadsheets", FileSpreadsheet, "amber"],
  ["matching", CloudOff, "purple"],
];
const FEATURES = [
  ["matching", Target, "brand"],
  ["mentoring", HandHelping, "lime"],
  ["sessions", Video, "sky"],
  ["whiteboard", PenTool, "purple"],
  ["groups", UsersRound, "coral"],
  ["safety", ShieldCheck, "lime"],
];
const PILOT = [
  ["space", Building2],
  ["tracking", ClipboardList],
  ["stats", BarChart3],
  ["launch", Megaphone],
];

export default function Etablissements() {
  const { t } = useTranslation();
  const mailto = `mailto:${CONTACT}?subject=${encodeURIComponent(t("schools.mail.subject"))}&body=${encodeURIComponent(t("schools.mail.body"))}`;

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12">

      {/* --- EN-TÊTE --- */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink-950 text-white px-6 py-14 sm:px-12 sm:py-20">
        <div className="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-brand-600/50 blur-[100px] animate-aurora" />
        <div className="absolute -bottom-40 -left-20 w-[26rem] h-[26rem] rounded-full bg-coral-500/25 blur-[100px] animate-aurora-slow" />
        <div className="absolute inset-0 bg-grid opacity-[0.15] mask-radial" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-lime-300">
            <Sparkles className="w-3.5 h-3.5" /> {t("schools.eyebrow")}
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.02]">
            {t("schools.title1")} <span className="text-gradient">{t("schools.titleHighlight")}</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">{t("schools.subtitle")}</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a href={mailto} className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold shadow-glow hover:opacity-95 transition-opacity">
              {t("schools.ctaPilot")} <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/" className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-white/15 bg-white/5 font-semibold hover:bg-white/10 transition-colors">
              {t("schools.ctaPlatform")}
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            {["free", "noAds", "europe"].map((k) => (
              <li key={k} className="flex items-center gap-2"><Check className="w-4 h-4 text-lime-300" /> {t(`schools.trust.${k}`)}</li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* --- LE CONSTAT --- */}
      <section className="mt-20 sm:mt-28">
        <Heading eyebrow={t("schools.problems.eyebrow")} title={t("schools.problems.title")} />
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {PROBLEMS.map(([k, Icon, tone], i) => (
            <Reveal key={k} index={i}>
              <div className="h-full rounded-2xl bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft p-6">
                <IconTile icon={Icon} tone={tone} />
                <h3 className="mt-4 font-display text-lg font-bold text-gray-900 dark:text-white">{t(`schools.problems.${k}.title`)}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">{t(`schools.problems.${k}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --- CE QUI EXISTE DÉJÀ --- */}
      <section className="mt-20 sm:mt-28">
        <Heading eyebrow={t("schools.features.eyebrow")} title={t("schools.features.title")} subtitle={t("schools.features.subtitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map(([k, Icon, tone], i) => (
            <Reveal key={k} index={i}>
              <div className="group h-full rounded-2xl bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
                <IconTile icon={Icon} tone={tone} />
                <h3 className="mt-4 font-display text-lg font-bold text-gray-900 dark:text-white">{t(`schools.features.${k}.title`)}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">{t(`schools.features.${k}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --- AVEC LES ÉTABLISSEMENTS PILOTES --- */}
      <section className="mt-20 sm:mt-28 rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-lime-100/40 dark:from-brand-500/10 dark:via-ink-900 dark:to-lime-300/5 border border-brand-100 dark:border-ink-700 p-6 sm:p-12">
        <Heading align="left" eyebrow={t("schools.pilot.eyebrow")} title={t("schools.pilot.title")} subtitle={t("schools.pilot.subtitle")} />
        <div className="grid sm:grid-cols-2 gap-4">
          {PILOT.map(([k, Icon], i) => (
            <Reveal key={k} index={i}>
              <div className="h-full flex gap-4 rounded-2xl bg-white/80 dark:bg-ink-950/60 border border-white dark:border-ink-800 p-5 backdrop-blur">
                <span className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white flex items-center justify-center shadow-glow"><Icon className="w-5 h-5" /></span>
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white">{t(`schools.pilot.${k}.title`)}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t(`schools.pilot.${k}.desc`)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --- DÉROULEMENT --- */}
      <section className="mt-20 sm:mt-28">
        <Heading eyebrow={t("schools.steps.eyebrow")} title={t("schools.steps.title")} />
        <ol className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {["call", "launch", "review"].map((k, i) => (
            <Reveal key={k} index={i}>
              <li className="relative h-full rounded-2xl bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft p-6">
                <span className="font-display text-5xl font-extrabold text-gradient">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-gray-900 dark:text-white">{t(`schools.steps.${k}.title`)}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">{t(`schools.steps.${k}.desc`)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <p className="mt-6 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-lime-600 dark:text-lime-300" /> {t("schools.promise")}
        </p>
      </section>

      {/* --- CONTACT --- */}
      <section className="mt-20 sm:mt-28 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 text-white px-6 py-12 sm:px-12 sm:py-16 text-center">
        <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-purple-400/40 blur-3xl animate-aurora" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-coral-400/30 blur-3xl animate-aurora-slow" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">{t("schools.contact.title")}</h2>
          <p className="mt-4 text-white/75 text-lg">{t("schools.contact.desc")}</p>
          <a href={mailto} className="mt-8 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-white text-gray-900 font-bold hover:bg-white/90 transition-colors shadow-lift">
            <Mail className="w-4 h-4" /> {t("schools.ctaPilot")}
          </a>
          <p className="mt-4 text-sm text-white/60">{CONTACT}</p>
        </div>
      </section>
    </div>
  );
}

function Heading({ eyebrow, title, subtitle, align = "center" }) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "text-center mx-auto" : ""} max-w-2xl mb-10`}>
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.08]">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{subtitle}</p>}
    </Reveal>
  );
}
