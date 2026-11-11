import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT_TITLE, FONT_UI, TEXTS } from "../config";
import { sp, tw, EASE_IN_OUT } from "../anim";
import { at, Headline, Typewriter, typeDur } from "../components/Kinetic";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";

const Spark: React.FC<{ size: number; color?: string }> = ({ size, color = "#E8743B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    {[0, 30, 60, 90, 120, 150].map((r) => (
      <rect key={r} x={11} y={1} width={2.2} height={22} rx={1.1} fill={color} transform={`rotate(${r} 12 12)`} />
    ))}
  </svg>
);

const CODE = [
  { w: 0.55, c: COLORS.cyan },
  { w: 0.78, c: "#9AA7C7" },
  { w: 0.42, c: COLORS.yellow },
  { w: 0.66, c: "#9AA7C7" },
  { w: 0.35, c: "#7CF3A0" },
];

/** SCÈNE 2 — La promesse : interface de création, saisie d'instruction, timeline. */
export const S2Promise: React.FC = () => {
  const f = useCurrentFrame();
  const typeStart = 14;
  const typed = typeStart + typeDur(TEXTS.s2Prompt, 34);
  const step = at("s2", 9.1);
  const promise = at("s2", 13.28);
  const win = sp(f, 0, 16, 0.9, 110);
  const tilt = tw(f, [0, 60], [24, 8], EASE_IN_OUT) + Math.sin(f / 40) * 1.5;
  return (
    <AbsoluteFill>
      <Background />
      <Particles count={24} seed="s2" opacity={0.5} />
      {/* Fenêtre façon Claude Code */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 200, perspective: 1600 }}>
        <div
          style={{
            transform: `rotateX(${tilt}deg) translateY(${(1 - win) * 300}px) scale(${0.8 + 0.2 * win})`,
            opacity: win,
            borderRadius: 28,
            background: "linear-gradient(180deg,#141d38,#0b1229)",
            border: `2px solid ${COLORS.electric}88`,
            boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 60px ${COLORS.electric}44`,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 26px", borderBottom: "1px solid #ffffff18" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            ))}
            <div style={{ marginLeft: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <Spark size={30} />
              <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 30, color: COLORS.white }}>Claude Code</span>
            </div>
          </div>
          <div style={{ padding: "26px 30px 30px", minHeight: 360 }}>
            <div style={{ fontFamily: "monospace", fontSize: 34, lineHeight: 1.4, color: COLORS.white }}>
              <span style={{ color: "#E8743B", fontWeight: 700 }}>{"> "}</span>
              <Typewriter text={TEXTS.s2Prompt} frame={f} start={typeStart} cps={34} />
            </div>
            {/* lignes de code stylisées */}
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {CODE.map((l, i) => {
                const s = typed + 6 + i * 5;
                return (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", opacity: tw(f, [s, s + 6], [0, 1]) }}>
                    <div style={{ width: 14, height: 14, borderRadius: 7, background: i === 4 ? "#7CF3A0" : COLORS.electric }} />
                    <div style={{ height: 16, borderRadius: 8, background: l.c, width: `${tw(f, [s, s + 14], [0, l.w * 100])}%`, opacity: 0.85 }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu : éléments graphiques qui s'assemblent + timeline */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 690, height: 330 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 520,
            top: 0,
            height: 300,
            borderRadius: 22,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${COLORS.electric}, #0a2c78)`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            opacity: tw(f, [typed, typed + 10], [0, 1]),
            scale: String(tw(f, [typed, typed + 14], [0.85, 1])),
          }}
        >
          {/* formes qui prennent vie */}
          {[0, 1, 2].map((i) => {
            const s = typed + 10 + i * 7;
            const p = sp(f, s, 11, 0.6, 150);
            const shapes: React.CSSProperties[] = [
              { left: 50, top: 70, width: 110, height: 110, borderRadius: 60, background: COLORS.yellow },
              { left: 200, top: 60, width: 120, height: 120, borderRadius: 18, background: COLORS.cyan, rotate: `${f * 2}deg` },
              { left: 360, top: 70, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: `110px solid ${COLORS.white}` },
            ];
            return <div key={i} style={{ position: "absolute", ...shapes[i], scale: String(p), translate: `0px ${Math.sin((f + i * 20) / 14) * 10}px` }} />;
          })}
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 30,
              fontFamily: FONT_TITLE,
              fontWeight: 900,
              fontSize: 40,
              color: COLORS.white,
              clipPath: `inset(0 ${tw(f, [typed + 26, typed + 40], [100, 0])}% 0 0)`,
            }}
          >
            MON GUIDE ✦
          </div>
        </div>
        {/* barre latérale de calques */}
        <div style={{ position: "absolute", left: 545, right: 0, top: 0, height: 300, display: "flex", flexDirection: "column", gap: 14 }}>
          {["Texte animé", "Formes", "Voix-off", "Musique"].map((t, i) => {
            const s = typed + 8 + i * 6;
            const c = [COLORS.yellow, COLORS.cyan, "#FF7AB6", "#7CF3A0"][i];
            return (
              <div key={t} style={{ flex: 1, borderRadius: 14, background: "#121a33", border: "1px solid #ffffff1c", display: "flex", alignItems: "center", gap: 14, padding: "0 18px", opacity: tw(f, [s, s + 8], [0, 1]), translate: `${tw(f, [s, s + 10], [60, 0])}px 0px` }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: c }} />
                <span style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 26, color: "#DCE3F5" }}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* timeline animée */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1010, height: 120, borderRadius: 18, background: "#0d1530", border: "1px solid #ffffff18", overflow: "hidden", opacity: tw(f, [typed + 4, typed + 14], [0, 1]) }}>
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ position: "absolute", top: 16 + row * 32, left: 16, right: 16, height: 24 }}>
            {[0, 1, 2].map((k) => {
              const s = typed + 12 + row * 4 + k * 5;
              const left = [4, 34, 64][k] + row * 4;
              return (
                <div key={k} style={{ position: "absolute", left: `${left}%`, width: `${tw(f, [s, s + 10], [0, 24 - row * 3])}%`, height: 24, borderRadius: 6, background: [COLORS.electric, COLORS.cyan, COLORS.yellow][(row + k) % 3], opacity: 0.85 }} />
              );
            })}
          </div>
        ))}
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 4, background: COLORS.red, left: `${tw(f, [typed + 14, typed + 200], [2, 98], (t) => t)}%`, boxShadow: `0 0 12px ${COLORS.red}` }} />
      </div>

      {/* Titres */}
      <div style={{ position: "absolute", top: 1160, left: 40, right: 40 }}>
        {f < promise + 6 && f >= step && <Headline lines={[TEXTS.s2StepByStep]} frame={f} start={step} size={84} highlight={["ÉTAPE"]} exitAt={promise - 6} />}
      </div>
      <div style={{ position: "absolute", top: 1150, left: 40, right: 40 }}>
        {f >= promise && <Headline lines={TEXTS.s2Promise} frame={f} start={promise} size={80} stagger={3} marker={["L'IA"]} highlight={["PREMIÈRE"]} />}
      </div>
    </AbsoluteFill>
  );
};
