import React from "react";
import { motion } from "framer-motion";
import { useLiteMotion } from "@/hooks/useLiteMotion";

// Apparition douce d'un élément quand il entre à l'écran (cartes, listes).
// `index` décale légèrement chaque élément d'une grille pour un effet en cascade.
export default function Reveal({ children, index = 0, className = "" }) {
  // Téléphone, tablette ou animations réduites : affiché directement
  const reduce = useLiteMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
