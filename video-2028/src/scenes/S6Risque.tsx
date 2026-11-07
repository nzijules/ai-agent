import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Common";
import { C, CUES, F, ease, ip, rand, useT } from "../lib/theme";

// absorb : moment d'absorption (indice dans CUES.absorb) ; full = tâche entièrement absorbée
const SKILLS = [
  { label: "SAISIE", absorb: 0, full: true },
  { label: "REPORTING", absorb: 1, full: true },
  { label: "ANALYSE", absorb: 4, full: false },
  { label: "RÉDACTION", absorb: 2, full: false },
  { label: "PROGRAMMATION", absorb: 3, full: false },
  { label: "COORDINATION", absorb: -1, full: false },
];
const CX = 540;
const CY = 790;

export const S6Risque: React.FC = () => {
  const t = useT();
  const absorbed = CUES.absorb.filter((a) => t >= a).length;
  const heat = ip(t, [CUES.absorb[0], CUES.absorb[4] + 0.5], [0, 1], ease.inOut);
  const coreColor = heat > 0.5 ? C.orange : C.cyan;

  return (
    <AbsoluteFill>
      <Backdrop grid={0.15} particles={30} hue={heat > 0.5 ? C.orange : C.blue} intensity={0.5 + heat * 0.5} />

      <div
        style={{
          position: "absolute",
          top: 370,
          width: "100%",
          textAlign: "center",
          fontFamily: F.mono,
          fontSize: 30,
          letterSpacing: 6,
          color: C.dim,
        }}
      >
        VOS COMPÉTENCES AUJOURD'HUI
      </div>

      {/* Noyau d'automatisation */}
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="core">
            <stop offset="0" stopColor={C.white} />
            <stop offset="0.25" stopColor={coreColor} />
            <stop offset="1" stopColor={coreColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={120 + absorbed * 10 + Math.sin(t * 6) * 4} fill="url(#core)" opacity="0.8" />
        {[150, 190, 235].map((r, i) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke={coreColor}
            strokeWidth={i === 1 ? 3 : 1.5}
            strokeDasharray={i === 0 ? "40 20" : i === 1 ? "4 10" : "120 60"}
            transform={`rotate(${t * (i % 2 ? -40 : 30) * (1 + heat)} ${CX} ${CY})`}
            opacity={0.7}
          />
        ))}
        <text x={CX} y={CY + 12} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="34" fontWeight="700" fill={C.bg}>
          IA
        </text>
      </svg>

      {/* Cartes de compétences en orbite */}
      {SKILLS.map((s, i) => {
        const a = (i / SKILLS.length) * Math.PI * 2 + t * 0.25;
        const ox = CX + Math.cos(a) * 330;
        const oy = CY + Math.sin(a) * 330;
        const depth = 0.85 + 0.15 * Math.sin(a);
        const at = s.absorb >= 0 ? CUES.absorb[s.absorb] : 999;
        const pull = ip(t, [at - 0.15, at + 0.55], [0, 1], ease.in);
        const pulled = s.full ? pull : pull * 0.0;
        const x = ox + (CX - ox) * pulled;
        const y = oy + (CY - oy) * pulled;
        const hit = t >= at;
        const keep = !s.full && hit;
        return (
          <React.Fragment key={s.label}>
            {/* fragments aspirés */}
            {hit &&
              new Array(14).fill(0).map((_, j) => {
                const d = ip(t, [at + j * 0.03, at + 0.6 + j * 0.03], [0, 1], ease.in);
                if (d <= 0 || d >= 1) return null;
                const jx = (rand(i * 31 + j) - 0.5) * 120;
                const jy = (rand(i * 17 + j) - 0.5) * 60;
                return (
                  <div
                    key={j}
                    style={{
                      position: "absolute",
                      left: ox + jx + (CX - ox - jx) * d,
                      top: oy + jy + (CY - oy - jy) * d,
                      width: 12,
                      height: 12,
                      background: j % 3 ? C.cyan : C.orange,
                      opacity: 1 - d,
                      boxShadow: `0 0 10px ${C.cyan}`,
                    }}
                  />
                );
              })}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                translate: "-50% -50%",
                scale: `${depth * (1 - 0.85 * pulled)}`,
                opacity: (1 - pulled) * (keep ? 0.75 : 1),
                padding: "20px 26px",
                borderRadius: 18,
                background: "linear-gradient(160deg, rgba(30,42,70,0.92), rgba(10,16,30,0.95))",
                border: `2px solid ${keep ? C.orange : s.absorb < 0 ? C.white : `${C.cyan}88`}`,
                boxShadow: keep ? `0 0 30px ${C.orange}55` : `0 10px 30px rgba(0,0,0,0.5)`,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 34,
                color: C.white,
                whiteSpace: "nowrap",
                textAlign: "center",
                zIndex: Math.round(depth * 100),
              }}
            >
              {s.label}
              {keep && (
                <div style={{ fontSize: 20, fontWeight: 500, color: C.orange, marginTop: 6 }}>en partie automatisée</div>
              )}
              {s.absorb < 0 && t > CUES.absorb[4] + 0.4 && (
                <div style={{ fontSize: 20, fontWeight: 500, color: C.cyan, marginTop: 6 }}>valeur humaine</div>
              )}
            </div>
          </React.Fragment>
        );
      })}

      {/* Expérience : sablier qui ne suffit plus */}
      <div
        style={{
          position: "absolute",
          top: 1200,
          width: "100%",
          textAlign: "center",
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 36,
          color: C.orange,
          opacity: ip(t, [44.8, 45.4], [0, 1]) * ip(t, [47.4, 47.9], [1, 0]),
        }}
      >
        Expérience ≠ garantie
      </div>
    </AbsoluteFill>
  );
};
