// Décors réutilisables : chambre de nuit (bureau, lampe, ordinateur), ville par la fenêtre,
// rayons de lumière volumétriques, particules qui flottent, caméra presque fixe.
import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { Facette, V3, rand, useCanvasTexture, useDegradeAlpha, usePointDoux, useSeyes } from "./outils3d";
import { C } from "./palette";

/* ------------------------------------------------------------------ caméra */

export const Camera: React.FC<{ position: V3; cible: V3; derive?: number; fov?: number }> = ({ position, cible, derive = 1, fov = 42 }) => {
  const f = useCurrentFrame();
  const { camera } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    // léger travelling avant + respiration de caméra à l'épaule
    cam.position.set(
      position[0] - f * 0.0016 * derive + 0.012 * Math.sin(f * 0.031),
      position[1] + 0.01 * Math.sin(f * 0.023),
      position[2] - f * 0.0022 * derive,
    );
    cam.fov = fov;
    cam.updateProjectionMatrix();
    cam.lookAt(cible[0], cible[1], cible[2]);
  }, [f, camera, position, cible, derive, fov]);
  return null;
};

/* ------------------------------------------------------------------ ville */

const Immeuble: React.FC<{ i: number; x: number; z: number; l: number; h: number; p: number }> = ({ i, x, z, l, h, p }) => {
  const tex = useCanvasTexture(
    128,
    256,
    (ctx) => {
      ctx.fillStyle = "#170f38";
      ctx.fillRect(0, 0, 128, 256);
      const cols = 5 + Math.floor(rand("col", i) * 3);
      const rows = 14 + Math.floor(rand("row", i) * 8);
      const cw = 128 / cols;
      const rh = 256 / rows;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const v = rand(`fen-${i}`, r * 20 + c);
          if (v < 0.32) {
            ctx.fillStyle = v < 0.08 ? "#c9b8ff" : v < 0.2 ? "#ffcf7a" : "#ffb45e";
            ctx.globalAlpha = 0.55 + rand(`int-${i}`, r * 20 + c) * 0.45;
            ctx.fillRect(c * cw + cw * 0.22, r * rh + rh * 0.25, cw * 0.56, rh * 0.5);
          }
        }
      ctx.globalAlpha = 1;
    },
    [i],
  );
  return (
    <mesh position={[x, h / 2 - 2, z]}>
      <boxGeometry args={[l, h, p]} />
      <meshStandardMaterial color="#160f36" emissive="#ffffff" emissiveMap={tex} emissiveIntensity={1.1} map={tex} roughness={1} />
    </mesh>
  );
};

