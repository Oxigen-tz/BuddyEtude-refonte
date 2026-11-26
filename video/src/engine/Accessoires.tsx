// Accessoires et pictos 3D réutilisables. Les temps sont en secondes, relatifs au début du plan.
import React from "react";
import * as THREE from "three";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Facette, V3, rand, useCanvasTexture, usePointDoux } from "./outils3d";
import { C } from "./palette";

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { f, fps, t: f / fps };
};

/** Picto flottant (emoji ou texte) dans une pastille, ex. « ? », « 💡 », « ❌ ». */
export const Picto: React.FC<{ texte: string; position: V3; de?: number; a?: number; taille?: number; fond?: string }> = ({
  texte,
  position,
  de = 0,
  a = 999,
  taille = 0.32,
  fond = "rgba(255,255,255,0.95)",
}) => {
  const { f, fps, t } = useT();
  const tex = useCanvasTexture(
    256,
    256,
    (ctx) => {
      if (fond !== "none") {
        ctx.fillStyle = fond;
        ctx.beginPath();
        ctx.arc(128, 128, 112, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `800 ${texte.length > 2 ? 90 : 150}px "Segoe UI Emoji", "Segoe UI", sans-serif`;
      ctx.fillStyle = "#14102e";
      ctx.fillText(texte, 128, 140);
    },
    [texte, fond],
  );
  if (t < de || t > a) return null;
  const s = spring({ frame: f - de * fps, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <sprite position={[position[0], position[1] + 0.03 * Math.sin(f * 0.15), position[2]]} scale={taille * s}>
      <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
};

/** Feuille posée sur le bureau ; `surligne` (0 → 1) la recouvre de citron, ligne par ligne. */
export const Feuille: React.FC<{ position: V3; rotation?: number; surligne?: number; anime?: [number, number] }> = ({ position, rotation = 0, surligne = 0, anime }) => {
  const { t } = useT();
  if (anime) surligne = (t - anime[0]) / (anime[1] - anime[0]);
  const tex = useCanvasTexture(
    192,
    256,
    (ctx) => {
      ctx.fillStyle = "#f4f1ff";
      ctx.fillRect(0, 0, 192, 256);
      ctx.fillStyle = "#3d4fa8";
      ctx.fillRect(16, 16, 110, 12);
      for (let i = 0; i < 13; i++) {
        ctx.fillStyle = "#8f95b8";
        ctx.fillRect(16, 42 + i * 16, 60 + rand("fl", i) * 100, 5);
      }
    },
    [],
  );
  const n = Math.max(0, Math.min(1, surligne));
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, rotation]}>
      <mesh>
        <planeGeometry args={[0.24, 0.32]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      {n > 0 && (
        <mesh position={[0, 0.16 - (0.32 * n) / 2, 0.001]}>
          <planeGeometry args={[0.24, 0.32 * n]} />
          <meshBasicMaterial color={C.citron} transparent opacity={0.72} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

/** Copie notée qui tombe du ciel et se pose (ex. « 18/20 »). */
export const Copie: React.FC<{ position: V3; note: string; de: number }> = ({ position, note, de }) => {
  const { f, fps, t } = useT();
  const tex = useCanvasTexture(
    192,
    256,
    (ctx) => {
      ctx.fillStyle = "#fbfaff";
      ctx.fillRect(0, 0, 192, 256);
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = "#b5b9d4";
        ctx.fillRect(16, 90 + i * 15, 50 + rand("cp", i) * 110, 4);
      }
      ctx.strokeStyle = "#e0314f";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(120, 52, 58, 36, -0.1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#e0314f";
      ctx.font = "800 46px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(note, 120, 68);
    },
    [note],
  );
  if (t < de) return null;
  const s = spring({ frame: f - de * fps, fps, config: { damping: 11, stiffness: 90 } });
  const y = position[1] + (1 - s) * 1.6;
  return (
    <mesh position={[position[0], y, position[2]]} rotation={[-Math.PI / 2 + (1 - s) * 1.2, 0, (1 - s) * 2 + 0.2]}>
      <planeGeometry args={[0.26, 0.34]} />
      <meshStandardMaterial map={tex} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
};

/** Téléphone posé à plat ; il vibre (et s'allume) entre `vibreDe` et `vibreA`. */
export const TelephoneBureau: React.FC<{ position: V3; vibreDe?: number; vibreA?: number }> = ({ position, vibreDe = -1, vibreA = -1 }) => {
  const { f, t } = useT();
  const vibre = t >= vibreDe && t <= vibreA;
  const dx = vibre ? 0.006 * Math.sin(f * 3.1) : 0;
  return (
    <group position={[position[0] + dx, position[1], position[2]]} rotation={[0, 0.4 + (vibre ? 0.04 * Math.sin(f * 2.3) : 0), 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.09, 0.012, 0.17]} />
        <Facette color="#11131c" />
      </mesh>
      <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 0.155]} />
        <meshBasicMaterial color={vibre ? "#b9a6ff" : "#05060c"} toneMapped={false} />
      </mesh>
      {vibre && <pointLight position={[0, 0.1, 0]} color="#b9a6ff" intensity={0.6} distance={0.8} />}
    </group>
  );
};

/** Réveil à chiffres lumineux. */
export const Reveil: React.FC<{ position: V3; heure: string; rotationY?: number }> = ({ position, heure, rotationY = -0.6 }) => {
  const tex = useCanvasTexture(
    256,
    128,
    (ctx) => {
      ctx.fillStyle = "#0a0614";
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = "#ff5a6e";
      ctx.font = "800 92px 'Consolas', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(heure, 128, 68);
    },
    [heure],
  );
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.24, 0.12, 0.08]} />
        <Facette color="#262a40" />
      </mesh>
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[0.21, 0.1]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0, 0.15]} color="#ff5a6e" intensity={0.25} distance={0.7} />
    </group>
  );
};

/** Petit nuage de fumée grise au-dessus d'une tête qui « chauffe ». */
export const Fumee: React.FC<{ position: V3; de?: number }> = ({ position, de = 0 }) => {
  const { t } = useT();
  const sprite = usePointDoux();
  if (t < de) return null;
  return (
    <group position={position}>
      {Array.from({ length: 7 }, (_, i) => {
        const cycle = ((t - de) * 0.6 + rand("fu", i)) % 1;
        return (
          <sprite key={i} position={[(rand("fx", i) - 0.5) * 0.18, cycle * 0.4, (rand("fz", i) - 0.5) * 0.18]} scale={0.12 + cycle * 0.2}>
            <spriteMaterial map={sprite} color="#b8b2cf" transparent opacity={0.55 * (1 - cycle)} depthWrite={false} />
          </sprite>
        );
      })}
    </group>
  );
};
