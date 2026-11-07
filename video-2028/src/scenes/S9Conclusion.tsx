import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Common";
import { StandingBack } from "../components/People";
import { C, CUES, F, ease, ip, rand, useT } from "../lib/theme";
import { YearClock } from "./S1Choc";

/** Skyline d'une métropole africaine contemporaine au crépuscule (fenêtres éclairées). */
const Skyline: React.FC = () => {
  const t = useT();
  const B = new Array(16).fill(0).map((_, i) => {
    const w = 60 + rand(i + 1) * 70;
    const h = 220 + rand(i + 20) * 420 + (i === 7 ? 260 : 0) + (i === 11 ? 160 : 0);
    return { w, h, i };
  });
  let x = -30;
  return (
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2A4A" />
          <stop offset="1" stopColor="#0A101D" />
        </linearGradient>
        <linearGradient id="bldGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.cyan} stopOpacity="0.0" />
          <stop offset="0.5" stopColor={C.cyan} stopOpacity="0.18" />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* arrière-plan brumeux */}
      {new Array(22).fill(0).map((_, i) => (
        <rect
          key={`bg${i}`}
          x={i * 52 - 20}
          y={1180 - (120 + rand(i + 70) * 260)}
          width={46}
          height={400}
          fill="#13203A"
          opacity="0.6"
        />
      ))}
      {B.map(({ w, h, i }) => {
        const bx = x;
        x += w + 6;
        const top = 1180 - h;
        const cols = Math.floor(w / 18);
        const rows = Math.floor(h / 26);
        return (
          <g key={i}>
            <rect x={bx} y={top} width={w} height={h + 400} fill="url(#bld)" />
            <rect x={bx} y={top} width={w} height={h + 400} fill="url(#bldGlass)" />
            {i === 7 && <rect x={bx + w / 2 - 3} y={top - 90} width={6} height={90} fill="#22355C" />}
            {i === 7 && <circle cx={bx + w / 2} cy={top - 92} r={6} fill={C.orange} opacity={0.5 + 0.5 * Math.sin(t * 4)} />}
            {new Array(rows * cols).fill(0).map((__, k) => {
              const r = Math.floor(k / cols);
              const c = k % cols;
              const on = rand(i * 1000 + k) > 0.55;
              if (!on) return null;
              const warm = rand(i * 77 + k) > 0.6;
              return (
                <rect
                  key={k}
                  x={bx + 6 + c * 18}
                  y={top + 12 + r * 26}
                  width={9}
                  height={12}
                  fill={warm ? C.orange : C.cyan}
                  opacity={0.35 + 0.4 * rand(i + k * 3)}
                />
              );
            })}
          </g>
        );
      })}
      {/* sol / esplanade */}
      <rect x="0" y="1180" width="1080" height="740" fill="#070A11" />
      <rect x="0" y="1180" width="1080" height="4" fill={C.cyan} opacity="0.4" />
    </svg>
  );
};

export const S9Conclusion: React.FC = () => {
  const t = useT();
  const [y1, y2, y3] = CUES.years;
  const year =
    2026 + ip(t, [y2 - 0.25, y2 + 0.25], [0, 1], ease.inOut) + ip(t, [y3 - 0.25, y3 + 0.25], [0, 1], ease.inOut);
  const pull = ip(t, [78.4, 81.4], [0, 1], ease.inOut);

  return (
    <AbsoluteFill>
      <Backdrop grid={0} particles={20} hue={C.blue} intensity={0.6} />

      {/* ciel crépusculaire + ville (révélés par le recul de caméra) */}
      <AbsoluteFill style={{ opacity: pull, scale: `${1.35 - 0.35 * pull}`, transformOrigin: "50% 60%" }}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${C.bg} 0%, #0E1A3A 40%, #1D3A7A 58%, #2B4E9A 64%, ${C.orange}66 72%, ${C.bg} 74%)`,
          }}
        />
        <Skyline />
      </AbsoluteFill>

      {/* horloge : plein cadre puis s'éloigne dans le ciel */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: ip(pull, [0, 1], [820, 470]),
          translate: "-50% -50%",
          scale: `${ip(pull, [0, 1], [1, 0.5])}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: ip(t, [y1 - 0.6, y1], [0, 1]),
        }}
      >
        <YearClock value={year} color={year >= 2027.99 ? C.cyan : C.white} size={230} />
        <div style={{ display: "flex", gap: 40, marginTop: 20, fontFamily: F.mono, fontSize: 40, color: C.dim }}>
          {[2026, 2027, 2028].map((y, i) => (
            <span key={y} style={{ color: t >= CUES.years[i] ? C.white : C.dim }}>
              {y}
            </span>
          ))}
        </div>
      </div>

      {/* professionnel debout face à la ville */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 760,
          translate: "-50% 0",
          opacity: ip(pull, [0, 0.25], [0, 1]),
          scale: `${1.5 - 0.5 * pull}`,
          transformOrigin: "50% 100%",
          filter: `drop-shadow(0 0 24px ${C.cyan}44)`,
        }}
      >
        <StandingBack id="city" height={620} posture={1} skin={C.skin[1]} suit="#121A2B" />
      </div>
    </AbsoluteFill>
  );
};
