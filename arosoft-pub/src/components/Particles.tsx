import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../config";

/** Particules lumineuses contrôlées (déterministes). */
export const Particles: React.FC<{
  count?: number;
  seed?: string;
  opacity?: number;
  speed?: number;
  color?: string;
  burstAt?: number;
  area?: { x: number; y: number; w: number; h: number };
}> = ({ count = 40, seed = "p", opacity = 1, speed = 1, color = COLORS.cyan, burstAt, area }) => {
  const f = useCurrentFrame();
  const A = area ?? { x: 0, y: 0, w: 1080, h: 1920 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const size = 2 + r("s") * 6;
        let x = A.x + r("x") * A.w + Math.sin(f / (40 + r("w") * 40) + i) * 20;
        let y = A.y + ((r("y") * A.h - f * speed * (0.4 + r("v") * 1.2)) % A.h + A.h) % A.h;
        let o = (0.25 + 0.75 * Math.abs(Math.sin(f / (15 + r("t") * 25) + i))) * opacity;
        if (burstAt !== undefined && f >= burstAt) {
          const k = (f - burstAt) / 30;
          const ang = r("a") * Math.PI * 2;
          const dist = (200 + r("d") * 500) * (1 - Math.exp(-k * 3));
          x = 540 + Math.cos(ang) * dist;
          y = A.y + A.h / 2 + Math.sin(ang) * dist;
          o *= Math.max(0, 1 - k * 0.8);
        }
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
              background: i % 7 === 0 ? COLORS.yellow : color,
              boxShadow: `0 0 ${size * 3}px ${i % 7 === 0 ? COLORS.yellow : color}`,
              opacity: o,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
