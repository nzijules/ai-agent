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
  const isRed = tint === "red";
  const drift = (f * 0.6) % 90;
  return (
    <AbsoluteFill style={{ backgroundColor: C.yellow, overflow: "hidden" }}>
      {/* lumière douce au centre, bords légèrement plus profonds (jaune MTN) */}
      <AbsoluteFill style={{ background: "radial-gradient(110% 70% at 50% 40%, rgba(255,236,150,0.55) 0%, rgba(255,203,5,0) 55%, rgba(200,150,0,0.35) 100%)" }} />
      {isRed && (
        <AbsoluteFill style={{ boxShadow: `inset 0 0 ${260 * intensity}px rgba(229,37,42,${0.75 * intensity})`, background: `radial-gradient(90% 60% at 50% 45%, rgba(229,37,42,${0.10 * intensity}), transparent 70%)` }} />
      )}
      {grid && (
        <AbsoluteFill
          style={{
            opacity: 0.16,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.35) 1px, transparent 1px)",
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
                background: i % 5 === 0 ? "#fff" : "#000",
                opacity: 0.05 + rand(i + 7) * 0.12,
                filter: s > 5 ? "blur(2px)" : undefined,
              }}
            />
          );
        })}
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(90% 75% at 50% 50%, transparent 60%, rgba(120,80,0,0.35) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Grain de film + lignes de balayage, posé au-dessus de tout. */
export const FilmGrain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = f % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.14 }}>
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
          opacity: 0.18,
        }}
      />
    </AbsoluteFill>
  );
};
