import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS, FONT_TITLE, FONT_UI, TEXTS } from "../config";
import { sp, tw, EASE_IN_OUT } from "../anim";
import { at } from "../components/Kinetic";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { Book3D } from "../components/Book3D";
import { Icon, IconName } from "../components/Icon";

/** Contenu des pages intérieures : exemples concrets (scènes, texte animé, montage). */
const Inside: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const k = f - start;
  return (
    <div style={{ position: "absolute", inset: 0, padding: "34px 30px", fontFamily: FONT_UI, color: COLORS.night }}>
      <div style={{ fontWeight: 800, fontSize: 24, color: COLORS.electric, letterSpacing: 2 }}>CHAPITRE 2 · CRÉER</div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 92, borderRadius: 10, background: [COLORS.night, COLORS.electric, "#0a2c78"][i], position: "relative", overflow: "hidden", opacity: tw(k, [6 + i * 5, 12 + i * 5], [0, 1]), scale: String(tw(k, [6 + i * 5, 14 + i * 5], [0.7, 1])) }}>
            <div style={{ position: "absolute", left: 14 + Math.sin((k + i * 9) / 7) * 10, top: 22, width: 34, height: 34, borderRadius: i === 1 ? 8 : 17, background: [COLORS.yellow, COLORS.white, COLORS.cyan][i] }} />
            <div style={{ position: "absolute", left: 10, bottom: 8, fontSize: 15, fontWeight: 700, color: "#fff" }}>Scène {i + 1}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 40, display: "flex", gap: 2 }}>
        {"Texte animé".split("").map((c, i) => (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", translate: `0px ${Math.sin((k - i * 3) / 5) * 6 * tw(k, [20, 30], [0, 1])}px`, color: i < 5 ? COLORS.night : COLORS.electric, opacity: tw(k, [16 + i, 20 + i], [0, 1]) }}>
            {c}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 22, borderRadius: 12, background: "#eef2fa", padding: 12, position: "relative", height: 150 }}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{ position: "absolute", left: 12, top: 12 + r * 30, height: 20, borderRadius: 5, width: `${tw(k, [24 + r * 4, 40 + r * 4], [0, [70, 50, 85][r]])}%`, background: [COLORS.electric, COLORS.yellow, COLORS.cyan][r] }} />
        ))}
        <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, height: 36, display: "flex", alignItems: "center", gap: 3 }}>
          {new Array(40).fill(0).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6 + Math.abs(Math.sin(i * 1.7 + k / 4)) * 26 * random(`wv${i}`), background: "#9aa7c7", borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ position: "absolute", top: 6, bottom: 6, width: 3, background: COLORS.red, left: `${tw(k, [30, 200], [4, 96], (x) => x)}%` }} />
      </div>
      <div style={{ marginTop: 18, fontSize: 18, fontWeight: 600, color: "#5b6785" }}>Montage synchronisé sur la voix-off ✓</div>
    </div>
  );
};

