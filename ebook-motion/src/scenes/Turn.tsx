import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, usePop } from "../components/anim";
import { C, display, gradText } from "../theme";

// 48s – 52s : "Et maintenant… c'est ton tour."  (breakdown + riser, drop at 52s)
export const Turn: React.FC = () => {
  const f = useCurrentFrame();
  const a = usePop(4);
  const text = "C'EST TON TOUR.";
  const zoom = interpolate(f, [0, 120], [1, 1.25]);
  const flash = interpolate(f, [110, 120], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(62,230,255,${0.15 + 0.1 * Math.sin(f / 4)}), transparent 55%)`,
        }}
      />
      <div style={{ transform: `scale(${zoom})`, textAlign: "center" }}>
        <div style={{ ...a, fontFamily: display, fontWeight: 600, fontSize: 70, color: C.soft }}>Et maintenant…</div>
        <div style={{ marginTop: 30, fontFamily: display, fontWeight: 900, fontSize: 132, lineHeight: 1.05, width: 900 }}>
          {text.split("").map((ch, i) => {
            const at = 34 + i * 3;
            if (ch === " " && i === 9) return <br key={i} />;
            const p = interpolate(f, [at, at + 8], [0, 1], clamp);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 60}px)`,
                  whiteSpace: "pre",
                  ...gradText(C.white, C.cyan),
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      </div>
      <AbsoluteFill style={{ background: C.white, opacity: flash }} />
    </AbsoluteFill>
  );
};
