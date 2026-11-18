import React from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const CONTACT_EMAIL = "contact@buddyetude.com";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("privacy.title")}</h1>
      </div>

      <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 shadow-sm space-y-8 text-gray-700 dark:text-gray-300">

        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {t("privacy.intro")}
        </p>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("privacy.collected.title")}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>{t("privacy.collected.identityLabel")}</strong> {t("privacy.collected.identity")}</li>
            <li><strong>{t("privacy.collected.profileLabel")}</strong> {t("privacy.collected.profile")}</li>
            <li><strong>{t("privacy.collected.usageLabel")}</strong> {t("privacy.collected.usage")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("privacy.use.title")}</h2>
          <p>
            <Trans i18nKey="privacy.use.text" components={{ bold: <strong /> }} />
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("privacy.retention.title")}</h2>
          <p>{t("privacy.retention.text")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("privacy.rights.title")}</h2>
          <p>
            <Trans i18nKey="privacy.rights.text" values={{ email: CONTACT_EMAIL }} components={{ bold: <strong /> }} />
          </p>
        </section>

      </div>
    </div>
  );
}
