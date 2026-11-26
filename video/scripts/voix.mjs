// Ajoute une voix off à un épisode déjà rendu. Deux sources possibles :
//  - voix neuronales Microsoft via edge-tts (gratuit, usage non officiel) ;
//  - ElevenLabs (payant, licence commerciale avec l'offre Starter ou plus).
// Chaque phrase de textes.ts est synthétisée, accélérée si elle dépasse son créneau, puis posée à son temps exact.
// Usage : npm run voix -- ep03                               (voix par défaut : fr-FR-HenriNeural)
//         npm run voix -- ep03 fr-FR-DeniseNeural
//         npm run voix -- ep03 elevenlabs:<voice_id>         (clé dans la variable d'environnement ELEVENLABS_API_KEY)
//         npm run voix -- ep03 elevenlabs:<voice_id> --musique   (ajoute le fond musical original, baissé sous la voix)
//         … --caler   (recale le montage sur la voix : chaque passage dure le temps de sa phrase, sans blancs)
//         npm run voix -- echantillons                       (un extrait de chaque voix Microsoft, pour choisir)
// Prérequis : l'épisode rendu dans out/ ; pour Microsoft, Python avec edge-tts (pip install --user edge-tts==7.3.1).
// Les phrases ElevenLabs sont mises en cache (out/voix/cache) : relancer ne consomme pas de crédits pour un texte inchangé.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, existsSync, writeFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { TEXTES } from "../src/episodes/textes.ts";

const require = createRequire(import.meta.url);
const FFMPEG = require("ffmpeg-static");
const OUT = fileURLToPath(new URL("../out/", import.meta.url));
const VOIX_FR = ["fr-FR-HenriNeural", "fr-FR-DeniseNeural", "fr-FR-RemyMultilingualNeural", "fr-FR-VivienneMultilingualNeural", "fr-FR-EloiseNeural"];

/** Texte prêt à dire : sans les « … » de début, et π écrit en toutes lettres. */
const pourVoix = (t) => t.replace(/^…\s*/, "").replace(/…/g, "...").replace(/π/g, "pi");

/** ElevenLabs, modèle Eleven v3 (le plus naturel en français) ; le résultat est gardé en cache.
 *  La vitesse n'est pas demandée au modèle : on accélère ensuite le son (voir synthese). */
const MODELE_ELEVENLABS = "eleven_v3";
async function elevenlabs(texte, voiceId) {
  const cle = process.env.ELEVENLABS_API_KEY;
  if (!cle) throw new Error("Variable d'environnement ELEVENLABS_API_KEY absente : crée la clé sur elevenlabs.io, puis `setx ELEVENLABS_API_KEY \"...\"` et rouvre le terminal.");
  const reglages = { stability: 0.5, similarity_boost: 0.8 };
  const cache = `${OUT}voix/cache`;
  mkdirSync(cache, { recursive: true });
  const fichierCache = `${cache}/${createHash("sha1").update(JSON.stringify([MODELE_ELEVENLABS, voiceId, texte, reglages])).digest("hex")}.mp3`;
  if (!existsSync(fichierCache)) {
    const rep = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": cle, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text: texte, model_id: MODELE_ELEVENLABS, language_code: "fr", voice_settings: reglages }),
    });
    if (!rep.ok) throw new Error(`ElevenLabs a refusé la demande (${rep.status}) : ${(await rep.text()).slice(0, 300)}`);
    writeFileSync(fichierCache, Buffer.from(await rep.arrayBuffer()));
  }
  return fichierCache;
}

async function synthese(texte, voix, fichier, vitesse = 0) {
  let brut = fichier.replace(/\.wav$/, ".brut.mp3");
  const eleven = voix.startsWith("elevenlabs:");
  if (eleven) brut = await elevenlabs(texte, voix.slice("elevenlabs:".length));
  else {
    const r = spawnSync("python", ["-m", "edge_tts", "--voice", voix, `--rate=+${Math.max(0, vitesse)}%`, "--text", texte, "--write-media", brut], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`edge-tts a échoué : ${r.stderr}`);
  }
  // les voix de synthèse ajoutent des silences avant et après la phrase : on les retire pour caler la voix au plus juste
  const coupe = "silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.08";
  const tempo = eleven && vitesse > 0 ? `,atempo=${(1 + vitesse / 100).toFixed(3)}` : "";
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", brut, "-af", `${coupe},areverse,${coupe},areverse${tempo}`, "-ar", "48000", fichier]);
}
/** Coupe un fichier aux n−1 plus longs silences (pour poser chaque mot d'un « Trois… deux… un ! » à son temps). */
function decouper(fichier, n, prefixe) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", fichier, "-af", "silencedetect=n=-40dB:d=0.08", "-f", "null", "-"], { encoding: "utf8" });
  const debuts = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const fins = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  const trous = debuts.map((d, k) => ({ d, f: fins[k] ?? d, l: (fins[k] ?? d) - d })).filter((t) => t.d > 0.05);
  const coupes = trous.sort((a, b) => b.l - a.l).slice(0, n - 1).map((t) => (t.d + t.f) / 2).sort((a, b) => a - b);
  if (coupes.length < n - 1) throw new Error(`Impossible de découper ${fichier} en ${n} morceaux`);
  const bornes = [0, ...coupes, duree(fichier)];
  return bornes.slice(0, -1).map((b, k) => {
    const morceau = `${prefixe}-${k}.wav`;
    const coupe = "silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.05";
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", fichier, "-ss", String(b), "-to", String(bornes[k + 1]), "-af", `${coupe},areverse,${coupe},areverse`, morceau]);
    return morceau;
  });
}

