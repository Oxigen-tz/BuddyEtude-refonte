import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, PenTool, Users } from "lucide-react"; 
import { useAuth } from "@/lib/AuthContext"; 
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function HeroSection() {
  const { user, loginWithGoogle } = useAuth(); 
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fonction pour gérer la connexion et la redirection de manière fluide
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/Dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
    }
  };

  // État pour stocker le nombre réel d'étudiants inscrits
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    // Écoute en temps réel des profils complets dans Firestore
    const q = query(collection(db, "users"), where("profile_complete", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudentCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
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
            <PenTool className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/90 font-medium">{t('hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {t('hero.title1')}
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
              {t('hero.title_highlight')}
            </span>
            <br />
            {t('hero.title2')}
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle_part1')} 
            <strong className="text-white font-semibold">{t('hero.subtitle_bold')}</strong>
            {t('hero.subtitle_part2')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link to="/Dashboard">
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-base px-8 py-6 rounded-xl shadow-xl shadow-indigo-900/20 group"
                >
                  {t('hero.btn_dashboard')}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={handleLogin}
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-base px-8 py-6 rounded-xl shadow-xl shadow-indigo-900/20 group"
              >
                {t('hero.btn_start')}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>

          {/* Badge social proof avec le nombre réel d'étudiants */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-indigo-500/30 flex items-center justify-center text-white">
              <Users className="w-4 h-4 text-indigo-200" />
            </div>
            <p className="text-sm font-medium text-indigo-100">
              Rejoins déjà <strong className="text-white font-bold">{studentCount} étudiants</strong> actifs sur la plateforme !
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "100%", labelKey: "free" },
            { value: "0ms", labelKey: "latency" },
            { value: "∞", labelKey: "subjects" },
          ].map((stat) => (
            <div key={stat.labelKey} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-indigo-200 mt-1">{t(`hero.stats.${stat.labelKey}`)}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}