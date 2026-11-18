import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Instagram, Github } from "lucide-react";
import { createPageUrl } from "@/utils";
import Logo from "@/components/Logo";

function XIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Renseigne ici les vraies adresses de tes comptes. Un réseau dont l'URL est vide n'est pas affiché.
const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", url: "", Icon: Instagram },
  { id: "x", label: "X", url: "", Icon: XIcon },
  { id: "github", label: "GitHub", url: "", Icon: Github },
];

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
