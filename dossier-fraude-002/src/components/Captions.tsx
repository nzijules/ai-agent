import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { ip } from "../anim";

/**
 * Sous-titres de la voix-off (texte intégral, mot pour mot).
 * Chaque bloc apparaît exactement quand la voix le prononce (horodatage de la transcription).
 */
export const Captions: React.FC<{ chunks: string[]; starts: number[]; end: number }> = ({ chunks, starts, end }) => {
  const f = useCurrentFrame();
  const timed = chunks.map((c, i) => ({ text: c, start: starts[i], end: i < chunks.length - 1 ? starts[i + 1] : end }));
  const cur = timed.find((t) => f >= t.start && f < t.end);
  if (!cur) return null;
  const local = f - cur.start;
  const len = cur.end - cur.start;
  const words = cur.text.split(" ");
  const o = ip(local, [0, 5], [0, 1]) * ip(local, [len - 4, len], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 120,
        display: "flex",
        justifyContent: "center",
        opacity: o,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          padding: "20px 30px",
          borderRadius: 18,
          background: "rgba(0,0,0,0.92)",
          borderLeft: `6px solid ${C.yellow}`,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.28,
          color: C.white,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {words.map((w, i) => {
          const wt = (i / words.length) * len * 0.75;
          const wo = ip(local, [wt, wt + 4], [0.25, 1]);
          return (
            <span key={i} style={{ opacity: wo }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
