// Génère la musique et les effets sonores de la publicité, 100 % synthétisés
// localement (aucun sample externe → aucune question de droits d'auteur).
// Génère aussi docs/sous-titres.srt à partir de src/captions.ts.
// Usage : npm run audio
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const OUT = path.resolve('public/audio');
fs.mkdirSync(OUT, {recursive: true});

// ---------------------------------------------------------------- utilitaires
let seed = 12345;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const buf = (sec) => [new Float32Array(Math.ceil(sec * SR)), new Float32Array(Math.ceil(sec * SR))];

function writeWav(file, [L, R]) {
  const n = L.length;
  const data = Buffer.alloc(44 + n * 4);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + n * 4, 4);
  data.write('WAVE', 8);
  data.write('fmt ', 12);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 4, 28);
  data.writeUInt16LE(4, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(path.join(OUT, file), data);
  console.log('✓', path.join('public/audio', file));
}

/** Filtre biquad RBJ (lp | hp | bp), coefficients recalculables. */
class Biquad {
  constructor(type, f, q = 0.707) {
    this.type = type;
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set(f, q);
  }
  set(f, q = this.q) {
    this.q = q;
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const cs = Math.cos(w);
    const a = Math.sin(w) / (2 * q);
    let b0, b1, b2;
    if (this.type === 'lp') [b0, b1, b2] = [(1 - cs) / 2, 1 - cs, (1 - cs) / 2];
    else if (this.type === 'hp') [b0, b1, b2] = [(1 + cs) / 2, -(1 + cs), (1 + cs) / 2];
    else [b0, b1, b2] = [a, 0, -a];
    const a0 = 1 + a;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * cs) / a0;
    this.a2 = (1 - a) / a0;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

/** Réverbération type Freeverb (simplifiée). */
function reverb([L, R], {room = 0.84, damp = 0.3, wet = 0.3} = {}) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491];
  const aps = [556, 441, 341];
  const proc = (inp, spread) => {
    const out = new Float32Array(inp.length);
    const cs = combs.map((d) => ({b: new Float32Array(d + spread), i: 0, f: 0}));
    const as = aps.map((d) => ({b: new Float32Array(d + spread), i: 0}));
    for (let n = 0; n < inp.length; n++) {
      const x = inp[n] * 0.015;
      let s = 0;
      for (const c of cs) {
        const y = c.b[c.i];
        c.f = y * (1 - damp) + c.f * damp;
        c.b[c.i] = x + c.f * room;
        c.i = (c.i + 1) % c.b.length;
        s += y;
      }
      for (const a of as) {
        const y = a.b[a.i];
        a.b[a.i] = s + y * 0.5;
        a.i = (a.i + 1) % a.b.length;
        s = y - s;
      }
      out[n] = s;
    }
    return out;
  };
  const rl = proc(L, 0);
  const rr = proc(R, 23);
  for (let n = 0; n < L.length; n++) {
    L[n] += rl[n] * wet * 3;
    R[n] += rr[n] * wet * 3;
  }
}

