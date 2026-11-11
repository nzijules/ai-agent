import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { FONT } from "./theme";

/* ------------------------------------------------------------------
   A wall of phones scrolling in the background, each one playing a
   short looping motion-design ad (sneakers, burger, smartphone, etc.)
------------------------------------------------------------------- */

const L = 120; // loop length of each mini ad (frames)
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.out(Easing.back(1.6));
const EMOJI = '"Noto Color Emoji", sans-serif';

const fullBox: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: FONT,
  color: "#fff",
  overflow: "hidden",
};

const Emoji: React.FC<{ e: string; size: number; style?: React.CSSProperties }> = ({
  e,
  size,
  style,
}) => (
  <div style={{ fontFamily: EMOJI, fontSize: size, lineHeight: 1, ...style }}>{e}</div>
);

type AdProps = { t: number };

/* 1. Sneakers drop */
const AdSneaker: React.FC<AdProps> = ({ t }) => {
  const x = interpolate(t, [0, 22], [-260, 0], { ...cl, easing: ease });
  const rot = interpolate(t, [0, 22, 120], [-40, -12, -4], cl);
  const word = "AIR RUSH";
  return (
    <div style={{ ...fullBox, background: "linear-gradient(160deg,#FF7A00,#FF2E63)" }}>
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: 130,
          background: "rgba(255,255,255,0.25)",
          transform: `scale(${interpolate(t, [0, 30], [0.2, 1], { ...cl, easing: ease })})`,
          top: 150,
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: interpolate(t, [0, 26], [-200, 260 + i * 10], cl) - 200,
            top: 250 + i * 34,
            width: 120,
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.7)",
            opacity: interpolate(t, [10, 30], [1, 0], cl),
          }}
        />
      ))}
      <Emoji e="👟" size={170} style={{ transform: `translateX(${x}px) rotate(${rot}deg)`, marginTop: -40 }} />
      <div style={{ display: "flex", marginTop: 40, fontSize: 44, fontWeight: 900, letterSpacing: 2 }}>
        {word.split("").map((c, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(t, [24 + i * 3, 30 + i * 3], [0, 1], cl),
              transform: `translateY(${interpolate(t, [24 + i * 3, 30 + i * 3], [30, 0], cl)}px)`,
            }}
          >
            {c === " " ? " " : c}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: 24,
          background: "#111",
          padding: "10px 26px",
          borderRadius: 30,
          fontSize: 28,
          fontWeight: 800,
          transform: `scale(${interpolate(t, [52, 64], [0, 1], { ...cl, easing: ease })})`,
        }}
      >
        NEW DROP
      </div>
    </div>
  );
};

