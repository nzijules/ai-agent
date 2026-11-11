import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "./theme";

/* Real 3D book: front cover, spine, back cover and page edges. */
export const Book3D: React.FC<{
  width: number;
  rotY: number;
  rotX?: number;
  style?: React.CSSProperties;
}> = ({ width, rotY, rotX = 0, style }) => {
  const k = width / 420;
  const W = 420 * k;
  const H = 640 * k;
  const D = 64 * k;
  const face: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    display: "block",
    backfaceVisibility: "hidden",
  };
  const pages =
    "repeating-linear-gradient(90deg, #f4f1ea 0px, #f4f1ea 2px, #d9d4c7 3px, #f4f1ea 4px)";
  const R = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  const { filter: _f, ...outer } = style ?? {};
  void _f;
  return (
    <div style={{ position: "relative", textAlign: "left", ...outer }}>
      <div
        style={{
          position: "absolute",
          left: W * 0.08,
          right: W * 0.08,
          bottom: -H * 0.06,
          height: H * 0.06,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.55)",
          filter: `blur(${18 * k}px)`,
        }}
      />
    <div style={{ perspective: 2200 * k }}>
      <div style={{ position: "relative", width: W, height: H }}>
        {/* front */}
        <Img
          src={staticFile("book-front.png")}
          style={{
            ...face,
            width: W,
            height: H,
            borderRadius: `${4 * k}px ${10 * k}px ${10 * k}px ${4 * k}px`,
            transform: `${R} translateZ(${D / 2}px)`,
            boxShadow: "inset 6px 0 12px rgba(0,0,0,0.25)",
          }}
        />
        {/* back */}
        <div
          style={{
            ...face,
            width: W,
            height: H,
            borderRadius: `${10 * k}px ${4 * k}px ${4 * k}px ${10 * k}px`,
            transform: `${R} rotateY(180deg) translateZ(${D / 2}px)`,
            background: `linear-gradient(160deg, #0B1E8C, ${C.navy})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 26 * k,
            fontFamily: FONT,
            color: "#fff",
            textAlign: "center",
            padding: 40 * k,
            boxSizing: "border-box",
          }}
        >
          <Img src={staticFile("logo-arosoft.png")} style={{ width: 200 * k }} />
          <div style={{ fontSize: 40 * k, fontWeight: 900, lineHeight: 1.15 }}>
            Vibe Motion <span style={{ color: C.yellow }}>Design</span>
          </div>
          <div style={{ fontSize: 24 * k, fontWeight: 600, color: C.muted, lineHeight: 1.35 }}>
            Du script à ta première vidéo animée avec Claude Code
          </div>
          <div
            style={{
              marginTop: 10 * k,
              width: 120 * k,
              height: 6 * k,
              borderRadius: 3 * k,
              background: C.yellow,
            }}
          />
        </div>
        {/* spine (left) */}
        <Img
          src={staticFile("book-spine.png")}
          style={{
            ...face,
            width: D,
            height: H,
            left: (W - D) / 2,
            transform: `${R} rotateY(-90deg) translateZ(${W / 2}px)`,
          }}
        />
        {/* page edges (right) */}
        <div
          style={{
            ...face,
            width: D * 0.92,
            height: H * 0.97,
            top: H * 0.015,
            left: (W - D * 0.92) / 2,
            transform: `${R} rotateY(90deg) translateZ(${W / 2 - 3 * k}px)`,
            background: pages,
          }}
        />
        {/* top pages */}
        <div
          style={{
            ...face,
            width: W * 0.98,
            height: D * 0.92,
            left: 0,
            top: (H - D * 0.92) / 2,
            transform: `${R} rotateX(90deg) translateZ(${H / 2 - 3 * k}px)`,
            background: pages.replace("90deg", "0deg"),
          }}
        />
        {/* bottom pages */}
        <div
          style={{
            ...face,
            width: W * 0.98,
            height: D * 0.92,
            left: 0,
            top: (H - D * 0.92) / 2,
            transform: `${R} rotateX(-90deg) translateZ(${H / 2 - 3 * k}px)`,
            background: pages.replace("90deg", "0deg"),
          }}
        />
      </div>
    </div>
    </div>
  );
};
