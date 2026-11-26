// Moteur d'épisode : un épisode = une liste de plans + les répliques (bulle + narration).
// Chaque plan est rendu dans sa propre séquence ; la fin signature est ajoutée automatiquement.
import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Camera, Chambre, Particules } from "./Decor";
import { Amphi, BU } from "./Lieux";
import { CIBLE_FACADE, FenetreDef, SceneFacade } from "./Facade";
import { Coiffure, Expression, Personnage, Pose, Tenue } from "./Personnage";
import { HumeurMascotte, Mascotte } from "./Mascotte";
import { CarteDef, CarteUI } from "./CarteUI";
import { Finition, ZONE } from "./SousTitre";
import { BulleTexte, FinSignature } from "./Signature";
import { V3, lisse } from "./outils3d";
import { C } from "./palette";

/* ------------------------------------------------------------------ types */

/** Changement d'état d'un personnage à l'instant t (secondes, relatif au plan). */
export type Etat = { t: number; pose?: Pose; expression?: Expression; regard?: number; inclinaison?: number; frappe?: number };
export type Acteur = { id: string; tenue: Tenue; coiffure?: Coiffure; position?: V3; rotationY?: number; chaise?: boolean; etats: Etat[] };
export type Cam = { position: V3; cible: V3; fov?: number; derive?: number };
export type MascotteDef = { t: number; position?: V3; rotationY?: number; humeur?: HumeurMascotte; echelle?: number };
export type Incrust = { carte: CarteDef; de?: number; y?: number; echelle?: number };

type Commun = { de: number; a: number; camera?: Cam; incrust?: Incrust; extra?: React.ReactNode };
export type Plan =
  | (Commun & {
      type: "facade";
      fenetres: (Omit<FenetreDef, "perso"> & { acteur?: Acteur })[];
      fils?: { de: number; vers: number; t: number; duree?: number }[];
      taille?: [number, number];
      voisins?: "normal" | "eteints";
    })
  | (Commun & { type: "chambre"; acteur: Acteur; mascotte?: MascotteDef; ambiance?: "nuit" | "sombre"; lampe?: number })
  | (Commun & { type: "amphi"; acteurs: Acteur[]; mascotte?: MascotteDef })
  | (Commun & { type: "bu"; acteur: Acteur; mascotte?: MascotteDef })
  | (Commun & { type: "ui"; carte: CarteDef; mascotte?: boolean })
  | (Commun & { type: "noir" });

export type Ligne = { de: number; a: number; bulle?: string; voix?: string; rythme?: number[] };
export type Script = { id: string; titre: string; duree: number; plans: Plan[]; lignes: Ligne[] };

/* ------------------------------------------------------------------ outils */

/** État d'un personnage à l'instant t : changements discrets, regard et inclinaison lissés. */
function etatA(acteur: Acteur, t: number) {
  const tries = [...acteur.etats].sort((a, b) => a.t - b.t);
  const res: Required<Omit<Etat, "t">> = { pose: "clavier", expression: "neutre", regard: 0, inclinaison: 0, frappe: 0 };
  let regardAvant = 0;
  let inclAvant = 0;
  for (const e of tries) {
    if (e.t > t) break;
    if (e.regard !== undefined) {
      const k = lisse((t - e.t) / 0.4);
      regardAvant = res.regard;
      res.regard = regardAvant + (e.regard - regardAvant) * k;
    }
    if (e.inclinaison !== undefined) {
      const k = lisse((t - e.t) / 0.4);
      inclAvant = res.inclinaison;
      res.inclinaison = inclAvant + (e.inclinaison - inclAvant) * k;
    }
    if (e.pose) res.pose = e.pose;
    if (e.expression) res.expression = e.expression;
    if (e.frappe !== undefined) res.frappe = e.frappe;
  }
  return res;
}

const ActeurAnime: React.FC<{ acteur: Acteur; t: number }> = ({ acteur, t }) => {
  const e = etatA(acteur, t);
  return (
    <Personnage
      id={acteur.id}
      tenue={acteur.tenue}
      coiffure={acteur.coiffure}
      position={acteur.position}
      rotationY={acteur.rotationY}
      chaise={acteur.chaise}
      pose={e.pose}
      expression={e.expression}
      regard={e.regard}
      inclinaison={e.inclinaison}
      frappe={e.frappe}
    />
  );
};

const MascotteAnimee: React.FC<{ def: MascotteDef; t: number; fps: number; f: number; defaut: V3 }> = ({ def, t, fps, f, defaut }) => {
  if (t < def.t) return null;
  const s = spring({ frame: f - def.t * fps, fps, config: { damping: 9, stiffness: 140 } });
  return <Mascotte variante="orbi" position={def.position ?? defaut} rotationY={def.rotationY ?? 0.4} echelle={(def.echelle ?? 1) * (0.3 + 0.7 * s)} humeur={def.humeur} />;
};

const GL = { antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 };

const Toile: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows gl={GL} camera={{ fov: 40, near: 0.05, far: 80 }}>
      {children}
    </ThreeCanvas>
  );
};

const CAMERAS: Record<string, Cam> = {
  facade: { position: [0.1, 3.5, 6.7], cible: CIBLE_FACADE, derive: 1.4 },
  chambre: { position: [3.0, 1.75, 3.2], cible: [0.25, 1.2, -0.35] },
  amphi: { position: [0, 1.5, 3.6], cible: [0, 1.22, 0], derive: 0.8 },
  bu: { position: [2.9, 1.7, 3.0], cible: [0.3, 1.15, -0.3] },
};

