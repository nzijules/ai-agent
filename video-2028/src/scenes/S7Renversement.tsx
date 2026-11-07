import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Glass, ScrambleText } from "../components/Common";
import { StandingBack } from "../components/People";
import { C, F, ease, ip, useT } from "../lib/theme";

export const S7Renversement: React.FC = () => {
  const t = useT();
  const dawn = ip(t, [52.7, 55.5], [0, 1], ease.inOut);
  const posture = ip(t, [53.2, 54.8], [0.25, 1], ease.inOut);
  const arm = ip(t, [55.4, 56.4], [0, 0.72], ease.out) + Math.sin(t * 2) * 0.02 * (t > 56.4 ? 1 : 0);
  const morphAt = 56.6;

  const panel = (at: number) => ({
    p: ip(t, [at, at + 0.6], [0, 1], ease.back),
    f: Math.sin(t * 1.3 + at) * 6,
  });
  const a = panel(55.6);
  const b = panel(56.9);
  const c = panel(58.3);

  return (
    <AbsoluteFill>
      <Backdrop grid={0.35} particles={40} hue={C.blue} hue2={C.cyan} intensity={0.8 + dawn * 0.8} speed={1.4} />
      {/* aube : lumière qui monte de l'horizon */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 45% at 50% 100%, ${C.cyan}${Math.round(dawn * 70)
            .toString(16)
            .padStart(2, "0")} 0%, ${C.blue}${Math.round(dawn * 50)
            .toString(16)
            .padStart(2, "0")} 40%, transparent 75%)`,
        }}
      />
      {/* rayons */}
      <AbsoluteFill style={{ opacity: dawn * 0.35, mixBlendMode: "screen" }}>
        {new Array(9).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540,
              top: 1400,
              width: 6,
              height: 1500,
              transformOrigin: "50% 100%",
              translate: "-3px -1500px",
              rotate: `${(i - 4) * 12 + Math.sin(t * 0.5 + i) * 2}deg`,
              background: `linear-gradient(to top, ${C.cyan}, transparent)`,
              filter: "blur(6px)",
            }}
          />
        ))}
      </AbsoluteFill>

      {/* MENACE → OPPORTUNITÉ */}
      <div style={{ position: "absolute", top: 370, width: "100%", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <ScrambleText
            from="MENACE"
            to="OPPORTUNITÉ"
            at={morphAt}
            dur={0.9}
            style={{
              fontFamily: F.display,
              fontWeight: 700,
              fontSize: 110,
              letterSpacing: -1,
              color: t >= morphAt + 0.6 ? C.cyan : C.orange,
              textShadow: `0 0 40px ${t >= morphAt + 0.6 ? C.cyan : C.orange}77`,
              opacity: ip(t, [53.4, 53.9], [0, 1]),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              top: "52%",
              height: 8,
              background: C.white,
              scale: `${ip(t, [54.6, 55.2], [0, 1]) * ip(t, [morphAt - 0.2, morphAt], [1, 0])} 1`,
              transformOrigin: "0% 50%",
            }}
          />
        </div>
      </div>

      {/* Interfaces pilotées */}
      <Glass style={{ left: 60, top: 560 + a.f, width: 400, padding: 24, opacity: a.p, scale: `${0.7 + 0.3 * a.p}` }}>
        <div style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>Pilotage de projet</div>
        {[0.15, 0.35, 0.55].map((x0, i) => (
          <div key={i} style={{ height: 18, position: "relative", marginBottom: 12, background: "rgba(255,255,255,0.06)", borderRadius: 9 }}>
            <div
              style={{
                position: "absolute",
                left: `${x0 * 100}%`,
                width: `${ip(t, [56 + i * 0.3, 57 + i * 0.3], [0, 40])}%`,
                height: "100%",
                borderRadius: 9,
                background: i === 2 ? C.cyan : C.blue,
              }}
            />
          </div>
        ))}
      </Glass>
      <Glass style={{ left: 640, top: 590 + b.f, width: 390, padding: 24, opacity: b.p, scale: `${0.7 + 0.3 * b.p}` }}>
        <div style={{ fontSize: 30, fontWeight: 600, marginBottom: 10 }}>Analyse de scénarios</div>
        <svg width="342" height="130" viewBox="0 0 342 130">
          {[
            [C.dim, "M0 100 C80 90 160 95 342 70"],
            [C.blue, "M0 100 C90 80 180 60 342 40"],
            [C.cyan, "M0 100 C100 70 200 30 342 10"],
          ].map(([col, d], i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={col}
              strokeWidth={i === 2 ? 5 : 3}
              strokeDasharray="420"
              strokeDashoffset={420 * (1 - ip(t, [57.2 + i * 0.2, 58.2 + i * 0.2], [0, 1]))}
            />
          ))}
        </svg>
        <div style={{ fontFamily: F.mono, fontSize: 22, color: C.dim }}>A · B · C</div>
      </Glass>
      <Glass glow={C.cyan} style={{ left: 640, top: 900 + c.f, width: 390, padding: 24, opacity: c.p, scale: `${0.7 + 0.3 * c.p}` }}>
        <div style={{ fontSize: 30, fontWeight: 600 }}>Décision</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 44,
              background: C.cyan,
              color: C.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 28,
              scale: `${ip(t, [59.2, 59.6], [0, 1], ease.back)}`,
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: 28 }}>Scénario C validé</div>
        </div>
      </Glass>

      {/* Le professionnel se redresse et pilote */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 610,
          translate: "-50% 0",
          filter: `drop-shadow(0 0 30px ${C.cyan}55)`,
        }}
      >
        <StandingBack id="pilot" height={820} posture={posture} armRaise={arm} skin={C.skin[2]} />
      </div>
    </AbsoluteFill>
  );
};
