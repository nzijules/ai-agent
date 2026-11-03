import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import vo from "../generated/voiceover.json";
import { clamp, easeOut } from "../anim";
import { useLayout } from "../layout";
import { C, F } from "../theme";

type Line = { id: string; start: number; duration: number; text: string };

/**
 * Animated subtitles synced to the voice-over clips (src/generated/voiceover.json).
 * Word timing is estimated from character length within each clip (karaoke-style highlight).
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const L = useLayout();
  const t = frame / fps;
  const lines = (vo as { lines: Line[] }).lines;
  const line = lines.find((l) => t >= l.start - 0.05 && t < l.start + l.duration + 0.35);
  if (!line) return null;
  const local = t - line.start;
  const words = line.text.split(" ");
  const total = words.reduce((a, w) => a + w.length + 1, 0);
  const speak = line.duration * 0.92;
  let acc = 0;
  const appear = interpolate(local, [-0.05, 0.12], [0, 1], { ...clamp, easing: easeOut });
  const leave = interpolate(local, [line.duration + 0.15, line.duration + 0.35], [1, 0], clamp);
  const size = L.square ? 34 : 44;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: L.captionY,
        display: "flex",
        justifyContent: "center",
        translate: `0px ${-50 + (1 - appear) * 20}%`,
        opacity: appear * leave,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: width - L.side * 2 - 20,
          background: "rgba(11,27,58,0.88)",
          borderRadius: size * 0.5,
          padding: `${size * 0.32}px ${size * 0.6}px`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: size * 0.25,
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.25,
          textAlign: "center",
        }}
      >
        {words.map((w, i) => {
          const s = (acc / total) * speak;
          acc += w.length + 1;
          const e = (acc / total) * speak;
          const active = local >= s && local < e + 0.05;
          const said = local >= s;
          return (
            <span
              key={i}
              style={{
                color: active ? C.yellow : said ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                scale: active ? "1.06" : "1",
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
