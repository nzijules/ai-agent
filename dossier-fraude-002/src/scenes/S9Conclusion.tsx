import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, sp } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { Phone, SimTag } from "../components/Phone";
import { KineticText } from "../components/Text";
import { Shield } from "../components/Widgets";

/** SÉQUENCE 9 — CONCLUSION */
export const S9Conclusion: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const MSG = 153;
  const END = 235;
  const toPhone = ip(f, [40, 60], [0, 1]);
  const msg = ip(f, [MSG - 6, MSG + 6], [0, 1]);
  return (
    <AbsoluteFill>
      <Backdrop tint="yellow" />
      {f < 70 && (
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 34, letterSpacing: 6, color: C.black, fontWeight: 700, opacity: ip(f, [6, 16], [0, 1]) * (1 - toPhone) }}>
          ✕ APPEL SUSPECT TERMINÉ
        </div>
      )}
      {/* téléphone + bouclier */}
      {f < MSG + 10 && (
        <AbsoluteFill style={{ opacity: ip(f, [0, 12], [0, 1]) * (1 - msg) }}>
          <div style={{ position: "absolute", left: 110, top: 360 }}>
            <Shield start={95} size={860} />
          </div>
          <div style={{ position: "absolute", left: 540, top: 900, width: 0, height: 0, transform: "scale(0.72)" }}>
            <Phone style={{ left: -280, top: -570 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #17171a, #0b0b0c)", fontFamily: FONT, color: C.white, padding: "130px 44px", boxSizing: "border-box" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: 1 - toPhone }}>
                  <div style={{ fontSize: 30, color: C.dim, letterSpacing: 4, fontWeight: 700 }}>APPEL TERMINÉ</div>
                  <div style={{ fontSize: 64, fontWeight: 800, marginTop: 16 }}>Numéro inconnu</div>
                  <div style={{ fontFamily: MONO, fontSize: 34, color: C.red, marginTop: 16 }}>01:12</div>
                </div>
                <div style={{ fontSize: 30, color: C.dim, letterSpacing: 3, fontWeight: 700, opacity: toPhone }}>VÉRIFICATION</div>
                {["Appel terminé", "Fraude signalée au 222", "Aucune opération en cours", "Compte : RAS"].map((t, i) => {
                  const at = 60 + i * 12;
                  return (
                    <div key={i} style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 40, opacity: ip(f, [at, at + 10], [0, 1]), transform: `translateX(${ip(f, [at, at + 10], [30, 0])}px)` }}>
                      <div style={{ width: 54, height: 54, borderRadius: 27, background: C.yellow, color: C.black, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 32 }}>✓</div>
                      <div style={{ fontSize: 38, fontWeight: 700 }}>{t}</div>
                    </div>
                  );
                })}
                <SimTag style={{ bottom: 70 }} />
              </div>
            </Phone>
          </div>
        </AbsoluteFill>
      )}
      {/* message final */}
      {f >= MSG && f < END + 10 && (
        <AbsoluteFill style={{ justifyContent: "center", opacity: 1 - ip(f, [END, END + 10], [0, 1]) }}>
          <div style={{ marginTop: -120 }}>
            <KineticText text="FACE À LA FRAUDE," start={MSG + 2} size={104} stagger={4} />
            <KineticText text="VÉRIFIEZ AVANT D'AGIR." start={MSG + 16} size={128} stagger={5} highlight={["VÉRIFIEZ"]} style={{ marginTop: 20 }} />
            <div style={{ width: ip(f, [MSG + 36, MSG + 60], [0, 600]), height: 10, background: C.black, margin: "50px auto 0" }} />
          </div>
        </AbsoluteFill>
      )}
      {/* carton de fin */}
      {f >= END && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 8, color: C.black, fontWeight: 700, opacity: ip(f, [END + 4, END + 14], [0, 1]), marginTop: -160 }}>DOSSIER FRAUDE</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 260, color: C.black, lineHeight: 1, transform: `scale(${sp(f, fps, END + 4, 12)})`, textShadow: "0 18px 40px rgba(0,0,0,0.2)" }}>N°002</div>
          <div
            style={{
              marginTop: 60,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "28px 44px",
              borderRadius: 60,
              background: C.red,
              color: C.white,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 40,
              letterSpacing: 1,
              transform: `scale(${sp(f, fps, 285, 10) * (1 + 0.03 * Math.sin(f / 4))})`,
              boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ display: "inline-block", transform: `rotate(${Math.sin(f / 2) * 18 * ip(f, [295, 305], [0, 1])}deg)` }}>🔔</span>
            ABONNEZ-VOUS
          </div>
          <div style={{ marginTop: 30, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.black, opacity: ip(f, [292, 304], [0, 1]) }}>pour le prochain dossier</div>
        </AbsoluteFill>
      )}
      <div style={{ display: "none" }}>{lin(f, [0, 1], [0, 1])}</div>
    </AbsoluteFill>
  );
};
