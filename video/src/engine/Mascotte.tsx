// Mascotte originale de BuddyEtude : trois pistes, toutes en primitives low-poly.
// Elle regarde vers +z par défaut et flotte doucement.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Facette, V3 } from "./outils3d";
import { C } from "./palette";

export type VarianteMascotte = "orbi" | "surli" | "bulle";
export type HumeurMascotte = "content" | "inquiet" | "surpris";

type Props = {
  variante: VarianteMascotte;
  position?: V3;
  rotationY?: number;
  echelle?: number;
  humeur?: HumeurMascotte;
  /** Éclairage propre (petite lumière colorée autour d'elle). */
  lueur?: boolean;
};

export const Mascotte: React.FC<Props> = ({ variante, position = [0, 0, 0], rotationY = 0, echelle = 1, humeur = "content", lueur = true }) => {
  const f = useCurrentFrame();
  const flotte = 0.04 * Math.sin(f * 0.09);
  const tangue = 0.08 * Math.sin(f * 0.06 + 1);
  const periode = 85;
  const cligne = (f + 30) % periode < 4 ? 0.12 : 1;
  return (
    <group position={[position[0], position[1] + flotte, position[2]]} rotation={[0, rotationY, tangue]} scale={echelle}>
      {variante === "orbi" && <Orbi f={f} cligne={cligne} humeur={humeur} />}
      {variante === "surli" && <Surli f={f} cligne={cligne} humeur={humeur} />}
      {variante === "bulle" && <Bulle f={f} cligne={cligne} humeur={humeur} />}
      {lueur && <pointLight color={variante === "surli" ? C.citron : C.violetClair} intensity={1.6} distance={1.6} decay={2} />}
    </group>
  );
};

type Sous = { f: number; cligne: number; humeur: HumeurMascotte };

/** Yeux lumineux communs (sur la face +z). */
const Yeux: React.FC<{ z: number; ecart: number; y: number; cligne: number; couleur: string; taille?: number; humeur: HumeurMascotte }> = ({
  z,
  ecart,
  y,
  cligne,
  couleur,
  taille = 1,
  humeur,
}) => (
  <group>
    {[1, -1].map((c) => (
      <group key={c} position={[ecart * c, y, z]}>
        <mesh scale={[1, cligne * (humeur === "surpris" ? 1.25 : 1), 1]}>
          <boxGeometry args={[0.05 * taille, 0.08 * taille, 0.02]} />
          <meshBasicMaterial color={couleur} toneMapped={false} />
        </mesh>
        {humeur === "inquiet" && (
          <mesh position={[0, 0.07 * taille, 0.005]} rotation={[0, 0, -0.4 * c]}>
            <boxGeometry args={[0.06 * taille, 0.012, 0.01]} />
            <meshBasicMaterial color={couleur} toneMapped={false} />
          </mesh>
        )}
      </group>
    ))}
  </group>
);

/** Piste 1 : Orbi, un petit astre à facettes autour duquel tourne l'anneau citron du logo. */
const Orbi: React.FC<Sous> = ({ f, cligne, humeur }) => (
  <group>
    <mesh castShadow>
      <icosahedronGeometry args={[0.22, 1]} />
      <Facette color={C.violet} emissive={C.violet} emissiveIntensity={0.25} roughness={0.5} />
    </mesh>
    <group rotation={[0.9, 0, 0.35]}>
      <mesh rotation={[0, 0, f * 0.05]}>
        <torusGeometry args={[0.34, 0.022, 4, 14]} />
        <meshStandardMaterial color={C.citron} emissive={C.citron} emissiveIntensity={0.9} flatShading toneMapped={false} />
      </mesh>
      {/* petite lune qui suit l'anneau */}
      <mesh position={[0.34 * Math.cos(f * 0.07), 0.34 * Math.sin(f * 0.07), 0]}>
        <icosahedronGeometry args={[0.04, 0]} />
        <meshBasicMaterial color={C.citron} toneMapped={false} />
      </mesh>
    </group>
    <Yeux z={0.2} ecart={0.07} y={0.03} cligne={cligne} couleur="#ffffff" humeur={humeur} />
    {/* joues */}
    {[1, -1].map((c) => (
      <mesh key={c} position={[0.13 * c, -0.05, 0.16]}>
        <boxGeometry args={[0.04, 0.02, 0.01]} />
        <meshBasicMaterial color={C.rose} transparent opacity={0.8} />
      </mesh>
    ))}
  </group>
);

