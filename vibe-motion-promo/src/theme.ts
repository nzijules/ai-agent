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
  ["hook", 105],
  ["problem", 120],
  ["reveal", 115],
  ["book", 165],
  ["learn1", 190],
  ["learn2", 165],
  ["demo", 185],
  ["projects", 165],
  ["audience", 170],
  ["receive", 160],
  ["price", 170],
  ["cta", 180],
];

export const SCENES: Record<string, { from: number; dur: number }> = {};
let acc = 0;
for (const [k, d] of ORDER) {
  SCENES[k] = { from: acc, dur: d };
  acc += d;
}

export const TOTAL = acc;
