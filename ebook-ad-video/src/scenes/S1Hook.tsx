import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeOut, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Bubble, Typewriter } from "../components/Ui";
import { KineticText } from "../components/Text";
import { Icon } from "../components/Icons";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";

/** 0–8 s — Hook: "Votre enfant utilise ChatGPT… mais apprend-il vraiment ?" */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { at, linesOf } = useTL();
  const L = useLayout();
  const q = at(linesOf("S1-Accroche")[1], -0.6); // question moment
  const dim = prog(f, q, q + 14);
  const qm = pop(f, q + 6, 9, 0.9);
  const phoneW = L.square ? 600 : 880;
  return (
    <>
      <Background variant="navy" />
      <div style={{ position: "absolute", inset: 0, top: L.top, bottom: L.bottom, left: L.side, right: L.side, display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(44) }}>
        <KineticText text="Votre enfant utilise *ChatGPT…*" size={L.s(86)} color="#fff" hlColor={C.green} hlText="#fff" delay={2} stagger={3} />
        {/* Chat mock */}
        <div
          style={{
            width: phoneW,
            background: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.14)",
            borderRadius: L.s(44),
            padding: L.s(34),
            display: "flex",
            flexDirection: "column",
            gap: L.s(22),
            opacity: interpolate(f, [4, 14], [0, 1], clamp) * (1 - 0.55 * dim),
            translate: `0px ${(1 - prog(f, 4, 24)) * 140}px`,
            filter: `blur(${dim * 4}px)`,
            scale: String(1 - dim * 0.06),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.7)", fontFamily: F.body, fontWeight: 600, fontSize: L.s(28) }}>
            <Icon name="chat" size={L.s(34)} color={C.yellow} drawFrames={1} /> Devoirs de maths · 21h47
          </div>
          <Bubble from="user" size={L.s(40)} delay={10} maxWidth={phoneW * 0.8}>
            <Typewriter text="Fais mon exercice 3 page 42 😅" delay={12} cps={1.6} />
          </Bubble>
          <Bubble from="ai" size={L.s(40)} delay={32} typing={10} maxWidth={phoneW * 0.78}>
            <div style={{ display: "flex", flexDirection: "column", gap: L.s(10) }}>
              <div style={{ fontWeight: 700 }}>Voici la réponse complète :</div>
              {[0.95, 0.8, 0.9, 0.6].map((w, i) => (
                <div key={i} style={{ height: L.s(16), borderRadius: 8, background: "#D9E0EE", width: `${w * 100}%`, clipPath: `inset(0 ${100 - prog(f, 44 + i * 4, 54 + i * 4) * 100}% 0 0)` }} />
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontWeight: 700, fontSize: L.s(28), opacity: prog(f, 62, 70) }}>
                <Icon name="copy" size={L.s(30)} color={C.green} delay={62} /> Copié !
              </div>
            </div>
          </Bubble>
        </div>
      </div>
      {/* Question overlay */}
      <div style={{ position: "absolute", left: L.side, right: L.side, top: L.square ? 290 : 700, display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(f, [q, q + 8], [0, 1], clamp) }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(300), lineHeight: 0.9, color: C.yellow, scale: String(qm), rotate: `${(1 - qm) * -20 + Math.sin(f / 9) * 3}deg`, textShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>?</div>
        <KineticText text="…mais apprend-il *vraiment* ?" size={L.s(96)} color="#fff" hlText={C.navy} delay={q + 4} stagger={4} style={{ marginTop: L.s(20), textShadow: "0 10px 40px rgba(0,0,0,0.5)" }} />
      </div>
      {/* flash on question */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(f, [q, q + 2, q + 9], [0, 0.18, 0], { ...clamp, easing: easeOut }) }} />
    </>
  );
};
