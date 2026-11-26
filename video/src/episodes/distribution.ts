// Personnages récurrents de la série et petits raccourcis pour écrire les scripts.
import { Acteur, Etat, Script } from "../engine/Episode";
import { TENUES } from "../engine/Personnage";
import { FENETRES_DUO } from "../engine/Facade";
import { V3 } from "../engine/outils3d";
import { TEXTES } from "./textes";

type Options = { position?: V3; rotationY?: number; chaise?: boolean };
const acteur = (id: string, tenue: Acteur["tenue"], coiffure: Acteur["coiffure"]) => (etats: Etat[], o: Options = {}): Acteur => ({ id, tenue, coiffure, etats, ...o });

export const camille = acteur("camille", TENUES.hero, "courte");
export const lea = acteur("lea", TENUES.binome, "longue");
export const hugo = acteur("hugo", TENUES.mentor, "boucles");
export const sarah = acteur("sarah", TENUES.sarah, "chignon");
export const yanis = acteur("yanis", TENUES.yanis, "courte");
export const ines = acteur("ines", TENUES.ines, "longue");

export const [HAUT, BAS] = FENETRES_DUO;

/** Étudiants de l'amphi : au 1er rang, tournés vers la caméra. */
export const RANG: Record<"g" | "c" | "d", Options> = {
  g: { position: [-0.46, 0, -0.2], rotationY: -Math.PI / 2 },
  c: { position: [0, 0, -0.2], rotationY: -Math.PI / 2 },
  d: { position: [0.46, 0, -0.2], rotationY: -Math.PI / 2 },
};

/** Assemble un script à partir de ses plans et des textes de textes.ts. */
export const script = (id: keyof typeof TEXTES, plans: Script["plans"]): Script => ({ id, titre: TEXTES[id].titre, duree: TEXTES[id].duree, lignes: TEXTES[id].lignes, plans });
