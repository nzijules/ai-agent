import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme/colors";
import { clamp, EASE_IN_OUT, EASE_OUT } from "../theme/timing";
import { seeded } from "../theme/random";

type Props = {
  /** Graine : change la disposition des particules / lignes d'une scène à l'autre. */
  seed?: number;
  /** Frame à laquelle le fond « s'allume » (0 = déjà lumineux). */
  lightUpFrom?: number;
  /** Durée de l'allumage, en frames. */
  lightUpDuration?: number;
  /** Position du halo principal (en %). */
  haloX?: number;
  haloY?: number;
  /** Décalage de parallaxe global (px), piloté par la scène. */
  parallax?: number;
};

const LINES = [
  "M -120 520 C 220 380, 420 700, 700 560 S 1080 360, 1240 470",
  "M -100 1380 C 240 1240, 520 1500, 820 1330 S 1120 1180, 1220 1250",
  "M 1180 120 C 900 260, 760 60, 520 200 S 160 320, -80 180",
  "M -60 1760 C 300 1640, 600 1880, 900 1700 S 1160 1600, 1200 1640",
];

/**
 * Fond MTN réutilisable : jaune corporate, dégradés vers #FFE500 / #FFF176,
 * halos doux, lignes courbes lumineuses, trame de points, particules,
 * barres de données et arcs de connectivité. Entièrement animé par le code.
 */
export const MTNBackground: React.FC<Props> = ({
  seed = 7,
  lightUpFrom = 0,
  lightUpDuration = 24,
  haloX = 62,
  haloY = 38,
  parallax = 0,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const r = seeded(seed);
    return new Array(46).fill(0).map(() => ({
      x: r() * 1080,
      y: r() * 1920,
      size: 3 + r() * 9,
      speed: 0.3 + r() * 1.1,
      phase: r() * Math.PI * 2,
      depth: 0.3 + r() * 0.7,
    }));
  }, [seed]);

  const bars = useMemo(() => {
    const r = seeded(seed + 99);
    return new Array(9).fill(0).map(() => ({ base: 0.3 + r() * 0.6, phase: r() * 6 }));
  }, [seed]);

  const light = interpolate(frame, [lightUpFrom, lightUpFrom + lightUpDuration], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });

  // Le halo dérive lentement : le fond respire en permanence.
  const hx = haloX + Math.sin(frame / 55) * 6;
  const hy = haloY + Math.cos(frame / 70) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.yellow, overflow: "hidden" }}>
      {/* Dégradé principal + halos */}
      <AbsoluteFill
        style={{
          opacity: 0.35 + 0.65 * light,
          background: `radial-gradient(circle at ${hx}% ${hy}%, ${COLORS.yellowPale} 0%, ${COLORS.yellowBright} 26%, rgba(255,229,0,0) 58%),
             radial-gradient(circle at ${18 - Math.sin(frame / 80) * 5}% ${82}%, rgba(255,241,118,0.85) 0%, rgba(255,241,118,0) 42%),
             linear-gradient(165deg, ${COLORS.yellowBright} 0%, ${COLORS.yellow} 55%, #FFC000 100%)`,
        }}
      />

      {/* Trame de points en transparence (dérive lente, masque radial) */}
      <svg
        width={1080}
        height={1920}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22 * light,
          translate: `0px ${(-frame * 0.4 + parallax * 0.3) % 36}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 10%, transparent 70%)",
        }}
      >
        <defs>
          <pattern id={`dots-${seed}`} width={36} height={36} patternUnits="userSpaceOnUse">
            <circle cx={4} cy={4} r={2.6} fill={COLORS.white} />
          </pattern>
        </defs>
        <rect x={0} y={-40} width={1080} height={2000} fill={`url(#dots-${seed})`} />
      </svg>

      {/* Arcs de connectivité (coin supérieur droit) */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.5 * light }}>
        {[0, 1, 2, 3].map((i) => {
          const t = ((frame / 40 + i * 0.25) % 1) as number;
          return (
            <circle
              key={i}
              cx={1010}
              cy={110}
              r={60 + t * 380}
              fill="none"
              stroke={COLORS.white}
              strokeWidth={3}
              opacity={(1 - t) * 0.55}
            />
          );
        })}
      </svg>

      {/* Lignes courbes lumineuses qui se dessinent, avec une « comète » de données */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, translate: `${parallax * 0.6}px 0px` }}
      >
        <defs>
          <filter id={`glow-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {LINES.map((d, i) => {
          const draw = interpolate(frame, [lightUpFrom + i * 6, lightUpFrom + 40 + i * 6], [1, 0], {
            ...clamp,
            easing: EASE_IN_OUT,
          });
          const comet = ((frame * (0.006 + i * 0.0015) + i * 0.27) % 1) as number;
          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={COLORS.white}
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.55}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={draw}
              />
              <path
                d={d}
                fill="none"
                stroke={COLORS.white}
                strokeWidth={6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.06 0.94"
                strokeDashoffset={-comet}
                filter={`url(#glow-${seed})`}
                opacity={draw < 0.01 ? 0.95 : 0}
              />
            </g>
          );
        })}
      </svg>

      {/* Formes géométriques très légères */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.18 * light }}>
        <rect
          x={70}
          y={300}
          width={120}
          height={120}
          rx={28}
          fill="none"
          stroke={COLORS.white}
          strokeWidth={4}
          transform={`rotate(${12 + frame * 0.15} 130 360)`}
        />
        <circle cx={980} cy={1540} r={70} fill="none" stroke={COLORS.white} strokeWidth={4} />
        <path
          d="M 900 860 l 40 -70 l 40 70 z"
          fill="none"
          stroke={COLORS.white}
          strokeWidth={4}
          transform={`rotate(${-frame * 0.2} 940 830)`}
        />
      </svg>

      {/* Barres de données (bas gauche) */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 90,
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          height: 140,
          opacity: 0.28 * light,
        }}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              width: 14,
              borderRadius: 7,
              backgroundColor: COLORS.white,
              height: `${(b.base * 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(frame / 9 + b.phase))) * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Particules lumineuses (parallaxe selon la profondeur) */}
      {particles.map((p, i) => {
        const y = (((p.y - frame * p.speed * 2) % 1920) + 1920) % 1920;
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame / 12 + p.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + Math.sin(frame / 40 + p.phase) * 14 + parallax * p.depth,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.white} 0%, rgba(255,255,255,0) 70%)`,
              opacity: tw * 0.9 * light,
            }}
          />
        );
      })}

      {/* Vignettage doux pour concentrer le regard */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(160,110,0,0.22) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
