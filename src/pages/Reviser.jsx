import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronRight, Lightbulb, Plus } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { saveIntentPath } from "@/lib/intent";
import { SUBJECTS, SUBJECTS_HUB, subjectPath } from "@/seo/subjects";
import PageNotFound from "@/lib/PageNotFound";

// Pages publiques « Réviser <matière> à deux » (/reviser et /reviser/<matière>).
// Contenu en français, tiré de src/seo/subjects.js ; le même texte est pré-rempli dans le HTML
// à la compilation (scripts/vite-plugin-seo.js) pour les moteurs de recherche.

function useFrenchDocument() {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = "fr";
    return () => { document.documentElement.lang = previous; };
  }, []);
}

function Cta({ term }) {
  const { user, openLogin } = useAuth();
  const navigate = useNavigate();
  const target = term ? `/Search?subject=${encodeURIComponent(term)}` : "/Search";
  const go = () => {
    if (user) return navigate(target);
    saveIntentPath(target);
    openLogin();
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <button type="button" onClick={go}
        className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 shadow-glow hover:opacity-95 transition">
        Trouver mon binôme gratuitement <ArrowRight className="w-4 h-4" />
      </button>
      <span className="text-sm text-gray-500 dark:text-gray-400">Gratuit, sans publicité, données hébergées en Europe</span>
    </div>
  );
}

function Breadcrumb({ current }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
      <Link to="/" className="hover:text-brand-600">Accueil</Link>
      <ChevronRight className="w-3.5 h-3.5" />
      {current ? <Link to="/reviser" className="hover:text-brand-600">Réviser par matière</Link> : <span className="text-gray-900 dark:text-white font-medium">Réviser par matière</span>}
      {current && (<><ChevronRight className="w-3.5 h-3.5" /><span className="text-gray-900 dark:text-white font-medium">{current}</span></>)}
    </nav>
  );
}

function SubjectList({ exclude }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {SUBJECTS.filter((s) => s.slug !== exclude).map((s) => (
        <li key={s.slug}>
          <Link to={subjectPath(s.slug)}
            className="group flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-4 py-3.5 hover:border-brand-400 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5" /></span>
            <span className="flex-1 font-semibold text-gray-900 dark:text-white">{s.h1}</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-brand-600 transition" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Hub() {
  return (
    <div className="max-w-3xl mx-auto py-10 sm:py-14">
      <Breadcrumb />
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">{SUBJECTS_HUB.h1}</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{SUBJECTS_HUB.intro}</p>
      <div className="mt-8"><SubjectList /></div>
      <div className="mt-12"><Cta /></div>
    </div>
  );
}

function Subject({ s }) {
  const [open, setOpen] = React.useState(0);
  return (
    <article className="max-w-3xl mx-auto py-10 sm:py-14">
      <Breadcrumb current={s.name} />
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">{s.h1}</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{s.intro}</p>
      <div className="mt-8"><Cta term={s.term} /></div>

      <h2 className="mt-14 font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">3 méthodes pour réviser à deux</h2>
      <ol className="mt-6 space-y-4">
        {s.methods.map(([title, text]) => (
          <li key={title} className="rounded-2xl border border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-5">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-brand-600 dark:text-brand-300 shrink-0" />{title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 p-5 text-gray-700 dark:text-gray-200 leading-relaxed">{s.tools}</p>

      <h2 className="mt-14 font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Questions fréquentes</h2>
      <ul className="mt-6 space-y-3">
        {s.faq.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <li key={q} className="rounded-2xl border border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900">
              <h3>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 text-left px-5 py-4 font-semibold text-gray-900 dark:text-white">
                  <span className="flex-1">{q}</span>
                  <Plus className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`} />
                </button>
              </h3>
              {/* Réponse toujours présente dans la page (lisible par les moteurs), masquée visuellement si repliée */}
              <p className={`px-5 pb-4 -mt-1 text-gray-600 dark:text-gray-300 leading-relaxed ${isOpen ? "" : "hidden"}`}>{a}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-12"><Cta term={s.term} /></div>

      <h2 className="mt-16 font-display text-xl font-bold text-gray-900 dark:text-white">Les autres matières</h2>
      <div className="mt-5"><SubjectList exclude={s.slug} /></div>
    </article>
  );
}

export default function Reviser() {
  const { slug } = useParams();
  useFrenchDocument();
  if (!slug) return <Hub />;
  const s = SUBJECTS.find((x) => x.slug === slug);
  return s ? <Subject s={s} /> : <PageNotFound />;
}
