import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Instagram } from "lucide-react";
import { createPageUrl } from "@/utils";
import Logo from "@/components/Logo";
import { SupportLink } from "@/components/SupportCard";
import { SOCIAL } from "@/seo/site";

function TikTokIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

// Adresses des comptes : src/seo/site.js (SOCIAL), aussi déclarées à Google
const ICONS = { tiktok: TikTokIcon, instagram: Instagram };
const SOCIAL_LINKS = SOCIAL.map((s) => ({ ...s, Icon: ICONS[s.id] }));

const linkClass = "text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors";

export default function Footer() {
  const { t } = useTranslation();
  const visibleSocials = SOCIAL_LINKS.filter((social) => social.url);

  return (
    <footer className="relative border-t border-gray-200/80 dark:border-ink-700 bg-white/60 dark:bg-ink-925 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">{t("footer.tagline")}</p>
            {visibleSocials.length > 0 && (
              <div className="flex gap-2 mt-6">
                {visibleSocials.map(({ id, label, url, Icon }) => (
                  <a key={id} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 rounded-xl border border-gray-200 dark:border-ink-700 flex items-center justify-center text-gray-500 hover:text-brand-600 hover:border-brand-200 transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-900 dark:text-white mb-4">{t("footer.platform")}</h3>
            <ul className="space-y-3">
              <li><Link to={createPageUrl("About")} className={linkClass}>{t("footer.about")}</Link></li>
              <li><Link to={createPageUrl("Search")} className={linkClass}>{t("footer.findBuddy")}</Link></li>
              <li><Link to="/reviser" className={linkClass}>{t("footer.subjects")}</Link></li>
              <li><Link to={createPageUrl("Etablissements")} className={linkClass}>{t("footer.schools")}</Link></li>
              <li><SupportLink className={linkClass} /></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-900 dark:text-white mb-4">{t("footer.support")}</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@buddyetude.com" className={`${linkClass} inline-flex items-center gap-2 break-all`}>
                  <Mail className="w-4 h-4 shrink-0" /> contact@buddyetude.com
                </a>
              </li>
              <li><Link to={createPageUrl("Legal")} className={linkClass}>{t("footer.legal")}</Link></li>
              <li><Link to={createPageUrl("Privacy")} className={linkClass}>{t("footer.privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200/80 dark:border-ink-700 flex flex-col sm:flex-row gap-2 justify-between text-sm text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} BuddyEtude. {t("footer.rights")}.</p>
          <p className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-lime-400" /> {t("landing.trust.europe")}
          </p>
        </div>
      </div>
    </footer>
  );
}
