import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT_ELEGANT, FONT_TITLE, FONT_UI, TEXTS } from "../config";
import { sp, tw, EASE_IN_OUT } from "../anim";
import { at, Headline, Typewriter, typeDur } from "../components/Kinetic";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { Icon } from "../components/Icon";

/** SCÈNE 5 — « Demandez, et l'on vous donnera » : traitement sobre et élégant. */
export const S5Ask: React.FC = () => {
  const f = useCurrentFrame();
  const ref = at("s5", 31.28);
  const verse = at("s5", 33.68);
  const field = at("s5", 34.6);
  const typeStart = at("s5", 34.85);
  const sent = typeStart + typeDur(TEXTS.s5Prompt, 34) + 4;
  const punch = at("s5", 36.0);
  const lift = tw(f, [punch - 6, punch + 10], [0, 1], EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Background brightness={0.8} grid={0.4} />
      {/* rayons de lumière doux */}
      <AbsoluteFill
        style={{
          background: `conic-gradient(from 180deg at 50% -10%, transparent 0deg, ${COLORS.cyan}22 ${170 + Math.sin(f / 30) * 4}deg, transparent 178deg, ${COLORS.electric}33 ${186 + Math.cos(f / 25) * 4}deg, transparent 195deg)`,
          opacity: tw(f, [0, 30], [0, 1]),
        }}
      />
      <Particles count={26} seed="s5" opacity={0.5} speed={0.4} color={COLORS.white} />

      <div style={{ position: "absolute", top: 250, left: 60, right: 60, translate: `0px ${-lift * 70}px`, scale: String(1 - lift * 0.18) }}>
        {/* référence */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 22, opacity: tw(f, [ref, ref + 12], [0, 1]) }}>
          <div style={{ height: 2, width: tw(f, [ref, ref + 20], [0, 110]), background: COLORS.yellow }} />
          <span style={{ fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 36, letterSpacing: 10, color: COLORS.yellow }}>{TEXTS.s5Ref}</span>
          <div style={{ height: 2, width: tw(f, [ref, ref + 20], [0, 110]), background: COLORS.yellow }} />
        </div>
        {/* verset */}
        <div style={{ marginTop: 50, textAlign: "center", fontFamily: FONT_ELEGANT, fontStyle: "italic", fontWeight: 700, fontSize: 100, lineHeight: 1.12, color: COLORS.white, textShadow: `0 0 40px ${COLORS.cyan}66` }}>
          <span style={{ fontSize: 150, color: COLORS.cyan, opacity: tw(f, [verse - 6, verse + 4], [0, 0.6]), lineHeight: 0.3, verticalAlign: "-0.35em" }}>“</span>
          {(() => {
            let idx = 0;
            return TEXTS.s5Verse.split(" ").map((word, wi) => (
              <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.28em" }}>
                {word.split("").map((c) => {
                  const s = verse + idx++ * 0.9;
                  return (
                    <span key={idx} style={{ opacity: tw(f, [s, s + 8], [0, 1]), filter: `blur(${tw(f, [s, s + 8], [10, 0])}px)`, display: "inline-block", translate: `0px ${tw(f, [s, s + 10], [20, 0])}px` }}>
                      {c}
                    </span>
                  );
                })}
              </span>
            ));
          })()}
        </div>
      </div>

      {/* champ de saisie */}
      <div style={{ position: "absolute", top: 760, left: 80, right: 80, height: 130, borderRadius: 34, background: "rgba(255,255,255,0.07)", border: `2px solid ${COLORS.cyan}99`, display: "flex", alignItems: "center", gap: 22, padding: "0 20px 0 36px", opacity: tw(f, [field, field + 10], [0, 1]), translate: `0px ${tw(f, [field, field + 14], [50, -lift * 60])}px`, boxShadow: `0 0 40px ${COLORS.electric}55` }}>
        <div style={{ flex: 1, fontFamily: FONT_UI, fontWeight: 500, fontSize: 36, color: COLORS.white, lineHeight: 1.25 }}>
          <Typewriter text={TEXTS.s5Prompt} frame={f} start={typeStart} cps={34} />
        </div>
        <div style={{ width: 92, height: 92, borderRadius: 26, background: f >= sent ? COLORS.yellow : COLORS.electric, display: "flex", alignItems: "center", justifyContent: "center", scale: String(f >= sent ? tw(f, [sent, sent + 3, sent + 8], [1, 0.85, 1]) : 1) }}>
          <Icon name="send" size={48} color={f >= sent ? COLORS.night : "#fff"} />
        </div>
      </div>

      {/* résultat animé qui se construit */}
      <div style={{ position: "absolute", top: 860, left: 160, right: 160, height: 230, borderRadius: 26, overflow: "hidden", background: `linear-gradient(135deg, ${COLORS.electric}, #061640)`, border: `2px solid ${COLORS.cyan}`, opacity: tw(f, [sent, sent + 8], [0, 1]), scale: String(sp(f, sent, 12)), boxShadow: `0 0 50px ${COLORS.cyan}66` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 40, top: 40 + i * 44, height: 26, borderRadius: 13, background: [COLORS.yellow, COLORS.white, COLORS.cyan][i], width: `${tw(f, [sent + 6 + i * 5, sent + 20 + i * 5], [0, [55, 40, 30][i]])}%` }} />
        ))}
        <div style={{ position: "absolute", right: 46, top: 50, width: 130, height: 130, borderRadius: 65, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", scale: String(sp(f, sent + 16, 9)) }}>
          <Icon name="play" size={66} />
        </div>
      </div>

      {/* punchline */}
      <div style={{ position: "absolute", top: 1125, left: 40, right: 40 }}>
        {f >= punch && <Headline lines={TEXTS.s5Punch} frame={f} start={punch} size={80} stagger={3} marker={["DEMANDER"]} highlight={["SAVOIR"]} />}
      </div>
    </AbsoluteFill>
  );
};
