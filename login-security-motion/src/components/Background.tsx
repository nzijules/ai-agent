import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Light, slowly drifting grid + soft brand-blue glows. */
export const Background: React.FC<{ tint?: string }> = ({ tint = C.blue }) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.35;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.line} 1.5px, transparent 1.5px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `0 ${drift}px`,
          opacity: 0.55,
          maskImage:
            "radial-gradient(ellipse at 50% 45%, black 30%, transparent 80%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -300 + Math.sin(frame / 60) * 40,
          top: -250 + Math.cos(frame / 70) * 40,
          background: `radial-gradient(circle, ${tint}22 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          right: -380 + Math.cos(frame / 55) * 50,
          bottom: -300 + Math.sin(frame / 65) * 50,
          background: `radial-gradient(circle, ${C.blueLight}1F 0%, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};
