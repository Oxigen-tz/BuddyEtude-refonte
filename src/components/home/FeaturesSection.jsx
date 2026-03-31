import React from "react";
import { Target, MessageCircle, Rocket, Users, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Target,
    title: "Objectifs communs",
    description: "Trouvez quelqu'un qui prépare les mêmes examens ou étudie les mêmes matières.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: MessageCircle,
    title: "Chat intégré",
    description: "Échangez facilement avec votre binôme grâce à la messagerie instantanée.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Rocket,
    title: "Motivation boostée",
    description: "Ne révisez plus seul. L'entraide est la clé pour rester régulier et performant.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Users,
    title: "Matching intelligent",
    description: "Trouvez le binôme parfait grâce à nos filtres par niveau, matière et objectif.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Clock,
    title: "Sessions planifiées",
    description: "Organisez vos sessions d'étude et suivez votre progression ensemble.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BookOpen,
    title: "Toutes les matières",
    description: "Maths, sciences, langues, droit, médecine... Trouvez un binôme pour toute matière.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi utiliser BuddyEtude ?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour étudier efficacement avec un partenaire
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