import { createContext, useContext } from "react";
import { Easing, interpolate } from "remotion";
import timeline from "../data/timeline.json";

export const C = {
  bg: "#080B12",
  blue: "#2563EB",
  white: "#FFFFFF",
  cyan: "#00D9FF",
  orange: "#FF9F43",
  dim: "rgba(255,255,255,0.55)",
  faint: "rgba(255,255,255,0.12)",
  glass: "rgba(18,26,44,0.62)",
  glassBorder: "rgba(0,217,255,0.28)",
  skin: ["#5B3A29", "#6F4530", "#4A2E20", "#7A4E35", "#3E271B"],
};

export const F = {
  display: "'Space Grotesk', 'Inter', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const FPS = timeline.fps;
export const TOTAL = timeline.totalSeconds;
export const SCENES = timeline.scenes;
export const CUES = timeline.cues;
export const scene = (id: number) => SCENES.find((s) => s.id === id)!;

/** Temps absolu (secondes) sur la timeline de la vidéo complète. */
export const TimeCtx = createContext(0);
export const useT = () => useContext(TimeCtx);

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  soft: Easing.bezier(0.45, 0, 0.2, 1),
};

/** interpolate() bornée, en secondes. */
export const ip = (
  t: number,
  input: number[],
  output: number[],
  easing: (n: number) => number = ease.out,
) =>
  interpolate(t, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Pseudo-aléatoire déterministe. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
