import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Chaque mot passe de transparent à blanc au fil du défilement.
function Word({ children, progress, range, accent }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={`inline-block mr-[0.25em] ${accent ? "text-gradient" : ""}`}>
      {children}
    </motion.span>
  );
}

export default function Manifesto() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = t("landing.manifesto").split(" ");
  // La dernière phrase (nom de la marque) est mise en couleur
  const brandIndex = words.findIndex((w) => w.startsWith("BuddyEtude"));

  return (
    <section id="manifesto" className="relative px-4 sm:px-6 py-28 sm:py-40 scroll-mt-10">
      <p ref={ref} className="max-w-5xl mx-auto font-display text-[1.9rem] leading-[1.15] sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight text-white">
        {words.map((w, i) => {
          const start = i / words.length;
          return reduce ? (
            <span key={i} className={`mr-[0.25em] ${brandIndex >= 0 && i >= brandIndex ? "text-gradient" : ""}`}>{w}</span>
          ) : (
            <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} accent={brandIndex >= 0 && i >= brandIndex}>{w}</Word>
          );
        })}
      </p>
    </section>
  );
}
