// Signature BuddyEtude : la façade « deux fenêtres » (ou plus).
// Des étudiants révisent chacun derrière sa fenêtre, dans le même immeuble.
// Le fil citron (la couleur réservée au lien), tiré par Orbi, relie les fenêtres.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Facette, V3, rand, useCanvasTexture, usePointDoux } from "./outils3d";
import { Bureau, Lampe, MurSeyes, Ordinateur, PostIts, Ville } from "./Decor";
import { Personnage, PersonnageProps } from "./Personnage";
import { Mascotte, VarianteMascotte } from "./Mascotte";
import { C } from "./palette";

export type FenetreDef = {
  centre: [number, number];
  /** L'étudiant derrière la fenêtre (absent = pièce vide). */
  perso?: PersonnageProps;
  /** 1 : regarde vers la droite ; −1 : vers la gauche. */
  cote?: 1 | -1;
  /** Pièce plongée dans le noir (lampe et écran éteints). */
  eteinte?: boolean;
  /** Petite étiquette sous la fenêtre (ex. « SEULE », « Théo · Vu à 14:02 »). */
  etiquette?: string;
  /** Force l'éclairage citron « lien fait » (0 → 1), même sans fil. */
  lien?: number;
};
export type FilDef = { de: number; vers: number; progression: number };

// Façade : plan de 7 × 10 m, de x −3.5 à 3.5 et de y −1.5 à 8.5.
const FX0 = -3.5;
const FY1 = 8.5;
const FW = 7;
const FHT = 10;
const TW = 512;
const TH = 732;
const versPx = (x: number, y: number) => [((x - FX0) / FW) * TW, ((FY1 - y) / FHT) * TH];

export const CIBLE_FACADE: V3 = [0.05, 3.5, 0];
export const FENETRES_DUO: [number, number][] = [
  [-0.3, 4.15],
  [0.4, 2.0],
];

const Facade: React.FC<{ fenetres: FenetreDef[]; taille: [number, number]; liens: number[]; voisins: "normal" | "eteints" }> = ({ fenetres, taille, liens, voisins }) => {
  const [FL, FH] = taille;
  const cle = JSON.stringify([fenetres.map((f) => f.centre), taille, voisins]);
  const couleur = useCanvasTexture(
    TW,
    TH,
    (ctx) => {
      ctx.fillStyle = "#231a52";
      ctx.fillRect(0, 0, TW, TH);
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = i % 2 ? "#271d5a" : "#20184c";
        ctx.fillRect(0, i * 66, TW, 66);
      }
      for (let et = 0; et < 11; et++)
        for (let c = 0; c < 4; c++) {
          const x = -2.6 + c * 1.75;
          const y = 7.6 - et * 1.45;
          const [px, py] = versPx(x - 0.45, y + 0.4);
          const v = voisins === "eteints" ? 1 : rand("voisin", et * 10 + c);
          ctx.fillStyle = v < 0.16 ? "#ffb45e" : v < 0.26 ? "#c9b8ff" : "#120c2c";
          ctx.globalAlpha = v < 0.26 ? 0.4 + v : 1;
          ctx.fillRect(px, py, (0.9 / FW) * TW, (0.8 / FHT) * TH);
          ctx.globalAlpha = 1;
        }
      for (const { centre: [x, y] } of fenetres) {
        const [px, py] = versPx(x - FL / 2 - 0.1, y + FH / 2 + 0.1);
        ctx.fillStyle = "#3a2f86";
        ctx.fillRect(px, py, ((FL + 0.2) / FW) * TW, ((FH + 0.2) / FHT) * TH);
      }
    },
    [cle],
  );
  const alpha = useCanvasTexture(
    TW,
    TH,
    (ctx) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, TW, TH);
      ctx.fillStyle = "#000000";
      for (const { centre: [x, y] } of fenetres) {
        const [px, py] = versPx(x - FL / 2, y + FH / 2);
        ctx.fillRect(px, py, (FL / FW) * TW, (FH / FHT) * TH);
      }
    },
    [cle],
  );
  return (
    <group>
      <mesh position={[FX0 + FW / 2, FY1 - FHT / 2, 0]} receiveShadow>
        <planeGeometry args={[FW, FHT]} />
        <meshStandardMaterial map={couleur} alphaMap={alpha} alphaTest={0.5} roughness={0.95} flatShading />
      </mesh>
      {fenetres.map(({ centre: [x, y], etiquette }, i) => (
        <group key={i} position={[x, y, 0.02]}>
          <mesh position={[0, -FH / 2 - 0.04, 0.08]}>
            <boxGeometry args={[FL + 0.2, 0.07, 0.2]} />
            <Facette color="#3a2f86" emissive={C.citron} emissiveIntensity={liens[i] * 0.8} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.04, FH, 0.04]} />
            <Facette color="#3a2f86" />
          </mesh>
          {/* étiquette entre les fenêtres : sous celles du haut, au-dessus de celles du bas */}
          {etiquette && <Etiquette texte={etiquette} position={[0, y > 3 ? -FH / 2 - 0.26 : FH / 2 + 0.24, 0.2]} />}
        </group>
      ))}
    </group>
  );
};

