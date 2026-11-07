import { continueRender, delayRender, staticFile } from "remotion";

export const FPS = 30;
export const BPM = 116;
export const BEAT = (FPS * 60) / BPM; // ≈15.5 images par temps

export const C = {
  bg: "#07060F",
  ink: "#FFFFFF",
  dim: "rgba(255,255,255,0.65)",
  orange: "#FF7A45",
  coral: "#FF5E7E",
  violet: "#8B5CF6",
  cyan: "#22D3EE",
  pink: "#F472B6",
  gold: "#FDE047",
  green: "#4ADE80",
};

export const GRAD = `linear-gradient(100deg, ${C.orange} 0%, ${C.coral} 35%, ${C.violet} 70%, ${C.cyan} 100%)`;
export const GOLD = `linear-gradient(180deg, #FFF7AE 0%, ${C.gold} 40%, #F59E0B 100%)`;

export const F = {
  display: "Unbounded, sans-serif",
  body: "Poppins, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Découpage des scènes (en images, 30 i/s) – calé sur la musique
export const SCENES = {
  hook: [0, 135],
  title: [135, 354],
  tool: [354, 533],
  step1: [533, 726],
  step2: [726, 917],
  step3: [917, 1127],
  step4: [1127, 1332],
  proof: [1332, 1563],
  cta: [1563, 1956],
} as const;
export const TOTAL = 1956;
// Fin de la voix-off (en images) : la musique remonte ensuite
export const VOICE_END = 1873;

// Mets à true après avoir déposé public/voiceover.mp3
export const HAS_VOICEOVER = true;

const fonts: [string, string, string][] = [
  ["Unbounded", "700", "Unbounded-700.woff2"],
  ["Unbounded", "900", "Unbounded-900.woff2"],
  ["Poppins", "500", "Poppins-500.woff2"],
  ["Poppins", "700", "Poppins-700.woff2"],
  ["Poppins", "800", "Poppins-800.woff2"],
  ["JetBrains Mono", "500", "JetBrainsMono-500.woff2"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Chargement des polices");
  Promise.all(
    fonts.map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {
        weight,
      })
        .load()
        .then((f) => document.fonts.add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}
