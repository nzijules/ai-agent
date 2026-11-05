import React from "react";
import { Img, staticFile } from "remotion";
import { useSpring } from "./anim";

/** AROSOFT logo (transparent, white-lettered version for dark backgrounds) — top right. */
export const Logo: React.FC = () => {
  const p = useSpring(6, { damping: 12 });
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 56,
        width: 270,
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
        transform: `scale(${p}) translateY(${(1 - p) * -40}px)`,
        transformOrigin: "top right",
        zIndex: 50,
      }}
    >
      <Img src={staticFile("arosoft-logo-white.png")} style={{ width: "100%", display: "block" }} />
    </div>
  );
};
