import React from "react";
import { AbsoluteFill, random } from "remotion";
import { HoloPanel, MonoRow } from "../components/HoloPanel";
import { IconArtifact, IconBackup, IconCloud, IconMeta, IconPhone } from "../components/Icons";
import { PixelSwarm } from "../components/PixelSwarm";
import { WordReveal } from "../components/WordReveal";
import { cue } from "../data/script";
import { EASE_IN_OUT, EASE_OUT, tw, useSceneClock } from "../lib/anim";
import { FONT } from "../fonts";
import { C } from "../theme";

const S = "s2" as const;
const HUB = { x: 540, y: 470 };
const RING_Y = 1000;
const RADIUS = 600;

type PanelDef = {
  title: string;
  tag: string;
  icon: (c: string) => React.ReactNode;
  rows: Array<[string, string, string?]>;
};

const PANELS: PanelDef[] = [
  {
    title: "Sauvegarde",
    tag: "LOCAL",
    icon: (c) => <IconBackup size={54} color={c} />,
    rows: [
      ["fichier", "backup_2026-10-02"],
      ["taille", "3,8 Go"],
      ["chiffrement", "selon réglages", C.orange],
    ],
  },
  {
    title: "Cloud synchronisé",
    tag: "SYNC",
    icon: (c) => <IconCloud size={54} color={c} />,
    rows: [
      ["dernière synchro", "21:46:58"],
      ["appareils liés", "2"],
      ["état", "● actif", C.green],
    ],
  },
  {
    title: "Métadonnées",
    tag: "META",
    icon: (c) => <IconMeta size={54} color={c} />,
    rows: [
      ["horodatage", "14/03 21:47:09 UTC"],
      ["taille", "2,4 Ko"],
      ["id message", "0x7F3A…C21"],
    ],
  },
  {
    title: "Artefacts",
    tag: "SYS",
    icon: (c) => <IconArtifact size={54} color={c} />,
    rows: [
      ["base", "journal -wal"],
      ["cache", "miniatures"],
      ["système", "notifications"],
    ],
  },
];

