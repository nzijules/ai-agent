import React from "react";
import { AbsoluteFill } from "remotion";
import { IconBackup, IconLock, IconShare, IconShield, IconUpdate } from "../components/Icons";
import { Logo } from "../components/Logo";
import { Person } from "../components/Person";
import { PixelSwarm } from "../components/PixelSwarm";
import { WordReveal } from "../components/WordReveal";
import { BRAND } from "../config/video";
import { cue } from "../data/script";
import { EASE_IN_OUT, EASE_OUT, tw, useSceneClock } from "../lib/anim";
import { FONT } from "../fonts";
import { C } from "../theme";

const S = "s5" as const;

const TIPS = [
  { id: "s5.b", icon: [IconLock, IconUpdate], title: "Verrouiller et mettre à jour", lines: ["Code robuste ou biométrie", "Système et applications à jour"] },
  { id: "s5.c", icon: [IconBackup, IconLock], title: "Maîtriser ses sauvegardes", lines: ["Savoir où elles sont stockées", "Activer le chiffrement"] },
  { id: "s5.d", icon: [IconShare, IconShield], title: "Partager avec prudence", lines: ["Une copie envoyée vous échappe", "Vérifier destinataires et accès"] },
];

const TipCard: React.FC<{ t: number; at: number; depth: number; tip: (typeof TIPS)[number]; index: number }> = ({ t, at, depth, tip, index }) => {
  const pin = tw(t, [at - 0.2, at + 0.7], [0, 1], EASE_OUT);
  if (pin <= 0) return null;
  const [I1, I2] = tip.icon;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        width: 900,
        top: 0,
        transform: `translateX(${(1 - pin) * 700}px) translateY(${-depth * 46}px) translateZ(${-depth * 170}px) rotateY(${(1 - pin) * -40}deg)`,
        opacity: pin * Math.max(0, 1 - depth * 0.45),
        filter: depth > 0 ? `brightness(${1 - depth * 0.3})` : undefined,
        padding: "30px 34px",
        borderRadius: 28,
        background: "linear-gradient(150deg, rgba(20,44,74,0.92), rgba(8,18,34,0.92))",
        border: `1.5px solid ${depth < 0.5 ? C.cyan : "#2A4A6A"}88`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 ${depth < 0.5 ? 40 : 0}px ${C.blue}33`,
        display: "flex",
        gap: 28,
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 120, height: 120, borderRadius: 26, background: `radial-gradient(circle, ${C.blue}55, ${C.bg} 80%)`, border: `1px solid ${C.cyan}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <I1 size={70} color={C.white} />
        <div style={{ position: "absolute", right: -12, bottom: -12, width: 54, height: 54, borderRadius: 27, background: C.bg, border: `2px solid ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I2 size={32} color={C.cyan} />
        </div>
      </div>
      <div>
        <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.cyan, letterSpacing: 3 }}>{`RÉFLEXE 0${index + 1}`}</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 42, color: C.white, letterSpacing: -0.5, marginTop: 4 }}>{tip.title}</div>
        {tip.lines.map((l, k) => {
          const p = tw(t, [at + 0.6 + k * 0.35, at + 1.0 + k * 0.35], [0, 1]);
          return (
            <div key={k} style={{ fontFamily: FONT.ui, fontSize: 30, color: C.dim, marginTop: 8, opacity: p, translate: `${(1 - p) * 20}px 0px` }}>
              <span style={{ color: C.cyan }}>▸ </span>
              {l}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Scene5Protection: React.FC = () => {
  const { t, sp, D } = useSceneClock();
  const cA = cue("s5.a", S);
  const cE = cue("s5.e", S);
  const cF = cue("s5.f", S);
  const ats = TIPS.map((x) => cue(x.id, S));

  const tipsOut = tw(t, [cE - 0.5, cE + 0.2], [0, 1], EASE_IN_OUT);
  const statementOut = tw(t, [cF - 0.5, cF + 0.1], [0, 1], EASE_IN_OUT);
  const shield = sp(cA + 0.3, { damping: 14, stiffness: 70 });
  const assemble = tw(t, [cF - 1.4, cF + 0.5], [0, 1], EASE_IN_OUT);
  const logoIn = tw(t, [cF + 0.3, cF + 1.2], [0, 1], EASE_OUT);
  const sweep = tw(t, [cF + 1.0, cF + 2.2], [-0.3, 1.3], EASE_IN_OUT);
  const end = tw(t, [D - 0.8, D], [0, 1]);

  const depthOf = (i: number) => {
    let d = 0;
    for (let k = i + 1; k < TIPS.length; k++) d += tw(t, [ats[k] - 0.2, ats[k] + 0.6], [0, 1], EASE_OUT);
    return d;
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Partie 1 : citoyenne + bouclier + conseils */}
      <AbsoluteFill style={{ opacity: 1 - tipsOut, scale: String(1 + tipsOut * 0.1) }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 225 }}>
          <WordReveal text="PROTÉGEZ VOS DONNÉES" at={cA} size={84} weight={800} letterSpacing={1} colors={{ "DONNÉES": C.cyan }} />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 540 - 360, top: 880 + (1 - shield) * 80, opacity: 0.95 }}>
          <Person variant="citizen" width={720} lookX={0} lookY={0} tilt={Math.sin(t * 0.5) * 1.2} screenLight={0.5} lightColor={C.cyan} />
        </div>
        {/* bouclier hexagonal */}
        <div style={{ position: "absolute", left: 540 - 380, top: 760, width: 760, height: 900, scale: String(shield), opacity: Math.min(1, shield) * (1 - depthOf(-1) * 0.0) }}>
          <svg viewBox="0 0 760 900" width={760} height={900}>
            <defs>
              <linearGradient id="sh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.cyan} stopOpacity={0.55} />
                <stop offset="100%" stopColor={C.blue} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <path
              d="M380 40 L700 150 V420 C700 640 560 790 380 860 C200 790 60 640 60 420 V150 Z"
              fill="url(#sh)"
              fillOpacity={0.25}
              stroke={C.cyan}
              strokeWidth={4}
              strokeDasharray={2600}
              strokeDashoffset={2600 * (1 - tw(t, [cA + 0.3, cA + 2.2], [0, 1], EASE_IN_OUT))}
              style={{ filter: `drop-shadow(0 0 14px ${C.cyan})` }}
            />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, perspective: 1400 }}>
          {TIPS.map((tip, i) => (
            <TipCard key={tip.id} t={t} at={ats[i]} depth={depthOf(i)} tip={tip} index={i} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Partie 2 : message clé */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 220, opacity: 1 - statementOut, scale: String(1 + statementOut * 0.15) }}>
        <WordReveal text="Effacé de votre téléphone" at={cE + 0.1} size={80} weight={700} stagger={0.14} />
        <div style={{ height: 10 }} />
        <WordReveal text="≠" at={cE + 0.9} size={140} color={C.orange} colors={{ "≠": C.orange }} />
        <div style={{ height: 10 }} />
        <WordReveal text="effacé partout." at={cE + 1.4} size={92} weight={800} color={C.cyan} stagger={0.14} />
      </AbsoluteFill>

      {/* Partie 3 : signature AroSoft */}
      <AbsoluteFill style={{ opacity: tw(t, [cF - 1.3, cF - 0.5], [0, 1]) * (1 - logoIn * 0.85) }}>
      <PixelSwarm
        seed="s5-sign"
        count={90}
        p={1}
        t={t}
        origin={{ x: -100, y: 0, w: 1280, h: 1920 }}
        drift={{ x: 0, y: 0 }}
        spread={0}
        fadeTo={1}
        converge={{ x: 540, y: 820, p: assemble, radius: 260 }}
        colors={[C.blue, "#1E5BFF", "#0B3FB8", C.cyan]}
        minSize={10}
        maxSize={26}
      />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 470, opacity: logoIn * (1 - end) }}>
        <div style={{ position: "relative", scale: String(0.9 + 0.1 * logoIn), filter: logoIn < 1 ? `blur(${(1 - logoIn) * 12}px)` : undefined }}>
          <Logo width={780} />
          {/* balayage lumineux */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent ${sweep * 100 - 12}%, rgba(255,255,255,0.35) ${sweep * 100}%, transparent ${sweep * 100 + 12}%)`,
              mixBlendMode: "overlay",
            }}
          />
        </div>
        <div style={{ marginTop: 40, fontFamily: FONT.ui, fontWeight: 500, fontSize: 30, color: C.dim, letterSpacing: 3, opacity: tw(t, [cF + 1.8, cF + 2.4], [0, 1]) }}>
          Sensibilisation · Mobile Digital Forensics
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 20, opacity: tw(t, [cF + 2.0, cF + 2.6], [0, 1]) }}>
          {BRAND.tagline.map((w, i) => (
            <span key={w} style={{ fontFamily: FONT.mono, fontSize: 24, color: C.cyan, opacity: tw(t, [cF + 2.1 + i * 0.25, cF + 2.5 + i * 0.25], [0, 1]) }}>
              #{w.toLowerCase()}
            </span>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#05080F", opacity: end }} />
    </AbsoluteFill>
  );
};
