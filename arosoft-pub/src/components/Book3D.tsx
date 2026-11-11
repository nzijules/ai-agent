import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS } from "../config";

/**
 * Livre 3D construit en CSS (couverture fidèle, dos, tranche des pages).
 * rotY/rotX en degrés ; open = angle d'ouverture de la couverture (0–160).
 */
export const Book3D: React.FC<{
  width: number;
  rotY: number;
  rotX?: number;
  open?: number;
  glow?: number;
  inside?: React.ReactNode;
}> = ({ width, rotY, rotX = 0, open = 0, glow = 1, inside }) => {
  const H = width * (1256 / 800);
  const T = width * 0.11; // épaisseur
  const face: React.CSSProperties = { position: "absolute", left: 0, top: 0, backfaceVisibility: "hidden" };
  return (
    <div style={{ width, height: H, perspective: 1800, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {/* dos de couverture (arrière) */}
        <div style={{ ...face, width, height: H, background: COLORS.night, transform: `translateZ(${-T / 2}px) rotateY(180deg)`, borderRadius: 6 }} />
        {/* tranche des pages (droite) */}
        <div
          style={{
            ...face,
            width: T,
            height: H - 16,
            top: 8,
            left: width - T / 2 - 4,
            transform: `rotateY(90deg)`,
            background: "repeating-linear-gradient(90deg,#f4f6fb 0px,#f4f6fb 2px,#d9deea 3px)",
          }}
        />
        {/* tranche haute */}
        <div
          style={{
            ...face,
            width: width - 10,
            height: T,
            left: 4,
            top: -T / 2,
            transform: `rotateX(90deg)`,
            background: "repeating-linear-gradient(0deg,#f4f6fb 0px,#f4f6fb 2px,#d9deea 3px)",
          }}
        />
        {/* tranche basse */}
        <div
          style={{
            ...face,
            width: width - 10,
            height: T,
            left: 4,
            top: H - T / 2,
            transform: `rotateX(-90deg)`,
            background: "#cfd6e6",
          }}
        />
        {/* dos (reliure) */}
        <Img
          src={staticFile("img/cover_spine.png")}
          style={{ ...face, width: T, height: H, left: -T / 2, transform: `rotateY(-90deg)` }}
        />
        {/* page intérieure (visible quand la couverture s'ouvre) */}
        <div
          style={{
            ...face,
            width: width - 6,
            height: H - 8,
            top: 4,
            transform: `translateZ(${T / 2 - 2}px)`,
            background: "linear-gradient(90deg,#e7ebf4 0%,#ffffff 8%,#ffffff 100%)",
            borderRadius: "0 6px 6px 0",
            overflow: "hidden",
          }}
        >
          {inside}
        </div>
        {/* couverture avant (charnière à gauche) */}
        <div
          style={{
            position: "absolute",
            width,
            height: H,
            transformStyle: "preserve-3d",
            transformOrigin: "0% 50%",
            transform: `translateZ(${T / 2}px) rotateY(${-open}deg)`,
          }}
        >
          <Img
            src={staticFile("img/cover_front.png")}
            style={{ ...face, width, height: H, borderRadius: "2px 6px 6px 2px" }}
          />
          {/* reflet spéculaire */}
          <div
            style={{
              ...face,
              width,
              height: H,
              borderRadius: "2px 6px 6px 2px",
              background: `linear-gradient(${115 + rotY}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${0.22 * glow}) 45%, rgba(255,255,255,0) 60%)`,
            }}
          />
          {/* intérieur de couverture */}
          <div
            style={{
              ...face,
              width,
              height: H,
              transform: "rotateY(180deg)",
              background: `linear-gradient(135deg, ${COLORS.electric}, ${COLORS.night})`,
              borderRadius: 6,
            }}
          />
        </div>
      </div>
    </div>
  );
};
