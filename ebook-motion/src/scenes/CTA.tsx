import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { ArrowDown } from "../components/Icons";
import { C, body, display, gradText } from "../theme";

// 52s – 64s : "J'ai préparé un guide pratique et pas à pas pour toi. Télécharge-le maintenant à seulement 10 000 francs,
//              et commence à écrire et vendre ton premier ebook aujourd'hui !"
const CONFETTI = new Array(70).fill(0).map((_, i) => ({
  a: random(`ca${i}`) * Math.PI * 2,
  v: 14 + random(`cv${i}`) * 26,
  c: [C.cyan, C.blue, C.gold, C.white, "#FFB000"][i % 5],
  r: random(`cr${i}`) * 360,
  w: 10 + random(`cw${i}`) * 14,
}));

const Confetti: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 90) return null;
  return (
    <div style={{ position: "absolute", left: 540, top: 820 }}>
      {CONFETTI.map((c, i) => {
        const t = f;
        const x = Math.cos(c.a) * c.v * t;
        const y = Math.sin(c.a) * c.v * t + 0.9 * t * t;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: c.w,
              height: c.w * 0.5,
              background: c.c,
              transform: `rotate(${c.r + t * 12}deg)`,
              opacity: interpolate(t, [50, 90], [1, 0], clamp),
            }}
          />
        );
      })}
    </div>
  );
};

const COVER_W = 520;
const COVER_H = Math.round((COVER_W * 1395) / 913);

/** The real AROSOFT guide (public/guide-cover.png, cut out from the mockup). */
const GuideCover: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(8, { damping: 12 });
  const float = Math.sin(f / 18) * 14;
  const tilt = Math.sin(f / 30) * 6;
  const src = staticFile("guide-cover.png");
  return (
    <div
      style={{
        position: "relative",
        width: COVER_W,
        height: COVER_H,
        transform: `perspective(1200px) rotateY(${interpolate(p, [0, 1], [-70, 0]) + tilt}deg) translateY(${float + (1 - p) * 200}px) scale(${0.5 + p * 0.5})`,
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
        filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.75)) drop-shadow(0 0 50px rgba(255,204,0,0.35))",
      }}
    >
      <Img src={src} style={{ width: "100%", height: "100%", display: "block" }} />
      {/* sheen, clipped to the book's shape */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            bottom: -100,
            left: interpolate((f % 120) / 120, [0, 0.4], [-200, 700], clamp),
            width: 90,
            transform: "rotate(18deg)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          }}
        />
      </div>
    </div>
  );
};

export const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const head = usePop(4);
  const price = useSpring(130, { damping: 8, stiffness: 160 });
  const btn = useSpring(92, { damping: 12 });
  const sub = usePop(172);
  const pulse = 1 + Math.max(0, Math.sin((f - 92) / 5)) * 0.05 * (f > 110 ? 1 : 0);
  const flash = interpolate(f, [0, 12], [1, 0], clamp);
  const arrowY = Math.sin(f / 5) * 14;

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, rgba(255,204,0,0.45), transparent 55%)` }} />
      <div style={{ ...head, marginTop: 270, textAlign: "center", fontFamily: display, fontWeight: 800, fontSize: 60, color: C.white, lineHeight: 1.1 }}>
        J&apos;ai préparé pour toi
        <div style={{ fontWeight: 900, fontSize: 76, ...gradText() }}>un guide pratique</div>
      </div>

      <div style={{ marginTop: 50, position: "relative" }}>
        {/* rotating light rays */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 1100,
            height: 1100,
            marginLeft: -550,
            marginTop: -550,
            background: `repeating-conic-gradient(from ${f}deg, rgba(255,204,0,0.10) 0deg 8deg, transparent 8deg 22deg)`,
            maskImage: "radial-gradient(circle, black 20%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 65%)",
          }}
        />
        <GuideCover />

        {/* price burst */}
        <div
          style={{
            position: "absolute",
            right: -190,
            top: 560,
            width: 300,
            height: 300,
            transform: `scale(${price}) rotate(${interpolate(price, [0, 1], [-90, 10])}deg)`,
          }}
        >
          <svg width={300} height={300} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, transform: `rotate(${f * 0.8}deg)` }}>
            <polygon
              fill={C.gold}
              points={new Array(28)
                .fill(0)
                .map((_, i) => {
                  const r = i % 2 ? 41 : 50;
                  const a = (i / 28) * Math.PI * 2;
                  return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
                })
                .join(" ")}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.bg, fontFamily: display }}>
            <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 2 }}>SEULEMENT</div>
            <div style={{ fontWeight: 900, fontSize: 64, lineHeight: 1 }}>10.000F</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1430, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: btn, transform: `translateY(${arrowY}px)` }}>
          <ArrowDown size={70} color={C.cyan} />
        </div>
        <div
          style={{
            marginTop: 10,
            padding: "36px 60px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.blue} 50%, ${C.royal})`,
            boxShadow: `0 0 ${40 + 30 * (pulse - 1) * 20}px rgba(255,204,0,0.8), 0 20px 50px rgba(0,0,0,0.5)`,
            fontFamily: display,
            fontWeight: 900,
            fontSize: 54,
            color: C.navy,
            letterSpacing: 1,
            whiteSpace: "nowrap",
            opacity: btn,
            transform: `scale(${btn * pulse})`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          TÉLÉCHARGE MAINTENANT
          <div
            style={{
              position: "absolute",
              top: -40,
              bottom: -40,
              left: interpolate((f % 60) / 60, [0, 0.5], [-150, 900], clamp),
              width: 80,
              transform: "rotate(20deg)",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />
        </div>
      </div>

      <div style={{ ...sub, position: "absolute", top: 1700, width: 920, textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 44, color: C.white, lineHeight: 1.3 }}>
        Écris et vends ton <span style={{ color: C.gold }}>premier ebook</span> aujourd&apos;hui.
        <div style={{ marginTop: 18, fontSize: 32, fontWeight: 500, color: C.soft }}>
          Disponible sur <span style={{ color: C.blue, fontWeight: 700 }}>Chariow</span> · Mobile Money & carte
        </div>
      </div>

      <Confetti />
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
