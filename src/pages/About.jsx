import React from "react";
import { GraduationCap, Heart, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

const CONTACT_EMAIL = "contact@buddyetude.com";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("about.title")}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t("about.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-500/20">
          <Heart className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("about.origin.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("about.origin.text")}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-500/10 p-8 rounded-3xl border border-purple-100 dark:border-purple-500/20">
          <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("about.mission.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("about.mission.text")}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 rounded-3xl p-8 shadow-sm text-center">
        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("about.join.title")}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          {t("about.join.text")}
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          {t("about.join.button")}
        </a>
      </div>
    </div>
  );
}
