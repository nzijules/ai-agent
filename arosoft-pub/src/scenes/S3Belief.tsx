import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS, FONT_TITLE, TEXTS } from "../config";
import { shake, sp, tw } from "../anim";
import { at, Headline } from "../components/Kinetic";
import { Background } from "../components/Background";
import { Character } from "../components/Character";
import { Particles } from "../components/Particles";
import { Icon, IconName } from "../components/Icon";

const SYMBOLS = ["{ }", "</>", "λ", "0101", "sudo", "∑", "if()", "=>", "#!/bin", "∫dx", "&&", "[ ]", "∞", "def", "0x3F", "%"];
const FRIENDLY: IconName[] = ["chat", "play", "sparkle", "check", "star", "wand"];

/** SCÈNE 3 — Briser la croyance « l'IA c'est pour les informaticiens ». */
export const S3Belief: React.FC = () => {
  const f = useCurrentFrame();
  const q = at("s3", 16.8);
  const no = at("s3", 19.99);
  const acc = at("s3", 23.55);
  const sh = shake(f, no, 26, 18);
  const mood = tw(f, [no + 4, no + 30], [0, 1]);
  const bright = tw(f, [no, no + 20], [0.7, 1.6]);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <Background brightness={bright} hue={f < no ? "#3a2a6b" : COLORS.electric} />
      {/* univers plus simple après la rupture */}
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 40%, ${COLORS.cyan}55, transparent 70%)`, opacity: tw(f, [no, no + 25], [0, 1]) }} />
      <Particles count={30} seed="s3" opacity={tw(f, [no, no + 20], [0.2, 0.8])} />

      {/* symboles complexes qui tourbillonnent puis explosent */}
      {SYMBOLS.map((s, i) => {
        const r = (k: string) => random(`sym-${i}-${k}`);
        const ang = r("a") * Math.PI * 2 + f * (0.008 + r("s") * 0.01) * (i % 2 ? 1 : -1);
        const rad = 270 + r("r") * 170;
        const burst = f > no ? Math.pow((f - no) / 18, 2) * 900 : 0;
        const x = 540 + Math.cos(ang) * (rad + burst);
        const y = 640 + Math.sin(ang) * (rad * 0.85 + burst);
        const appear = tw(f, [4 + i * 2, 14 + i * 2], [0, 1]);
        const gone = tw(f, [no, no + 16], [1, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 34 + r("f") * 26,
              color: i % 3 === 0 ? "#FF7A88" : "#9AA7C7",
              opacity: appear * gone * 0.85,
              rotate: `${Math.sin(f / 20 + i) * 15}deg`,
              filter: `blur(${(1 - gone) * 6}px)`,
              textShadow: "0 0 12px rgba(255,80,100,0.35)",
            }}
          >
            {s}
          </div>
        );
      })}
      {/* icônes simples qui remplacent la complexité */}
      {FRIENDLY.map((s, i) => {
        const p = sp(f, acc - 20 + i * 4, 12);
        const ang = (i / FRIENDLY.length) * Math.PI * 2 + f * 0.012;
        return (
          <div key={s} style={{ position: "absolute", left: 540 + Math.cos(ang) * 330, top: 640 + Math.sin(ang) * 290, translate: "-50% -50%", width: 96, height: 96, borderRadius: 28, background: "rgba(255,255,255,0.1)", border: `2px solid ${COLORS.cyan}88`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, color: COLORS.white, scale: String(p), boxShadow: `0 0 30px ${COLORS.cyan}55` }}>
            <Icon name={s} size={52} />
          </div>
        );
      })}

      {/* personnage */}
      <div style={{ position: "absolute", left: 240, top: 340, scale: String(tw(f, [0, 20], [0.9, 1])), opacity: tw(f, [0, 12], [0, 1]) }}>
        <Character mood={mood} frame={f} glow={0.4 + mood * 0.8} />
      </div>
      {/* points d'interrogation */}
      {["?", "?", "?"].map((s, i) => (
        <div key={i} style={{ position: "absolute", left: 640 + i * 60, top: 360 - i * 50 + Math.sin(f / 10 + i) * 10, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 60 + i * 14, color: COLORS.white, opacity: tw(f, [q + i * 5, q + 8 + i * 5], [0, 0.8]) * tw(f, [no, no + 8], [1, 0]) }}>
          {s}
        </div>
      ))}

      {/* Question barrée */}
      <div style={{ position: "absolute", top: 1100, left: 40, right: 40, opacity: tw(f, [no + 18, no + 28], [1, 0]) }}>
        {f >= q && <Headline lines={TEXTS.s3Question} frame={f} start={q} size={74} stagger={3} />}
        <div style={{ position: "absolute", left: 40, right: 40, top: 92, height: 12, background: COLORS.red, borderRadius: 6, transformOrigin: "0% 50%", scale: `${tw(f, [no, no + 6], [0, 1])} 1`, rotate: "-4deg", boxShadow: `0 0 20px ${COLORS.red}` }} />
      </div>
      {/* FAUX ! */}
      {f >= no && f < acc && (
        <div style={{ position: "absolute", top: 1080, width: "100%", display: "flex", justifyContent: "center", opacity: tw(f, [acc - 10, acc], [1, 0]) }}>
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontWeight: 900,
              fontSize: 190,
              color: COLORS.yellow,
              rotate: "-6deg",
              scale: String(tw(f, [no, no + 6], [2.4, 1]) * (1 + Math.sin(f / 6) * 0.015)),
              textShadow: `0 0 40px ${COLORS.yellow}88, 0 12px 0 #B38F00`,
              letterSpacing: -4,
            }}
          >
            {TEXTS.s3False}
          </div>
        </div>
      )}
      {/* BEAUCOUP PLUS ACCESSIBLE */}
      <div style={{ position: "absolute", top: 1110, left: 40, right: 40 }}>
        {f >= acc && <Headline lines={TEXTS.s3Accessible} frame={f} start={acc} size={88} marker={["ACCESSIBLE"]} />}
      </div>
      {/* rupture visuelle : flash + bande de glitch */}
      <AbsoluteFill style={{ background: COLORS.white, opacity: tw(f, [no, no + 2, no + 12], [0, 0.7, 0]) }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 200 + i * 410 + ((f * 37) % 120), height: 26 + i * 8, background: i % 2 ? COLORS.cyan : COLORS.red, mixBlendMode: "screen", opacity: tw(f, [no, no + 3, no + 10], [0, 0.6, 0]), translate: `${(i % 2 ? 1 : -1) * 60}px 0px` }} />
      ))}
    </AbsoluteFill>
  );
};