const Etiquette: React.FC<{ texte: string; position: V3 }> = ({ texte, position }) => {
  const tex = useCanvasTexture(
    512,
    96,
    (ctx) => {
      ctx.font = "800 54px 'Segoe UI', sans-serif";
      const w = Math.min(500, ctx.measureText(texte).width + 56);
      ctx.fillStyle = "rgba(20,12,50,0.88)";
      ctx.beginPath();
      ctx.roundRect((512 - w) / 2, 8, w, 80, 40);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(texte, 256, 50);
    },
    [texte],
  );
  return (
    <mesh position={position}>
      <planeGeometry args={[1.4, 0.26]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
};

/** Petite chambre vue par la fenêtre. */
const Piece: React.FC<{ def: FenetreDef; taille: [number, number]; lien: number }> = ({ def, taille, lien }) => {
  const [, FH] = taille;
  const k = 0.8 * Math.min(1, taille[0] / 1.5);
  const cote = def.cote ?? 1;
  const allume = !def.eteinte;
  const lumiere = new THREE.Color(C.chaud).lerp(new THREE.Color(C.citron), lien * 0.7);
  return (
    <group position={[def.centre[0], def.centre[1] - FH / 2 - 0.42 * (k / 0.8), 0]} scale={k}>
      <MurSeyes position={[0, 1.6, -1.7]} taille={[3.2, 3.4, 0.1]} couleur={allume ? C.mur : "#140f30"} />
      <MurSeyes position={[-1.55, 1.6, -0.85]} taille={[0.1, 3.4, 1.8]} couleur={allume ? "#221a55" : "#100c26"} />
      <MurSeyes position={[1.55, 1.6, -0.85]} taille={[0.1, 3.4, 1.8]} couleur={allume ? "#221a55" : "#100c26"} />
      <mesh position={[0, 0, -0.85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.8]} />
        <Facette color={C.sol} />
      </mesh>
      <mesh position={[0, 3.25, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.8]} />
        <Facette color="#150f33" />
      </mesh>
      {allume && <PostIts position={[cote * 0.75, 1.55, -1.64]} />}
      <group rotation={[0, cote === 1 ? 0 : Math.PI, 0]} position={[-0.35 * cote, 0, -0.75]}>
        {def.perso ? <Personnage {...def.perso} /> : null}
        <Bureau position={[0.75, 0, 0]} longueur={1.3} />
        <Ordinateur position={[0.72, 0.79, 0.05]} eteint={!allume} />
        <Lampe position={[0.95, 0.785, -0.45]} intensite={allume ? 0.6 : 0} ombre={false} />
      </group>
      {allume && <pointLight position={[0, 2.2, -0.3]} color={lumiere} intensity={2.2 + lien * 2} distance={4} decay={1.6} />}
    </group>
  );
};

/** Courbe du fil entre deux fenêtres : il sort vers la caméra puis revient. */
function courbeFil(a: [number, number], b: [number, number]) {
  const A = new THREE.Vector3(a[0], a[1] - 0.2, 0.15);
  const B = new THREE.Vector3(b[0], b[1] - 0.2, 0.15);
  const p1 = A.clone().lerp(B, 0.3).add(new THREE.Vector3(0.9, 0.25, 0.9));
  const p2 = A.clone().lerp(B, 0.7).add(new THREE.Vector3(0.6, 0.25, 1.0));
  return new THREE.CatmullRomCurve3([A, p1, p2, B]);
}

const Fil: React.FC<{ a: [number, number]; b: [number, number]; progression: number; mascotte?: VarianteMascotte }> = ({ a, b, progression, mascotte }) => {
  const halo = usePointDoux();
  const { geo, courbe } = useMemo(() => {
    const courbe = courbeFil(a, b);
    return { geo: new THREE.TubeGeometry(courbe, 120, 0.022, 6, false), courbe };
  }, [a.join(), b.join()]);
  const p = Math.max(0.001, Math.min(1, progression));
  geo.setDrawRange(0, Math.floor((geo.index!.count * p) / 6) * 6);
  const tete = courbe.getPoint(p);
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color={C.citron} toneMapped={false} />
      </mesh>
      <sprite position={tete} scale={0.55}>
        <spriteMaterial map={halo} color={C.citron} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      {mascotte && (
        // à l'arrivée, Orbi se pose à côté de la fenêtre (et non devant l'étudiant)
        <Mascotte variante={mascotte} position={[tete.x + 0.05 + 0.95 * p ** 4, tete.y + 0.22 + 0.45 * p ** 4, tete.z + 0.2 * p ** 4]} echelle={0.75} />
      )}
    </group>
  );
};

export type FacadeProps = {
  fenetres: FenetreDef[];
  fils?: FilDef[];
  /** Largeur et hauteur des fenêtres. */
  taille?: [number, number];
  mascotte?: VarianteMascotte;
  voisins?: "normal" | "eteints";
  children?: React.ReactNode;
};

/** Scène complète : ciel, ville au loin, façade, chambres, fils. */
export const SceneFacade: React.FC<FacadeProps> = ({ fenetres, fils = [], taille = [1.5, 1.3], mascotte = "orbi", voisins = "normal", children }) => {
  const liens = fenetres.map((def, i) =>
    Math.max(def.lien ?? 0, ...fils.filter((l) => l.de === i || l.vers === i).map((l) => Math.max(0, Math.min(1, (l.progression - 0.85) / 0.15)))),
  );
  const actifs = fils.filter((l) => l.progression > 0);
  const dernier = actifs[actifs.length - 1];
  return (
    <group>
      <color attach="background" args={[C.nuit]} />
      <fog attach="fog" args={[C.nuit, 12, 40]} />
      <hemisphereLight args={["#6a55c8", "#120c2c", 0.45]} />
      <directionalLight position={[3, 6, 6]} color="#b3a0ff" intensity={0.55} />
      <group position={[0, -1, -6]}>
        <Ville />
      </group>
      <Facade fenetres={fenetres} taille={taille} liens={liens} voisins={voisins} />
      {fenetres.map((def, i) => (
        <Piece key={i} def={def} taille={taille} lien={liens[i]} />
      ))}
      {actifs.map((l, i) => (
        <Fil key={i} a={fenetres[l.de].centre} b={fenetres[l.vers].centre} progression={l.progression} mascotte={l === dernier ? mascotte : undefined} />
      ))}
      {children}
    </group>
  );
};
