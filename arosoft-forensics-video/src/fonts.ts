import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const faces: Array<[string, string, string]> = [
  ["Sora", "sora-latin-400-normal.woff2", "400"],
  ["Sora", "sora-latin-600-normal.woff2", "600"],
  ["Sora", "sora-latin-700-normal.woff2", "700"],
  ["Sora", "sora-latin-800-normal.woff2", "800"],
  ["Inter", "inter-latin-400-normal.woff2", "400"],
  ["Inter", "inter-latin-500-normal.woff2", "500"],
  ["Inter", "inter-latin-600-normal.woff2", "600"],
  ["Inter", "inter-latin-700-normal.woff2", "700"],
  ["JetBrains Mono", "jetbrains-mono-latin-400-normal.woff2", "400"],
  ["JetBrains Mono", "jetbrains-mono-latin-600-normal.woff2", "600"],
];

for (const [family, file, weight] of faces) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
}

export const FONT = {
  display: "Sora, Inter, sans-serif",
  ui: "Inter, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;
