import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { reveal } from "./SectionHeading";

// Témoignage signé. La section ne s'affiche que si TESTIMONIAL est rempli.
// À remplir UNIQUEMENT avec un vrai retour d'étudiant, recueilli avec son accord
// (prénom, filière et ville tels qu'il accepte de les voir publiés). Jamais de texte inventé.
// Exemple de forme :
//   { quote: { fr: "…", en: "…" }, name: "Prénom", program: { fr: "L2 Droit", en: "2nd-year Law" }, city: "Lyon" }
const TESTIMONIAL = null;

export default function Testimonial() {
  const { i18n } = useTranslation();
  if (!TESTIMONIAL) return null;
  const lang = i18n.language?.startsWith("en") ? "en" : "fr";
  const { quote, name, program, city } = TESTIMONIAL;
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24">
      <motion.figure {...reveal()} className="max-w-3xl mx-auto rounded-[2rem] bg-gradient-to-br from-brand-700/40 to-ink-900 border border-brand-400/20 p-8 sm:p-12">
        <blockquote className="font-display text-2xl sm:text-3xl font-bold leading-snug text-white">« {quote[lang]} »</blockquote>
        <figcaption className="mt-6 text-white/70">
          <span className="font-semibold text-white">{name}</span> · {program[lang]} · {city}
        </figcaption>
      </motion.figure>
    </section>
  );
}