/* ------------------------------------------------------------------ plans */

const Plan3D: React.FC<{ plan: Plan }> = ({ plan }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cam = plan.camera ?? CAMERAS[plan.type];
  const camera = cam && <Camera position={cam.position} cible={cam.cible} fov={cam.fov ?? 40} derive={cam.derive ?? 1} />;
  switch (plan.type) {
    case "facade": {
      const fenetres: FenetreDef[] = plan.fenetres.map(({ acteur, ...reste }) => ({ ...reste, perso: acteur ? { ...etatA(acteur, t), id: acteur.id, tenue: acteur.tenue, coiffure: acteur.coiffure } : undefined }));
      const fils = (plan.fils ?? []).map((l) => ({ de: l.de, vers: l.vers, progression: t < l.t ? 0 : lisse((t - l.t) / (l.duree ?? 1.4)) }));
      return (
        <Toile>
          {camera}
          <SceneFacade fenetres={fenetres} fils={fils} taille={plan.taille} voisins={plan.voisins}>
            {plan.extra}
          </SceneFacade>
        </Toile>
      );
    }
    case "chambre":
      return (
        <Toile>
          {camera}
          <Chambre ambiance={plan.ambiance} lampe={plan.lampe}>
            <ActeurAnime acteur={plan.acteur} t={t} />
            {plan.mascotte && <MascotteAnimee def={plan.mascotte} t={t} f={f} fps={fps} defaut={[0.55, 1.62, -0.75]} />}
            {plan.extra}
          </Chambre>
        </Toile>
      );
    case "amphi":
      return (
        <Toile>
          {camera}
          <Amphi>
            {plan.acteurs.map((a) => (
              <ActeurAnime key={a.id} acteur={a} t={t} />
            ))}
            {plan.mascotte && <MascotteAnimee def={plan.mascotte} t={t} f={f} fps={fps} defaut={[0, 2.1, 0.3]} />}
            {plan.extra}
          </Amphi>
        </Toile>
      );
    case "bu":
      return (
        <Toile>
          {camera}
          <BU>
            <ActeurAnime acteur={plan.acteur} t={t} />
            {plan.mascotte && <MascotteAnimee def={plan.mascotte} t={t} f={f} fps={fps} defaut={[0.55, 1.62, -0.75]} />}
            {plan.extra}
          </BU>
        </Toile>
      );
    case "ui":
      return (
        <Toile>
          <Camera position={[0, 0, 5]} cible={[0, 0, 0]} derive={0} />
          <color attach="background" args={[C.nuit]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 4]} intensity={1.5} />
          <Particules nombre={160} centre={[0, 0, -1]} taille={[5, 6, 2]} />
          {plan.mascotte !== false && <Mascotte variante="orbi" position={[-0.9, -1.38, 0.5]} rotationY={0.5} echelle={0.9} />}
        </Toile>
      );
    default:
      return null;
  }
};

const PlanRendu: React.FC<{ plan: Plan }> = ({ plan }) => {
  // pas de fondu sur le tout premier plan : l'accroche est visible dès la 1re image (et sert de couverture)
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fondu = plan.de === 0 ? 1 : interpolate(f, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.nuit }}>
      <AbsoluteFill style={{ opacity: fondu }}>
        {plan.type === "ui" && (
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 45%, #3b22a8 0%, ${C.nuit} 70%)` }} />
        )}
        {plan.type !== "noir" && <Plan3D plan={plan} />}
        {plan.type === "ui" && (
          <AbsoluteFill style={{ top: 470, height: 1140, alignItems: "center", justifyContent: "center", paddingRight: 1080 - ZONE.droite - ZONE.gauche }}>
            <CarteUI def={plan.carte} />
          </AbsoluteFill>
        )}
        {plan.incrust && f >= (plan.incrust.de ?? 0) * fps && (
          <Sequence from={Math.round((plan.incrust.de ?? 0) * fps)} layout="none">
            <div
              style={{
                position: "absolute",
                top: plan.incrust.y ?? 980,
                left: ZONE.gauche,
                width: ZONE.droite - ZONE.gauche,
                display: "flex",
                justifyContent: "center",
                transform: `scale(${plan.incrust.echelle ?? 0.78})`,
                transformOrigin: "50% 0%",
              }}
            >
              <CarteUI def={plan.incrust.carte} />
            </div>
          </Sequence>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ épisode */

export const Episode: React.FC<{ script: Script }> = ({ script }) => {
  const { fps } = useVideoConfig();
  const fin = Math.round((script.duree - 2) * fps);
  return (
    <AbsoluteFill style={{ background: C.nuit }}>
      {script.plans.map((p, i) => (
        <Sequence key={i} from={Math.round(p.de * fps)} durationInFrames={Math.max(1, Math.round((p.a - p.de) * fps))}>
          <PlanRendu plan={p} />
        </Sequence>
      ))}
      <Finition />
      <BulleTexte phrases={script.lignes.filter((l) => l.bulle).map((l) => ({ de: l.de, a: l.a, texte: l.bulle! }))} />
      <FinSignature debut={fin} />
    </AbsoluteFill>
  );
};
