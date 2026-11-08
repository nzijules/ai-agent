import React from "react";
import { Img, staticFile } from "remotion";
import { BRAND } from "../config/video";

/**
 * Emplacement du logo AroSoft. Remplacez le fichier dans /public/brand
 * et ajustez BRAND.logo / BRAND.logoMode dans src/config/video.ts.
 */
export const Logo: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 640, style }) => {
  const dark = BRAND.logoMode === "invert-on-dark";
  return (
    <Img
      src={staticFile(BRAND.logo)}
      style={{
        width,
        display: "block",
        // Logo sur fond blanc : inversion de luminance (à placer hors de tout parent transformé
        // pour que la fusion "screen" atteigne le fond).
        filter: dark ? "invert(1) hue-rotate(180deg) saturate(1.25) brightness(1.08)" : undefined,
        mixBlendMode: dark ? "screen" : undefined,
        ...style,
      }}
    />
  );
};
