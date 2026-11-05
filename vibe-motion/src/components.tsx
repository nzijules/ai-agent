import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { BEAT, C, F, GRAD } from "./theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const useSpr = (delay = 0, damping = 12, mass = 0.6, stiffness = 120) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass, stiffness } });
};

/** Pulsation calée sur le tempo (1 au temps, décroît ensuite) */
export const beatPulse = (frame: number, start = 135) => {
  if (frame < start) return 0;
  const p = (frame % BEAT) / BEAT;
  return Math.exp(-p * 5);
};

/* ------------------------------------------------------------------ */
/* Fond animé permanent : orbes lumineux, grille en perspective, particules */
/* ------------------------------------------------------------------ */
export const Background: React.FC<{ hue?: number }> = () => {
  const frame = useCurrentFrame();
  const pulse = beatPulse(frame);
  const orbs = [
    { c: C.violet, x: 20, y: 18, s: 900, sp: 0.011 },
    { c: C.orange, x: 85, y: 35, s: 800, sp: 0.009 },
    { c: C.cyan, x: 30, y: 80, s: 850, sp: 0.013 },
    { c: C.pink, x: 80, y: 85, s: 700, sp: 0.01 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${o.x + Math.sin(frame * o.sp + i) * 12}%`,
            top: `${o.y + Math.cos(frame * o.sp * 1.3 + i) * 8}%`,
            width: o.s,
            height: o.s,
            marginLeft: -o.s / 2,
            marginTop: -o.s / 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.c} 0%, transparent 65%)`,
            opacity: 0.32 + pulse * 0.08,
            filter: "blur(40px)",
          }}
        />
      ))}
      {/* Grille au sol en perspective */}
      <div
        style={{
          position: "absolute",
          left: "-50%",
          width: "200%",
          bottom: -200,
          height: 1100,
          transform: "perspective(700px) rotateX(68deg)",
          transformOrigin: "50% 100%",
          backgroundImage: `linear-gradient(rgba(139,92,246,${0.35 + pulse * 0.25}) 2px, transparent 2px), linear-gradient(90deg, rgba(139,92,246,${0.35 + pulse * 0.25}) 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${(frame * 4) % 90}px`,
          maskImage: "linear-gradient(to top, black 10%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 80%)",
        }}
      />
      {/* Particules */}
      {new Array(45).fill(0).map((_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 0.6 + random(`s${i}`) * 1.8;
        const y = 1920 - ((frame * speed + random(`y${i}`) * 1920) % 2000);
        const size = 3 + random(`z${i}`) * 7;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.08 + i));
        const col = [C.orange, C.cyan, C.violet, C.pink, "#fff"][i % 5];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame * 0.03 + i) * 20,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: col,
              opacity: tw * 0.8,
              boxShadow: `0 0 ${size * 3}px ${col}`,
            }}
          />
        );
      })}
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Entrée / sortie de scène : zoom + flou + fondu                      */
/* ------------------------------------------------------------------ */
export const SceneWrap: React.FC<{
  duration: number;
  children: React.ReactNode;
  noExit?: boolean;
}> = ({ duration, children, noExit }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const exit = noExit
    ? 0
    : interpolate(frame, [duration - 10, duration], [0, 1], {
        ...clamp,
        easing: Easing.in(Easing.cubic),
      });
  const scale = 1.15 - 0.15 * enter - 0.12 * exit;
  const blur = (1 - enter) * 24 + exit * 24;
  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Flash lumineux entre les scènes */
export const Flash: React.FC<{ at: number; strength?: number }> = ({ at, strength = 0.35 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 3, at, at + 8], [0, strength, 0], clamp);
  return <AbsoluteFill style={{ background: "#fff", opacity: o, mixBlendMode: "screen" }} />;
};

/* ------------------------------------------------------------------ */
/* Texte cinétique : mot par mot avec rebond                            */
/* ------------------------------------------------------------------ */
export const PopWords: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  font?: string;
  weight?: number;
  gradient?: boolean;
  color?: string;
  lineHeight?: number;
}> = ({
  text,
  delay = 0,
  stagger = 4,
  size = 110,
  font = F.display,
  weight = 900,
  gradient,
  color = C.ink,
  lineHeight = 1.05,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: `0 ${size * 0.28}px`,
        lineHeight,
      }}
    >
      {words.map((w, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 10, mass: 0.5, stiffness: 160 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: font,
              fontWeight: weight,
              fontSize: size,
              color: gradient ? "transparent" : color,
              backgroundImage: gradient ? GRAD : undefined,
              backgroundSize: gradient ? "200% 100%" : undefined,
              backgroundPosition: gradient ? `${(frame * 1.5) % 200}% 0` : undefined,
              WebkitBackgroundClip: gradient ? "text" : undefined,
              backgroundClip: gradient ? "text" : undefined,
              transform: `translateY(${(1 - s) * 80}px) scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * -8}deg)`,
              opacity: Math.min(1, s * 1.5),
              letterSpacing: font === F.display ? -2 : 0,
              textShadow: gradient ? undefined : "0 6px 30px rgba(0,0,0,0.5)",
              filter: gradient ? `drop-shadow(0 0 30px rgba(255,122,69,0.35))` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Texte qui se tape caractère par caractère */
export const Typewriter: React.FC<{
  text: string;
  start: number;
  cps?: number; // caractères par image
  style?: React.CSSProperties;
  cursor?: boolean;
}> = ({ text, start, cps = 1, style, cursor = true }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - start) * cps));
  const shown = text.slice(0, n);
  const done = n >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={style}>
      {shown}
      {cursor && (!done || blink) ? (
        <span
          style={{
            display: "inline-block",
            width: "0.55em",
            height: "1.05em",
            background: C.orange,
            verticalAlign: "text-bottom",
            marginLeft: 4,
            opacity: done && !blink ? 0 : 1,
          }}
        />
      ) : null}
    </span>
  );
};

