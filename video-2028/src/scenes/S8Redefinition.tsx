import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Common";
import { C, CUES, F, ease, ip, rand, useT } from "../lib/theme";

const WORDS = ["APPRENDRE.", "EXPÉRIMENTER.", "AUTOMATISER.", "CRÉER.", "DÉCIDER."];

/** Tunnel de lignes lumineuses en perspective (sensation d'accélération). */
const Tunnel: React.FC<{ speed: number }> = ({ speed }) => {
  const t = useT();
  return (
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      {new Array(46).fill(0).map((_, i) => {
        const a = rand(i + 3) * Math.PI * 2;
        const life = (t * speed * (0.4 + rand(i) * 0.6) + rand(i + 9)) % 1;
        const r0 = 60 + life * life * 1400;
        const r1 = r0 + 40 + life * 260;
        const cx = 540;
        const cy = 760;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r0}
            y1={cy + Math.sin(a) * r0}
            x2={cx + Math.cos(a) * r1}
            y2={cy + Math.sin(a) * r1}
            stroke={i % 4 === 0 ? C.cyan : C.blue}
            strokeWidth={1 + life * 4}
            opacity={life * 0.8}
          />
        );
      })}
    </svg>
  );
};

export const S8Redefinition: React.FC = () => {
  const t = useT();
  const idx = CUES.words.filter((w) => t >= w - 0.1).length - 1;
  const speed = 0.35 + Math.max(0, idx) * 0.12;

  return (
    <AbsoluteFill>
      <Backdrop grid={0.3} particles={30} hue={C.blue} intensity={1.2} speed={2} />
      <Tunnel speed={speed} />

      {/* compteur */}
      <div
        style={{
          position: "absolute",
          top: 530,
          width: "100%",
          textAlign: "center",
          fontFamily: F.mono,
          fontSize: 34,
          letterSpacing: 8,
          color: C.cyan,
          opacity: idx >= 0 ? 1 : 0,
        }}
      >
        {`0${Math.max(0, idx) + 1} / 05`}
      </div>

      {/* mot courant, chacun avec son propre mouvement */}
      {WORDS.map((w, i) => {
        const at = CUES.words[i];
        const next = CUES.words[i + 1] ?? 74.5;
        const p = ip(t, [at - 0.1, at + 0.45], [0, 1], ease.out);
        const out = ip(t, [next - 0.15, next + 0.15], [0, 1], ease.in);
        if (p <= 0 || out >= 1) return null;
        const size = Math.min(150, 940 / (w.length * 0.66));
        const isLast = i === WORDS.length - 1;
        const motion: React.CSSProperties = [
          { scale: `${1 + (1 - p) * 2.2}`, filter: p < 1 ? `blur(${(1 - p) * 20}px)` : undefined },
          { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, translate: `${(1 - p) * -60}px 0px` },
          { translate: `0px ${(1 - p) * 140}px`, rotate: `${(1 - p) * -6}deg` },
          { scale: `${ease.back(p)}` },
          { clipPath: `inset(0 ${(1 - p) * 50}% 0 ${(1 - p) * 50}%)`, letterSpacing: (1 - p) * 40 },
        ][i];
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              top: 600,
              height: 260,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - out,
              translate: `0px ${-out * 80}px`,
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 700,
                fontSize: size,
                letterSpacing: -2,
                color: isLast ? C.cyan : C.white,
                textShadow: `0 0 50px ${isLast ? C.cyan : C.blue}aa`,
                whiteSpace: "nowrap",
                ...motion,
              }}
            >
              {w}
            </div>
          </div>
        );
      })}

      {/* pile des étapes franchies */}
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {WORDS.map((w, i) => {
          const p = ip(t, [CUES.words[i] + 0.3, CUES.words[i] + 0.7], [0, 1]);
          return (
            <div
              key={w}
              style={{
                fontFamily: F.mono,
                fontSize: 34,
                letterSpacing: 4,
                color: i === idx ? C.white : C.cyan,
                opacity: p * (i === idx ? 1 : 0.7),
                translate: `${(1 - p) * 40}px 0px`,
                display: "flex",
                gap: 16,
              }}
            >
              <span style={{ color: C.dim }}>{`0${i + 1}`}</span>
              {w.replace(".", "")}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
