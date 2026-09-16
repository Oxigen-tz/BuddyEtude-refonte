import React from "react";
import { Target, MessageCircle, PenTool, Users, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout de i18n

// On remplace les titres/descriptions par des clés (id) qui pointent vers i18n
const features = [
  { id: "goals", icon: Target, color: "bg-red-50 text-red-600" },
  { id: "chat", icon: MessageCircle, color: "bg-blue-50 text-blue-600" },
  { id: "whiteboard", icon: PenTool, color: "bg-purple-50 text-purple-600" },
  { id: "matching", icon: Users, color: "bg-green-50 text-green-600" },
  { id: "schedule", icon: Clock, color: "bg-amber-50 text-amber-600" },
  { id: "subjects", icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
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
              className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t(`features.items.${feature.id}.title`)}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {t(`features.items.${feature.id}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}