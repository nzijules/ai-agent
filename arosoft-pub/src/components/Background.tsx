import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../config";

/** Fond animé premium : dégradé nuit, halos mobiles, grille en perspective. */
export const Background: React.FC<{ brightness?: number; grid?: number; hue?: string }> = ({
  brightness = 1,
  grid = 1,
  hue = COLORS.electric,
}) => {
  const f = useCurrentFrame();
  const a = f / 30;
  const b1x = 30 + Math.sin(a * 0.35) * 18;
  const b1y = 25 + Math.cos(a * 0.27) * 10;
  const b2x = 70 + Math.cos(a * 0.31) * 16;
  const b2y = 72 + Math.sin(a * 0.22) * 9;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deep, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 30%, ${COLORS.night} 0%, ${COLORS.deep} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.55 * brightness,
          background: `radial-gradient(40% 28% at ${b1x}% ${b1y}%, ${hue} 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.35 * brightness,
          background: `radial-gradient(38% 24% at ${b2x}% ${b2y}%, ${COLORS.cyan} 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
      {/* grille en perspective */}
      <div
        style={{
          position: "absolute",
          left: -540,
          right: -540,
          bottom: -200,
          height: 900,
          opacity: 0.22 * grid,
          transform: "perspective(700px) rotateX(68deg)",
          transformOrigin: "50% 100%",
          backgroundImage: `linear-gradient(${COLORS.cyan}55 2px, transparent 2px), linear-gradient(90deg, ${COLORS.cyan}55 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(f * 2) % 90}px`,
          maskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{ background: "radial-gradient(90% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)" }}
      />
    </AbsoluteFill>
  );
};
