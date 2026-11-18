import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Users, BadgeCheck, CalendarClock, Video, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import AppWindowMock from "./AppWindowMock";

const SOCIAL_PROOF_THRESHOLD = 20;
const EASE = [0.22, 1, 0.36, 1];

export default function HeroSection() {
  const { user, openLogin } = useAuth();
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [studentCount, setStudentCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Compteur public (stats/public.studentCount) : les règles interdisent de lister les profils
    // sans être connecté. Incrémenté par Profile.jsx quand un profil est complété.
    getDoc(doc(db, "stats", "public"))
      .then((snap) => { if (!cancelled) setStudentCount(snap.exists() ? Number(snap.data().studentCount) || 0 : 0); })
      .catch((error) => { console.warn("Compteur d'étudiants indisponible :", error); if (!cancelled) setStudentCount(0); });
    return () => { cancelled = true; };
  }, []);
  const showRealCount = studentCount !== null && studentCount >= SOCIAL_PROOF_THRESHOLD;

  // Défilement : la fenêtre de l'appli, inclinée en 3D, se redresse et grandit ; les cartes
  // flottantes bougent à des vitesses différentes (parallaxe) ; le texte s'efface en montant.
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [32, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.86, 1]);
  const fastY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [140, -30]);
  const slowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], reduce ? [0, 0] : [0, -80]);
  const textOpacity = useTransform(scrollY, [0, 450], reduce ? [1, 1] : [1, 0.15]);

  const words = [
    ...t("hero.title1").split(" ").map((w) => ({ w })),
    ...t("hero.title_highlight").split(" ").map((w) => ({ w, hl: true })),
    ...t("hero.title2").split(" ").map((w) => ({ w })),
  ];

  const ctaClass = "h-14 px-8 rounded-2xl text-base text-white bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 bg-[length:200%_auto] hover:bg-right transition-[background-position] duration-700 shadow-glow group";

  return (
    <section className="relative pt-32 sm:pt-40 pb-10 overflow-hidden">
      {/* Fond : aurore animée, quadrillage et halo */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute -top-[20%] left-[5%] w-[60vw] h-[60vw] max-w-[820px] max-h-[820px] rounded-full bg-brand-600/35 blur-[120px] animate-aurora" />
        <div className="absolute top-[5%] right-[-10%] w-[45vw] h-[45vw] max-w-[620px] max-h-[620px] rounded-full bg-purple-600/30 blur-[120px] animate-aurora-slow" />
        <div className="absolute top-[35%] left-[30%] w-[35vw] h-[35vw] max-w-[480px] max-h-[480px] rounded-full bg-coral-500/15 blur-[120px] animate-aurora" />
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
      </div>

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur px-4 py-1.5 text-xs sm:text-sm font-semibold text-white/85">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-lime-400" />
            </span>
            {t("landing.heroBadge")}
          </span>
        </motion.div>

        <h1 className="mt-7 font-display text-[2.9rem] leading-[0.98] sm:text-7xl lg:text-[6.2rem] font-extrabold tracking-[-0.04em] text-white">
          {/* Vrais espaces entre les mots animés : sans eux, les moteurs lisaient le titre d'un seul bloc */}
          {words.map((x, i) => (
            <React.Fragment key={i}>
              {i > 0 && " "}
              <motion.span
                initial={{ opacity: 0, y: 50, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.9, ease: EASE }}
                className={`inline-block ${x.hl ? "text-gradient animate-shine pb-2" : ""}`}
              >
                {x.w}
              </motion.span>
            </React.Fragment>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
          className="mt-7 text-lg sm:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
          {t("hero.subtitle_part1")}
          <strong className="text-white font-semibold">{t("hero.subtitle_bold")}</strong>
          {t("hero.subtitle_part2")}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          {user ? (
            <Link to="/Dashboard"><Button size="lg" className={`w-full sm:w-auto ${ctaClass}`}>{t("hero.btn_dashboard")}<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></Button></Link>
          ) : (
            <Button size="lg" onClick={openLogin} className={ctaClass}>{t("hero.btn_start")}<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></Button>
          )}
          <a href="#how">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl text-base bg-white/[0.04] border-white/15 text-white hover:bg-white/10 hover:text-white backdrop-blur">
              {t("landing.secondaryCta")}
            </Button>
          </a>
        </motion.div>

        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm font-medium text-white/60">
          {["free", "verified", "europe"].map((k) => (
            <li key={k} className="inline-flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-lime-300/15 flex items-center justify-center"><Check className="w-3 h-3 text-lime-300" strokeWidth={3} /></span>
              {t(`landing.trust.${k}`)}
            </li>
          ))}
        </motion.ul>

        {studentCount !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
            className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur px-4 py-2.5">
            <div className="flex -space-x-2">
              {["from-brand-400 to-brand-600", "from-coral-300 to-coral-500", "from-lime-300 to-lime-500"].map((g) => (
                <span key={g} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} ring-2 ring-ink-950 flex items-center justify-center`}>
                  {showRealCount ? <Users className="w-3.5 h-3.5 text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/70">
              <Trans i18nKey={showRealCount ? "hero.social.active" : "hero.social.early"} values={{ count: studentCount }}
                components={{ bold: <strong className="text-white font-bold" /> }} />
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.a href="#manifesto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="relative mt-10 mx-auto w-fit flex flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/70">
        {t("landing.scrollHint")}
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}><ChevronDown className="w-4 h-4" /></motion.span>
      </motion.a>

      {/* Scène 3D */}
      <div ref={stageRef} className="relative mt-10 sm:mt-14 px-3 sm:px-6 [perspective:1400px]">
        <motion.div
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
          style={{ rotateX, scale, transformOrigin: "50% 0%" }}
          className="relative max-w-6xl mx-auto"
        >
          <AppWindowMock />

          {/* Cartes flottantes en parallaxe */}
          <motion.div style={{ y: fastY }} className="hidden sm:block absolute -left-2 sm:-left-6 lg:-left-16 top-[18%] w-[190px] sm:w-[250px] origin-top-left scale-[0.8] sm:scale-100 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-xl p-3.5 shadow-lift" aria-hidden="true">
            <div className="flex items-center gap-2.5">
              <span className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-coral-400 to-purple-500 text-white text-xs font-bold flex items-center justify-center">
                LM<BadgeCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-sky-400 fill-ink-900" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{t("landing.mock.name")}</p>
                <p className="text-[11px] text-white/55 truncate">{t("landing.mock.meta")}</p>
              </div>
              <span className="ml-auto font-display text-xl font-extrabold text-lime-300">94%</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ delay: 1.6, duration: 1.2, ease: EASE }} className="h-full rounded-full bg-gradient-to-r from-brand-400 to-lime-300" />
            </div>
          </motion.div>

          <motion.div style={{ y: slowY }} className="absolute -right-2 sm:-right-6 lg:-right-14 bottom-[12%] w-[210px] sm:w-[270px] origin-bottom-right scale-[0.8] sm:scale-100 rounded-2xl bg-white text-gray-900 p-3.5 shadow-lift flex items-center gap-3" aria-hidden="true">
            <span className="w-10 h-10 rounded-xl bg-lime-300 flex items-center justify-center shrink-0"><CalendarClock className="w-5 h-5" /></span>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{t("landing.mock.session")}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Video className="w-3 h-3" /> {t("landing.mock.sessionWhen")}</p>
            </div>
          </motion.div>

          <motion.div style={{ y: fastY }} className="hidden sm:flex absolute right-[18%] -top-6 items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold px-4 py-2 shadow-glow" aria-hidden="true">
            {t("landing.story.accepted")}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
