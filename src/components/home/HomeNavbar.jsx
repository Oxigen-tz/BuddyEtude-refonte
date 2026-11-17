import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Globe } from "lucide-react"; 
import { useAuth } from "@/lib/AuthContext"; 
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "react-i18next"; 

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loginWithGoogle } = useAuth(); 
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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

  // Avec Google comme seule méthode d'authentification, "Connexion" et "Inscription"
  // déclenchent la même action. On la centralise : try/catch + redirection vers le tableau de bord.
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/Dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
    }
  };

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
          
          {/* --- BOUTON LANGUE --- */}
          <button
            onClick={toggleLanguage}
            aria-label={t('home.nav.switchLanguage')}
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
                {t('home.nav.dashboard')}
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleLogin} 
                className={`font-medium rounded-full ${
                  scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {t('home.nav.login')}
              </Button>
              
              <Button
                onClick={handleLogin} 
                className={`font-medium rounded-full px-6 ${
                  scrolled
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-white text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                {t('home.nav.signup')}
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}