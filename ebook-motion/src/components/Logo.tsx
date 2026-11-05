import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useSpring } from "./anim";

export const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(6, { damping: 12 });
  const shine = interpolate((f % 150) / 150, [0, 0.35], [-120, 420], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        right: 56,
        width: 250,
        padding: "16px 18px",
        borderRadius: 26,
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 12px 40px rgba(0,40,160,0.45), 0 0 0 2px rgba(62,230,255,0.35)",
        transform: `scale(${p}) translateY(${(1 - p) * -40}px)`,
        transformOrigin: "top right",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      <Img src={staticFile("arosoft-logo.png")} style={{ width: "100%", display: "block" }} />
      <div
        style={{
          position: "absolute",
          top: -40,
          bottom: -40,
          left: shine,
          width: 60,
          transform: "rotate(20deg)",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
        }}
      />
    </div>
  );
};
