import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import {
  beatPulse,
  CheckChip,
  clamp,
  Glass,
  PopWords,
  Shockwave,
  Spark,
  StepHeader,
  Terminal,
  Typewriter,
  useSpr,
} from "./components";
import { C, F, GOLD, GRAD } from "./theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  children,
  gap = 30,
  style,
}) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap,
      padding: "0 70px",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* 1 — Accroche --------------------------------------------------------- */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = (d: number) => interpolate(frame, [d, d + 10], [0, 100], clamp);
  const Neg: React.FC<{ text: string; d: number }> = ({ text, d }) => {
    const s = useSpr(d - 8, 11);
    return (
      <div
        style={{
          position: "relative",
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 66,
          color: C.ink,
          opacity: s,
          transform: `translateX(${(1 - s) * 200}px)`,
        }}
      >
        {text}
        <div
          style={{
            position: "absolute",
            left: -10,
            top: "52%",
            height: 10,
            width: `calc(${strike(d)}% + 20px)`,
            background: C.coral,
            borderRadius: 5,
            boxShadow: `0 0 20px ${C.coral}`,
            transform: "rotate(-3deg)",
          }}
        />
      </div>
    );
  };
  return (
    <Center gap={20}>
      <PopWords text="Et si tu pouvais" size={70} font={F.body} weight={700} delay={4} />
      <PopWords text="CRÉER DES VIDÉOS" size={118} gradient delay={14} />
      <PopWords text="ANIMÉES ?" size={150} delay={26} />
      <div style={{ height: 40 }} />
      <Neg text="sans savoir monter" d={64} />
      <Neg text="sans savoir coder" d={86} />
    </Center>
  );
};

