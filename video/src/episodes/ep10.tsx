// Épisode 10 — « Prépa » : Yanis, seul depuis septembre, jusqu'à ce qu'Orbi le relie à Inès.
import React from "react";
import { Reveil, TelephoneBureau } from "../engine/Accessoires";
import { Cam } from "../engine/Episode";
import { BAS, HAUT, ines, script, yanis } from "./distribution";

const objets = (
  <>
    <TelephoneBureau position={[0.5, 0.795, 0.42]} />
    <Reveil position={[0.55, 0.845, -0.55]} heure="01:12" rotationY={0.75} />
  </>
);
const gros = (position: Cam["position"], cible: Cam["cible"]): Cam => ({ position, cible, derive: 0.4 });
const seul = [{ t: 0, pose: "ecrit" as const, expression: "fatigue" as const }];

export default script("ep10", [
  { type: "chambre", de: 0, a: 2.5, ambiance: "sombre", acteur: yanis(seul), extra: objets },
  { type: "chambre", de: 2.5, a: 4.5, ambiance: "sombre", camera: gros([1.65, 1.25, 1.45], [0.95, 0.9, 0.62]), acteur: yanis(seul), extra: objets },
  { type: "chambre", de: 4.5, a: 6.5, ambiance: "sombre", camera: gros([1.25, 1.22, 0.22], [0.5, 0.8, 0.42]), acteur: yanis(seul), extra: objets },
  { type: "chambre", de: 6.5, a: 9, ambiance: "sombre", camera: gros([1.3, 1.05, -0.1], [0.55, 0.85, -0.55]), acteur: yanis(seul), extra: objets },
  {
    type: "facade",
    de: 9,
    a: 14,
    voisins: "eteints",
    camera: { position: [-0.2, 4.0, 4.2], cible: [-0.25, 3.9, 0], derive: -2.2 },
    fenetres: [{ centre: HAUT, cote: 1, acteur: yanis(seul) }],
  },
  { type: "noir", de: 14, a: 17 },
  {
    type: "facade",
    de: 17,
    a: 21,
    voisins: "eteints",
    fenetres: [
      { centre: HAUT, cote: 1, acteur: yanis([...seul, { t: 2.2, pose: "repos", expression: "surpris", regard: 0.5 }]) },
      { centre: BAS, cote: -1, acteur: ines([{ t: 0, pose: "ecrit", expression: "fatigue" }, { t: 2.4, pose: "repos", expression: "surpris", regard: 0.5 }]) },
    ],
    fils: [{ de: 0, vers: 1, t: 0.4, duree: 2 }],
  },
  {
    type: "ui",
    de: 21,
    a: 22.5,
    carte: { type: "recherche", profils: [{ nom: "Inès", niveau: "Prépa · MP", badges: ["Même école", "3 matières en commun", "Même niveau"], couleur: "#a98bff", verifie: true }] },
  },
  { type: "ui", de: 22.5, a: 24, carte: { type: "messages", avec: "Inès", couleur: "#a98bff", messages: [{ t: 0.1, texte: "Khôlle de maths lundi, on s'entraîne ?" }, { t: 0.9, moi: true, texte: "Grave." }] } },
  { type: "ui", de: 24, a: 25.5, carte: { type: "session", titre: "Khôlle blanche de maths", avec: "Inès", quand: "Dim. · 15:00" } },
  {
    type: "ui",
    de: 25.5,
    a: 27,
    carte: {
      type: "tableau",
      titre: "Khôlle : suites",
      traces: [
        { type: "texte", x: 6, y: 6, contenu: "uₙ₊₁ = 2uₙ + 1", couleur: "#3d4fa8", t: 0, duree: 0.5, auteur: "Yanis" },
        { type: "texte", x: 6, y: 24, contenu: "vₙ = uₙ + 1 → géom.", couleur: "#a98bff", t: 0.6, duree: 0.7, auteur: "Inès" },
      ],
    },
  },
  {
    type: "facade",
    de: 27,
    a: 32,
    voisins: "eteints",
    fenetres: [
      { centre: HAUT, cote: 1, acteur: yanis([{ t: 0, pose: "clavier", frappe: 1, expression: "content" }]) },
      { centre: BAS, cote: -1, acteur: ines([{ t: 0, pose: "ecrit", expression: "content" }]) },
    ],
    fils: [{ de: 0, vers: 1, t: -3 }],
  },
]);
