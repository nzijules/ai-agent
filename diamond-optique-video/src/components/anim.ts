import {Easing, interpolate, spring} from 'remotion';
import {FPS} from '../config';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ease = Easing.bezier(0.22, 1, 0.36, 1); // easeOutQuint-like
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

export const tween = (f: number, a: number, b: number, from = 0, to = 1, e = ease) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: e});

export const spr = (frame: number, delay = 0, damping = 14, mass = 0.7, stiffness = 140) =>
  spring({frame: frame - delay, fps: FPS, config: {damping, mass, stiffness}});

/** pseudo-random déterministe */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
