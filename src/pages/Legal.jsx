import React from "react";
import { Scale } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

// Données d'identification : elles ne se traduisent pas, elles restent donc hors de i18n.js
const PUBLISHER = {
  name: "Charles BERTREUX",
  address: "13 rue du chanoine joseph mahé, 56000 Vannes",
  email: "contact@buddyetude.com",
};

const HOST = {
  name: "Vercel Inc.",
  address: "440 N Barranca Ave #4133, Covina, CA 91723",
  website: "https://vercel.com",
};

export default function Legal() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
          <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("legal.title")}</h1>
      </div>

      <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 shadow-sm space-y-8 text-gray-700 dark:text-gray-300">

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("legal.publisher.title")}</h2>
          <p>
            <Trans i18nKey="legal.publisher.intro" components={{ bold: <strong /> }} /><br/>
            {PUBLISHER.name}<br/>
            {PUBLISHER.address}<br/>
            {t("legal.publisher.email")} : {PUBLISHER.email}<br/>
            {t("legal.publisher.director")} : {PUBLISHER.name}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("legal.hosting.title")}</h2>
          <p>
            {t("legal.hosting.intro")}<br/>
            {HOST.name}<br/>
            {HOST.address}, {t("legal.hosting.country")}<br/>
            {t("legal.hosting.website")} : {HOST.website}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("legal.terms.title")}</h2>
          <p className="mb-2"><strong>{t("legal.terms.purposeLabel")}</strong> {t("legal.terms.purpose")}</p>
          <p className="mb-2"><strong>{t("legal.terms.userLabel")}</strong> {t("legal.terms.user")}</p>
          <p><strong>{t("legal.terms.moderationLabel")}</strong> {t("legal.terms.moderation")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("legal.ip.title")}</h2>
          <p>{t("legal.ip.text")}</p>
        </section>

      </div>
    </div>
  );
}
