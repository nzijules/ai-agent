import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { ECRAN } from "../config/script";
import { EASE_IN, prog, useLayout } from "../components/anim";
import { BlockFace } from "../components/Block";
import { Reveal } from "../components/ui";

/** B — Identification : BTCS, développé, puis OHEL International. */
export const SceneB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe, W } = useLayout();
  const t = ECRAN.B;
  const lettres = t.sigle.split("");
  // Une lettre par bloc, synchronisée sur « B – T – C – S ».
  const departs = [0.6, 0.92, 1.24, 1.56];
  const cellW = vertical ? 214 : 250;
  const cellH = cellW / 1.05;
  const bande = prog(frame, fps, 5.6, 0.6);

  return (
    <AbsoluteFill style={{ background: COLORS.blancCasse, fontFamily: FONT, color: COLORS.anthracite }}>
      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? safe.top + 20 : safe.top + 40,
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          gap: vertical ? 56 : 90,
          alignItems: vertical ? "flex-start" : "center",
        }}
      >
        {/* Sigle : quatre blocs posés l'un après l'autre */}
        <div style={{ display: "flex", gap: 10 }}>
          {lettres.map((l, i) => {
            const p = prog(frame, fps, departs[i], 0.32, EASE_IN);
            return (
              <div key={l} style={{ position: "relative", transform: `translateY(${(1 - p) * -420}px)`, opacity: p > 0 ? 1 : 0 }}>
                <BlockFace w={cellW} h={cellH} seed={i + 4} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.blancCasse,
                    fontSize: cellH * 0.78,
                    fontWeight: 800,
                    textShadow: "0 3px 0 rgba(0,0,0,0.18)",
                  }}
                >
                  {l}
                </div>
              </div>
            );
          })}
        </div>

        {/* Développé : initiales en ocre */}
        <div style={{ fontSize: vertical ? 74 : 64, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1 }}>
          {t.developpe.map((ligne, i) => (
            <Reveal key={ligne} de={2.6 + i * 0.28}>
              <span style={{ color: COLORS.laterite }}>{ligne.slice(0, 1)}</span>
              {ligne.slice(1)}
            </Reveal>
          ))}
        </div>
      </div>

      {/* Bande OHEL International */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          bottom: vertical ? safe.bottom + 250 : safe.bottom - 40,
          height: vertical ? 330 : 260,
          background: COLORS.anthracite,
          clipPath: `inset(0 ${(1 - bande) * 100}% 0 0)`,
          color: COLORS.blancCasse,
          paddingLeft: safe.left,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <Reveal de={5.9}>
          <div style={{ fontSize: vertical ? 70 : 64, fontWeight: 800, letterSpacing: -1 }}>OHEL International</div>
        </Reveal>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {[t.activite1, t.activite2].map((a, i) => (
            <Reveal key={a} de={6.4 + i * 0.25} direction="gauche">
              <div
                style={{
                  fontSize: vertical ? 38 : 36,
                  fontWeight: 700,
                  padding: "8px 18px",
                  background: COLORS.laterite,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {a}
              </div>
            </Reveal>
          ))}
          <Reveal de={7.0} direction="gauche">
            <div style={{ fontSize: vertical ? 40 : 38, fontWeight: 500 }}>{t.lieu}</div>
          </Reveal>
        </div>
      </div>
    </AbsoluteFill>
  );
};
