import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./anim";

/** Gives each scene a punchy zoom-blur entry and a quick exit. */
export const SceneWrap: React.FC<{ children: React.ReactNode; exit?: boolean }> = ({ children, exit = true }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(f, [0, 10], [0, 1], clamp);
  const outP = exit ? interpolate(f, [durationInFrames - 8, durationInFrames], [0, 1], clamp) : 0;
  const scale = 1.12 - 0.12 * inP + outP * 0.15;
  const blur = (1 - inP) * 18 + outP * 16;
  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
