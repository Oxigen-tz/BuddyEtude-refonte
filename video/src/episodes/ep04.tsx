// Épisode 4 — « Le binôme fantôme » : groupe de projet mort, Théo qui ne répond jamais, puis les Groupes.
import React from "react";
import { Picto } from "../engine/Accessoires";
import { BAS, HAUT, camille, hugo, lea, sarah, script } from "./distribution";

const QUATRE: [number, number][] = [
  [-0.6, 4.4],
  [0.65, 4.4],
  [-0.6, 2.45],
  [0.65, 2.45],
];

export default script("ep04", [
  {
    type: "chambre",
    de: 0,
    a: 3,
    acteur: camille([{ t: 0, pose: "telephone", expression: "neutre" }, { t: 1.8, expression: "inquiet" }]),
  },
  {
    type: "ui",
    de: 3,
    a: 8,
    mascotte: false,
    carte: {
      type: "chatGenerique",
      groupe: "Projet éco 📊",
      compteur: 87,
      messages: [
        { auteur: "Lou", texte: "qqn a commencé ??" },
        { auteur: "Max", texte: "jsp 😅" },
        { auteur: "Jade", texte: "on fait ça demain" },
        { auteur: "Lou", texte: "🐸🐸🐸" },
        { auteur: "Max", texte: "mdr" },
        { auteur: "Jade", texte: "on est foutus" },
        { auteur: "Lou", texte: "c'est pour quand déjà ?" },
        { auteur: "Max", texte: "vendredi je crois" },
        { auteur: "Jade", texte: "bonne nuit 😴" },
        { auteur: "Lou", texte: "😭😭" },
        { auteur: "Max", texte: "qqn a le sujet ?" },
        { auteur: "Jade", texte: "?" },
      ],
    },
  },
  {
    type: "facade",
    de: 8,
    a: 12,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "telephone", expression: "inquiet" }]) },
      { centre: BAS, cote: -1, eteinte: true, etiquette: "Théo · vu à 14:02" },
    ],
  },
  {
    type: "chambre",
    de: 12,
    a: 15,
    acteur: camille([{ t: 0, pose: "tete-mains", expression: "fatigue" }]),
  },
  {
    type: "chambre",
    de: 15,
    a: 17,
    acteur: camille([{ t: 0, pose: "tete-mains", expression: "fatigue" }, { t: 0.4, pose: "repos", expression: "surpris", regard: 0.75 }]),
    mascotte: { t: 0.15 },
  },
  {
    type: "ui",
    de: 17,
    a: 23,
    carte: {
      type: "groupe",
      nom: "Partiels de L2 éco",
      matiere: "Macro",
      membres: [
        { nom: "Camille", couleur: "#7a55ff", t: 0.2 },
        { nom: "Léa", couleur: "#e8558f", t: 1.8 },
        { nom: "Hugo", couleur: "#2f9d7e", t: 2.9 },
        { nom: "Sarah", couleur: "#e0a33a", t: 4.0 },
      ],
    },
  },
  {
    type: "ui",
    de: 23,
    a: 26,
    carte: {
      type: "messages",
      avec: "Partiels de L2 éco",
      sous: "4 membres",
      couleur: "#6438F5",
      messages: [
        { t: 0.2, auteur: "Léa", texte: "J'ai fait le plan 📄" },
        { t: 1.0, auteur: "Hugo", texte: "Je prends la partie 2" },
        { t: 1.8, auteur: "Sarah", texte: "Tableau blanc à 18 h ?" },
        { t: 2.4, moi: true, texte: "Go !" },
      ],
    },
  },
  {
    type: "ui",
    de: 26,
    a: 29,
    carte: {
      type: "tableau",
      titre: "Partiels de L2 éco",
      traces: [
        { type: "texte", x: 5, y: 5, contenu: "1. Offre / demande", couleur: "#e8558f", t: 0.1, duree: 0.7, auteur: "Léa" },
        { type: "trait", d: "M50 60 L90 18", couleur: "#2f9d7e", t: 0.5, duree: 0.8, largeur: 0.8, auteur: "Hugo", x: 82, y: 22 },
        { type: "trait", d: "M50 18 L90 60", couleur: "#e0a33a", t: 0.9, duree: 0.8, largeur: 0.8, auteur: "Sarah", x: 52, y: 22 },
        { type: "texte", x: 5, y: 22, contenu: "2. Équilibre", couleur: "#7a55ff", t: 1.4, duree: 0.6, auteur: "Camille" },
        { type: "entoure", cx: 70, cy: 39, rx: 5, ry: 4, t: 2.1, duree: 0.4 },
      ],
    },
  },
  {
    type: "facade",
    de: 29,
    a: 35,
    camera: { position: [0.05, 3.4, 7.0], cible: [0.05, 3.45, 0], derive: 1.2 },
    taille: [1.1, 1.0],
    fenetres: [
      { centre: QUATRE[0], cote: 1, acteur: camille([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }]) },
      { centre: QUATRE[1], cote: -1, acteur: lea([{ t: 0, pose: "ecrit", expression: "content" }]) },
      { centre: QUATRE[2], cote: 1, acteur: hugo([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }]) },
      { centre: QUATRE[3], cote: -1, acteur: sarah([{ t: 0, pose: "clavier", frappe: 1 }, { t: 3.5, pose: "victoire", expression: "content" }]) },
    ],
    fils: [
      { de: 0, vers: 1, t: 0.2, duree: 1.1 },
      { de: 0, vers: 2, t: 0.8, duree: 1.1 },
      { de: 0, vers: 3, t: 1.4, duree: 1.1 },
    ],
  },
  {
    type: "facade",
    de: 35,
    a: 40,
    camera: { position: [0.4, 2.55, 4.6], cible: [0.4, 2.45, 0], derive: 1.2 },
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "victoire", expression: "content" }]) },
      { centre: BAS, cote: -1, eteinte: true, etiquette: "Théo · vu à 14:02" },
    ],
    extra: <Picto texte="💤" position={[1.0, 2.2, 0.4]} de={1} taille={0.3} />,
  },
]);
