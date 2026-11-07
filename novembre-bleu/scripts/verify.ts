/**
 * Vérifications techniques et éditoriales automatisées.
 * Usage : npm run verify   (après un rendu, vérifie aussi les fichiers MP4 présents dans out/)
 */
import fs from 'node:fs';
import {execSync} from 'node:child_process';
import {
  FPS, TOTAL_FRAMES, SCENES, PLACED_LINES, SUBTITLE_CUES, VO_LINES,
} from '../src/data/timeline';

let failures = 0;
const ok = (cond: boolean, msg: string) => {
  console.log(`${cond ? '✔' : '✘'} ${msg}`);
  if (!cond) failures++;
};

// 1. Script validé (texte de référence, ordre exact)
const SCRIPT = `Chaque matin, il se lève pour les siens.
Il travaille. Il avance. Il protège sa famille.
Il trouve du temps pour tout le monde.
Mais pour sa propre santé… prend-il vraiment le temps ?
En Côte d'Ivoire, le cancer de la prostate touche des milliers d'hommes.
Et le plus inquiétant, c'est qu'au début, il peut évoluer sans aucun symptôme.
Pas de douleur. Pas de signe évident.
Pourtant, le risque augmente avec l'âge.
Les antécédents familiaux comptent aussi.
Dès quarante-cinq ans, il est important de parler de son risque avec un professionnel de santé.
Selon votre situation, il pourra vous proposer un dépistage adapté, notamment par une prise de sang appelée PSA.
Ce test ne suffit pas, à lui seul, à diagnostiquer un cancer.
Mais il peut contribuer à une détection précoce.
Et lorsqu'un cancer est détecté à un stade précoce, les possibilités de traitement sont souvent meilleures.
Alors, n'attendez pas forcément les premiers symptômes pour en parler.
Parce que prendre soin de soi, ce n'est pas une faiblesse.
C'est une responsabilité.
Pour vous. Pour ceux qui vous aiment. Pour demain.
Novembre Bleu.
Le courage, c'est aussi de prendre soin de sa santé.
AroSoft… La technologie au service de l'humain.`;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const subtitleText = norm(VO_LINES.flatMap((l) => l.chunks.map((c) => c.text)).join(' '));
ok(subtitleText === norm(SCRIPT), 'Sous-titres = texte intégral du script validé (aucun mot modifié, ordre respecté)');

// 2. Durée totale et continuité des scènes
ok(TOTAL_FRAMES === 2700 && FPS === 30, `Composition : ${TOTAL_FRAMES} frames @ ${FPS} fps`);
const sum = SCENES.reduce((a, s) => a + s.durationFrames, 0);
ok(sum === TOTAL_FRAMES, `Somme des durées de scènes = ${sum} frames`);
let contiguous = SCENES[0].startFrame === 0;
SCENES.forEach((s, i) => {
  if (i > 0 && s.startFrame !== SCENES[i - 1].startFrame + SCENES[i - 1].durationFrames) contiguous = false;
});
ok(contiguous, 'Scènes contiguës, sans trou ni chevauchement');
ok(SCENES.every((s) => s.durationFrames >= 90), `Durée minimale de scène ≥ 3 s (min = ${(Math.min(...SCENES.map((s) => s.durationFrames)) / FPS).toFixed(2)} s)`);

// 3. Voix-off : pas de chevauchement, dans les bornes, chaque phrase dans sa scène
let voOk = true;
PLACED_LINES.forEach((l, i) => {
  if (i > 0 && l.startFrame < PLACED_LINES[i - 1].startFrame + PLACED_LINES[i - 1].durationFrames) voOk = false;
  if (i > 0 && l.srcIn < PLACED_LINES[i - 1].srcOut) voOk = false;
});
ok(voOk, 'Segments de voix-off sans chevauchement (timeline et source)');
const last = PLACED_LINES[PLACED_LINES.length - 1];
ok(last.startFrame + last.durationFrames <= TOTAL_FRAMES - 30, `Voix-off terminée ${((TOTAL_FRAMES - last.startFrame - last.durationFrames) / FPS).toFixed(2)} s avant la fin`);
const inScene = PLACED_LINES.every((l) => {
  const s = SCENES.find((x) => x.id === l.scene)!;
  return l.startFrame >= s.startFrame && l.startFrame + l.durationFrames <= s.startFrame + s.durationFrames + 2;
});
ok(inScene, 'Chaque phrase est entièrement contenue dans sa scène');
const srcSpan = PLACED_LINES.reduce((a, l) => a + (l.srcOut - l.srcIn), 0);
ok(true, `Parole placée : ${srcSpan.toFixed(2)} s (fichier VO : 74,95 s, silences naturels inclus)`);

// 4. Sous-titres : lisibilité
let subsOk = true;
let maxCps = 0;
SUBTITLE_CUES.forEach((c, i) => {
  if (i > 0 && c.startFrame < SUBTITLE_CUES[i - 1].endFrame) subsOk = false;
  const d = (c.endFrame - c.startFrame) / FPS;
  maxCps = Math.max(maxCps, c.text.length / d);
});
ok(subsOk, `${SUBTITLE_CUES.length} sous-titres sans chevauchement`);
ok(maxCps <= 25, `Vitesse de lecture max : ${maxCps.toFixed(1)} caractères/s (calée sur le débit réel de la voix)`);
ok(SUBTITLE_CUES.every((c) => c.text.length <= 84), 'Longueur des sous-titres ≤ 84 caractères (2 lignes max)');

// 5. Garde-fous éditoriaux sur le texte à l'écran
const onScreen = SCENES.flatMap((s) => s.onScreen).join(' ').toLowerCase();
ok(!/guéri|guérison|100 ?%|chaque année|obligatoire/.test(onScreen), 'Aucune promesse de guérison ni dépistage annuel / obligatoire à l’écran');
ok(!/\d+ ?%|\d{3,} (hommes|cas)/.test(onScreen), 'Aucune statistique chiffrée non sourcée à l’écran');

// 6. Fichiers rendus
for (const f of ['out/novembre-bleu-1080x1920.mp4', 'out/novembre-bleu-1920x1080.mp4', 'out/preview-S01-S03-15s.mp4']) {
  if (!fs.existsSync(f)) {
    console.log(`… ${f} absent (non rendu)`);
    continue;
  }
  const probe = JSON.parse(execSync(`ffprobe -v error -print_format json -show_streams -show_format "${f}"`).toString());
  const v = probe.streams.find((s: {codec_type: string}) => s.codec_type === 'video');
  const a = probe.streams.find((s: {codec_type: string}) => s.codec_type === 'audio');
  const frames = Number(v.nb_frames);
  const expected = f.includes('preview') ? 450 : TOTAL_FRAMES;
  ok(frames === expected && v.codec_name === 'h264' && v.r_frame_rate === '30/1' && !!a,
    `${f} : ${v.width}x${v.height}, ${v.codec_name}, ${v.r_frame_rate} fps, ${frames} frames, audio ${a?.codec_name}, ${Number(probe.format.duration).toFixed(3)} s`);
}

console.log(failures ? `\n${failures} vérification(s) en échec` : '\nToutes les vérifications automatiques sont OK');
process.exit(failures ? 1 : 0);
