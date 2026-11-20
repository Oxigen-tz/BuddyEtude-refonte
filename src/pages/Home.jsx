import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import Manifesto from "../components/home/Manifesto";
import HowItWorks from "../components/home/HowItWorks";
import FeaturesSection from "../components/home/FeaturesSection";
import MentorSection from "../components/home/MentorSection";
import SafetySection from "../components/home/SafetySection";
import CTASection from "../components/home/CTASection";
import FaqSection from "../components/home/FaqSection";
import { useAuth } from "@/lib/AuthContext";

// Page d'accueil toujours en thème sombre (classe "dark" locale), quel que soit le thème choisi
// pour l'application. "overflow-x-clip" (et non "hidden") pour ne pas casser les sections fixées.
export default function Home() {
  const { user, loginCount } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Connexion faite depuis l'accueil (fenêtre de connexion) → tableau de bord.
  const initialLoginCount = useRef(loginCount);
  useEffect(() => {
    if (user && loginCount !== initialLoginCount.current) navigate("/Dashboard");
  }, [user, loginCount, navigate]);

  return (
    <div className="home-root dark min-h-screen bg-ink-950 text-white overflow-x-clip">
      <motion.div style={{ scaleX: progress }} className="fixed top-0 inset-x-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-brand-400 via-purple-400 to-lime-300" />
      <HomeNavbar />
      <main>
        <HeroSection />
        <Manifesto />
        <HowItWorks />
        <FeaturesSection />
        <MentorSection />
        <SafetySection />
        <FaqSection />
        <CTASection />
      </main>
    </div>
  );
}