export const Ville: React.FC = () => {
  const ciel = useCanvasTexture(16, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#08051a");
    g.addColorStop(0.55, "#241657");
    g.addColorStop(0.85, "#4a2a86");
    g.addColorStop(1, "#8a3f9a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 256);
  });
  const immeubles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        i,
        x: -7 + i * 1.0 + rand("bx", i) * 0.6,
        z: -5.5 - rand("bz", i) * 6,
        l: 0.8 + rand("bl", i) * 0.9,
        h: 4 + rand("bh", i) * 7,
        p: 0.8 + rand("bp", i) * 0.6,
      })),
    [],
  );
  return (
    <group>
      <mesh position={[0, 4, -16]}>
        <planeGeometry args={[60, 24]} />
        <meshBasicMaterial map={ciel} toneMapped={false} />
      </mesh>
      {/* lune */}
      <mesh position={[3.5, 7.5, -15]}>
        <circleGeometry args={[0.6, 10]} />
        <meshBasicMaterial color={C.lune} toneMapped={false} />
      </mesh>
      {immeubles.map((b) => (
        <Immeuble key={b.i} {...b} />
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ lumière */

/** Faisceaux de lumière (plans additifs avec dégradé), de la source vers le sol. */
export const Rayons: React.FC<{ depuis: V3; vers: V3; couleur?: string; nombre?: number; largeur?: number; intensite?: number }> = ({
  depuis,
  vers,
  couleur = "#bfa8ff",
  nombre = 5,
  largeur = 0.35,
  intensite = 0.14,
}) => {
  const f = useCurrentFrame();
  const alpha = useDegradeAlpha();
  const faisceaux = useMemo(() => {
    const a = new THREE.Vector3(...depuis);
    const b = new THREE.Vector3(...vers);
    const dir = b.clone().sub(a);
    const len = dir.length();
    return Array.from({ length: nombre }, (_, i) => {
      const off = new THREE.Vector3((rand("rx", i) - 0.5) * 1.6, (rand("ry", i) - 0.5) * 0.8, (rand("rz", i) - 0.5) * 0.4);
      const start = a.clone().add(off);
      const mid = start.clone().add(dir.clone().multiplyScalar(0.5));
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().normalize());
      return { mid, quat, len, w: largeur * (0.5 + rand("rw", i)), ph: rand("rp", i) * 6 };
    });
  }, [depuis.join(), vers.join(), nombre, largeur]);
  return (
    <group>
      {faisceaux.map((r, i) =>
        [0, Math.PI / 2].map((rot) => (
          <group key={`${i}-${rot}`} position={r.mid} quaternion={r.quat}>
            <mesh rotation={[0, rot, 0]}>
              <planeGeometry args={[r.w, r.len]} />
              <meshBasicMaterial
                color={couleur}
                alphaMap={alpha}
                transparent
                opacity={intensite * (0.75 + 0.25 * Math.sin(f * 0.05 + r.ph))}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
};

/** Poussière lumineuse qui flotte dans la pièce. */
export const Particules: React.FC<{ nombre?: number; centre?: V3; taille?: V3 }> = ({ nombre = 180, centre = [0, 1.4, 0], taille = [5, 3, 3] }) => {
  const f = useCurrentFrame();
  const sprite = usePointDoux();
  const { geo, base } = useMemo(() => {
    const base = Array.from({ length: nombre }, (_, i) => [rand("px", i), rand("py", i), rand("pz", i), rand("pv", i)]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(nombre * 3), 3));
    const cols = new Float32Array(nombre * 3);
    const chaud = new THREE.Color(C.chaud);
    const froid = new THREE.Color("#c9b8ff");
    base.forEach((b, i) => (b[3] > 0.6 ? chaud : froid).toArray(cols, i * 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    return { geo, base };
  }, [nombre]);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  base.forEach(([x, y, z, v], i) => {
    const t = f / 30;
    const yy = ((y + t * (0.02 + v * 0.03)) % 1) - 0.5;
    pos.setXYZ(
      i,
      centre[0] + (x - 0.5) * taille[0] + 0.08 * Math.sin(t * 0.6 + v * 9),
      centre[1] + yy * taille[1],
      centre[2] + (z - 0.5) * taille[2] + 0.06 * Math.cos(t * 0.5 + v * 7),
    );
  });
  pos.needsUpdate = true;
  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.035}
        map={sprite}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
};

/* ------------------------------------------------------------------ objets */

export const Bureau: React.FC<{ position?: V3; longueur?: number }> = ({ position = [0.75, 0, 0], longueur = 2.2 }) => (
  <group position={position}>
    <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.75, 0.05, longueur]} />
      <Facette color={C.bois} />
    </mesh>
    {[
      [0.3, longueur / 2 - 0.06],
      [-0.3, longueur / 2 - 0.06],
      [0.3, -longueur / 2 + 0.06],
      [-0.3, -longueur / 2 + 0.06],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.37, z]}>
        <boxGeometry args={[0.05, 0.74, 0.05]} />
        <Facette color="#3d2a3c" />
      </mesh>
    ))}
  </group>
);

/** Ordinateur portable ouvert, écran tourné vers −x (vers l'étudiant). Lueur d'écran incluse. */
export const Ordinateur: React.FC<{ position?: V3; lumiere?: number; contenu?: "doc" | "buddy"; eteint?: boolean }> = ({ position = [0.72, 0.79, 0], lumiere = 1, contenu = "doc", eteint = false }) => {
  const f = useCurrentFrame();
  const ecran = useCanvasTexture(
    256,
    160,
    (ctx) => {
      ctx.fillStyle = contenu === "buddy" ? "#16123a" : "#e8eefc";
      ctx.fillRect(0, 0, 256, 160);
      if (contenu === "buddy") {
        ctx.fillStyle = C.violet;
        ctx.fillRect(0, 0, 256, 22);
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = i % 2 ? "#2c2566" : C.violet;
          ctx.fillRect(i % 2 ? 20 : 110, 34 + i * 30, 126, 20);
        }
      } else {
        ctx.fillStyle = "#3d4fa8";
        ctx.fillRect(16, 14, 140, 12);
        for (let i = 0; i < 9; i++) {
          ctx.fillStyle = "#9aa6c8";
          ctx.fillRect(16, 38 + i * 12, 60 + rand("ligne", i) * 160, 5);
        }
      }
    },
    [contenu],
  );
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.018, 0.46]} />
        <Facette color="#a8adc4" roughness={0.4} />
      </mesh>
      <group position={[0.15, 0.01, 0]} rotation={[0, 0, 0.32]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.014, 0.3, 0.46]} />
          <Facette color="#a8adc4" roughness={0.4} />
        </mesh>
        <mesh position={[-0.008, 0.15, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.42, 0.26]} />
          {eteint ? <meshBasicMaterial color="#05040c" /> : <meshBasicMaterial map={ecran} toneMapped={false} />}
        </mesh>
        <pointLight visible={!eteint} position={[-0.25, 0.15, 0]} color={C.ecran} intensity={0.7 * lumiere * (0.96 + 0.04 * Math.sin(f * 0.4))} distance={2.2} decay={2} />
      </group>
    </group>
  );
};

