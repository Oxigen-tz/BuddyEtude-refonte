// Épisode 2 — « Les 3 types » : humour, la faune des partiels dans un amphi.
import React from "react";
import { Copie, Feuille, Picto } from "../engine/Accessoires";
import { Acteur } from "../engine/Episode";
import { RANG, camille, sarah, script, yanis } from "./distribution";

const trio = (y: Acteur["etats"], s: Acteur["etats"], c: Acteur["etats"]) => [yanis(y, RANG.g), sarah(s, RANG.c), camille(c, RANG.d)];
const feuilleYanis = (anime?: [number, number], surligne = 0) => <Feuille position={[-0.46, 0.795, 0.33]} rotation={0.1} anime={anime} surligne={surligne} />;

export default script("ep02", [
  {
    type: "amphi",
    de: 0,
    a: 2.5,
    acteurs: trio([{ t: 0, pose: "ecrit" }], [{ t: 0, pose: "repos", expression: "inquiet" }], [{ t: 0, pose: "telephone", expression: "content" }]),
    mascotte: { t: 0.3, position: [0.23, 1.66, 0.35], rotationY: -0.2, echelle: 0.5 },
    extra: feuilleYanis(undefined, 0.3),
  },
  {
    type: "amphi",
    de: 2.5,
    a: 8,
    camera: { position: [-0.46, 1.55, 2.35], cible: [-0.46, 1.32, -0.1], derive: 0.6 },
    acteurs: trio([{ t: 0, pose: "ecrit", expression: "content" }], [{ t: 0, pose: "repos", expression: "inquiet" }], [{ t: 0, pose: "telephone" }]),
    extra: feuilleYanis([0.6, 5]),
  },
  {
    type: "amphi",
    de: 8,
    a: 9.5,
    camera: { position: [-0.55, 1.2, 0.85], cible: [-0.46, 0.8, 0.33], derive: 0.3 },
    acteurs: trio([{ t: 0, pose: "ecrit", expression: "content" }], [{ t: 0, pose: "repos" }], [{ t: 0, pose: "telephone" }]),
    extra: feuilleYanis(undefined, 1),
  },
  {
    type: "amphi",
    de: 9.5,
    a: 15,
    camera: { position: [0, 1.55, 2.35], cible: [0, 1.32, -0.1], derive: 0.6 },
    acteurs: trio(
      [{ t: 0, pose: "ecrit" }, { t: 3, pose: "repos", regard: -0.6, expression: "inquiet" }],
      [{ t: 0, pose: "tete-mains", expression: "inquiet" }, { t: 3.3, pose: "repos", expression: "surpris" }, { t: 4.2, expression: "content" }],
      [{ t: 0, pose: "telephone" }, { t: 3, pose: "repos", regard: 0.6, expression: "surpris" }],
    ),
    extra: (
      <>
        {feuilleYanis(undefined, 1)}
        <Picto texte="😭" position={[0.28, 1.72, 0]} de={0.3} a={2.4} taille={0.24} />
        <Copie position={[0, 0.81, 0.33]} note="18/20" de={2.6} />
      </>
    ),
  },
  {
    type: "amphi",
    de: 15,
    a: 22,
    camera: { position: [0.46, 1.55, 2.35], cible: [0.46, 1.32, -0.1], derive: 0.6 },
    acteurs: trio([{ t: 0, pose: "ecrit" }], [{ t: 0, pose: "repos", expression: "content" }], [{ t: 0, pose: "telephone", expression: "content" }, { t: 3.5, pose: "repos", regard: -0.5 }]),
    mascotte: { t: 0.8, position: [0.82, 1.55, 0.2], rotationY: -0.4, echelle: 0.8 },
    extra: <Copie position={[0, 0.81, 0.33]} note="18/20" de={-5} />,
  },
  {
    type: "ui",
    de: 22,
    a: 28,
    carte: { type: "session", titre: "Révision d'analyse", avec: "Léa", quand: "Demain · 18:00" },
  },
  {
    type: "amphi",
    de: 28,
    a: 33,
    acteurs: trio([{ t: 0, pose: "repos", expression: "neutre" }], [{ t: 0, pose: "repos", expression: "content" }], [{ t: 0, pose: "repos", expression: "content" }]),
    mascotte: { t: 0, position: [0.23, 1.66, 0.35], rotationY: -0.2, echelle: 0.5 },
    extra: (
      <>
        {feuilleYanis(undefined, 1)}
        <Copie position={[0, 0.81, 0.33]} note="18/20" de={-5} />
        <Picto texte="?" position={[0.42, 1.88, 0.35]} de={0.5} taille={0.24} />
      </>
    ),
  },
]);
