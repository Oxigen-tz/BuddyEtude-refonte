// Fiche image fixe d'une piste de mascotte (pour choisir avant d'animer).
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Camera, Particules } from "../engine/Decor";
import { Mascotte, VarianteMascotte } from "../engine/Mascotte";
import { POLICE_TEXTE, POLICE_TITRE } from "../engine/SousTitre";
import { C } from "../engine/palette";

const FICHES: Record<VarianteMascotte, { nom: string; idee: string }> = {
  orbi: { nom: "Orbi", idee: "Un petit astre à facettes. L'anneau citron du logo tourne autour de lui : il « met en orbite » deux étudiants." },
  surli: { nom: "Surli", idee: "Un surligneur citron au bouchon violet. L'objet que tout étudiant a dans sa trousse, en version copain de révision." },
  bulle: { nom: "Bulle", idee: "Une bulle de discussion qui « écrit » (trois points animés). Elle incarne la messagerie : quelqu'un te répond." },
};

export const MascotteFiche: React.FC<{ variante: VarianteMascotte; numero: number }> = ({ variante, numero }) => {
  const { width, height } = useVideoConfig();
  const fiche = FICHES[variante];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, #26307a 0%, ${C.nuit} 70%)` }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2, alpha: true }} camera={{ fov: 30 }}>
        <Camera position={[0.15, 0.25, 2.6]} cible={[0, 0.12, 0]} derive={0} fov={30} />
        <hemisphereLight args={["#8ea2ff", "#0b0f24", 0.9]} />
        <directionalLight position={[2, 3, 3]} color="#fff1d6" intensity={2.2} castShadow />
        <directionalLight position={[-3, 1, -2]} color={C.rose} intensity={1.5} />
        <directionalLight position={[0, -3, 2]} color="#8d6bff" intensity={0.9} />
        <Mascotte variante={variante} position={[0, 0.2, 0]} rotationY={0.35} echelle={1.15} />
        <Particules nombre={70} centre={[0, 0.3, -0.4]} taille={[2.4, 1.8, 1]} />
      </ThreeCanvas>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 90, color: "#fff", textAlign: "center" }}>
        <div style={{ fontFamily: POLICE_TEXTE, fontWeight: 700, fontSize: 30, color: C.citron, letterSpacing: ".12em" }}>PISTE {numero}</div>
        <div style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 104, letterSpacing: "-0.03em", marginTop: 6 }}>{fiche.nom}</div>
        <div style={{ fontFamily: POLICE_TEXTE, fontWeight: 500, fontSize: 34, lineHeight: 1.35, opacity: 0.85, marginTop: 14 }}>{fiche.idee}</div>
      </div>
    </AbsoluteFill>
  );
};