const normalize = ([L, R], peak = 0.89) => {
  let m = 0;
  for (let i = 0; i < L.length; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = m > 0 ? peak / m : 1;
  for (let i = 0; i < L.length; i++) {
    L[i] *= g;
    R[i] *= g;
  }
};

const softClip = (x) => Math.tanh(x);

// ------------------------------------------------------------------ musique
function music() {
  const DUR = 55.5;
  const BPM = 100;
  const beat = 60 / BPM;
  const bar = beat * 4;
  const [L, R] = buf(DUR);
  const padL = new Float32Array(L.length);
  const padR = new Float32Array(L.length);
  const send = buf(DUR);

  // Grille d'accords (une mesure = 2,4 s)
  // Intro / problème (0–11 s) : Am – F – C – G   (tension douce)
  // Solution → fin (11 s –) : F – G – Am – C… puis C – G – Am – F  (élan positif)
  const chords = {
    Am: [57, 60, 64, 69],
    F: [53, 57, 60, 65],
    C: [48, 55, 60, 64],
    G: [55, 59, 62, 67],
    Em: [52, 59, 64, 67],
  };
  const prog = ['Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'G', 'F', 'G', 'Am', 'C', 'F', 'G', 'Am', 'Em', 'F', 'G', 'C', 'G', 'F', 'G', 'C', 'C', 'C'];
  const chordAt = (t) => chords[prog[Math.min(prog.length - 1, Math.floor(t / bar))]];
  const DROP = 12.6; // révélation du livre (calé sur un temps)
  const OUTRO = 53.4;

  // ----- Pad (scies désaccordées filtrées)
  const lp = [new Biquad('lp', 800), new Biquad('lp', 800)];
  const phases = new Float64Array(64);
  for (let n = 0; n < L.length; n++) {
    const t = n / SR;
    const ch = chordAt(t);
    const pos = (t % bar) / bar;
    const xf = Math.min(1, pos * 12); // petit fondu à chaque changement
    let sl = 0,
      sr = 0;
    ch.forEach((note, k) => {
      for (let d = 0; d < 3; d++) {
        const idx = k * 3 + d;
        const det = (d - 1) * 0.0045;
        phases[idx] += (midi(note) * (1 + det)) / SR;
        const saw = 2 * (phases[idx] % 1) - 1;
        const pan = (k / 3) * 0.8 + 0.1;
        sl += saw * (1 - pan);
        sr += saw * pan;
      }
    });
    if (n % 64 === 0) {
      const base = t < DROP ? 500 + 500 * (t / DROP) : 1500 + 400 * Math.sin(t * 0.4);
      const close = t > OUTRO ? Math.max(300, base * (1 - (t - OUTRO) / 2)) : base;
      lp[0].set(close, 0.8);
      lp[1].set(close, 0.8);
    }
    const env = Math.min(1, t / 0.4) * (0.6 + 0.4 * xf) * (t < DROP ? 1.4 : 1);
    padL[n] = lp[0].run(sl) * 0.05 * env;
    padR[n] = lp[1].run(sr) * 0.05 * env;
  }

  // ----- Enveloppe de sidechain (suit la grosse caisse)
  const duck = new Float32Array(L.length).fill(1);
  const kickTimes = [];
  for (let t = DROP; t < OUTRO; t += beat) kickTimes.push(t);
  // pulsation légère avant le drop (un temps sur deux)
  for (let t = 6.0; t < DROP - 0.6; t += beat * 2) kickTimes.push(t);
  for (const kt of kickTimes) {
    const s = Math.floor(kt * SR);
    for (let i = 0; i < SR * 0.3 && s + i < duck.length; i++) {
      const v = 0.45 + 0.55 * Math.min(1, i / (SR * 0.25));
      duck[s + i] = Math.min(duck[s + i], v);
    }
  }

  // ----- Grosse caisse
  for (const kt of kickTimes) {
    const s = Math.floor(kt * SR);
    const big = kt >= DROP;
    let ph = 0;
    for (let i = 0; i < SR * 0.45 && s + i < L.length; i++) {
      const t = i / SR;
      const f = 45 + 85 * Math.exp(-t * 28);
      ph += f / SR;
      const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 7.5) * (big ? 0.55 : 0.32);
      L[s + i] += v;
      R[s + i] += v;
    }
  }

  // ----- Clap (temps 2 et 4) + charleston
  const clapBp = new Biquad('bp', 1400, 0.9);
  const hatHp = new Biquad('hp', 7000, 0.7);
  for (let t = DROP; t < OUTRO; t += beat) {
    const beatIdx = Math.round((t - DROP) / beat);
    if (beatIdx % 2 === 1) {
      const s = Math.floor(t * SR);
      for (let i = 0; i < SR * 0.22 && s + i < L.length; i++) {
        const tt = i / SR;
        const burst = tt < 0.03 ? 0.6 + 0.4 * Math.sin(tt * 900) : 1;
        const v = clapBp.run(noise()) * Math.exp(-tt * 18) * burst * 0.35;
        L[s + i] += v * 0.9;
        R[s + i] += v * 1.1;
        send[0][s + i] += v * 0.6;
        send[1][s + i] += v * 0.6;
      }
    }
  }
  for (let t = 2.4; t < OUTRO; t += beat / 2) {
    const s = Math.floor(t * SR);
    const off = Math.round((t - 2.4) / (beat / 2)) % 2 === 1;
    const lvl = t < DROP ? 0.05 : off ? 0.11 : 0.06;
    for (let i = 0; i < SR * 0.05 && s + i < L.length; i++) {
      const v = hatHp.run(noise()) * Math.exp(-(i / SR) * 70) * lvl;
      L[s + i] += v * 0.7;
      R[s + i] += v * 1.2;
    }
  }

  // ----- Basse
  const bassLp = new Biquad('lp', 380, 0.9);
  let bph = 0;
  for (let n = Math.floor(6.0 * SR); n < L.length; n++) {
    const t = n / SR;
    if (t > OUTRO + 1.5) break;
    const root = chordAt(t)[0] - 12;
    const step = (t % (beat / 2)) / (beat / 2);
    const gate = t < DROP ? Math.exp(-((t % beat) / beat) * 2) * 0.6 : Math.exp(-step * 2.2);
    bph += midi(root) / SR;
    const raw = Math.sin(2 * Math.PI * bph) + 0.35 * Math.sin(4 * Math.PI * bph);
    const fade = t > OUTRO ? Math.max(0, 1 - (t - OUTRO) / 1.5) : 1;
    const v = bassLp.run(softClip(raw * 1.6)) * gate * 0.22 * fade;
    L[n] += v;
    R[n] += v;
  }

  // ----- Arpège « cloche » (dès le drop) + petite intro en notes isolées
  const arpNotes = (t) => {
    const c = chordAt(t);
    return [c[1] + 12, c[2] + 12, c[3] + 12, c[2] + 12, c[1] + 24, c[3] + 12, c[2] + 12, c[1] + 12];
  };
  const pluck = (start, note, vel, pan) => {
    const s = Math.floor(start * SR);
    const f = midi(note);
    for (let i = 0; i < SR * 0.9 && s + i < L.length; i++) {
      const t = i / SR;
      const v =
        (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 5) +
          0.35 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 9) +
          0.12 * Math.sin(2 * Math.PI * f * 3.01 * t) * Math.exp(-t * 14)) *
        vel *
        Math.min(1, t * 400);
      L[s + i] += v * (1 - pan);
      R[s + i] += v * pan;
      send[0][s + i] += v * (1 - pan) * 0.8;
      send[1][s + i] += v * pan * 0.8;
    }
  };
  // intro : notes espacées, mystérieuses
  [0.0, 1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6, 10.8, 12.0].forEach((t, i) => pluck(t + 0.05, arpNotes(t)[i % 4], 0.1, i % 2 ? 0.3 : 0.7));
  for (let t = DROP, k = 0; t < OUTRO; t += beat / 2, k++) {
    const notes = arpNotes(t);
    pluck(t, notes[k % notes.length], 0.07 + (k % 4 === 0 ? 0.02 : 0), k % 2 ? 0.25 : 0.75);
  }
  // accord final
  chords.C.forEach((n, i) => pluck(OUTRO + i * 0.06, n + 12, 0.08, 0.3 + i * 0.13));

  // ----- Mixage
  for (let n = 0; n < L.length; n++) {
    L[n] += padL[n] * duck[n];
    R[n] += padR[n] * duck[n];
    send[0][n] += padL[n] * 0.5;
    send[1][n] += padR[n] * 0.5;
  }
  reverb(send, {room: 0.86, damp: 0.35, wet: 1});
  for (let n = 0; n < L.length; n++) {
    L[n] += send[0][n] * 0.35;
    R[n] += send[1][n] * 0.35;
    const t = n / SR;
    const fade = Math.min(1, t / 0.3) * (t > DUR - 1.2 ? Math.max(0, (DUR - t) / 1.2) : 1);
    L[n] = softClip(L[n] * 1.1) * fade;
    R[n] = softClip(R[n] * 1.1) * fade;
  }
  normalize([L, R], 0.85);
  writeWav('music.wav', [L, R]);
}

