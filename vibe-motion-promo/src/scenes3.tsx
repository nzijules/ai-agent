import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pill, Pop, Scene, clamp } from "./components";
import { LEARN, Row, TITLE } from "./scenes2";
import { C, SCENES } from "./theme";

const ic = {
  fill: "none",
  stroke: C.cyan,
  strokeWidth: 3.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---------- 1. Hook — synced with "Tu vois ces vidéos animées…" ---------- */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // floating "brand video" mock cards
  const cards = [
    { x: -330, y: -560, r: -10, c: C.yellow, d: 6 },
    { x: 320, y: -470, r: 8, c: C.cyan, d: 14 },
    { x: -300, y: 520, r: 7, c: "#FF5FD2", d: 22 },
    { x: 330, y: 600, r: -8, c: C.red, d: 30 },
  ];
  return (
    <Scene dur={SCENES.hook.dur}>
      {cards.map((k, i) => {
        const s = spring({ frame: frame - k.d, fps, config: { damping: 14 } });
        const play = (frame * 3 + i * 40) % 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + k.x - 130,
              top: 960 + k.y - 90 + Math.sin((frame + i * 20) / 18) * 12,
              width: 260,
              height: 180,
              borderRadius: 24,
              background: "rgba(8,14,48,0.9)",
              border: `3px solid ${k.c}`,
              boxShadow: `0 0 40px ${k.c}55`,
              transform: `rotate(${k.r}deg) scale(${s})`,
              opacity: s * 0.95,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 22,
                width: 120 + (play % 50),
                height: 18,
                borderRadius: 9,
                background: k.c,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 56,
                width: 160,
                height: 12,
                borderRadius: 6,
                background: "rgba(255,255,255,0.35)",
              }}
            />
            <svg width={56} height={56} viewBox="0 0 48 48" style={{ position: "absolute", left: 100, top: 86 }}>
              <circle cx="24" cy="24" r="21" fill="rgba(255,255,255,0.15)" />
              <path d="M19 15v18l15-9z" fill="#fff" />
            </svg>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                height: 8,
                width: `${play}%`,
                background: k.c,
              }}
            />
          </div>
        );
      })}
      <Pop delay={4} style={{ fontSize: 60, fontWeight: 800, color: C.muted }}>
        Tu vois ces
      </Pop>
      <Pop delay={10} style={{ ...TITLE, fontSize: 112, marginTop: 6 }}>
        vidéos animées
      </Pop>
      <Pop delay={42} style={{ fontSize: 58, fontWeight: 800, marginTop: 24 }}>
        des <Pill color={C.yellow} style={{ padding: "2px 24px 8px" }}>grandes marques</Pill>
      </Pop>
      <Pop delay={100} style={{ fontSize: 54, fontWeight: 700, marginTop: 34, color: C.white }}>
        qui attirent toute l’attention ?
      </Pop>
    </Scene>
  );
};

/* ---------- 2. "Et si tu pouvais, toi aussi, les créer…" ---------- */
export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [106, 120], [0, 106], clamp);
  return (
    <Scene dur={SCENES.problem.dur}>
      <Pop delay={4} style={{ ...TITLE, fontSize: 96 }}>
        Et si <span style={{ color: C.yellow }}>toi aussi</span>
      </Pop>
      <Pop delay={14} style={{ ...TITLE, fontSize: 96, marginTop: 4 }}>
        tu pouvais les créer ?
      </Pop>
      <Pop delay={86} style={{ fontSize: 56, fontWeight: 700, marginTop: 80, color: C.muted }}>
        même sans être
      </Pop>
      <Pop delay={92} from="scale" style={{ position: "relative", marginTop: 20 }}>
        <span style={{ fontSize: 64, fontWeight: 900 }}>
          <Pill color={C.red} textColor={C.white} rotate={-1.5}>
            expert en motion design
          </Pill>
        </span>
        <span
          style={{
            position: "absolute",
            left: "-3%",
            top: "48%",
            height: 12,
            width: `${strike}%`,
            background: C.yellow,
            borderRadius: 6,
            transform: "rotate(-4deg)",
            boxShadow: `0 0 18px ${C.yellow}`,
          }}
        />
      </Pop>
    </Scene>
  );
};

/* ---------- Au programme (9 points, one scene) ---------- */
export const Program: React.FC = () => (
  <Scene dur={SCENES.program.dur}>
    <Pop delay={0}>
      <Pill color={C.blue} textColor={C.white} rotate={0} style={{ fontSize: 36, fontWeight: 800 }}>
        AU PROGRAMME
      </Pill>
    </Pop>
    <Pop delay={4} style={{ ...TITLE, fontSize: 76, marginTop: 24, marginBottom: 16 }}>
      Ce que tu vas <span style={{ color: C.yellow }}>apprendre</span>
    </Pop>
    {LEARN.map((t, i) => (
      <Row key={t} i={i} delay={12 + i * 9} style={{ padding: "12px 26px", marginTop: 12, gap: 22 }}>
        <div
          style={{
            flexShrink: 0,
            width: 54,
            height: 54,
            borderRadius: 16,
            background: C.yellow,
            color: C.navy,
            fontSize: 32,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {i + 1}
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.18 }}>{t}</div>
      </Row>
    ))}
  </Scene>
);

