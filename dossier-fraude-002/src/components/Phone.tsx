import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { noise } from "../anim";

export const PHONE_W = 560;
export const PHONE_H = 1140;

/**
 * Smartphone Android générique (aucune marque).
 * `vibrate` : 0..1 intensité de vibration physique.
 * `screenOn` : 0..1 allumage progressif de l'écran.
 */
export const Phone: React.FC<{
  children?: React.ReactNode;
  vibrate?: number;
  screenOn?: number;
  style?: React.CSSProperties;
  glare?: boolean;
}> = ({ children, vibrate = 0, screenOn = 1, style, glare = true }) => {
  const f = useCurrentFrame();
  const vx = vibrate ? (noise(f * 2.3, 11) - 0.5) * 22 * vibrate : 0;
  const vr = vibrate ? (noise(f * 2.1, 5) - 0.5) * 3.2 * vibrate : 0;
  return (
    <div
      style={{
        position: "absolute",
        width: PHONE_W,
        height: PHONE_H,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${vx}px) rotate(${vr}deg)`,
        }}
      >
        {/* boutons latéraux */}
        <div style={{ position: "absolute", right: -7, top: 230, width: 8, height: 120, borderRadius: 4, background: "#2a2a2a" }} />
        <div style={{ position: "absolute", right: -7, top: 380, width: 8, height: 70, borderRadius: 4, background: "#2a2a2a" }} />
        {/* coque */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 72,
            background: "linear-gradient(145deg, #3a3a3a, #0c0c0c 40%, #1d1d1d)",
            boxShadow:
              "0 60px 120px rgba(0,0,0,0.75), 0 0 0 2px #444 inset, 0 0 0 1px #000, 0 0 80px rgba(255,203,5,0.08)",
          }}
        />
        {/* écran */}
        <div
          style={{
            position: "absolute",
            inset: 16,
            borderRadius: 58,
            overflow: "hidden",
            background: "#050505",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: screenOn, filter: `brightness(${0.4 + screenOn * 0.6})` }}>
            {children}
          </div>
          {/* barre d'état */}
          <div
            style={{
              position: "absolute",
              top: 22,
              left: 44,
              right: 44,
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(255,255,255,0.85)",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 24,
              opacity: screenOn,
            }}
          >
            <span>19:02</span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
                {[8, 12, 16, 20].map((h) => (
                  <span key={h} style={{ width: 5, height: h, background: "rgba(255,255,255,0.85)", borderRadius: 1 }} />
                ))}
              </span>
              <span style={{ width: 38, height: 18, border: "2px solid rgba(255,255,255,0.85)", borderRadius: 5, padding: 2 }}>
                <span style={{ display: "block", width: "70%", height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: 2 }} />
              </span>
            </span>
          </div>
          {/* caméra perforée */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: "50%",
              width: 28,
              height: 28,
              marginLeft: -14,
              borderRadius: 14,
              background: "#000",
              boxShadow: "0 0 0 3px #111",
            }}
          />
          {glare && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05) 100%)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/** Étiquette obligatoire sur toute interface simulée. */
export const SimTag: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "6px 14px",
      borderRadius: 8,
      border: "2px dashed rgba(255,203,5,0.75)",
      color: C.yellow,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 18,
      letterSpacing: 3,
      whiteSpace: "nowrap",
      background: "rgba(0,0,0,0.5)",
      ...style,
    }}
  >
    INTERFACE FICTIVE · SIMULATION
  </div>
);
