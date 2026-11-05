import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeIn, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Book3D } from "../components/Book3D";
import { Icon, IconName } from "../components/Icons";
import { Eyebrow } from "../components/Text";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";
import { Stage } from "./Stage";
import { QuizMock } from "../components/Quiz";

/** 42.8–62.6 s — Four benefits, one every 5 s, synced with VO lines l12–l15. */
type Benefit = { icon: IconName; title: string; sub: string; bg: string; fg: string; quiz?: boolean; /** voice-over line id */ id?: string };
export const BENEFITS: Benefit[] = [
  { id: "l12", icon: "bulb", title: "Comprendre ses leçons", sub: "Des explications claires, étape par étape.", bg: C.blueSoft, fg: C.blue },
  { id: "l13", icon: "target", title: "Réviser intelligemment", sub: "Quiz, fiches et exercices adaptés à son niveau.", bg: C.yellowSoft, fg: "#B07F00" },
  { id: "l14", icon: "compass", title: "Développer son autonomie", sub: "Réfléchir par soi-même, avec esprit critique.", bg: C.greenSoft, fg: C.green },
  { id: "l15", icon: "users", title: "Accompagner ses progrès", sub: "Un parent impliqué, à ses côtés, sans être expert.", bg: C.pink, fg: "#C2364A" },
];

const CONTROLE: Benefit[] = [
  { id: "c10", icon: "bulb", title: "Comprendre ses leçons", sub: "Des explications claires, étape par étape.", bg: C.blueSoft, fg: C.blue },
  { id: "c11", icon: "target", title: "Quiz chronométrés", sub: "Des quiz interactifs pour réviser efficacement.", bg: C.yellowSoft, fg: "#B07F00", quiz: true },
  { id: "c12", icon: "compass", title: "Corriger ses erreurs", sub: "Identifier ses erreurs, renforcer ses connaissances, gagner en autonomie.", bg: C.greenSoft, fg: C.green },
  { id: "c13", icon: "brain", title: "Réfléchir, pas recopier", sub: "Apprendre à réfléchir… plutôt qu'à recopier.", bg: C.pink, fg: "#C2364A" },
];

const COMPOSITION: Benefit[] = [
  { id: "k08", icon: "target", title: "Quiz chronométrés", sub: "Pour s'entraîner comme le jour de la composition.", bg: C.yellowSoft, fg: "#B07F00", quiz: true },
];

export const S5Benefits: React.FC = () => {
  const f = useCurrentFrame();
  const { at, variant, linesOf } = useTL();
  const lnS = linesOf("S5-Benefices");
  // « Contrôle » cut (optimised script): its own 4 benefits, incl. timed interactive quizzes
  const pool = variant === "controle" ? CONTROLE : variant === "composition" ? COMPOSITION : BENEFITS;
  // one card per voice-over line of the scene (the 35 s TikTok cut keeps only the quiz)
  const list: (Benefit & { line: string })[] = lnS.map((id, i) => ({ ...(pool.find((b) => b.id === id) ?? pool[i]), line: id }));
  const single = list.length === 1;
  const T = (id: string) => at(id, -0.2);
  const L = useLayout();
  const cardW = L.square ? 640 : 880;
  const active = list.reduce((a, b, i) => (f >= T(b.line) ? i : a), 0);
  return (
    <Stage bg={<Background variant="light" />} gap={L.s(34)} justify="flex-start">
      <div style={{ display: "flex", alignItems: "center", gap: L.s(24), opacity: prog(f, 0, 12), marginTop: L.s(10) }}>
        <Book3D width={L.s(L.square ? 80 : 110)} rotY={-20} rotX={4} shadow={false} />
        <div>
          <Eyebrow size={L.s(26)} bg={C.navy} color={C.yellow}>Avec ce guide</Eyebrow>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(54), color: C.navy, marginTop: L.s(10), lineHeight: 1.05, whiteSpace: "nowrap" }}>{single ? (variant === "composition" ? "Pour ses compositions" : "Pour mieux réviser") : `${list.length} bénéfices clés`}</div>
        </div>
      </div>
      {/* Feature card stack */}
      <div style={{ position: "relative", width: cardW, height: L.s(L.square ? 470 : 560) }}>
        {list.map((b, i) => {
          const d = T(b.line);
          const next = i < list.length - 1 ? T(list[i + 1].line) : 99999;
          const p = pop(f, d, 13, 0.8);
          const o = prog(f, next - 12, next, easeIn);
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
                opacity: interpolate(f, [d + 2, d + 8], [0, 1], clamp) * (1 - o),
                translate: `${(1 - p) * 260 - o * 260}px 0px`,
                rotate: `${(1 - p) * 5 - o * 5}deg`,
                scale: String(1 - o * 0.08),
              }}
            >
              {!b.quiz && <div style={{ position: "absolute", top: L.s(26), right: L.s(34), fontFamily: F.display, fontWeight: 900, fontSize: L.s(40), color: "rgba(11,27,58,0.12)" }}>0{i + 1}</div>}
              {b.quiz ? (
                <QuizMock width={cardW * 0.86} delay={d + 4} k={L.k} />
              ) : (
                <div style={{ width: L.s(220), height: L.s(220), borderRadius: "50%", background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(f, d + 4, 9, 0.6)), rotate: `${Math.sin((f - d) / 18) * 4}deg` }}>
                  <Icon name={b.icon} size={L.s(120)} color={b.fg} stroke={1.8} delay={d + 6} drawFrames={26} />
                </div>
              )}
              <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(62), color: C.navy, textAlign: "center", lineHeight: 1.08 }}>{b.title}</div>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: L.s(36), color: C.muted, textAlign: "center", lineHeight: 1.3, maxWidth: cardW * 0.82 }}>{b.sub}</div>
            </div>
          );
        })}
      </div>
      {/* Checklist progress */}
      {!single && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: L.s(16), width: cardW }}>
        {list.map((b, i) => {
          const on = f >= T(b.line) + 10;
          const p = pop(f, T(b.line) + 10, 11, 0.6);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: L.s(12), background: on ? "#fff" : "rgba(255,255,255,0.5)", border: `2px solid ${on ? b.fg : "rgba(11,27,58,0.08)"}`, borderRadius: L.s(24), padding: `${L.s(12)}px ${L.s(16)}px`, opacity: on ? 1 : 0.55, scale: String(i === active ? 1 + 0.03 * p : 1) }}>
              <div style={{ width: L.s(40), height: L.s(40), borderRadius: "50%", background: on ? b.fg : "rgba(11,27,58,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, scale: String(on ? 0.6 + 0.4 * p : 1) }}>
                {on && <Icon name="check" size={L.s(26)} color="#fff" stroke={3.2} delay={T(b.line) + 12} drawFrames={10} />}
              </div>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: L.s(27), color: C.navy, lineHeight: 1.15 }}>{b.title}</div>
            </div>
          );
        })}
      </div>
      )}
    </Stage>
  );
};
