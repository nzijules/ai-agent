import { Easing } from "remotion";

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

/** Durées de chaque scène en secondes (storyboard). Modifier ici pour retimer la pub. */
export const SCENE_SECONDS = {
  s1: 6,
  s2: 6,
  s3: 6,
  s4: 6,
  s5: 6,
  s6: 6,
  s7: 7,
} as const;
