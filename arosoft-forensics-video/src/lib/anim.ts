import { createContext, useContext } from "react";
import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);

/** interpolate() avec clamp des deux côtés. */
export const tw = (
  x: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(x, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Fenêtre d'apparition/disparition (0→1→0). */
export const win = (t: number, inS: number, outS: number, fade = 0.5) =>
  Math.min(tw(t, [inS, inS + fade], [0, 1]), tw(t, [outS - fade, outS], [1, 0], EASE_IN_OUT));

/**
 * Décalage (en images) entre le début de la Sequence et le début « nominal »
 * de la scène (le recouvrement d'entrée). Fourni par SceneShell.
 */
export const SceneOffsetContext = createContext(0);

/**
 * Horloge de scène : `t` en secondes relatives au début nominal de la scène
 * (négatif pendant la transition d'entrée).
 */
export const useSceneClock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offset = useContext(SceneOffsetContext);
  const f = frame - offset;
  const t = f / fps;
  const sp = (atSec: number, config: Parameters<typeof spring>[0]["config"] = { damping: 200 }, durationInFrames?: number) =>
    spring({ frame: f - Math.round(atSec * fps), fps, config, durationInFrames });
  return { frame: f, t, fps, sp };
};

export const rnd = (seed: string | number) => random(seed);
