import React from "react";
import { C, F } from "../theme";
import { Cover, COVER_H, COVER_W } from "./Cover";
import cfg from "../ad.config.json";

/**
 * Pseudo-3D hardcover book (CSS 3D): front cover + spine + page block + soft shadow.
 * rotY in degrees (negative shows the spine on the left), rotX for slight tilt.
 */
export const Book3D: React.FC<{ width: number; rotY?: number; rotX?: number; shine?: number; shadow?: boolean }> = ({
  width,
  rotY = -22,
  rotX = 4,
  shine = 0,
  shadow = true,
}) => {
  const h = (width * COVER_H) / COVER_W;
  const depth = width * 0.11;
  return (
    <div style={{ width, height: h, perspective: width * 4, position: "relative" }}>
      {shadow && (
        <div
          style={{
            position: "absolute",
            left: width * 0.05,
            right: -width * 0.05,
            bottom: -h * 0.06,
            height: h * 0.08,
            background: "radial-gradient(closest-side, rgba(0,0,0,0.38), rgba(0,0,0,0))",
            filter: "blur(6px)",
            translate: `${-rotY * 0.6}px 0px`,
          }}
        />
      )}
      <div
        style={{
          width,
          height: h,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {/* front */}
        <div style={{ position: "absolute", inset: 0, transform: `translateZ(${depth / 2}px)`, borderRadius: "2px 6px 6px 2px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.25)" }}>
          <Cover width={width} />
          {/* spine crease + light */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(255,255,255,0.25) 2.2%, rgba(0,0,0,0.06) 4%, rgba(0,0,0,0) 7%)" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${shine * 140 - 40}%, rgba(255,255,255,0.45) ${shine * 140 - 25}%, rgba(255,255,255,0) ${shine * 140 - 10}%)`,
            }}
          />
        </div>
        {/* spine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: depth,
            height: h,
            background: `linear-gradient(90deg, #091431, ${C.navy} 40%, #18306A)`,
            transform: `translateX(${-depth / 2}px) rotateY(-90deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ writingMode: "vertical-rl", color: "#fff", fontFamily: F.display, fontWeight: 800, fontSize: depth * 0.36, letterSpacing: 1, whiteSpace: "nowrap" }}>
            APPRENDRE À APPRENDRE <span style={{ color: "#4BD39A" }}>AVEC CHATGPT</span> · {cfg.author}
          </div>
        </div>
        {/* pages */}
        <div
          style={{
            position: "absolute",
            top: h * 0.012,
            right: 0,
            width: depth * 0.94,
            height: h * 0.976,
            background: "repeating-linear-gradient(90deg, #f4f1ea 0px, #f4f1ea 2px, #dcd6ca 3px)",
            transform: `translateX(${depth * 0.47}px) rotateY(90deg)`,
          }}
        />
        {/* back */}
        <div style={{ position: "absolute", inset: 0, background: C.navy, transform: `translateZ(${-depth / 2}px) rotateY(180deg)` }} />
      </div>
    </div>
  );
};