export const Scene2DataUniverse: React.FC = () => {
  const { t, sp } = useSceneClock();
  const cA = cue("s2.a", S);
  const cB = cue("s2.b", S);
  const cB2 = cB + 2.1;
  const cC = cue("s2.c", S);
  const cD = cue("s2.d", S);

  // Hub : les pixels de la scène 1 convergent et forment le nœud « téléphone ».
  const gather = tw(t, [-0.6, cA + 1.6], [0, 1], EASE_IN_OUT);
  const hub = sp(cA + 1.2, { damping: 14, stiffness: 90 });
  // Traces radiales
  const paths = tw(t, [cA + 1.6, cA + 3.4], [0, 1], EASE_OUT);
  // Anneau orbital
  const ringIn = sp(cB - 0.9, { damping: 20, stiffness: 60 });
  const step =
    sp(cB2, { damping: 18, stiffness: 70 }) + sp(cC, { damping: 18, stiffness: 70 }) + sp(cD, { damping: 18, stiffness: 70 });
  const ringAngle = (1 - ringIn) * 140 - step * 90 + Math.sin(t * 0.5) * 2;
  const activeIdx = t < cB2 ? 0 : t < cC ? 1 : t < cD ? 2 : 3;
  const activeAt = [cB, cB2, cC, cD];

  // caméra : léger travelling et roulis
  const camY = tw(t, [0, 18], [40, -30], EASE_IN_OUT);
  const camRot = Math.sin(t * 0.35) * 1.5;

  return (
    <AbsoluteFill style={{ perspective: 1500, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `0px ${camY}px`, rotate: `${camRot}deg` }}>
        {/* label haut */}
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 26,
              letterSpacing: 6,
              color: C.cyan,
              opacity: tw(t, [cA, cA + 0.6], [0, 1]),
            }}
          >
            {"// TRACES NUMÉRIQUES POSSIBLES"}
          </div>
          <div style={{ height: 18 }} />
          <WordReveal text="Où vont les données ?" at={cA + 0.2} size={76} weight={700} stagger={0.1} out={cB - 0.4} />
        </AbsoluteFill>

        {/* tracés de données hub → anneau */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="trace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.9} />
              <stop offset="100%" stopColor={C.blue} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const tx = 120 + i * 168;
            const d = `M${HUB.x} ${HUB.y} C ${HUB.x} ${HUB.y + 240}, ${tx} ${RING_Y - 260}, ${tx} ${RING_Y + 40}`;
            const len = 900;
            return (
              <g key={i}>
                <path d={d} stroke="url(#trace)" strokeWidth={2.5} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - paths)} opacity={0.7} />
                {/* paquets */}
                {[0, 1, 2].map((k) => {
                  const ph = ((t * 0.45 + k / 3 + random(`pk${i}`) ) % 1);
                  return (
                    <circle key={k} r={5} fill={C.cyan} opacity={paths > 0.95 ? 0.9 : 0} style={{ offsetPath: `path('${d}')`, offsetDistance: `${ph * 100}%`, filter: `drop-shadow(0 0 6px ${C.cyan})` } as React.CSSProperties} />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* pixels qui convergent vers le hub */}
        <PixelSwarm
          seed="s2-gather"
          count={70}
          p={1}
          t={t}
          origin={{ x: 0, y: 0, w: 1080, h: 1100 }}
          drift={{ x: 0, y: 0 }}
          spread={0}
          minSize={6}
          maxSize={16}
          fadeTo={1}
          converge={{ x: HUB.x - 8, y: HUB.y - 8, p: gather }}
        />

        {/* hub */}
        <div
          style={{
            position: "absolute",
            left: HUB.x - 85,
            top: HUB.y - 85,
            width: 170,
            height: 170,
            borderRadius: 85,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle, ${C.blue}55, ${C.bg}EE 70%)`,
            border: `2px solid ${C.cyan}`,
            boxShadow: `0 0 60px ${C.blue}88, inset 0 0 30px ${C.blue}55`,
            scale: String(hub),
            opacity: Math.min(1, hub),
          }}
        >
          <IconPhone size={86} color={C.white} />
          {[0, 1].map((k) => {
            const ph = (t * 0.6 + k * 0.5) % 1;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `2px solid ${C.cyan}`,
                  scale: String(1 + ph * 1.2),
                  opacity: (1 - ph) * 0.6,
                }}
              />
            );
          })}
        </div>

        {/* anneau orbital de panneaux en 3D */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: RING_Y,
            transformStyle: "preserve-3d",
            transform: `translateZ(-${RADIUS}px) rotateX(-6deg) rotateY(${ringAngle}deg)`,
            opacity: ringIn,
          }}
        >
          {PANELS.map((pd, i) => {
            const ang = i * 90;
            const isActive = i === activeIdx;
            const rowP = (k: number) => tw(t, [activeAt[i] + 0.4 + k * 0.25, activeAt[i] + 0.8 + k * 0.25], [0, 1]);
            const open = tw(t, [activeAt[i] - 0.3, activeAt[i] + 0.4], [0, 1]);
            const shown = Math.max(open, i === 0 ? ringIn : 0);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: -340,
                  top: -200,
                  transform: `rotateY(${ang}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <HoloPanel
                  p={Math.max(0.35, shown)}
                  width={680}
                  title={pd.title}
                  tag={pd.tag}
                  icon={pd.icon(isActive ? C.cyan : C.faint)}
                  accent={isActive ? C.cyan : "#3A5A7A"}
                  style={{ opacity: isActive ? 1 : 0.55 }}
                >
                  {pd.rows.map((r, k) => (
                    <MonoRow key={k} k={r[0]} v={r[1]} color={r[2] ?? C.cyan} p={rowP(k)} />
                  ))}
                </HoloPanel>
              </div>
            );
          })}
        </div>

        {/* mention d'exactitude */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 450 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 26px",
              borderRadius: 999,
              border: `1px solid ${C.orange}88`,
              background: C.orangeSoft,
              fontFamily: FONT.ui,
              fontWeight: 600,
              fontSize: 28,
              color: "#FFD2A8",
              opacity: tw(t, [cD + 1.2, cD + 1.8], [0, 1]),
              translate: `0px ${tw(t, [cD + 1.2, cD + 1.8], [20, 0])}px`,
            }}
          >
            <span style={{ color: C.orange, fontSize: 30 }}>▲</span>
            Traces possibles, jamais garanties
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
