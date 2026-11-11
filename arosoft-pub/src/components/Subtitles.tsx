import React from "react";
import { useCurrentFrame } from "remotion";
import { GROUPS, KEYWORDS, SUPPRESS } from "../captions";
import { COLORS, FONT_TITLE, FPS, VO_OFFSET } from "../config";
import { tw } from "../anim";

const norm = (s: string) => s.toLowerCase().replace(/[.,!?…:]/g, "");

/** Sous-titres dynamiques synchronisés mot par mot (zone sûre TikTok). */
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - VO_OFFSET;
  const g = GROUPS.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!g) return null;
  if (SUPPRESS.some(([a, b]) => g.start >= a - 0.1 && g.start < b)) return null;
  const local = (t - g.start + 0.05) * FPS;
  const out = (g.end - t) * FPS;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 150, // évite la colonne de boutons TikTok à droite
        top: 1330,
        display: "flex",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 16px",
          maxWidth: 820,
          padding: "16px 26px",
          borderRadius: 22,
          background: "rgba(6,11,28,0.55)",
          backdropFilter: "blur(6px)",
          opacity: tw(local, [0, 4], [0, 1]) * tw(out, [0, 3], [0, 1]),
          scale: String(tw(local, [0, 7], [0.86, 1])),
        }}
      >
        {g.words.map((w, i) => {
          const active = t >= w.start - 0.03;
          const key = KEYWORDS.includes(norm(w.text));
          const pop = tw((t - w.start) * FPS, [0, 4], [1.12, 1]);
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT_TITLE,
                fontWeight: 800,
                fontSize: 58,
                lineHeight: 1.15,
                color: key ? COLORS.yellow : COLORS.white,
                opacity: active ? 1 : 0.38,
                scale: String(active ? pop : 1),
                display: "inline-block",
                textShadow: "0 4px 14px rgba(0,0,0,0.75)",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
