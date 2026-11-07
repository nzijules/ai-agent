import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Glass, Progress } from "../components/Common";
import { SeatedBack } from "../components/People";
import { C, CUES, F, ease, ip, scene, useT } from "../lib/theme";

const HAIRS = ["short", "bun", "afro", "braids", "fade"] as const;
const SHIRTS = ["#1E2A44", "#2B2F3A", "#123049", "#33263F", "#1B3B3A", "#3A2B22"];

const TASKS = [
  { label: "Analyse des ventes", sub: "12 sources croisées", at: 8.7, x: 90, y: 430 },
  { label: "Rapport mensuel", sub: "Rédaction en cours", at: 9.5, x: 560, y: 520 },
  { label: "Module de facturation", sub: "Code + tests", at: 10.3, x: 120, y: 700 },
  { label: "Relances clients", sub: "Flux automatisé", at: 11.1, x: 540, y: 820 },
];
const VERBS = ["ANALYSE.", "RÉDIGE.", "DÉVELOPPE.", "AUTOMATISE."];

const Row: React.FC<{ n: number; w: number; y: number; depth: number; blur: number; seed: number; on: number; gap: number }> = ({
  n,
  w,
  y,
  depth,
  blur,
  seed,
  on,
  gap,
}) => {
  const t = useT();
  const pan = (t - scene(2).start) * 26 * depth;
  const total = n * (w + gap) - gap;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 540 - total / 2 - pan + 60 * depth,
        display: "flex",
        gap,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {new Array(n).fill(0).map((_, i) => (
        <SeatedBack
          key={i}
          id={`r${seed}-${i}`}
          width={w}
          skin={C.skin[(i + seed) % C.skin.length]}
          hair={HAIRS[(i * 3 + seed) % HAIRS.length]}
          shirt={SHIRTS[(i + seed * 2) % SHIRTS.length]}
          screenOn={Math.min(1, on * (1 + ((i + seed) % 3) * 0.2))}
        />
      ))}
    </div>
  );
};

export const S2Transformation: React.FC = () => {
  const t = useT();
  const verbsStart = CUES.verbs[0] - 0.25;
  const officeDim = ip(t, [verbsStart - 0.3, verbsStart + 0.3], [0, 1], ease.inOut);
  const on = ip(t, [8.6, 12], [0.2, 1]);

  return (
    <AbsoluteFill>
      <Backdrop grid={0.25} particles={24} hue={C.blue} intensity={0.7} />

      {/* Open space en 3 plans (parallaxe) */}
      <AbsoluteFill style={{ opacity: 1 - officeDim * 0.72, filter: officeDim > 0.01 ? `blur(${officeDim * 8}px)` : undefined }}>
        <Row n={6} w={150} y={560} depth={0.4} blur={3} seed={1} on={on} gap={40} />
        <Row n={4} w={230} y={760} depth={0.75} blur={1} seed={2} on={on} gap={60} />
        <Row n={3} w={340} y={960} depth={1.2} blur={0} seed={3} on={on} gap={70} />
        {/* lumière froide des écrans */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 60% 25% at 50% 62%, ${C.cyan}${Math.round(on * 30)
              .toString(16)
              .padStart(2, "0")}, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* Interfaces IA qui exécutent les tâches */}
        {TASKS.map((k, i) => {
          const p = ip(t, [k.at, k.at + 0.5], [0, 1], ease.back);
          const done = ip(t, [k.at + 0.3, k.at + 2.2], [0, 1], ease.inOut);
          const float = Math.sin(t * 1.4 + i) * 8;
          return (
            <Glass
              key={k.label}
              style={{
                left: k.x,
                top: k.y + float,
                width: 430,
                padding: "24px 28px",
                opacity: p,
                scale: `${0.7 + 0.3 * p}`,
                translate: `0px ${(1 - p) * 40}px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 18,
                    background: done >= 1 ? C.cyan : C.blue,
                    boxShadow: `0 0 14px ${done >= 1 ? C.cyan : C.blue}`,
                  }}
                />
                <div style={{ fontSize: 34, fontWeight: 600 }}>{k.label}</div>
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 24, color: C.dim, margin: "10px 0 16px 32px" }}>
                {done >= 1 ? "✓ Terminé par l'IA" : k.sub}
              </div>
              <Progress p={done} />
            </Glass>
          );
        })}
      </AbsoluteFill>

      {/* Verbes : typographie cinétique synchronisée */}
      <AbsoluteFill style={{ opacity: officeDim }}>
        <div
          style={{
            position: "absolute",
            top: 520,
            width: "100%",
            textAlign: "center",
            fontFamily: F.mono,
            fontSize: 40,
            letterSpacing: 18,
            color: C.cyan,
            opacity: ip(t, [verbsStart, verbsStart + 0.4], [0, 1]),
          }}
        >
          L'IA
        </div>
        {VERBS.map((v, i) => {
          const at = CUES.verbs[i];
          const next = CUES.verbs[i + 1] ?? scene(2).end + 1;
          const pin = ip(t, [at - 0.08, at + 0.35], [0, 1], ease.out);
          const pout = ip(t, [next - 0.12, next + 0.2], [0, 1], ease.in);
          if (pin <= 0 || pout >= 1) return null;
          return (
            <div
              key={v}
              style={{
                position: "absolute",
                top: 600,
                width: "100%",
                height: 200,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 700,
                  fontSize: 128,
                  letterSpacing: -2,
                  color: i === 3 ? C.cyan : C.white,
                  translate: `0px ${(1 - pin) * 170 - pout * 170}px`,
                  scale: `${1 + (1 - pin) * 0.25}`,
                  filter: pout > 0 ? `blur(${pout * 12}px)` : undefined,
                  textShadow: `0 0 40px ${i === 3 ? C.cyan : C.blue}aa`,
                }}
              >
                {v}
              </div>
            </div>
          );
        })}
        {/* chips de progression */}
        <div
          style={{
            position: "absolute",
            top: 860,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 18,
            fontFamily: F.mono,
            fontSize: 24,
          }}
        >
          {VERBS.map((v, i) => {
            const lit = t >= CUES.verbs[i];
            return (
              <div
                key={v}
                style={{
                  padding: "10px 16px",
                  borderRadius: 40,
                  border: `1.5px solid ${lit ? C.cyan : "rgba(255,255,255,0.2)"}`,
                  color: lit ? C.white : "rgba(255,255,255,0.35)",
                  background: lit ? `${C.cyan}22` : "transparent",
                  boxShadow: lit ? `0 0 18px ${C.cyan}55` : undefined,
                }}
              >
                {v.replace(".", "")}
              </div>
            );
          })}
        </div>
        {/* ligne de scan */}
        <div
          style={{
            position: "absolute",
            left: 140,
            right: 140,
            top: 820,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
            scale: `${ip(t, [verbsStart, verbsStart + 0.8], [0, 1])} 1`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
