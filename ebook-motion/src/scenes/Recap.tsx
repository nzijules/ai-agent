import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { C, display, gradText } from "../theme";

// 43s – 48s : "Zéro visage. Zéro compétence. Juste Claude Code, une bonne offre… et la pub."
const Slam: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const p = useSpring(delay, { damping: 11, stiffness: 220 });
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 900,
        fontSize: 116,
        color: C.white,
        lineHeight: 1.05,
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
        transform: `scale(${interpolate(p, [0, 1], [2.4, 1])})`,
      }}
    >
      {text}
    </div>
  );
};

const Chip: React.FC<{ label: string; delay: number; accent?: boolean }> = ({ label, delay, accent }) => {
  const s = usePop(delay, 60);
  return (
    <div
      style={{
        ...s,
        padding: "22px 34px",
        borderRadius: 26,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 50,
        color: accent ? C.bg : C.white,
        background: accent ? `linear-gradient(135deg, ${C.cyan}, ${C.blue})` : "rgba(255,255,255,0.08)",
        border: accent ? "none" : "2px solid rgba(255,255,255,0.25)",
      }}
    >
      {label}
    </div>
  );
};

const Op: React.FC<{ t: string; delay: number }> = ({ t, delay }) => {
  const s = usePop(delay, 30);
  return <div style={{ ...s, fontFamily: display, fontWeight: 900, fontSize: 64, color: C.cyan }}>{t}</div>;
};

export const Recap: React.FC = () => {
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Slam text="ZÉRO VISAGE." delay={2} />
      <Slam text="ZÉRO" delay={46} />
      <Slam text="COMPÉTENCE." delay={52} />
      <div style={{ height: 60 }} />
      <Chip label="Claude Code" delay={90} accent />
      <Op t="+" delay={112} />
      <Chip label="Une bonne offre" delay={118} />
      <Op t="+" delay={150} />
      <Chip label="Meta & TikTok Ads" delay={158} />
      <div style={{ ...usePop(168), marginTop: 20, fontFamily: display, fontWeight: 900, fontSize: 84, ...gradText(C.green, C.cyan) }}>
        = DES VENTES
      </div>
    </AbsoluteFill>
  );
};
