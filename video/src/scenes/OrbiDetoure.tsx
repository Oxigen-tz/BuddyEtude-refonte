// Orbi seul, sur fond transparent : images fixes pour le site (accueil, états vides, page 404).
// Rendu : npx remotion still src/index.ts Orbi-site-content out/orbi-content.png
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Camera } from "../engine/Decor";
import { Mascotte, HumeurMascotte } from "../engine/Mascotte";
import { C } from "../engine/palette";

export const OrbiDetoure: React.FC<{ humeur: HumeurMascotte; rotationY: number }> = ({ humeur, rotationY }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2, alpha: true, premultipliedAlpha: false }} camera={{ fov: 30 }}>
        <Camera position={[0.15, 0.2, 2.5]} cible={[0, 0.15, 0]} derive={0} fov={30} />
        <hemisphereLight args={["#8ea2ff", "#0b0f24", 0.9]} />
        <directionalLight position={[2, 3, 3]} color="#fff1d6" intensity={2.2} />
        <directionalLight position={[-3, 1, -2]} color={C.rose} intensity={1.5} />
        <directionalLight position={[0, -3, 2]} color="#8d6bff" intensity={0.9} />
        <Mascotte variante="orbi" humeur={humeur} position={[0, 0.15, 0]} rotationY={rotationY} echelle={1.15} lueur={false} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
