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
  ["problem", 175],
  ["reveal", 95],
  ["book", 120],
  ["ai", 280],
  ["program", 150],
  ["usage", 160],
  ["receive", 110],
  ["price", 335],
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
  { scene: "hook", start: 0, end: 4.85 },
  { scene: "problem", start: 4.85, end: 10.2 },
  { scene: "reveal", start: 10.2, end: 16.15 },
  { scene: "ai", start: 16.15, end: 24.95 },
  { scene: "usage", start: 24.95, end: 29.65 },
  { scene: "price", start: 29.65, end: 40.2 },
  { scene: "steps", start: 40.2, end: 44.4 },
  { scene: "cta", start: 44.4, end: 48.43 },
];

// In-scene cue points (frames from scene start) synced to the voice-over
export const TIMING = {
  ai: { made: 105, ask: 227, receive: 244 },
  price: { guide: 59, amount: 135, promise: 183, pill: 273 },
  cta: { click: 45 },
};
