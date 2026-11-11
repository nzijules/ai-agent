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
  ["hook", 190],
  ["problem", 170],
  ["reveal", 95],
  ["book", 100],
  ["demo", 120],
  ["program", 165],
  ["usage", 185],
  ["receive", 120],
  ["price", 330],
  ["steps", 200],
  ["cta", 200],
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
  { scene: "hook", start: 0, end: 5.85 },
  { scene: "problem", start: 5.85, end: 11.1 },
  { scene: "reveal", start: 11.1, end: 20.45 },
  { scene: "usage", start: 20.45, end: 26.1 },
  { scene: "price", start: 26.1, end: 36.75 },
  { scene: "steps", start: 36.75, end: 43.0 },
  { scene: "cta", start: 43.0, end: 48.76 },
];
