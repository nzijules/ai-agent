import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import cfg from "../ad.config.json";
import { clamp, easeOut, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Icon, IconName } from "../components/Icons";
import { Eyebrow, KineticText } from "../components/Text";
import { PhotoCard } from "../components/Ui";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";
import { Stage } from "./Stage";

/**
 * « Contrôle » cut — the transformation the parent can picture, right before the offer.
 * Phrased as a projection (« Imaginez… »): no promised figures, no testimonial.
 */
const ROWS: { icon: IconName; t: string; c: string; bg: string; at: number }[] = [
  { icon: "brain", t: "Il réfléchit par lui-même", c: C.blue, bg: C.blueSoft, at: 0.12 },
  { icon: "check", t: "Il réussit ses exercices", c: C.green, bg: C.greenSoft, at: 0.42 },
  { icon: "growth", t: "Il gagne en autonomie", c: "#B07F00", bg: C.yellowSoft, at: 0.7 },
];

export const S7Result: React.FC = () => {
  const f = useCurrentFrame();
  const { at, linesOf, lineFrames } = useTL();
  const L = useLayout();
  const id = linesOf("S7-Resultat")[0];
  const t0 = at(id);
  const dur = lineFrames(id);
  const w = L.square ? 640 : 880;
  const bar = interpolate(f, [t0 + dur * 0.2, t0 + dur * 0.95], [0.12, 0.96], { ...clamp, easing: easeOut });
  return (
    <Stage bg={<Background variant="light" />} gap={L.s(26)}>
      <div style={{ opacity: prog(f, 0, 10) }}>
        <Eyebrow size={L.s(28)}>
          <Icon name="sparkle" size={L.s(32)} color={C.navy} delay={2} /> Le résultat
        </Eyebrow>
      </div>
      <KineticText text="Imaginez votre enfant…" size={L.s(80)} delay={4} stagger={4} />
      <div style={{ scale: String(0.9 + 0.1 * pop(f, 6, 14, 0.9)), opacity: prog(f, 6, 14) }}>
        <PhotoCard src={cfg.photo} width={L.square ? 300 : 700} height={L.square ? 170 : 360} drift={prog(f, 0, 220)} position="50% 28%" border={`${L.s(6)}px solid #fff`} />
      </div>
      <div style={{ width: w, display: "flex", flexDirection: "column", gap: L.s(14) }}>
        {ROWS.map((r) => {
          const d = t0 + Math.round(dur * r.at);
          const p = pop(f, d, 12, 0.7);
          return (
            <div key={r.t} style={{ display: "flex", alignItems: "center", gap: L.s(18), background: "#fff", borderRadius: L.s(24), padding: `${L.s(14)}px ${L.s(22)}px`, boxShadow: "0 10px 30px rgba(11,27,58,0.10)", opacity: interpolate(f, [d, d + 6], [0, 1], clamp), translate: `${(1 - p) * -140}px 0px` }}>
              <div style={{ width: L.s(64), height: L.s(64), borderRadius: "50%", background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={r.icon} size={L.s(38)} color={r.c} stroke={2.2} delay={d + 3} drawFrames={14} />
              </div>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(40), color: C.navy, whiteSpace: "nowrap" }}>{r.t}</div>
            </div>
          );
        })}
        <div style={{ marginTop: L.s(8), opacity: prog(f, t0 + dur * 0.15, t0 + dur * 0.25) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.body, fontWeight: 700, fontSize: L.s(26), color: C.muted, marginBottom: L.s(8) }}>
            <span>Autonomie</span>
            <span style={{ color: C.green }}>jour après jour</span>
          </div>
          <div style={{ height: L.s(18), borderRadius: L.s(10), background: "rgba(11,27,58,0.08)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${bar * 100}%`, borderRadius: L.s(10), background: `linear-gradient(90deg, ${C.blue}, ${C.green})` }} />
          </div>
        </div>
      </div>
    </Stage>
  );
};
