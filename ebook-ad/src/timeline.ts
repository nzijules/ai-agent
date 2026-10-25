import {FPS} from './theme';

const s = (sec: number) => Math.round(sec * FPS);

/** Découpage du storyboard (en frames, 30 fps). Durée totale : 40 s. */
export const scenes = {
  hook: {from: s(0), duration: s(5)},
  problem: {from: s(5), duration: s(6)},
  solution: {from: s(11), duration: s(7)},
  benefits: {from: s(18), duration: s(11)},
  offer: {from: s(29), duration: s(6)},
  cta: {from: s(35), duration: s(5)},
};

export const TOTAL_FRAMES = s(40);

/** Durée d'un bénéfice dans la scène 4. */
export const BENEFIT_START = 18;
export const BENEFIT_STEP = 75;