/* ---------- Pour tes projets / tes clients / gagner de l'argent ---------- */
const USAGE: { title: string; sub: string; at: number; icon: React.ReactNode }[] = [
  {
    title: "Tes propres projets",
    sub: "Ta marque, tes produits, tes réseaux",
    at: 6,
    icon: <path d="M24 6l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" {...ic} />,
  },
  {
    title: "Tes clients",
    sub: "Pubs TikTok, Facebook, Instagram, corporate…",
    at: 82,
    icon: (
      <>
        <circle cx="17" cy="16" r="7" {...ic} />
        <circle cx="33" cy="18" r="5" {...ic} />
        <path d="M4 40c1-8 7-12 13-12s12 4 13 12M30 30c6 0 11 3 12 10" {...ic} />
      </>
    ),
  },
  {
    title: "Gagner de l’argent",
    sub: "Propose la création vidéo comme service",
    at: 114,
    icon: (
      <>
        <rect x="4" y="12" width="40" height="24" rx="4" {...ic} stroke={C.yellow} />
        <circle cx="24" cy="24" r="6" {...ic} stroke={C.yellow} />
      </>
    ),
  },
];

export const Usage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Scene dur={SCENES.usage.dur}>
      <Pop delay={0} style={{ ...TITLE, marginBottom: 40 }}>
        Une compétence <span style={{ color: C.yellow }}>rentable</span>
      </Pop>
      {USAGE.map((u, i) => {
        const s = spring({ frame: frame - u.at, fps, config: { damping: 12 } });
        const last = i === USAGE.length - 1;
        return (
          <div
            key={u.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 34,
              width: 920,
              padding: "36px 40px",
              marginTop: 30,
              borderRadius: 34,
              textAlign: "left",
              background: last
                ? "linear-gradient(120deg, rgba(255,214,10,0.28), rgba(255,255,255,0.05))"
                : "linear-gradient(120deg, rgba(30,75,255,0.30), rgba(255,255,255,0.05))",
              border: `3px solid ${last ? C.yellow : "rgba(60,200,255,0.35)"}`,
              boxShadow: last ? `0 0 60px ${C.yellow}44` : "0 16px 50px rgba(0,0,0,0.3)",
              opacity: s,
              transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 80}px)`,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 120,
                height: 120,
                borderRadius: 30,
                background: "rgba(4,10,44,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={76} height={76} viewBox="0 0 48 48">
                {u.icon}
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.1, color: last ? C.yellow : C.white }}>
                {u.title}
              </div>
              <div style={{ fontSize: 34, fontWeight: 500, color: C.muted, marginTop: 8 }}>{u.sub}</div>
            </div>
          </div>
        );
      })}
    </Scene>
  );
};

/* ---------- Tu achètes → accès automatique → tu apprends ---------- */
const STEPS: { n: string; title: string; at: number }[] = [
  { n: "1", title: "Tu achètes", at: 6 },
  { n: "2", title: "Tu reçois ton accès automatiquement", at: 46 },
  { n: "3", title: "Tu commences à apprendre immédiatement", at: 108 },
];

export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Scene dur={SCENES.steps.dur}>
      <Pop delay={0} style={{ ...TITLE, marginBottom: 60 }}>
        Simple et <span style={{ color: C.yellow }}>rapide</span>
      </Pop>
      {STEPS.map((st, i) => {
        const s = spring({ frame: frame - st.at, fps, config: { damping: 12 } });
        const next = STEPS[i + 1];
        const line = next ? interpolate(frame, [next.at - 16, next.at], [0, 1], clamp) : 0;
        return (
          <div key={st.n} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                width: 900,
                padding: "30px 40px",
                borderRadius: 32,
                textAlign: "left",
                background: "linear-gradient(120deg, rgba(30,75,255,0.32), rgba(255,255,255,0.05))",
                border: "2px solid rgba(60,200,255,0.35)",
                opacity: s,
                transform: `translateX(${(1 - s) * (i % 2 ? 300 : -300)}px)`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  background: C.yellow,
                  color: C.navy,
                  fontSize: 54,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {st.n}
              </div>
              <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15 }}>{st.title}</div>
            </div>
            {next && (
              <div
                style={{
                  width: 8,
                  height: 70,
                  margin: "10px 0",
                  borderRadius: 4,
                  background: `linear-gradient(${C.cyan}, ${C.yellow})`,
                  transform: `scaleY(${line})`,
                  transformOrigin: "top",
                  boxShadow: `0 0 16px ${C.cyan}`,
                }}
              />
            )}
          </div>
        );
      })}
    </Scene>
  );
};
