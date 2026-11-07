import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop } from "../components/Common";
import { C, CUES, F, ease, ip, scene, useT } from "../lib/theme";

/** Appel à l'action : « Besoin d'une formation d'initiation ? Contactez AROSOFT. » */
export const S11Contact: React.FC = () => {
  const t = useT();
  const s = scene(11).start;
  const c = CUES.ctaContact;
  const line = (at: number) => ip(t, [at, at + 0.55], [0, 1], ease.out);
  const logoIn = ip(t, [c - 0.2, c + 0.7], [0, 1], ease.out);
  const ring = ip(t, [c, c + 1.2], [0, 1], ease.out);

  const title = (txt: React.ReactNode, at: number, size: number, color: string = C.white) => (
    <div style={{ overflow: "hidden", paddingBottom: 4 }}>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.04,
          letterSpacing: -1.5,
          color,
          whiteSpace: "nowrap",
          translate: `0px ${(1 - line(at)) * 110}%`,
          opacity: line(at),
          textShadow: color === C.cyan ? `0 0 40px ${C.cyan}77` : undefined,
        }}
      >
        {txt}
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop grid={0.3} particles={40} hue={C.blue} intensity={1.2} speed={0.5} />

      {/* Question */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {title("BESOIN D'UNE", s + 0.35, 84)}
        {title("FORMATION", s + 0.55, 124, C.cyan)}
        {title("D'INITIATION ?", s + 0.75, 84)}
      </div>

      {/* Contact : logo */}
      <div
        style={{
          position: "absolute",
          top: 790,
          width: "100%",
          textAlign: "center",
          fontFamily: F.mono,
          fontSize: 38,
          letterSpacing: 14,
          color: C.white,
          opacity: line(c - 0.25),
          translate: `0px ${(1 - line(c - 0.25)) * 20}px`,
        }}
      >
        CONTACTEZ
      </div>
      <div style={{ position: "absolute", left: 540, top: 1030, width: 0, height: 0 }}>
        <svg width="760" height="760" viewBox="-380 -380 760 760" style={{ position: "absolute", left: -380, top: -380 }}>
          <circle r={250 + ring * 60} fill="none" stroke={C.cyan} strokeWidth="2" opacity={(1 - ring) * 0.8 * ip(t, [c - 0.1, c], [0, 1])} />
          <circle
            r="300"
            fill="none"
            stroke={C.blue}
            strokeWidth="3"
            strokeDasharray={`${ring * 1885} 1885`}
            transform="rotate(-90)"
            opacity="0.7"
          />
          <circle r="300" fill="none" stroke={C.cyan} strokeWidth="1.5" strokeDasharray="4 16" opacity={0.5 * ring} transform={`rotate(${t * 12})`} />
        </svg>
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            left: -260,
            top: -260,
            borderRadius: 520,
            background: `radial-gradient(circle, ${C.blue}55 0%, transparent 68%)`,
            opacity: logoIn,
          }}
        />
        <Img
          src={staticFile("brand/logo-arosoft.png")}
          style={{
            position: "absolute",
            width: 460,
            left: -230,
            top: -165,
            opacity: logoIn,
            scale: `${0.8 + 0.2 * logoIn}`,
            filter: `blur(${(1 - logoIn) * 14}px) drop-shadow(0 0 30px ${C.blue}88)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
