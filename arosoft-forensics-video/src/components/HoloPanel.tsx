import React from "react";
import { C } from "../theme";
import { FONT } from "../fonts";

/**
 * Panneau holographique (verre fumé, liseré cyan, coins techniques).
 * `p` (0→1) pilote l'ouverture : balayage de bord + déploiement vertical.
 */
export const HoloPanel: React.FC<{
  p?: number;
  width?: number;
  title?: string;
  icon?: React.ReactNode;
  accent?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  tag?: string;
}> = ({ p = 1, width = 440, title, icon, accent = C.cyan, children, style, tag }) => {
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div
      style={{
        position: "absolute",
        width: 22,
        height: 22,
        borderTop: `3px solid ${accent}`,
        borderLeft: `3px solid ${accent}`,
        rotate: `${rot}deg`,
        ...pos,
      }}
    />
  );
  return (
    <div
      style={{
        position: "relative",
        width,
        padding: "26px 28px",
        borderRadius: 20,
        background: `linear-gradient(160deg, rgba(20,40,66,0.82), rgba(8,16,30,0.78))`,
        border: `1px solid ${accent}44`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${accent}1A, inset 0 1px 0 rgba(255,255,255,0.06)`,
        clipPath: `inset(0 0 ${(1 - p) * 100}% 0 round 20px)`,
        opacity: Math.min(1, p * 2),
        fontFamily: FONT.ui,
        color: C.white,
        ...style,
      }}
    >
      {corner({ top: -2, left: -2 }, 0)}
      {corner({ top: -2, right: -2 }, 90)}
      {corner({ bottom: -2, right: -2 }, 180)}
      {corner({ bottom: -2, left: -2 }, 270)}
      {/* ligne de balayage */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${p * 100}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: p < 1 ? 1 : 0,
          boxShadow: `0 0 18px ${accent}`,
        }}
      />
      {(title || icon) && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          {icon}
          <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 34, letterSpacing: -0.5 }}>{title}</div>
          {tag && (
            <div
              style={{
                marginLeft: "auto",
                fontFamily: FONT.mono,
                fontSize: 18,
                color: accent,
                border: `1px solid ${accent}66`,
                borderRadius: 8,
                padding: "4px 10px",
              }}
            >
              {tag}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export const MonoRow: React.FC<{ k: string; v: string; color?: string; p?: number }> = ({ k, v, color = C.cyan, p = 1 }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 16,
      fontFamily: FONT.mono,
      fontSize: 27,
      padding: "9px 0",
      borderBottom: `1px dashed ${C.line}`,
      opacity: p,
      translate: `${(1 - p) * 20}px 0px`,
    }}
  >
    <span style={{ color: C.dim }}>{k}</span>
    <span style={{ color }}>{v}</span>
  </div>
);
