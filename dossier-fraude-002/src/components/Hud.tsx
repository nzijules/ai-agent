import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip } from "../anim";

const tc = (f: number, fps: number) => {
  const s = Math.floor(f / fps);
  const ff = f % fps;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 60))}:${p(s % 60)}:${p(ff)}`;
};

/** Habillage permanent : identifiant du dossier, REC, timecode et logo MTN miniature en haut à droite. */
export const Hud: React.FC<{ sceneLabel: string }> = ({ sceneLabel }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inO = ip(f, [0, 20], [0, 1]);
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: inO }}>
      {/* coin supérieur gauche */}
      <div style={{ position: "absolute", left: 56, top: 64, fontFamily: MONO, color: C.white }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, letterSpacing: 2 }}>
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: C.red,
              opacity: blink ? 1 : 0.25,
              boxShadow: blink ? "0 0 14px rgba(229,37,42,0.9)" : "none",
            }}
          />
          <span style={{ fontFamily: FONT, fontWeight: 800, letterSpacing: 3 }}>DOSSIER FRAUDE N°002</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 22, color: C.dim, letterSpacing: 2 }}>
          {tc(f, fps)} · {sceneLabel.toUpperCase()}
        </div>
      </div>
      {/* logo MTN miniature (fourni par le client) */}
      <div
        style={{
          position: "absolute",
          right: 52,
          top: 56,
          width: 124,
          height: 96,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,203,5,0.35)",
        }}
      >
        <Img src={staticFile("mtn-logo.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {/* coins de cadrage */}
      {[
        { left: 30, top: 30, r: 0 },
        { right: 30, top: 30, r: 90 },
        { right: 30, bottom: 30, r: 180 },
        { left: 30, bottom: 30, r: 270 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...p,
            width: 40,
            height: 40,
            borderTop: "3px solid rgba(255,203,5,0.6)",
            borderLeft: "3px solid rgba(255,203,5,0.6)",
            transform: `rotate(${p.r}deg)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 52,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        RECONSTITUTION FICTIVE · SIMULATION PÉDAGOGIQUE
      </div>
    </AbsoluteFill>
  );
};
