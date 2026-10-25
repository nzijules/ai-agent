// Recale automatiquement une voix off brute sur la timeline de la vidéo.
//
// Entrée : public/audio/voiceover-source.mp3 (voix enregistrée ou générée,
//          lue d'une traite, en suivant docs/VOIX-OFF.md)
// Sortie : public/audio/voiceover.mp3 (50 s, chaque phrase placée sur son animation)
//
// Fonctionnement :
//  1. détection des pauses (ffmpeg silencedetect) → segments de parole ;
//  2. fusion des segments séparés par les pauses les plus courtes jusqu'à obtenir
//     exactement autant de segments que de répliques dans src/captions.ts ;
//  3. chaque segment est placé au `start` de sa réplique, puis le volume est normalisé.
// Le script affiche le minutage obtenu : vérifiez-le à l'écoute.
// Usage : node scripts/assemble-voiceover.mjs [seuil_dB=-38] [pause_min_s=0.18]
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const SRC = 'public/audio/voiceover-source.mp3';
const OUT = 'public/audio/voiceover.mp3';
const TOTAL = 50;
const noise = process.argv[2] ?? '-38';
const minPause = process.argv[3] ?? '0.18';

if (!fs.existsSync(SRC)) {
  console.error(`✗ ${SRC} introuvable : déposez d'abord la voix off brute.`);
  process.exit(1);
}

// Répliques (texte + instant de départ) lues dans src/captions.ts
const src = fs.readFileSync('src/captions.ts', 'utf8');
const cues = [...src.matchAll(/\{start:\s*([\d.]+),\s*end:\s*([\d.]+),\s*text:\s*'((?:[^'\\]|\\.)*)'\}/g)].map((m) => ({
  at: +m[1],
  end: +m[2],
  text: m[3].replace(/\\u00A0/g, ' '),
}));

const duration = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', SRC]).toString();
const stderr = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i "${SRC}" -af silencedetect=noise=${noise}dB:d=${minPause} -f null - 2>&1`]).toString();
const starts = [...stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
const ends = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);

// Segments de parole = complément des silences
let segs = [];
let cursor = 0;
for (let i = 0; i < starts.length; i++) {
  if (starts[i] > cursor + 0.05) segs.push([cursor, starts[i]]);
  cursor = ends[i] ?? duration;
}
if (cursor < duration - 0.05) segs.push([cursor, duration]);
segs = segs.filter(([a, b]) => b - a > 0.12);

if (segs.length < cues.length) {
  console.error(`✗ ${segs.length} segments détectés pour ${cues.length} répliques. Réessayez avec une pause minimale plus courte, ex. : node scripts/assemble-voiceover.mjs -38 0.12`);
  process.exit(1);
}
while (segs.length > cues.length) {
  let best = 0;
  for (let i = 1; i < segs.length - 1; i++) if (segs[i + 1][0] - segs[i][1] < segs[best + 1][0] - segs[best][1]) best = i;
  segs.splice(best, 2, [segs[best][0], segs[best + 1][1]]);
}

const pad = 0.04;
const parts = segs.map(([a, b], i) => {
  const s0 = Math.max(0, a - pad);
  const s1 = Math.min(duration, b + pad);
  const d = Math.round(cues[i].at * 1000);
  return `[0:a]atrim=${s0.toFixed(3)}:${s1.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st=${(s1 - s0 - 0.03).toFixed(3)}:d=0.03,adelay=${d}|${d}[s${i}]`;
});
const mix = `${segs.map((_, i) => `[s${i}]`).join('')}amix=inputs=${segs.length}:normalize=0,apad=whole_dur=${TOTAL},atrim=0:${TOTAL},loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', SRC, '-filter_complex', [...parts, mix].join(';'), '-map', '[out]', '-ar', '44100', '-ac', '2', '-b:a', '192k', OUT], {stdio: 'inherit'});

console.log(`✓ ${OUT}\n`);
segs.forEach(([a, b], i) => {
  const len = b - a;
  const next = cues[i + 1]?.at ?? TOTAL;
  const warn = cues[i].at + len > next ? '  ⚠ déborde sur la réplique suivante' : '';
  console.log(`${cues[i].at.toFixed(1).padStart(5)} s → ${(cues[i].at + len).toFixed(1).padStart(5)} s  (${len.toFixed(1)} s)  ${cues[i].text}${warn}`);
});
