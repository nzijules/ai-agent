import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { noise, rand, ip } from "../anim";

/**
 * Lumières de ville nocturne hors mise au point (bokeh photographique).
 * Aucune illustration : uniquement de la lumière, comme un arrière-plan filmé à grande ouverture.
 */
export const CityBokeh: React.FC<{ count?: number; style?: React.CSSProperties; warm?: number; height?: number }> = ({
  count = 46,
  style,
  warm = 1,
  height = 1920,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #03050b 0%, #0d1324 55%, #1d1610 100%)" }} />
      {new Array(count).fill(0).map((_, i) => {
        const big = rand(i + 2) > 0.7;
        const s = big ? 120 + rand(i) * 160 : 30 + rand(i + 5) * 70;
        const x = rand(i + 11) * 1180 - 50 + Math.sin(f / 120 + i) * 18;
        const y = height * (0.25 + rand(i + 21) * 0.7) + Math.cos(f / 140 + i) * 10;
        const hue = rand(i + 31);
        const color = hue < 0.45 * warm ? "255,190,90" : hue < 0.6 ? "255,203,5" : hue < 0.85 ? "255,240,220" : "140,180,255";
        const flick = 0.55 + 0.45 * noise(f / 25 + i * 3, i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${color},${0.55 * flick}) 0%, rgba(${color},${0.35 * flick}) 55%, rgba(${color},0) 72%)`,
              filter: `blur(${big ? 6 : 2}px)`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
      {/* reflets horizontaux (lagune) */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: height * 0.25, background: "linear-gradient(180deg, transparent, rgba(255,190,90,0.10))", filter: "blur(10px)" }} />
    </div>
  );
};

/** Empreinte vocale circulaire : représentation abstraite de l'appelant (aucun visage). */
export const VoicePrint: React.FC<{ size?: number; talk?: number; color?: string }> = ({ size = 520, talk = 1, color = C.yellow }) => {
  const f = useCurrentFrame();
  const n = 72;
  const r0 = size * 0.28;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <circle cx={size / 2} cy={size / 2} r={r0 - 10} fill="rgba(0,0,0,0.04)" stroke={color} strokeOpacity={0.25} strokeWidth={2} />
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        const v = noise(f / 3 + i * 0.4, i) * talk;
        const len = 14 + v * size * 0.18;
        const x1 = size / 2 + Math.cos(a) * r0;
        const y1 = size / 2 + Math.sin(a) * r0;
        const x2 = size / 2 + Math.cos(a) * (r0 + len);
        const y2 = size / 2 + Math.sin(a) * (r0 + len);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.35 + v * 0.65} />;
      })}
      <text x={size / 2} y={size / 2 + size * 0.07} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size * 0.22} fill={color}>
        ?
      </text>
      <text x={size / 2} y={size / 2 + size * 0.15} textAnchor="middle" fontFamily={MONO} fontSize={size * 0.035} fill={color} fillOpacity={0.7} letterSpacing={3}>
        APPELANT
      </text>
      <circle cx={size / 2} cy={size / 2} r={r0 + size * 0.2} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 12" transform={`rotate(${f * 0.6} ${size / 2} ${size / 2})`} />
      <circle cx={size / 2} cy={size / 2} r={r0 + size * 0.2} fill="none" stroke={color} strokeWidth={4} strokeDasharray={`${ip(f, [0, 30], [0, 120])} 2000`} transform={`rotate(${-f * 1.4} ${size / 2} ${size / 2})`} />
    </svg>
  );
};
