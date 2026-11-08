// Synthèse procédurale des effets sonores (aucun fichier externe, aucun droit tiers).
// Usage : node scripts/generate-sfx.mjs  → public/sfx/*.wav
import fs from "node:fs";
const SR = 44100;
const out = "public/sfx";
fs.mkdirSync(out, { recursive: true });

const write = (name, data) => {
  const n = data.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  let peak = 0; for (const v of data) peak = Math.max(peak, Math.abs(v));
  const g = peak > 0 ? 0.89 / peak : 1;
  data.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * g)) * 32767), 44 + i * 2));
  fs.writeFileSync(`${out}/${name}.wav`, buf);
  console.log("✓", name);
};
const gen = (sec, fn) => Array.from({ length: Math.floor(sec * SR) }, (_, i) => fn(i / SR, i));
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const lp = (arr, a) => { let y = 0; return arr.map((x) => (y += a * (x - y))); };

// vibration : bourdonnement grave modulé
write("buzz", gen(0.6, (t) => {
  const env = Math.min(1, t / 0.02) * Math.min(1, (0.6 - t) / 0.05);
  return env * (Math.sign(Math.sin(2 * Math.PI * 165 * t)) * 0.5 + Math.sin(2 * Math.PI * 82 * t)) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 30 * t));
}));
// whoosh : bruit filtré balayé
{ const n = gen(0.55, () => rnd()); let y = 0, y2 = 0;
  write("whoosh", n.map((x, i) => { const t = i / SR; const a = 0.02 + 0.25 * Math.sin(Math.PI * t / 0.55); y += a * (x - y); y2 += a * (y - y2); return y2 * Math.sin(Math.PI * t / 0.55) ** 2; })); }
// tampon : impact sourd + transitoire
write("stamp", gen(0.7, (t) => Math.sin(2 * Math.PI * (90 - 40 * t) * t) * Math.exp(-t * 9) + rnd() * Math.exp(-t * 60) * 0.8));
// impact grave (verdict / révélation)
write("hit", gen(1.6, (t) => Math.sin(2 * Math.PI * (55 - 20 * t) * t) * Math.exp(-t * 2.6) + Math.sin(2 * Math.PI * 110 * t) * Math.exp(-t * 6) * 0.4 + rnd() * Math.exp(-t * 30) * 0.5));
// alerte : double bip
write("alert", gen(0.5, (t) => { const on = t < 0.2 || (t > 0.26 && t < 0.46); const f = t < 0.23 ? 880 : 660; return on ? Math.sin(2 * Math.PI * f * t) * 0.8 + Math.sin(2 * Math.PI * f * 2 * t) * 0.15 : 0; }));
// tick : clic d'interface
write("tick", gen(0.06, (t) => (rnd() * 0.5 + Math.sin(2 * Math.PI * 2400 * t)) * Math.exp(-t * 120)));
// notification : carillon doux
write("notif", gen(0.7, (t) => (Math.sin(2 * Math.PI * 1320 * t) * Math.exp(-t * 7) + (t > 0.12 ? Math.sin(2 * Math.PI * 1760 * (t - 0.12)) * Math.exp(-(t - 0.12) * 6) : 0)) * 0.6));
// pulsation : battement de tension
write("pulse", gen(0.4, (t) => Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 14) + (t > 0.14 ? Math.sin(2 * Math.PI * 55 * (t - 0.14)) * Math.exp(-(t - 0.14) * 16) * 0.7 : 0)));
// nappe d'ambiance (boucle 20 s)
write("drone", lp(gen(20, (t) => {
  const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * t / 10);
  return lfo * (Math.sin(2 * Math.PI * 55 * t) + 0.5 * Math.sin(2 * Math.PI * 82.4 * t + Math.sin(t)) + 0.3 * Math.sin(2 * Math.PI * 110.3 * t)) + rnd() * 0.15;
}), 0.08).map((v, i, a) => { const t = i / SR; const fade = Math.min(1, t / 0.5, (20 - t) / 0.5); return v * fade; }));
