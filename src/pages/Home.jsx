import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#131314] transition-colors duration-300">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
