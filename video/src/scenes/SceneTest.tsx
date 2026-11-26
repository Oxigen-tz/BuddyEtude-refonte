// Scène test de 5 s : un étudiant à son bureau la nuit, la mascotte à côté, lumière et particules.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Camera, Chambre } from "../engine/Decor";
import { Personnage, Expression } from "../engine/Personnage";
import { Mascotte, VarianteMascotte } from "../engine/Mascotte";
import { Finition, SousTitre } from "../engine/SousTitre";
import { lisse } from "../engine/outils3d";

export const SceneTest: React.FC<{ mascotte: VarianteMascotte }> = ({ mascotte }) => {
  const f = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const tourne = lisse((f - 62) / 16);
  const expression: Expression = f < 66 ? "fatigue" : f < 92 ? "surpris" : "content";
  const apparition = spring({ frame: f - 50, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        camera={{ fov: 42, near: 0.05, far: 60 }}
      >
        <Camera position={[3.0, 1.75, 3.2]} cible={[0.25, 1.2, -0.35]} />
        <Chambre>
          <Personnage
            pose={f < 62 ? "clavier" : "repos"}
            frappe={f < 62 ? 1 : 0}
            expression={expression}
            regard={0.75 * tourne}
            inclinaison={0.08 * (1 - tourne)}
          />
          <Mascotte
            variante={mascotte}
            position={[0.55, 1.62, -0.75]}
            rotationY={interpolate(tourne, [0, 1], [0.9, 0.2])}
            echelle={0.55 + 0.45 * apparition}
            humeur={f < 92 ? "surpris" : "content"}
          />
        </Chambre>
      </ThreeCanvas>
      <Finition />
      <SousTitre
        phrases={[
          { de: 0, a: 2.4, texte: "*23 h 47.* Partiel demain à 8 h." },
          { de: 2.4, a: 5.1, texte: "Et toujours *personne* pour réviser avec toi." },
        ]}
      />
    </AbsoluteFill>
  );
};