/** Carte "verre dépoli" */
export const Glass: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div
    style={{
      background: "rgba(20,16,40,0.72)",
      border: "2px solid rgba(255,255,255,0.12)",
      borderRadius: 36,
      boxShadow:
        "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 60px rgba(139,92,246,0.25)",
      backdropFilter: "blur(20px)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Fenêtre de terminal */
export const Terminal: React.FC<{
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title = "claude — ~/ma-video", children, style }) => (
  <Glass style={{ overflow: "hidden", ...style }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "22px 28px",
        borderBottom: "2px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
      ))}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontFamily: F.mono,
          fontSize: 26,
          color: C.dim,
          marginRight: 80,
        }}
      >
        {title}
      </div>
    </div>
    <div style={{ padding: "34px 38px", fontFamily: F.mono, fontSize: 36, color: C.ink, lineHeight: 1.5 }}>
      {children}
    </div>
  </Glass>
);

/** Étoile / étincelle générique (8 branches) */
export const Spark: React.FC<{ size: number; color?: string; rotate?: number; glow?: boolean }> = ({
  size,
  color = C.orange,
  rotate = 0,
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="-50 -50 100 100"
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: glow ? `drop-shadow(0 0 ${size / 6}px ${color})` : undefined,
    }}
  >
    {new Array(8).fill(0).map((_, i) => (
      <rect
        key={i}
        x={-4.5}
        y={-48}
        width={9}
        height={48}
        rx={4.5}
        fill={color}
        transform={`rotate(${i * 45})`}
        opacity={i % 2 ? 0.85 : 1}
        style={{ transformOrigin: "0 0" }}
      />
    ))}
    <circle r={9} fill={color} />
  </svg>
);

/** En-tête d'étape « 01 — Titre » */
export const StepHeader: React.FC<{ n: string; title: string; color: string }> = ({
  n,
  title,
  color,
}) => {
  const frame = useCurrentFrame();
  const s = useSpr(2, 11);
  const s2 = useSpr(8, 12);
  const lineW = interpolate(frame, [6, 26], [0, 260], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div
        style={{
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 10,
          color,
          opacity: s,
          transform: `translateY(${(1 - s) * -30}px)`,
        }}
      >
        ÉTAPE
      </div>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 900,
          fontSize: 230,
          lineHeight: 0.9,
          color: "transparent",
          WebkitTextStroke: `4px ${color}`,
          transform: `scale(${0.3 + 0.7 * s}) rotate(${(1 - s) * -20}deg)`,
          opacity: s,
          filter: `drop-shadow(0 0 30px ${color})`,
        }}
      >
        {n}
      </div>
      <div style={{ width: lineW, height: 8, borderRadius: 4, background: color, boxShadow: `0 0 20px ${color}` }} />
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 900,
          fontSize: 82,
          color: C.ink,
          textAlign: "center",
          lineHeight: 1.05,
          marginTop: 16,
          opacity: s2,
          transform: `translateY(${(1 - s2) * 60}px)`,
          letterSpacing: -2,
          padding: "0 60px",
        }}
      >
        {title}
      </div>
    </div>
  );
};

/** Pastille avec coche */
export const CheckChip: React.FC<{ label: string; delay: number; color: string }> = ({
  label,
  delay,
  color,
}) => {
  const s = useSpr(delay, 10);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 34px 18px 20px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.08)",
        border: `3px solid ${color}`,
        boxShadow: `0 0 30px ${color}55`,
        transform: `scale(${s}) translateX(${(1 - s) * -100}px)`,
        opacity: s,
        fontFamily: F.body,
        fontWeight: 700,
        fontSize: 44,
        color: C.ink,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.bg,
          fontSize: 34,
          fontWeight: 800,
        }}
      >
        ✓
      </div>
      {label}
    </div>
  );
};

/** Anneaux d'onde de choc */
export const Shockwave: React.FC<{ at: number; color?: string; count?: number }> = ({
  at,
  color = C.orange,
  count = 3,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const t = frame - at - i * 6;
        if (t < 0) return null;
        const p = interpolate(t, [0, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 200 + p * 1600,
              height: 200 + p * 1600,
              borderRadius: "50%",
              border: `${10 * (1 - p) + 1}px solid ${color}`,
              opacity: 1 - p,
              boxShadow: `0 0 40px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
