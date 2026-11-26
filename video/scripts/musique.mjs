// Fond musical original (aucun échantillon externe, libre de droits), synthétisé note par note.
// Électro-pop 124 BPM, la mineur (Am – F – C – G) : la même signature que les reels BuddyEtude.
// Usage : node scripts/musique.mjs <durée en secondes> <fichier.wav>
import { writeFileSync } from "node:fs";
const SR = 44100;
const DUREE = Number(process.argv[2] ?? 30);
const SORTIE = process.argv[3] ?? "musique.wav";

function wav(path, L, R = L) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  let peak = 1e-9; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = 0.89 / peak;
  for (let i = 0; i < n; i++) {
    const s = (x) => Math.max(-1, Math.min(1, Math.tanh(x * g * 1.2) / Math.tanh(1.2)));
    buf.writeInt16LE(Math.round(s(L[i]) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(s(R[i]) * 32767), 46 + i * 4);
  }
  writeFileSync(path, buf);
}
const noise = () => Math.random() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// ------------------------------------------------------------------ piste musicale
const BPM = 124, beat = 60 / BPM, bar = beat * 4, BARS = Math.ceil(DUREE / bar) + 1;
const N = Math.ceil(BARS * bar * SR) + SR;
const L = new Float32Array(N), R = new Float32Array(N), duck = new Float32Array(N).fill(1);
const add = (buf, i, v) => { if (i >= 0 && i < N) buf[i] += v; };
const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // Am F C G
const roots = [45, 41, 36, 43];

function kick(t0) {
  const s = Math.round(t0 * SR); let ph = 0;
  for (let i = 0; i < 0.42 * SR; i++) {
    const t = i / SR, f = 45 + 110 * Math.exp(-t * 32); ph += 2 * Math.PI * f / SR;
    const v = Math.sin(ph) * Math.exp(-t * 7.5) * 0.95 + (i < 60 ? noise() * 0.25 : 0);
    add(L, s + i, v); add(R, s + i, v);
  }
  for (let i = 0; i < 0.3 * SR; i++) { const k = s + i; if (k < N) duck[k] = Math.min(duck[k], 0.35 + 0.65 * Math.min(1, i / (0.22 * SR))); }
}
function clap(t0) {
  const s = Math.round(t0 * SR); let lp = 0, hp = 0, prev = 0;
  for (let i = 0; i < 0.22 * SR; i++) {
    const t = i / SR, burst = (t < 0.03 ? (Math.floor(t / 0.01) % 2 ? 0.6 : 1) : 1) * Math.exp(-t * 18);
    const x = noise(); lp += 0.35 * (x - lp); hp = 0.9 * (hp + lp - prev); prev = lp;
    const v = hp * burst * 0.5; add(L, s + i, v * 0.9); add(R, s + i, v);
  }
}
function hat(t0, open = false) {
  const s = Math.round(t0 * SR); let prev = 0, hp = 0;
  for (let i = 0; i < (open ? 0.16 : 0.05) * SR; i++) {
    const t = i / SR, x = noise(); hp = 0.6 * (hp + x - prev); prev = x;
    const v = hp * Math.exp(-t * (open ? 22 : 70)) * 0.16; add(L, s + i, v * 0.8); add(R, s + i, v);
  }
}
function bass(t0, midi, dur) {
  const s = Math.round(t0 * SR), f = mtof(midi); let lp = 0;
  for (let i = 0; i < dur * SR; i++) {
    const t = i / SR, ph = (t * f) % 1;
    const saw = 2 * ph - 1, sq = ph < 0.5 ? 1 : -1;
    const x = 0.6 * saw + 0.4 * sq; const cut = 0.05 + 0.25 * Math.exp(-t * 14); lp += cut * (x - lp);
    const env = Math.min(1, i / 60) * Math.exp(-t * 2.2) * (i > dur * SR - 200 ? (dur * SR - i) / 200 : 1);
    const v = (lp * 0.55 + Math.sin(2 * Math.PI * f * t) * 0.35) * env * 0.42;
    add(L, s + i, v); add(R, s + i, v);
  }
}
function pluck(t0, midi, pan, vol = 0.16) {
  const s = Math.round(t0 * SR), f = mtof(midi); let lp = 0;
  for (let i = 0; i < 0.35 * SR; i++) {
    const t = i / SR, ph = (t * f) % 1;
    const x = (ph < 0.25 ? 1 : -0.33) + 0.5 * Math.sin(2 * Math.PI * f * 2 * t);
    lp += (0.08 + 0.5 * Math.exp(-t * 25)) * (x - lp);
    const v = lp * Math.exp(-t * 9) * vol;
    for (const [d, g] of [[0, 1], [beat * 0.75, 0.35], [beat * 1.5, 0.15]]) {
      const k = s + i + Math.round(d * SR);
      add(L, k, v * g * (1 - pan) * (d ? (pan > 0.5 ? 1.3 : 0.7) : 1)); add(R, k, v * g * pan * (d ? (pan > 0.5 ? 0.7 : 1.3) : 1));
    }
  }
}
function pad(t0, notes, dur) {
  const s = Math.round(t0 * SR);
  for (let i = 0; i < dur * SR; i++) {
    const t = i / SR, env = Math.min(1, t / 0.25) * Math.min(1, (dur - t) / 0.3);
    let l = 0, r = 0;
    for (const m of notes) {
      const f = mtof(m + 12);
      l += (((t * f * 1.004) % 1) * 2 - 1); r += (((t * f * 0.996) % 1) * 2 - 1);
    }
    add(L, s + i, l * env * 0.025); add(R, s + i, r * env * 0.025);
  }
}
const arp = [0, 1, 2, 1, 2, 0, 1, 2];
for (let b = 0; b < BARS; b++) {
  const t = b * bar, c = b % 4, sparse = b >= BARS - 2; // fin plus calme
  for (let q = 0; q < 4; q++) {
    if (!sparse || q === 0) kick(t + q * beat);
    if (q % 2 === 1 && !sparse) clap(t + q * beat);
    hat(t + q * beat + beat / 2, q === 3);
    if (b % 2 === 1) hat(t + q * beat + beat * 0.25);
  }
  for (let e = 0; e < 8; e++) bass(t + e * beat / 2, roots[c] + (e % 4 === 3 ? 12 : 0), beat / 2 * 0.92);
  for (let s16 = 0; s16 < 16; s16++) if (s16 % 2 === 0 || b % 2) pluck(t + s16 * beat / 4, chords[c][arp[s16 % 8]] + 12, s16 % 2 ? 0.3 : 0.7);
  pad(t, chords[c], bar);
}
// Mélodie d'accroche (2 mesures sur 4)
const hookMel = [[0, 76], [0.75, 74], [1.5, 72], [2, 72], [2.5, 74], [3, 76], [3.5, 79]];
for (let b = 0; b < BARS - 2; b += 2) for (const [o, m] of hookMel) pluck(b * bar + o * beat, m, 0.5, 0.2);
for (let i = 0; i < N; i++) { L[i] *= duck[i] > 0.99 ? 1 : 0.55 + 0.45 * duck[i]; R[i] *= duck[i] > 0.99 ? 1 : 0.55 + 0.45 * duck[i]; }



// fondu de sortie sur les 2 dernières secondes, puis coupe à la durée demandée
const nFin = Math.round(DUREE * SR);
for (let i = 0; i < nFin; i++) {
  const g = Math.min(1, (nFin - i) / (2 * SR));
  L[i] *= g; R[i] *= g;
}
wav(SORTIE, L.subarray(0, nFin), R.subarray(0, nFin));
console.log(`musique : ${SORTIE} (${DUREE} s)`);
