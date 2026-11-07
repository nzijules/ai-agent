import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Glass, ScrambleText } from "../components/Common";
import { SeatedBack } from "../components/People";
import { C, CUES, F, ease, ip, useT } from "../lib/theme";

const PROMPT = "Synthétise les ventes du trimestre et propose 3 actions.";
const BARS = [0.42, 0.58, 0.5, 0.74, 0.66, 0.88];
const ACTIONS = ["Relancer les comptes inactifs", "Ajuster les stocks région Nord", "Prioriser les offres B2B"];

export const S3Copilote: React.FC = () => {
  const t = useT();
  const typed = Math.floor(ip(t, [18.3, 19.5], [0, PROMPT.length], (x) => x));
  const morph = CUES.timeMorph;
  const cursorOn = Math.floor(t * 2.5) % 2 === 0;

  return (
    <AbsoluteFill>
      <Backdrop grid={0.2} particles={20} hue={C.blue} intensity={0.9} />

      {/* Fenêtre copilote */}
      <Glass style={{ left: 70, top: 370, width: 940, height: 540, padding: 0 }}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 26px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            fontFamily: F.mono,
            fontSize: 24,
            color: C.dim,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 14, background: c, opacity: 0.8 }} />
          ))}
          <span style={{ marginLeft: 14 }}>Copilote IA · Rapport trimestriel</span>
          <span style={{ marginLeft: "auto", color: C.cyan }}>● en ligne</span>
        </div>

        {/* Requête */}
        <div style={{ position: "absolute", left: 26, top: 90, width: 400 }}>
          <div style={{ fontFamily: F.mono, fontSize: 20, color: C.cyan, marginBottom: 10, letterSpacing: 2 }}>VOUS</div>
          <div
            style={{
              background: "rgba(37,99,235,0.25)",
              border: `1px solid ${C.blue}88`,
              borderRadius: 18,
              padding: "18px 20px",
              fontSize: 28,
              lineHeight: 1.35,
              minHeight: 120,
            }}
          >
            {PROMPT.slice(0, typed)}
            {typed < PROMPT.length && cursorOn ? "▍" : ""}
          </div>
          {/* étapes de l'IA */}
          {["Données importées", "Tendances détectées", "Rapport structuré"].map((s, i) => {
            const at = 19.6 + i * 0.6;
            const p = ip(t, [at, at + 0.3], [0, 1]);
            return (
              <div
                key={s}
                style={{
                  marginTop: i === 0 ? 26 : 12,
                  opacity: p,
                  translate: `${(1 - p) * -20}px 0px`,
                  fontFamily: F.mono,
                  fontSize: 24,
                  color: C.white,
                  display: "flex",
                  gap: 12,
                }}
              >
                <span style={{ color: C.cyan }}>✓</span>
                {s}
              </div>
            );
          })}
        </div>

        {/* Réponse : graphique + rapport */}
        <div style={{ position: "absolute", left: 460, top: 90, width: 454 }}>
          <div style={{ fontFamily: F.mono, fontSize: 20, color: C.cyan, marginBottom: 10, letterSpacing: 2 }}>
            COPILOTE
          </div>
          <div
            style={{
              height: 170,
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              padding: "0 6px 10px",
              borderBottom: "1.5px solid rgba(255,255,255,0.15)",
            }}
          >
            {BARS.map((h, i) => {
              const p = ip(t, [19.5 + i * 0.12, 20.3 + i * 0.12], [0, 1], ease.back);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h * p * 100}%`,
                    borderRadius: "8px 8px 2px 2px",
                    background: i === 5 ? `linear-gradient(${C.cyan}, ${C.blue})` : "rgba(255,255,255,0.22)",
                    boxShadow: i === 5 ? `0 0 20px ${C.cyan}88` : undefined,
                  }}
                />
              );
            })}
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, margin: "20px 0 12px", opacity: ip(t, [20.6, 21], [0, 1]) }}>
            3 actions recommandées
          </div>
          {ACTIONS.map((a, i) => {
            const at = 21 + i * 0.45;
            const p = ip(t, [at, at + 0.4], [0, 1]);
            return (
              <div
                key={a}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  fontSize: 24,
                  marginBottom: 10,
                  opacity: p,
                  translate: `${(1 - p) * 24}px 0px`,
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    color: C.bg,
                    background: C.cyan,
                    borderRadius: 8,
                    padding: "2px 9px",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
                {a}
              </div>
            );
          })}
        </div>
      </Glass>

      {/* Professionnel au premier plan (silhouette, lumière d'écran) */}
      <div style={{ position: "absolute", left: -70, top: 700, opacity: ip(t, [18.0, 18.8], [0, 1]) }}>
        <SeatedBack id="cop" noScreen width={460} skin={C.skin[2]} hair="fade" shirt="#18233A" screenOn={1} />
      </div>

      {/* 4 heures → 4 minutes */}
      <div
        style={{
          position: "absolute",
          left: 380,
          right: 70,
          top: 940,
          opacity: ip(t, [morph - 0.9, morph - 0.4], [0, 1]),
          translate: `0px ${ip(t, [morph - 0.9, morph - 0.4], [40, 0])}px`,
        }}
      >
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: 6, color: C.dim }}>TEMPS DE PRODUCTION</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 4 }}>
          <span
            style={{
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 1,
              color: t >= morph + 0.5 ? C.cyan : C.white,
              textShadow: `0 0 40px ${t >= morph + 0.5 ? C.cyan : C.blue}88`,
            }}
          >
            4
          </span>
          <ScrambleText
            from="HEURES"
            to="MINUTES"
            at={morph}
            dur={0.8}
            style={{
              fontFamily: F.display,
              fontWeight: 700,
              fontSize: 84,
              color: t >= morph + 0.5 ? C.cyan : C.white,
            }}
          />
        </div>
        {/* jauge qui se vide */}
        <div style={{ height: 12, borderRadius: 12, background: "rgba(255,255,255,0.1)", marginTop: 10, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${ip(t, [morph, morph + 0.9], [100, 2], ease.inOut)}%`,
              background: t >= morph + 0.5 ? C.cyan : C.orange,
              boxShadow: `0 0 16px ${C.cyan}`,
            }}
          />
        </div>
        <div style={{ fontFamily: F.body, fontSize: 26, color: C.dim, marginTop: 18, fontStyle: "italic" }}>
          Exemple illustratif — les gains varient selon les tâches.
        </div>
      </div>
    </AbsoluteFill>
  );
};
