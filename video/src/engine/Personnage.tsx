// Personnage low-poly construit en primitives Three.js (aucun modèle externe).
// Il regarde vers +x. Poses et animations sont des paramètres : le script d'une vidéo
// décide de la pose, du regard et de l'expression image par image.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Facette, Membre, V3, rand } from "./outils3d";
import { C } from "./palette";

export type Pose = "clavier" | "repos" | "tete-mains" | "victoire" | "telephone" | "ecrit" | "gratte";
export type Expression = "neutre" | "inquiet" | "content" | "surpris" | "fatigue";
export type Coiffure = "courte" | "longue" | "chignon" | "boucles";

export type Tenue = { peau: string; cheveux: string; haut: string; bas: string };

export const TENUES = {
  hero: { peau: C.peau, cheveux: C.cheveux, haut: C.sweat, bas: "#232a4a" },
  binome: { peau: "#c98b65", cheveux: "#120c0b", haut: "#b0457a", bas: "#2a2440" },
  mentor: { peau: "#f0c9a8", cheveux: "#8a5a2b", haut: "#2f7d6b", bas: "#1f2a33" },
  sarah: { peau: "#8d5a3c", cheveux: "#1a1010", haut: "#e0a33a", bas: "#2b2a44" },
  yanis: { peau: "#d6a07a", cheveux: "#1c1412", haut: "#3b3f52", bas: "#1b1d2a" },
  ines: { peau: "#e3b08e", cheveux: "#5a2e1c", haut: "#7a5cd6", bas: "#23203d" },
} satisfies Record<string, Tenue>;

export type PersonnageProps = {
  id?: string;
  position?: V3;
  rotationY?: number;
  tenue?: Tenue;
  coiffure?: Coiffure;
  pose?: Pose;
  expression?: Expression;
  /** Rotation de la tête à gauche/droite (radians, + = vers sa gauche). */
  regard?: number;
  /** Tête penchée en avant (+) ou en arrière (−). */
  inclinaison?: number;
  /** Intensité de la frappe au clavier, 0 à 1. */
  frappe?: number;
  /** Afficher la chaise. */
  chaise?: boolean;
};

