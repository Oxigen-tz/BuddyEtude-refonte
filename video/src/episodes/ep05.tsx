// Épisode 5 — « Deux versions » : la même soirée, fenêtre du haut seule, fenêtre du bas à deux.
import React from "react";
import { Picto } from "../engine/Accessoires";
import { Mascotte } from "../engine/Mascotte";
import { Cam, Etat, Incrust, Plan } from "../engine/Episode";
import { BAS, HAUT, camille, script } from "./distribution";

const CAM_HAUT: Cam = { position: [-0.3, 4.08, 3.4], cible: [-0.3, 4.03, 0], fov: 34, derive: 1 };
const CAM_BAS: Cam = { position: [0.4, 1.85, 3.4], cible: [0.4, 1.75, 0], derive: 1 };

/** Les deux fenêtres : en haut « SEULE », en bas « À DEUX » (c'est la même Camille). */
const versions = (seule: Etat[], aDeux: Etat[]) => [
  { centre: HAUT, cote: 1 as const, etiquette: "SEULE", acteur: camille(seule) },
  { centre: BAS, cote: -1 as const, etiquette: "À DEUX", lien: 1, acteur: { ...camille(aDeux), id: "camille2" } },
];

/** Une heure de la soirée : 2,2 s sur la fenêtre du haut, puis le reste sur celle du bas (avec une carte). */
const heure = (de: number, a: number, seule: Etat[], aDeux: Etat[], carte: Incrust["carte"], extraHaut?: React.ReactNode, extraBas?: React.ReactNode): Plan[] => [
  { type: "facade", de, a: de + 2.2, camera: CAM_HAUT, fenetres: versions(seule, aDeux), extra: extraHaut },
  {
    type: "facade",
    de: de + 2.2,
    a,
    camera: CAM_BAS,
    fenetres: versions(seule, aDeux),
    incrust: { de: 0.2, y: 1130, echelle: 0.74, carte },
    extra: extraBas,
  },
];

export default script("ep05", [
  {
    type: "facade",
    de: 0,
    a: 2.5,
    fenetres: versions([{ t: 0, pose: "repos", expression: "fatigue", inclinaison: 0.25 }], [{ t: 0, pose: "clavier", frappe: 1, expression: "content" }]),
  },
  ...heure(
    2.5,
    7,
    [{ t: 0, pose: "repos", expression: "fatigue", inclinaison: 0.3 }],
    [{ t: 0, pose: "clavier", frappe: 1, expression: "content" }],
    { type: "messages", avec: "Léa", couleur: "#e8558f", messages: [{ t: 0.2, moi: true, texte: "On fait le chap. 3 ?" }, { t: 1.2, texte: "Go 🙌" }] },
  ),
  ...heure(7, 12, [{ t: 0, pose: "telephone", expression: "content" }], [{ t: 0, pose: "repos", expression: "content", regard: -0.3 }], { type: "appel", avec: "Léa", moi: "Camille" }),
  ...heure(
    12,
    17,
    [{ t: 0, pose: "telephone", expression: "fatigue" }],
    [{ t: 0, pose: "ecrit", expression: "content" }],
    {
      type: "tableau",
      pdf: { tImport: -9 },
      traces: [
        { type: "trait", d: "M8 30 L55 30", couleur: "#7a55ff", t: 0.3, duree: 0.6, largeur: 0.9, auteur: "Camille", x: 30, y: 30 },
        { type: "texte", x: 58, y: 20, contenu: "à revoir !", couleur: "#e8558f", t: 1.0, duree: 0.7, auteur: "Léa" },
      ],
    },
  ),
  {
    type: "facade",
    de: 17,
    a: 19.3,
    camera: CAM_HAUT,
    fenetres: versions([{ t: 0, pose: "tete-mains", expression: "fatigue" }], [{ t: 0, pose: "victoire", expression: "content" }]),
    extra: <Picto texte="?" position={[-0.25, 4.65, 0.3]} de={0.3} taille={0.26} />,
  },
  {
    type: "facade",
    de: 19.3,
    a: 22,
    camera: CAM_BAS,
    fenetres: versions([{ t: 0, pose: "tete-mains", expression: "fatigue" }], [{ t: 0, pose: "victoire", expression: "content" }]),
    extra: <Picto texte="💡" position={[0.5, 2.55, 0.3]} de={0.3} taille={0.26} />,
  },
  {
    type: "ui",
    de: 22,
    a: 27,
    carte: {
      type: "bilan",
      lignes: [
        { titre: "SEULE", valeur: "1 exercice", t: 0.3 },
        { titre: "À DEUX", valeur: "Chapitre bouclé ✅", citron: true, t: 1.4 },
      ],
    },
  },
  {
    type: "facade",
    de: 27,
    a: 32,
    fenetres: versions([{ t: 0, pose: "tete-mains", expression: "fatigue" }], [{ t: 0, pose: "repos", expression: "content", regard: 0.5 }]),
    extra: <Mascotte variante="orbi" position={[1.25, 3.15, 0.7]} rotationY={-0.2} echelle={0.8} />,
  },
]);
