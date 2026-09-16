import React from "react";
import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131314] transition-colors duration-300">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}