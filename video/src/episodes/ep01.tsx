// Épisode 1 — « 23 h 47 » : Camille révise seule la veille de son partiel, bloque, et trouve Léa.
import React from "react";
import { Picto } from "../engine/Accessoires";
import { BAS, HAUT, camille, lea, script } from "./distribution";

const integrale = [
  { type: "texte" as const, x: 6, y: 6, contenu: "∫ x·eˣ dx = ?", couleur: "#14102e", t: 0.2, duree: 0.8 },
  { type: "texte" as const, x: 6, y: 22, contenu: "IPP : u = x , v' = eˣ", couleur: "#e8558f", t: 1.4, duree: 1.1, auteur: "Léa" },
  { type: "texte" as const, x: 6, y: 38, contenu: "= x·eˣ − ∫ eˣ dx", couleur: "#7a55ff", t: 2.8, duree: 1, auteur: "Camille" },
  { type: "texte" as const, x: 6, y: 53, contenu: "= x·eˣ − eˣ + C", couleur: "#7a55ff", t: 4.0, duree: 0.9 },
  { type: "entoure" as const, cx: 30, cy: 59, rx: 27, ry: 7, t: 5.0, duree: 0.5 },
];

export default script("ep01", [
  {
    type: "facade",
    de: 0,
    a: 2.5,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "clavier", frappe: 1, expression: "fatigue" }]) },
      { centre: BAS, cote: -1, acteur: lea([{ t: 0, pose: "ecrit", expression: "neutre" }]) },
    ],
  },
  {
    type: "facade",
    de: 2.5,
    a: 5,
    camera: { position: [-0.25, 4.0, 4.3], cible: [-0.3, 3.95, 0], derive: 2 },
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "clavier", frappe: 1, expression: "fatigue" }]) },
      { centre: BAS, cote: -1, acteur: lea([{ t: 0, pose: "ecrit" }]) },
    ],
  },
  {
    type: "chambre",
    de: 5,
    a: 11,
    acteur: camille([
      { t: 0, pose: "tete-mains", expression: "fatigue" },
      { t: 3, pose: "telephone", expression: "inquiet" },
    ]),
    extra: <Picto texte="?" position={[0.15, 1.95, 0.05]} de={0.6} a={2.9} />,
  },
  {
    type: "chambre",
    de: 11,
    a: 13.5,
    acteur: camille([
      { t: 0, pose: "telephone", expression: "inquiet" },
      { t: 0.5, pose: "repos", expression: "surpris", regard: 0.75 },
      { t: 1.6, expression: "content" },
    ]),
    mascotte: { t: 0.2 },
  },
  {
    type: "ui",
    de: 13.5,
    a: 19,
    carte: {
      type: "recherche",
      requete: "Analyse",
      choisi: 0,
      tChoisi: 4.3,
      profils: [
        { nom: "Léa", niveau: "Licence · Mathématiques", badges: ["2 matières en commun", "Même niveau", "Même école"], couleur: "#e8558f", verifie: true },
        { nom: "Hugo", niveau: "Licence · Physique", badges: ["1 matière en commun"], couleur: "#2f9d7e" },
        { nom: "Sarah", niveau: "Licence · Droit", badges: ["Même école"], couleur: "#e0a33a" },
      ],
    },
  },
  {
    type: "facade",
    de: 19,
    a: 22,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "repos", expression: "content", regard: 0.4 }]) },
      { centre: BAS, cote: -1, acteur: lea([{ t: 0, pose: "ecrit" }, { t: 2.2, pose: "repos", expression: "surpris", regard: 0.5 }]) },
    ],
    fils: [{ de: 0, vers: 1, t: 0.3, duree: 2 }],
  },
  {
    type: "ui",
    de: 22,
    a: 26,
    carte: {
      type: "messages",
      avec: "Léa",
      couleur: "#e8558f",
      notif: { t: 0.15, titre: "Demande acceptée 🎉", texte: "Léa a accepté votre demande de binôme !" },
      messages: [
        { t: 1.2, moi: true, texte: "On attaque les intégrales ?" },
        { t: 2.5, texte: "Carrément ! Tableau blanc dans 5 min 🙌" },
      ],
    },
  },
  {
    type: "chambre",
    de: 26,
    a: 32,
    camera: { position: [3.1, 2.25, 3.0], cible: [0.3, 1.45, -0.35] },
    acteur: camille([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }]),
    mascotte: { t: 0, humeur: "content", position: [0.9, 1.72, -0.75], rotationY: 0.5, echelle: 0.8 },
    incrust: { de: 0.3, y: 1000, echelle: 0.74, carte: { type: "tableau", titre: "Tableau blanc", traces: integrale, mini: true } },
  },
  {
    type: "facade",
    de: 32,
    a: 35.5,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }, { t: 1.5, pose: "victoire" }]) },
      { centre: BAS, cote: -1, acteur: lea([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }, { t: 1.7, pose: "victoire" }]) },
    ],
    fils: [{ de: 0, vers: 1, t: -3 }],
  },
  {
    type: "facade",
    de: 35.5,
    a: 38,
    camera: { position: [0.1, 3.5, 6.2], cible: [0.05, 3.5, 0], derive: -2.5 },
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "repos", expression: "content", regard: 0.5 }]) },
      { centre: BAS, cote: -1, acteur: lea([{ t: 0, pose: "repos", expression: "content", regard: 0.5 }]) },
    ],
    fils: [{ de: 0, vers: 1, t: -3 }],
  },
]);
