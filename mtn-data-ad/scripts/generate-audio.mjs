// Synthétiseur audio procédural : génère les effets sonores et la musique
// de la pub dans public/sfx et public/music (WAV 44.1 kHz, 16 bits).
// Aucun sample externe : tout est créé par le code, donc libre de droits.
//
//   node scripts/generate-audio.mjs
//
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// ---------- utilitaires ----------
let seed = 1234567;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

function writeWav(file, L, R = L) {
  let peak = 0;
  for (let i = 0; i < L.length; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0.95 ? 0.95 / peak : 1;
  const n = L.length;
  const b = Buffer.alloc(44 + n * 4);
  b.write("RIFF", 0);
  b.writeUInt32LE(36 + n * 4, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * 4, 28);
  b.writeUInt16LE(4, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, b);
  console.log("✔", path.relative(root, file), (n / SR).toFixed(2) + "s");
}

// filtre passe-bas / passe-haut 1 pôle
const lp = (x, fc) => {
  const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0;
  return x.map((v) => (y += a * (v - y)));
};
const hp = (x, fc) => {
  const low = lp(x, fc);
  return x.map((v, i) => v - low[i]);
};

// ---------- effets sonores ----------
function click() {
  const o = buf(0.12);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] =
      Math.sin(2 * Math.PI * 3200 * t) * env(t, 0.0005, 0.006) * 0.6 +
      Math.sin(2 * Math.PI * 900 * t) * env(t, 0.0008, 0.018) * 0.5 +
      noise() * env(t, 0.0002, 0.004) * 0.5;
  }
  return o;
}

function toggleSlide() {
  // petit "zip" ascendant + clic de fin
  const o = buf(0.3);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const f = 500 + 1400 * Math.min(1, t / 0.16);
    ph += (2 * Math.PI * f) / SR;
    o[i] = Math.sin(ph) * (t < 0.16 ? 0.18 * Math.sin((Math.PI * t) / 0.16) : 0);
  }
  const c = click();
  for (let i = 0; i < c.length; i++) o[i + Math.round(0.16 * SR)] += c[i] * 0.8;
  return o;
}

function confirm() {
  // carillon deux notes (Mi6 → Si6) avec harmoniques
  const o = buf(1.1);
  const notes = [
    [1318.5, 0],
    [1975.5, 0.09],
  ];
  for (const [f, st] of notes)
    for (let i = Math.round(st * SR); i < o.length; i++) {
      const t = i / SR - st;
      const e = env(t, 0.003, 0.28);
      o[i] +=
        (Math.sin(2 * Math.PI * f * t) * 0.5 +
          Math.sin(2 * Math.PI * f * 2 * t) * 0.18 +
          Math.sin(2 * Math.PI * f * 3.01 * t) * 0.07) *
        e;
    }
  return o;
}

function digitalSpin() {
  // rotation digitale : bruit filtré qui monte puis s'éteint + ronronnement pulsé
  const len = 0.9;
  const n = buf(len).map(() => noise());
  const o = buf(len);
  let y1 = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const fc = 400 + 3000 * Math.sin((Math.PI * t) / len);
    const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
    y1 += a * (n[i] - y1);
    const pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * 14 * t);
    o[i] = (y1 * 0.5 + Math.sin(2 * Math.PI * (220 + 300 * t) * t) * 0.12 * pulse) * Math.sin((Math.PI * t) / len);
  }
  return o;
}

function whoosh(len = 0.7) {
  const n = buf(len).map(() => noise());
  const o = buf(len);
  let y = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const p = t / len;
    const fc = 200 + 4000 * Math.pow(Math.sin(Math.PI * p), 2);
    const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
    y += a * (n[i] - y);
    o[i] = y * Math.pow(Math.sin(Math.PI * p), 1.5) * 0.9;
  }
  return o;
}

function pop() {
  const o = buf(0.25);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const f = 180 + 700 * Math.exp(-t / 0.03);
    ph += (2 * Math.PI * f) / SR;
    o[i] = Math.sin(ph) * env(t, 0.002, 0.06) * 0.8;
  }
  return o;
}

function powerDown() {
  // la synchro s'arrête : glissando descendant
  const o = buf(0.6);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const f = 900 * Math.exp(-t / 0.18) + 80;
    ph += (2 * Math.PI * f) / SR;
    o[i] = (Math.sin(ph) + 0.3 * Math.sin(ph * 2)) * env(t, 0.005, 0.2) * 0.35;
  }
  return o;
}

function sparkle() {
  const o = buf(0.9);
  const fs_ = [2637, 3136, 3520, 4186, 3951];
  fs_.forEach((f, k) => {
    const st = k * 0.05;
    for (let i = Math.round(st * SR); i < o.length; i++) {
      const t = i / SR - st;
      o[i] += Math.sin(2 * Math.PI * f * t) * env(t, 0.002, 0.12) * 0.18;
    }
  });
  return o;
}

