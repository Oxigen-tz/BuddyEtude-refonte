import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLiteMotion } from "@/hooks/useLiteMotion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogoMark } from "@/components/Logo";

// Appel final : la carte s'agrandit et s'arrondit moins à mesure qu'elle arrive à l'écran.
export default function CTASection() {
  const { user, openLogin } = useAuth();
  const { t } = useTranslation();
  const ref = useRef(null);
  const reduce = useLiteMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [40, 40] : [80, 40]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-90, 0]);

  const button = (
    <Button size="lg" onClick={user ? undefined : openLogin} className="h-14 px-8 rounded-2xl text-base bg-white text-brand-700 hover:bg-brand-50 shadow-lift group">
      {user ? t("cta.buttonLoggedIn") : t("cta.button")}
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </Button>
  );

  return (
    <section ref={ref} className="pt-10 pb-24 sm:pb-32 px-4 sm:px-6">
      <motion.div style={{ scale, borderRadius: radius }} className="relative max-w-6xl mx-auto overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 px-6 py-20 sm:p-24 text-center text-white">
        <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:22px_22px] mask-radial" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-coral-400/40 blur-3xl animate-aurora" />
        <div className="absolute -bottom-24 -right-10 w-96 h-96 rounded-full bg-lime-300/30 blur-3xl animate-aurora-slow" />
        <div className="relative">
          <motion.div style={{ rotate: logoRotate }} className="w-16 h-16 mx-auto mb-8"><LogoMark className="w-16 h-16 drop-shadow-xl" /></motion.div>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.02] max-w-3xl mx-auto">{t("cta.title")}</h2>
          <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">{t("cta.subtitle")}</p>
          <div className="mt-10">{user ? <Link to="/Dashboard">{button}</Link> : button}</div>
        </div>
      </motion.div>
    </section>
  );
}
