import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeIn, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Icon, IconName } from "../components/Icons";
import { Eyebrow, KineticText } from "../components/Text";
import { useLayout } from "../layout";
import { C, F, sec } from "../theme";
import { Stage } from "./Stage";

/** 8–24.6 s — Problem. Times below are relative to the scene start (8 s). */
const ITEMS: { icon: IconName; title: string; sub: string; at: number }[] = [
  { icon: "clock", title: "Devoirs bouclés en quelques secondes", sub: "…sans avoir rien retenu", at: 1.0 },
  { icon: "question", title: "Leçons mal comprises", sub: "les mêmes blocages reviennent", at: 4.0 },
  { icon: "cards", title: "Révisions sans méthode", sub: "beaucoup d'efforts, peu de résultats", at: 6.6 },
  { icon: "copy", title: "Réponses copiées-collées", sub: "sans réflexion personnelle", at: 9.0 },
];

export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const statement = sec(12.2);
  const out = prog(f, statement - 10, statement + 4, easeIn);
  const cardW = L.square ? 760 : 880;
  return (
    <Stage bg={<Background variant="cream" />} gap={L.s(30)}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(30), opacity: 1 - out, translate: `0px ${-out * 80}px`, filter: `blur(${out * 8}px)`, position: "absolute", inset: 0, justifyContent: "center" }}>
        <div style={{ opacity: prog(f, 0, 10), translate: `0px ${(1 - prog(f, 0, 14)) * 30}px` }}>
          <Eyebrow size={L.s(30)} bg={C.navy} color={C.yellow}>Le constat des parents</Eyebrow>
        </div>
        {ITEMS.map((it, i) => {
          const d = sec(it.at);
          const p = pop(f, d, 13, 0.75);
          return (
            <div
              key={i}
              style={{
                width: cardW,
                display: "flex",
                alignItems: "center",
                gap: L.s(26),
                background: "#fff",
                borderRadius: L.s(30),
                padding: `${L.s(L.square ? 20 : 28)}px ${L.s(30)}px`,
                boxShadow: "0 14px 40px rgba(11,27,58,0.10)",
                borderLeft: `${L.s(10)}px solid ${C.red}`,
                opacity: interpolate(f, [d, d + 6], [0, 1], clamp),
                translate: `${(1 - p) * (i % 2 ? 160 : -160)}px 0px`,
                rotate: `${(1 - p) * (i % 2 ? 4 : -4)}deg`,
              }}
            >
              <div style={{ width: L.s(92), height: L.s(92), borderRadius: L.s(24), background: "#FDE7E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={it.icon} size={L.s(54)} color={C.red} stroke={2.2} delay={d + 4} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(40), color: C.navy, lineHeight: 1.12 }}>{it.title}</div>
                <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: L.s(30), color: C.muted, marginTop: L.s(6) }}>{it.sub}</div>
              </div>
              <div style={{ width: L.s(56), height: L.s(56), borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, scale: String(pop(f, d + 14, 9, 0.6)) }}>
                <Icon name="x" size={L.s(32)} color="#fff" stroke={3} delay={d + 16} drawFrames={10} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Statement */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: L.s(26), opacity: interpolate(f, [statement, statement + 6], [0, 1], clamp) }}>
        <KineticText text="Obtenir une réponse" size={L.s(92)} delay={statement + 2} stagger={4} />
        <div style={{ display: "flex", alignItems: "center", gap: L.s(20), opacity: prog(f, statement + 18, statement + 28) }}>
          <div style={{ height: L.s(6), width: L.s(90), background: C.red, borderRadius: 4 }} />
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(50), color: C.red }}>ne signifie pas</div>
          <div style={{ height: L.s(6), width: L.s(90), background: C.red, borderRadius: 4 }} />
        </div>
        <KineticText text="*comprendre.*" size={L.s(126)} delay={statement + 34} stagger={4} />
      </div>
    </Stage>
  );
};
