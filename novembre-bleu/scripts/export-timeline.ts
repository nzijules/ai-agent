/**
 * Génère à partir de src/data/timeline.ts :
 *  - out/novembre-bleu.fr.srt        (sous-titres synchronisés)
 *  - docs/TIMELINE.md                 (timeline lisible, scènes + VO + repères)
 *  - scripts/timeline.json            (repères consommés par generate-music.py)
 * Usage : npm run timeline
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  FPS, TOTAL_FRAMES, SCENES, PLACED_LINES, SUBTITLE_CUES, VO_END_SECONDS,
} from '../src/data/timeline';

const root = path.resolve(__dirname, '..');
const srtTime = (frame: number) => {
  const ms = Math.round((frame / FPS) * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};
const tc = (frame: number) => `${(frame / FPS).toFixed(2)} s (f${frame})`;

// --- SRT
const srt = SUBTITLE_CUES.map(
  (c) => `${c.index}\n${srtTime(c.startFrame)} --> ${srtTime(c.endFrame)}\n${c.text}\n`,
).join('\n');
fs.mkdirSync(path.join(root, 'out'), {recursive: true});
fs.writeFileSync(path.join(root, 'out/novembre-bleu.fr.srt'), srt, 'utf8');

// --- JSON pour la musique
fs.writeFileSync(
  path.join(root, 'scripts/timeline.json'),
  JSON.stringify(
    {
      fps: FPS,
      totalFrames: TOTAL_FRAMES,
      scenes: SCENES.map((s) => ({id: s.id, start: s.startFrame / FPS, duration: s.durationFrames / FPS})),
      voice: PLACED_LINES.map((l) => ({id: l.id, start: l.start, end: l.end})),
    },
    null,
    2,
  ),
);

// --- Markdown
let md = `# Timeline — Novembre Bleu (généré par \`npm run timeline\`)\n\n`;
md += `- Durée : **${TOTAL_FRAMES} frames @ ${FPS} fps = ${TOTAL_FRAMES / FPS} s**\n`;
md += `- Fin de la voix-off sur la timeline : ${VO_END_SECONDS.toFixed(2)} s — queue musicale / end card : ${(TOTAL_FRAMES / FPS - VO_END_SECONDS).toFixed(2)} s\n\n`;
md += `## Scènes\n\n| Scène | Storyboard initial | Début | Fin | Durée | Titre | Texte à l'écran |\n|---|---|---|---|---|---|---|\n`;
for (const s of SCENES) {
  md += `| ${s.id} | ${s.storyboard} s | ${tc(s.startFrame)} | ${tc(s.startFrame + s.durationFrames)} | ${(s.durationFrames / FPS).toFixed(2)} s | ${s.title} | ${s.onScreen.join(' · ') || '—'} |\n`;
}
md += `\n## Placement de la voix-off\n\nChaque phrase est lue dans le fichier source (\`srcIn\`→\`srcOut\`) et posée sur la timeline (\`début\`). Aucun mot n'est coupé : seules les respirations entre phrases sont allongées.\n\n| Ligne | Scène | Source (s) | Timeline (s) | Silence avant | Texte |\n|---|---|---|---|---|---|\n`;
for (const l of PLACED_LINES) {
  md += `| ${l.id} | ${l.scene} | ${l.srcIn.toFixed(2)} → ${l.srcOut.toFixed(2)} | ${l.start.toFixed(2)} → ${l.end.toFixed(2)} | ${l.gapBefore.toFixed(2)} | ${l.chunks.map((c) => c.text).join(' ')} |\n`;
}
md += `\n## Sous-titres (${SUBTITLE_CUES.length} repères)\n\n| # | Début | Fin | Texte |\n|---|---|---|---|\n`;
for (const c of SUBTITLE_CUES) md += `| ${c.index} | ${srtTime(c.startFrame)} | ${srtTime(c.endFrame)} | ${c.text} |\n`;
fs.writeFileSync(path.join(root, 'docs/TIMELINE.md'), md, 'utf8');

console.log(`SRT: ${SUBTITLE_CUES.length} repères — TIMELINE.md et timeline.json écrits.`);
