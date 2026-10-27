import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { MEDIA } from "../config/assets";
import { ECRAN } from "../config/script";
import { EASE_IN_OUT, prog, useLayout } from "../components/anim";
import { texture } from "../components/textures";
import { Chapitre, Reveal, Trame } from "../components/ui";

/** D — Mélange : trois apports convergent, la matière devient homogène. */
const FLUX = [
  { kind: "laterite" as const, angle: -150, de: 0.3, epaisseur: 64 },
  { kind: "sable" as const, angle: -90, de: 0.6, epaisseur: 40 },
  { kind: "ciment" as const, angle: -30, de: 0.9, epaisseur: 26 },
];

export const SceneD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe, W, H } = useLayout();
  const t = ECRAN.D;

  const R = vertical ? 330 : 300;
  const cx = vertical ? W / 2 : W * 0.68;
  const cy = vertical ? safe.top + 330 + R : H / 2 + 20;
  const homogene = prog(frame, fps, 1.6, 3.8, EASE_IN_OUT);
  // La rotation ralentit à mesure que le mélange s'homogénéise.
  const angle = frame * (2.4 - 1.6 * homogene);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: COLORS.blancCasse }}>
      <Trame />
      <Chapitre numero={2} titre={t.chapitre} />

      {/* Trajectoires d'apport : courtes, rectilignes, contrôlées */}
      {FLUX.map((f, i) => {
        const p = prog(frame, fps, f.de, 0.9, EASE_IN_OUT);
        const fin = prog(frame, fps, f.de + 1.1, 0.5);
        const L = R * 1.15;
        const rad = (f.angle * Math.PI) / 180;
        return (
          <div
            key={f.kind}
            style={{
              position: "absolute",
              left: cx + Math.cos(rad) * (R + L) ,
              top: cy + Math.sin(rad) * (R + L) - f.epaisseur / 2,
              width: L * p * (1 - fin) + 0.01,
              height: f.epaisseur,
              transformOrigin: "0 50%",
              transform: `rotate(${f.angle + 180}deg) translateX(${L * fin}px)`,
              backgroundImage: texture(f.kind, 3 + i, 200),
              backgroundPositionX: `${frame * 14}px`,
            }}
          />
        );
      })}

      {/* Cuve de malaxage */}
      <div
        style={{
          position: "absolute",
          left: cx - R - 14,
          top: cy - R - 14,
          width: 2 * R + 28,
          height: 2 * R + 28,
          borderRadius: "50%",
          border: `14px solid #50565E`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
          background: COLORS.anthraciteClair,
        }}
      >
        {MEDIA.melange.src ? (
          <Img src={staticFile(MEDIA.melange.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${angle}deg)` }}>
            {/* Trois matières distinctes au départ */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: texture("laterite", 4, 300) }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: texture("sable", 5, 300),
                clipPath: "polygon(50% 50%, 100% 0, 100% 62%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: texture("ciment", 6, 300),
                clipPath: "polygon(50% 50%, 0 100%, 38% 100%)",
              }}
            />
            {/* Mélange homogène */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: texture("melange", 7, 300), opacity: homogene }} />
          </div>
        )}
        {/* Pales du malaxeur */}
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${angle * 1.6}deg)` }}>
          <div style={{ position: "absolute", left: "50%", top: 0, width: 18, height: "100%", marginLeft: -9, background: "rgba(70,75,82,0.85)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, height: 18, width: "100%", marginTop: -9, background: "rgba(70,75,82,0.85)" }} />
        </div>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 70, height: 70, margin: -35, borderRadius: "50%", background: "#6A717A" }} />
      </div>

      {/* Titre */}
      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? cy + R + 70 : safe.top + 260,
          maxWidth: vertical ? W - safe.left - safe.right : 760,
        }}
      >
        <Reveal de={3.8}>
          <div style={{ fontSize: vertical ? 88 : 84, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            {t.titre.split(" ").slice(0, 1).join(" ")}{" "}
            <span style={{ color: COLORS.lateriteClair }}>{t.titre.split(" ").slice(1).join(" ")}</span>
          </div>
        </Reveal>
        <Reveal de={4.6}>
          <div style={{ fontSize: vertical ? 40 : 38, fontWeight: 500, opacity: 0.8, marginTop: 18 }}>{t.sous}</div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
