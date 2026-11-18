import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogoMark } from "@/components/Logo";
import { reveal } from "./SectionHeading";

export default function CTASection() {
  const { user, openLogin } = useAuth();
  const { t } = useTranslation();

  const button = (
    <Button size="lg" onClick={user ? undefined : openLogin} className="h-14 px-8 rounded-2xl text-base bg-white text-brand-700 hover:bg-brand-50 shadow-lift group">
      {user ? t("cta.buttonLoggedIn") : t("cta.button")}
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </Button>
  );

  return (
    <section className="pt-6 pb-20 sm:pb-28 px-4 sm:px-6">
      <motion.div {...reveal()} className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 px-6 py-16 sm:p-20 text-center text-white">
        <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:22px_22px] mask-radial" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-coral-400/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-lime-300/30 blur-3xl" />
        <div className="relative">
          <LogoMark className="w-14 h-14 mx-auto mb-8 drop-shadow-xl" />
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] max-w-2xl mx-auto">{t("cta.title")}</h2>
          <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto">{t("cta.subtitle")}</p>
          <div className="mt-10">{user ? <Link to="/Dashboard">{button}</Link> : button}</div>
        </div>
      </motion.div>
    </section>
  );
}
