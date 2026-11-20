import React from "react";
import { motion } from "framer-motion";
import { isLiteDevice } from "@/hooks/useLiteMotion";

// Apparition au défilement. Sur téléphone et tablette : contenu affiché directement (sur certains
// téléphones, l'apparition ne se déclenchait pas et la page restait noire après l'introduction).
const LITE = isLiteDevice();
export const reveal = (delay = 0) => LITE ? {} : ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function SectionHeading({ eyebrow, title, subtitle, align = "center", dark = false }) {
  const centered = align === "center";
  return (
    <motion.div {...reveal()} className={`${centered ? "text-center mx-auto" : ""} max-w-2xl mb-12 sm:mb-16`}>
      {eyebrow && (
        <span className={`inline-block text-xs font-bold uppercase tracking-[0.16em] mb-4 ${dark ? "text-lime-300" : "text-brand-600 dark:text-brand-300"}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] ${dark ? "text-white" : "text-gray-900 dark:text-white"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-white/70" : "text-gray-600 dark:text-gray-400"}`}>{subtitle}</p>
      )}
    </motion.div>
  );
}