export const Personnage: React.FC<PersonnageProps> = ({
  id = "hero",
  position = [0, 0, 0],
  rotationY = 0,
  tenue = TENUES.hero,
  coiffure = "courte",
  pose = "clavier",
  expression = "neutre",
  regard = 0,
  inclinaison = 0,
  frappe = 0,
  chaise = true,
}) => {
  const f = useCurrentFrame();
  const respiration = 1 + 0.018 * Math.sin(f * 0.11 + rand(id, 1) * 6);

  // Clignement : toutes les 2 à 3,5 s, durée 4 images.
  const periode = 70 + Math.floor(rand(id, 2) * 40);
  const phase = (f + Math.floor(rand(id, 3) * periode)) % periode;
  const paupiere = phase < 4 ? 0.12 : expression === "fatigue" ? 0.45 : 1;

  // Bras selon la pose (épaule → coude → main), côtés gauche (z+) et droit (z−).
  const tape = (cote: number) => frappe * 0.018 * Math.max(0, Math.sin(f * 1.4 + cote * 1.7 + rand(id, 4) * 3));
  const bras = (cote: 1 | -1): { e: V3; m: V3 } => {
    switch (pose) {
      case "repos":
        return { e: [0.14, 0.86, 0.27 * cote], m: [0.4, 0.68, 0.14 * cote] };
      case "tete-mains":
        return { e: [0.48, 0.84, 0.21 * cote], m: [0.24, 1.3, 0.16 * cote] };
      case "victoire":
        return { e: [0.1, 1.36, 0.34 * cote], m: [0.16, 1.62 + 0.03 * Math.sin(f * 0.5 + cote), 0.36 * cote] };
      case "telephone":
        return cote === 1
          ? { e: [0.22, 0.88, 0.25], m: [0.4, 1.02, 0.06] }
          : { e: [0.22, 0.88, -0.25], m: [0.4, 0.99, -0.04] };
      case "ecrit":
        return cote === -1
          ? { e: [0.22, 0.88, -0.27], m: [0.5 + 0.06 * Math.sin(f * 0.35), 0.81 + 0.01 * Math.abs(Math.sin(f * 0.9)), -0.1 + 0.05 * Math.sin(f * 0.17)] }
          : { e: [0.22, 0.88, 0.27], m: [0.46, 0.8, 0.18] };
      case "gratte":
        return cote === -1
          ? { e: [0.12, 1.2, -0.32], m: [0.08, 1.56 + 0.02 * Math.sin(f * 0.9), -0.17] }
          : { e: [0.22, 0.88, 0.27], m: [0.46, 0.8, 0.16] };
      default:
        return { e: [0.22, 0.9, 0.27 * cote], m: [0.5, 0.83 + tape(cote), 0.13 * cote] };
    }
  };
  const penche = pose === "tete-mains" ? 0.35 : pose === "telephone" ? 0.3 : pose === "ecrit" ? 0.22 : 0;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {chaise && <Chaise />}

      {/* Jambes */}
      {([1, -1] as const).map((c) => (
        <group key={c}>
          <Membre a={[0, 0.56, 0.11 * c]} b={[0.44, 0.56, 0.12 * c]} r={0.08} color={tenue.bas} />
          <Membre a={[0.44, 0.56, 0.12 * c]} b={[0.47, 0.08, 0.12 * c]} r={0.065} color={tenue.bas} />
          <mesh position={[0.53, 0.04, 0.12 * c]} castShadow>
            <boxGeometry args={[0.2, 0.08, 0.1]} />
            <Facette color="#e9e6f5" />
          </mesh>
        </group>
      ))}

      {/* Buste (respiration) */}
      <group position={[0.02, 0.58, 0]} rotation={[0, 0, -0.1 - penche * 0.3]} scale={[1, respiration, 1]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.62, 6]} />
          <Facette color={tenue.haut} />
        </mesh>
        {/* capuche roulée sur les épaules */}
        <mesh position={[-0.05, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.15, 0.05, 4, 8]} />
          <Facette color={tenue.haut} />
        </mesh>
      </group>

      {/* Bras */}
      {([1, -1] as const).map((c) => {
        const { e, m } = bras(c);
        return (
          <group key={c}>
            <Membre a={[0.04, 1.12, 0.22 * c]} b={e} r={0.058} color={tenue.haut} />
            <Membre a={e} b={m} r={0.05} color={tenue.haut} />
            <mesh position={m} castShadow>
              <icosahedronGeometry args={[0.05, 0]} />
              <Facette color={tenue.peau} />
            </mesh>
          </group>
        );
      })}
      {pose === "telephone" && (
        <mesh position={[0.44, 1.04, 0.01]} rotation={[0, 0, 0.9]}>
          <boxGeometry args={[0.02, 0.16, 0.085]} />
          <Facette color="#11131c" emissive={C.ecran} emissiveIntensity={0.25} />
        </mesh>
      )}

      {/* Cou + tête */}
      <Membre a={[0.05, 1.15, 0]} b={[0.08 + penche * 0.08, 1.27, 0]} r={0.06} color={tenue.peau} />
      <group position={[0.1 + penche * 0.12, 1.42 - penche * 0.08, 0]} rotation={[0, regard, -(inclinaison + penche)]}>
        <Tete tenue={tenue} coiffure={coiffure} expression={expression} paupiere={paupiere} />
      </group>
    </group>
  );
};