// ---------- musique ----------
// Afro-pop / amapiano léger, 112 BPM, en La mineur. Durée paramétrable.
function music(seconds) {
  const bpm = 112;
  const beat = 60 / bpm;
  const L = buf(seconds);
  const R = buf(seconds);
  const add = (i, v, pan = 0) => {
    if (i < 0 || i >= L.length) return;
    L[i] += v * (1 - Math.max(0, pan));
    R[i] += v * (1 + Math.min(0, pan));
  };
  const totalBeats = Math.floor(seconds / beat);

  // progression : Am – F – C – G (une mesure chacun)
  const chords = [
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
    [261.63, 329.63, 392.0],
    [196.0, 246.94, 293.66],
  ];
  const bassNotes = [110.0, 87.31, 130.81, 98.0];

  for (let b = 0; b < totalBeats; b++) {
    const t0 = b * beat;
    const bar = Math.floor(b / 4);
    const ci = bar % 4;
    const s0 = Math.round(t0 * SR);

    // kick sur chaque temps (log drum-ish)
    for (let i = 0; i < 0.35 * SR; i++) {
      const t = i / SR;
      const f = 50 + 110 * Math.exp(-t / 0.04);
      add(s0 + i, Math.sin(2 * Math.PI * f * t) * env(t, 0.001, 0.12) * 0.55);
    }
    // clap sur 2 et 4
    if (b % 2 === 1)
      for (let i = 0; i < 0.2 * SR; i++) {
        const t = i / SR;
        add(s0 + i, noise() * env(t, 0.001, 0.05) * 0.18, 0.15);
      }
    // shakers en double-croches
    for (let k = 0; k < 4; k++) {
      const st = s0 + Math.round((k * beat * SR) / 4);
      const acc = k === 2 ? 0.09 : 0.05;
      for (let i = 0; i < 0.05 * SR; i++) {
        const t = i / SR;
        add(st + i, noise() * env(t, 0.001, 0.012) * acc, -0.35);
      }
    }
    // basse syncopée (amapiano log-drum style) : temps 1 et contretemps du 3
    if (b % 4 === 0 || b % 4 === 2) {
      const st = b % 4 === 2 ? s0 + Math.round(beat * 0.5 * SR) : s0;
      const f = bassNotes[ci];
      for (let i = 0; i < beat * 0.9 * SR; i++) {
        const t = i / SR;
        const pitch = f * (1 + 0.6 * Math.exp(-t / 0.02));
        add(st + i, Math.tanh(Math.sin(2 * Math.PI * pitch * t) * 2) * env(t, 0.003, 0.22) * 0.32);
      }
    }
    // stabs d'accords (piano électrique) sur les contretemps
    if (b % 1 === 0) {
      const st = s0 + Math.round(beat * 0.5 * SR);
      for (const f of chords[ci])
        for (let i = 0; i < 0.3 * SR; i++) {
          const t = i / SR;
          const v =
            (Math.sin(2 * Math.PI * f * 2 * t) * 0.6 + Math.sin(2 * Math.PI * f * 4 * t) * 0.15) * env(t, 0.004, 0.09);
          add(st + i, v * 0.07, 0.25);
        }
    }
    // pad (nappe) par mesure
    if (b % 4 === 0)
      for (const f of chords[ci])
        for (let i = 0; i < beat * 4 * SR; i++) {
          const t = i / SR;
          const e = Math.min(1, t / 0.4) * Math.min(1, (beat * 4 - t) / 0.4);
          const v = Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.005 * t);
          add(s0 + i, v * e * 0.025, 0);
        }
  }
  // fondus d'entrée/sortie
  const fade = 0.6 * SR;
  for (let i = 0; i < L.length; i++) {
    const g = Math.min(1, i / (0.15 * SR), (L.length - i) / fade);
    L[i] *= g;
    R[i] *= g;
  }
  return [lp(L, 9000), lp(R, 9000)];
}

const out = (p) => path.join(root, "public", p);
writeWav(out("sfx/click.wav"), click());
writeWav(out("sfx/toggle.wav"), toggleSlide());
writeWav(out("sfx/confirm.wav"), confirm());
writeWav(out("sfx/digital-spin.wav"), digitalSpin());
writeWav(out("sfx/whoosh.wav"), hp(whoosh(), 120));
writeWav(out("sfx/pop.wav"), pop());
writeWav(out("sfx/power-down.wav"), powerDown());
writeWav(out("sfx/sparkle.wav"), sparkle());
const [mL, mR] = music(Number(process.env.MUSIC_SECONDS ?? 46));
writeWav(out("music/afro-pop-bed.wav"), mL, mR);
