import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading, { reveal } from "./SectionHeading";
import { FAQ } from "@/seo/site";

// Questions fréquentes : mêmes textes que les données structurées FAQPage (src/seo/site.js)
export default function FaqSection() {
  const { t, i18n } = useTranslation();
  const items = FAQ[i18n.language?.startsWith("en") ? "en" : "fr"];
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative px-4 sm:px-6 py-24 sm:py-32">
      <div className="max-w-3xl mx-auto">
        <SectionHeading dark eyebrow={t("landing.faq.eyebrow")} title={t("landing.faq.title")} subtitle={t("landing.faq.subtitle")} />
        <motion.ul {...reveal(0.1)} className="space-y-3">
          {items.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <li key={q} className={`rounded-2xl border transition-colors ${isOpen ? "border-brand-400/40 bg-white/[0.06]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"}`}>
                <h3>
                  <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} aria-controls={`faq-${i}`}
                    className="w-full flex items-center gap-4 text-left px-5 sm:px-6 py-5 font-display text-lg font-bold text-white">
                    <span className="flex-1">{q}</span>
                    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-lime-300 text-gray-900 rotate-45" : "bg-white/10 text-white"}`}>
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                </h3>
                {/* Le texte reste dans la page même replié : lisible par les moteurs */}
                <AnimatePresence initial={false}>
                  <motion.div id={`faq-${i}`} key="a" initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden" aria-hidden={!isOpen}>
                    <p className="px-5 sm:px-6 pb-5 -mt-1 text-white/70 leading-relaxed">{a}</p>
                  </motion.div>
                </AnimatePresence>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
