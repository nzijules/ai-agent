import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, easeIn, easeOut } from "../anim";
import { useLayout } from "../layout";

/** Scene transition wrapper: fade + subtle zoom in/out over the Sequence boundaries. */
export const SceneWrap: React.FC<{ children: React.ReactNode; inFrames?: number; outFrames?: number }> = ({ children, inFrames = 10, outFrames = 10 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const i = inFrames === 0 ? 1 : interpolate(frame, [0, inFrames], [0, 1], { ...clamp, easing: easeOut });
  const o = outFrames === 0 ? 0 : interpolate(frame, [durationInFrames - outFrames, durationInFrames], [0, 1], { ...clamp, easing: easeIn });
  return <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), scale: String(1.035 - 0.035 * i + 0.035 * o) }}>{children}</AbsoluteFill>;
};

/** Content box inside the platform safe zone. */
export const Stage: React.FC<{ children: React.ReactNode; bg: React.ReactNode; justify?: React.CSSProperties["justifyContent"]; gap?: number }> = ({ children, bg, justify = "center", gap = 0 }) => {
  const L = useLayout();
  return (
    <AbsoluteFill>
      {bg}
      <AbsoluteFill style={{ top: L.top, bottom: L.bottom, left: L.side, right: L.side, width: "auto", height: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: justify, gap }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
