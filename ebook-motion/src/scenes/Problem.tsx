import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { CameraIcon, CodeIcon, PaletteIcon, StrikeX } from "../components/Icons";
import { C, display, gradText } from "../theme";

// 5s – 11s : "Pas de caméra. Pas de design. Pas de code. Tu penses que c'est impossible ? Détrompe-toi."
const items = [
  { label: "Pas de caméra", Icon: CameraIcon, at: 6 },
  { label: "Pas de design", Icon: PaletteIcon, at: 40 },
  { label: "Pas de code", Icon: CodeIcon, at: 79 },
];

const Item: React.FC<{ label: string; Icon: React.FC<{ size?: number }>; at: number }> = ({ label, Icon, at }) => {
  const f = useCurrentFrame();
  const s = usePop(at, 80);
  const strike = interpolate(f, [at + 10, at + 22], [0, 1], clamp);
  return (
    <div
      style={{
        ...s,
        display: "flex",
        alignItems: "center",
        gap: 44,
        width: 860,
        padding: "34px 44px",
        borderRadius: 36,
        background: "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))",
        border: "2px solid rgba(255,255,255,0.14)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 5 }}>
          <Icon size={120} />
        </div>
        <StrikeX progress={strike} size={130} />
      </div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 68, color: C.white }}>{label}</div>
    </div>
  );
};

export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [110, 122], [1, 0], clamp);
  const imp = useSpring(118, { damping: 10 });
  const glitch = f > 118 && f < 170 && f % 4 < 2 ? 10 : 0;
  const swap = useSpring(172, { damping: 12 });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 44,
          opacity: out,
          transform: `scale(${0.9 + out * 0.1})`,
        }}
      >
        {items.map((it) => (
          <Item key={it.label} {...it} />
        ))}
      </div>

      {f > 116 && (
        <div style={{ position: "absolute", textAlign: "center" }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 900,
              fontSize: 128,
              color: C.white,
              opacity: interpolate(imp, [0, 0.3], [0, 1], clamp) * (1 - swap),
              transform: `scale(${imp * (1 - swap * 0.3)}) translateY(${-swap * 140}px)`,
              textShadow: `${glitch}px 0 0 ${C.red}, ${-glitch}px 0 0 ${C.cyan}`,
            }}
          >
            IMPOSSIBLE ?
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              whiteSpace: "nowrap",
              fontFamily: display,
              fontWeight: 900,
              fontSize: 118,
              opacity: swap,
              transform: `translateX(-50%) scale(${0.5 + swap * 0.5})`,
              filter: "drop-shadow(0 0 40px rgba(255,204,0,0.6))",
              ...gradText(),
            }}
          >
            DÉTROMPE-TOI.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
