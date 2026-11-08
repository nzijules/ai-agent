import React from "react";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";

type Props = {
  width: number;
  children?: React.ReactNode;
  /** Couleur de fond de l'écran. */
  screen?: string;
  /** Rotation 2.5D (degrés) — appliquée par le parent via perspective. */
  tiltX?: number;
  tiltY?: number;
  /** Heure affichée dans la barre d'état. */
  time?: string;
  style?: React.CSSProperties;
  /** Barre d'état claire (texte blanc) si l'écran est sombre. */
  darkScreen?: boolean;
};

/**
 * Smartphone 3D réutilisable : coque noire à tranche métallique, écran
 * arrondi, îlot caméra, boutons latéraux, reflet vitré. Le contenu de
 * l'écran (children) est une vraie interface animée par la scène.
 */
export const Phone: React.FC<Props> = ({
  width,
  children,
  screen = "#FFFFFF",
  tiltX = 0,
  tiltY = 0,
  time = "14:07",
  style,
  darkScreen = false,
}) => {
  const height = width * 2.06;
  const bezel = width * 0.035;
  const r = width * 0.16;
  const sb = darkScreen ? COLORS.white : COLORS.ui;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        ...style,
      }}
    >
      {/* ombre portée */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: -height * 0.04,
          height: height * 0.08,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(90,60,0,0.45), rgba(90,60,0,0))",
          filter: "blur(10px)",
        }}
      />
      {/* boutons latéraux */}
      {[0.2, 0.3].map((t) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: -width * 0.012,
            top: height * t,
            width: width * 0.02,
            height: height * 0.06,
            borderRadius: 4,
            background: "linear-gradient(90deg,#4a4d55,#1b1c20)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: -width * 0.012,
          top: height * 0.25,
          width: width * 0.02,
          height: height * 0.1,
          borderRadius: 4,
          background: "linear-gradient(270deg,#4a4d55,#1b1c20)",
        }}
      />
      {/* coque */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: "linear-gradient(135deg, #5A5E68 0%, #1A1B1F 18%, #0A0A0C 60%, #3A3D45 100%)",
          boxShadow: `0 ${width * 0.08}px ${width * 0.16}px rgba(80,50,0,0.35), inset 0 0 0 ${width * 0.006}px rgba(255,255,255,0.18)`,
        }}
      />
      {/* écran */}
      <div
        style={{
          position: "absolute",
          inset: bezel,
          borderRadius: r - bezel,
          background: screen,
          overflow: "hidden",
        }}
      >
        {/* barre d'état */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: width * 0.12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${width * 0.09}px`,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: width * 0.042,
            color: sb,
            zIndex: 5,
          }}
        >
          <span>{time}</span>
          <span style={{ display: "flex", gap: width * 0.012, alignItems: "flex-end" }}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ width: width * 0.012, height: width * (0.012 + i * 0.008), background: sb, borderRadius: 2 }} />
            ))}
            <span
              style={{
                marginLeft: width * 0.02,
                width: width * 0.06,
                height: width * 0.03,
                border: `${Math.max(1, width * 0.004)}px solid ${sb}`,
                borderRadius: width * 0.008,
                padding: 1,
              }}
            >
              <span style={{ display: "block", width: "70%", height: "100%", background: sb, borderRadius: 2 }} />
            </span>
          </span>
        </div>
        {children}
      </div>
      {/* îlot caméra */}
      <div
        style={{
          position: "absolute",
          top: bezel + width * 0.03,
          left: "50%",
          width: width * 0.26,
          height: width * 0.07,
          marginLeft: -width * 0.13,
          borderRadius: width * 0.05,
          background: "#050505",
          zIndex: 6,
        }}
      />
      {/* reflet vitré */}
      <div
        style={{
          position: "absolute",
          inset: bezel,
          borderRadius: r - bezel,
          background: "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)",
          pointerEvents: "none",
          zIndex: 7,
        }}
      />
    </div>
  );
};
