import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext"; 
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CTASection() {
  const { user, loginWithGoogle } = useAuth(); // 🛠️ CORRIGÉ : on récupère aussi `user`
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>

            {/* 🛠️ CORRIGÉ : bouton conditionnel selon l'état de connexion */}
            {user ? (
              <Link to="/Dashboard">
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-base px-8 py-6 rounded-xl group"
                >
                  {t('cta.buttonLoggedIn')}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={loginWithGoogle} 
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-base px-8 py-6 rounded-xl group"
              >
                {t('cta.button')}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}