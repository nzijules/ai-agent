import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT_TITLE, PRICE, TEXTS } from "../config";
import { shake, sp, tw, EASE_IN_OUT } from "../anim";
import { at, Headline } from "../components/Kinetic";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { Book3D } from "../components/Book3D";

/** Livre 3D avec reflet au sol, éclairage bleu électrique. */
export const HeroBook: React.FC<{ f: number; width: number; rotY: number; enter: number }> = ({ f, width, rotY, enter }) => {
  const H = width * (1256 / 800);
  return (
    <div style={{ position: "relative", width, height: H, scale: String(0.6 + 0.4 * enter), opacity: Math.min(1, enter * 1.4), translate: `0px ${(1 - enter) * 200 + Math.sin(f / 22) * 8}px` }}>
      <div style={{ position: "absolute", left: -width * 0.4, top: -H * 0.15, width: width * 1.8, height: H * 1.3, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.electric}aa 0%, ${COLORS.cyan}22 45%, transparent 70%)`, filter: "blur(30px)" }} />
      <Book3D width={width} rotY={rotY} rotX={6} />
      {/* reflet au sol */}
      <div style={{ position: "absolute", left: 0, top: H + 10, transform: "scaleY(-1)", opacity: 0.28, maskImage: "linear-gradient(to top, black 0%, transparent 35%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 35%)", filter: "blur(2px)" }}>
        <Book3D width={width} rotY={rotY} rotX={-6} glow={0} />
      </div>
      {/* ombre portée */}
      <div style={{ position: "absolute", left: width * 0.05, top: H - 10, width: width * 0.9, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.55)", filter: "blur(18px)" }} />
    </div>
  );
};

/** SCÈNE 7 — La révélation du prix. */
export const S7Price: React.FC = () => {
  const f = useCurrentFrame();
  const price = at("s7", 46.95);
  const sub = at("s7", 48.35);
  const enter = sp(f, 2, 15, 1, 90);
  const sh = shake(f, price, 16, 14);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <Background brightness={1.4} grid={1.3} />
      <Particles count={40} seed="s7" opacity={0.8} speed={0.8} />
      <Particles count={26} seed="s7b" burstAt={price} area={{ x: 0, y: 900, w: 1080, h: 220 }} color={COLORS.yellow} />

      <div style={{ position: "absolute", top: 185, width: "100%" }}>
        <Headline lines={[TEXTS.s7Title]} frame={f} start={6} size={70} stagger={3} />
      </div>
      <div style={{ position: "absolute", top: 310, left: (1080 - 380) / 2 }}>
        <HeroBook f={f} width={380} rotY={tw(f, [0, 60, 180], [-55, -22, -14], EASE_IN_OUT) + Math.sin(f / 26) * 4} enter={enter} />
      </div>

      {/* onde de choc */}
      <div style={{ position: "absolute", left: 540, top: 1020, width: 10, height: 10, borderRadius: "50%", border: `6px solid ${COLORS.yellow}`, translate: "-50% -50%", scale: String(tw(f, [price, price + 22], [1, 90])), opacity: tw(f, [price, price + 22], [0.8, 0]) }} />
      {/* prix */}
      {f >= price && (
        <div style={{ position: "absolute", top: 940, width: "100%", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              padding: "14px 50px 18px",
              borderRadius: 34,
              background: COLORS.yellow,
              boxShadow: `0 0 ${50 + Math.sin(f / 5) * 15}px ${COLORS.yellow}99, 0 14px 0 #B38F00`,
              scale: String(tw(f, [price, price + 7], [2.2, 1]) * (1 + Math.sin((f - price) / 8) * 0.012)),
              rotate: `${tw(f, [price, price + 8], [-8, -2])}deg`,
            }}
          >
            <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 132, color: COLORS.night, letterSpacing: -3, whiteSpace: "nowrap" }}>{PRICE}</span>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", top: 1160, width: "100%" }}>
        {f >= sub && <Headline lines={[TEXTS.s7Sub]} frame={f} start={sub} size={62} stagger={3} highlight={["VIDÉO"]} />}
      </div>
      <AbsoluteFill style={{ background: COLORS.yellow, opacity: tw(f, [price, price + 2, price + 10], [0, 0.35, 0]) }} />
    </AbsoluteFill>
  );
};