function duree(fichier) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", fichier], { encoding: "utf8" });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(r.stderr);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
}

const args = process.argv.slice(2);
// --musique : fond doux (par défaut) ; --musique=energique : la musique rythmée des reels
const optMusique = args.find((a) => a.startsWith("--musique"));
const avecMusique = Boolean(optMusique);
const musiqueEnergique = optMusique === "--musique=energique";
const [cible = "ep03", voix = "fr-FR-HenriNeural"] = args.filter((a) => !a.startsWith("--"));

if (cible === "echantillons") {
  const dossier = `${OUT}voix/echantillons`;
  mkdirSync(dossier, { recursive: true });
  const phrase = "Tu sais résoudre ça ? Mets pause. Camille, elle, bloque. Alors elle appelle Léa.";
  for (const v of VOIX_FR) {
    await synthese(phrase, v, `${dossier}/${v}.wav`);
    console.log(`extrait : out/voix/echantillons/${v}.wav`);
  }
  process.exit(0);
}

const ep = TEXTES[cible];
if (!ep) throw new Error(`Épisode inconnu : ${cible}`);
const video = `${OUT}BuddyEtude-${cible}.mp4`;
if (!existsSync(video)) throw new Error(`Rends d'abord la vidéo : npm run episodes -- ${cible}`);
const dossier = `${OUT}voix/${cible}`;
mkdirSync(dossier, { recursive: true });

const caler = args.includes("--caler");
const voisees = ep.lignes.filter((l) => l.voix);

// 1) chaque phrase est d'abord synthétisée à sa vitesse naturelle
const naturel = new Map();
for (const [i, l] of voisees.entries()) {
  const fichier = `${dossier}/${String(i).padStart(2, "0")}.wav`;
  if (l.rythme) {
    // phrase dite d'une traite (prononciation naturelle), puis chaque morceau posé à son temps
    const morceaux = l.voix.split("|").map((m) => m.trim());
    await synthese(pourVoix(morceaux.join(" ")), voix, fichier);
    naturel.set(l, { morceaux: decouper(fichier, morceaux.length, fichier.replace(/\.wav$/, "")).map((m) => ({ fichier: m, d: duree(m) })) });
    continue;
  }
  await synthese(pourVoix(l.voix), voix, fichier);
  const d = duree(fichier);
  naturel.set(l, { fichier, d });
  if (process.argv.includes("--mesure")) console.log(`  ${l.de.toFixed(1).padStart(5)} s  créneau ${(l.a - l.de).toFixed(2)} s  voix ${d.toFixed(2)} s  « ${l.voix} »`);
}

// 2) --caler : chaque passage de la vidéo est allongé ou raccourci pour coller à sa phrase
//    (durée de la voix + 0,35 s de respiration ; l'accroche du début n'est jamais raccourcie ; fin signature intacte)
const finEpisode = ep.duree - 2;
const facteur = new Map();
if (caler)
  for (const l of voisees) {
    if (l.rythme) continue;
    const origine = l.a - l.de;
    let voulu = Math.max(naturel.get(l).d + 0.35, 1.2);
    if (l.de === 0) voulu = Math.max(voulu, origine);
    facteur.set(l, Math.max(0.6, Math.min(1.45, voulu / origine)));
  }
const bornes = [...new Set([0, finEpisode, ep.duree, ...ep.lignes.flatMap((l) => [l.de, l.a])])].filter((t) => t >= 0 && t <= ep.duree).sort((a, b) => a - b);
const segments = bornes.slice(0, -1).map((s, k) => {
  const e = bornes[k + 1];
  const l = voisees.find((x) => !x.rythme && x.de <= s + 1e-6 && e <= x.a + 1e-6 && e <= finEpisode + 1e-6);
  return { s, e, f: (l && facteur.get(l)) ?? 1 };
});
const warp = (t) => {
  let acc = 0;
  for (const g of segments) {
    if (t >= g.e) acc += (g.e - g.s) * g.f;
    else {
      if (t > g.s) acc += (t - g.s) * g.f;
      break;
    }
  }
  return acc;
};
const dureeFinale = Math.round(warp(ep.duree) * 100) / 100;
const recale = segments.some((g) => Math.abs(g.f - 1) > 0.01);
if (caler) console.log(`  calage : ${ep.duree} s → ${dureeFinale} s`);

