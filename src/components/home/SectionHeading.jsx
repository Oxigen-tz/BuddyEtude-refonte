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

// Pas de surtitre en petites capitales : le titre porte la section.
export default function SectionHeading({ title, subtitle, align = "center", dark = false }) {
  const centered = align === "center";
  return (
    <motion.div {...reveal()} className={`${centered ? "text-center mx-auto" : ""} max-w-2xl mb-12 sm:mb-16`}>
      <h2 className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] ${dark ? "text-white" : "text-gray-900 dark:text-white"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-white/70" : "text-gray-600 dark:text-gray-400"}`}>{subtitle}</p>
      )}
    </motion.div>
  );
}