// ------------------------------------------------------------- effets sonores
function whoosh() {
  const D = 0.7;
  const [L, R] = buf(D);
  const bp = new Biquad('bp', 400, 1.2);
  for (let n = 0; n < L.length; n++) {
    const t = n / SR;
    const p = t / D;
    if (n % 32 === 0) bp.set(300 + 3500 * Math.sin(Math.PI * Math.min(1, p * 1.1)), 1.4);
    const env = Math.sin(Math.PI * Math.pow(p, 0.8)) ** 2;
    const v = bp.run(noise()) * env;
    L[n] = v * (1 - p * 0.6);
    R[n] = v * (0.4 + p * 0.6);
  }
  reverb([L, R], {wet: 0.25});
  normalize([L, R], 0.8);
  writeWav('sfx-whoosh.wav', [L, R]);
}

function pop() {
  const D = 0.25;
  const [L, R] = buf(D);
  let ph = 0;
  for (let n = 0; n < L.length; n++) {
    const t = n / SR;
    const f = 520 + 900 * (1 - Math.exp(-t * 60));
    ph += f / SR;
    const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 28) * Math.min(1, t * 2000);
    L[n] = R[n] = v;
  }
  normalize([L, R], 0.75);
  writeWav('sfx-pop.wav', [L, R]);
}

