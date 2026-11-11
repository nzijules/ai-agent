import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { COLORS, FONT_TITLE, TEXTS } from "../config";
import { shake, tw, EASE_IN_OUT } from "../anim";
import { at, Headline } from "../components/Kinetic";
import { Particles } from "../components/Particles";

/** SCÈNE 1 — Le hook : portrait d'Einstein en parallaxe + citation cinétique. */
export const S1Einstein: React.FC = () => {
  const f = useCurrentFrame();
  const qIn = at("s1", 1.68);
  const qOut = at("s1", 4.96);
  const question = at("s1", 5.15);
  const sh = shake(f, question, 22, 16);
  const punch = tw(f, [question, question + 8], [1.04, 1]);
  const dim = tw(f, [question - 4, question + 6], [1, 0.55]);
  const W = 1080 * 1.02;
  const H = (W * 780) / 520;
  const imgBase: React.CSSProperties = { position: "absolute", left: (1080 - W) / 2, top: -150, width: W, height: H };
  return (
    <AbsoluteFill style={{ backgroundColor: "#03060f", translate: `${sh.x}px ${sh.y}px`, scale: String(punch) }}>
      {/* Portrait en deux couches (parallaxe) */}
      <AbsoluteFill
        style={{
          opacity: tw(f, [0, 34], [0, 1]) * dim,
          maskImage: "linear-gradient(to bottom, black 55%, transparent 74%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 74%)",
        }}
      >
        <Img
          src={staticFile("img/einstein.jpg")}
          style={{
            ...imgBase,
            filter: "blur(5px) brightness(0.55) saturate(0.8)",
            scale: String(tw(f, [0, 230], [1.12, 1.2], EASE_IN_OUT)),
            translate: `${tw(f, [0, 230], [18, -18], EASE_IN_OUT)}px 0px`,
          }}
        />
        <Img
          src={staticFile("img/einstein_fg.png")}
          style={{
            ...imgBase,
            filter: `brightness(${tw(f, [0, 40], [0.6, 1])}) contrast(1.05)`,
            scale: String(tw(f, [0, 230], [1.0, 1.1], EASE_IN_OUT)),
            translate: `${tw(f, [0, 230], [-10, 10], EASE_IN_OUT)}px ${tw(f, [0, 230], [10, -24], EASE_IN_OUT)}px`,
          }}
        />
        {/* éclairage bleu latéral */}
        <AbsoluteFill style={{ background: `linear-gradient(100deg, ${COLORS.electric}55 0%, transparent 35%, transparent 70%, ${COLORS.cyan}33 100%)`, mixBlendMode: "screen" }} />
        {/* balayage lumineux */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)",
            translate: `${tw(f, [8, 60], [-1200, 1200])}px 0px`,
          }}
        />
      </AbsoluteFill>
      <Particles count={28} seed="s1" opacity={0.6} speed={0.6} />

      {/* Étiquette */}
      <div style={{ position: "absolute", top: 960, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: tw(f, [12, 26], [0, 1]) * tw(f, [qOut, qOut + 8], [1, 0]) }}>
        <div style={{ width: tw(f, [12, 34], [0, 70]), height: 5, background: COLORS.yellow, borderRadius: 3 }} />
        <span style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 34, letterSpacing: 12, color: COLORS.white }}>{TEXTS.s1Label}</span>
        <div style={{ width: tw(f, [12, 34], [0, 70]), height: 5, background: COLORS.yellow, borderRadius: 3 }} />
      </div>

      {/* Citation */}
      <div style={{ position: "absolute", top: 1045, left: 60, right: 60 }}>
        {f < qOut + 14 && (
          <Headline lines={TEXTS.s1Quote} frame={f} start={qIn} stagger={7} size={92} marker={["SIMPLEMENT"]} exitAt={qOut} />
        )}
      </div>
      {/* Question choc */}
      {f >= question && (
        <div
          style={{
            position: "absolute",
            top: 1060,
            left: 50,
            right: 50,
            scale: String(tw(f, [question, question + 7], [1.6, 1])),
            opacity: tw(f, [question, question + 4], [0, 1]),
          }}
        >
          <Headline lines={TEXTS.s1Question} frame={f} start={question} stagger={2} size={104} highlight={["COMPRIS"]} />
        </div>
      )}
      {/* flash d'impact */}
      <AbsoluteFill style={{ background: COLORS.white, opacity: tw(f, [question, question + 2, question + 9], [0, 0.45, 0]), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
