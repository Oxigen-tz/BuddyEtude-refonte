// Éléments de signature BuddyEtude (2D, par-dessus la 3D) :
// - BulleTexte : la phrase du haut arrive comme un message (« … » puis le texte), mots-clés au surligneur ;
// - FinSignature : les deux anneaux du logo s'emboîtent, toujours la même fin, pour être reconnu.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./palette";
import { POLICE_TEXTE, POLICE_TITRE, Phrase, ZONE } from "./SousTitre";

const SAISIE = 7; // images de « … » avant le texte

const Surligne: React.FC<{ texte: string; debut: number }> = ({ texte, debut }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [debut, debut + 8], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span
      style={{
        color: p > 40 ? "#14102e" : "#ffffff",
        padding: "0 .12em",
        margin: "0 -.04em",
        borderRadius: 10,
        backgroundImage: `linear-gradient(${C.citron}, ${C.citron})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p}% 84%`,
        backgroundPosition: "0 60%",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {texte}
    </span>
  );
};

export const BulleTexte: React.FC<{ phrases: Phrase[]; y?: number }> = ({ phrases, y = ZONE.haut + 10 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = phrases.find((ph) => t >= ph.de && t < ph.a);
  if (!p) return null;
  const d = Math.round(p.de * fps);
  const local = f - d;
  const pop = spring({ frame: local, fps, config: { damping: 13, stiffness: 220, mass: 0.5 } });
  const sortie = interpolate(f, [p.a * fps - 4, p.a * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ecrit = local < SAISIE;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: y, left: ZONE.gauche, width: ZONE.droite - ZONE.gauche, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            maxWidth: 780,
            padding: ecrit ? "26px 34px" : "24px 36px 28px",
            borderRadius: 40,
            borderBottomLeftRadius: 10,
            background: "rgba(100,56,245,.94)",
            boxShadow: "0 18px 50px rgba(10,6,40,.55), inset 0 1px 0 rgba(255,255,255,.25)",
            opacity: Math.min(1, pop * 1.5) * sortie,
            transform: `scale(${0.6 + pop * 0.4}) translateY(${(1 - pop) * 30}px)`,
            transformOrigin: "0% 100%",
          }}
        >
          {ecrit ? (
            <div style={{ display: "flex", gap: 12, height: 30, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    background: "#fff",
                    opacity: 0.45 + 0.55 * Math.max(0, Math.sin((local - i * 2) * 0.9)),
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                fontFamily: POLICE_TITRE,
                fontWeight: 800,
                fontSize: 60,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "#fff",
                textAlign: "left",
                textWrap: "balance",
              }}
            >
              {p.texte
                .split(/(\*[^*]+\*)/g)
                .filter(Boolean)
                .map((m, i) => (m.startsWith("*") ? <Surligne key={i} texte={m.slice(1, -1)} debut={d + SAISIE + 3} /> : <span key={i}>{m}</span>))}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Fin de chaque épisode : les deux anneaux du logo glissent et s'emboîtent, puis le nom et l'adresse. */
export const FinSignature: React.FC<{ debut: number; slogan?: string }> = ({ debut, slogan = "Révise à deux." }) => {
  const f = useCurrentFrame() - debut;
  const { fps } = useVideoConfig();
  if (f < 0) return null;
  const fond = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const glisse = spring({ frame: f - 2, fps, config: { damping: 12, stiffness: 120 } });
  const clic = spring({ frame: f - 14, fps, config: { damping: 8, stiffness: 260 } });
  const nom = spring({ frame: f - 16, fps, config: { damping: 15 } });
  const url = spring({ frame: f - 24, fps, config: { damping: 15 } });
  const ecart = interpolate(glisse, [0, 1], [260, 0]);
  return (
    <AbsoluteFill
      style={{
        opacity: fond,
        background: `radial-gradient(ellipse 80% 55% at 50% 42%, #3b22a8 0%, ${C.nuit} 75%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ transform: `translateY(-90px) scale(${1 + 0.06 * Math.sin(clic * Math.PI)})` }}>
        <svg width={420} height={300} viewBox="0 0 42 30" style={{ overflow: "visible" }}>
          <circle cx={15.5 - ecart / 20} cy={15} r={7.5} fill="none" stroke="#fff" strokeWidth={2.6} />
          <circle cx={24.5 + ecart / 20} cy={15} r={7.5} fill="none" stroke={C.citron} strokeWidth={2.6} />
          {/* l'arc blanc repasse devant l'anneau citron : les anneaux sont emboîtés */}
          {glisse > 0.95 && <path d="M20 9.1a7.5 7.5 0 0 1 0 11.8" fill="none" stroke="#fff" strokeWidth={2.6} />}
          {clic > 0.05 && <circle cx={20} cy={15} r={4 + clic * 14} fill="none" stroke={C.citron} strokeWidth={0.4} opacity={1 - clic} />}
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1020,
          fontFamily: POLICE_TITRE,
          fontWeight: 800,
          fontSize: 120,
          letterSpacing: "-0.03em",
          color: "#fff",
          opacity: nom,
          transform: `translateY(${(1 - nom) * 30}px)`,
        }}
      >
        Buddy<span style={{ color: "#a98bff" }}>Etude</span>
      </div>
      <div style={{ position: "absolute", top: 1170, fontFamily: POLICE_TEXTE, fontWeight: 700, fontSize: 44, color: "rgba(255,255,255,.82)", opacity: nom }}>{slogan}</div>
      <div
        style={{
          position: "absolute",
          top: 1270,
          fontFamily: POLICE_TITRE,
          fontWeight: 800,
          fontSize: 54,
          padding: "14px 36px",
          borderRadius: 26,
          background: C.citron,
          color: "#14102e",
          opacity: url,
          transform: `scale(${0.8 + url * 0.2})`,
        }}
      >
        buddyetude.com
      </div>
    </AbsoluteFill>
  );
};
