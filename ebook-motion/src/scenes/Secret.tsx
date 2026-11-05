import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { PlayIcon } from "../components/Icons";
import { C, body, display, gradText } from "../theme";

// 11s – 18s : "Le secret ? Le Vibe Motion Design : des vidéos animées qui captent l'attention et vendent pour toi."
const Word: React.FC<{ text: string; delay: number; size: number }> = ({ text, delay, size }) => {
  const p = useSpring(delay, { damping: 10, stiffness: 180 });
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.95,
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
        transform: `translateY(${(1 - p) * -200}px) scale(${interpolate(p, [0, 1], [1.8, 1])})`,
        filter: "drop-shadow(0 0 30px rgba(10,132,255,0.7))",
        ...gradText(C.white, C.cyan),
      }}
    >
      {text}
    </div>
  );
};

const MiniVideo: React.FC = () => {
  const f = useCurrentFrame();
  const views = Math.round(interpolate(f, [80, 200], [0, 1200000], clamp));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 40, background: "#071338" }}>
      {[0, 1, 2, 3].map((i) => {
        const a = f * 2 + i * 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 170 + Math.cos((a * Math.PI) / 180) * 90 - 50,
              top: 260 + Math.sin((a * Math.PI) / 180) * 120 - 50,
              width: 100,
              height: 100,
              borderRadius: i % 2 ? "50%" : 24,
              background: [C.cyan, C.blue, "#6B7CFF", C.gold][i],
              transform: `rotate(${f * 3 + i * 40}deg)`,
              opacity: 0.85,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 220,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${1 + Math.sin(f / 6) * 0.08})`,
        }}
      >
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 8 }}>
          <PlayIcon size={48} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 24, bottom: 30, fontFamily: body, fontWeight: 700, fontSize: 30, color: C.white }}>
        {views.toLocaleString("fr-FR")} vues
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 16, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)" }}>
        <div style={{ width: `${((f * 0.6) % 100)}%`, height: "100%", borderRadius: 3, background: C.cyan }} />
      </div>
    </div>
  );
};

export const Secret: React.FC = () => {
  const f = useCurrentFrame();
  const pill = usePop(2);
  const phone = useSpring(80, { damping: 15 });
  const sub = usePop(100);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          ...pill,
          marginTop: 290,
          padding: "14px 40px",
          borderRadius: 999,
          background: C.gold,
          fontFamily: display,
          fontWeight: 900,
          fontSize: 44,
          color: C.bg,
          letterSpacing: 6,
        }}
      >
        LE SECRET
      </div>
      <div style={{ marginTop: 36, textAlign: "center" }}>
        <Word text="VIBE" delay={36} size={200} />
        <Word text="MOTION" delay={44} size={168} />
        <Word text="DESIGN" delay={52} size={168} />
      </div>

      <div
        style={{
          position: "relative",
          marginTop: 50,
          width: 340,
          height: 560,
          transform: `translateY(${(1 - phone) * 600}px) rotate(${interpolate(phone, [0, 1], [18, -4])}deg)`,
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 560 + i * 140,
              height: 560 + i * 140,
              marginLeft: -(280 + i * 70),
              marginTop: -(280 + i * 70),
              borderRadius: "50%",
              border: `3px dashed rgba(62,230,255,${0.45 - i * 0.2})`,
              transform: `rotate(${f * (i ? -1 : 1.4)}deg)`,
              opacity: phone,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 52,
            padding: 12,
            background: "linear-gradient(160deg, #2a3a6a, #0b1430)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(10,132,255,0.5)",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <MiniVideo />
          </div>
        </div>
      </div>

      <div style={{ ...sub, position: "absolute", top: 1660, width: 900, textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 50, color: C.white, lineHeight: 1.25 }}>
        Des vidéos animées qui <span style={{ color: C.cyan }}>vendent pour toi</span>
      </div>
    </AbsoluteFill>
  );
};
