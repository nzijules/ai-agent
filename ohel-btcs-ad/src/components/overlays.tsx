import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { SOUS_TITRES } from "../config/script";
import { useLayout } from "./anim";

/** Sous-titres incrustés (version sous-titrée), dans la zone de sécurité basse. */
export const SousTitres: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, safe, W } = useLayout();
  const cue = SOUS_TITRES.find((c) => frame >= c.de && frame < c.a);
  if (!cue) return null;
  const p = Math.min(1, (frame - cue.de) / 4);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: vertical ? safe.bottom - 150 : 60,
        paddingLeft: safe.left,
        paddingRight: vertical ? safe.right : safe.left,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: vertical ? W - safe.left - safe.right : 1400,
          fontFamily: FONT,
          fontSize: vertical ? 46 : 44,
          fontWeight: 600,
          lineHeight: 1.25,
          color: COLORS.blancCasse,
          background: "rgba(20,20,22,0.82)",
          padding: "10px 22px 12px",
          textAlign: "center",
          opacity: p,
          boxDecorationBreak: "clone",
        }}
      >
        {cue.texte}
      </div>
    </AbsoluteFill>
  );
};

/** Repères des zones masquées par les interfaces des réseaux sociaux. */
export const ZonesSecurite: React.FC = () => {
  const { safe, W, H } = useLayout();
  const zone = (s: React.CSSProperties) => (
    <div style={{ position: "absolute", background: "rgba(255,0,60,0.18)", ...s }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {zone({ left: 0, top: 0, width: W, height: safe.top })}
      {zone({ left: 0, bottom: 0, width: W, height: safe.bottom })}
      {zone({ right: 0, top: safe.top, width: safe.right, height: H - safe.top - safe.bottom })}
      {zone({ left: 0, top: safe.top, width: safe.left, height: H - safe.top - safe.bottom })}
    </AbsoluteFill>
  );
};

/** Bandeau « maquette » : rappelle qu'il ne s'agit pas de la version finale. */
export const BandeauMaquette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 24,
      left: 24,
      fontFamily: FONT,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 3,
      color: COLORS.blancCasse,
      background: "rgba(200,30,40,0.85)",
      padding: "6px 14px",
    }}
  >
    MAQUETTE · NON FINALE
  </div>
);
