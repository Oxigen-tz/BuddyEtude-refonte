// Épisode 9 — « Hugo » : Camille bloque en physique et demande de l'aide à un étudiant avancé.
import React from "react";
import { Fumee, Picto } from "../engine/Accessoires";
import { BAS, HAUT, camille, hugo, script } from "./distribution";

export default script("ep09", [
  {
    type: "chambre",
    de: 0,
    a: 2.5,
    acteur: camille([{ t: 0, pose: "gratte", expression: "inquiet" }]),
    extra: <Fumee position={[0.1, 1.72, 0]} de={0.2} />,
  },
  {
    type: "chambre",
    de: 2.5,
    a: 6,
    acteur: camille([{ t: 0, pose: "tete-mains", expression: "fatigue" }]),
    extra: <Fumee position={[0.15, 1.62, 0]} />,
  },
  {
    type: "ui",
    de: 6,
    a: 11,
    carte: {
      type: "recherche",
      mode: "help",
      requete: "Physique",
      choisi: 0,
      tChoisi: 4.0,
      profils: [
        { nom: "Hugo", niveau: "Licence 3 · Physique", avance: "Physique", couleur: "#2f9d7e", verifie: true },
        { nom: "Inès", niveau: "Prépa · MP", avance: "Physique", couleur: "#a98bff" },
      ],
    },
  },
  {
    type: "ui",
    de: 11,
    a: 15,
    carte: { type: "demande", aide: "Physique", nom: "Hugo", message: "Je bloque sur les ondes stationnaires, tu aurais 30 min cette semaine ?", tEnvoi: 3.3 },
  },
  {
    type: "bu",
    de: 15,
    a: 20,
    acteur: hugo([{ t: 0, pose: "clavier", frappe: 1, expression: "neutre" }, { t: 1.0, frappe: 0, expression: "surpris" }, { t: 2.6, pose: "clavier", frappe: 1, expression: "content" }]),
    incrust: { de: 0.9, y: 1060, echelle: 0.62, carte: { type: "notif", titre: "Demande d'aide en Physique", texte: "Camille débute en Physique et aimerait ton aide.", icone: "🙋" } },
  },
  {
    type: "facade",
    de: 20,
    a: 23,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: camille([{ t: 0, pose: "repos", expression: "inquiet" }, { t: 1.8, expression: "content", regard: 0.4 }]) },
      { centre: BAS, cote: -1, acteur: hugo([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }]) },
    ],
    fils: [{ de: 1, vers: 0, t: 0.2, duree: 1.6 }],
  },
  {
    type: "ui",
    de: 23,
    a: 31,
    carte: {
      type: "tableau",
      titre: "Ondes stationnaires",
      traces: [
        { type: "trait", d: "M8 38 L92 38", couleur: "#9b96c4", t: 0.2, duree: 0.6, largeur: 0.4 },
        { type: "trait", d: "M8 38 Q 22 8 36 38 T 64 38 T 92 38", couleur: "#2f9d7e", t: 0.6, duree: 1.4, largeur: 0.9, auteur: "Hugo", x: 20, y: 14 },
        { type: "trait", d: "M8 38 Q 22 68 36 38 T 64 38 T 92 38", couleur: "#2f9d7e", t: 1.6, duree: 1.4, largeur: 0.9 },
        { type: "texte", x: 28, y: 42, contenu: "nœud", couleur: "#e0314f", t: 3.4, duree: 0.6, taille: 0.8, auteur: "Hugo" },
        { type: "texte", x: 56, y: 42, contenu: "nœud", couleur: "#e0314f", t: 3.9, duree: 0.6, taille: 0.8 },
        { type: "texte", x: 15, y: 2, contenu: "ventre", couleur: "#2f9d7e", t: 4.6, duree: 0.6, taille: 0.8 },
        { type: "texte", x: 6, y: 58, contenu: "nœuds tous les λ/2", couleur: "#14102e", t: 5.6, duree: 1.1, taille: 0.9 },
      ],
    },
  },
  {
    type: "chambre",
    de: 31,
    a: 36,
    acteur: camille([{ t: 0, pose: "victoire", expression: "content" }]),
    extra: <Picto texte="💡" position={[1.0, 1.62, 0.6]} de={0.3} taille={0.24} />,
  },
  {
    type: "chambre",
    de: 36,
    a: 38,
    acteur: camille([{ t: 0, pose: "repos", expression: "content", regard: 0.75 }]),
    mascotte: { t: 0 },
    extra: <Picto texte="?" position={[0.95, 1.78, -0.45]} de={0.2} taille={0.24} />,
  },
]);
