import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { C, F, ip, ease, rand, useT } from "../lib/theme";

/* ───────────── Fond : halo, grille en perspective, particules ───────────── */
export const Backdrop: React.FC<{
  hue?: string;
  hue2?: string;
  grid?: number;
  particles?: number;
  speed?: number;
  intensity?: number;
}> = ({ hue = C.blue, hue2 = C.cyan, grid = 0.5, particles = 40, speed = 1, intensity = 1 }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 38%, ${hue}${Math.round(40 * intensity)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%), radial-gradient(ellipse 60% 30% at 80% 85%, ${hue2}22 0%, transparent 70%)`,
        }}
      />
      {grid > 0 && (
        <div
          style={{
            position: "absolute",
            left: -1080,
            width: 3240,
            top: 1150,
            height: 1600,
            transformOrigin: "50% 0%",
            transform: "perspective(900px) rotateX(72deg)",
            backgroundImage: `linear-gradient(${C.cyan}55 2px, transparent 2px), linear-gradient(90deg, ${C.cyan}40 2px, transparent 2px)`,
            backgroundSize: "120px 120px",
            backgroundPosition: `0px ${(t * 60 * speed) % 120}px`,
            opacity: grid,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 60%, transparent 100%)",
          }}
        />
      )}
      {new Array(particles).fill(0).map((_, i) => {
        const x = rand(i + 1) * 1080;
        const y0 = rand(i + 50) * 1920;
        const s = 2 + rand(i + 99) * 4;
        const y = (y0 - t * (20 + rand(i + 7) * 50) * speed + 1920 * 4) % 1920;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * (0.6 + rand(i) * 1.5) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: s,
              background: i % 5 === 0 ? hue2 : C.white,
              opacity: 0.35 * tw,
              boxShadow: `0 0 ${s * 3}px ${i % 5 === 0 ? hue2 : C.white}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────── Grain argentique + vignette (finition cinéma) ───────────── */
export const FilmFinish: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(frame) * 1000);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter="url(#grain)" />
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.72) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ───────────── Logo (haut droite, sans fond, sans légende) ───────────── */
export const Logo: React.FC = () => {
  const t = useT();
  return (
    <Img
      src={staticFile("brand/logo-arosoft.png")}
      style={{
        position: "absolute",
        top: 205,
        right: 64,
        width: 190,
        opacity: ip(t, [0.4, 1.4], [0, 0.96]),
        translate: `0px ${ip(t, [0.4, 1.4], [-14, 0])}px`,
        filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.55))",
      }}
    />
  );
};

/* ───────────── Coque de scène : fenêtre temporelle, transitions, caméra ───────────── */
export type TransitionKind = "zoom" | "rise" | "slide" | "glitch" | "bloom" | "iris" | "cut";

