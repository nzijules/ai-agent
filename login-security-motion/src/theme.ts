import { Easing, interpolate } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  bg: "#F4F6FB",
  card: "#FFFFFF",
  navy: "#14203D",
  muted: "#5B6478",
  line: "#E3E8F2",
  blue: "#0A5BFF",
  blueLight: "#1E90FF",
  blueDeep: "#0033B5",
  red: "#E5484D",
  redSoft: "#FDECEC",
  green: "#12A150",
  greenSoft: "#E6F6EC",
  terminal: "#0F172A",
};

export const FONT = "Inter, 'Inter Display', system-ui, sans-serif";
export const MONO = "'DejaVu Sans Mono', ui-monospace, monospace";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 progress between `start` and `start + dur` (in frames), clamped. */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = easeOut,
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Spring-like pop: overshoots slightly then settles. */
export const pop = (frame: number, start: number, dur = 18) =>
  prog(frame, start, dur, Easing.spring({ damping: 12, mass: 0.6 }));

export const shadow =
  "0 30px 80px rgba(20, 32, 61, 0.12), 0 6px 18px rgba(20, 32, 61, 0.06)";
