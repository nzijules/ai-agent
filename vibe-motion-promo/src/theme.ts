import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Poppins";

for (const weight of ["500", "700", "800", "900"]) {
  loadFont({
    family: FONT,
    url: staticFile(`fonts/poppins-latin-${weight}-normal.woff2`),
    weight,
  });
}

export const C = {
  navy: "#040A2C",
  deep: "#071A7A",
  blue: "#1E4BFF",
  cyan: "#3CC8FF",
  yellow: "#FFD60A",
  red: "#E8262F",
  white: "#FFFFFF",
  muted: "#AFC2FF",
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Scene timeline (in frames)
const ORDER: [string, number][] = [
  ["hook", 160],
  ["problem", 160],
  ["reveal", 95],
  ["book", 120],
  ["ai", 230],
  ["program", 150],
  ["usage", 160],
  ["receive", 110],
  ["price", 340],
  ["steps", 150],
  ["cta", 160],
];

export const SCENES: Record<string, { from: number; dur: number }> = {};
let acc = 0;
for (const [k, d] of ORDER) {
  SCENES[k] = { from: acc, dur: d };
  acc += d;
}

export const TOTAL = acc;

// Voice-over segments: [start, end] in seconds inside voiceover.mp3,
// and the scene they are attached to (played VO_DELAY frames after scene start).
export const VO_DELAY = 5;
export const VO: { scene: string; start: number; end: number }[] = [
  { scene: "hook", start: 0.000, end: 4.810 },
  { scene: "problem", start: 4.810, end: 9.562 },
  { scene: "reveal", start: 9.562, end: 16.457 },
  { scene: "ai", start: 16.457, end: 23.571 },
  { scene: "usage", start: 23.571, end: 28.248 },
  { scene: "price", start: 28.248, end: 38.971 },
  { scene: "steps", start: 38.971, end: 43.400 },
  { scene: "cta", start: 43.400, end: 47.238 },
];

// In-scene cue points (frames from scene start) synced to the voice-over
export const TIMING = {
  ai: { made: 68, ask: 174, receive: 194 },
  price: { guide: 58, amount: 135, promise: 175, pill: 262 },
  cta: { click: 44 },
};
