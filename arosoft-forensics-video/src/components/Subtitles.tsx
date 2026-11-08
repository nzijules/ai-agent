import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { LINES } from "../data/script";
import { EASE_OUT, tw } from "../lib/anim";
import { C } from "../theme";
import { FONT } from "../fonts";

/**
 * Sous-titres animés synchronisés sur LINES (timeline globale).
 * Chaque mot s'allume au rythme estimé de la diction (pondéré par sa longueur).
 */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const current = LINES.find((l) => t >= l.start - 0.15 && t <= l.end + 0.25);
  if (!current) return null;

  const words = current.text.split(" ");
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const speakDur = (current.end - current.start) * 0.92;
  let acc = 0;
  const starts = weights.map((w) => {
    const s = current.start + (acc / total) * speakDur;
    acc += w;
    return s;
  });

  const enter = tw(t, [current.start - 0.15, current.start + 0.2], [0, 1]);
  const exit = tw(t, [current.end, current.end + 0.25], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 210, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 900,
          padding: "22px 34px",
          borderRadius: 26,
          background: "rgba(6, 11, 20, 0.62)",
          border: `1px solid ${C.line}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          opacity: enter * (1 - exit),
          translate: `0px ${(1 - enter) * 24 + exit * -12}px`,
          fontFamily: FONT.ui,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.28,
          letterSpacing: -0.2,
        }}
      >
        {words.map((w, i) => {
          const p = tw(t, [starts[i], starts[i] + 0.18], [0, 1], EASE_OUT);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                color: p > 0.5 ? C.white : "rgba(244,248,255,0.38)",
                translate: `0px ${(1 - p) * 6}px`,
                textShadow: p > 0.5 ? "0 0 18px rgba(101,240,255,0.25)" : undefined,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
