import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin } from "../anim";

type KProps = {
  text: string;
  start?: number;
  stagger?: number;
  size?: number;
  color?: string;
  highlight?: string[]; // mots en jaune
  highlightColor?: string;
  weight?: number;
  align?: "center" | "left";
  lineHeight?: number;
  style?: React.CSSProperties;
  out?: number; // frame de sortie (optionnelle)
};

/** Typographie cinétique : chaque mot sort d'un masque avec flou de mouvement. */
export const KineticText: React.FC<KProps> = ({
  text,
  start = 0,
  stagger = 4,
  size = 96,
  color = C.black,
  highlight = [],
  highlightColor = C.yellow,
  weight = 900,
  align = "center",
  lineHeight = 1.05,
  style,
  out,
}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        textAlign: align,
        textTransform: "uppercase",
        letterSpacing: -1,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const t0 = start + i * stagger;
        const p = ip(f, [t0, t0 + 14], [0, 1]);
        const blur = lin(f, [t0, t0 + 8], [12, 0]);
        let o = 1;
        let oy = 0;
        if (out !== undefined) {
          const q = ip(f, [out + i * 2, out + i * 2 + 10], [0, 1]);
          o = 1 - q;
          oy = -q * size * 0.6;
        }
        const hl = highlight.includes(w.replace(/[.,!?:«»]/g, ""));
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.08 }}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 110 + oy}%)`,
                filter: `blur(${blur}px)`,
                opacity: o * p,
                color: hl ? (highlightColor === C.yellow ? C.yellow : C.white) : color,
                background: hl ? (highlightColor === C.yellow ? C.black : highlightColor) : undefined,
                padding: hl ? `0 ${size * 0.12}px` : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Texte tapé caractère par caractère (curseur clignotant). */
export const TypeText: React.FC<{
  text: string;
  start: number;
  cps?: number; // caractères par frame
  style?: React.CSSProperties;
  cursor?: boolean;
}> = ({ text, start, cps = 1.2, style, cursor = true }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - start) * cps)));
  const done = n >= text.length;
  return (
    <span style={{ fontFamily: MONO, ...style }}>
      {text.slice(0, n)}
      {cursor && (!done || Math.floor(f / 10) % 2 === 0) && f >= start ? (
        <span style={{ opacity: 0.9 }}>▌</span>
      ) : null}
    </span>
  );
};

/** Intertitre de pièce à conviction : étiquette + titre + soulignement jaune balayé. */
export const EvidenceTitle: React.FC<{ label: string; title: string; start?: number; top?: number }> = ({
  label,
  title,
  start = 0,
  top = 250,
}) => {
  const f = useCurrentFrame();
  const lineW = ip(f, [start + 8, start + 30], [0, 100]);
  const labO = ip(f, [start, start + 10], [0, 1]);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 20px",
          background: C.black,
          color: C.yellow,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: 4,
          opacity: labO,
          transform: `translateX(${(1 - labO) * -40}px)`,
        }}
      >
        <span style={{ width: 14, height: 14, background: C.yellow, borderRadius: 2 }} />
        {label}
      </div>
      <KineticText text={title} start={start + 6} size={88} align="left" style={{ marginTop: 22 }} />
      <div style={{ height: 8, width: `${lineW}%`, background: C.black, marginTop: 10 }} />
    </div>
  );
};