export const SceneShell: React.FC<{
  start: number;
  end: number;
  enter?: TransitionKind;
  exit?: TransitionKind;
  push?: number; // intensité du travelling avant
  drift?: number; // dérive latérale de caméra (px)
  children: React.ReactNode;
}> = ({ start, end, enter = "zoom", exit = "zoom", push = 0.06, drift = 0, children }) => {
  const t = useT();
  const D = 0.45;
  if (t < start - D || t > end + D) return null;

  const pin = ip(t, [start - D, start + D], [0, 1], ease.out);
  const pout = ip(t, [end - D, end + D], [0, 1], ease.in);

  const fx = (k: TransitionKind, p: number, dir: 1 | -1) => {
    // p : 0 = plein écran, 1 = disparu
    switch (k) {
      case "zoom":
        return { s: 1 + dir * 0.18 * p, x: 0, y: 0, blur: 18 * p, o: 1 - p, r: 0 };
      case "rise":
        return { s: 1, x: 0, y: -dir * 260 * p, blur: 14 * p, o: 1 - p, r: 0 };
      case "slide":
        return { s: 1 - 0.05 * p, x: -dir * 300 * p, y: 0, blur: 16 * p, o: 1 - p, r: dir * 2 * p };
      case "glitch":
        return { s: 1 + 0.04 * p, x: (rand(Math.floor(t * 30)) - 0.5) * 80 * p, y: 0, blur: 0, o: p > 0.85 ? 0 : 1, r: 0 };
      case "bloom":
        return { s: 1 + 0.08 * p, x: 0, y: 0, blur: 10 * p, o: 1 - p, r: 0 };
      case "iris":
        return { s: 1 - 0.1 * p, x: 0, y: 0, blur: 6 * p, o: 1 - p, r: 0 };
      default:
        return { s: 1, x: 0, y: 0, blur: 0, o: p > 0.5 ? 0 : 1, r: 0 };
    }
  };
  const a = fx(enter, 1 - pin, -1);
  const b = fx(exit, pout, 1);
  const life = (t - start) / (end - start);
  const cam = 1 + push * ip(life, [0, 1], [0, 1], ease.soft);

  return (
    <AbsoluteFill
      style={{
        opacity: a.o * b.o,
        scale: `${a.s * b.s * cam}`,
        translate: `${a.x + b.x + drift * (life - 0.5)}px ${a.y + b.y}px`,
        rotate: `${a.r + b.r}deg`,
        filter: a.blur + b.blur > 0.3 ? `blur(${a.blur + b.blur}px)` : undefined,
        clipPath:
          enter === "iris" && pin < 1 ? `circle(${ip(pin, [0, 1], [0, 120])}% at 50% 42%)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* Fente lumineuse aux changements de scène (signature visuelle). */
export const LightSlit: React.FC<{ at: number; color?: string; vertical?: boolean }> = ({
  at,
  color = C.cyan,
  vertical = false,
}) => {
  const t = useT();
  if (t < at - 0.4 || t > at + 0.6) return null;
  const p = ip(t, [at - 0.4, at, at + 0.6], [0, 1, 0], ease.inOut);
  const w = ip(t, [at - 0.4, at + 0.6], [0.2, 1.4], ease.out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <div
        style={{
          position: "absolute",
          left: vertical ? "50%" : 0,
          top: vertical ? 0 : "45%",
          width: vertical ? 6 : "100%",
          height: vertical ? "100%" : 6,
          translate: vertical ? "-3px 0" : "0 -3px",
          scale: vertical ? `1 ${w}` : `${w} 1`,
          background: color,
          opacity: p,
          boxShadow: `0 0 60px 18px ${color}, 0 0 220px 60px ${color}66`,
          filter: "blur(1px)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ───────────── Panneau « verre » pour les interfaces IA ───────────── */
export const Glass: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  glow?: string;
}> = ({ style, children, glow = C.cyan }) => (
  <div
    style={{
      position: "absolute",
      background: "linear-gradient(160deg, rgba(30,42,70,0.78), rgba(10,16,30,0.82))",
      border: `1.5px solid ${glow}55`,
      borderRadius: 22,
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 40px ${glow}22`,
      backdropFilter: "blur(8px)",
      fontFamily: F.body,
      color: C.white,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

/* Barre de progression pilotée par le temps. */
export const Progress: React.FC<{ p: number; color?: string; h?: number }> = ({ p, color = C.cyan, h = 10 }) => (
  <div style={{ height: h, borderRadius: h, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
    <div
      style={{
        width: `${p * 100}%`,
        height: "100%",
        borderRadius: h,
        background: `linear-gradient(90deg, ${C.blue}, ${color})`,
        boxShadow: `0 0 16px ${color}`,
      }}
    />
  </div>
);

/* ───────────── Texte qui se révèle lettre par lettre (flou → net) ───────────── */
export const RevealText: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  from?: "blur" | "up" | "depth";
}> = ({ text, at, stagger = 0.035, dur = 0.6, style, from = "blur" }) => {
  const t = useT();
  return (
    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", whiteSpace: "pre", ...style }}>
      {text.split("").map((ch, i) => {
        const s = at + i * stagger;
        const p = ip(t, [s, s + dur], [0, 1], ease.out);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
              translate: from === "up" ? `0px ${(1 - p) * 60}px` : undefined,
              scale: from === "depth" ? `${1 + (1 - p) * 1.4}` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/* Mélange de lettres façon « décodage » entre deux mots. */
export const ScrambleText: React.FC<{ from: string; to: string; at: number; dur?: number; style?: React.CSSProperties }> = ({
  from,
  to,
  at,
  dur = 0.7,
  style,
}) => {
  const t = useT();
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";
  const p = ip(t, [at, at + dur], [0, 1], ease.inOut);
  const len = Math.round(from.length + (to.length - from.length) * p);
  let out = "";
  for (let i = 0; i < len; i++) {
    const threshold = i / Math.max(1, len);
    if (p <= 0) out += from[i] ?? "";
    else if (p >= 1) out += to[i] ?? "";
    else if (p > threshold + 0.25) out += to[i] ?? "";
    else out += GLYPHS[Math.floor(rand(i * 13 + Math.floor(t * 24)) * GLYPHS.length)];
  }
  return <span style={style}>{out}</span>;
};
