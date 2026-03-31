import React from "react";
import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import CTASection from "../components/home/CTASection";
import { GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">BuddyEtude</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} BuddyEtude. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}