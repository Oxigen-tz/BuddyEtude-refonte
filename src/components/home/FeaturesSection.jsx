import React from "react";
import { Target, MessageCircle, PenTool, Users, Clock, BookOpen } from "lucide-react"; // Remplacement de Rocket par PenTool
import { motion } from "framer-motion";

const features = [
  {
    icon: Target,
    title: "Objectifs communs",
    description: "Trouvez un partenaire qui prépare les mêmes examens ou bloque sur les mêmes chapitres.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: MessageCircle,
    title: "Chat intégré",
    description: "Échangez instantanément, partagez vos doutes et préparez vos sessions en amont.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    // C'est ici qu'on met la magie en avant ! 🪄
    icon: PenTool,
    title: "Tableau blanc temps réel",
    description: "Dessinez, écrivez et résolvez des problèmes ensemble sur un espace de travail collaboratif fluide.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Users,
    title: "Matching intelligent",
    description: "Ne perdez plus de temps : notre algorithme filtre par niveau, matière et disponibilité.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Clock,
    title: "Sessions planifiées",
    description: "Organisez votre emploi du temps, fixez des rendez-vous et tenez vos engagements.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BookOpen,
    title: "Toutes les matières",
    description: "Mathématiques, droit, médecine, langues... Il y a forcément un binôme pour votre spécialité.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Étudier à deux, avec les bons outils
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            BuddyEtude n'est pas qu'un simple annuaire de rencontre étudiante, c'est une plateforme de travail complète.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}