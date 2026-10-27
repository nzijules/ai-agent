import { staticFile } from "remotion";
import { TEXTURES } from "../config/assets";

/**
 * Textures procédurales (SVG feTurbulence) utilisées tant que les macros
 * réelles des matières ne sont pas fournies (voir TEXTURES dans assets.ts).
 */
export type TextureKind = "laterite" | "sable" | "ciment" | "melange" | "bloc" | "blocHumide";

type Recipe = {
  base: string;
  /** Taches grossières (couleur RGB 0-1, fréquence, intensité). */
  taches: [number, number, number, number, number];
  /** Grains sombres. */
  sombre: [number, number, number, number];
  /** Grains clairs. */
  clair: [number, number, number, number];
};

const RECIPES: Record<TextureKind, Recipe> = {
  laterite: {
    base: "#B05A2A",
    taches: [0.42, 0.16, 0.06, 0.03, 0.75],
    sombre: [0.3, 0.1, 0.04, 0.9],
    clair: [0.93, 0.68, 0.45, 0.85],
  },
  sable: {
    base: "#D5BD93",
    taches: [0.72, 0.6, 0.42, 0.05, 0.5],
    sombre: [0.48, 0.38, 0.26, 1.4],
    clair: [1, 0.97, 0.9, 1.3],
  },
  ciment: {
    base: "#8C8E90",
    taches: [0.45, 0.46, 0.47, 0.04, 0.45],
    sombre: [0.3, 0.31, 0.33, 1.8],
    clair: [0.8, 0.81, 0.82, 1.8],
  },
  melange: {
    base: "#A9673D",
    taches: [0.52, 0.32, 0.2, 0.06, 0.55],
    sombre: [0.32, 0.2, 0.12, 1.2],
    clair: [0.88, 0.78, 0.62, 1.2],
  },
  bloc: {
    base: "#B8693A",
    taches: [0.55, 0.26, 0.12, 0.025, 0.45],
    sombre: [0.38, 0.16, 0.07, 1.0],
    clair: [0.92, 0.72, 0.52, 1.0],
  },
  blocHumide: {
    base: "#8C4623",
    taches: [0.38, 0.16, 0.07, 0.025, 0.5],
    sombre: [0.25, 0.1, 0.04, 1.0],
    clair: [0.7, 0.45, 0.3, 1.0],
  },
};

const layer = (id: string, freq: number, oct: number, seed: number, rgb: number[], gain: number, cut: number) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 ${rgb[0]}  0 0 0 0 ${rgb[1]}  0 0 0 0 ${rgb[2]}  ${gain} 0 0 0 ${cut}"/>
  </filter>`;

const cache = new Map<string, string>();

/** Renvoie une valeur CSS `background-image`. */
export const texture = (kind: TextureKind, seed = 1, tile = 360): string => {
  const real = kind in TEXTURES ? TEXTURES[kind as keyof typeof TEXTURES] : null;
  if (real) return `url("${staticFile(real)}")`;
  const key = `${kind}-${seed}-${tile}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const r = RECIPES[kind];
  const [tr, tg, tb, tf, ti] = r.taches;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}">
  <defs>
    ${layer("t", tf, 3, seed, [tr, tg, tb], 2.2 * ti, -1.0 * ti)}
    ${layer("s", 0.9, 2, seed + 7, r.sombre.slice(0, 3), 7 * r.sombre[3], -4.6 * r.sombre[3])}
    ${layer("c", 1.1, 2, seed + 13, r.clair.slice(0, 3), 7 * r.clair[3], -4.7 * r.clair[3])}
  </defs>
  <rect width="100%" height="100%" fill="${r.base}"/>
  <rect width="100%" height="100%" filter="url(#t)"/>
  <rect width="100%" height="100%" filter="url(#s)"/>
  <rect width="100%" height="100%" filter="url(#c)"/>
</svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  cache.set(key, url);
  return url;
};

export const BASE_COLOR: Record<TextureKind, string> = Object.fromEntries(
  Object.entries(RECIPES).map(([k, v]) => [k, v.base]),
) as Record<TextureKind, string>;
