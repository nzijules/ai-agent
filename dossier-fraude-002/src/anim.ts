import { Easing, interpolate, spring } from "remotion";

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const expoInOut = Easing.bezier(0.87, 0, 0.13, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

/** interpolate clampé, avec easing optionnel */
export const ip = (
  f: number,
  input: [number, number] | number[],
  output: [number, number] | number[],
  easing: (t: number) => number = expoOut,
) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lin = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const sp = (frame: number, fps: number, delay = 0, damping = 14, mass = 0.8) =>
  spring({ frame: frame - delay, fps, config: { damping, mass, stiffness: 140 } });

/** bruit déterministe 1D (pseudo-aléatoire lisse) */
export const noise = (x: number, seed = 1) => {
  const s = (n: number) => {
    const v = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const i = Math.floor(x);
  const t = x - i;
  const u = t * t * (3 - 2 * t);
  return s(i) * (1 - u) + s(i + 1) * u;
};

export const rand = (n: number) => {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

/** tremblement (secousse) décroissant à partir d'un instant */
export const shake = (frame: number, at: number, amp = 18, dur = 14) => {
  const t = frame - at;
  if (t < 0 || t > dur) return { x: 0, y: 0 };
  const k = (1 - t / dur) * amp;
  return { x: (noise(t * 1.7, 3) - 0.5) * 2 * k, y: (noise(t * 1.9, 7) - 0.5) * 2 * k };
};
