import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenTool, Users, Sparkles } from "lucide-react"; 
import { useAuth } from "@/lib/AuthContext"; 
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const SOCIAL_PROOF_THRESHOLD = 20;

// Capture d'écran réelle à placer dans /public (ex : une session avec un tracé et le chat).
// Si le fichier n'existe pas, le cadre disparaît tout seul.
const PREVIEW_IMAGE = "/whiteboard-preview.png";

export default function HeroSection() {
  const { user, loginWithGoogle } = useAuth(); 
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/Dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
    }
  };

  const [studentCount, setStudentCount] = useState(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // On lit un compteur public (stats/public.studentCount) plutôt que de compter la collection
    // "users" : les règles Firestore interdisent (à juste titre) de lister les profils sans être
    // connecté, donc le comptage échouait en 403 pour tous les visiteurs de l'accueil.
    // Le compteur est incrémenté par Profile.jsx quand un profil est complété pour la première fois.
    getDoc(doc(db, "stats", "public"))
      .then((snap) => {
        if (!cancelled) setStudentCount(snap.exists() ? Number(snap.data().studentCount) || 0 : 0);
      })
      .catch((error) => {
        // Lecture refusée ou réseau indisponible : on affiche le badge "lancement",
        // qui n'avance aucun chiffre.
        console.warn("Compteur d'étudiants indisponible :", error);
        if (!cancelled) setStudentCount(0);
      });

    return () => { cancelled = true; };
  }, []);

  const showRealCount = studentCount !== null && studentCount >= SOCIAL_PROOF_THRESHOLD;
  const showEarlyBadge = studentCount !== null && studentCount < SOCIAL_PROOF_THRESHOLD;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-300 rounded-full blur-3xl" />
      </div>

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

          {showRealCount && (
            <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-500/30 flex items-center justify-center text-white">
                <Users className="w-4 h-4 text-indigo-200" />
              </div>
              <p className="text-sm font-medium text-indigo-100">
                <Trans
                  i18nKey="hero.social.active"
                  values={{ count: studentCount }}
                  components={{ bold: <strong className="text-white font-bold" /> }}
                />
              </p>
            </div>
          )}

          {showEarlyBadge && (
            <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-500/30 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </div>
              <p className="text-sm font-medium text-indigo-100">
                <Trans
                  i18nKey="hero.social.early"
                  components={{ bold: <strong className="text-white font-bold" /> }}
                />
              </p>
            </div>
          )}
        </motion.div>

        {/* Aperçu réel du produit : remplace les anciennes "stats" (100% / Live) qui n'en étaient pas */}
        {!previewFailed && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl shadow-indigo-950/40 backdrop-blur-sm">
              <img
                src={PREVIEW_IMAGE}
                alt={t('hero.previewAlt')}
                loading="lazy"
                onError={() => setPreviewFailed(true)}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}