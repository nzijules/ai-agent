import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, RevealText } from "../components/Common";
import { C, CUES, F, ease, ip, useT } from "../lib/theme";

const MONTHS = ["JAN", "FÉV", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];

/** Horloge-odomètre : affiche 20XX, le dernier chiffre roule avec flou de vitesse. */
export const YearClock: React.FC<{ value: number; size?: number; color?: string; speed?: number }> = ({
  value,
  size = 230,
  color = C.white,
  speed = 0,
}) => {
  const h = size * 1.15;
  const units = value - 2020; // 6 → 8
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div
      style={{
        display: "flex",
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: size,
        lineHeight: `${h}px`,
        height: h,
        color,
        letterSpacing: -size * 0.04,
        textShadow: `0 0 40px ${color}88`,
      }}
    >
      <span>202</span>
      <div style={{ height: h, overflow: "hidden", position: "relative", width: size * 0.62 }}>
        <div
          style={{
            translate: `0px ${-units * h}px`,
            filter: speed > 0.05 ? `blur(0px ${Math.min(10, speed * 6)}px)` : undefined,
          }}
        >
          {digits.map((d) => (
            <div key={d} style={{ height: h, textAlign: "center" }}>
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const S1Choc: React.FC = () => {
  const t = useT();
  const lock = CUES.clockLock;
  // progression accélérée 2026 → 2028
  const p = ip(t, [1.0, lock], [0, 1], ease.in);
  const pPrev = ip(t - 1 / 30, [1.0, lock], [0, 1], ease.in);
  const speed = (p - pPrev) * 30 * 2;
  const year = 2026 + 2 * p;
  const locked = t >= lock;
  const flash = ip(t, [lock, lock + 0.08, lock + 0.9], [0, 1, 0]);
  const clockColor = locked ? C.orange : C.white;
  const monthIdx = Math.floor((p * 24) % 12);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: ip(t, [0.3, 2.2], [0, 1]) }}>
        <Backdrop hue={locked ? C.orange : C.blue} grid={ip(t, [1, 4], [0, 0.35])} particles={30} intensity={0.8 + flash} />
      </AbsoluteFill>

      {/* Titre */}
      <div style={{ position: "absolute", top: 380, left: 80, right: 80, textAlign: "center" }}>
        <RevealText
          text="ET SI C'ÉTAIT"
          at={0.6}
          style={{ fontFamily: F.display, fontWeight: 700, fontSize: 96, color: C.white, letterSpacing: 6 }}
        />
        <RevealText
          text="DANS DEUX ANS ?"
          at={1.15}
          style={{
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 92,
            color: C.cyan,
            letterSpacing: 2,
            flexWrap: "nowrap",
            marginTop: 6,
            textShadow: `0 0 30px ${C.cyan}66`,
          }}
        />
      </div>

      {/* Cadran */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 950,
          width: 0,
          height: 0,
          opacity: ip(t, [0.8, 1.8], [0, 1]),
          scale: `${0.82 * ip(t, [0.8, 2.2], [0.85, 1]) * (1 + flash * 0.06)}`,
        }}
      >
        <svg width="860" height="860" viewBox="-430 -430 860 860" style={{ position: "absolute", left: -430, top: -430 }}>
          <circle r="380" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          {new Array(60).fill(0).map((_, i) => {
            const a = (i / 60) * Math.PI * 2 + p * Math.PI * 4;
            const long = i % 5 === 0;
            return (
              <line
                key={i}
                x1={Math.cos(a) * (long ? 340 : 355)}
                y1={Math.sin(a) * (long ? 340 : 355)}
                x2={Math.cos(a) * 372}
                y2={Math.sin(a) * 372}
                stroke={long ? clockColor : "rgba(255,255,255,0.3)"}
                strokeWidth={long ? 4 : 2}
              />
            );
          })}
          <circle
            r="400"
            fill="none"
            stroke={clockColor}
            strokeWidth="6"
            strokeDasharray={`${p * 2513} 2513`}
            transform="rotate(-90)"
            style={{ filter: `drop-shadow(0 0 12px ${clockColor})` }}
          />
          <circle r={400 + flash * 120} fill="none" stroke={C.orange} strokeWidth={4} opacity={flash} />
        </svg>
        <div style={{ position: "absolute", left: 0, top: 0, display: "flex", flexDirection: "column", alignItems: "center", translate: "-50% -50%", whiteSpace: "nowrap" }}>
          <YearClock value={year} color={clockColor} speed={speed} />
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 40,
              letterSpacing: 10,
              color: locked ? C.orange : C.cyan,
              marginTop: 10,
              opacity: 0.9,
            }}
          >
            {locked ? "AUJOURD'HUI + 2 ANS" : `${MONTHS[monthIdx]} · ${Math.floor(year)}`}
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
