import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, shake } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { EvidenceTitle, KineticText } from "../components/Text";
import { Counter, Countdown, FlowParticles } from "../components/Widgets";
import { SimTag } from "../components/Phone";

const HISTORY = [
  { d: "Hier", l: "Achat crédit", a: "- 1 000" },
  { d: "Lun.", l: "Réception d'un proche", a: "+ 25 000" },
  { d: "Sam.", l: "Paiement facture", a: "- 12 500" },
  { d: "Ven.", l: "Achat crédit", a: "- 2 000" },
];

/** SÉQUENCE 4 — PIÈCE À CONVICTION N°2 : LA MENACE */
export const S4Menace: React.FC = () => {
  const f = useCurrentFrame();
  const compareAt = 248;
  const cmp = ip(f, [compareAt, compareAt + 22], [0, 1]);
  const sk = shake(f, 135, 10, 12);
  return (
    <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px)` }}>
      <Backdrop tint={f < compareAt ? "red" : "yellow"} intensity={f < compareAt ? 0.5 + 0.3 * Math.sin(f / 5) : 1} />
      <EvidenceTitle label="PIÈCE À CONVICTION N°2" title="LA MENACE" start={6} />

      {/* panneau « menace » : affirmation du fraudeur */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 70,
          right: 70,
          transform: `translateX(${-cmp * 120}px) scale(${1 - cmp * 0.12})`,
          opacity: 1 - cmp * 0.55,
          filter: cmp > 0 ? `grayscale(${cmp})` : undefined,
        }}
      >
        <div style={{ borderRadius: 26, border: `3px solid ${C.red}`, background: "#1a0606", padding: "34px 40px", boxShadow: "0 0 60px rgba(229,37,42,0.35)" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.red, letterSpacing: 3 }}>« TRANSACTION SUSPECTE » — SELON L'APPELANT</div>
          <div style={{ marginTop: 18, fontFamily: FONT, color: C.white, fontWeight: 900, fontSize: 124, letterSpacing: -3, lineHeight: 1 }}>
            <Counter to={150000} start={99} dur={36} />
            <span style={{ fontSize: 50, color: C.dim, marginLeft: 14 }}>FCFA</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
            <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: C.white, lineHeight: 1.3 }}>
              Retrait « imminent »
              <br />
              <span style={{ color: C.red }}>Agissez maintenant !</span>
            </div>
            <Countdown start={160} size={250} speed={6} />
          </div>
        </div>
        <FlowParticles x1={60} y1={360} x2={900} y2={360} start={95} color={C.red} count={10} speed={30} />
      </div>

      {/* comparaison : historique simulé */}
      {f >= compareAt && (
        <div
          style={{
            position: "absolute",
            top: 900,
            left: 110,
            right: 70,
            transform: `translateY(${(1 - cmp) * 300}px)`,
            opacity: cmp,
            borderRadius: 26,
            background: C.light,
            color: C.anthracite,
            padding: "28px 34px",
            boxShadow: "0 30px 70px rgba(0,0,0,0.35)", border: "3px solid #000",
            fontFamily: FONT,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 32 }}>Historique (simulation)</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: "#1a7f4e", background: "rgba(43,182,115,0.15)", padding: "6px 14px", borderRadius: 30 }}>
              ✓ RIEN D'ANORMAL
            </div>
          </div>
          {HISTORY.map((h, i) => {
            const at = compareAt + 18 + i * 8;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #d9dbe0", fontSize: 30, opacity: ip(f, [at, at + 8], [0, 1]), transform: `translateX(${ip(f, [at, at + 8], [30, 0])}px)` }}>
                <span style={{ color: "#777", width: 90 }}>{h.d}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{h.l}</span>
                <span style={{ fontWeight: 800, color: h.a.startsWith("+") ? "#1a7f4e" : C.anthracite }}>{h.a}</span>
              </div>
            );
          })}
          <div style={{ position: "relative", height: 30 }}>
            <SimTag style={{ top: 18, background: "rgba(0,0,0,0.85)" }} />
          </div>
        </div>
      )}
      {f > 346 && (
        <div style={{ position: "absolute", top: 1440, left: 60, right: 60 }}>
          <KineticText text="UNE AFFIRMATION N'EST PAS UNE PREUVE" start={353} size={64} stagger={3} highlight={["AFFIRMATION", "PREUVE"]} />
        </div>
      )}
      {/* flash d'urgence au rythme du compte à rebours */}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${120 + 60 * Math.sin(f / 3)}px rgba(229,37,42,${f < compareAt && f > 160 ? 0.45 : 0})`, pointerEvents: "none" }} />
      {/* repère temporel */}
      <div style={{ display: "none" }}>{lin(f, [0, 1], [0, 1])}</div>
    </AbsoluteFill>
  );
};
