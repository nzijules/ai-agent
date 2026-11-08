import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, shake } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { Phone, SimTag } from "../components/Phone";
import { IncomingCall } from "../components/CallScreens";
import { CityBokeh } from "../components/Characters";
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
      <Backdrop tint={f > B_END ? "red" : "night"} intensity={f > B_END ? 0.6 + 0.4 * Math.sin(f / 5) : 1} />

      {/* PHASE A — le téléphone posé sur la table */}
      {f < A_END + 12 && (
        <AbsoluteFill style={{ transform: `translateX(${(1 - whipB) * -1100}px)`, filter: f > A_END ? `blur(${(1 - whipB) * 20}px)` : undefined }}>
          <CityBokeh height={820} style={{ top: 120, opacity: 0.95 - pick * 0.4, transform: `scale(${1 + f / 900})` }} />
          {/* fenêtre / encadrement */}
          <div style={{ position: "absolute", top: 120, left: 0, right: 0, height: 820, boxShadow: "inset 0 -160px 140px #000, inset 0 120px 120px #000" }} />
          <div style={{ position: "absolute", left: 540, top: 120, width: 14, height: 820, background: "#050505" }} />
          {/* table */}
          <div
            style={{
              position: "absolute",
              top: 900,
              left: -100,
              right: -100,
              bottom: 0,
              background: "linear-gradient(180deg, #2a1d12 0%, #120c07 60%, #050302 100%)",
              transform: "perspective(900px) rotateX(18deg)",
              transformOrigin: "top",
            }}
          />
          {/* reflet lumineux de l'écran sur la table */}
          <div
            style={{
              position: "absolute",
              left: 290,
              top: 1080,
              width: 500,
              height: 420,
              borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(255,203,5,0.35), transparent)",
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
          <div style={{ position: "absolute", top: 230, left: 70, color: C.white }}>
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
                color: C.yellow,
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
          <CityBokeh style={{ opacity: 0.55 * (1 - danger * 0.6), transform: `scale(${1.1 + lin(f, [A_END, 360], [0, 0.15])})` }} />
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
                  background: `radial-gradient(80% 60% at 50% 45%, rgba(229,37,42,${0.25 + 0.15 * Math.sin(f / 4)}), transparent 70%)`,
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
                  style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}
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
                  color: C.red,
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
