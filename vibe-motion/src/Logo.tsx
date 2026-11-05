import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "./components";

/** Logo Arosoft permanent en haut à droite (fond transparent) */
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [6, 22], [0, 1], clamp);
  return (
    <Img
      src={staticFile("arosoft-logo.png")}
      style={{
        position: "absolute",
        top: 46,
        right: 46,
        width: 220,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -20}px)`,
        filter: "brightness(1.3) saturate(1.1) drop-shadow(0 4px 14px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(30,100,255,0.35))",
      }}
    />
  );
};
