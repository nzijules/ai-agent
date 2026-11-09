import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, sp } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { KineticText } from "../components/Text";
import { FlowParticles } from "../components/Widgets";

type NodeDef = { x: number; y: number; n: string; title: string; desc: string; icon: string; at: number; color: string };

/** SÉQUENCE 6 — RECONSTITUTION FORENSIC (schéma pédagogique, non opérationnel) */
export const S6Forensic: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nodes: NodeDef[] = [
    { x: 260, y: 640, n: "1", title: "INFORMATIONS", desc: "Nom, numéro, quartier : déjà en sa possession", icon: "👤", at: 41, color: C.black },
    { x: 820, y: 940, n: "2", title: "OPÉRATION", desc: "Il déclenche une action qui exige une vérification", icon: "⟳", at: 152, color: C.black },
    { x: 260, y: 1240, n: "3", title: "MANIPULATION", desc: "Il pousse la victime à donner le code manquant", icon: "🗝", at: 276, color: C.red },
  ];
  const link = (a: NodeDef, b: NodeDef, at: number, color: string) => {
    const p = ip(f, [at, at + 30], [0, 1]);
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    return (
      <g key={`${a.n}${b.n}`}>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={4} strokeDasharray={`${len}`} strokeDashoffset={len * (1 - p)} opacity={0.8} />
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={14} strokeDasharray={`${len}`} strokeDashoffset={len * (1 - p)} opacity={0.15} />
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <Backdrop tint="yellow" />
      <div style={{ position: "absolute", top: 250, left: 70, right: 70 }}>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.black, fontWeight: 700, letterSpacing: 4, opacity: ip(f, [0, 10], [0, 1]) }}>▶ ANALYSE DU MODE OPÉRATOIRE</div>
        <KineticText text="RECONSTITUTION" start={4} size={104} align="left" style={{ marginTop: 10 }} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* grille de nœuds secondaires */}
        {new Array(24).fill(0).map((_, i) => {
          const x = 100 + (i % 6) * 176;
          const y = 560 + Math.floor(i / 6) * 260;
          return <circle key={i} cx={x} cy={y} r={3} fill={C.black} opacity={0.2 + 0.1 * Math.sin(f / 10 + i)} />;
        })}
        {link(nodes[0], nodes[1], 128, C.black)}
        {link(nodes[1], nodes[2], 250, C.red)}
        {/* cible finale : le code */}
        {f > 310 && (() => {
          const p = ip(f, [310, 335], [0, 1]);
          return <line x1={260} y1={1330} x2={500} y2={1440} stroke={C.red} strokeWidth={4} strokeDasharray="12 10" opacity={p} />;
        })()}
      </svg>
      <FlowParticles x1={nodes[0].x} y1={nodes[0].y} x2={nodes[1].x} y2={nodes[1].y} start={152} color={C.black} />
      <FlowParticles x1={nodes[1].x} y1={nodes[1].y} x2={nodes[2].x} y2={nodes[2].y} start={276} color={C.red} />
      <FlowParticles x1={260} y1={1330} x2={500} y2={1440} start={330} color={C.red} speed={24} />
      {nodes.map((nd) => {
        const s = sp(f, fps, nd.at, 12);
        const active = f > nd.at;
        const ring = ((f - nd.at) % 40) / 40;
        const left = nd.x < 540;
        return (
          <React.Fragment key={nd.n}>
            {active && (
              <div style={{ position: "absolute", left: nd.x - 90 - ring * 40, top: nd.y - 90 - ring * 40, width: 180 + ring * 80, height: 180 + ring * 80, borderRadius: "50%", border: `2px solid ${nd.color}`, opacity: (1 - ring) * 0.6 }} />
            )}
            <div
              style={{
                position: "absolute",
                left: nd.x - 90,
                top: nd.y - 90,
                width: 180,
                height: 180,
                borderRadius: 90,
                background: "#111",
                border: `6px solid ${nd.color === C.red ? C.red : "#fff"}`,
                transform: `scale(${s})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
              }}
            >
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 118, lineHeight: 1, marginTop: -6, color: nd.color === C.red ? C.red : C.yellow }}>{nd.n}</div>
            </div>
            <div
              style={{
                position: "absolute",
                top: nd.y - 70,
                left: left ? nd.x + 120 : 70,
                width: left ? 1080 - nd.x - 190 : nd.x - 210,
                textAlign: left ? "left" : "right",
                opacity: ip(f, [nd.at + 10, nd.at + 22], [0, 1]),
                transform: `translateX(${ip(f, [nd.at + 10, nd.at + 22], [left ? 30 : -30, 0])}px)`,
              }}
            >
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.black }}>{nd.title}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 30, color: "rgba(0,0,0,0.75)", marginTop: 8, lineHeight: 1.3 }}>{nd.desc}</div>
            </div>
          </React.Fragment>
        );
      })}
      {f > 330 && (
        <div style={{ position: "absolute", left: 500, top: 1400, width: 420, padding: "18px 22px", borderRadius: 16, border: `3px solid ${C.red}`, background: "#1a0606", fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.white, textAlign: "center", transform: `scale(${sp(f, fps, 330, 12)})` }}>
          🔒 CODE = <span style={{ color: C.red }}>CLÉ</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
