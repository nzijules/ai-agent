import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./config";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** interpolate borné avec easing par défaut "out expo". */
export const tw = (
  f: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Ressort démarrant à `start` (frames). */
export const sp = (f: number, start: number, damping = 14, mass = 0.8, stiffness = 140) =>
  spring({ frame: f - start, fps: FPS, config: { damping, mass, stiffness } });

/** Apparition / disparition 0→1→0. */
export const life = (f: number, inS: number, outS: number, fade = 10) =>
  tw(f, [inS, inS + fade, outS - fade, outS], [0, 1, 1, 0], EASE_IN_OUT);

/** Petite secousse de caméra déterministe après `at`. */
export const shake = (f: number, at: number, amp = 18, dur = 14) => {
  const k = f - at;
  if (k < 0 || k > dur) return { x: 0, y: 0 };
  const d = 1 - k / dur;
  return { x: Math.sin(k * 2.7) * amp * d, y: Math.cos(k * 3.3) * amp * 0.7 * d };
};
