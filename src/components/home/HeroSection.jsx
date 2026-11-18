import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Users } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import HeroMockup from "./HeroMockup";

const SOCIAL_PROOF_THRESHOLD = 20;

export default function HeroSection() {
  const { user, openLogin } = useAuth();
  const { t } = useTranslation();
  const [studentCount, setStudentCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Compteur public (stats/public.studentCount) : les règles interdisent de lister les profils
    // sans être connecté. Incrémenté par Profile.jsx quand un profil est complété.
    getDoc(doc(db, "stats", "public"))
      .then((snap) => {
        if (!cancelled) setStudentCount(snap.exists() ? Number(snap.data().studentCount) || 0 : 0);
      })
      .catch((error) => {
        console.warn("Compteur d'étudiants indisponible :", error);
        if (!cancelled) setStudentCount(0);
      });
    return () => { cancelled = true; };
  }, []);

  const showRealCount = studentCount !== null && studentCount >= SOCIAL_PROOF_THRESHOLD;
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-16 lg:pb-28">
      {/* Décor : quadrillage estompé et halos colorés */}
      <div className="absolute inset-0 bg-grid mask-radial opacity-80" />
      <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-brand-400/25 dark:bg-brand-600/20 blur-3xl" />
      <div className="absolute top-20 -right-32 w-[420px] h-[420px] rounded-full bg-coral-300/25 dark:bg-coral-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-[360px] h-[260px] rounded-full bg-lime-300/30 dark:bg-lime-400/5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 dark:border-brand-500/30 bg-white/70 dark:bg-ink-900/70 backdrop-blur px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-brand-700 dark:text-brand-200 shadow-soft">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-lime-500" />
              </span>
              {t("landing.heroBadge")}
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="mt-6 font-display text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem] font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t("hero.title1")}{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="text-gradient">{t("hero.title_highlight")}</span>
              <svg viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute left-0 -bottom-1.5 sm:-bottom-2 w-full h-3 sm:h-4" aria-hidden="true">
                <motion.path
                  d="M4 11 C 70 3, 150 3, 296 9"
                  fill="none" stroke="#CBEA3B" strokeWidth="6" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
                />
              </svg>
            </span>{" "}
            {t("hero.title2")}
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t("hero.subtitle_part1")}
            <strong className="text-gray-900 dark:text-white font-semibold">{t("hero.subtitle_bold")}</strong>
            {t("hero.subtitle_part2")}
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            {user ? (
              <Link to="/Dashboard">
                <Button size="lg" className="w-full sm:w-auto h-14 px-7 rounded-2xl text-base bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white shadow-glow group">
                  {t("hero.btn_dashboard")}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={openLogin} className="h-14 px-7 rounded-2xl text-base bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white shadow-glow group">
                {t("hero.btn_start")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
            <a href="#how">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-7 rounded-2xl text-base bg-white/70 dark:bg-ink-900/70 backdrop-blur">
                {t("landing.secondaryCta")}
              </Button>
            </a>
          </motion.div>

          <motion.ul {...fadeUp(0.32)} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-sm font-medium text-gray-600 dark:text-gray-400">
            {["free", "verified", "europe"].map((k) => (
              <li key={k} className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-lime-200 dark:bg-lime-400/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-gray-900 dark:text-lime-300" strokeWidth={3} />
                </span>
                {t(`landing.trust.${k}`)}
              </li>
            ))}
          </motion.ul>

          {studentCount !== null && (
            <motion.div {...fadeUp(0.4)} className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/70 dark:bg-ink-900/70 backdrop-blur border border-gray-200/70 dark:border-ink-700 px-4 py-2.5 shadow-soft">
              <div className="flex -space-x-2">
                {["from-brand-400 to-brand-600", "from-coral-300 to-coral-500", "from-lime-300 to-lime-500"].map((g) => (
                  <span key={g} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} ring-2 ring-white dark:ring-ink-900 flex items-center justify-center`}>
                    {showRealCount ? <Users className="w-3.5 h-3.5 text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <Trans
                  i18nKey={showRealCount ? "hero.social.active" : "hero.social.early"}
                  values={{ count: studentCount }}
                  components={{ bold: <strong className="text-gray-900 dark:text-white font-bold" /> }}
                />
              </p>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <HeroMockup />
        </motion.div>
      </div>
    </section>
  );
}
