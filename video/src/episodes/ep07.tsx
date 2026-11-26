// Épisode 7 — « Le PDF » : Camille et Léa, chacune chez elle, annotent le même cours en direct.
import React from "react";
import { Picto } from "../engine/Accessoires";
import { TraceUI } from "../engine/CarteUI";
import { Etat } from "../engine/Episode";
import { BAS, HAUT, camille, lea, script } from "./distribution";

const duo = (c: Etat[], l: Etat[]) => [
  { centre: HAUT, cote: 1 as const, acteur: camille(c) },
  { centre: BAS, cote: -1 as const, acteur: lea(l) },
];

const annotations = (t0: number): TraceUI[] => [
  { type: "trait", d: "M8 28 L52 28", couleur: "#7a55ff", t: t0, duree: 0.6, largeur: 0.9, auteur: "Camille", x: 30, y: 28 },
  { type: "texte", x: 8, y: 44, contenu: "mitochondrie = énergie", couleur: "#7a55ff", t: t0 + 0.8, duree: 1.2, auteur: "Camille" },
  { type: "entoure", cx: 77, cy: 36, rx: 16, ry: 14, couleur: "#e8558f", t: t0 + 2.4, duree: 0.7 },
  { type: "texte", x: 64, y: 54, contenu: "→ ATP !", couleur: "#e8558f", t: t0 + 3.1, duree: 0.7, auteur: "Léa" },
];

export default script("ep07", [
  { type: "ui", de: 0, a: 2.5, carte: { type: "tableau", titre: "Bio cell", pdf: { tImport: -9 }, traces: annotations(-6) } },
  {
    type: "chambre",
    de: 2.5,
    a: 6,
    acteur: camille([{ t: 0, pose: "clavier", frappe: 0.5, expression: "neutre" }, { t: 1, pose: "gratte", expression: "inquiet" }]),
    extra: <Picto texte="😵" position={[0.15, 1.95, 0.05]} de={1.2} />,
  },
  { type: "facade", de: 6, a: 10, fenetres: duo([{ t: 0, pose: "clavier", frappe: 1, expression: "inquiet" }], [{ t: 0, pose: "clavier", frappe: 1, expression: "inquiet" }]) },
  { type: "ui", de: 10, a: 14, carte: { type: "tableau", titre: "Bio cell", pdf: { tImport: 0.5 }, traces: [] } },
  { type: "ui", de: 14, a: 18.5, carte: { type: "tableau", titre: "Bio cell", pdf: { tImport: -9 }, traces: annotations(0.2) } },
  {
    type: "facade",
    de: 18.5,
    a: 21,
    fenetres: duo([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }], [{ t: 0, pose: "ecrit", expression: "content" }]),
    fils: [{ de: 0, vers: 1, t: 0, duree: 1.3 }],
  },
  {
    type: "ui",
    de: 21,
    a: 26,
    carte: {
      type: "tableau",
      titre: "Bio cell",
      pdf: { tImport: -9 },
      page: { t: 1.0 },
      exporter: 3.4,
      traces: [...annotations(-6), { type: "texte", x: 58, y: 8, contenu: "schéma ok ✓", couleur: "#e8558f", t: 1.8, duree: 0.8, auteur: "Léa" }],
    },
  },
  {
    type: "facade",
    de: 26,
    a: 31,
    fenetres: duo([{ t: 0, pose: "victoire", expression: "content" }], [{ t: 0, pose: "repos", expression: "content", regard: 0.5 }]),
    fils: [{ de: 0, vers: 1, t: -3 }],
  },
]);
