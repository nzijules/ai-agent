import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeIn, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Book3D } from "../components/Book3D";
import { Icon, IconName } from "../components/Icons";
import { Eyebrow } from "../components/Text";
import { useLayout } from "../layout";
import { C, F, sec } from "../theme";
import { Stage } from "./Stage";

/** 42.8–62.6 s — Four benefits, one every 5 s, synced with VO lines l12–l15. */
export const BENEFITS: { icon: IconName; title: string; sub: string; bg: string; fg: string; at: number }[] = [
  { icon: "bulb", title: "Comprendre ses leçons", sub: "Des explications claires, étape par étape.", bg: C.blueSoft, fg: C.blue, at: 0.4 },
  { icon: "target", title: "Réviser intelligemment", sub: "Quiz, fiches et exercices adaptés à son niveau.", bg: C.yellowSoft, fg: "#B07F00", at: 5.4 },
  { icon: "compass", title: "Développer son autonomie", sub: "Réfléchir par soi-même, avec esprit critique.", bg: C.greenSoft, fg: C.green, at: 10.4 },
  { icon: "users", title: "Accompagner ses progrès", sub: "Un parent impliqué, à ses côtés, sans être expert.", bg: C.pink, fg: "#C2364A", at: 15.4 },
];

export const S5Benefits: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const cardW = L.square ? 640 : 880;
  const active = BENEFITS.reduce((a, b, i) => (f >= sec(b.at) ? i : a), 0);
  return (
    <Stage bg={<Background variant="light" />} gap={L.s(34)} justify="flex-start">
      <div style={{ display: "flex", alignItems: "center", gap: L.s(24), opacity: prog(f, 0, 12), marginTop: L.s(10) }}>
        <Book3D width={L.s(L.square ? 80 : 110)} rotY={-20} rotX={4} shadow={false} />
        <div>
          <Eyebrow size={L.s(26)} bg={C.navy} color={C.yellow}>Avec ce guide</Eyebrow>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(54), color: C.navy, marginTop: L.s(10), lineHeight: 1.05, whiteSpace: "nowrap" }}>4 bénéfices clés</div>
        </div>
      </div>
      {/* Feature card stack */}
      <div style={{ position: "relative", width: cardW, height: L.s(L.square ? 470 : 560) }}>
        {BENEFITS.map((b, i) => {
          const d = sec(b.at);
          const next = i < BENEFITS.length - 1 ? sec(BENEFITS[i + 1].at) : 99999;
          const p = pop(f, d, 13, 0.8);
          const o = prog(f, next - 6, next + 8, easeIn);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                background: "#fff",
                borderRadius: L.s(44),
                boxShadow: "0 30px 70px rgba(11,27,58,0.14)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: L.s(26),
                padding: L.s(40),
                opacity: interpolate(f, [d, d + 6], [0, 1], clamp) * (1 - o),
                translate: `${(1 - p) * 260 - o * 260}px 0px`,
                rotate: `${(1 - p) * 5 - o * 5}deg`,
                scale: String(1 - o * 0.08),
              }}
            >
              <div style={{ position: "absolute", top: L.s(26), right: L.s(34), fontFamily: F.display, fontWeight: 900, fontSize: L.s(40), color: "rgba(11,27,58,0.12)" }}>0{i + 1}</div>
              <div style={{ width: L.s(220), height: L.s(220), borderRadius: "50%", background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(f, d + 4, 9, 0.6)), rotate: `${Math.sin((f - d) / 18) * 4}deg` }}>
                <Icon name={b.icon} size={L.s(120)} color={b.fg} stroke={1.8} delay={d + 6} drawFrames={26} />
              </div>
              <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(62), color: C.navy, textAlign: "center", lineHeight: 1.08 }}>{b.title}</div>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: L.s(36), color: C.muted, textAlign: "center", lineHeight: 1.3, maxWidth: cardW * 0.82 }}>{b.sub}</div>
            </div>
          );
        })}
      </div>
      {/* Checklist progress */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: L.s(16), width: cardW }}>
        {BENEFITS.map((b, i) => {
          const on = f >= sec(b.at) + 10;
          const p = pop(f, sec(b.at) + 10, 11, 0.6);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: L.s(12), background: on ? "#fff" : "rgba(255,255,255,0.5)", border: `2px solid ${on ? b.fg : "rgba(11,27,58,0.08)"}`, borderRadius: L.s(24), padding: `${L.s(12)}px ${L.s(16)}px`, opacity: on ? 1 : 0.55, scale: String(i === active ? 1 + 0.03 * p : 1) }}>
              <div style={{ width: L.s(40), height: L.s(40), borderRadius: "50%", background: on ? b.fg : "rgba(11,27,58,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, scale: String(on ? 0.6 + 0.4 * p : 1) }}>
                {on && <Icon name="check" size={L.s(26)} color="#fff" stroke={3.2} delay={sec(b.at) + 12} drawFrames={10} />}
              </div>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: L.s(27), color: C.navy, lineHeight: 1.15 }}>{b.title}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
