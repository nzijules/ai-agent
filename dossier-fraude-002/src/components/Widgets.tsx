import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, noise } from "../anim";

/** Ondes vocales réactives (barres pilotées par bruit). */
export const Waveform: React.FC<{
  amp?: number;
  bars?: number;
  width?: number;
  height?: number;
  color?: string;
  seed?: number;
  speaking?: (f: number) => number;
}> = ({ amp = 1, bars = 32, width = 420, height = 120, color = C.yellow, seed = 1, speaking }) => {
  const f = useCurrentFrame();
  const talk = speaking ? speaking(f) : 1;
  const bw = width / bars;
  return (
    <div style={{ width, height, display: "flex", alignItems: "center", gap: bw * 0.35 }}>
      {new Array(bars).fill(0).map((_, i) => {
        const env = Math.sin((i / (bars - 1)) * Math.PI);
        const n = noise(f / 3 + i * 0.7, seed + i);
        const h = Math.max(6, (0.12 + n * 0.88 * talk) * env * height * amp);
        return <div key={i} style={{ width: bw * 0.65, height: h, borderRadius: bw, background: color, opacity: 0.4 + n * 0.6 }} />;
      })}
    </div>
  );
};

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Compteur animé (chiffres qui se construisent). */
export const Counter: React.FC<{
  to: number;
  start: number;
  dur?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, start, dur = 40, suffix = "", style }) => {
  const f = useCurrentFrame();
  const v = ip(f, [start, start + dur], [0, to]);
  const settled = f > start + dur;
  return (
    <span style={{ fontFamily: FONT, fontVariantNumeric: "tabular-nums", ...style }}>
      {fmt(settled ? to : Math.floor(v / 137) * 137 + (Math.floor(f * 7) % 10))}
      {suffix}
    </span>
  );
};

/** Compte à rebours circulaire : la pression psychologique. */
export const Countdown: React.FC<{ start: number; seconds?: number; size?: number; speed?: number }> = ({
  start,
  seconds = 59,
  size = 300,
  speed = 4,
}) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - start);
  const remain = Math.max(0, seconds - (t * speed) / 30);
  const r = size / 2 - 16;
  const circ = 2 * Math.PI * r;
  const pulse = 1 + 0.04 * Math.sin(t / 2.5) * (remain < 30 ? 1.6 : 1);
  const appear = ip(f, [start - 10, start + 6], [0, 1]);
  return (
    <div style={{ width: size, height: size, position: "relative", transform: `scale(${pulse * appear})`, opacity: appear }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={14} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.red}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - remain / seconds)}
          style={{ filter: "drop-shadow(0 0 12px rgba(229,37,42,0.8))" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: C.white,
          fontFamily: MONO,
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: size * 0.24 }}>00:{String(Math.ceil(remain)).padStart(2, "0")}</div>
        <div style={{ fontFamily: FONT, fontSize: size * 0.075, letterSpacing: 3, color: C.red, fontWeight: 800 }}>URGENCE</div>
      </div>
    </div>
  );
};

/** Bouclier numérique : tracé SVG + trame hexagonale + halo. */
export const Shield: React.FC<{ start: number; size?: number }> = ({ start, size = 760 }) => {
  const f = useCurrentFrame();
  const draw = ip(f, [start, start + 40], [0, 1]);
  const fill = ip(f, [start + 25, start + 55], [0, 1]);
  const d = "M200 20 L370 80 V200 C370 300 300 360 200 400 C100 360 30 300 30 200 V80 Z";
  const len = 1300;
  const pulse = 0.5 + 0.5 * Math.sin((f - start) / 8);
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 400 420" style={{ overflow: "visible" }}>
      <defs>
        <pattern id="hex" width="24" height="41.6" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
          <path d="M12 0 L24 7 V21 L12 28 L0 21 V7 Z M12 41.6 V28" stroke="rgba(255,203,5,0.5)" strokeWidth="1" fill="none" />
        </pattern>
        <clipPath id="shclip">
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath="url(#shclip)" opacity={fill}>
        <rect x="0" y={420 - 420 * fill} width="400" height="420" fill="rgba(255,203,5,0.10)" />
        <rect x="0" y={420 - 420 * fill} width="400" height="420" fill="url(#hex)" />
      </g>
      <path
        d={d}
        fill="none"
        stroke={C.yellow}
        strokeWidth={6}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 ${12 + pulse * 18}px rgba(255,203,5,0.9))` }}
      />
    </svg>
  );
};

/** Particules qui voyagent le long d'un segment (flux de données / argent). */
export const FlowParticles: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  start: number;
  count?: number;
  color?: string;
  speed?: number;
}> = ({ x1, y1, x2, y2, start, count = 8, color = C.yellow, speed = 40 }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const o = lin(f, [start, start + 10], [0, 1]);
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const t = (((f - start) / speed + i / count) % 1 + 1) % 1;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI * 2 + i) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 6,
              top: y - 6,
              width: 12,
              height: 12,
              borderRadius: 6,
              background: color,
              opacity: o * Math.sin(t * Math.PI),
              boxShadow: `0 0 16px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};
