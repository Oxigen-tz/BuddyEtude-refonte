// Épisode 3 — « Mets pause » : un quiz d'intégrale, résolu à deux en appel vidéo.
import React from "react";
import { Picto } from "../engine/Accessoires";
import { TraceUI } from "../engine/CarteUI";
import { POLICE_TITRE } from "../engine/SousTitre";
import { BAS, HAUT, camille, lea, script } from "./distribution";

const enonce: TraceUI = {
  type: "texte",
  x: 6,
  y: 6,
  t: -1,
  duree: 0.01,
  taille: 1.2,
  contenu: (
    <>
      ∫<sub style={{ fontSize: "0.55em" }}>0</sub>
      <sup style={{ fontSize: "0.55em" }}>π</sup> sin(x) dx = <span style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: "0.85em" }}>?</span>
    </>
  ),
};

const resolution: TraceUI[] = [
  enonce,
  { type: "texte", x: 6, y: 25, contenu: "primitive de sin x = −cos x", couleur: "#7a55ff", t: 0.3, duree: 1.6, auteur: "Camille" },
  {
    type: "texte",
    x: 6,
    y: 41,
    couleur: "#e8558f",
    t: 3.5,
    duree: 1.8,
    auteur: "Léa",
    contenu: (
      <>
        [−cos x]<sub style={{ fontSize: "0.55em" }}>0</sub>
        <sup style={{ fontSize: "0.55em" }}>π</sup> = −cos π + cos 0
      </>
    ),
  },
  { type: "texte", x: 6, y: 56, contenu: "= 1 + 1 = 2", couleur: "#7a55ff", t: 6.9, duree: 0.9, auteur: "Camille", taille: 1.15 },
  { type: "entoure", cx: 25, cy: 62.5, rx: 22, ry: 6.5, t: 7.9, duree: 0.6 },
];

const duo = (etatsC: Parameters<typeof camille>[0], etatsL: Parameters<typeof lea>[0]) => [
  { centre: HAUT, cote: 1 as const, acteur: camille(etatsC) },
  { centre: BAS, cote: -1 as const, acteur: lea(etatsL) },
];

export default script("ep03", [
  { type: "ui", de: 0, a: 4.4, carte: { type: "tableau", traces: [enonce] } },
  { type: "ui", de: 4.4, a: 7.4, carte: { type: "decompte" } },
  {
    type: "chambre",
    de: 7.4,
    a: 11.6,
    acteur: camille([{ t: 0, pose: "gratte", expression: "inquiet" }, { t: 2.25, pose: "tete-mains", expression: "fatigue" }]),
    extra: <Picto texte="?" position={[0.15, 1.95, 0.05]} de={0.5} />,
  },
  {
    type: "facade",
    de: 11.6,
    a: 15,
    fenetres: duo([{ t: 0, pose: "gratte", expression: "inquiet" }, { t: 1.6, pose: "repos", expression: "content", regard: 0.4 }], [{ t: 0, pose: "ecrit" }, { t: 1.8, pose: "repos", expression: "content", regard: 0.5 }]),
    fils: [{ de: 0, vers: 1, t: 0.2, duree: 1.7 }],
    incrust: { de: 1.4, y: 985, echelle: 0.62, carte: { type: "notif", titre: "Appel avec Léa", texte: "Appel vidéo intégré à BuddyEtude", icone: "🎥" } },
  },
  { type: "ui", de: 15, a: 25.6, carte: { type: "tableau", traces: resolution } },
  {
    type: "facade",
    de: 25.6,
    a: 31,
    fenetres: duo([{ t: 0, pose: "victoire", expression: "content" }], [{ t: 0, pose: "repos", expression: "content", regard: 0.5 }, { t: 0.6, pose: "victoire" }]),
    fils: [{ de: 0, vers: 1, t: -3 }],
  },
]);
