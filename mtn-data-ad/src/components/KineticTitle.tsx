import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { clamp, EASE_IN, EASE_OUT, SPRING_POP } from "../theme/timing";

export type TitleWord = {
  text: string;
  /** Mot mis en valeur : pastille noire, texte jaune, balayage. */
  highlight?: boolean;
  /** Retour à la ligne après ce mot. */
  breakAfter?: boolean;
};

type Props = {
  words: TitleWord[];
  /** Frame d'apparition du premier mot. */
  from: number;
  /** Décalage entre chaque mot (frames). */
  stagger?: number;
  /** Frame de début de sortie (optionnel). */
  exitAt?: number;
  fontSize?: number;
  color?: string;
  align?: "left" | "center";
  lineHeight?: number;
};

/**
 * Système de typographie animée : chaque mot surgit d'un masque avec une
 * rotation et un léger dépassement (ressort), puis le mot-clé reçoit une
 * pastille noire qui se déploie. Sortie : les mots s'envolent vers le haut.
 */
export const KineticTitle: React.FC<Props> = ({
  words,
  from,
  stagger = 4,
  exitAt,
  fontSize = 104,
  color = COLORS.black,
  align = "center",
  lineHeight = 1.04,
}) => {
  const frame = useCurrentFrame();

  const lines: TitleWord[][] = [[]];
  words.forEach((w) => {
    lines[lines.length - 1].push(w);
    if (w.breakAfter) lines.push([]);
  });

  let index = 0;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontStyle: "italic",
        fontWeight: 900,
        fontSize,
        lineHeight,
        letterSpacing: -2,
        color,
        textAlign: align,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: fontSize * 0.04,
      }}
    >
      {lines
        .filter((l) => l.length)
        .map((line, li) => (
          <div key={li} style={{ display: "flex", gap: fontSize * 0.26, flexWrap: "nowrap" }}>
            {line.map((w) => {
              const i = index++;
              const start = from + i * stagger;
              const inP = interpolate(frame, [start, start + 16], [0, 1], { ...clamp, easing: SPRING_POP });
              const fade = interpolate(frame, [start, start + 6], [0, 1], clamp);
              const outP =
                exitAt === undefined
                  ? 0
                  : interpolate(frame, [exitAt + i * 2, exitAt + i * 2 + 12], [0, 1], { ...clamp, easing: EASE_IN });
              const hlStart = from + words.length * stagger + 4;
              const hl = interpolate(frame, [hlStart, hlStart + 12], [0, 1], { ...clamp, easing: EASE_OUT });
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: `${fontSize * 0.04}px ${fontSize * 0.14}px ${fontSize * 0.08}px`,
                    margin: `0 ${-fontSize * 0.1}px`,
                  }}
                >
                  {w.highlight ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: `${fontSize * 0.06}px ${fontSize * 0.04}px ${fontSize * 0.04}px`,
                        backgroundColor: COLORS.black,
                        borderRadius: fontSize * 0.16,
                        transformOrigin: "left center",
                        scale: `${hl} 1`,
                        transform: "skewX(-8deg)",
                        boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      position: "relative",
                      translate: `0px ${(1 - inP) * 110 - outP * 120}%`,
                      rotate: `${(1 - inP) * 8}deg`,
                      opacity: fade * (1 - outP),
                      color: w.highlight ? interpolateColor(hl, color, COLORS.yellow) : color,
                      textShadow: w.highlight ? "none" : "0 6px 0 rgba(255,255,255,0.35)",
                    }}
                  >
                    {w.text}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
};

const hexToRgb = (h: string) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const interpolateColor = (t: number, a: string, b: string) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