/** Lampe de bureau : source chaude principale, avec ombres. */
export const Lampe: React.FC<{ position?: V3; intensite?: number; ombre?: boolean }> = ({ position = [0.95, 0.785, -0.7], intensite = 1, ombre = true }) => {
  const cible = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(position[0] - 0.4, 0.78, position[2] + 0.5);
    return o;
  }, [position.join()]);
  return (
    <group>
      <group position={position}>
        <mesh castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.03, 7]} />
          <Facette color="#2a2d48" />
        </mesh>
        <mesh position={[-0.03, 0.22, 0.03]} rotation={[0.15, 0, 0.18]}>
          <cylinderGeometry args={[0.012, 0.012, 0.45, 4]} />
          <Facette color="#2a2d48" />
        </mesh>
        <group position={[-0.12, 0.43, 0.1]} rotation={[0.5, 0, 0.7]}>
          <mesh castShadow>
            <coneGeometry args={[0.1, 0.16, 7, 1, true]} />
            <meshStandardMaterial color="#2a2d48" side={THREE.DoubleSide} flatShading />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <icosahedronGeometry args={[0.04, 0]} />
            <meshBasicMaterial color={intensite > 0 ? "#fff1d6" : "#2a2440"} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <primitive object={cible} />
      <spotLight
        position={[position[0] - 0.14, position[1] + 0.4, position[2] + 0.13]}
        target={cible}
        color={C.chaud}
        intensity={6 * intensite}
        angle={0.95}
        penumbra={0.7}
        distance={4}
        decay={1.6}
        castShadow={ombre}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.002}
      />
      <pointLight position={[position[0] - 0.2, position[1] + 0.35, position[2] + 0.2]} color={C.chaud} intensity={0.9 * intensite} distance={3} decay={2} />
    </group>
  );
};

