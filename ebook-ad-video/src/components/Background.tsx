import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Soft animated background: gradient + drifting blurred blobs (parallax) + dotted grid. */
export const Background: React.FC<{ variant: "light" | "navy" | "cream"; accent?: string }> = ({ variant, accent }) => {
  const f = useCurrentFrame();
  const base =
    variant === "navy"
      ? `radial-gradient(120% 80% at 50% 0%, ${C.navy2} 0%, ${C.navy} 60%, #07122A 100%)`
      : variant === "cream"
        ? `linear-gradient(180deg, ${C.cream} 0%, #F3EEE4 100%)`
        : `linear-gradient(180deg, #FFFFFF 0%, #F2F5FB 100%)`;
  const dot = variant === "navy" ? "rgba(255,255,255,0.07)" : "rgba(11,27,58,0.06)";
  const blobs = [
    { x: 15, y: 18, r: 520, c: accent ?? (variant === "navy" ? C.blue : C.blueSoft), sp: 0.6, o: variant === "navy" ? 0.35 : 0.8 },
    { x: 85, y: 70, r: 600, c: variant === "navy" ? "#1C3D8F" : C.yellowSoft, sp: -0.45, o: variant === "navy" ? 0.45 : 0.9 },
    { x: 70, y: 8, r: 380, c: variant === "navy" ? C.yellow : C.greenSoft, sp: 0.3, o: variant === "navy" ? 0.12 : 0.55 },
  ];
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.r,
            height: b.r,
            marginLeft: -b.r / 2,
            marginTop: -b.r / 2,
            borderRadius: "50%",
            background: b.c,
            opacity: b.o,
            filter: "blur(90px)",
            translate: `${Math.sin(f / 70 + i) * 60 * b.sp}px ${Math.cos(f / 85 + i * 2) * 50 * b.sp}px`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dot} 2px, transparent 2.5px)`,
          backgroundSize: "36px 36px",
          backgroundPosition: `0px ${(-f * 0.4) % 36}px`,
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.2))",
        }}
      />
    </AbsoluteFill>
  );
};