/** SCÈNE 6 — Le guide qui t'accompagne : barrière brisée, livre qui s'ouvre, 3 étapes. */
export const S6Guide: React.FC = () => {
  const f = useCurrentFrame();
  const crack = at("s6", 39.47);
  const shatter = at("s6", 40.0);
  const openAt = at("s6", 40.75);
  const cards = [at("s6", 41.68), at("s6", 42.56), at("s6", 43.44)];
  const bookIn = sp(f, shatter - 4, 14);
  const open = tw(f, [openAt, openAt + 22], [0, 150], EASE_IN_OUT);
  const bookLeft = tw(f, [openAt, openAt + 22], [340, 560], EASE_IN_OUT);
  const icons: IconName[] = ["download", "wand", "film"];
  const COLS = 6, ROWS = 8, BW = 150, BH = 84;
  return (
    <AbsoluteFill>
      <Background brightness={1.1} />
      <Particles count={30} seed="s6" opacity={0.6} />

      {/* livre */}
      <div style={{ position: "absolute", top: 240, left: bookLeft, scale: String(0.55 + 0.45 * bookIn), opacity: Math.min(1, bookIn * 1.5) }}>
        <Book3D width={400} rotY={tw(f, [shatter, openAt, openAt + 22], [-50, -22, -6], EASE_IN_OUT) + Math.sin(f / 30) * 2} rotX={4} open={open} inside={<Inside f={f} start={openAt + 10} />} />
      </div>
      {/* halo derrière le livre */}
      <div style={{ position: "absolute", top: 380, left: 240, width: 600, height: 600, borderRadius: 300, background: `radial-gradient(circle, ${COLORS.electric}66, transparent 70%)`, opacity: bookIn * 0.8, zIndex: -1 }} />

      {/* barrière de briques */}
      {f < shatter + 40 &&
        new Array(COLS * ROWS).fill(0).map((_, i) => {
          const c = i % COLS, r = Math.floor(i / COLS);
          const x = 90 + c * BW + (r % 2 ? BW / 2 : 0) - BW / 2 + 40;
          const y = 220 + r * BH;
          const rnd = (k: string) => random(`b${i}${k}`);
          const k = Math.max(0, f - shatter);
          const dx = (x - 540) / 300 + (rnd("x") - 0.5) * 2;
          const dy = (y - 560) / 300 - 1.5 + rnd("y");
          const vib = f >= crack && f < shatter ? Math.sin(f * 3 + i) * 3 : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x + dx * k * 22 + vib,
                top: y + dy * k * 18 + k * k * 0.9,
                width: BW - 8,
                height: BH - 8,
                borderRadius: 8,
                background: "linear-gradient(180deg,#2a3768,#18214a)",
                border: `2px solid ${COLORS.cyan}${f >= crack ? "cc" : "55"}`,
                boxShadow: f >= crack ? `0 0 18px ${COLORS.cyan}66` : "none",
                rotate: `${(rnd("r") - 0.5) * k * 14}deg`,
                opacity: tw(f, [0, 10], [0, 1]) * tw(k, [8, 32], [1, 0]),
              }}
            />
          );
        })}
      {/* fissure lumineuse */}
      <svg width={1080} height={1000} style={{ position: "absolute", top: 180, left: 0, opacity: tw(f, [crack, crack + 4, shatter, shatter + 6], [0, 1, 1, 0]) }}>
        <path d="M540 60 L500 220 L580 330 L470 480 L590 620 L520 760 L560 900" stroke={COLORS.white} strokeWidth={8} fill="none" strokeDasharray={1200} strokeDashoffset={tw(f, [crack, shatter], [1200, 0])} style={{ filter: `drop-shadow(0 0 14px ${COLORS.cyan})` }} />
      </svg>
      <AbsoluteFill style={{ background: COLORS.white, opacity: tw(f, [shatter, shatter + 2, shatter + 10], [0, 0.5, 0]) }} />

      {/* 3 étapes pédagogiques */}
      <div style={{ position: "absolute", top: 1040, left: 50, right: 50, display: "flex", gap: 24 }}>
        {TEXTS.s6Steps.map((s, i) => {
          const p = sp(f, cards[i], 12);
          const active = f >= cards[i];
          return (
            <div key={s} style={{ flex: 1, height: 230, borderRadius: 28, background: active ? `linear-gradient(160deg, ${COLORS.electric}, #0a2c78)` : "#121a33", border: `2px solid ${active ? COLORS.cyan : "#2a3560"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, scale: String(p), opacity: Math.min(1, p * 1.3), translate: `0px ${(1 - p) * 80}px`, boxShadow: active ? `0 18px 40px rgba(0,0,0,0.45), 0 0 30px ${COLORS.cyan}44` : "none" }}>
              <div style={{ width: 86, height: 86, borderRadius: 26, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={icons[i]} size={52} />
              </div>
              <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 34, color: COLORS.white, letterSpacing: 0.5 }}>
                <span style={{ color: COLORS.yellow }}>{i + 1}.</span> {s}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
