import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../config/video";
import { line } from "../data/script";
import { EASE_IN_OUT, tw } from "../lib/anim";

/**
 * Logo AroSoft en haut à droite. Apparaît en douceur au début et s'efface
 * avant la signature finale, où le logo est présenté en grand.
 */
export const CornerLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!BRAND.cornerLogo) return null;
  const t = frame / fps;
  const hideAt = line("s5.f").start - 1.4;
  const opacity = tw(t, [0.4, 1.4], [0, 1]) * tw(t, [hideAt, hideAt + 0.6], [1, 0], EASE_IN_OUT);
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img
        src={staticFile(BRAND.cornerLogo)}
        style={{
          position: "absolute",
          top: 52,
          right: 46,
          width: BRAND.cornerLogoWidth,
          opacity: opacity * 0.95,
          translate: `0px ${(1 - tw(t, [0.4, 1.4], [0, 1])) * -10}px`,
          filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.55))",
        }}
      />
    </AbsoluteFill>
  );
};
