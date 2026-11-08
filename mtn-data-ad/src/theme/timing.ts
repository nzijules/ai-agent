import { Easing, interpolate } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Courbes d'animation partagées (ease-out « premium », ressorts doux).
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const SPRING_SOFT = Easing.spring({ damping: 200 });
export const SPRING_POP = Easing.spring({ damping: 14, stiffness: 160 });

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/**
 * Durée de chaque scène en frames (30 fps), calée sur la voix-off :
 * chaque scène démarre juste avant l'annonce « Astuce n » de la voix.
 * Total : 1470 frames = 49 s.
 */
export const SCENE_FRAMES = {
  s1: 180, // 0,0 – 6,0 s
  s2: 219, // 6,0 – 13,3 s
  s3: 189, // 13,3 – 19,6 s
  s4: 255, // 19,6 – 28,1 s
  s5: 207, // 28,1 – 35,0 s
  s6: 150, // 35,0 – 40,0 s
  s7: 270, // 40,0 – 49,0 s
} as const;

/** Raccourci : interpolation bornée avec courbe optionnelle. */
export const ip = (
  frame: number,
  input: number[],
  output: number[],
  easing?: ((t: number) => number) | ((t: number) => number)[],
) => interpolate(frame, input, output, { ...clamp, easing });
