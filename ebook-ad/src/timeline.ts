import {FPS} from './theme';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * Découpage du storyboard (en frames, 30 fps).
 * Durée totale : 50 s. Le brief prévoyait 45 s, mais la voix off de l'offre
 * (« Apprendre à apprendre avec ChatGPT. Votre guide pratique, à seulement
 * dix mille francs CFA. Commandez maintenant ! ») demande ~7 s à un débit
 * naturel : la scène 7 dure donc 8 s et la scène 6 en dure 6.
 */
export const scenes = {
  hook: {from: s(0), duration: s(6)},
  struggle: {from: s(6), duration: s(6)},
  solution: {from: s(12), duration: s(7)},
  quiz: {from: s(19), duration: s(9)},
  report: {from: s(28), duration: s(8)},
  benefits: {from: s(36), duration: s(6)},
  offer: {from: s(42), duration: s(8)},
};

export const TOTAL_FRAMES = s(50);

/** Chevauchement des scènes pour les transitions (frames). */
export const OVERLAP = 8;