/* 2 — Titre ------------------------------------------------------------ */
export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ["VIBE", "MOTION", "DESIGN"];
  const pulse = beatPulse(frame + 135);
  const badge = useSpr(60, 10);
  const sub = useSpr(80, 12);
  return (
    <Center gap={0}>
      {/* anneaux rotatifs */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {[700, 900, 1100].map((s, i) => (
          <div
            key={s}
            style={{
              position: "absolute",
              width: s * (1 + pulse * 0.03),
              height: s * (1 + pulse * 0.03),
              borderRadius: "50%",
              border: `3px dashed ${[C.orange, C.violet, C.cyan][i]}`,
              opacity: 0.35,
              transform: `rotate(${frame * (i % 2 ? -0.6 : 0.8)}deg)`,
            }}
          />
        ))}
      </AbsoluteFill>
      <div
        style={{
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: 12,
          color: C.cyan,
          marginBottom: 20,
          opacity: interpolate(frame, [0, 15], [0, 1], clamp),
        }}
      >
        BIENVENUE DANS LE
      </div>
      {words.map((w, wi) => (
        <div key={w} style={{ display: "flex", perspective: 800 }}>
          {w.split("").map((ch, i) => {
            const d = 6 + wi * 10 + i * 2;
            const t = interpolate(frame, [d, d + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: F.display,
                  fontWeight: 900,
                  fontSize: wi === 1 ? 190 : 175,
                  lineHeight: 1,
                  color: wi === 1 ? "transparent" : C.ink,
                  backgroundImage: wi === 1 ? GRAD : undefined,
                  WebkitBackgroundClip: wi === 1 ? "text" : undefined,
                  backgroundClip: wi === 1 ? "text" : undefined,
                  transform: `rotateX(${(1 - t) * 90}deg) translateY(${(1 - t) * 60}px)`,
                  opacity: t,
                  letterSpacing: -4,
                  textShadow: wi === 1 ? undefined : "0 0 40px rgba(139,92,246,0.6)",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
      <div
        style={{
          marginTop: 50,
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 64,
          color: C.ink,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 40}px)`,
          textAlign: "center",
        }}
      >
        Tu décris. <span style={{ color: C.orange }}>L'IA anime.</span>
      </div>
      <div
        style={{
          marginTop: 40,
          padding: "16px 40px",
          borderRadius: 999,
          background: GRAD,
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 40,
          color: "#fff",
          transform: `scale(${badge * (1 + pulse * 0.05)})`,
          boxShadow: "0 0 50px rgba(255,94,126,0.6)",
        }}
      >
        ✦ Zéro compétence requise
      </div>
    </Center>
  );
};

/* 3 — L'outil : Claude Code ------------------------------------------- */
export const Tool: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSpr(4, 9);
  const name = useSpr(16, 12);
  const term = useSpr(48, 14);
  return (
    <Center gap={36}>
      <div
        style={{
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: 8,
          color: C.gold,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
        }}
      >
        TON OUTIL SECRET
      </div>
      <div style={{ position: "relative", width: 300, height: 300, transform: `scale(${logo})` }}>
        <div
          style={{
            position: "absolute",
            inset: -60,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.orange}88 0%, transparent 65%)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spark size={280} rotate={frame * 1.5 + (1 - logo) * 180} />
        </div>
      </div>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 900,
          fontSize: 140,
          color: C.ink,
          letterSpacing: -4,
          opacity: name,
          transform: `scale(${0.6 + 0.4 * name})`,
          textShadow: `0 0 50px ${C.orange}`,
          lineHeight: 1,
        }}
      >
        Claude Code
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontWeight: 500,
          fontSize: 46,
          color: C.dim,
          textAlign: "center",
          opacity: interpolate(frame, [28, 42], [0, 1], clamp),
        }}
      >
        L'assistant IA qui écrit le code
        <br />
        de ta vidéo <b style={{ color: C.ink }}>à ta place</b>
      </div>
      <div style={{ width: "100%", opacity: term, transform: `translateY(${(1 - term) * 300}px)` }}>
        <Terminal>
          <div>
            <span style={{ color: C.green }}>$</span> <Typewriter text="claude" start={60} cps={0.4} cursor={frame < 80} />
          </div>
          {frame > 84 ? (
            <div style={{ color: C.orange, marginTop: 10 }}>
              ✻ <Typewriter text="Bienvenue ! Que veux-tu créer ?" start={86} cps={1.2} />
            </div>
          ) : null}
        </Terminal>
      </div>
    </Center>
  );
};

/* 4 — Étape 1 : décrire ------------------------------------------------ */
export const Step1: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpr(26, 14);
  const prompt =
    "Crée une vidéo animée pour ma boutique : couleurs orange et violet, texte qui rebondit, musique dynamique.";
  return (
    <Center gap={50} style={{ justifyContent: "flex-start", paddingTop: 200 }}>
      <StepHeader n="01" title="Décris ta vidéo avec tes mots" color={C.orange} />
      <div style={{ width: "100%", opacity: card, transform: `translateY(${(1 - card) * 200}px) rotate(${(1 - card) * 4}deg)` }}>
        <Terminal title="ta demande">
          <span style={{ color: C.orange }}>›</span>{" "}
          <Typewriter text={prompt} start={36} cps={1.1} style={{ fontFamily: F.body, fontSize: 44, fontWeight: 500 }} />
        </Terminal>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          ["Couleurs", C.orange, 70],
          ["Texte", C.pink, 95],
          ["Ambiance", C.violet, 120],
        ].map(([l, c, d]) => (
          <CheckChip key={l as string} label={l as string} color={c as string} delay={d as number} />
        ))}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: 40,
          color: C.dim,
          opacity: interpolate(frame, [135, 150], [0, 1], clamp),
        }}
      >
        Comme si tu parlais à un ami.
      </div>
    </Center>
  );
};

/* 5 — Étape 2 : Claude anime ------------------------------------------ */
const CODE = [
  ["const", " titre = ", "spring", "({ frame })"],
  ["<Texte ", "rebond", "={1.2} ", "/>"],
  ["animate", "(cercle, { ", "scale", ": 2 })"],
  ["transition", "(", "'zoom'", ", 12)"],
  ["<Particules ", "couleur", "=", "\"orange\" />"],
  ["glow", "({ intensité: ", "0.8", " })"],
  ["<Musique ", "src", "=", "\"beat.mp3\" />"],
  ["render", "(", "'ma-video.mp4'", ")"],
];

export const Step2: React.FC = () => {
  const frame = useCurrentFrame();
  const panel = useSpr(22, 14);
  const cols = [C.violet, C.cyan, C.orange, C.pink];
  return (
    <Center gap={44} style={{ justifyContent: "flex-start", paddingTop: 200 }}>
      <StepHeader n="02" title="Claude crée les animations" color={C.cyan} />
      <div
        style={{
          display: "flex",
          gap: 30,
          width: "100%",
          opacity: panel,
          transform: `translateY(${(1 - panel) * 200}px)`,
        }}
      >
        {/* code qui défile */}
        <Glass style={{ flex: 1.3, height: 470, overflow: "hidden", padding: 30 }}>
          <div style={{ transform: `translateY(${-Math.max(0, frame - 40) * 2.2}px)` }}>
            {[...CODE, ...CODE, ...CODE].map((l, i) => {
              const vis = interpolate(frame, [26 + i * 4, 30 + i * 4], [0, 1], clamp);
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: F.mono,
                    fontSize: 25,
                    lineHeight: 1.9,
                    whiteSpace: "nowrap",
                    opacity: vis,
                    transform: `translateX(${(1 - vis) * 40}px)`,
                  }}
                >
                  <span style={{ color: C.violet }}>{l[0]}</span>
                  <span style={{ color: C.ink }}>{l[1]}</span>
                  <span style={{ color: C.cyan }}>{l[2]}</span>
                  <span style={{ color: C.orange }}>{l[3]}</span>
                </div>
              );
            })}
          </div>
        </Glass>
        {/* formes qui se transforment */}
        <Glass style={{ flex: 1, height: 470, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: 22, padding: 26 }}>
          {new Array(9).fill(0).map((_, i) => {
            const t = frame - 40 - i * 3;
            const p = interpolate(t, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });
            const morph = (Math.sin((frame + i * 9) * 0.12) + 1) / 2;
            return (
              <div
                key={i}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: `${morph * 50}%`,
                  background: cols[i % 4],
                  transform: `scale(${p * (0.75 + 0.25 * morph)}) rotate(${frame * (i % 2 ? 3 : -3)}deg)`,
                  boxShadow: `0 0 30px ${cols[i % 4]}`,
                }}
              />
            );
          })}
        </Glass>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
        <CheckChip label="Animations" color={C.cyan} delay={70} />
        <CheckChip label="Transitions" color={C.violet} delay={90} />
        <CheckChip label="Effets spéciaux" color={C.pink} delay={110} />
      </div>
    </Center>
  );
};

/* 6 — Étape 3 : ajuster en discutant ---------------------------------- */
export const Step3: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = useSpr(20, 13);
  const asks = [
    { t: "Plus grand !", at: 55, c: C.orange },
    { t: "Plus rapide !", at: 90, c: C.cyan },
    { t: "Plus de couleurs !", at: 125, c: C.pink },
  ];
  const big = interpolate(frame, [62, 75], [1, 1.22], { ...clamp, easing: Easing.out(Easing.back(3)) });
  const speed = frame > 97 ? 3.5 : 0.8;
  const spin = frame > 97 ? (frame - 97) * 9 : 0;
  const hue = interpolate(frame, [132, 160], [0, 1], clamp);
  return (
    <Center gap={40} style={{ justifyContent: "flex-start", paddingTop: 200 }}>
      <StepHeader n="03" title="Ajuste en discutant" color={C.pink} />
      <div style={{ position: "relative", width: "100%", height: 760, display: "flex", justifyContent: "center" }}>
        {/* téléphone */}
        <div
          style={{
            width: 400,
            height: 740,
            borderRadius: 60,
            border: "10px solid #1d1a2e",
            background: "#000",
            boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 3px rgba(255,255,255,0.15)",
            overflow: "hidden",
            transform: `translateX(-230px) scale(${phone}) rotate(${(1 - phone) * -15}deg)`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(160deg, ${C.violet} 0%, #1a1035 60%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(${frame * 4}deg, ${C.orange}, ${C.pink}, ${C.cyan}, ${C.gold})`,
              opacity: hue,
            }}
          />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 900,
                fontSize: 54,
                color: "#fff",
                textAlign: "center",
                lineHeight: 1,
                transform: `scale(${big}) translateY(${Math.sin(frame * 0.25 * speed) * 14}px)`,
                textShadow: "0 6px 20px rgba(0,0,0,0.4)",
              }}
            >
              PROMO
              <br />
              -50%
            </div>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 24,
                background: C.gold,
                transform: `rotate(${spin + frame * 2}deg) scale(${1 + Math.sin(frame * 0.3 * speed) * 0.15})`,
                boxShadow: `0 0 40px ${C.gold}`,
              }}
            />
          </div>
          <div style={{ position: "absolute", top: 18, left: "50%", marginLeft: -60, width: 120, height: 30, borderRadius: 15, background: "#000" }} />
        </div>
        {/* bulles de discussion */}
        <div style={{ position: "absolute", right: 0, top: 90, display: "flex", flexDirection: "column", gap: 70, alignItems: "flex-end" }}>
          {asks.map((a) => (
            <Bubble key={a.t} text={a.t} at={a.at} color={a.c} />
          ))}
        </div>
      </div>
    </Center>
  );
};

const Bubble: React.FC<{ text: string; at: number; color: string }> = ({ text, at, color }) => {
  const s = useSpr(at, 9);
  return (
    <div
      style={{
        padding: "26px 36px",
        borderRadius: "40px 40px 8px 40px",
        background: color,
        color: C.bg,
        fontFamily: F.body,
        fontWeight: 800,
        fontSize: 40,
        transform: `scale(${s}) translateY(${(1 - s) * 40}px)`,
        transformOrigin: "100% 100%",
        opacity: s,
        boxShadow: `0 0 40px ${color}88`,
        maxWidth: 380,
      }}
    >
      {text}
    </div>
  );
};

/* 7 — Étape 4 : exporter ---------------------------------------------- */
export const Step4: React.FC = () => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [24, 92], [0, 100], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const done = frame > 92;
  const file = useSpr(94, 9);
  const R = 190;
  const circ = 2 * Math.PI * R;
  const nets = [
    ["TikTok", C.cyan],
    ["WhatsApp", C.green],
    ["Instagram", C.pink],
    ["Facebook", C.violet],
  ];
  return (
    <Center gap={40} style={{ justifyContent: "flex-start", paddingTop: 200 }}>
      <StepHeader n="04" title="Exporte en MP4" color={C.green} />
      <div style={{ position: "relative", width: 480, height: 480, marginTop: 10 }}>
        <svg width={480} height={480} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={240} cy={240} r={R} stroke="rgba(255,255,255,0.1)" strokeWidth={26} fill="none" />
          <circle
            cx={240}
            cy={240}
            r={R}
            stroke="url(#g)"
            strokeWidth={26}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - prog / 100)}
            style={{ filter: `drop-shadow(0 0 16px ${C.green})` }}
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.cyan} />
              <stop offset="100%" stopColor={C.green} />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          {!done ? (
            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 120, color: C.ink }}>
              {Math.round(prog)}%
            </div>
          ) : (
            <div
              style={{
                transform: `scale(${file}) rotate(${(1 - file) * -30}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 170,
                  height: 210,
                  borderRadius: 24,
                  background: `linear-gradient(160deg, ${C.green}, ${C.cyan})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 60px ${C.green}`,
                }}
              >
                <div style={{ width: 0, height: 0, borderTop: "40px solid transparent", borderBottom: "40px solid transparent", borderLeft: `66px solid ${C.bg}`, marginLeft: 16 }} />
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 32, color: C.ink }}>ma-video.mp4</div>
            </div>
          )}
        </div>
        {done ? <Shockwave at={92} color={C.green} count={2} /> : null}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", maxWidth: 900 }}>
        {nets.map(([n, c], i) => (
          <NetPill key={n} label={n} color={c} delay={112 + i * 8} />
        ))}
      </div>
    </Center>
  );
};

const NetPill: React.FC<{ label: string; color: string; delay: number }> = ({ label, color, delay }) => {
  const s = useSpr(delay, 9);
  return (
    <div
      style={{
        padding: "18px 38px",
        borderRadius: 999,
        border: `3px solid ${color}`,
        background: `${color}22`,
        fontFamily: F.body,
        fontWeight: 800,
        fontSize: 44,
        color: C.ink,
        transform: `scale(${s}) translateY(${(1 - s) * 100}px)`,
        opacity: s,
        boxShadow: `0 0 30px ${color}55`,
      }}
    >
      {label}
    </div>
  );
};

/* 8 — Preuve ----------------------------------------------------------- */
export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  // montée en tension avant le CTA (riser musical)
  const tension = interpolate(frame, [120, 180], [0, 1], clamp);
  const shake = tension * 10;
  const sx = (random(`sx${frame}`) - 0.5) * shake;
  const sy = (random(`sy${frame}`) - 0.5) * shake;
  const stats = [
    { v: 0, suf: "", l: "compétence", c: C.orange, d: 8 },
    { v: 0, suf: "", l: "logiciel compliqué", c: C.cyan, d: 22 },
    { v: 100, suf: "%", l: "ton idée", c: C.pink, d: 36 },
  ];
  const last = useSpr(95, 11);
  return (
    <Center gap={34} style={{ transform: `translate(${sx}px, ${sy}px) scale(${1 + tension * 0.08})` }}>
      {stats.map((s) => (
        <Stat key={s.l} {...s} />
      ))}
      <div
        style={{
          marginTop: 30,
          opacity: last,
          transform: `scale(${0.7 + 0.3 * last})`,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 52, color: C.dim }}>Cette vidéo ?</div>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: 74,
            lineHeight: 1.1,
            color: "transparent",
            backgroundImage: GRAD,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            letterSpacing: -2,
          }}
        >
          Faite exactement comme ça.
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [168, 180], [0, 0.9], clamp), pointerEvents: "none" }} />
    </Center>
  );
};

const Stat: React.FC<{ v: number; suf: string; l: string; c: string; d: number }> = ({ v, suf, l, c, d }) => {
  const frame = useCurrentFrame();
  const s = useSpr(d, 11);
  const val = Math.round(interpolate(frame, [d, d + 20], [v === 0 ? 99 : 0, v], clamp));
  return (
    <Glass
      style={{
        width: "100%",
        padding: "26px 50px",
        display: "flex",
        alignItems: "center",
        gap: 40,
        transform: `translateX(${(1 - s) * (d % 2 ? -1200 : 1200)}px) rotate(${(1 - s) * 6}deg)`,
        border: `3px solid ${c}`,
        boxShadow: `0 0 50px ${c}55`,
      }}
    >
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 130, color: c, minWidth: 330, textAlign: "center", textShadow: `0 0 40px ${c}` }}>
        {val}
        {suf}
      </div>
      <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 54, color: C.ink, lineHeight: 1.1 }}>{l}</div>
    </Glass>
  );
};

/* 9 — Appel à l'action ------------------------------------------------- */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = beatPulse(frame + 1380);
  const book = useSpr(10, 10);
  const price = useSpr(70, 8, 0.6, 140);
  const btn = useSpr(110, 10);
  const last = useSpr(150, 12);
  const intro = useSpr(0, 12);
  const flash = interpolate(frame, [0, 14], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Shockwave at={0} color={C.gold} count={4} />
      {/* rayons tournants */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 0.22 }}>
        <div
          style={{
            width: 2600,
            height: 2600,
            background: `repeating-conic-gradient(from ${frame * 0.6}deg, ${C.gold} 0deg 6deg, transparent 6deg 20deg)`,
            maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          }}
        />
      </AbsoluteFill>
      <Confetti />
      <Center gap={26} style={{ justifyContent: "flex-start", paddingTop: 170 }}>
        <div
          style={{
            fontFamily: F.body,
            fontWeight: 700,
            fontSize: 54,
            color: C.ink,
            textAlign: "center",
            opacity: intro,
            transform: `translateY(${(1 - intro) * -60}px)`,
            lineHeight: 1.2,
          }}
        >
          J'ai préparé pour toi un
          <br />
          <span style={{ color: C.gold }}>guide pratique pas à pas</span>
        </div>
        {/* livre 3D */}
        <div style={{ perspective: 1400, marginTop: 10 }}>
          <div
            style={{
              position: "relative",
              width: 440,
              height: 580,
              transformStyle: "preserve-3d",
              transform: `scale(${book}) rotateY(${-22 + Math.sin(frame * 0.05) * 14 + (1 - book) * -120}deg) rotateX(${6 + Math.sin(frame * 0.04) * 4}deg) translateY(${Math.sin(frame * 0.07) * 14}px)`,
            }}
          >
            {/* tranche */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 60,
                height: 580,
                background: "linear-gradient(90deg, #3b1f7a, #5b2fb3)",
                transform: "rotateY(-90deg) translateZ(0px)",
                transformOrigin: "0 50%",
              }}
            />
            {/* couverture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "8px 24px 24px 8px",
                background: `linear-gradient(150deg, #1b1240 0%, #3a1c6e 45%, ${C.coral} 120%)`,
                boxShadow: `0 40px 90px rgba(0,0,0,0.7), 0 0 ${80 + pulse * 40}px ${C.violet}`,
                border: "2px solid rgba(255,255,255,0.18)",
                padding: "50px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 18,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", right: -80, bottom: -80 }}>
                <Spark size={260} color={C.orange} rotate={frame} glow />
              </div>
              <div style={{ padding: "8px 20px", borderRadius: 999, background: C.gold, color: C.bg, fontFamily: F.body, fontWeight: 800, fontSize: 24 }}>
                GUIDE PAS À PAS
              </div>
              <div style={{ marginTop: 140, fontFamily: F.display, fontWeight: 900, fontSize: 64, color: "#fff", lineHeight: 1, letterSpacing: -2 }}>
                VIBE
                <br />
                MOTION
                <br />
                <span style={{ color: C.orange }}>DESIGN</span>
              </div>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 26, color: C.dim, lineHeight: 1.3 }}>
                Crée tes vidéos animées avec Claude Code — sans compétence
              </div>
              {/* reflet */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 140,
                  left: `${((frame * 6) % 1400) - 300}px`,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
                  transform: "skewX(-20deg)",
                }}
              />
            </div>
          </div>
        </div>
        {/* prix */}
        <div
          style={{
            position: "relative",
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            transform: `scale(${price * (1 + pulse * 0.04)}) rotate(${(1 - price) * -25 - 3}deg)`,
            opacity: Math.min(1, price * 2),
          }}
        >
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 48, color: C.ink }}>seulement</div>
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 900,
              fontSize: 170,
              lineHeight: 1,
              color: "transparent",
              backgroundImage: GOLD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 30px rgba(253,224,71,0.6))`,
              letterSpacing: -4,
            }}
          >
            5000F
          </div>
        </div>
        {/* bouton */}
        <div
          style={{
            marginTop: 10,
            padding: "38px 60px",
            borderRadius: 999,
            background: GRAD,
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: 44,
            whiteSpace: "nowrap",
            color: "#fff",
            letterSpacing: -1,
            transform: `scale(${btn * (1 + pulse * 0.06)})`,
            boxShadow: `0 0 ${60 + pulse * 60}px rgba(255,94,126,0.8), inset 0 2px 0 rgba(255,255,255,0.4)`,
            display: "flex",
            alignItems: "center",
            gap: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          TÉLÉCHARGE MAINTENANT
          <span style={{ display: "inline-block", transform: `translateX(${Math.sin(frame * 0.3) * 10}px)` }}>→</span>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 120,
              left: `${((frame * 12) % 1600) - 300}px`,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: F.body,
            fontWeight: 800,
            fontSize: 50,
            color: C.ink,
            textAlign: "center",
            opacity: last,
            transform: `translateY(${(1 - last) * 50}px)`,
            lineHeight: 1.2,
          }}
        >
          et fais ton <span style={{ color: C.gold }}>premier montage</span>
          <br />
          aujourd'hui !
        </div>
      </Center>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Confetti: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = [C.gold, C.orange, C.pink, C.cyan, C.violet, C.green];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(70).fill(0).map((_, i) => {
        const angle = random(`a${i}`) * Math.PI * 2;
        const v = 18 + random(`v${i}`) * 30;
        const t = frame;
        const x = 540 + Math.cos(angle) * v * t * 0.9 * Math.exp(-t * 0.015);
        const y = 960 + Math.sin(angle) * v * t * 0.9 * Math.exp(-t * 0.015) + t * t * 0.05;
        const w = 14 + random(`w${i}`) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * 0.45,
              background: cols[i % cols.length],
              transform: `rotate(${t * (6 + i % 7)}deg) rotateX(${t * 9}deg)`,
              opacity: interpolate(t, [0, 120, 200], [1, 1, 0], clamp),
              borderRadius: 3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
