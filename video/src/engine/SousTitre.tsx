// Phrase courte centrée en haut de l'écran, qui change toutes les 2-3 s.
// Toujours dans la zone sûre TikTok : rien dans les 15 % du haut et du bas, 180 px libres à droite.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as chargerTitre } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as chargerTexte } from "@remotion/google-fonts/PlusJakartaSans";
import { C } from "./palette";

export const { fontFamily: POLICE_TITRE } = chargerTitre("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
export const { fontFamily: POLICE_TEXTE } = chargerTexte("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

/** Zone sûre (en px, sur 1080×1920). */
export const ZONE = { haut: 288, bas: 1920 - 288, gauche: 72, droite: 1080 - 180 } as const;

export type Phrase = {
  /** Début et fin, en secondes. */
  de: number;
  a: number;
  /** Texte ; entourer un mot de *astérisques* pour le mettre en couleur. */
  texte: string;
};

const morceaux = (texte: string) =>
  texte.split(/(\*[^*]+\*)/g).filter(Boolean).map((m, i) =>
    m.startsWith("*") ? (
      <span key={i} style={{ color: C.citron }}>
        {m.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{m}</span>
    ),
  );

export const SousTitre: React.FC<{ phrases: Phrase[]; y?: number }> = ({ phrases, y = ZONE.haut + 20 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = phrases.find((ph) => t >= ph.de && t < ph.a);
  if (!p) return null;
  const local = f - p.de * fps;
  const entree = spring({ frame: local, fps, config: { damping: 14, stiffness: 180, mass: 0.6 } });
  const sortie = interpolate(f, [p.a * fps - 5, p.a * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          left: ZONE.gauche,
          width: ZONE.droite - ZONE.gauche,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(entree * 1.4, 1) * sortie,
          transform: `translateY(${(1 - entree) * 26}px) scale(${0.92 + entree * 0.08})`,
        }}
      >
        <div
          style={{
            fontFamily: POLICE_TITRE,
            fontWeight: 800,
            fontSize: 66,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: C.texte,
            textAlign: "center",
            textShadow: "0 4px 0 rgba(8,10,30,.55), 0 0 30px rgba(8,10,30,.85), 0 0 60px rgba(8,10,30,.6)",
            textWrap: "balance",
          }}
        >
          {morceaux(p.texte)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Grain léger + vignette, par-dessus tout, pour le côté « cinéma ». */
export const Finition: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse 75% 60% at 50% 48%, transparent 55%, rgba(4,6,20,.55) 100%)",
    }}
  />
);
