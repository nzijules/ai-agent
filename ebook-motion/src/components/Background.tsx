import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C } from "../theme";

const PARTICLES = new Array(46).fill(0).map((_, i) => ({
  x: random(`x${i}`) * 1080,
  y: random(`y${i}`) * 1920,
  s: 2 + random(`s${i}`) * 5,
  speed: 0.4 + random(`v${i}`) * 1.4,
  phase: random(`p${i}`) * Math.PI * 2,
}));

export const Background: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const f = useCurrentFrame();
  const b1x = 540 + Math.sin(f / 70) * 320;
  const b1y = 600 + Math.cos(f / 90) * 260;
  const b2x = 540 + Math.cos(f / 80) * 360;
  const b2y = 1400 + Math.sin(f / 60) * 240;
  const gridShift = (f * 3) % 120;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(700px circle at ${b1x}px ${b1y}px, rgba(255,204,0,${0.42 * intensity}), transparent 70%),
            radial-gradient(800px circle at ${b2x}px ${b2y}px, rgba(255,140,0,${0.35 * intensity}), transparent 70%)`,
        }}
      />
      {/* perspective grid floor */}
      <div
        style={{
          position: "absolute",
          left: -540,
          right: -540,
          bottom: -200,
          height: 900,
          transform: "perspective(600px) rotateX(62deg)",
          transformOrigin: "bottom",
          backgroundImage: `linear-gradient(rgba(255,204,0,0.22) 2px, transparent 2px), linear-gradient(90deg, rgba(255,204,0,0.22) 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${gridShift}px`,
          maskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          opacity: 0.7 * intensity,
        }}
      />
      {PARTICLES.map((p, i) => {
        const y = (p.y - f * p.speed * 2 + 1920 * 4) % 1980 - 30;
        const tw = interpolate(Math.sin(f / 12 + p.phase), [-1, 1], [0.2, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + Math.sin(f / 40 + p.phase) * 20,
              top: y,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              background: i % 3 === 0 ? C.cyan : C.white,
              opacity: tw * 0.7 * intensity,
              boxShadow: `0 0 ${p.s * 3}px ${C.cyan}`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)" }}
      />
    </AbsoluteFill>
  );
};
