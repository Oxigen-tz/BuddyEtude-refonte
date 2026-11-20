import React from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Users, Clock, Lightbulb, Target, Flag, Sunrise, Sun, Moon, CalendarHeart, BookOpen, Sparkles } from "lucide-react";
import { IconTile } from "@/components/settings/SettingsUI";

// Éléments d'affichage communs au profil personnel (Profile) et au profil d'un autre étudiant
// (Student) : bannière, cartes, matières avec niveau, disponibilités, objectifs.

// Niveau dans une matière : nombre de segments remplis et couleurs
export const LEVELS = {
  debutant: { n: 1, bar: "bg-amber-400", text: "text-amber-600 dark:text-amber-300" },
  intermediaire: { n: 2, bar: "bg-brand-500", text: "text-brand-600 dark:text-brand-300" },
  avance: { n: 3, bar: "bg-gradient-to-r from-lime-400 to-lime-500", text: "text-lime-700 dark:text-lime-300" },
};
// Créneaux (valeurs stockées en base, voir ProfileForm) et leur icône
export const SLOTS = [["Matin", Sunrise], ["Après-midi", Sun], ["Soir", Moon], ["Week-end", CalendarHeart]];

export const normalizeSubjects = (subjects) =>
  (subjects || []).map((s) => (typeof s === "string" ? { name: s, level: "intermediaire" } : s));

// Bannière dégradée animée (en-tête de profil)
export function ProfileBanner({ children }) {
  return (
    <div className="relative h-36 sm:h-44 bg-gradient-to-br from-brand-500 via-brand-700 to-purple-700 overflow-hidden">
      <div className="absolute -top-24 right-[10%] w-80 h-80 rounded-full bg-purple-400/50 blur-3xl animate-aurora" />
      <div className="absolute -bottom-32 left-[15%] w-80 h-80 rounded-full bg-coral-400/35 blur-3xl animate-aurora-slow" />
      <div className="absolute -bottom-20 right-[35%] w-56 h-56 rounded-full bg-lime-300/25 blur-3xl animate-aurora" />
      <div className="absolute inset-0 bg-grid opacity-[0.14]" />
      <svg viewBox="0 0 400 120" className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-56 sm:w-80 opacity-25" aria-hidden="true">
        <path d="M10 100 Q 110 -20 200 70 T 390 30" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="200" cy="70" r="16" fill="none" stroke="#DCF46B" strokeWidth="3" strokeDasharray="5 5" />
        <text x="250" y="105" fill="white" style={{ font: "italic 700 26px 'Bricolage Grotesque', serif" }}>∫ x² dx</text>
      </svg>
      {children}
    </div>
  );
}

// Carte de contenu du profil
export function Panel({ icon: Icon, tone, title, aside, children }) {
  return (
    <section className="rounded-2xl bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft p-5 sm:p-6">
      <header className="flex flex-wrap items-center gap-3 mb-4">
        <IconTile icon={Icon} tone={tone} className="w-9 h-9" />
        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        {aside && <div className="ml-auto">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

// Matières, avec une barre de niveau ; `common` : matières partagées avec l'étudiant connecté
export function SubjectsPanel({ subjects, isMentor, advanced = [], common }) {
  const { t } = useTranslation();
  return (
    <Panel icon={BookOpen} tone="purple" title={t("profileUi.subjects")}
      aside={isMentor ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-lime-700 dark:text-lime-300"><Sparkles className="w-3.5 h-3.5" /> {t("profileUi.mentorDesc", { subjects: advanced.join(", ") })}</span> : null}>
      {subjects.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("profileUi.noSubjects")}</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {subjects.map((s) => {
            const lvl = LEVELS[s.level] || LEVELS.intermediaire;
            const shared = common?.has(s.name.toLowerCase());
            return (
              <li key={s.name} className={`rounded-xl border p-3.5 ${shared ? "border-brand-200 dark:border-brand-500/30 bg-brand-50/60 dark:bg-brand-500/10" : "border-gray-100 dark:border-ink-800 bg-gray-50/70 dark:bg-ink-950/50"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{s.name}</span>
                  <span className={`text-xs font-bold ${lvl.text}`}>{t(`profileUi.levels.${s.level || "intermediaire"}`)}</span>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-1.5" aria-hidden="true">
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={`h-1.5 rounded-full ${n <= lvl.n ? lvl.bar : "bg-gray-200 dark:bg-ink-700"}`} />
                  ))}
                </div>
                {shared && <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">{t("student.common")}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

export function GoalsPanel({ goals }) {
  const { t } = useTranslation();
  if (!goals?.length) return null;
  return (
    <Panel icon={Target} tone="coral" title={t("profileUi.goals")}>
      <ul className="flex flex-wrap gap-2">
        {goals.map((g) => (
          <li key={g} className="inline-flex items-center gap-2 rounded-xl bg-coral-50 dark:bg-coral-500/10 text-coral-700 dark:text-coral-300 px-3 py-2 text-sm font-semibold">
            <Flag className="w-3.5 h-3.5" /> {g}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function AvailabilityPanel({ profile }) {
  const { t } = useTranslation();
  return (
    <Panel icon={Clock} tone="sky" title={t("profileUi.availability")}>
      <div className="grid grid-cols-2 gap-2">
        {SLOTS.map(([slot, Icon]) => {
          const on = profile.availability?.includes(slot);
          return (
            <div key={slot} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold border ${
              on ? "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300" : "border-dashed border-gray-200 dark:border-ink-700 text-gray-400 dark:text-gray-600"
            }`}>
              <Icon className="w-4 h-4" /> {t(`profileForm.availabilityLabels.${slot}`, slot)}
            </div>
          );
        })}
      </div>
      {(profile.is_online || profile.is_in_person) && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 mb-2">{t("profileUi.format")}</p>
          <div className="flex flex-wrap gap-2">
            {profile.is_online && <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2.5 py-1.5 text-sm font-semibold"><Monitor className="w-4 h-4" /> {t("profile.online")}</span>}
            {profile.is_in_person && <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2.5 py-1.5 text-sm font-semibold"><Users className="w-4 h-4" /> {t("profile.inperson")}</span>}
          </div>
        </div>
      )}
      {profile.study_style && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 mb-2">{t("profileUi.style")}</p>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-2.5 py-1.5 text-sm font-semibold">
            <Lightbulb className="w-4 h-4" /> {t(`profileForm.styles.${profile.study_style}`, profile.study_style)}
          </span>
        </div>
      )}
    </Panel>
  );
}
