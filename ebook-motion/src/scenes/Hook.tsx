import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { FaceIcon, StrikeX } from "../components/Icons";
import { C, display, gradText } from "../theme";

// 0s – 5s : "Et si tu pouvais vendre des ebooks… sans montrer ton visage, et sans aucune compétence ?"
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const w1 = usePop(2);
  const w2 = useSpring(10, { damping: 9 });
  const lift = useSpring(48, { damping: 18 });
  const face = usePop(52);
  const strike = interpolate(f, [62, 80], [0, 1], clamp);
  const t2 = usePop(66);
  const stamp = useSpring(112, { damping: 11, stiffness: 220 });
  const shake = f > 112 && f < 124 ? Math.sin(f * 3) * (124 - f) * 1.4 : 0;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${shake}px)` }}>
      <div
        style={{
          position: "absolute",
          top: interpolate(lift, [0, 1], [640, 330]),
          width: "100%",
          textAlign: "center",
          transform: `scale(${interpolate(lift, [0, 1], [1, 0.72])})`,
        }}
      >
        <div style={{ ...w1, fontFamily: display, fontWeight: 800, fontSize: 84, color: C.white, letterSpacing: 2 }}>
          VENDRE DES
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 210,
            lineHeight: 1,
            transform: `scale(${w2})`,
            filter: `drop-shadow(0 0 40px rgba(10,132,255,0.8))`,
            ...gradText(),
          }}
        >
          EBOOKS
        </div>
      </div>

      <div style={{ position: "absolute", top: 800, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div
          style={{
            ...face,
            position: "relative",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "3px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaceIcon size={180} />
          <StrikeX progress={strike} size={260} />
        </div>
        <div style={{ ...t2, fontFamily: display, fontWeight: 800, fontSize: 72, color: C.white, textAlign: "center", lineHeight: 1.1 }}>
          SANS MONTRER
          <br />
          TON VISAGE
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1480,
          opacity: interpolate(stamp, [0, 0.2], [0, 1], clamp),
          transform: `scale(${interpolate(stamp, [0, 1], [3, 1])}) rotate(-6deg)`,
          padding: "18px 40px",
          border: `8px solid ${C.cyan}`,
          borderRadius: 24,
          fontFamily: display,
          fontWeight: 900,
          fontSize: 92,
          color: C.cyan,
          letterSpacing: 2,
          textShadow: `0 0 30px ${C.cyan}`,
          boxShadow: `0 0 40px rgba(62,230,255,0.5), inset 0 0 30px rgba(62,230,255,0.3)`,
        }}
      >
        0 COMPÉTENCE
      </div>
    </AbsoluteFill>
  );
};
