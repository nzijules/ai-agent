import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, easeOut } from "../anim";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";

type Line = { id: string; start: number; duration: number; text: string };

/**
 * Animated subtitles synced to the voice-over clips (src/generated/voiceover-<variant>.json).
 * Word timing is estimated from character length within each clip (karaoke-style highlight).
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const L = useLayout();
  const t = frame / fps;
  const lines: Line[] = useTL().LINES;
  const line = lines.find((l) => t >= l.start - 0.05 && t < l.start + l.duration + 0.35);
  if (!line) return null;
  const local = t - line.start;
  // keep prices together (« 3 000 FCFA ») so a chunk never splits them
  const all = line.text.replace(/(\d) (\d{3})/g, "$1\u00a0$2").replace(/(\d) (FCFA)/g, "$1\u00a0$2").split(" ");
  const total = all.reduce((a, w) => a + w.length + 1, 0);
  const speak = line.duration * 0.92;
  // word timings (char-weighted)
  const times: { w: string; s: number; e: number }[] = [];
  {
    let c = 0;
    for (const w of all) {
      const s0 = (c / total) * speak;
      c += w.length + 1;
      times.push({ w, s: s0, e: (c / total) * speak });
    }
  }
  // page long sentences into short chunks (max ~2 lines) so subtitles never cover the scene
  const maxChars = L.square ? 44 : 36;
  const chunks: (typeof times)[] = [];
  let cur: typeof times = [];
  let len = 0;
  for (const tw of times) {
    const breakAfterPunct = cur.length > 0 && /[,.;:!?…]$/.test(cur[cur.length - 1].w) && len > maxChars * 0.45;
    if (cur.length && (len + tw.w.length > maxChars || breakAfterPunct)) {
      chunks.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(tw);
    len += tw.w.length + 1;
  }
  if (cur.length) chunks.push(cur);
  const found = chunks.findIndex((c) => local < c[c.length - 1].e + 0.05);
  const ci = found === -1 ? chunks.length - 1 : found;
  const chunk = chunks[ci];
  const chunkStart = chunk[0].s;
  const pageIn = ci > 0 ? interpolate(local, [chunkStart - 0.05, chunkStart + 0.08], [0, 1], clamp) : 1;
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
        translate: `0px ${-50 + (1 - appear) * 20 + (1 - pageIn) * 12}%`,
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
        {chunk.map(({ w, s, e }, i) => {
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
