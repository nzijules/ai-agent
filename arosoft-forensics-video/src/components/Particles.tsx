import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

/** Poussière lumineuse en profondeur (parallaxe selon z). Déterministe. */
export const Particles: React.FC<{ count?: number; seed?: string; color?: string; speed?: number; opacity?: number }> = ({
  count = 60,
  seed = "dust",
  color = C.cyan,
  speed = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const z = random(`${seed}-z-${i}`);
        const x0 = random(`${seed}-x-${i}`) * width;
        const y0 = random(`${seed}-y-${i}`) * height;
        const v = (0.2 + z * 0.9) * speed;
        const y = (((y0 - frame * v) % height) + height) % height;
        const x = x0 + Math.sin(frame / (60 + i) + i) * 18 * z;
        const size = 1.5 + z * 4;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / (25 + i * 0.7) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: (0.15 + z * 0.55) * tw,
              boxShadow: `0 0 ${6 + z * 10}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
