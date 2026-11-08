import React from "react";
import { random } from "remotion";
import { C } from "../theme";

/**
 * Essaim de « pixels » carrés (motif du logo AroSoft).
 * Chaque pixel part d'une zone d'origine et suit une trajectoire déterministe.
 * `p` : progression 0→1 de la dispersion ; `t` : temps (s) pour le scintillement.
 */
export const PixelSwarm: React.FC<{
  seed: string;
  count: number;
  p: number;
  t: number;
  origin: { x: number; y: number; w: number; h: number };
  drift: { x: number; y: number };
  spread?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  fadeTo?: number;
  converge?: { x: number; y: number; p: number; radius?: number };
}> = ({
  seed,
  count,
  p,
  t,
  origin,
  drift,
  spread = 260,
  colors = [C.blue, C.cyan, "#1E5BFF", "#0B3FB8"],
  minSize = 8,
  maxSize = 22,
  fadeTo = 0.55,
  converge,
}) => {
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${k}-${i}`);
        const delay = r("d") * 0.35;
        const q = Math.max(0, Math.min(1, (p - delay) / (1 - delay)));
        if (q <= 0) return null;
        const e = 1 - Math.pow(1 - q, 3);
        const x0 = origin.x + r("x") * origin.w;
        const y0 = origin.y + r("y") * origin.h;
        let x = x0 + (drift.x + (r("vx") - 0.5) * spread) * e + Math.sin(t * 1.3 + i) * 10 * e;
        let y = y0 + (drift.y + (r("vy") - 0.5) * spread) * e + Math.cos(t * 1.1 + i) * 10 * e;
        if (converge && converge.p > 0) {
          const c = 1 - Math.pow(1 - converge.p, 3);
          const ang = r("a") * Math.PI * 2;
          const rad = (converge.radius ?? 18) * (0.4 + r("rad") * 0.6) + r("rad") * 60 * (1 - c);
          x = x + (converge.x + Math.cos(ang) * rad - x) * c;
          y = y + (converge.y + Math.sin(ang) * rad - y) * c;
        }
        const size = minSize + r("s") * (maxSize - minSize);
        const twinkle = 0.7 + 0.3 * Math.sin(t * 4 + i * 1.7);
        const op = (1 - (1 - fadeTo) * e) * twinkle * Math.min(1, q * 6);
        const color = colors[Math.floor(r("c") * colors.length)];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              background: color,
              opacity: op,
              rotate: `${(r("rot") - 0.5) * 120 * e}deg`,
              boxShadow: `0 0 ${size}px ${color}88`,
            }}
          />
        );
      })}
    </>
  );
};
