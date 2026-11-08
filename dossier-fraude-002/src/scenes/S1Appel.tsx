import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, shake } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { Phone, SimTag } from "../components/Phone";
import { IncomingCall } from "../components/CallScreens";
import { KineticText, TypeText } from "../components/Text";
import { Waveform } from "../components/Widgets";

/** SÉQUENCE 1 — L'APPEL INATTENDU */
export const S1Appel: React.FC = () => {
  const f = useCurrentFrame();
  const A_END = 150;
  const B_END = 250;

  // vibration par salves : 18 frames de buzz, 12 de pause
  const buzz = f >= 40 && f < 140 && (f - 40) % 30 < 18 ? 1 : 0;
  const pick = ip(f, [118, 150], [0, 1]);
  const phoneTilt = 58 * (1 - pick);
  const camPush = lin(f, [0, 150], [0.78, 1.0]);

  // phase B → C
  const whipB = ip(f, [A_END, A_END + 12], [1, 0]);
  const danger = ip(f, [B_END, B_END + 10], [0, 1]);
  const sk = shake(f, B_END + 18, 22, 20);
  const sk2 = shake(f, B_END + 40, 12, 16);

  return (
    <AbsoluteFill>
      <Backdrop tint={f > B_END ? "red" : "yellow"} intensity={f > B_END ? 0.6 + 0.4 * Math.sin(f / 5) : 1} />

      {/* PHASE A — le téléphone posé sur la table */}
      {f < A_END + 12 && (
        <AbsoluteFill style={{ transform: `translateX(${(1 - whipB) * -1100}px)`, filter: f > A_END ? `blur(${(1 - whipB) * 20}px)` : undefined }}>
          {/* ombre portée du téléphone posé sur la surface jaune */}
          <div style={{ position: "absolute", left: 190, top: 1050 + 260 * (1 - pick), width: 700, height: 300, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.35), transparent)", filter: "blur(18px)", opacity: 1 - pick * 0.6 }} />
          {/* reflet lumineux de l'écran sur la table */}
          <div
            style={{
              position: "absolute",
              left: 290,
              top: 1080,
              width: 500,
              height: 420,
              borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(255,255,255,0.6), transparent)",
              opacity: f > 40 ? 0.6 + buzz * 0.4 : 0,
              filter: "blur(20px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 820 + 380 * (1 - pick),
              width: 0,
              height: 0,
              perspective: 1600,
            }}
          >
            <div style={{ transform: `scale(${camPush}) rotateX(${phoneTilt}deg)`, transformOrigin: "50% 50%" }}>
              <Phone vibrate={buzz} screenOn={ip(f, [38, 52], [0, 1])} style={{ left: -280, top: -570 }}>
                <IncomingCall start={42} acceptAt={9999} />
              </Phone>
            </div>
          </div>
          {/* intertitre d'ouverture */}
          <div style={{ position: "absolute", top: 230, left: 70, color: C.black }}>
            <TypeText text="ABIDJAN · 19:02" start={6} cps={0.7} style={{ fontSize: 40, letterSpacing: 6, fontWeight: 700 }} />
          </div>
          {f > 40 && f < 140 && (
            <div
              style={{
                position: "absolute",
                top: 320,
                left: 70,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 34,
                letterSpacing: 6,
                color: C.black,
                opacity: buzz ? 1 : 0.35,
              }}
            >
              ))) VIBRATION · APPEL ENTRANT
            </div>
          )}
          {f > 52 && <SimTag style={{ top: 1500 }} />}
        </AbsoluteFill>
      )}

      {/* PHASE B & C — Koffi décroche, la voix parle */}
      {f >= A_END && (
        <AbsoluteFill style={{ transform: `translate(${whipB * 1100 + sk.x + sk2.x}px, ${sk.y + sk2.y}px)` }}>
          {/* gros plan : le téléphone en communication, ville floue derrière */}
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 1060,
              width: 0,
              height: 0,
              perspective: 1800,
              filter: danger > 0 ? `brightness(${1 - danger * 0.6}) blur(${danger * 4}px)` : undefined,
            }}
          >
            <div style={{ transform: `scale(${0.78 + lin(f, [A_END, 360], [0, 0.1])}) rotateY(${-14 + lin(f, [A_END, 360], [0, 10])}deg) rotateZ(${-4 + lin(f, [A_END, 360], [0, 3])}deg)` }}>
              <Phone style={{ left: -280, top: -570 }}>
                <IncomingCall start={A_END - 60} acceptAt={A_END - 20} />
              </Phone>
            </div>
          </div>
          {/* panneau voix entrante */}
          <div
            style={{
              position: "absolute",
              top: 270,
              left: 70,
              right: 70,
              padding: "28px 34px",
              borderRadius: 26,
              background: "rgba(10,10,10,0.82)",
              border: `2px solid ${danger > 0.5 ? C.red : "rgba(255,203,5,0.5)"}`,
              opacity: ip(f, [A_END + 10, A_END + 24], [0, 1]) * (1 - danger * 0.9),
              transform: `translateY(${ip(f, [A_END + 10, A_END + 24], [-30, 0])}px)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontSize: 24, color: C.dim, letterSpacing: 2 }}>
              <span>◉ VOIX ENTRANTE · NUMÉRO INCONNU</span>
              <span style={{ color: C.yellow }}>00:{String(Math.floor((f - A_END) / 30)).padStart(2, "0")}</span>
            </div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <Waveform width={860} height={130} bars={46} seed={9} speaking={(fr) => (Math.sin(fr / 8) > -0.5 ? 1 : 0.1)} />
            </div>
          </div>
          {/* phase C : VOTRE ARGENT EST EN DANGER */}
          {f >= B_END && (
            <>
              <AbsoluteFill
                style={{
                  background: `radial-gradient(80% 60% at 50% 45%, rgba(255,203,5,0.85), rgba(255,203,5,0.6) 60%, rgba(229,37,42,${0.35 + 0.2 * Math.sin(f / 4)}) 100%)`,
                }}
              />
              <div style={{ position: "absolute", top: 380, left: 60, right: 60 }}>
                <KineticText
                  text="VOTRE ARGENT EST EN DANGER"
                  start={B_END + 4}
                  stagger={5}
                  size={150}
                  highlight={["DANGER"]}
                  highlightColor={C.red}
                  lineHeight={0.95}
                  
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 1080,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: MONO,
                  fontSize: 30,
                  color: C.black,
                  fontWeight: 700,
                  letterSpacing: 4,
                  opacity: ip(f, [B_END + 40, B_END + 50], [0, 1]),
                }}
              >
                « TENTATIVE DE RETRAIT FRAUDULEUX »
              </div>
            </>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
