import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, shake } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { EvidenceTitle, TypeText } from "../components/Text";
import { Stamp } from "../components/Stamp";

const ROWS = [
  { k: "NOM", v: "K. Koffi", src: "réseaux sociaux" },
  { k: "NUMÉRO", v: "+225 05 •• •• •• 12", src: "annuaire / fuite" },
  { k: "QUARTIER", v: "Yopougon", src: "publication publique" },
  { k: "APPELANT", v: "« Agent service client »", src: "AUCUNE PREUVE" },
];

/** SÉQUENCE 3 — PIÈCE À CONVICTION N°1 : L'IDENTITÉ DE L'APPELANT */
export const S3Identite: React.FC = () => {
  const f = useCurrentFrame();
  const open = ip(f, [40, 70], [0, 1]);
  const stampAt = 330;
  const sk = shake(f, stampAt + 4, 20, 14);
  // trajectoire de la loupe
  const lensY = lin(f, [165, 195, 225, 255, 285, 310], [820, 820, 940, 1060, 1180, 1180]);
  const lensX = 640 + Math.sin(f / 14) * 60;
  return (
    <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px)` }}>
      <Backdrop tint="yellow" />
      <EvidenceTitle label="PIÈCE À CONVICTION N°1" title="L'IDENTITÉ DE L'APPELANT" start={6} />
      {/* dossier */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 640, height: 820, perspective: 1800 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "#1c1c1c", border: "2px solid #000", boxShadow: "0 40px 80px rgba(0,0,0,0.35)" }}>
          <div style={{ position: "absolute", top: -46, left: 40, padding: "10px 26px", borderRadius: "14px 14px 0 0", background: C.black, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: C.yellow, letterSpacing: 3 }}>
            DOSSIER · APPELANT
          </div>
          <div style={{ padding: "60px 44px", opacity: ip(f, [60, 80], [0, 1]) }}>
            {ROWS.map((r, i) => {
              const at = 119 + i * 18;
              const near = Math.abs(lensY - (820 + i * 120)) < 60 && f > 165;
              const flagged = i === 3 && f > 285;
              return (
                <div
                  key={r.k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 120,
                    borderBottom: "1px dashed #3a3a3a",
                    background: near ? "rgba(255,203,5,0.10)" : "transparent",
                    padding: "0 14px",
                    opacity: ip(f, [at, at + 10], [0, 1]),
                    transform: `translateX(${ip(f, [at, at + 10], [40, 0])}px)`,
                  }}
                >
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: C.dim }}>{r.k}</div>
                    <TypeText text={r.v} start={at + 4} cps={1.4} cursor={false} style={{ fontSize: 40, color: C.white, fontWeight: 700 }} />
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 22,
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: `2px solid ${flagged ? C.red : "rgba(255,203,5,0.5)"}`,
                      color: flagged ? C.red : C.yellow,
                      opacity: ip(f, [at + 20, at + 30], [0, 1]),
                    }}
                  >
                    {r.src}
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 40, fontFamily: FONT, fontSize: 32, color: C.white, fontWeight: 600, lineHeight: 1.35, opacity: ip(f, [230, 246], [0, 1]) }}>
              Connaître vos informations <span style={{ color: C.yellow, fontWeight: 900 }}>≠</span> être un agent.
            </div>
          </div>
        </div>
        {/* couverture qui s'ouvre */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background: "linear-gradient(135deg, #2a2a2a, #121212)",
            border: `2px solid ${C.yellow}`,
            transformOrigin: "50% 0%",
            transform: `rotateX(${open * 100}deg)`,
            opacity: open < 0.95 ? 1 : 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 60,
            color: C.yellow,
            letterSpacing: 6,
            backfaceVisibility: "hidden",
          }}
        >
          CONFIDENTIEL
        </div>
      </div>
      {/* loupe numérique */}
      {f > 155 && f < stampAt && (
        <div style={{ position: "absolute", left: lensX - 110, top: lensY - 110 + 0, width: 220, height: 220, opacity: ip(f, [155, 167], [0, 1]) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 110, border: `10px solid ${C.yellow}`, background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), rgba(255,203,5,0.05) 60%)", boxShadow: "0 0 40px rgba(255,203,5,0.5)" }} />
          <div style={{ position: "absolute", width: 26, height: 120, background: C.yellow, borderRadius: 12, left: 190, top: 180, transform: "rotate(-45deg)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: `${50 + 40 * Math.sin(f / 5)}%`, height: 3, background: C.yellow, opacity: 0.8 }} />
        </div>
      )}
      <Stamp text="IDENTITÉ" sub="NON VÉRIFIÉE" at={stampAt} size={110} style={{ top: 1060 }} />
    </AbsoluteFill>
  );
};
