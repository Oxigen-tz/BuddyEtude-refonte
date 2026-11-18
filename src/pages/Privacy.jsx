import React from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const CONTACT_EMAIL = "contact@buddyetude.com";

// Le contenu est dans i18n.js (privacy.sections) : chaque section a un titre, des paragraphes
// et/ou une liste d'éléments { label, text }.
export default function Privacy() {
  const { t } = useTranslation();
  const sections = t("privacy.sections", { returnObjects: true, email: CONTACT_EMAIL });

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("privacy.title")}</h1>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t("privacy.updated")}</p>

      <div className="bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("privacy.intro")}</p>

        {Array.isArray(sections) && sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            {section.paragraphs?.map((p) => <p key={p} className="mb-3">{p}</p>)}
            {section.items && (
              <ul className="list-disc pl-5 space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}><strong>{item.label}</strong> {item.text}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
