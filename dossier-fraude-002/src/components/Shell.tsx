import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { ip, lin } from "../anim";

/**
 * Enveloppe de scène : transition d'entrée par volets masqués + flash jaune,
 * sortie par compression/flou. Évite tout « fondu de diaporama ».
 */
export const Shell: React.FC<{ children: React.ReactNode; inDur?: number; outDur?: number; flash?: string }> = ({
  children,
  inDur = 14,
  outDur = 10,
  flash = C.yellow,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = ip(f, [0, inDur], [0, 1]);
  const q = ip(f, [durationInFrames - outDur, durationInFrames], [0, 1]);
  const bars = 6;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${1.06 - 0.06 * p + q * 0.08})`,
          filter: q > 0 ? `blur(${q * 14}px) brightness(${1 - q * 0.6})` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {/* volets d'entrée */}
      {p < 1 &&
        new Array(bars).fill(0).map((_, i) => {
          const pi = ip(f, [i * 1.2, inDur - (bars - i) * 0.6], [0, 1]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(i / bars) * 100}%`,
                height: `${100 / bars + 0.2}%`,
                background: i % 2 ? C.black : "#0d0d0d",
                transform: `translateX(${(i % 2 ? -1 : 1) * pi * 105}%)`,
                borderBottom: `4px solid ${flash}`,
              }}
            />
          );
        })}
      {/* flash */}
      <AbsoluteFill style={{ background: flash, opacity: lin(f, [inDur - 4, inDur, inDur + 4], [0, 0.18, 0]), mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
