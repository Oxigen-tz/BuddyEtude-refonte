import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Mail, Instagram, Github } from "lucide-react";
import { createPageUrl } from "@/utils";

function XIcon({ className = "w-5 h-5" }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      aria-hidden="true" 
      className={`fill-current ${className}`}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();

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
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><XIcon className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t("footer.platform")}</h3>
            <ul className="space-y-3">
              <li><Link to={createPageUrl("About")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">{t("footer.about")}</Link></li>
              <li><Link to={createPageUrl("Search")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">{t("footer.findBuddy")}</Link></li>
              <li>
                <span className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors cursor-pointer flex items-center gap-2">
                  {t("footer.referral")}
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{t("footer.soon")}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Légal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t("footer.support")}</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@buddyetude.fr" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> contact@buddyetude.fr
                </a>
              </li>
              <li><Link to={createPageUrl("Legal")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">{t("footer.legal")}</Link></li>
              <li><Link to={createPageUrl("Privacy")} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 text-sm transition-colors">{t("footer.privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-[#333537] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} BuddyEtude. {t("footer.rights")}.
          </p>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-sm text-gray-500 dark:text-gray-400">{t("footer.systemsOperational")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}