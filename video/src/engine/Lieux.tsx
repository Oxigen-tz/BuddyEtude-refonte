// Autres décors : l'amphi (étudiants face caméra) et la bibliothèque universitaire.
import React from "react";
import { Facette, rand } from "./outils3d";
import { MurSeyes, Particules, Rayons } from "./Decor";
import { C } from "./palette";

/**
 * Amphi vu depuis l'estrade : rangées en gradins, tables longues, écran du projecteur derrière la caméra.
 * Les étudiants se placent au 1er rang (z ≈ 0), tournés vers +z (rotationY = −π/2).
 */
export const Amphi: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <color attach="background" args={[C.nuit]} />
    <fog attach="fog" args={[C.nuit, 6, 16]} />
    <hemisphereLight args={["#6a55c8", "#120c2c", 0.5]} />
    <ambientLight color="#3a2a88" intensity={0.3} />
    {/* lumière froide du projecteur, venant de face (derrière la caméra) */}
    <spotLight position={[0, 3.2, 5]} color="#c9b8ff" intensity={14} angle={0.55} penumbra={0.8} distance={12} decay={1.4} castShadow shadow-mapSize={[1024, 1024]} />
    <pointLight position={[0, 2.5, 2]} color="#ffd9b0" intensity={0.8} distance={5} decay={1.5} />
    {/* sol + gradins */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
      <planeGeometry args={[12, 6]} />
      <Facette color={C.sol} />
    </mesh>
    {[0, 1, 2, 3, 4].map((r) => (
      <group key={r} position={[0, r * 0.45, -r * 1.2]}>
        {/* marche */}
        <mesh position={[0, -0.225 + (r === 0 ? 0 : 0), -0.6]} receiveShadow>
          <boxGeometry args={[8, 0.45 + r * 0.0, 1.2]} />
          <Facette color={r % 2 ? "#21194d" : "#1d1645"} />
        </mesh>
        {/* table longue du rang */}
        <mesh position={[0, 0.76, 0.42]} castShadow receiveShadow>
          <boxGeometry args={[7.6, 0.05, 0.42]} />
          <Facette color={C.bois} />
        </mesh>
        <mesh position={[0, 0.4, 0.62]}>
          <boxGeometry args={[7.6, 0.72, 0.04]} />
          <Facette color="#3d2a3c" />
        </mesh>
        {/* sièges vides des rangs du fond */}
        {r > 0 &&
          Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} position={[-3.4 + i * 0.85, 0.75, -0.3]} castShadow>
              <boxGeometry args={[0.5, 0.6, 0.08]} />
              <Facette color="#2b2f55" />
            </mesh>
          ))}
      </group>
    ))}
    {/* mur du fond en papier Seyès, très haut */}
    <MurSeyes position={[0, 3, -6.6]} taille={[9, 6, 0.1]} couleur={C.mur} />
    {/* grandes baies en hauteur */}
    {[-2.4, 0, 2.4].map((x) => (
      <mesh key={x} position={[x, 4.4, -6.5]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial color="#3a2a88" toneMapped={false} />
      </mesh>
    ))}
    <Rayons depuis={[0, 5.2, -6.4]} vers={[0, 0.5, 0]} nombre={4} intensite={0.06} largeur={0.5} />
    <Particules nombre={140} centre={[0, 1.8, -1]} taille={[6, 3, 4]} />
    {children}
  </group>
);

/** Bibliothèque universitaire : grande table, lampe verte de bibliothèque, rayonnages. */
export const BU: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <color attach="background" args={[C.nuit]} />
    <fog attach="fog" args={[C.nuit, 7, 18]} />
    <hemisphereLight args={["#6a55c8", "#120c2c", 0.45]} />
    <ambientLight color="#3a2a88" intensity={0.3} />
    <pointLight position={[1.8, 1.9, 1.8]} color="#ffd9b0" intensity={0.8} distance={4} decay={1.5} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 10]} />
      <Facette color="#2a1d3a" />
    </mesh>
    {/* rayonnages en fond */}
    {[-1.6, -4.2].map((z, k) => (
      <group key={z} position={[0, 0, z]}>
        {Array.from({ length: 5 }, (_, s) => (
          <group key={s} position={[0, 0.35 + s * 0.48, 0]}>
            <mesh>
              <boxGeometry args={[6, 0.04, 0.4]} />
              <Facette color={C.bois} />
            </mesh>
            {Array.from({ length: 34 }, (_, i) => (
              <mesh key={i} position={[-2.9 + i * 0.172, 0.17 + rand(`bu${k}${s}`, i) * 0.03, 0]}>
                <boxGeometry args={[0.13, 0.3 + rand(`bh${k}${s}`, i) * 0.08, 0.3]} />
                <Facette color={[C.violet, C.rose, "#2f7d6b", C.chaud, "#3d4fa8", "#6b4b3a"][(i * 7 + s * 3 + k) % 6]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    ))}
    {/* grande table */}
    <mesh position={[0.75, 0.76, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.1, 0.06, 2.6]} />
      <Facette color="#5a3d2e" />
    </mesh>
    {[
      [0.3, 1.2],
      [1.2, 1.2],
      [0.3, -1.2],
      [1.2, -1.2],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.37, z]}>
        <boxGeometry args={[0.06, 0.74, 0.06]} />
        <Facette color="#3d2a22" />
      </mesh>
    ))}
    {/* lampe de bibliothèque à abat-jour vert */}
    <group position={[0.85, 0.79, -0.45]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.04, 7]} />
        <Facette color="#c9a24a" />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 4]} />
        <Facette color="#c9a24a" />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.36, 6, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#1f7a4e" emissive="#1f7a4e" emissiveIntensity={0.3} side={2} flatShading />
      </mesh>
      <spotLight position={[0, 0.28, 0]} color="#ffe2a8" intensity={6} angle={1.0} penumbra={0.7} distance={3} decay={1.6} castShadow />
      <pointLight position={[0, 0.3, 0.2]} color="#ffd38a" intensity={0.9} distance={2.5} decay={2} />
    </group>
    <Particules nombre={120} centre={[0, 1.5, 0]} taille={[4, 2.5, 3]} />
    {children}
  </group>
);
