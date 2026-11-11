import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT } from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/* ---------- Background: navy glow, grid, glowing curve, diamonds ---------- */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 60;
  const pathLen = 2600;
  const dash = interpolate(frame, [0, 90], [pathLen, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const diamonds = [
    { x: 150, y: 420, s: 28, d: 0 },
    { x: 920, y: 760, s: 22, d: 20 },
    { x: 120, y: 1420, s: 18, d: 40 },
    { x: 960, y: 1600, s: 30, d: 10 },
    { x: 540, y: 1780, s: 16, d: 30 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.navy, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 900px 1100px at ${540 + drift}px ${
            1050 - drift
          }px, ${C.deep} 0%, rgba(7,26,122,0.35) 45%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,160,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,255,0.06) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(frame * 0.8) % 90}px`,
        }}
      />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 1080 1920"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M -60 1500 C 250 1650, 420 1250, 640 1300 S 900 1050, 1140 980"
          stroke={C.cyan}
          strokeWidth={5}
          fill="none"
          filter="url(#glow)"
          strokeDasharray={pathLen}
          strokeDashoffset={dash}
          opacity={0.8}
        />
      </svg>
      {diamonds.map((d, i) => {
        const y = d.y + Math.sin((frame + d.d * 3) / 25) * 18;
        const o = interpolate(frame, [d.d, d.d + 20], [0, 0.9], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: y,
              width: d.s,
              height: d.s,
              transform: `rotate(${45 + frame * 0.6}deg)`,
              border: `3px solid ${C.cyan}`,
              background: "rgba(60,200,255,0.25)",
              boxShadow: `0 0 24px ${C.cyan}`,
              opacity: o,
            }}
          />
        );
      })}
      {/* subtle vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,10,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Persistent logo, top-right, transparent background ---------- */
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  return (
    <Img
      src={staticFile("logo-arosoft.png")}
      style={{
        position: "absolute",
        top: 70,
        right: 70,
        width: 220,
        opacity: s,
        transform: `translateY(${(1 - s) * -30}px) scale(${0.8 + 0.2 * s})`,
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.45))",
      }}
    />
  );
};

/* ---------- Scene wrapper: fades/zooms in and out ---------- */
export const Scene: React.FC<{
  dur: number;
  children: React.ReactNode;
}> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 10], [0, 1], clamp);
  const exit = interpolate(frame, [dur - 10, dur], [1, 0], clamp);
  const scale = interpolate(frame, [dur - 10, dur], [1, 1.08], clamp);
  const blur = interpolate(frame, [dur - 10, dur], [0, 12], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(enter, exit),
        transform: `scale(${scale})`,
        filter: blur > 0.01 ? `blur(${blur}px)` : undefined,
        fontFamily: FONT,
        color: C.white,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
        textAlign: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ---------- Pop-in text line ---------- */
export const Pop: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "up" | "down" | "scale";
}> = ({ delay, children, style, from = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const t =
    from === "scale"
      ? `scale(${0.4 + 0.6 * s})`
      : `translateY(${(1 - s) * (from === "up" ? 80 : -80)}px)`;
  return (
    <div style={{ opacity: Math.min(1, s * 1.5), transform: t, ...style }}>
      {children}
    </div>
  );
};

/* ---------- Highlight pill (yellow / red / blue like the cover) ---------- */
export const Pill: React.FC<{
  color: string;
  textColor?: string;
  children: React.ReactNode;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ color, textColor = C.navy, children, rotate = -2, style }) => (
  <span
    style={{
      display: "inline-block",
      background: color,
      color: textColor,
      padding: "6px 34px 12px",
      borderRadius: 26,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 14px 40px ${color}66`,
      ...style,
    }}
  >
    {children}
  </span>
);

/* ---------- Simple line icons ---------- */
export const Icon: React.FC<{ name: "code" | "clap" | "layers"; size?: number }> =
  ({ name, size = 84 }) => {
    const common = {
      fill: "none",
      stroke: C.cyan,
      strokeWidth: 3.5,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };
    return (
      <svg width={size} height={size} viewBox="0 0 48 48">
        {name === "code" && (
          <>
            <rect x="5" y="8" width="38" height="26" rx="3" {...common} />
            <path d="M18 40h12M24 34v6M20 17l-4 4 4 4M28 17l4 4-4 4" {...common} />
          </>
        )}
        {name === "clap" && (
          <>
            <rect x="6" y="18" width="36" height="22" rx="3" {...common} />
            <path d="M6 18l4-9 32 0-4 9M16 9l-4 9M26 9l-4 9M36 9l-4 9" {...common} />
            <path d="M21 25v9l7-4.5z" {...common} />
          </>
        )}
        {name === "layers" && (
          <>
            <path d="M24 6L4 16l20 10 20-10z" {...common} />
            <path d="M4 24l20 10 20-10M4 32l20 10 20-10" {...common} />
          </>
        )}
      </svg>
    );
  };

export { clamp };
