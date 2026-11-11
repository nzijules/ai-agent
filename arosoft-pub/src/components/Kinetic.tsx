import React from "react";
import { COLORS, FONT_TITLE, SceneId, sceneStart, vo } from "../config";
import { sp, tw } from "../anim";

/** Frame locale d'une scène correspondant au temps VO t. */
export const at = (id: SceneId, t: number) => vo(t) - sceneStart(id);

/** Titre en typographie cinétique : mots qui surgissent avec ressort. */
export const Headline: React.FC<{
  lines: string[];
  frame: number;
  start: number;
  size?: number;
  stagger?: number;
  highlight?: string[];
  marker?: string[];
  color?: string;
  weight?: number;
  align?: "center" | "left";
  exitAt?: number;
}> = ({ lines, frame, start, size = 96, stagger = 3, highlight = [], marker = [], color = COLORS.white, weight = 900, align = "center", exitAt }) => {
  let idx = 0;
  const exit = exitAt !== undefined ? tw(frame, [exitAt, exitAt + 10], [0, 1]) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: size * 0.08 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: `0 ${size * 0.26}px` }}>
          {line.split(" ").map((w, wi) => {
            const s = start + idx * stagger;
            idx++;
            const p = sp(frame, s, 12, 0.7, 160);
            const isHi = highlight.some((h) => w.toUpperCase().includes(h));
            const isMk = marker.some((h) => w.toUpperCase().includes(h));
            const mk = tw(frame, [s + 6, s + 16], [0, 1]);
            return (
              <span
                key={wi}
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontFamily: FONT_TITLE,
                  fontWeight: weight,
                  fontSize: size,
                  lineHeight: 1.05,
                  letterSpacing: -1,
                  color: isMk ? COLORS.night : isHi ? COLORS.yellow : color,
                  opacity: Math.min(1, p * 1.4) * (1 - exit),
                  translate: `0px ${(1 - p) * size * 0.7 - exit * 40}px`,
                  scale: String(0.6 + 0.4 * p),
                  filter: `blur(${(1 - Math.min(1, p)) * 8 + exit * 10}px)`,
                  textShadow: isMk ? "none" : "0 6px 24px rgba(0,0,0,0.6)",
                  zIndex: 1,
                }}
              >
                {isMk && (
                  <span
                    style={{
                      position: "absolute",
                      left: -size * 0.12,
                      right: -size * 0.12,
                      top: size * 0.08,
                      bottom: size * 0.0,
                      background: COLORS.yellow,
                      borderRadius: size * 0.12,
                      transformOrigin: "0% 50%",
                      scale: `${mk} 1`,
                      zIndex: -1,
                      rotate: "-1.5deg",
                    }}
                  />
                )}
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Texte qui s'écrit au clavier (curseur clignotant). */
export const Typewriter: React.FC<{ text: string; frame: number; start: number; cps?: number; style?: React.CSSProperties; cursorColor?: string }> = ({
  text,
  frame,
  start,
  cps = 28,
  style,
  cursorColor = COLORS.cyan,
}) => {
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / 30) * cps)));
  const done = n >= text.length;
  const blink = done ? Math.floor(frame / 15) % 2 === 0 : true;
  return (
    <span style={style}>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: "0.5em", height: "1.05em", marginLeft: 3, verticalAlign: "text-bottom", background: cursorColor, opacity: frame >= start && blink ? 1 : 0 }} />
    </span>
  );
};

/** Durée (frames) de frappe d'un texte. */
export const typeDur = (text: string, cps = 28) => Math.ceil((text.length / cps) * 30);
