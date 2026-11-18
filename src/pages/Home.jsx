import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturesSection from "../components/home/FeaturesSection";
import MentorSection from "../components/home/MentorSection";
import SafetySection from "../components/home/SafetySection";
import CTASection from "../components/home/CTASection";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, loginCount } = useAuth();
  const navigate = useNavigate();

  // Connexion faite depuis l'accueil (fenêtre de connexion) → tableau de bord.
  // Un utilisateur déjà connecté qui revient sur l'accueil n'est pas redirigé.
  const initialLoginCount = useRef(loginCount);
  useEffect(() => {
    if (user && loginCount !== initialLoginCount.current) navigate("/Dashboard");
  }, [user, loginCount, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-300">
      <HomeNavbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <MentorSection />
        <SafetySection />
        <CTASection />
      </main>
    </div>
  );
}
