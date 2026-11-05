import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { PlayIcon } from "../components/Icons";
import { StepBadge } from "../components/StepBadge";
import { C, body, display, gradText } from "../theme";

// 27s – 35s : "Étape 2 : tu lances tes vidéos en publicité sur Meta Ads et TikTok Ads, et tu cibles exactement les bonnes personnes."
const DOTS = new Array(36).fill(0).map((_, i) => {
  const r = 150 + random(`r${i}`) * 300;
  const a = random(`a${i}`) * Math.PI * 2;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.75, hit: random(`h${i}`) > 0.55, at: 155 + random(`t${i}`) * 70 };
});

const Pill: React.FC<{ label: string; delay: number; dir: number; style: React.CSSProperties }> = ({ label, delay, dir, style }) => {
  const p = useSpring(delay, { damping: 12 });
  return (
    <div
      style={{
        padding: "22px 40px",
        borderRadius: 999,
        fontFamily: display,
        fontWeight: 900,
        fontSize: 52,
        color: C.white,
        opacity: p,
        transform: `translateX(${(1 - p) * dir * 600}px) rotate(${dir * -4}deg)`,
        ...style,
      }}
    >
      {label}
    </div>
  );
};

export const Step2: React.FC = () => {
  const f = useCurrentFrame();
  const title = usePop(8);
  const radar = useSpring(60, { damping: 18 });
  const reached = Math.round(interpolate(f, [150, 235], [0, 250000], clamp));
  const counter = usePop(150);

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 300 }}>
        <StepBadge n="02" />
      </div>
      <div style={{ ...title, marginTop: 30, textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 86, lineHeight: 1.05, color: C.white }}>
        Lance ta pub,
        <br />
        <span style={gradText()}>vise juste</span>
      </div>

      <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
        <Pill label="Meta Ads" delay={88} dir={-1} style={{ background: "linear-gradient(135deg, #0A84FF, #0047E0)", boxShadow: "0 0 40px rgba(10,132,255,0.6)" }} />
        <Pill
          label="TikTok Ads"
          delay={112}
          dir={1}
          style={{ background: "#0b0b12", border: "3px solid #fff", textShadow: "-4px 0 #25F4EE, 4px 0 #FE2C55", boxShadow: "0 0 40px rgba(254,44,85,0.4)" }}
        />
      </div>

      {/* radar targeting */}
      <div style={{ position: "absolute", top: 1180, left: 540, width: 0, height: 0, transform: `scale(${radar})` }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i * 300,
              height: i * 225,
              left: -i * 150,
              top: -i * 112.5,
              borderRadius: "50%",
              border: "2px solid rgba(62,230,255,0.3)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 675,
            left: -450,
            top: -337.5,
            borderRadius: "50%",
            background: `conic-gradient(from ${f * 4}deg, rgba(62,230,255,0.35), transparent 18%)`,
          }}
        />
        {DOTS.map((d, i) => {
          const on = d.hit && f > d.at;
          const p = interpolate(f, [d.at, d.at + 10], [0, 1], clamp);
          return (
            <React.Fragment key={i}>
              {on && (
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                  <line x1={0} y1={0} x2={d.x * p} y2={d.y * p} stroke={C.cyan} strokeWidth={2} opacity={0.5} />
                </svg>
              )}
              <div
                style={{
                  position: "absolute",
                  left: d.x - 13,
                  top: d.y - 13,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: on ? C.cyan : "rgba(255,255,255,0.35)",
                  boxShadow: on ? `0 0 ${20 * p}px ${C.cyan}` : "none",
                  transform: `scale(${on ? 1 + 0.4 * p : 1})`,
                }}
              />
            </React.Fragment>
          );
        })}
        {/* phone in center */}
        <div
          style={{
            position: "absolute",
            left: -95,
            top: -165,
            width: 190,
            height: 330,
            borderRadius: 30,
            padding: 8,
            background: "linear-gradient(160deg, #2a3a6a, #0b1430)",
            boxShadow: "0 0 50px rgba(10,132,255,0.7)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
              background: `linear-gradient(${f * 3}deg, ${C.blue}, #6B7CFF, ${C.cyan})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <PlayIcon size={60} />
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, color: C.white, background: "rgba(0,0,0,0.35)", padding: "4px 12px", borderRadius: 8 }}>
              Sponsorisé
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...counter, position: "absolute", top: 1640, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 92, color: C.white }}>{reached.toLocaleString("fr-FR")}</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 42, color: C.soft }}>personnes ciblées</div>
      </div>
    </AbsoluteFill>
  );
};
