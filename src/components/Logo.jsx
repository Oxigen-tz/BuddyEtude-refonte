import React, { useId } from "react";

// Logo BuddyEtude : deux cercles qui se chevauchent (deux étudiants, un binôme) sur un carré en dégradé.
export function LogoMark({ className = "w-9 h-9" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7A55FF" />
          <stop offset="0.6" stopColor="#6438F5" />
          <stop offset="1" stopColor="#B83DF5" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#lg-${id})`} />
      <rect x="0.5" y="0.5" width="39" height="39" rx="11.5" fill="none" stroke="white" strokeOpacity="0.18" />
      <circle cx="15.5" cy="20" r="7.5" fill="none" stroke="white" strokeWidth="3" />
      <circle cx="24.5" cy="20" r="7.5" fill="none" stroke="#DCF46B" strokeWidth="3" />
      <path d="M20 14.1a7.5 7.5 0 0 1 0 11.8" fill="none" stroke="white" strokeWidth="3" />
    </svg>
  );
}

export default function Logo({ className = "", markClassName = "w-9 h-9", textClassName = "text-lg text-gray-900 dark:text-white" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <span className={`font-display font-extrabold tracking-tight ${textClassName}`}>
        Buddy<span className="text-brand-600 dark:text-brand-300">Etude</span>
      </span>
    </span>
  );
}
