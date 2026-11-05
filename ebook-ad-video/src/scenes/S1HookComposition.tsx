import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeOut, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Icon } from "../components/Icons";
import { KineticText } from "../components/Text";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";

/**
 * Hook (angle Compositions, visual C): a J-7 → J-1 countdown, then a blank exam paper
 * with « …et votre enfant n'est toujours pas prêt ? » (voice-over kXX lines 1–2).
 */
const DAYS = ["J-7", "J-6", "J-5", "J-4", "J-3", "J-2", "J-1"];

export const S1HookComposition: React.FC = () => {
  const f = useCurrentFrame();
  const { at, linesOf, lineFrames } = useTL();
  const L = useLayout();
  const ln = linesOf("S1-Accroche");
  const q = at(ln[1], -0.2);
  // fast flip J-7 → J-1, finished just before the paper arrives
  const countEnd = Math.max(26, Math.min(q - 6, at(ln[0]) + lineFrames(ln[0])));
  const idx = Math.min(DAYS.length - 1, Math.floor(interpolate(f, [2, countEnd], [0, DAYS.length - 0.01], clamp)));
  const tick = pop(f, 2 + Math.round((idx * (countEnd - 2)) / DAYS.length), 9, 0.5);
  const paper = pop(f, q, 13, 0.9);
  const dim = prog(f, q - 4, q + 10);
  const paperW = L.square ? 520 : 760;
  return (
    <>
      <Background variant="navy" />
      <div style={{ position: "absolute", top: L.top, bottom: L.bottom, left: L.side, right: L.side, display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(36) }}>
        <KineticText text="Les *compositions* approchent…" size={L.s(84)} color="#fff" hlText={C.navy} delay={1} stagger={3} />
        {/* countdown */}
        <div style={{ position: "relative", opacity: 1 - dim * 0.85, scale: String(1 - dim * 0.25), filter: `blur(${dim * 3}px)` }}>
          <div
            style={{
              width: L.s(420),
              height: L.s(300),
              borderRadius: L.s(36),
              background: "#fff",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
              scale: String(0.94 + 0.06 * tick),
            }}
          >
            <div style={{ height: L.s(78), background: C.red, color: "#fff", fontFamily: F.display, fontWeight: 900, fontSize: L.s(32), letterSpacing: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: L.s(12) }}>
              <Icon name="calendar" size={L.s(36)} color="#fff" drawFrames={1} /> COMPOSITIONS
            </div>
            <div style={{ height: L.s(222), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 900, fontSize: L.s(150), color: idx >= 5 ? C.red : C.navy, letterSpacing: -2 }}>
              {DAYS[idx]}
            </div>
          </div>
        </div>
      </div>
      {/* blank exam paper + question */}
      <div style={{ position: "absolute", left: L.side, right: L.side, top: L.square ? 200 : 560, display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(34), opacity: interpolate(f, [q, q + 8], [0, 1], clamp) }}>
        <div
          style={{
            width: paperW,
            background: "#FBFAF6",
            borderRadius: L.s(18),
            padding: `${L.s(30)}px ${L.s(36)}px`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            rotate: `${(1 - paper) * -8 - 2}deg`,
            translate: `0px ${(1 - paper) * 200}px`,
            display: "flex",
            flexDirection: "column",
            gap: L.s(16),
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(30), color: C.navy }}>COMPOSITION DE MATHÉMATIQUES</div>
            <Icon name="clock" size={L.s(40)} color={C.red} delay={q + 6} drawFrames={12} />
          </div>
          <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: L.s(24), color: C.muted }}>1er trimestre · Durée : 2 h</div>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: L.s(14), opacity: prog(f, q + 8 + n * 4, q + 14 + n * 4) }}>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(28), color: C.navy }}>Exercice {n}</div>
              <div style={{ flex: 1, borderBottom: `${L.s(3)}px dashed rgba(11,27,58,0.25)`, height: L.s(26) }} />
              <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(34), color: C.red }}>?</div>
            </div>
          ))}
        </div>
        <KineticText text="…et votre enfant n'est pas *prêt* ?" size={L.s(84)} color="#fff" hlText={C.navy} delay={q + 10} stagger={4} style={{ textShadow: "0 10px 40px rgba(0,0,0,0.5)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(f, [q, q + 2, q + 9], [0, 0.14, 0], { ...clamp, easing: easeOut }), pointerEvents: "none" }} />
    </>
  );
};
