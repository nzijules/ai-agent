import { staticFile } from "remotion";

const weights: [string, number][] = [
  ["Regular", 400],
  ["Medium", 500],
  ["SemiBold", 600],
  ["Bold", 700],
  ["ExtraBold", 800],
  ["Black", 900],
];

export const fontFaceCss = weights
  .map(
    ([n, w]) =>
      `@font-face{font-family:'Inter';src:url('${staticFile(`fonts/Inter-${n}.otf`)}') format('opentype');font-weight:${w};font-style:normal;font-display:block;}`,
  )
  .join("\n");
