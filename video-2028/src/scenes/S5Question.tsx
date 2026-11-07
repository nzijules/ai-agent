import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Common";
import { PROFILE_PATH, ProfilePortrait } from "../components/People";
import { C, CUES, F, ease, ip, useT } from "../lib/theme";

/** Version « future » du reflet : même silhouette, posture plus droite, maillage lumineux. */
const FutureSelf: React.FC<{ p: number }> = ({ p }) => (
  <svg viewBox="0 0 600 800" width="760" height="1013" style={{ overflow: "visible" }}>
    <defs>
      <clipPath id="fs-clip">
        <path d={PROFILE_PATH} />
      </clipPath>
      <linearGradient id="fs-fill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.blue} stopOpacity="0.55" />
        <stop offset="1" stopColor={C.cyan} stopOpacity="0.25" />
      </linearGradient>
    </defs>
    <path d={PROFILE_PATH} fill="url(#fs-fill)" />
    <g clipPath="url(#fs-clip)">
      {new Array(40).fill(0).map((_, i) => (
        <line key={i} x1="0" x2="600" y1={i * 20 + ((1 - p) * 400) % 20} y2={i * 20} stroke={C.cyan} strokeWidth="1.6" opacity={0.55} />
      ))}
      {new Array(16).fill(0).map((_, i) => (
        <line key={`v${i}`} y1="0" y2="800" x1={i * 40} x2={i * 40 + 30} stroke={C.cyan} strokeWidth="1" opacity={0.3} />
      ))}
    </g>
    <path d={PROFILE_PATH} fill="none" stroke={C.cyan} strokeWidth="4" style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
    {/* HUD autour de la tête */}
    <circle cx="300" cy="380" r={230} fill="none" stroke={C.cyan} strokeWidth="2" strokeDasharray="6 14" opacity={0.7 * p} />
    <circle cx="300" cy="380" r={260} fill="none" stroke={C.white} strokeWidth="1.5" strokeDasharray={`${p * 1630} 1630`} opacity={0.5} />
  </svg>
);

export const S5Question: React.FC = () => {
  const t = useT();
  const morph = ip(t, [CUES.reflection, CUES.reflection + 1.6], [0, 1], ease.inOut);
  const q2 = 41.2;
  const breathe = Math.sin(t * 1.2) * 4;

  return (
    <AbsoluteFill>
      <Backdrop grid={0} particles={14} hue={C.blue} intensity={0.35} />

      {/* Écran (plan de verre en perspective) avec reflet */}
      <div
        style={{
          position: "absolute",
          left: 610,
          top: 420,
          width: 520,
          height: 840,
          transform: "perspective(1200px) rotateY(-28deg)",
          transformOrigin: "0% 50%",
          borderRadius: 18,
          overflow: "hidden",
          background: "linear-gradient(180deg, rgba(0,217,255,0.22), rgba(37,99,235,0.18) 60%, rgba(8,11,18,0.6))",
          border: `2px solid ${C.cyan}66`,
          boxShadow: `0 0 120px ${C.cyan}44, inset 0 0 60px ${C.cyan}22`,
        }}
      >
        {/* lignes d'interface */}
        {new Array(14).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40,
              top: 60 + i * 52,
              height: 10,
              width: `${30 + ((i * 37) % 55)}%`,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        ))}
        {/* reflet actuel (miroir) */}
        <div style={{ position: "absolute", left: -120, top: 40, scale: "-1 1", opacity: 0.32 * (1 - morph), filter: "blur(2px)" }}>
          <ProfilePortrait id="refl" width={760} light={0.4} />
        </div>
        {/* version future */}
        <div
          style={{
            position: "absolute",
            left: -120,
            top: 40 - morph * 30,
            scale: "-1 1",
            rotate: `${morph * 3}deg`,
            opacity: morph * 0.95,
          }}
        >
          <FutureSelf p={morph} />
        </div>
        {/* reflet spéculaire */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, transparent ${30 + (t - 34.9) * 4}%, rgba(255,255,255,0.12) ${36 + (t - 34.9) * 4}%, transparent ${44 + (t - 34.9) * 4}%)`,
          }}
        />
      </div>

      {/* Le cadre, gros plan de profil */}
      <div style={{ position: "absolute", left: -330, top: 430 + breathe }}>
        <ProfilePortrait id="exec" width={1000} light={0.8 + 0.2 * Math.sin(t * 3)} />
      </div>

      {/* Questions */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 80,
          right: 280,
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.25,
          color: C.white,
          opacity: ip(t, [36.4, 37.0], [0, 0.9]) * ip(t, [q2 - 0.4, q2], [1, 0]),
          translate: `0px ${ip(t, [q2 - 0.4, q2], [0, -40])}px`,
        }}
      >
        <span style={{ color: C.dim }}>« L'IA va-t-elle</span>
        <br />
        <span style={{ textDecoration: t > 39.4 ? "line-through" : "none", textDecorationColor: C.orange, textDecorationThickness: 5 }}>
          remplacer mon métier ? »
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 410,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: ip(t, [q2, q2 + 0.5], [0, 1]),
          translate: `0px ${ip(t, [q2, q2 + 0.6], [40, 0])}px`,
        }}
      >
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 112,
            letterSpacing: -2,
            lineHeight: 1,
            color: C.white,
            textShadow: `0 0 50px ${C.cyan}66`,
          }}
        >
          QUELLE <span style={{ color: C.cyan }}>VALEUR</span>
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 50, color: C.white, marginTop: 14 }}>
          vais-je encore apporter ?
        </div>
      </div>
    </AbsoluteFill>
  );
};
