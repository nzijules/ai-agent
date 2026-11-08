import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { noise, rand } from "../anim";

type Props = {
  tint?: "neutral" | "red" | "yellow" | "night";
  grid?: boolean;
  dust?: boolean;
  intensity?: number; // 0..1 intensité de la teinte
};

/** Fond « documentaire d'investigation » : dégradé, grille forensic, poussière, vignette. */
export const Backdrop: React.FC<Props> = ({ tint = "neutral", grid = true, dust = true, intensity = 1 }) => {
  const f = useCurrentFrame();
  const glow =
    tint === "red"
      ? `rgba(229,37,42,${0.35 * intensity})`
      : tint === "yellow"
        ? `rgba(255,203,5,${0.22 * intensity})`
        : tint === "night"
          ? `rgba(40,70,140,${0.35 * intensity})`
          : `rgba(255,203,5,${0.07 * intensity})`;
  const drift = (f * 0.6) % 90;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 40%, ${glow} 0%, rgba(21,21,21,0.9) 45%, #000 100%)`,
        }}
      />
      {grid && (
        <AbsoluteFill
          style={{
            opacity: 0.16,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            backgroundPosition: `0px ${drift}px`,
            maskImage: "radial-gradient(70% 55% at 50% 45%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(70% 55% at 50% 45%, black 20%, transparent 80%)",
          }}
        />
      )}
      {dust &&
        new Array(36).fill(0).map((_, i) => {
          const x = rand(i + 1) * 1080 + (noise(f / 90 + i, i) - 0.5) * 120;
          const y = ((rand(i + 50) * 1920 - f * (0.4 + rand(i + 9) * 0.9)) % 1920 + 1920) % 1920;
          const s = 2 + rand(i + 3) * 5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: s,
                height: s,
                borderRadius: s,
                background: i % 5 === 0 ? C.yellow : "#fff",
                opacity: 0.08 + rand(i + 7) * 0.22,
                filter: s > 5 ? "blur(2px)" : undefined,
              }}
            />
          );
        })}
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(90% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Grain de film + lignes de balayage, posé au-dessus de tout. */
export const FilmGrain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = f % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.22 }}>
      <svg width="100%" height="100%">
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 2px, transparent 4px)",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
