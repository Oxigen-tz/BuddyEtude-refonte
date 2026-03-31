import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext"; 
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import pour la navigation
import { createPageUrl } from "@/utils"; // Import pour l'URL propre

export default function HeroSection() {
  const { user, loginWithGoogle } = useAuth(); // On récupère 'user' en plus ici

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background (Ton design original) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-300 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/90 font-medium">La plateforme d'entraide étudiante #1</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Trouvez votre
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
              binôme d'études
            </span>
            <br />
            idéal
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Progressez ensemble, restez motivés et atteignez vos objectifs académiques. 
            Rejoignez une communauté d'étudiants qui s'entraident.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* LOGIQUE CONDITIONNELLE DU BOUTON */}
            {user ? (
              // Si l'utilisateur est CONNECTÉ
              <Link to={createPageUrl("Dashboard")}>
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-base px-8 py-6 rounded-xl shadow-xl shadow-indigo-900/20 group"
                >
                  Accéder à mon espace
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              // Si l'utilisateur est DÉCONNECTÉ
              <Button
                size="lg"
                onClick={loginWithGoogle}
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-base px-8 py-6 rounded-xl shadow-xl shadow-indigo-900/20 group"
              >
                C'est parti !
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats (Ton design original) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "100%", label: "Gratuit" },
            { value: "24/7", label: "Disponible" },
            { value: "∞", label: "Matières" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-indigo-200 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}