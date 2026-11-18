import React from "react";
import { Check } from "lucide-react";

// Briques visuelles des paramètres : sections en cartes, lignes « icône · texte · réglage »
// (inspiré des réglages iOS / Linear / Vercel) et miniatures de thème.

// Couleurs des pastilles d'icône
export const TONES = {
  brand: "bg-brand-500/10 text-brand-600 dark:bg-brand-400/15 dark:text-brand-300",
  sky: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300",
  lime: "bg-lime-400/25 text-lime-700 dark:bg-lime-300/15 dark:text-lime-300",
  coral: "bg-coral-500/10 text-coral-600 dark:bg-coral-400/15 dark:text-coral-300",
  purple: "bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-300",
  amber: "bg-amber-400/20 text-amber-700 dark:bg-amber-300/15 dark:text-amber-300",
  red: "bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-300",
  gray: "bg-gray-500/10 text-gray-600 dark:bg-white/10 dark:text-gray-300",
};

export function IconTile({ icon: Icon, tone = "brand", className = "" }) {
  return (
    <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${TONES[tone]} ${className}`}>
      <Icon className="w-[18px] h-[18px]" />
    </span>
  );
}

export function SettingsSection({ title, desc, children, danger = false, className = "" }) {
  return (
    <section className={className}>
      {(title || desc) && (
        <header className="mb-3 px-1">
          {title && <h2 className={`font-display text-lg font-bold ${danger ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>{title}</h2>}
          {desc && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>}
        </header>
      )}
      <div className={`rounded-2xl border bg-white dark:bg-ink-900 shadow-soft overflow-hidden divide-y ${
        danger
          ? "border-red-200 dark:border-red-500/25 divide-red-100 dark:divide-red-500/15"
          : "border-gray-200/70 dark:border-ink-700 divide-gray-100 dark:divide-ink-800"
      }`}>
        {children}
      </div>
    </section>
  );
}

// Une ligne de réglage. `htmlFor` relie le titre à l'interrupteur (clic sur le texte = bascule).
export function SettingRow({ icon, tone, title, desc, children, htmlFor, muted = false }) {
  const Title = htmlFor ? "label" : "p";
  return (
    <div className={`flex items-center gap-4 px-4 sm:px-5 py-4 ${muted ? "opacity-60" : ""}`}>
      {icon && <IconTile icon={icon} tone={tone} />}
      <div className="flex-1 min-w-0">
        <Title htmlFor={htmlFor} className={`block font-semibold text-[15px] text-gray-900 dark:text-gray-100 ${htmlFor ? "cursor-pointer" : ""}`}>{title}</Title>
        {desc && <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{desc}</div>}
      </div>
      {children && <div className="shrink-0 flex items-center gap-2">{children}</div>}
    </div>
  );
}

// Miniature de l'interface (barre latérale, bandeau, cartes) dans un thème donné
function MiniApp({ dark }) {
  const c = dark
    ? { bg: "#0D0E1A", side: "#171828", card: "#1D1E30", line: "#2A2B42", text: "#3D3E58" }
    : { bg: "#F7F7FB", side: "#FFFFFF", card: "#FFFFFF", line: "#E8E8F2", text: "#D9D9E8" };
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
      <rect width="160" height="100" fill={c.bg} />
      <rect x="6" y="6" width="38" height="88" rx="7" fill={c.side} stroke={c.line} />
      <rect x="12" y="13" width="9" height="9" rx="3" fill="#6438F5" />
      <rect x="24" y="15" width="15" height="4" rx="2" fill={c.text} />
      <rect x="11" y="30" width="28" height="7" rx="3.5" fill="#6438F5" />
      {[42, 52, 62].map((y) => <rect key={y} x="13" y={y} width="22" height="4" rx="2" fill={c.text} />)}
      <rect x="50" y="6" width="104" height="26" rx="7" fill="url(#mini-g)" />
      <rect x="57" y="13" width="40" height="5" rx="2.5" fill="#ffffff" opacity=".9" />
      <rect x="57" y="21" width="26" height="3.5" rx="1.75" fill="#ffffff" opacity=".55" />
      <rect x="50" y="38" width="50" height="56" rx="7" fill={c.card} stroke={c.line} />
      <rect x="104" y="38" width="50" height="56" rx="7" fill={c.card} stroke={c.line} />
      <rect x="56" y="45" width="12" height="12" rx="4" fill="#DCF46B" />
      <rect x="110" y="45" width="12" height="12" rx="4" fill="#FF8A66" />
      {[62, 70].map((y) => <React.Fragment key={y}><rect x="56" y={y} width="34" height="4" rx="2" fill={c.text} /><rect x="110" y={y} width="34" height="4" rx="2" fill={c.text} /></React.Fragment>)}
      <defs><linearGradient id="mini-g" x1="0" x2="1"><stop offset="0" stopColor="#7A55FF" /><stop offset="1" stopColor="#B83DF5" /></linearGradient></defs>
    </svg>
  );
}

export function ThemeCard({ value, label, desc, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(value)}
      className={`group relative text-left rounded-2xl p-2 border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        selected ? "border-brand-500 bg-brand-50/60 dark:bg-brand-500/10 shadow-glow" : "border-gray-200/80 dark:border-ink-700 bg-white dark:bg-ink-900 hover:border-gray-300 dark:hover:border-ink-600"
      }`}
    >
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 transition-transform group-hover:scale-[1.015]">
        {value === "system" ? (
          <>
            <div className="absolute inset-0"><MiniApp dark={false} /></div>
            <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]"><MiniApp dark /></div>
          </>
        ) : <MiniApp dark={value === "dark"} />}
      </div>
      <div className="flex items-center gap-2 px-2 pt-3 pb-1.5">
        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-ink-600"}`}>
          {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
        </span>
        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{label}</span>
      </div>
      {desc && <p className="px-2 pb-1 text-xs text-gray-500 dark:text-gray-400">{desc}</p>}
    </button>
  );
}
