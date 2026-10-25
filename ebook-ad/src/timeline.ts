import {FPS} from './theme';

const s = (sec: number) => Math.round(sec * FPS);

/** Découpage du storyboard v3 (en frames, 30 fps). Durée totale : 55 s. */
export const scenes = {
  hook: {from: s(0), duration: s(6)},
  struggle: {from: s(6), duration: s(7)},
  solution: {from: s(13), duration: s(8)},
  quiz: {from: s(21), duration: s(10)},
  report: {from: s(31), duration: s(10)},
  benefits: {from: s(41), duration: s(6)},
  offer: {from: s(47), duration: s(8)},
};

export const TOTAL_FRAMES = s(55);

/** Chevauchement des scènes pour les transitions (frames). */
export const OVERLAP = 8;

/** Frame locale d'une scène correspondant à un instant global (en secondes). */
export const localAt = (k: keyof typeof scenes, sec: number) => s(sec) - scenes[k].from + (k === 'hook' ? 0 : OVERLAP);
