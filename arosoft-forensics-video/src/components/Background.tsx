import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='256' height='256' filter='url(#n)'/></svg>`,
)}")`;

/**
 * Fond global persistant : dégradé graphite, sol en grille en perspective,
 * faisceaux de lumière volumétrique discrets. Piloté par la frame globale
 * pour rester continu à travers les transitions de scènes.
 */
export const Background: React.FC<{ accent?: string }> = ({ accent = C.blue }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 90);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 38%, ${C.bg2} 0%, ${C.bg} 62%, #05080F 100%)`,
        }}
      />
      {/* Sol en grille, défilement lent vers la caméra */}
      <div
        style={{
          position: "absolute",
          left: -1200,
          right: -1200,
          bottom: -500,
          height: 1500,
          transformOrigin: "50% 0%",
          transform: "perspective(900px) rotateX(74deg)",
          backgroundImage: `linear-gradient(${C.line} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.line} 1.5px, transparent 1.5px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(frame * 1.6) % 90}px`,
          opacity: 0.45,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%)",
        }}
      />
      {/* Lumière volumétrique */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -300,
            left: 140 + i * 300,
            width: 220 + i * 40,
            height: 2400,
            background: `linear-gradient(180deg, ${accent}22 0%, ${accent}0A 45%, transparent 80%)`,
            transform: `rotate(${18 - i * 9 + sway * 2.5}deg)`,
            transformOrigin: "50% 0%",
            filter: "blur(24px)",
            mixBlendMode: "screen",
            opacity: interpolate(Math.sin(frame / 70 + i * 2), [-1, 1], [0.35, 0.8]),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Grain filmique + vignette, à placer au-dessus de tout. */
export const FilmFinish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          backgroundPosition: `${(frame * 73) % 256}px ${(frame * 151) % 256}px`,
          opacity: 0.07,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(85% 60% at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
