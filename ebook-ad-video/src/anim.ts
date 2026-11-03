import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

/** 0 -> 1 spring starting at `delay` (frames). */
export const pop = (frame: number, delay = 0, damping = 14, mass = 0.8) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping, mass, stiffness: 140 } });

/** smooth 0 -> 1 between two frames */
export const prog = (frame: number, a: number, b: number, easing = easeOut) =>
  interpolate(frame, [a, b], [0, 1], { ...clamp, easing });

/** Standard enter/exit for an element: fades+slides in at `inAt`, out at `outAt` (optional). */
export const enterExit = (frame: number, inAt: number, outAt?: number, dist = 40, dur = 16) => {
  const i = prog(frame, inAt, inAt + dur);
  const o = outAt === undefined ? 0 : prog(frame, outAt, outAt + 12, easeIn);
  return {
    opacity: i * (1 - o),
    translate: `0px ${(1 - i) * dist - o * dist * 0.6}px`,
  } as const;
};
