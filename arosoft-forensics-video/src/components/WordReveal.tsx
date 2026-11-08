import React from "react";
import { EASE_OUT, tw, useSceneClock } from "../lib/anim";
import { C } from "../theme";
import { FONT } from "../fonts";

/**
 * Texte révélé mot par mot (opacité, montée, flou, rotation 3D).
 * `colors` permet de colorer certains mots : { "≠": C.orange }.
 */
export const WordReveal: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  out?: number;
  size?: number;
  weight?: number;
  color?: string;
  colors?: Record<string, string>;
  font?: string;
  align?: "left" | "center" | "right";
  letterSpacing?: number;
  style?: React.CSSProperties;
  lineHeight?: number;
}> = ({
  text,
  at,
  stagger = 0.12,
  out,
  size = 84,
  weight = 700,
  color = C.white,
  colors = {},
  font = FONT.display,
  align = "center",
  letterSpacing = -1,
  style,
  lineHeight = 1.08,
}) => {
  const { t } = useSceneClock();
  const words = text.split(" ");
  const outP = out !== undefined ? tw(t, [out, out + 0.45], [0, 1]) : 0;
  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        textAlign: align,
        letterSpacing,
        lineHeight,
        perspective: 800,
        opacity: 1 - outP,
        translate: `0px ${-outP * 30}px`,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = at + i * stagger;
        const p = tw(t, [s, s + 0.55], [0, 1], EASE_OUT);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: i < words.length - 1 ? "0.26em" : 0,
              opacity: p,
              translate: `0px ${(1 - p) * 40}px`,
              rotate: `x ${(1 - p) * 70}deg`,
              filter: p < 0.99 ? `blur(${(1 - p) * 10}px)` : undefined,
              color: colors[w] ?? color,
              textShadow: colors[w] ? `0 0 28px ${colors[w]}88` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
