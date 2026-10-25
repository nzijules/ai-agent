// Recale la voix off phrase par phrase sur la timeline de la vidéo.
// Entrée : public/audio/voiceover-source.mp3 (voix brute, ex. export ElevenLabs)
// Sortie : public/audio/voiceover.mp3 (40 s, chaque phrase placée sur son animation)
// Les découpes (`src`) correspondent aux pauses détectées dans la voix brute ;
// `at` est l'instant de la vidéo où la phrase démarre. À ajuster si la voix change.
// Usage : node scripts/assemble-voiceover.mjs
import {execFileSync} from 'node:child_process';

const SRC = 'public/audio/voiceover-source.mp3';
const OUT = 'public/audio/voiceover.mp3';

export const segments = [
  {src: [0.0, 1.72], at: 0.3}, // Votre enfant utilise ChatGPT…
  {src: [2.02, 2.96], at: 2.8}, // mais apprend-il vraiment ?
  {src: [3.6, 5.25], at: 5.2}, // Devoirs, leçons mal comprises,
  {src: [5.51, 7.03], at: 6.95}, // réponses copiées sans réflexion…
  {src: [7.44, 9.88], at: 8.5}, // Obtenir une réponse ne signifie pas comprendre.
  {src: [10.61, 13.41], at: 11.3}, // Découvrez « Apprendre à apprendre avec ChatGPT »,
  {src: [13.75, 16.49], at: 14.3}, // le guide qui en fait un véritable tuteur pédagogique.
  {src: [17.08, 19.24], at: 18.0}, // Aidez votre enfant à comprendre ses leçons,
  {src: [19.46, 20.93], at: 20.4}, // à réviser intelligemment,
  {src: [21.14, 22.52], at: 22.9}, // à développer son autonomie…
  {src: [22.84, 24.09], at: 25.3}, // et accompagnez ses progrès,
  {src: [24.21, 25.82], at: 26.6}, // de la sixième à la terminale.
  {src: [26.41, 27.8], at: 29.2}, // Le guide pratique des parents,
  {src: [28.09, 29.71], at: 30.9}, // pour seulement dix mille francs CFA.
  {src: [30.26, 32.85], at: 35.0}, // Donnez à votre enfant une meilleure méthode pour apprendre.
  {src: [33.36, 35.32], at: 37.7}, // Commandez votre exemplaire dès aujourd’hui.
];

const parts = segments.map((s, i) => {
  const d = Math.round(s.at * 1000);
  const fade = 0.03;
  const len = s.src[1] - s.src[0];
  return `[0:a]atrim=${s.src[0]}:${s.src[1]},asetpts=PTS-STARTPTS,afade=t=in:d=${fade},afade=t=out:st=${(len - fade).toFixed(3)}:d=${fade},adelay=${d}|${d}[s${i}]`;
});
const mix = `${segments.map((_, i) => `[s${i}]`).join('')}amix=inputs=${segments.length}:normalize=0,apad=whole_dur=40,atrim=0:40,loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', SRC, '-filter_complex', [...parts, mix].join(';'), '-map', '[out]', '-ar', '44100', '-ac', '2', '-b:a', '192k', OUT], {stdio: 'inherit'});
console.log('✓', OUT);
