import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeIn, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Icon, IconName } from "../components/Icons";
import { Eyebrow, KineticText } from "../components/Text";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";
import { Stage } from "./Stage";

export type ProblemItem = { icon: IconName; title: string; sub: string; line: string; positive?: boolean };
export type ProblemProps = {
  eyebrow: string;
  items: ProblemItem[];
  /** voice-over line on which the closing statement appears */
  statementLine: string;
  statement: { top: string; middle: string; bottom: string; middleLast?: boolean };
};

/** Problem (angle Contrôle) — cards and statement are anchored to voice-over lines l03–l07. */
const ITEMS: ProblemItem[] = [
  { icon: "clock", title: "Devoirs bouclés en quelques secondes", sub: "…sans avoir rien retenu", line: "l03" },
  { icon: "question", title: "Leçons mal comprises", sub: "les mêmes blocages reviennent", line: "l04" },
  { icon: "cards", title: "Révisions sans méthode", sub: "beaucoup d'efforts, peu de résultats", line: "l05" },
  { icon: "copy", title: "Réponses copiées-collées", sub: "sans réflexion personnelle", line: "l06" },
];

export const ProblemScene: React.FC<ProblemProps> = ({ eyebrow, items, statementLine, statement: st }) => {
  const f = useCurrentFrame();
  const { at } = useTL();
  const L = useLayout();
  const statement = at(statementLine, -0.2);
  const out = prog(f, statement - 10, statement + 4, easeIn);
  const cardW = L.square ? 760 : 880;
  const mAt = statement + (st.middleLast ? 34 : 18);
  const middle = (
    <div style={{ display: "flex", alignItems: "center", gap: L.s(20), opacity: prog(f, mAt, mAt + 10) }}>
      <div style={{ height: L.s(6), width: L.s(70), background: C.red, borderRadius: 4 }} />
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(50), color: C.red, whiteSpace: "nowrap" }}>{st.middle}</div>
      <div style={{ height: L.s(6), width: L.s(70), background: C.red, borderRadius: 4 }} />
    </div>
  );
  return (
    <Stage bg={<Background variant="cream" />} gap={L.s(30)}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(30), opacity: 1 - out, translate: `0px ${-out * 80}px`, filter: `blur(${out * 8}px)`, position: "absolute", inset: 0, justifyContent: "center" }}>
        <div style={{ opacity: prog(f, 0, 10), translate: `0px ${(1 - prog(f, 0, 14)) * 30}px` }}>
          <Eyebrow size={L.s(30)} bg={C.navy} color={C.yellow}>{eyebrow}</Eyebrow>
        </div>
        {items.map((it, i) => {
          const d = at(it.line);
          const tone = it.positive ? { main: C.green, soft: C.greenSoft } : { main: C.red, soft: "#FDE7E8" };
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
                borderLeft: `${L.s(10)}px solid ${tone.main}`,
                opacity: interpolate(f, [d, d + 6], [0, 1], clamp),
                translate: `${(1 - p) * (i % 2 ? 160 : -160)}px 0px`,
                rotate: `${(1 - p) * (i % 2 ? 4 : -4)}deg`,
              }}
            >
              <div style={{ width: L.s(92), height: L.s(92), borderRadius: L.s(24), background: tone.soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={it.icon} size={L.s(54)} color={tone.main} stroke={2.2} delay={d + 4} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(40), color: C.navy, lineHeight: 1.12 }}>{it.title}</div>
                <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: L.s(30), color: C.muted, marginTop: L.s(6) }}>{it.sub}</div>
              </div>
              <div style={{ width: L.s(56), height: L.s(56), borderRadius: "50%", background: tone.main, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, scale: String(pop(f, d + 14, 9, 0.6)) }}>
                <Icon name={it.positive ? "check" : "x"} size={L.s(32)} color="#fff" stroke={3} delay={d + 16} drawFrames={10} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Statement */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: L.s(26), opacity: interpolate(f, [statement, statement + 6], [0, 1], clamp) }}>
        <KineticText text={st.top} size={L.s(st.middleLast ? 76 : 92)} delay={statement + 2} stagger={3} />
        {!st.middleLast && middle}
        <KineticText text={st.bottom} size={L.s(126)} delay={statement + (st.middleLast ? 18 : 34)} stagger={4} />
        {st.middleLast && middle}
      </div>
    </Stage>
  );
};

export const S2Problem: React.FC = () => (
  <ProblemScene
    eyebrow="Le constat des parents"
    items={ITEMS}
    statementLine="l07"
    statement={{ top: "Obtenir une réponse", middle: "ne signifie pas", bottom: "*comprendre.*" }}
  />
);
