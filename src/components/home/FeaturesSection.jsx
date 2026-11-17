import React from "react";
import { Target, MessageCircle, PenTool, Users, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout de i18n

// Les ids pointent vers features.items.<id> dans i18n.js.
// "filters" et "requests" remplacent "goals" et "matching" : l'ancien texte promettait
// un filtre par examen/chapitre et un algorithme de matching qui n'existent pas dans Search.jsx.
const features = [
  { id: "filters", icon: Target, color: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  { id: "chat", icon: MessageCircle, color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  { id: "whiteboard", icon: PenTool, color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
  { id: "requests", icon: Users, color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
  { id: "schedule", icon: Clock, color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  { id: "subjects", icon: BookOpen, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 bg-white dark:bg-[#131314] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-gray-100 dark:border-[#333537] bg-white dark:bg-[#1e1f20] hover:border-gray-200 dark:hover:border-[#4a4c4f] hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t(`features.items.${feature.id}.title`)}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {t(`features.items.${feature.id}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}