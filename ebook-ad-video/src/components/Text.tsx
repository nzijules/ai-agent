import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeOut, pop } from "../anim";
import { C, F } from "../theme";

/**
 * Kinetic headline: words rise in one after another.
 * Wrap words with *stars* to highlight them (yellow marker drawn behind).
 */
export const KineticText: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size: number;
  color?: string;
  hlColor?: string;
  hlText?: string;
  weight?: number;
  align?: "left" | "center";
  lineHeight?: number;
  font?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 3, size, color = C.navy, hlColor = C.yellow, hlText, weight = 900, align = "center", lineHeight = 1.12, font = F.display, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  let hl = false;
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        textAlign: align,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        rowGap: size * 0.04,
        letterSpacing: -0.5,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const starts = w.startsWith("*");
        const ends = w.endsWith("*") || w.endsWith("*,") || w.endsWith("*.") || w.endsWith("*?");
        if (starts) hl = true;
        const isHl = hl;
        if (ends) hl = false;
        const clean = w.replace(/\*/g, "");
        const d = delay + i * stagger;
        const p = pop(frame, d, 13, 0.7);
        const mark = interpolate(frame, [d + 6, d + 18], [0, 100], { ...clamp, easing: easeOut });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              opacity: interpolate(frame, [d, d + 6], [0, 1], clamp),
              translate: `0px ${(1 - p) * size * 0.55}px`,
              scale: String(0.9 + 0.1 * p),
              color: isHl && hlText ? hlText : undefined,
            }}
          >
            {isHl && (
              <span
                style={{
                  position: "absolute",
                  left: -size * 0.1,
                  right: -size * 0.1,
                  top: "12%",
                  bottom: "6%",
                  background: hlColor,
                  zIndex: -1,
                  clipPath: `inset(0 ${100 - mark}% 0 0)`,
                  borderRadius: size * 0.08,
                }}
              />
            )}
            {clean}
          </span>
        );
      })}
    </div>
  );
};

/** Small uppercase label / eyebrow chip */
export const Eyebrow: React.FC<{ children: React.ReactNode; size: number; bg?: string; color?: string; style?: React.CSSProperties }> = ({
  children,
  size,
  bg = C.yellow,
  color = C.navy,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.4,
      background: bg,
      color,
      fontFamily: F.display,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: size * 0.06,
      padding: `${size * 0.42}px ${size * 0.9}px`,
      borderRadius: size * 2,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Handwritten accent note with underline swoosh */
export const HandNote: React.FC<{ text: string; size: number; color?: string; delay?: number; rotate?: number; style?: React.CSSProperties }> = ({
  text,
  size,
  color = C.navy,
  delay = 0,
  rotate = -6,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 20], [0, 1], { ...clamp, easing: easeOut });
  const u = interpolate(frame, [delay + 12, delay + 30], [1, 0], { ...clamp, easing: easeOut });
  return (
    <div style={{ fontFamily: F.hand, fontWeight: 700, fontSize: size, color, lineHeight: 1.0, rotate: `${rotate}deg`, opacity: p, clipPath: `inset(0 ${100 - p * 100}% 0 0)`, ...style }}>
      {text}
      <svg width="100%" height={size * 0.3} viewBox="0 0 100 10" preserveAspectRatio="none" style={{ display: "block" }}>
        <path d="M2 7 C 30 2, 70 2, 98 5" stroke={C.yellow} strokeWidth={3} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={u} />
      </svg>
    </div>
  );
};
