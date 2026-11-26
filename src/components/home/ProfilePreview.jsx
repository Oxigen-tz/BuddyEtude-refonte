import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { loadFirebase, whenIdle, isBot } from "@/firebase/lazy";
import { useAuth } from "@/lib/AuthContext";
import { reveal } from "./SectionHeading";

// « Ils révisent déjà sur BuddyEtude » : aperçu anonymisé de vrais profils, avant l'inscription.
// Données : stats/preview, préparé par la Cloud Function refreshPublicPreview (niveau, matières,
// badge vérifié ; jamais de nom, de photo, de ville ni d'établissement). Rien n'est affiché tant
// qu'il y a moins de 3 profils éligibles, ou si la lecture échoue.
const TONES = ["from-brand-400 to-brand-700", "from-coral-400 to-purple-500", "from-lime-300 to-lime-500", "from-sky-400 to-brand-600"];

export default function ProfilePreview() {
  const { t } = useTranslation();
  const { openLogin } = useAuth();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (isBot()) return undefined;
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      loadFirebase()
        .then(({ firestore, db }) => firestore.getDoc(firestore.doc(db, "stats", "preview")))
        .then((snap) => {
          const list = snap.exists() ? snap.data().profiles : [];
          if (!cancelled && Array.isArray(list) && list.length >= 3) setProfiles(list.slice(0, 6));
        })
        .catch(() => { /* aperçu indisponible : la section reste masquée */ });
    });
    return () => { cancelled = true; cancelIdle(); };
  }, []);

  if (profiles.length < 3) return null;

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div {...reveal()} className="max-w-2xl mb-10">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-white">{t("landing.preview.title")}</h2>
          <p className="mt-4 text-white/60 text-lg leading-relaxed">{t("landing.preview.subtitle")}</p>
        </motion.div>
        <motion.ul {...reveal(0.08)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p, i) => (
            // Téléphone : 3 profils suffisent, la page reste courte
            <li key={i} className={`rounded-2xl bg-white/[0.05] border border-white/10 p-5 ${i >= 3 ? "hidden sm:block" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${TONES[i % TONES.length]} flex items-center justify-center shrink-0`} aria-hidden="true">
                  <UserRound className="w-5 h-5 text-white" />
                  {p.verified && <BadgeCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-sky-400 fill-ink-900" />}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-white">{t("landing.preview.student")}</p>
                  <p className="text-xs text-white/55 truncate">
                    {[p.level, p.verified ? t("landing.preview.verified") : null].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(p.subjects || []).map((s) => (
                  <span key={s.name} className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-white/[0.06] border-white/10 text-white/80">{s.name}</span>
                ))}
              </div>
            </li>
          ))}
        </motion.ul>
        <motion.div {...reveal(0.12)} className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
          <button type="button" onClick={openLogin}
            className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-white/90 transition">
            {t("landing.preview.cta")}
          </button>
          <span className="text-sm text-white/50">{t("landing.preview.note")}</span>
        </motion.div>
      </div>
    </section>
  );
}
