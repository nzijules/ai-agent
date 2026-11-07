import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Common";
import { C, CUES, F, ease, ip, useT } from "../lib/theme";

const TASKS = ["Saisie", "Reporting", "Planning", "Relances", "Tri e-mails"];
// tâche répétitive principale de chaque collaborateur (indice dans TASKS)
const TASK_OF = [0, 1, 3, 2, 4, 1, 0, 4, 3, 2, 2, 4, 1, 0, 3, 3, 2, 0, 4, 1];
const CLUSTERS = [
  { label: "Pilotage IA", x: 300, y: 610, n: 7 },
  { label: "Expertise métier", x: 780, y: 610, n: 7 },
  { label: "Relation client", x: 540, y: 950, n: 6 },
];

const Avatar: React.FC<{ skin: string; lit: number }> = ({ skin, lit }) => (
  <svg viewBox="0 0 100 100" width="74" height="74">
    <circle cx="50" cy="34" r="18" fill={skin} />
    <path d="M18 96 C18 70 32 58 50 58 C68 58 82 70 82 96 Z" fill="#26324E" />
    <path d="M18 96 C18 70 32 58 50 58 C68 58 82 70 82 96 Z" fill={C.cyan} opacity={0.25 * lit} />
  </svg>
);

export const S4Equation: React.FC = () => {
  const t = useT();
  const reorg = ip(t, [31.0, 32.4], [0, 1], ease.inOut);
  const intro = (i: number) => ip(t, [CUES.silhouettes + i * 0.05, CUES.silhouettes + i * 0.05 + 0.5], [0, 1], ease.back);

  // positions : grille 5 × 4 → 3 pôles
  const tileW = 168;
  const tileH = 150;
  const gap = 18;
  const gx0 = 540 - (5 * tileW + 4 * gap) / 2;
  const gy0 = 450;
  let k = 0;
  const clusterPos: { x: number; y: number; c: number }[] = [];
  CLUSTERS.forEach((cl, ci) => {
    for (let j = 0; j < cl.n; j++) {
      const a = (j / cl.n) * Math.PI * 2 - Math.PI / 2;
      clusterPos[k++] = { x: cl.x + Math.cos(a) * 165, y: cl.y + Math.sin(a) * 150, c: ci };
    }
  });

  return (
    <AbsoluteFill>
      <Backdrop grid={0.2} particles={20} hue={C.blue} intensity={0.6} />

      <div
        style={{
          position: "absolute",
          top: 365,
          width: "100%",
          textAlign: "center",
          fontFamily: F.mono,
          fontSize: 30,
          letterSpacing: 6,
          color: C.dim,
          opacity: ip(t, [26.2, 26.8], [0, 1]),
        }}
      >
        {reorg < 0.5 ? "UNE ORGANISATION · 20 COLLABORATEURS" : "LA MÊME ÉQUIPE · ORGANISÉE AUTREMENT"}
      </div>

      {/* liens entre pôles */}
      <svg width="1080" height="1920" style={{ position: "absolute", opacity: reorg }}>
        {[
          [0, 1],
          [0, 2],
          [1, 2],
        ].map(([a, b]) => (
          <line
            key={`${a}${b}`}
            x1={CLUSTERS[a].x}
            y1={CLUSTERS[a].y}
            x2={CLUSTERS[b].x}
            y2={CLUSTERS[b].y}
            stroke={C.cyan}
            strokeWidth="3"
            strokeDasharray="10 12"
            strokeDashoffset={-t * 60}
            opacity="0.6"
          />
        ))}
        {clusterPos.map((p, i) => (
          <line
            key={i}
            x1={CLUSTERS[p.c].x}
            y1={CLUSTERS[p.c].y}
            x2={p.x}
            y2={p.y}
            stroke={C.blue}
            strokeWidth="2"
            opacity="0.5"
          />
        ))}
      </svg>
      {CLUSTERS.map((cl) => (
        <div
          key={cl.label}
          style={{
            position: "absolute",
            left: cl.x,
            top: cl.y,
            translate: "-50% -50%",
            width: 170,
            height: 170,
            borderRadius: 170,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: `radial-gradient(circle, ${C.blue}66, ${C.bg}ee)`,
            border: `2px solid ${C.cyan}`,
            boxShadow: `0 0 40px ${C.cyan}55`,
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 30,
            lineHeight: 1.1,
            color: C.white,
            opacity: reorg,
            scale: `${0.6 + 0.4 * reorg}`,
          }}
        >
          {cl.label}
        </div>
      ))}

      {/* 20 collaborateurs */}
      {new Array(20).fill(0).map((_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const gx = gx0 + col * (tileW + gap) + tileW / 2;
        const gy = gy0 + row * (tileH + gap) + tileH / 2;
        const cp = clusterPos[i];
        const x = gx + (cp.x - gx) * reorg;
        const y = gy + (cp.y - gy) * reorg;
        const task = TASK_OF[i];
        const hl = ip(t, [CUES.highlights[task], CUES.highlights[task] + 0.3], [0, 1]);
        const s = intro(i);
        const size = 1 - 0.38 * reorg;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              width: tileW,
              height: tileH,
              scale: `${s * size}`,
              opacity: s,
              borderRadius: 20,
              background: "linear-gradient(160deg, rgba(30,42,70,0.85), rgba(10,16,30,0.9))",
              border: `1.5px solid ${hl > 0.5 && reorg < 0.5 ? C.cyan : "rgba(255,255,255,0.14)"}`,
              boxShadow: hl > 0.5 && reorg < 0.5 ? `0 0 26px ${C.cyan}55` : "0 10px 30px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 12,
            }}
          >
            <Avatar skin={C.skin[i % C.skin.length]} lit={hl * (1 - reorg)} />
            <div
              style={{
                marginTop: 8,
                fontFamily: F.mono,
                fontSize: 21,
                padding: "4px 10px",
                borderRadius: 10,
                color: hl > 0.5 ? C.bg : C.dim,
                background: hl > 0.5 ? C.cyan : "rgba(255,255,255,0.06)",
                opacity: 1 - reorg,
                whiteSpace: "nowrap",
              }}
            >
              {hl > 0.5 ? `⚙ ${TASKS[task]}` : TASKS[task]}
            </div>
          </div>
        );
      })}

      {/* légende des processus automatisables */}
      <div
        style={{
          position: "absolute",
          top: 1150,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 34,
          fontFamily: F.body,
          fontSize: 30,
          color: C.white,
          opacity: ip(t, [29.0, 29.4], [0, 1]) * (1 - reorg),
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: C.cyan }} /> Processus automatisables
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1212,
          width: "100%",
          textAlign: "center",
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 34,
          color: C.white,
          opacity: reorg,
        }}
      >
        Plus de valeur produite · <span style={{ color: C.cyan }}>mêmes ressources</span>
      </div>
    </AbsoluteFill>
  );
};
