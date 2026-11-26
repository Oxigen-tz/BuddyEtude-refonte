// Fond musical doux (aucun échantillon externe, libre de droits), synthétisé note par note.
// Nappe feutrée + quelques notes de piano électrique, sans batterie : juste un fond pour combler les blancs.
// 72 BPM, la mineur (Am – F – C – G), filtré et adouci, léger écho.
// Usage : node scripts/musique-douce.mjs <durée en secondes> <fichier.wav>
import { writeFileSync } from "node:fs";

const SR = 44100;
const DUREE = Number(process.argv[2] ?? 30);
const SORTIE = process.argv[3] ?? "musique-douce.wav";
const N = Math.round(DUREE * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const add = (buf, i, v) => {
  if (i >= 0 && i < N) buf[i] += v;
};
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
// hasard reproductible (même musique à chaque génération)
let graine = 7;
const hasard = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);

const BPM = 72;
const temps = 60 / BPM;
const mesure = temps * 4;
const accords = [
  [57, 60, 64, 67], // Am7
  [53, 57, 60, 64], // Fmaj7
  [48, 52, 55, 59], // Cmaj7
  [55, 59, 62, 65], // G7
];
const basses = [45, 41, 48, 43];

/** Nappe : triangles légèrement désaccordées, attaque et relâche lentes, filtrée (son feutré). */
function nappe(t0, notes, duree) {
  const s = Math.round(t0 * SR);
  const n = Math.round((duree + 1.2) * SR);
  const etats = notes.map(() => ({ l: 0, r: 0 }));
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 1.4) * (t > duree ? Math.max(0, 1 - (t - duree) / 1.2) : 1);
    let l = 0;
    let r = 0;
    notes.forEach((m, k) => {
      const f = mtof(m);
      const tri = (ph) => 1 - 4 * Math.abs(((ph % 1) + 1) % 1 - 0.5);
      const xl = tri(t * f * 0.997);
      const xr = tri(t * f * 1.003);
      const e = etats[k];
      e.l += 0.045 * (xl - e.l); // filtre passe-bas doux
      e.r += 0.045 * (xr - e.r);
      l += e.l;
      r += e.r;
    });
    add(L, s + i, l * env * 0.06);
    add(R, s + i, r * env * 0.06);
  }
}

/** Piano électrique : sinus + harmonique douce, décroissance lente, léger trémolo. */
function piano(t0, m, vol, pan) {
  const s = Math.round(t0 * SR);
  const f = mtof(m);
  for (let i = 0; i < 2.6 * SR; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.008) * Math.exp(-t * 1.6);
    const trem = 1 + 0.08 * Math.sin(2 * Math.PI * 4.5 * t);
    const v = (Math.sin(2 * Math.PI * f * t) + 0.18 * Math.sin(2 * Math.PI * 2 * f * t) * Math.exp(-t * 4)) * env * trem * vol;
    add(L, s + i, v * (1 - pan));
    add(R, s + i, v * pan);
  }
}

/** Basse très douce : sinus grave, longue. */
function basse(t0, m, duree) {
  const s = Math.round(t0 * SR);
  const f = mtof(m);
  for (let i = 0; i < duree * SR; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.3) * Math.min(1, (duree - t) / 0.5);
    const v = Math.sin(2 * Math.PI * f * t) * env * 0.09;
    add(L, s + i, v);
    add(R, s + i, v);
  }
}

const mesures = Math.ceil(DUREE / mesure) + 1;
for (let b = 0; b < mesures; b++) {
  const t = b * mesure;
  const c = b % 4;
  nappe(t, accords[c], mesure);
  basse(t, basses[c] - 12, mesure);
  // 3 à 4 notes de piano par mesure, notes de l'accord, placement légèrement varié
  const motif = [0, 1.5, 2.5, 3.25];
  motif.forEach((pos, k) => {
    if (k === 3 && b % 2 === 0) return;
    const note = accords[c][(k + b) % 4] + 12;
    piano(t + pos * temps + hasard() * 0.03, note, 0.05 + hasard() * 0.015, 0.35 + 0.3 * hasard());
  });
}

// écho stéréo léger (un peu d'espace, comme une petite réverbération)
for (const [buf, autre, d] of [
  [L, R, 0.31],
  [R, L, 0.37],
]) {
  const k = Math.round(d * SR);
  for (let i = k; i < N; i++) buf[i] += 0.22 * autre[i - k];
}

// fondus d'entrée (1 s) et de sortie (2,5 s)
for (let i = 0; i < N; i++) {
  const g = Math.min(1, i / SR) * Math.min(1, (N - i) / (2.5 * SR));
  L[i] *= g;
  R[i] *= g;
}

// normalisation douce puis écriture WAV 16 bits stéréo
let crete = 1e-9;
for (let i = 0; i < N; i++) crete = Math.max(crete, Math.abs(L[i]), Math.abs(R[i]));
const gain = 0.8 / crete;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), 46 + i * 4);
}
writeFileSync(SORTIE, buf);
console.log(`musique douce : ${SORTIE} (${DUREE} s)`);