/* 2. Burger promo */
const AdBurger: React.FC<AdProps> = ({ t }) => {
  const y = interpolate(t, [0, 26], [-400, 0], { ...cl, easing: Easing.bounce });
  return (
    <div style={{ ...fullBox, background: "linear-gradient(170deg,#FFC300,#E8262F)" }}>
      <div style={{ fontSize: 46, fontWeight: 900, marginBottom: 20, opacity: interpolate(t, [20, 30], [0, 1], cl) }}>
        MENU XXL
      </div>
      <Emoji e="🍔" size={180} style={{ transform: `translateY(${y}px)` }} />
      <div style={{ display: "flex", gap: 30, marginTop: 10 }}>
        <Emoji e="🍟" size={80} style={{ transform: `translateX(${interpolate(t, [24, 40], [-300, 0], { ...cl, easing: ease })}px)` }} />
        <Emoji e="🥤" size={80} style={{ transform: `translateX(${interpolate(t, [28, 44], [300, 0], { ...cl, easing: ease })}px)` }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 20,
          width: 110,
          height: 110,
          borderRadius: 55,
          background: "#fff",
          color: "#E8262F",
          fontSize: 34,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(t, [50, 62], [0, 1], { ...cl, easing: ease })}) rotate(${t * 2}deg)`,
        }}
      >
        -30%
      </div>
    </div>
  );
};

/* 3. Smartphone launch */
const AdPhone: React.FC<AdProps> = ({ t }) => (
  <div style={{ ...fullBox, background: "radial-gradient(circle at 50% 40%,#5B2BFF,#12002E 70%)" }}>
    {[0, 1, 2].map((i) => {
      const p = ((t + i * 40) % 120) / 120;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 240 - 150 * p,
            width: 300 * p,
            height: 300 * p,
            borderRadius: "50%",
            border: "4px solid #B69CFF",
            opacity: 1 - p,
          }}
        />
      );
    })}
    <Emoji
      e="📱"
      size={170}
      style={{ transform: `perspective(600px) rotateY(${interpolate(t, [0, 120], [-60, 300])}deg)` }}
    />
    <div style={{ fontSize: 50, fontWeight: 900, marginTop: 40, letterSpacing: 4, opacity: interpolate(t, [20, 34], [0, 1], cl) }}>
      PRO X
    </div>
    <div style={{ fontSize: 24, fontWeight: 600, color: "#CBB8FF", opacity: interpolate(t, [34, 46], [0, 1], cl) }}>
      Bientôt disponible
    </div>
  </div>
);

/* 4. Mobile money */
const AdMoney: React.FC<AdProps> = ({ t }) => {
  const n = Math.round(interpolate(t, [20, 60], [0, 50000], cl) / 500) * 500;
  return (
    <div style={{ ...fullBox, background: "linear-gradient(165deg,#00C853,#00695C)" }}>
      <div
        style={{
          width: 230,
          height: 140,
          borderRadius: 20,
          background: "linear-gradient(135deg,#ffffff,#d6ffe8)",
          color: "#00695C",
          padding: 18,
          textAlign: "left",
          transform: `translateY(${interpolate(t, [0, 18], [300, 0], { ...cl, easing: ease })}px) rotate(-6deg)`,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800 }}>MoMo Pay</div>
        <div style={{ fontSize: 16, marginTop: 40, letterSpacing: 3 }}>•••• 2026</div>
      </div>
      <div style={{ fontSize: 50, fontWeight: 900, marginTop: 40 }}>+{n.toLocaleString("fr-FR").replace(/\s/g, " ")} F</div>
      <div style={{ fontSize: 26, fontWeight: 700, opacity: interpolate(t, [60, 70], [0, 1], cl) }}>
        Envoyé en 1 clic
      </div>
      <Emoji e="✅" size={70} style={{ marginTop: 16, transform: `scale(${interpolate(t, [62, 74], [0, 1], { ...cl, easing: ease })})` }} />
    </div>
  );
};

/* 5. Perfume / luxury */
const AdPerfume: React.FC<AdProps> = ({ t }) => (
  <div style={{ ...fullBox, background: "linear-gradient(180deg,#1A1208,#000)" }}>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const y = ((t * 3 + i * 110) % 700) - 80;
      return (
        <Emoji
          key={i}
          e="🌸"
          size={44}
          style={{ position: "absolute", left: 20 + ((i * 53) % 220), top: y, transform: `rotate(${t * 3 + i * 50}deg)`, opacity: 0.85 }}
        />
      );
    })}
    <Emoji e="💎" size={140} style={{ transform: `scale(${interpolate(t, [0, 30], [0.3, 1], { ...cl, easing: ease })})` }} />
    <div
      style={{
        fontSize: 54,
        fontWeight: 800,
        marginTop: 34,
        letterSpacing: interpolate(t, [10, 60], [30, 10], cl),
        color: "#E9C46A",
        opacity: interpolate(t, [10, 40], [0, 1], cl),
      }}
    >
      ÉCLAT
    </div>
    <div style={{ fontSize: 22, color: "#C9B58A", letterSpacing: 6, opacity: interpolate(t, [40, 60], [0, 1], cl) }}>
      EAU DE PARFUM
    </div>
  </div>
);

/* 6. Fitness */
const AdFit: React.FC<AdProps> = ({ t }) => {
  const p = interpolate(t, [10, 80], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  const R = 90;
  const c = 2 * Math.PI * R;
  return (
    <div style={{ ...fullBox, background: "linear-gradient(160deg,#00B4FF,#2B2BFF)" }}>
      <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 20 }}>PROGRAMME</div>
      <div style={{ position: "relative", width: 220, height: 220 }}>
        <svg width={220} height={220} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={110} cy={110} r={R} stroke="rgba(255,255,255,0.25)" strokeWidth={16} fill="none" />
          <circle cx={110} cy={110} r={R} stroke="#FFD60A" strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
        </svg>
        <Emoji e="🏋️" size={90} style={{ position: "absolute", left: 65, top: 62, transform: `translateY(${Math.sin(t / 5) * 8}px)` }} />
      </div>
      <div style={{ fontSize: 56, fontWeight: 900, marginTop: 20 }}>{Math.round(p * 30)} JOURS</div>
    </div>
  );
};

/* 7. Coffee */
const AdCoffee: React.FC<AdProps> = ({ t }) => (
  <div style={{ ...fullBox, background: "linear-gradient(170deg,#C68B59,#4E2A12)" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: 150 - ((t * 1.5 + i * 30) % 90),
          left: 120 + i * 22 + Math.sin((t + i * 20) / 8) * 10,
          width: 12,
          height: 60,
          borderRadius: 6,
          background: "rgba(255,255,255,0.5)",
          filter: "blur(4px)",
          opacity: 1 - ((t * 1.5 + i * 30) % 90) / 90,
        }}
      />
    ))}
    <Emoji e="☕" size={170} style={{ transform: `scale(${interpolate(t, [0, 24], [0.4, 1], { ...cl, easing: ease })})` }} />
    <div style={{ fontSize: 48, fontWeight: 900, marginTop: 30, transform: `translateX(${interpolate(t, [16, 34], [-300, 0], { ...cl, easing: ease })}px)` }}>
      Café Matin
    </div>
    <div style={{ fontSize: 24, fontWeight: 600, color: "#FFE3C4", opacity: interpolate(t, [36, 48], [0, 1], cl) }}>
      Ouvert dès 6h
    </div>
  </div>
);

/* 8. Travel */
const AdTravel: React.FC<AdProps> = ({ t }) => {
  const p = interpolate(t, [0, 70], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ ...fullBox, background: "linear-gradient(180deg,#4FC3F7,#0D47A1)" }}>
      <svg width={260} height={160} style={{ position: "absolute", top: 160 }}>
        <path d="M 10 140 Q 130 -40 250 140" stroke="#fff" strokeWidth={4} strokeDasharray="10 10" fill="none" opacity={0.7} />
      </svg>
      <Emoji
        e="✈️"
        size={80}
        style={{
          position: "absolute",
          top: 160 + (1 - Math.sin(p * Math.PI)) * 120 - 20,
          left: 10 + p * 230 - 40,
          transform: `rotate(${interpolate(p, [0, 1], [-30, 40])}deg)`,
        }}
      />
      <div style={{ marginTop: 220, fontSize: 40, fontWeight: 900 }}>ABIDJAN → DAKAR</div>
      <div
        style={{
          marginTop: 16,
          background: "#FFD60A",
          color: "#0D47A1",
          padding: "8px 24px",
          borderRadius: 24,
          fontSize: 28,
          fontWeight: 900,
          transform: `scale(${interpolate(t, [60, 72], [0, 1], { ...cl, easing: ease })})`,
        }}
      >
        dès 89 000 F
      </div>
    </div>
  );
};

const ADS = [AdSneaker, AdBurger, AdPhone, AdMoney, AdPerfume, AdFit, AdCoffee, AdTravel];

/* Phone mockup */
const PW = 300;
const PH = 620;
const Phone: React.FC<{ ad: number; offset: number }> = ({ ad, offset }) => {
  const frame = useCurrentFrame();
  const Ad = ADS[ad % ADS.length];
  const t = (frame + offset) % L;
  return (
    <div
      style={{
        width: PW,
        height: PH,
        borderRadius: 46,
        background: "#0b0b0f",
        padding: 10,
        boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 0 0 2px #2a2a35",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 37, overflow: "hidden" }}>
        <Ad t={t} />
        {/* dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            width: 90,
            height: 26,
            marginLeft: -45,
            borderRadius: 13,
            background: "#000",
          }}
        />
        {/* video progress bar */}
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 18, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.3)" }}>
          <div style={{ width: `${(t / L) * 100}%`, height: "100%", borderRadius: 3, background: "#fff" }} />
        </div>
      </div>
    </div>
  );
};

const GAP = 40;
const Column: React.FC<{ ads: number[]; speed: number; x: number; phase: number }> = ({
  ads,
  speed,
  x,
  phase,
}) => {
  const frame = useCurrentFrame();
  const stack = ads.length * (PH + GAP);
  const raw = phase + frame * speed;
  const y = -(((raw % stack) + stack) % stack);
  const items = [...ads, ...ads, ...ads];
  return (
    <div style={{ position: "absolute", left: x, top: y - stack * 0.5, display: "flex", flexDirection: "column", gap: GAP }}>
      {items.map((a, i) => (
        <Phone key={i} ad={a} offset={(a * 37 + i * 13) % L} />
      ))}
    </div>
  );
};

export const PhoneWall: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, dur - 18, dur], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -170,
          top: -260,
          width: 1420,
          height: 2440,
          transform: "rotate(-12deg)",
        }}
      >
        <Column ads={[0, 3, 6, 1]} speed={2.4} x={30} phase={0} />
        <Column ads={[2, 5, 7, 4]} speed={-2.0} x={370} phase={300} />
        <Column ads={[4, 1, 0, 6]} speed={2.8} x={710} phase={150} />
        <Column ads={[7, 2, 5, 3]} speed={-2.3} x={1050} phase={480} />
      </div>
      {/* darken the centre so the headline stays readable */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 620px 520px at 50% 50%, rgba(4,10,44,0.88) 0%, rgba(4,10,44,0.6) 55%, rgba(4,10,44,0.25) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