/** Petits objets de bureau : mug, pile de feuilles, livres. */
export const ObjetsBureau: React.FC<{ y?: number }> = ({ y = 0.785 }) => (
  <group>
    <mesh position={[0.6, y + 0.05, 0.55]} castShadow>
      <cylinderGeometry args={[0.045, 0.04, 0.1, 7]} />
      <Facette color={C.citron} />
    </mesh>
    {[0, 1, 2, 3].map((i) => (
      <mesh key={i} position={[0.55 + rand("fx", i) * 0.04, y + 0.005 + i * 0.008, -0.35 + rand("fz", i) * 0.05]} rotation={[0, rand("fr", i) * 0.4, 0]} castShadow>
        <boxGeometry args={[0.22, 0.006, 0.3]} />
        <Facette color={i === 3 ? "#ffffff" : "#dfe3f2"} />
      </mesh>
    ))}
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[0.95, y + 0.03 + i * 0.055, 0.62]} rotation={[0, 0.2 * i, 0]} castShadow>
        <boxGeometry args={[0.26, 0.05, 0.19]} />
        <Facette color={[C.rose, "#2f7d6b", C.chaud][i]} />
      </mesh>
    ))}
  </group>
);

/* ------------------------------------------------------------------ chambre */

/** Pan de mur tapissé de papier Seyès (la répétition suit la taille : carreaux toujours de la même taille). */
export const MurSeyes: React.FC<{ position: V3; taille: V3; couleur: string }> = ({ position, taille, couleur }) => {
  const tex = useSeyes(couleur, C.seyes, [taille[0] / 0.6, taille[1] / 0.6]);
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={taille} />
      <Facette color="#ffffff" map={tex} />
    </mesh>
  );
};

