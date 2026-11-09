import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, rand } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { VoicePrint } from "../components/Characters";
import { KineticText } from "../components/Text";

const Fragment: React.FC<{ text: string; at: number; x: number; y: number; rot: number }> = ({ text, at, x, y, rot }) => {
  const f = useCurrentFrame();
  const p = ip(f, [at, at + 14], [0, 1]);
  const doubt = ip(f, [243, 263], [0, 1]);
  const float = Math.sin((f + at) / 18) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        transform: `translateX(-50%) rotate(${rot * (1 - p * 0.6)}deg) scale(${0.6 + 0.4 * p})`,
        opacity: p * (1 - doubt * 0.65),
        padding: "16px 28px",
        borderRadius: 14,
        background: C.black,
        border: `2px solid ${C.black}`,
        color: C.yellow,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 42,
        whiteSpace: "nowrap",
        boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
        filter: `blur(${(1 - p) * 8 + doubt * 2}px)`,
      }}
    >
      « {text} »
    </div>
  );
};

/** SÉQUENCE 2 — LA FAUSSE CONFIANCE */
export const S2Confiance: React.FC = () => {
  const f = useCurrentFrame();
  const badgeIn = ip(f, [200, 218], [0, 1]);
  const shatter = ip(f, [243, 277], [0, 1]);
  const titleAt = 305;
  return (
    <AbsoluteFill>
      <Backdrop tint="yellow" />
      {/* l'appelant n'a pas de visage : seulement une voix */}
      <div style={{ position: "absolute", left: 540 - 300, top: 560, opacity: 1 - shatter * 0.6, transform: `scale(${1 + lin(f, [0, 366], [0, 0.08])})` }}>
        <VoicePrint size={600} talk={f < 290 ? 1 : 0.2} color={C.black} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1250, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24, letterSpacing: 2, opacity: ip(f, [20, 34], [0, 1]) * (1 - shatter) }}>
        <span style={{ color: C.black }}>TON : <b>ASSURÉ</b></span>
        <span style={{ color: C.black }}>DÉBIT : <b>RÉGULIER</b></span>
        <span style={{ color: C.black }}>IDENTITÉ : <b style={{ color: C.red }}>???</b></span>
      </div>
      <Fragment text="Service client" at={83} x={330} y={330} rot={-6} />
      <Fragment text="Sécurisation du compte" at={115} x={620} y={450} rot={5} />
      <Fragment text="Intervention urgente" at={157} x={400} y={1150} rot={-4} />

      {/* badge fictif qui se fragmente */}
      {f < 305 && (
        <div style={{ position: "absolute", left: 600, top: 760, width: 360, height: 220 }}>
          {new Array(16).fill(0).map((_, i) => {
            const cx = i % 4;
            const cy = Math.floor(i / 4);
            const dx = (rand(i + 1) - 0.5) * 600 * shatter;
            const dy = (rand(i + 9) - 0.2) * 700 * shatter;
            const r = (rand(i + 4) - 0.5) * 180 * shatter;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: cx * 90,
                  top: cy * 55,
                  width: 90,
                  height: 55,
                  overflow: "hidden",
                  opacity: badgeIn * (1 - shatter),
                  transform: `translate(${dx}px, ${dy}px) rotate(${r}deg) scale(${0.85 + 0.15 * badgeIn})`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -cx * 90,
                    top: -cy * 55,
                    width: 360,
                    height: 220,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #f3f4f6, #c9ccd3)",
                    border: "3px solid #fff",
                    fontFamily: FONT,
                    color: C.anthracite,
                    padding: 20,
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: 2 }}>BADGE « AGENT »</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                    <div style={{ width: 80, height: 100, borderRadius: 8, background: "#888" }} />
                    <div style={{ fontFamily: MONO, fontSize: 18, lineHeight: 1.6 }}>
                      Nom : ????<br />Matricule : ????<br />Service : ????
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", top: -50, left: 0, fontFamily: MONO, fontSize: 22, color: C.black, fontWeight: 700, letterSpacing: 2, opacity: badgeIn * (1 - shatter) * (Math.floor(f / 8) % 2 ? 1 : 0.4) }}>
            ⚠ IDENTIFIANT INVÉRIFIABLE
          </div>
        </div>
      )}
      {/* « Tout semble officiel. Pourtant… » */}
      <div style={{ position: "absolute", top: 1330, left: 60, right: 60, opacity: f < titleAt ? 1 : 0 }}>
        {f > 257 && <KineticText text="RIEN N'A ÉTÉ VÉRIFIÉ" start={267} size={78} highlight={["RIEN"]} highlightColor={C.red} />}
      </div>
      {/* transition vers le titre du dossier */}
      {f >= titleAt && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${ip(f, [titleAt, titleAt + 10], [0, 0.94])})`, alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${lin(f, [titleAt, titleAt + 66], [1.15, 1])})`, textAlign: "center" }}>
            <div style={{ width: ip(f, [titleAt, titleAt + 14], [0, 760]), height: 6, background: C.yellow, margin: "0 auto 30px" }} />
            <KineticText text="DOSSIER FRAUDE" start={titleAt + 4} size={100} color={C.white} />
            <KineticText text="N°002" start={titleAt + 12} size={220} color={C.yellow} />
            <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: C.dim, marginTop: 20, opacity: ip(f, [titleAt + 24, titleAt + 34], [0, 1]) }}>
              LE FAUX AGENT MOBILE MONEY
            </div>
            <div style={{ width: ip(f, [titleAt + 6, titleAt + 20], [0, 760]), height: 6, background: C.yellow, margin: "30px auto 0" }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
