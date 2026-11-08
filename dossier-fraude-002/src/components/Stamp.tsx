import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { ip, sp } from "../anim";

/** Tampon rouge qui frappe l'écran (échelle 3 → 1, rotation, encre irrégulière). */
export const Stamp: React.FC<{
  text: string;
  sub?: string;
  at: number;
  size?: number;
  rotate?: number;
  color?: string;
  style?: React.CSSProperties;
  subScale?: number;
}> = ({ text, sub, at, size = 76, rotate = -9, color = C.red, style, subScale = 0.34 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = sp(f, fps, at, 11, 0.6);
  const scale = 2.6 - 1.6 * s;
  const o = ip(f, [at, at + 3], [0, 1]);
  const id = `ink${text.length}${at}`;
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg)`,
        opacity: o,
        left: "50%",
        top: "50%",
        ...style,
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed={at % 9} />
          <feDisplacementMap in="SourceGraphic" scale="6" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1 1 1 1 1 0.85 1" />
          </feComponentTransfer>
        </filter>
      </svg>
      <div
        style={{
          filter: `url(#${id}) drop-shadow(0 0 30px rgba(229,37,42,0.45))`,
          border: `${size * 0.09}px solid ${color}`,
          outline: `${size * 0.03}px solid ${color}`,
          outlineOffset: size * 0.08,
          borderRadius: size * 0.12,
          padding: `${size * 0.2}px ${size * 0.4}px`,
          color,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          letterSpacing: size * 0.04,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.05,
          background: "rgba(229,37,42,0.06)",
        }}
      >
        {text}
        {sub && <div style={{ fontSize: size * subScale, letterSpacing: size * 0.03, marginTop: size * 0.12 }}>{sub}</div>}
      </div>
    </div>
  );
};

/** Bandeau d'alerte rouge avec triangle pulsant. */
export const AlertBanner: React.FC<{ text: string; at: number; style?: React.CSSProperties; size?: number }> = ({
  text,
  at,
  style,
  size = 44,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = sp(f, fps, at, 13);
  const pulse = 0.5 + 0.5 * Math.sin((f - at) / 4);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        transform: `scaleX(${s})`,
        background: `linear-gradient(90deg, ${C.redDeep}, ${C.red} 30%, ${C.red} 70%, ${C.redDeep})`,
        borderRadius: 16,
        padding: "26px 30px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        boxShadow: `0 0 ${40 + pulse * 50}px rgba(229,37,42,${0.5 + pulse * 0.3})`,
        ...style,
      }}
    >
      <svg width={size * 1.4} height={size * 1.4} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: s }}>
        <path d="M12 2 L23 21 H1 Z" fill={C.white} />
        <rect x="11" y="8" width="2" height="7" fill={C.red} />
        <rect x="11" y="16.5" width="2" height="2" fill={C.red} />
      </svg>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          color: C.white,
          lineHeight: 1.1,
          letterSpacing: 0.5,
          opacity: ip(f, [at + 4, at + 12], [0, 1]),
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </div>
  );
};
