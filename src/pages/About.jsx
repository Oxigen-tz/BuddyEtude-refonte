import React from "react";
import { GraduationCap, Heart, Target } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">À propos de BuddyEtude</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          L'histoire d'un projet né pour résoudre un problème que tous les étudiants connaissent : la solitude face aux révisions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-500/20">
          <Heart className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Notre Origine</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            BuddyEtude a été imaginé et développé par un étudiant. Devant la difficulté de trouver des partenaires motivés pour réviser la veille des partiels, l'idée est née : pourquoi ne pas créer un réseau social dédié uniquement à l'entraide scolaire et au travail de groupe ?
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-500/10 p-8 rounded-3xl border border-purple-100 dark:border-purple-500/20">
          <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Notre Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Notre objectif est simple : faire en sorte qu'aucun étudiant ne se retrouve bloqué seul devant ses cours. Que vous soyez au lycée, en prépa ou à l'université, BuddyEtude vous connecte avec les profils qui complètent vos compétences pour réussir ensemble.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 shadow-sm text-center">
        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rejoignez l'aventure</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          BuddyEtude grandit chaque jour grâce à sa communauté. Si vous avez des suggestions, des idées d'amélioration, ou si vous souhaitez participer au projet, n'hésitez pas à nous contacter !
        </p>
        <a href="mailto:contact@buddyetude.fr" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          Nous écrire
        </a>
      </div>
    </div>
  );
}