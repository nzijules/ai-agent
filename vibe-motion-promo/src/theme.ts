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
export const SCENES = {
  hook: { from: 0, dur: 105 },
  problem: { from: 105, dur: 120 },
  reveal: { from: 225, dur: 115 },
  demo: { from: 340, dur: 185 },
  book: { from: 525, dur: 165 },
  benefits: { from: 690, dur: 150 },
  cta: { from: 840, dur: 165 },
};

export const TOTAL = SCENES.cta.from + SCENES.cta.dur;