/** Post-its collés au mur (citron, rose, lavande), légèrement de travers. */
export const PostIts: React.FC<{ position: V3 }> = ({ position }) => (
  <group position={position}>
    {[
      [0, 0, C.citron, 0.08],
      [0.2, 0.06, "#ff8fb8", -0.1],
      [0.05, -0.22, "#c9b8ff", 0.05],
      [0.26, -0.17, C.citron, -0.12],
    ].map(([x, y, c, r], i) => (
      <mesh key={i} position={[x as number, y as number, i * 0.002]} rotation={[0, 0, r as number]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshStandardMaterial color={c as string} roughness={0.9} emissive={c as string} emissiveIntensity={0.12} />
      </mesh>
    ))}
  </group>
);

/** Chambre de nuit complète : murs, fenêtre sur la ville, étagère, bureau, lampe, ordinateur. */
export const Chambre: React.FC<{ lampe?: number; ecran?: "doc" | "buddy"; ambiance?: "nuit" | "sombre"; children?: React.ReactNode }> = ({ lampe = 1, ecran = "doc", ambiance = "nuit", children }) => {
  const k = ambiance === "sombre" ? 0.3 : 1;
  // Fenêtre dans le mur du fond (z = −1.6) : x de −1.3 à 1.5, y de 1.0 à 2.7.
  const mur = C.mur;
  const zMur = -1.6;
  return (
    <group>
      <color attach="background" args={[C.nuit]} />
      <fog attach="fog" args={[C.nuit, 9, 30]} />
      <hemisphereLight args={["#6a55c8", "#120c2c", 0.55 * k]} />
      <ambientLight color="#3a2a88" intensity={0.35 * k} />
      {/* clair de lune qui entre par la fenêtre */}
      <directionalLight position={[1.5, 5, -7]} color="#b3a0ff" intensity={0.8 * k} castShadow shadow-mapSize={[1024, 1024]} />

      {/* sol + tapis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <Facette color={C.sol} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.005, 0.4]} receiveShadow>
        <circleGeometry args={[1.1, 8]} />
        <Facette color="#2a2463" />
      </mesh>

      {/* mur du fond autour de la fenêtre */}
      <MurSeyes position={[-3.65, 2, zMur]} taille={[4.7, 4, 0.1]} couleur={mur} />
      <MurSeyes position={[3.25, 2, zMur]} taille={[3.5, 4, 0.1]} couleur={mur} />
      <MurSeyes position={[0.1, 0.5, zMur]} taille={[2.8, 1, 0.1]} couleur={mur} />
      <MurSeyes position={[0.1, 3.35, zMur]} taille={[2.8, 1.3, 0.1]} couleur={mur} />
      <PostIts position={[-1.85, 1.75, zMur + 0.06]} />
      {/* cadre et croisillon de la fenêtre */}
      {[
        [0.1, 1.0, 2.9, 0.08],
        [0.1, 2.7, 2.9, 0.08],
        [0.1, 1.85, 0.05, 1.7],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, zMur + 0.02]}>
          <boxGeometry args={[w, h, 0.14]} />
          <Facette color="#2e3a78" />
        </mesh>
      ))}
      {[-1.33, 1.53].map((x) => (
        <mesh key={x} position={[x, 1.85, zMur + 0.02]}>
          <boxGeometry args={[0.08, 1.78, 0.14]} />
          <Facette color="#2e3a78" />
        </mesh>
      ))}
      {/* rebord */}
      <mesh position={[0.1, 0.98, zMur + 0.12]} castShadow>
        <boxGeometry args={[2.9, 0.04, 0.24]} />
        <Facette color="#34408a" />
      </mesh>
      {/* petite plante sur le rebord */}
      <group position={[1.2, 1.0, zMur + 0.12]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.12, 6]} />
          <Facette color="#b0457a" />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0.04 * Math.cos(i * 1.3), 0.18 + i * 0.02, 0.04 * Math.sin(i * 1.3)]} rotation={[0.4 * Math.cos(i), i, 0.4 * Math.sin(i)]}>
            <coneGeometry args={[0.05, 0.2, 3]} />
            <Facette color="#3f8f5e" />
          </mesh>
        ))}
      </group>

      {/* mur latéral gauche + étagère */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <MurSeyes position={[-1.5, 2, -2.4]} taille={[6.2, 4, 0.1]} couleur="#221a55" />
      </group>
      <group position={[-2.3, 1.75, -0.2]}>
        <mesh>
          <boxGeometry args={[0.25, 0.04, 1.2]} />
          <Facette color={C.bois} />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, 0.13 + rand("lh", i) * 0.04, -0.5 + i * 0.115]} rotation={[rand("lr", i) > 0.85 ? 0.25 : 0, 0, 0]}>
            <boxGeometry args={[0.2, 0.22 + rand("lh", i) * 0.08, 0.08]} />
            <Facette color={[C.violet, C.rose, "#2f7d6b", C.chaud, "#3d4fa8"][i % 5]} />
          </mesh>
        ))}
      </group>
      {/* guirlande lumineuse au-dessus de la fenêtre */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = -1.2 + i * 0.24;
        const y = 2.9 - 0.12 * Math.sin((i / 11) * Math.PI);
        return (
          <mesh key={i} position={[x, y, zMur + 0.12]}>
            <icosahedronGeometry args={[0.03, 0]} />
            <meshBasicMaterial color={i % 3 === 0 ? C.citron : C.chaud} toneMapped={false} />
          </mesh>
        );
      })}
      <pointLight position={[0.1, 2.75, zMur + 0.4]} color={C.chaud} intensity={0.6} distance={2.5} decay={2} />
      {/* lumière d'appoint côté caméra : les visages restent lisibles */}
      <pointLight position={[1.8, 1.9, 1.8]} color="#ffd9b0" intensity={0.9 * k} distance={4} decay={1.5} />

      <Ville />
      {ambiance === "nuit" && <Rayons depuis={[0.2, 2.6, zMur - 0.1]} vers={[0.9, 0, 0.5]} nombre={5} intensite={0.08} />}

      <Bureau />
      <Ordinateur contenu={ecran} />
      <Lampe intensite={lampe} />
      <ObjetsBureau />
      <Particules />
      {children}
    </group>
  );
};