const Tete: React.FC<{ tenue: Tenue; coiffure: Coiffure; expression: Expression; paupiere: number }> = ({
  tenue,
  coiffure,
  expression,
  paupiere,
}) => {
  const sourcils = expression === "inquiet" ? 0.45 : expression === "surpris" ? -0.2 : expression === "fatigue" ? 0.2 : 0;
  const hautSourcil = expression === "surpris" ? 0.11 : 0.09;
  return (
    <group>
      <mesh castShadow>
        <icosahedronGeometry args={[0.19, 1]} />
        <Facette color={tenue.peau} />
      </mesh>
      {/* oreilles */}
      {[1, -1].map((c) => (
        <mesh key={c} position={[0, -0.01, 0.185 * c]}>
          <icosahedronGeometry args={[0.04, 0]} />
          <Facette color={tenue.peau} />
        </mesh>
      ))}
      {/* nez */}
      <mesh position={[0.19, -0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.06, 4]} />
        <Facette color={tenue.peau} />
      </mesh>
      {/* yeux */}
      {[1, -1].map((c) => (
        <group key={c}>
          <mesh position={[0.165, 0.035, 0.07 * c]} scale={[1, paupiere * (expression === "surpris" ? 1.3 : 1), 1]}>
            <boxGeometry args={[0.02, 0.05, 0.036]} />
            <meshBasicMaterial color="#120f1f" />
          </mesh>
          {/* reflet dans l'œil */}
          {paupiere > 0.5 && (
            <mesh position={[0.177, 0.048, 0.07 * c + 0.008]}>
              <boxGeometry args={[0.004, 0.012, 0.01]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          )}
          <mesh position={[0.17, hautSourcil, 0.07 * c]} rotation={[sourcils * c, 0, 0]}>
            <boxGeometry args={[0.014, 0.013, 0.06]} />
            <meshBasicMaterial color={tenue.cheveux} />
          </mesh>
        </group>
      ))}
      <Bouche expression={expression} />
      <Cheveux couleur={tenue.cheveux} coiffure={coiffure} />
    </group>
  );
};

const Bouche: React.FC<{ expression: Expression }> = ({ expression }) => {
  const mat = <meshBasicMaterial color="#5a2230" />;
  if (expression === "content")
    return (
      <group position={[0.176, -0.075, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.045, 0.009, 3, 8, Math.PI]} />
          {mat}
        </mesh>
      </group>
    );
  if (expression === "inquiet")
    return (
      <group position={[0.176, -0.105, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <torusGeometry args={[0.03, 0.008, 3, 8, Math.PI]} />
          {mat}
        </mesh>
      </group>
    );
  if (expression === "surpris")
    return (
      <group position={[0.177, -0.085, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <torusGeometry args={[0.022, 0.009, 3, 8]} />
          {mat}
        </mesh>
      </group>
    );
  return (
    <mesh position={[0.178, -0.085, 0]}>
      <boxGeometry args={[0.01, 0.012, expression === "fatigue" ? 0.04 : 0.06]} />
      {mat}
    </mesh>
  );
};

const Cheveux: React.FC<{ couleur: string; coiffure: Coiffure }> = ({ couleur, coiffure }) => (
  <group>
    {/* calotte */}
    <mesh position={[-0.015, 0.03, 0]} rotation={[0, 0, 0.35]} castShadow>
      <sphereGeometry args={[0.205, 7, 5, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      <Facette color={couleur} />
    </mesh>
    {/* mèche sur le front */}
    <mesh position={[0.13, 0.13, 0.03]} rotation={[0.3, 0, -0.5]} castShadow>
      <boxGeometry args={[0.1, 0.05, 0.16]} />
      <Facette color={couleur} />
    </mesh>
    {coiffure === "longue" && (
      <mesh position={[-0.1, -0.12, 0]} castShadow>
        <boxGeometry args={[0.16, 0.36, 0.34]} />
        <Facette color={couleur} />
      </mesh>
    )}
    {coiffure === "chignon" && (
      <mesh position={[-0.13, 0.17, 0]} castShadow>
        <icosahedronGeometry args={[0.09, 0]} />
        <Facette color={couleur} />
      </mesh>
    )}
    {coiffure === "boucles" &&
      [0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[-0.05 + 0.05 * Math.cos(i), 0.16 + 0.03 * Math.sin(i * 2), 0.15 * Math.cos(i * 1.7)]} castShadow>
          <icosahedronGeometry args={[0.075, 0]} />
          <Facette color={couleur} />
        </mesh>
      ))}
  </group>
);

const Chaise: React.FC = () => (
  <group>
    <mesh position={[-0.02, 0.47, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.06, 0.5]} />
      <Facette color="#2b2f55" />
    </mesh>
    <mesh position={[-0.27, 0.85, 0]} rotation={[0, 0, 0.08]} castShadow>
      <boxGeometry args={[0.06, 0.7, 0.46]} />
      <Facette color="#2b2f55" />
    </mesh>
    <mesh position={[-0.02, 0.23, 0]}>
      <cylinderGeometry args={[0.03, 0.03, 0.46, 5]} />
      <Facette color="#3a3f6a" />
    </mesh>
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh key={i} position={[-0.02 + 0.2 * Math.cos((i * 2 * Math.PI) / 5), 0.03, 0.2 * Math.sin((i * 2 * Math.PI) / 5)]} rotation={[0, -(i * 2 * Math.PI) / 5, 0]}>
        <boxGeometry args={[0.4, 0.03, 0.04]} />
        <Facette color="#3a3f6a" />
      </mesh>
    ))}
  </group>
);