// 3) chaque phrase est posée à son temps (recalé) ; accélérée seulement si elle ne tient vraiment pas
const pistes = [];
let finPrecedente = 0;
for (const [i, l] of voisees.entries()) {
  const n = naturel.get(l);
  if (l.rythme) {
    n.morceaux.forEach((m, k) => {
      const de = warp(l.rythme[k]);
      pistes.push({ fichier: m.fichier, de, d: m.d });
      finPrecedente = de + m.d;
    });
    continue;
  }
  const debut = Math.max(warp(l.de) + 0.05, finPrecedente + 0.1);
  const suivante = voisees[i + 1] ? warp(voisees[i + 1].de) : warp(finEpisode);
  const limite = Math.max(warp(l.a), suivante) + 0.4 - debut; // léger débordement toléré
  let d = n.d;
  if (d > limite && limite > 0) {
    // trop long : on accélère juste ce qu'il faut, sans dépasser +20 % (au-delà, la voix sonne pressée)
    const vitesse = Math.min(20, Math.ceil((d / limite - 1) * 100) + 3);
    await synthese(pourVoix(l.voix), voix, n.fichier, vitesse);
    d = duree(n.fichier);
    console.log(`  « ${l.voix} » accélérée de ${vitesse} %`);
  }
  if (debut + d > suivante + 0.6) console.log(`  attention : « ${l.voix} » déborde de ${(debut + d - suivante).toFixed(2)} s sur la phrase suivante`);
  pistes.push({ fichier: n.fichier, de: debut, d });
  finPrecedente = debut + d;
}

// un fichier par voix, pour pouvoir comparer : …-voix-henri.mp4, …-voix-elevenlabs.mp4
const suffixe = voix.startsWith("elevenlabs:") ? "elevenlabs" : voix.replace(/^fr-FR-/, "").replace(/(Multilingual)?Neural$/, "").toLowerCase();
const sortie = `${OUT}BuddyEtude-${cible}-voix-${suffixe}${avecMusique ? "-musique" : ""}.mp4`;
const entrees = pistes.flatMap((p) => ["-i", p.fichier]);
const chaines = pistes.map((p, k) => `[${k + 1}:a]aresample=48000,adelay=${Math.round(p.de * 1000)}:all=1[a${k}]`);
const melange = `${pistes.map((_, k) => `[a${k}]`).join("")}amix=inputs=${pistes.length}:normalize=0,apad=whole_dur=${dureeFinale}`; // silence complété jusqu'à la fin, mais borné (sinon ffmpeg l'accumule en mémoire)
let filtre = `${chaines.join(";")};${melange},loudnorm=I=-14:TP=-1.5:LRA=11[voix]`;
if (avecMusique) {
  // fond musical original, qui s'efface automatiquement quand la voix parle (compression « sidechain »)
  const musique = `${OUT}voix/musique-${cible}.wav`;
  const generateur = musiqueEnergique ? "./musique.mjs" : "./musique-douce.mjs";
  execFileSync("node", [fileURLToPath(new URL(generateur, import.meta.url)), String(dureeFinale), musique], { stdio: "inherit" });
  entrees.push("-i", musique);
  const m = pistes.length + 1;
  filtre =
    `${chaines.join(";")};${melange},asplit=2[v1][v2];` +
    // fond doux : très bas sous la voix, il remonte un peu dans les pauses ; musique énergique : plus présente
    `[${m}:a]aresample=48000,volume=${musiqueEnergique ? 0.3 : 0.16}[m];[m][v2]sidechaincompress=threshold=0.02:ratio=${musiqueEnergique ? 10 : 5}:attack=40:release=600[md];` +
    `[v1][md]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[voix]`;
}
// vidéo recalée en un seul passage : le temps de chaque image est recalculé par une fonction par morceaux
// (aucun découpage en parallèle, donc pas d'images gardées en mémoire), puis ramené à 30 images/s
let carteVideo = "0:v";
let codecVideo = ["-c:v", "copy"];
if (recale) {
  let acc = 0;
  const termes = segments.map((g, k) => {
    const borne = k === segments.length - 1 ? `lte(T,${g.e})` : `lt(T,${g.e})`;
    const terme = `gte(T,${g.s})*${borne}*(${acc.toFixed(4)}+(T-${g.s})*${g.f.toFixed(4)})`;
    acc += (g.e - g.s) * g.f;
    return terme;
  });
  filtre += `;[0:v]setpts='(${termes.join("+")})/TB',fps=30,format=yuv420p[vid]`;
  carteVideo = "[vid]";
  codecVideo = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709"];
}
execFileSync(
  FFMPEG,
  ["-y", "-loglevel", "error", "-i", video, ...entrees, "-filter_complex", filtre, "-map", carteVideo, "-map", "[voix]", ...codecVideo, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-t", String(dureeFinale), "-movflags", "+faststart", sortie],
  { stdio: "inherit" },
);
for (const p of pistes) rmSync(p.fichier.replace(/\.wav$/, ".brut.mp3").replace(/-\d\.brut\.mp3$/, ".brut.mp3"), { force: true }); // fichiers intermédiaires
console.log(`vidéo avec voix off${avecMusique ? " et musique" : ""} : ${sortie.replace(OUT, "out/")} (${voix})`);