/** Piste 2 : Surli, un surligneur citron, bouchon violet, petits bras. */
const Surli: React.FC<Sous> = ({ f, cligne, humeur }) => (
  <group rotation={[0, 0, 0.12]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.11, 0.11, 0.42, 6]} />
      <Facette color={C.citron} roughness={0.55} emissive={C.citron} emissiveIntensity={0.18} />
    </mesh>
    <mesh position={[0, 0.27, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 0.13, 6]} />
      <Facette color={C.violet} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.06, 0.08, 0.04, 6]} />
      <Facette color={C.violetClair} />
    </mesh>
    {/* pointe biseautée */}
    <mesh position={[0, -0.27, 0]} rotation={[0, Math.PI / 4, Math.PI]}>
      <coneGeometry args={[0.09, 0.12, 4]} />
      <meshStandardMaterial color="#c7e04a" emissive={C.citron} emissiveIntensity={0.6} flatShading />
    </mesh>
    {/* bande */}
    <mesh position={[0, -0.13, 0]}>
      <cylinderGeometry args={[0.114, 0.114, 0.045, 6]} />
      <Facette color={C.violet} />
    </mesh>
    <Yeux z={0.1} ecart={0.045} y={0.08} cligne={cligne} couleur="#14102e" taille={0.75} humeur={humeur} />
    <group position={[0, 0.005, 0.1]}>
      <mesh rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.03, 0.007, 3, 8, Math.PI]} />
        <meshBasicMaterial color="#14102e" />
      </mesh>
    </group>
    {/* bras */}
    {[1, -1].map((c) => (
      <mesh key={c} position={[0.13 * c, 0.0, 0]} rotation={[0, 0, (0.9 + 0.35 * Math.sin(f * 0.2 + c)) * c]}>
        <cylinderGeometry args={[0.015, 0.015, 0.14, 4]} />
        <Facette color={C.violet} />
      </mesh>
    ))}
  </group>
);

/** Piste 3 : Bulle, une bulle de discussion qui « écrit » (trois points animés). */
const Bulle: React.FC<Sous> = ({ f, cligne, humeur }) => (
  <group>
    <mesh scale={[1.25, 0.95, 0.85]} castShadow>
      <dodecahedronGeometry args={[0.22, 0]} />
      <Facette color="#efeaff" roughness={0.6} emissive="#8d6bff" emissiveIntensity={0.22} />
    </mesh>
    {/* pointe de la bulle */}
    <mesh position={[-0.14, -0.19, 0.02]} rotation={[0, 0, -2.4]}>
      <coneGeometry args={[0.075, 0.17, 4]} />
      <Facette color="#efeaff" emissive="#8d6bff" emissiveIntensity={0.22} />
    </mesh>
    <Yeux z={0.19} ecart={0.07} y={0.06} cligne={cligne} couleur={C.violet} humeur={humeur} />
    {/* « en train d'écrire » */}
    {[-1, 0, 1].map((i) => (
      <mesh key={i} position={[0.06 * i, -0.06 + 0.015 * Math.max(0, Math.sin(f * 0.25 - i * 0.9)), 0.19]}>
        <icosahedronGeometry args={[0.018, 0]} />
        <meshBasicMaterial color={C.violetClair} />
      </mesh>
    ))}
    {/* antenne citron */}
    <mesh position={[0.05, 0.25, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 0.08, 4]} />
      <Facette color={C.violet} />
    </mesh>
    <mesh position={[0.05, 0.3, 0]}>
      <icosahedronGeometry args={[0.03, 0]} />
      <meshBasicMaterial color={C.citron} toneMapped={false} />
    </mesh>
  </group>
);

