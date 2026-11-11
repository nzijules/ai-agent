import {loadFont} from '@remotion/fonts';
import {Easing, interpolate, staticFile} from 'remotion';

// Polices embarquées localement (public/fonts)
for (const w of ['600', '700', '800']) loadFont({family: 'Sora', url: staticFile(`fonts/sora-latin-${w}-normal.woff2`), weight: w});
for (const w of ['400', '500', '600', '700']) loadFont({family: 'Inter', url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w});

export const display = '"Sora", "Inter", sans-serif';
export const body = '"Inter", sans-serif';

// Charte AroSoft (logo + couverture de l'ebook)
export const C = {
  navy: '#131C3A',
  navy2: '#1B2752',
  blue: '#0A5BFF',
  blueLight: '#0A8CFF',
  sky: '#7FB2FF',
  pale: '#F2F6FF',
  yellow: '#FFC21A',
  red: '#E1262D',
  claude: '#E8692A',
  white: '#FFFFFF',
  skin: '#8A5636',
  skin2: '#5E3A22',
  hair: '#1E1A2E',
  green: '#3FA36B',
};

export const FPS = 30;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 entre deux instants (en secondes), avec easing. */
export const t01 = (frame: number, startSec: number, durSec = 0.6, easing = ease) =>
  interpolate(frame, [startSec * FPS, (startSec + durSec) * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Apparition « pop » avec léger dépassement. */
export const pop = (frame: number, startSec: number, durSec = 0.5) =>
  interpolate(frame, [startSec * FPS, (startSec + durSec) * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
