import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Instagram, Twitter, Github } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1e1f20] border-t border-gray-100 dark:border-[#333537] pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Marque & Histoire */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">BuddyEtude</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              Créé par un étudiant, pour les étudiants. Notre mission est de rendre l'entraide académique accessible à tous, partout en France, grâce à des outils collaboratifs puissants.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Plateforme</h3>
            <ul className="space-y-3">
              <li><Link to={createPageUrl("About")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">À propos de nous</Link></li>
              <li><Link to={createPageUrl("Search")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">Trouver un binôme</Link></li>
              {/* Le système de parrainage mentionné dans l'audit (visuel pour l'instant) */}
              <li><span className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors cursor-pointer flex items-center gap-2">Programme de parrainage <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Bientôt</span></span></li>
            </ul>
          </div>

          {/* Contact & Légal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support & Légal</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@buddyetude.fr" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> contact@buddyetude.fr
                </a>
              </li>
              <li><Link to={createPageUrl("Legal")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">Mentions Légales & CGU</Link></li>
              <li><Link to={createPageUrl("Privacy")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">Politique de Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-[#333537] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} BuddyEtude. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-sm text-gray-500 dark:text-gray-400">Systèmes opérationnels</span>
          </div>
        </div>
      </div>
    </footer>
  );
}