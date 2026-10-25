import {Easing, interpolate, spring, SpringConfig} from 'remotion';
import {FPS} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const SPRING_SOFT: Partial<SpringConfig> = {damping: 200, mass: 0.9};
export const SPRING_POP: Partial<SpringConfig> = {damping: 13, stiffness: 140, mass: 0.8};
export const SPRING_SNAPPY: Partial<SpringConfig> = {damping: 20, stiffness: 180};

/** Spring 0 → 1 démarrant à `delay` frames. */
export const sp = (frame: number, delay = 0, config: Partial<SpringConfig> = SPRING_SOFT, durationInFrames?: number) =>
  spring({frame: frame - delay, fps: FPS, config, durationInFrames});

/** Progression linéaire easée entre deux frames. */
export const prog = (frame: number, start: number, end: number, ease = Easing.bezier(0.65, 0, 0.35, 1)) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing: ease});

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
