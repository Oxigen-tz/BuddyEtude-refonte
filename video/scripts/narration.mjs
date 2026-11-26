// Écrit, pour chaque épisode, le texte de narration avec ses timings :
//   out/narration/epXX.txt (lisible, pour enregistrer sa voix) et out/narration/epXX.srt (sous-titres, pour un logiciel de montage).
// Usage : npm run narration
import { mkdirSync, writeFileSync } from "node:fs";
import { TEXTES } from "../src/episodes/textes.ts";

const dossier = new URL("../out/narration/", import.meta.url);
mkdirSync(dossier, { recursive: true });
const hms = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
for (const [id, { titre, duree, lignes }] of Object.entries(TEXTES)) {
  const voix = lignes.filter((l) => l.voix).map((l) => ({ ...l, voix: l.voix.replace(/\s*\|\s*/g, " ") }));
  const txt = [
    `BuddyEtude — ${id} « ${titre} » (${duree} s)`,
    "Piste audio vide dans la vidéo : enregistre chaque phrase pour qu'elle commence au temps indiqué.",
    "Débit conseillé : environ 2,5 mots par seconde. Les 2 dernières secondes (logo) restent sans voix.",
    "",
    ...voix.map((l) => `[${l.de.toFixed(1).padStart(4)} s → ${l.a.toFixed(1).padStart(4)} s]  ${l.voix}   (${(l.voix.split(/\s+/).length / (l.a - l.de)).toFixed(1)} mots/s)`),
  ].join("\n");
  const srt = voix.map((l, i) => `${i + 1}\n${hms(l.de)} --> ${hms(l.a)}\n${l.voix}\n`).join("\n");
  writeFileSync(new URL(`${id}.txt`, dossier), txt + "\n");
  writeFileSync(new URL(`${id}.srt`, dossier), srt);
}
console.log("narrations écrites dans out/narration/");
