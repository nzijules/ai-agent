import { Easing, interpolate, useVideoConfig } from "remotion";

/** Décélération franche : mouvements courts et précis, sans rebond. */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Progression 0→1 entre `de` et `de + duree` (secondes). */
export const prog = (
  frame: number,
  fps: number,
  de: number,
  duree: number,
  easing: (t: number) => number = EASE_OUT,
) => interpolate(frame, [de * fps, (de + duree) * fps], [0, 1], { ...clamp, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mise en page selon le format (9:16 ou 16:9) et zones de sécurité. */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return {
    W: width,
    H: height,
    vertical,
    /** Marges de sécurité : interfaces Reels / TikTok / Shorts en 9:16. */
    safe: vertical
      ? { top: 250, bottom: 440, left: 80, right: 150 }
      : { top: 90, bottom: 150, left: 140, right: 140 },
  };
};

/** Bruit pseudo-aléatoire déterministe. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
