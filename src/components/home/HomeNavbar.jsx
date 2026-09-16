import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Globe } from "lucide-react"; 
import { useAuth } from "@/lib/AuthContext"; 
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "react-i18next"; 

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loginWithGoogle } = useAuth(); 
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const isFr = i18n.language.startsWith('fr');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-lg shadow-sm" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${
            scrolled ? "bg-indigo-600" : "bg-white/20 backdrop-blur-sm"
          }`}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${
            scrolled ? "text-gray-900" : "text-white"
          }`}>
            BuddyEtude
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* --- BOUTON LANGUE PLUS INTUITIF --- */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm transition-colors ${
              scrolled 
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" 
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            <Globe className="w-4 h-4" />
            {isFr ? "EN" : "FR"}
          </button>
          {/* ----------------------------- */}

          {user ? ( 
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full px-6">
                {isFr ? "Tableau de bord" : "Dashboard"}
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={loginWithGoogle} 
                className={`font-medium rounded-full ${
                  scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {isFr ? "Connexion" : "Login"}
              </Button>
              
              <Button
                onClick={loginWithGoogle} 
                className={`font-medium rounded-full px-6 ${
                  scrolled
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-white text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                {isFr ? "Inscription" : "Sign Up"}
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}