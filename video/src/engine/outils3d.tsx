// Petits outils 3D partagés : matériaux « low-poly » (facettes visibles), membres entre deux points,
// textures dessinées sur canvas (toujours avec un hasard reproductible : même rendu à chaque fois).
import React, { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";

export type V3 = [number, number, number];

/** Matériau mat à facettes visibles, la base du style low-poly. */
export const Facette: React.FC<{ color: string; emissive?: string; emissiveIntensity?: number; roughness?: number; map?: THREE.Texture }> = ({
  color,
  emissive = "#000000",
  emissiveIntensity = 1,
  roughness = 0.85,
  map,
}) => <meshStandardMaterial color={color} map={map} flatShading roughness={roughness} metalness={0} emissive={emissive} emissiveIntensity={emissiveIntensity} />;

/** Cylindre à facettes tendu entre deux points (bras, jambes, tiges de lampe…). */
export const Membre: React.FC<{ a: V3; b: V3; r: number; r2?: number; color: string; segments?: number }> = ({ a, b, r, r2, color, segments = 6 }) => {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: va.add(vb).multiplyScalar(0.5), quat, len };
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);
  return (
    <group>
      <mesh position={pos} quaternion={quat} castShadow>
        <cylinderGeometry args={[r2 ?? r, r, len, segments]} />
        <Facette color={color} />
      </mesh>
      {/* articulation arrondie */}
      <mesh position={b} castShadow>
        <icosahedronGeometry args={[r2 ?? r, 0]} />
        <Facette color={color} />
      </mesh>
    </group>
  );
};

/** Hasard reproductible : rand("clé", i) renvoie toujours la même valeur entre 0 et 1. */
export const rand = (cle: string, i: number) => random(`${cle}-${i}`);

/** Texture canvas créée une seule fois. */
export function useCanvasTexture(w: number, h: number, dessiner: (ctx: CanvasRenderingContext2D) => void, deps: unknown[] = []) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    dessiner(canvas.getContext("2d")!);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Dégradé vertical transparent (pour les rayons de lumière). */
export function useDegradeAlpha() {
  return useCanvasTexture(16, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.5, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 256);
    // bords latéraux adoucis
    const h = ctx.createLinearGradient(0, 0, 16, 0);
    h.addColorStop(0, "rgba(0,0,0,1)");
    h.addColorStop(0.3, "rgba(0,0,0,0)");
    h.addColorStop(0.7, "rgba(0,0,0,0)");
    h.addColorStop(1, "rgba(0,0,0,1)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = h;
    ctx.fillRect(0, 0, 16, 256);
  });
}

/** Point lumineux rond et doux (particules, halos). */
export function usePointDoux() {
  return useCanvasTexture(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.5)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });
}

/** Papier à grands carreaux (Seyès) : la signature « cahier d'école » des décors BuddyEtude. */
// (la marge rouge est un objet à part, posé une seule fois sur le mur)
export function useSeyes(fond: string, ligne: string, repetition: [number, number] = [3, 2]) {
  const tex = useCanvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = fond;
      ctx.fillRect(0, 0, 256, 256);
      // 4 carreaux de 64 px ; 3 lignes fines entre deux lignes fortes
      for (let y = 0; y <= 256; y += 16) {
        const forte = y % 64 === 0;
        ctx.strokeStyle = ligne;
        ctx.globalAlpha = forte ? 0.75 : 0.32;
        ctx.lineWidth = forte ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 2;
      for (let x = 0; x <= 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    [fond, ligne],
  );
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repetition[0], repetition[1]);
  return tex;
}

/** Lissage entre 0 et 1 (début et fin en douceur). */
export const lisse = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};
