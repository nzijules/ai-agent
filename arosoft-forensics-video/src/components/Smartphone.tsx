import React from "react";
import { C } from "../theme";

/**
 * Smartphone moderne générique (aucune marque) : châssis métallique,
 * îlot caméra, écran OLED, reflet de verre mobile (`glare` 0→1).
 */
export const Smartphone: React.FC<{
  width?: number;
  children?: React.ReactNode;
  glare?: number;
  screenGlow?: number;
  style?: React.CSSProperties;
}> = ({ width = 520, children, glare = 0.3, screenGlow = 1, style }) => {
  const height = width * 2.08;
  const r = width * 0.145;
  const bezel = width * 0.028;
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {/* lueur d'écran projetée */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          borderRadius: r + 60,
          background: `radial-gradient(closest-side, ${C.blue}40, transparent)`,
          opacity: 0.6 * screenGlow,
          filter: "blur(30px)",
        }}
      />
      {/* châssis */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: "linear-gradient(145deg, #3A4558 0%, #121821 30%, #1E2633 60%, #4A5568 100%)",
          boxShadow: "0 60px 120px rgba(0,0,0,0.65), inset 0 0 0 1.5px rgba(255,255,255,0.12)",
        }}
      />
      {/* boutons latéraux */}
      <div style={{ position: "absolute", right: -5, top: height * 0.24, width: 6, height: height * 0.1, borderRadius: 3, background: "#2A3342" }} />
      <div style={{ position: "absolute", left: -5, top: height * 0.2, width: 6, height: height * 0.06, borderRadius: 3, background: "#2A3342" }} />
      <div style={{ position: "absolute", left: -5, top: height * 0.29, width: 6, height: height * 0.06, borderRadius: 3, background: "#2A3342" }} />
      {/* écran */}
      <div
        style={{
          position: "absolute",
          inset: bezel,
          borderRadius: r - bezel,
          overflow: "hidden",
          background: "#05080E",
        }}
      >
        {children}
        {/* îlot caméra */}
        <div
          style={{
            position: "absolute",
            top: width * 0.04,
            left: "50%",
            translate: "-50% 0",
            width: width * 0.3,
            height: width * 0.068,
            borderRadius: 999,
            background: "#000",
          }}
        />
        {/* reflet de verre */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, transparent ${glare * 100 - 25}%, rgba(255,255,255,0.10) ${glare * 100 - 8}%, rgba(255,255,255,0.02) ${glare * 100}%, transparent ${glare * 100 + 6}%)`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
