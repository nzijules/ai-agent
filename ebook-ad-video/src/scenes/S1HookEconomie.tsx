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
 * Hook (angle Économie, visual A): "Un répétiteur, ça se paie chaque mois."
 * Month cards get stamped "PAYÉ" one after another, then the frame flips to
 * "un répétiteur à la maison, disponible à toute heure" (voice-over e01, e02).
 * No amounts are shown: no invented figures.
 */
const MONTHS = ["SEPT", "OCT", "NOV", "DÉC", "JANV", "FÉV"];

export const S1HookEconomie: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useTL();
  const L = useLayout();
  const q = at("e02", -0.25);
  const dim = prog(f, q, q + 14);
  const hp = pop(f, q + 4, 12, 0.9);
  const gridW = L.square ? 640 : 880;
  const gap = L.s(22);
  const cardW = (gridW - gap * 2) / 3;
  const cardH = cardW * (L.square ? 0.7 : 1.0);
  return (
    <>
      <Background variant="navy" />
      <div style={{ position: "absolute", top: L.top, bottom: L.bottom, left: L.side, right: L.side, display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(44) }}>
        <div style={{ opacity: 1 - dim * 0.85, filter: `blur(${dim * 3}px)` }}>
          <KineticText text="Un répétiteur, ça se paie *chaque mois.*" size={L.s(86)} color="#fff" hlText={C.navy} delay={1} stagger={3} />
        </div>
        <div
          style={{
            width: gridW,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap,
            opacity: 1 - 0.6 * dim,
            filter: `blur(${dim * 5}px)`,
            scale: String(1 - dim * 0.08),
          }}
        >
          {MONTHS.map((m, i) => {
            const d = 6 + i * 6;
            const p = pop(f, d, 12, 0.7);
            const st = pop(f, d + 7, 9, 0.6);
            return (
              <div
                key={m}
                style={{
                  height: cardH,
                  background: "#fff",
                  borderRadius: L.s(22),
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                  opacity: interpolate(f, [d, d + 5], [0, 1], clamp),
                  translate: `0px ${(1 - p) * 60}px`,
                  rotate: `${(1 - p) * (i % 2 ? 6 : -6)}deg`,
                }}
              >
                <div style={{ height: cardH * 0.3, background: C.blue, color: "#fff", fontFamily: F.display, fontWeight: 900, fontSize: L.s(30), display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2 }}>{m}</div>
                <div style={{ height: cardH * 0.42, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <Icon name="coins" size={cardH * 0.34} color={C.navy} stroke={1.8} delay={d + 2} drawFrames={14} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "80%",
                    translate: "-50% -50%",
                    rotate: "-14deg",
                    scale: String(0.6 + 0.4 * st),
                    opacity: interpolate(f, [d + 7, d + 9], [0, 1], clamp),
                    border: `${L.s(5)}px solid ${C.red}`,
                    color: C.red,
                    borderRadius: L.s(12),
                    padding: `${L.s(2)}px ${L.s(14)}px`,
                    fontFamily: F.display,
                    fontWeight: 900,
                    fontSize: L.s(36),
                    letterSpacing: 2,
                    background: "rgba(255,255,255,0.85)",
                  }}
                >
                  PAYÉ
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Flip: a tutor at home, available any time */}
      <div style={{ position: "absolute", left: L.side, right: L.side, top: L.square ? 210 : 620, display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(30), opacity: interpolate(f, [q, q + 8], [0, 1], clamp) }}>
        <div style={{ position: "relative", width: L.s(250), height: L.s(250), borderRadius: "50%", background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", scale: String(hp), boxShadow: "0 24px 70px rgba(247,183,24,0.45)" }}>
          <Icon name="home" size={L.s(140)} color={C.navy} stroke={2} delay={q + 6} drawFrames={18} />
          <div style={{ position: "absolute", right: -L.s(6), top: -L.s(6), width: L.s(86), height: L.s(86), borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, #4F7BFF)`, display: "flex", alignItems: "center", justifyContent: "center", border: `${L.s(5)}px solid ${C.navy}`, scale: String(pop(f, q + 14, 10, 0.6)) }}>
            <Icon name="sparkle" size={L.s(46)} color="#fff" stroke={2} drawFrames={1} />
          </div>
        </div>
        <KineticText text="Un répétiteur *à la maison* ?" size={L.s(L.square ? 80 : 92)} color="#fff" hlText={C.navy} delay={q + 8} stagger={4} style={{ textShadow: "0 10px 40px rgba(0,0,0,0.5)" }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: L.s(12),
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.25)",
            borderRadius: L.s(40),
            padding: `${L.s(12)}px ${L.s(26)}px`,
            fontFamily: F.body,
            fontWeight: 700,
            fontSize: L.s(36),
            color: "#fff",
            opacity: prog(f, q + 30, q + 40),
            translate: `0px ${(1 - prog(f, q + 30, q + 46, easeOut)) * 24}px`,
          }}
        >
          <Icon name="moon" size={L.s(40)} color={C.yellow} delay={q + 32} /> Disponible à toute heure
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(f, [q, q + 2, q + 9], [0, 0.15, 0], clamp), pointerEvents: "none" }} />
    </>
  );
};
