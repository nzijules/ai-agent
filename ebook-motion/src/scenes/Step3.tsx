import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { BellIcon } from "../components/Icons";
import { StepBadge } from "../components/StepBadge";
import { C, body, display, gradText } from "../theme";

// 35s – 43s : "Étape 3 : les clients achètent, les notifications tombent… pendant que toi, tu restes dans l'ombre."
export const NOTIF_TIMES = [40, 62, 84, 104];
const NAMES = ["Awa · Abidjan", "Moussa · Dakar", "Grâce · Douala", "Kofi · Lomé"];

const Notif: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const at = NOTIF_TIMES[i];
  const p = useSpring(at, { damping: 13 });
  // later notifications push earlier ones down
  const pushed = NOTIF_TIMES.filter((t) => f > t && t > at).length;
  const y = pushed * 168;
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: 900,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "26px 32px",
        borderRadius: 32,
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * interpolate(pushed, [2, 3], [1, 0.25], clamp),
        transform: `translateY(${(1 - p) * -160}px) scale(${(0.85 + p * 0.15) * (1 - pushed * 0.03)})`,
      }}
    >
      <div style={{ width: 84, height: 84, borderRadius: 22, background: `linear-gradient(135deg, ${C.green}, #0FA36B)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <BellIcon size={46} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: C.bg }}>Nouvelle vente !</div>
        <div style={{ fontFamily: body, fontWeight: 500, fontSize: 30, color: "#4a5578" }}>{NAMES[i]} · Ebook</div>
      </div>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 40, color: "#0FA36B" }}>+5 000 F</div>
    </div>
  );
};

export const Step3: React.FC = () => {
  const f = useCurrentFrame();
  const title = usePop(8);
  const fig = useSpring(128, { damping: 20 });
  const txt = usePop(140);
  const rim = interpolate(Math.sin(f / 10), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 300 }}>
        <StepBadge n="03" />
      </div>
      <div style={{ ...title, marginTop: 30, textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 86, lineHeight: 1.05, color: C.white }}>
        Les ventes
        <br />
        <span style={gradText(C.green, C.cyan)}>tombent</span>
      </div>

      <div style={{ position: "absolute", top: 690, left: 90, width: 900, height: 700 }}>
        {[0, 1, 2, 3].map((i) => (
          <Notif key={i} i={i} />
        ))}
      </div>

      {/* hooded silhouette in the shadow */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: 540 - 260,
          width: 520,
          height: 520,
          opacity: fig,
          transform: `translateY(${(1 - fig) * 300}px)`,
        }}
      >
        <svg width={520} height={520} viewBox="0 0 520 520">
          <defs>
            <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={C.cyan} stopOpacity={rim} />
              <stop offset="0.5" stopColor={C.blue} stopOpacity={0.2} />
              <stop offset="1" stopColor={C.cyan} stopOpacity={rim} />
            </linearGradient>
          </defs>
          <path
            d="M260 40c-80 0-130 60-130 140 0 40 14 72 34 96-80 30-134 100-144 244h480c-10-144-64-214-144-244 20-24 34-56 34-96 0-80-50-140-130-140z"
            fill="#08080a"
            stroke="url(#rim)"
            strokeWidth={6}
          />
          <ellipse cx="260" cy="200" rx="72" ry="92" fill="#000" />
        </svg>
      </div>
      <div style={{ ...txt, position: "absolute", top: 1440, width: 900, textAlign: "center", fontFamily: display, fontWeight: 800, fontSize: 56, color: C.white, textShadow: "0 4px 30px #000" }}>
        …et toi, tu restes <span style={{ color: C.cyan }}>dans l&apos;ombre.</span>
      </div>
    </AbsoluteFill>
  );
};
