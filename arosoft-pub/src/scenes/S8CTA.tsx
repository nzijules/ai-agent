import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT_TITLE, PRICE, TEXTS } from "../config";
import { sp, tw } from "../anim";
import { Headline } from "../components/Kinetic";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { HeroBook } from "./S7Price";

/** SCÈNE 8 — Appel à l'action. */
export const S8CTA: React.FC = () => {
  const f = useCurrentFrame();
  const buy = 22;
  const pricePill = 34;
  const cta = 46;
  const pulse = 1 + Math.max(0, Math.sin((f - cta) / 7)) * 0.045;
  return (
    <AbsoluteFill>
      <Background brightness={1.3} />
      <Particles count={34} seed="s8" opacity={0.7} />
      <div style={{ position: "absolute", top: 170, left: 60, rotate: "-6deg" }}>
        <HeroBook f={f} width={300} rotY={-24 + Math.sin(f / 24) * 5} enter={sp(f, 0, 14)} />
      </div>
      <div style={{ position: "absolute", top: 250, left: 410, right: 120 }}>
        <Headline lines={TEXTS.s8Lines} frame={f} start={4} size={70} stagger={4} align="left" highlight={["CRÉER"]} />
      </div>
      <div style={{ position: "absolute", top: 520, left: 410, right: 110, opacity: tw(f, [buy, buy + 8], [0, 1]), translate: `${tw(f, [buy, buy + 12], [60, 0])}px 0px` }}>
        <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 46, color: COLORS.white, lineHeight: 1.1 }}>{TEXTS.s8Buy}</div>
        <div style={{ marginTop: 18, display: "inline-flex", flexDirection: "column", padding: "10px 24px 12px", borderRadius: 20, background: COLORS.yellow, color: COLORS.night, scale: String(sp(f, pricePill, 10)), transformOrigin: "0% 50%", boxShadow: `0 0 30px ${COLORS.yellow}77` }}>
          <span style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 26, letterSpacing: 4 }}>{TEXTS.s8PriceLabel}</span>
          <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 54, whiteSpace: "nowrap", letterSpacing: -1 }}>{PRICE}</span>
        </div>
      </div>

      {/* bouton CTA */}
      <div style={{ position: "absolute", top: 860, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", scale: String(sp(f, cta, 11) * pulse) }}>
          <div style={{ position: "absolute", inset: -14, borderRadius: 60, border: `4px solid ${COLORS.cyan}`, opacity: 0.6 * (1 - ((f - cta) % 30) / 30), scale: String(1 + ((f - cta) % 30) / 120) }} />
          <div style={{ padding: "34px 50px", borderRadius: 50, background: `linear-gradient(90deg, ${COLORS.electric}, #2D8BFF)`, boxShadow: `0 0 ${40 + Math.sin(f / 6) * 16}px ${COLORS.cyan}aa, 0 12px 0 #0446a3`, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 40, color: COLORS.white, whiteSpace: "nowrap", letterSpacing: 0.5 }}>
            {TEXTS.s8Cta}
          </div>
        </div>
      </div>
      {/* flèches descendantes */}
      <div style={{ position: "absolute", top: 1060, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity: tw(f, [cta + 10, cta + 18], [0, 1]) }}>
        {[0, 1, 2].map((i) => {
          const k = ((f - cta - i * 6) % 30) / 30;
          return (
            <svg key={i} width={110} height={66} viewBox="0 0 110 66" style={{ marginTop: -14, opacity: Math.sin(Math.PI * Math.max(0, k)), translate: `0px ${k * 30}px` }}>
              <path d="M12 12 L55 52 L98 12" stroke={i === 1 ? COLORS.yellow : COLORS.cyan} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
