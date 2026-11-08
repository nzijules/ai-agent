import React from "react";
import { AbsoluteFill } from "remotion";
import { TIKTOK } from "../theme/safeZones";

/**
 * Calque de contrôle (jamais exporté dans la vidéo finale) : simule
 * l'interface TikTok et hachure les zones à éviter pour les éléments clés.
 */
export const TikTokSafeZone: React.FC = () => {
  const hatch = "repeating-linear-gradient(45deg, rgba(255,0,80,0.28) 0 12px, rgba(255,0,80,0.12) 12px 24px)";
  const ui: React.CSSProperties = { position: "absolute", fontFamily: "sans-serif", color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.8)" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: TIKTOK.top, background: hatch }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: TIKTOK.bottom, background: hatch }} />
      <div
        style={{
          position: "absolute",
          right: 0,
          width: TIKTOK.right,
          top: TIKTOK.rightBand.top,
          height: TIKTOK.rightBand.bottom - TIKTOK.rightBand.top,
          background: hatch,
        }}
      />
      <div style={{ ...ui, top: 120, left: 0, right: 0, textAlign: "center", fontSize: 40, fontWeight: 700 }}>
        Suivis&nbsp;&nbsp;&nbsp;&nbsp;<u>Pour toi</u>
      </div>
      {["♥", "💬", "🔖", "↪"].map((g, i) => (
        <div key={g} style={{ ...ui, right: 38, top: 940 + i * 160, fontSize: 70 }}>
          {g}
        </div>
      ))}
      <div style={{ ...ui, right: 30, top: 790, width: 96, height: 96, borderRadius: 48, background: "#ccc", border: "4px solid white" }} />
      <div style={{ ...ui, left: 40, bottom: 250, fontSize: 38, fontWeight: 700 }}>@mtncotedivoire</div>
      <div style={{ ...ui, left: 40, bottom: 190, fontSize: 32 }}>Économise ta data avec ces astuces 📶 #MTN</div>
      <div style={{ ...ui, left: 40, bottom: 140, fontSize: 30 }}>♫ son original</div>
    </AbsoluteFill>
  );
};
