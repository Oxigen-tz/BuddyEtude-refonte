// Épisode 6 — « 4 gestes » : trouver un binôme, montré en quatre étapes (avec Sarah).
import React from "react";
import { Picto } from "../engine/Accessoires";
import { TENUES } from "../engine/Personnage";
import { Acteur, Etat } from "../engine/Episode";
import { BAS, HAUT, sarah, script } from "./distribution";

/** Maëlle : étudiante en droit, la binôme que Sarah trouve dans cet épisode. */
const maelle = (etats: Etat[]): Acteur => ({ id: "maelle", tenue: { ...TENUES.ines, haut: "#c2456e" }, coiffure: "boucles", etats });

export default script("ep06", [
  {
    type: "chambre",
    de: 0,
    a: 2.5,
    acteur: sarah([{ t: 0, pose: "clavier", frappe: 0.6, expression: "neutre" }, { t: 0.8, regard: 0.75, pose: "repos", expression: "surpris" }]),
    mascotte: { t: 0 },
    extra: <Picto texte="4" position={[0.55, 2.05, -0.75]} de={0.5} taille={0.28} />,
  },
  {
    type: "ui",
    de: 2.5,
    a: 12,
    carte: {
      type: "recherche",
      requete: "Droit des contrats",
      choisi: 0,
      tChoisi: 6.3,
      profils: [
        { nom: "Maëlle", niveau: "Licence · Droit", badges: ["Même école", "2 matières en commun"], couleur: "#c2456e", verifie: true },
        { nom: "Malik", niveau: "Licence · Droit", badges: ["1 matière en commun"], couleur: "#3d4fa8" },
        { nom: "Nolan", niveau: "Licence · AES", badges: ["Même ville"], couleur: "#a98bff" },
      ],
    },
  },
  {
    type: "ui",
    de: 12,
    a: 21,
    carte: { type: "demande", nom: "Maëlle", message: "Hello ! On révise les contrats ensemble jeudi ?", tEnvoi: 5.3 },
  },
  {
    type: "facade",
    de: 21,
    a: 26,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: sarah([{ t: 0, pose: "repos", expression: "neutre", regard: 0.4 }, { t: 2.5, expression: "content" }]) },
      { centre: BAS, cote: -1, acteur: maelle([{ t: 0, pose: "clavier", frappe: 1 }, { t: 1.9, pose: "repos", expression: "content", regard: 0.5 }]) },
    ],
    fils: [{ de: 0, vers: 1, t: 0.2, duree: 1.8 }],
    incrust: { de: 2.3, y: 985, echelle: 0.62, carte: { type: "notif", titre: "Demande acceptée 🎉", texte: "Maëlle a accepté votre demande de binôme !" } },
  },
  {
    type: "facade",
    de: 26,
    a: 28,
    fenetres: [
      { centre: HAUT, cote: 1, acteur: sarah([{ t: 0, pose: "victoire", expression: "content" }]) },
      { centre: BAS, cote: -1, acteur: maelle([{ t: 0, pose: "repos", expression: "content", regard: 0.5 }]) },
    ],
    fils: [{ de: 0, vers: 1, t: -3 }],
  },
]);
