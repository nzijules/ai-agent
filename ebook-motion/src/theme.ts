import { continueRender, delayRender, staticFile } from "remotion";

// Fonts are self-hosted in /public/fonts (variable fonts: one file covers all weights).
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";
const FACES: [string, string, string][] = [
  ["Montserrat", "fonts/montserrat-latin.woff2", LATIN],
  ["Montserrat", "fonts/montserrat-latin-ext.woff2", LATIN_EXT],
  ["Inter", "fonts/inter-latin.woff2", LATIN],
  ["Inter", "fonts/inter-latin-ext.woff2", LATIN_EXT],
  ["JetBrains Mono", "fonts/jetbrainsmono-latin.woff2", LATIN],
];
if (typeof document !== "undefined") {
  const handle = delayRender("Loading fonts");
  Promise.all(
    FACES.map(([family, file, range]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, { weight: "100 900", unicodeRange: range });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const display = "Montserrat, sans-serif";
export const body = "Inter, sans-serif";
export const mono = "'JetBrains Mono', monospace";

// AROSOFT palette (from the logo)
export const C = {
  bg: "#040A1E",
  navy: "#16213F",
  blue: "#0A84FF",
  royal: "#0047E0",
  deep: "#001C7A",
  cyan: "#3EE6FF",
  white: "#FFFFFF",
  soft: "#A9B8E0",
  red: "#FF3B5C",
  green: "#22E39A",
  gold: "#FFC93C",
};

export const gradText = (from = C.cyan, to = C.blue): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${from} 0%, ${to} 60%, #6B7CFF 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);
