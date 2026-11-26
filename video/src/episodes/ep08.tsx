// Épisode 8 — « 5 erreurs » : Camille commet les cinq erreurs une par une ; la session planifiée en règle deux.
import React from "react";
import { Feuille, Picto, TelephoneBureau } from "../engine/Accessoires";
import { BAS, HAUT, camille, lea, script } from "./distribution";

const PROCHE = { position: [2.45, 1.8, 2.45] as [number, number, number], cible: [0.3, 1.3, -0.1] as [number, number, number] };

export default script("ep08", [
  {
    type: "chambre",
    de: 0,
    a: 2.5,
    acteur: camille([{ t: 0, pose: "repos", expression: "neutre" }]),
    extra: <Picto texte="❌" position={[0.7, 1.62, -0.15]} de={0.3} taille={0.5} fond="none" />,
  },
  {
    type: "chambre",
    de: 2.5,
    a: 8,
    camera: PROCHE,
    acteur: camille([{ t: 0, pose: "repos", expression: "neutre", inclinaison: 0.3 }, { t: 2.5, expression: "fatigue" }]),
    extra: (
      <>
        <Feuille position={[0.42, 0.792, 0.42]} rotation={0.2} />
        <Picto texte="🔁" position={[0.2, 1.9, 0.1]} de={0.6} a={2.4} taille={0.26} />
        <Picto texte="😴" position={[0.2, 1.9, 0.1]} de={3} taille={0.26} />
      </>
    ),
  },
  {
    type: "chambre",
    de: 8,
    a: 13,
    camera: { position: [1.3, 1.5, 1.45], cible: [0.42, 0.86, 0.38], derive: 0.5 },
    acteur: camille([{ t: 0, pose: "ecrit", expression: "content" }]),
    extra: <Feuille position={[0.42, 0.792, 0.42]} rotation={0.2} anime={[0.4, 3.8]} />,
  },
  {
    type: "chambre",
    de: 13,
    a: 18,
    camera: PROCHE,
    acteur: camille([{ t: 0, pose: "clavier", frappe: 1, expression: "neutre" }, { t: 1.3, regard: -0.4 }, { t: 2.2, pose: "telephone", regard: 0, expression: "content" }]),
    extra: (
      <>
        <TelephoneBureau position={[0.5, 0.795, 0.42]} vibreDe={0.3} vibreA={2.0} />
        <Picto texte="📳" position={[0.5, 1.15, 0.5]} de={0.3} a={2.0} taille={0.2} />
      </>
    ),
  },
  {
    type: "ui",
    de: 18,
    a: 23,
    carte: {
      type: "calendrier",
      partiel: "Partiel lundi 8 h",
      blocs: ["Ch. 1", "Ch. 2", "Ch. 3", "Ch. 4", "Ch. 5", "Ch. 6", "Ch. 7"].map((label, i) => ({ label, t: 0.5 + i * 0.4 })),
    },
  },
  {
    type: "chambre",
    de: 23,
    a: 27,
    acteur: camille([{ t: 0, pose: "tete-mains", expression: "fatigue" }]),
    mascotte: { t: 2.2 },
    extra: <Picto texte="?" position={[0.15, 1.95, 0.05]} de={0.3} />,
  },
  {
    type: "facade",
    de: 27,
    a: 30,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "repos", expression: "content", regard: 0.4 }]) },
      { centre: BAS, cote: -1, acteur: lea([{ t: 0, pose: "ecrit" }, { t: 1.8, pose: "repos", expression: "content", regard: 0.5 }]) },
    ],
    fils: [{ de: 0, vers: 1, t: 0.2, duree: 1.6 }],
  },
  { type: "ui", de: 30, a: 35, carte: { type: "session", titre: "Révision d'analyse", avec: "Léa", quand: "Jeudi · 18:00" } },
  {
    type: "chambre",
    de: 35,
    a: 38,
    acteur: camille([{ t: 0, pose: "clavier", frappe: 0.6, expression: "content" }]),
    mascotte: { t: 0, humeur: "content" },
  },
]);
