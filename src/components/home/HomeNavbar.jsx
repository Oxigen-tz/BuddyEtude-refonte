import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/AuthContext"; // Changé ici
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loginWithGoogle } = useAuth(); // Changé ici

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-lg shadow-sm" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
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
        <div className="flex items-center gap-3">
          {user ? ( // Changé ici
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl px-6">
                Tableau de bord
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={loginWithGoogle} // Changé ici
                className={`font-medium rounded-xl ${
                  scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                Connexion
              </Button>
              <Button
                onClick={loginWithGoogle} // Changé ici
                className={`font-medium rounded-xl px-6 ${
                  scrolled
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-white text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                Inscription
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}