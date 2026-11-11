import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT_TITLE, FONT_UI, TEXTS } from "../config";
import { sp, tw, EASE_IN_OUT } from "../anim";
import { at, Typewriter, typeDur, Headline } from "../components/Kinetic";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { Character } from "../components/Character";
import { Icon, IconName } from "../components/Icon";

/** SCÈNE 4 — Le déclic : idée → instruction → vidéo (morphing). */
export const S4Click: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = at("s4", 25.9);
  const t1 = at("s4", 27.45);
  const t2 = at("s4", 28.7);
  const steps = [t0, t1, t2];
  const cur = f >= t2 ? 2 : f >= t1 ? 1 : 0;
  const m1 = tw(f, [t1 - 4, t1 + 10], [0, 1], EASE_IN_OUT);
  const m2 = tw(f, [t2 - 4, t2 + 10], [0, 1], EASE_IN_OUT);
  const w = 340 + m1 * 520;
  const h = 340 - m1 * 170 + m2 * 314;
  const radius = 170 - m1 * 140 - m2 * 4;
  const icons: IconName[] = ["bulb", "terminal", "film"];
  const promptStart = t1 + 8;
  const vid = f - t2;
  return (
    <AbsoluteFill>
      <Background brightness={1.2} />
      <Particles count={36} seed="s4" opacity={0.7} speed={1.2} />

      {/* libellé de l'étape en cours */}
      <div style={{ position: "absolute", top: 190, left: 40, right: 40 }}>
        <Headline key={cur} lines={[TEXTS.s4Steps[cur]]} frame={f} start={steps[cur]} size={82} stagger={3} highlight={["IDÉE", "INSTRUCTION", "VIDÉO"]} />
      </div>

      {/* nœuds + connexions lumineuses */}
      <div style={{ position: "absolute", top: 320, left: 190, right: 190, height: 90 }}>
        <svg width={700} height={90} style={{ position: "absolute", left: 0, top: 0 }}>
          {[0, 1].map((i) => {
            const prog = tw(f, [steps[i + 1] - 8, steps[i + 1] + 4], [0, 1]);
            return (
              <line key={i} x1={45 + i * 305} y1={45} x2={45 + i * 305 + 305 * prog} y2={45} stroke={COLORS.cyan} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${COLORS.cyan})` }} />
            );
          })}
        </svg>
        {icons.map((ic, i) => {
          const on = f >= steps[i];
          const p = sp(f, steps[i], 10);
          return (
            <div key={ic} style={{ position: "absolute", left: i * 305, top: 0, width: 90, height: 90, borderRadius: 45, background: on ? COLORS.electric : "#18213f", border: `3px solid ${on ? COLORS.cyan : "#2a3560"}`, display: "flex", alignItems: "center", justifyContent: "center", scale: String(on ? 0.8 + 0.2 * p : 0.8), boxShadow: on ? `0 0 30px ${COLORS.cyan}88` : "none" }}>
              <Icon name={ic} size={46} />
            </div>
          );
        })}
      </div>

      {/* scène centrale qui se transforme */}
      <div style={{ position: "absolute", top: 460, left: 0, right: 0, height: 500, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: w,
            height: h,
            borderRadius: radius,
            scale: String(sp(f, t0 - 6, 11)),
            background: cur === 0 ? `radial-gradient(circle, ${COLORS.yellow} 0%, #FFB800 70%)` : cur === 1 ? "#0d1530" : "#000",
            border: `3px solid ${cur === 0 ? "#FFF3A0" : COLORS.cyan}`,
            boxShadow: `0 0 ${60 + Math.sin(f / 6) * 20}px ${cur === 0 ? COLORS.yellow : COLORS.cyan}88`,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cur === 0 && (
            <div style={{ rotate: `${Math.sin(f / 8) * 6}deg`, scale: String(1 + Math.sin(f / 5) * 0.04) }}>
              <Icon name="bulb" size={190} color={COLORS.night} stroke={2} />
            </div>
          )}
          {cur === 1 && (
            <div style={{ display: "flex", alignItems: "center", width: "100%", padding: "0 34px", gap: 20, opacity: tw(f, [t1 + 4, t1 + 10], [0, 1]) }}>
              <span style={{ fontFamily: "monospace", fontSize: 40, color: "#E8743B", fontWeight: 700 }}>{">"}</span>
              <div style={{ flex: 1, fontFamily: FONT_UI, fontWeight: 600, fontSize: 42, color: COLORS.white }}>
                <Typewriter text={TEXTS.s4Prompt} frame={f} start={promptStart} cps={30} />
              </div>
              <div style={{ width: 84, height: 84, borderRadius: 22, background: f > promptStart + typeDur(TEXTS.s4Prompt, 30) ? COLORS.electric : "#25305a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="send" size={44} />
              </div>
            </div>
          )}
          {cur === 2 && (
            <AbsoluteFill style={{ background: `linear-gradient(135deg, ${COLORS.electric}, #071a4d)` }}>
              {[0, 1, 2, 3, 4].map((i) => {
                const p = sp(f, t2 + 6 + i * 3, 10);
                return (
                  <div key={i} style={{ position: "absolute", left: 60 + i * 160, top: 120 + Math.sin((vid + i * 10) / 8) * 30, width: 90, height: 90, borderRadius: i % 2 ? 20 : 45, background: [COLORS.yellow, COLORS.cyan, COLORS.white, COLORS.yellow, COLORS.cyan][i], scale: String(p), rotate: `${vid * 3 * (i % 2 ? 1 : -1)}deg` }} />
                );
              })}
              <div style={{ position: "absolute", left: 50, bottom: 90, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 64, color: COLORS.white, clipPath: `inset(0 ${tw(vid, [12, 26], [100, 0])}% 0 0)` }}>MA VIDÉO ✦</div>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, height: 10, borderRadius: 5, background: "#ffffff33" }}>
                <div style={{ width: `${tw(vid, [0, 90], [0, 100], (x) => x)}%`, height: 10, borderRadius: 5, background: COLORS.red }} />
              </div>
            </AbsoluteFill>
          )}
        </div>
      </div>

      {/* le personnage découvre le résultat */}
      <div style={{ position: "absolute", left: 390, top: 990, opacity: tw(f, [t2, t2 + 6], [0, 1]), translate: `0px ${tw(f, [t2 + 2, t2 + 16], [260, 0])}px` }}>
        <Character mood={1} frame={f} size={300} glow={1.2} />
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const s = t2 + 14 + i * 2;
        const a = (i / 6) * Math.PI * 2;
        const d = tw(f, [s, s + 18], [40, 190]);
        return (
          <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * d - 18, top: 1080 + Math.sin(a) * d * 0.6 - 18, opacity: tw(f, [s, s + 6, s + 26, s + 34], [0, 1, 1, 0]) }}>
            <Icon name="sparkle" size={36} color={COLORS.yellow} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
