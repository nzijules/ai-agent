import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  navy: "#0B1B3A",
  navy2: "#13285A",
  blue: "#1D4FD8",
  blueSoft: "#DCE7FF",
  yellow: "#F7B718",
  yellowSoft: "#FFF1C7",
  green: "#0E7A55",
  greenSoft: "#D5F2E6",
  pink: "#F9D6DB",
  red: "#E2484F",
  cream: "#FBF8F2",
  white: "#FFFFFF",
  ink: "#0B1B3A",
  muted: "#55617A",
} as const;

export const F = {
  display: "Montserrat, sans-serif",
  body: "Inter, sans-serif",
  hand: "Caveat, cursive",
} as const;

const fonts: [string, string, string][] = [
  ["Montserrat", "montserrat-latin-700-normal", "700"],
  ["Montserrat", "montserrat-latin-800-normal", "800"],
  ["Montserrat", "montserrat-latin-900-normal", "900"],
  ["Inter", "inter-latin-400-normal", "400"],
  ["Inter", "inter-latin-500-normal", "500"],
  ["Inter", "inter-latin-600-normal", "600"],
  ["Inter", "inter-latin-700-normal", "700"],
  ["Caveat", "caveat-latin-700-normal", "700"],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const [family, file, weight] of fonts) {
    loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight, format: "woff2" });
  }
};

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);
