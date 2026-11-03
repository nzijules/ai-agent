import {Easing, spring} from 'remotion';
import {FPS} from './timing';

export const C = {
  yellow: '#FFCB05',
  yellowDeep: '#F2B400',
  black: '#0B0B0C',
  ink: '#14161B',
  navy: '#0E1320',
  white: '#FFFFFF',
  paper: '#F6F4EE',
  red: '#E5332A',
  redDeep: '#3A0708',
  green: '#1FAF5A',
  grey: '#8A8F98',
};
export const F = {
  display: 'Montserrat, sans-serif',
  ui: 'Inter, sans-serif',
};

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);

/** 0→1 progression entre a et a+d, avec easing. */
export const prog = (t: number, a: number, d: number, ease: (x: number) => number = easeOut) =>
  ease(clamp((t - a) / d));

/** Apparition puis disparition. */
export const inOut = (t: number, a: number, b: number, fi = 0.35, fo = 0.35) =>
  Math.min(prog(t, a, fi), 1 - prog(t, b - fo, fo, easeIn));

export const sp = (t: number, a: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
  spring({frame: Math.max(0, (t - a) * FPS), fps: FPS, config: {damping: 14, stiffness: 140, mass: 0.7, ...cfg}});

/** Pseudo-aléatoire déterministe. */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Léger mouvement "caméra à l'épaule". */
export const drift = (t: number, amp = 6, seed = 1) => ({
  x: Math.sin(t * 0.7 + seed) * amp + Math.sin(t * 1.9 + seed * 2) * amp * 0.35,
  y: Math.cos(t * 0.6 + seed * 3) * amp * 0.7 + Math.sin(t * 2.3 + seed) * amp * 0.25,
  r: Math.sin(t * 0.5 + seed) * 0.15,
});