function click() {
  const D = 0.15;
  const [L, R] = buf(D);
  const hp = new Biquad('hp', 2500);
  for (let n = 0; n < L.length; n++) {
    const t = n / SR;
    const v = hp.run(noise()) * Math.exp(-t * 300) * 0.8 + Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 90) * 0.5 + Math.sin(2 * Math.PI * 140 * t) * Math.exp(-t * 40) * 0.5;
    L[n] = R[n] = v;
  }
  normalize([L, R], 0.8);
  writeWav('sfx-click.wav', [L, R]);
}

function tick() {
  const D = 0.6;
  const [L, R] = buf(D);
  for (let n = 0; n < L.length; n++) {
    const t = n / SR;
    const a = Math.sin(2 * Math.PI * 1568 * t) * Math.exp(-t * 9);
    const b = t > 0.07 ? Math.sin(2 * Math.PI * 2093 * (t - 0.07)) * Math.exp(-(t - 0.07) * 8) : 0;
    L[n] = a * 0.8 + b * 0.5;
    R[n] = a * 0.5 + b * 0.8;
  }
  reverb([L, R], {wet: 0.3});
  normalize([L, R], 0.7);
  writeWav('sfx-tick.wav', [L, R]);
}

function shimmer() {
  const D = 2.4;
  const [L, R] = buf(D);
  const notes = [84, 88, 91, 95, 98, 100];
  notes.forEach((m, i) => {
    const s = Math.floor(i * 0.07 * SR);
    const f = midi(m);
    for (let n = 0; s + n < L.length; n++) {
      const t = n / SR;
      const v = (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2.76 * t)) * Math.exp(-t * 2.6) * 0.2;
      const pan = i / (notes.length - 1);
      L[s + n] += v * (1 - pan);
      R[s + n] += v * pan;
    }
  });
  reverb([L, R], {room: 0.9, wet: 0.6});
  normalize([L, R], 0.7);
  writeWav('sfx-shimmer.wav', [L, R]);
}

function impact() {
  const D = 1.8;
  const [L, R] = buf(D);
  const lp = new Biquad('lp', 1200);
  let ph = 0;
  for (let n = 0; n < L.length; n++) {
    const t = n / SR;
    const f = 38 + 70 * Math.exp(-t * 9);
    ph += f / SR;
    const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 2.6) * 0.9 + lp.run(noise()) * Math.exp(-t * 14) * 0.5;
    L[n] = R[n] = softClip(v * 1.4);
  }
  reverb([L, R], {room: 0.88, wet: 0.35});
  normalize([L, R], 0.85);
  writeWav('sfx-impact.wav', [L, R]);
}

function riser() {
  const D = 0.55;
  const [L, R] = buf(D);
  const bp = new Biquad('bp', 300, 2);
  let ph = 0;
  for (let n = 0; n < L.length; n++) {
    const t = n / SR;
    const p = t / D;
    if (n % 32 === 0) bp.set(250 + 6000 * p * p, 2);
    ph += (200 + 900 * p * p) / SR;
    const env = p * p;
    const v = (bp.run(noise()) * 0.9 + Math.sin(2 * Math.PI * ph) * 0.15) * env;
    L[n] = v;
    R[n] = v;
  }
  normalize([L, R], 0.75);
  writeWav('sfx-riser.wav', [L, R]);
}

// ---------------------------------------------------------- sous-titres .srt
function srt() {
  const src = fs.readFileSync(path.resolve('src/captions.ts'), 'utf8');
  const re = /\{start:\s*([\d.]+),\s*end:\s*([\d.]+),\s*text:\s*'((?:[^'\\]|\\.)*)'\}/g;
  const ts = (s) => {
    const ms = Math.round(s * 1000);
    const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, '0')}`;
  };
  let out = '';
  let i = 1;
  for (const m of src.matchAll(re)) {
    const text = m[3].replace(/\\u00A0/g, ' ').replace(/\\'/g, "'");
    out += `${i++}\n${ts(+m[1])} --> ${ts(+m[2])}\n${text}\n\n`;
  }
  fs.mkdirSync('docs', {recursive: true});
  fs.writeFileSync('docs/sous-titres.srt', out);
  console.log('✓ docs/sous-titres.srt', `(${i - 1} répliques)`);
}

music();
whoosh();
pop();
click();
tick();
shimmer();
impact();
riser();
srt();
