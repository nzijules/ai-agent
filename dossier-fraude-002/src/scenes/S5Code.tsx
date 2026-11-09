import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, shake } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { EvidenceTitle } from "../components/Text";
import { Phone, SimTag } from "../components/Phone";
import { SmsCard } from "../components/CallScreens";
import { AlertBanner } from "../components/Stamp";
import { Waveform } from "../components/Widgets";

/** SÉQUENCE 5 — PIÈCE À CONVICTION N°3 : LE CODE CONFIDENTIEL */
export const S5Code: React.FC = () => {
  const f = useCurrentFrame();
  const smsAt = 93;
  const askAt = 140;
  const pushAt = 205;
  const maskAt = 322;
  const push = ip(f, [pushAt, pushAt + 50], [0, 1]);
  const scale = 0.74 + push * 0.62;
  const ty = push * 330;
  const sk = shake(f, maskAt, 16, 14);
  return (
    <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px)` }}>
      <Backdrop tint={f > maskAt ? "red" : "yellow"} intensity={f > maskAt ? 0.7 : 1} />
      <div style={{ opacity: 1 - push }}>
        <EvidenceTitle label="PIÈCE À CONVICTION N°3" title="LE CODE CONFIDENTIEL" start={6} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 1080 + ty, width: 0, height: 0, transform: `scale(${scale})` }}>
        <Phone style={{ left: -280, top: -570 }} vibrate={f > smsAt && f < smsAt + 12 ? 0.6 : 0}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #17171a, #0a0a0b 70%, #1a1503)" }}>
            <div style={{ position: "absolute", top: 380, width: "100%", textAlign: "center", fontFamily: FONT, color: C.white }}>
              <div style={{ fontSize: 24, letterSpacing: 4, color: C.yellow, fontWeight: 600 }}>EN COMMUNICATION · 00:{String(41 + Math.floor(f / 30)).padStart(2, "0")}</div>
              <div style={{ fontSize: 50, fontWeight: 800, marginTop: 14 }}>Numéro inconnu</div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
                <Waveform width={380} height={120} bars={24} seed={21} speaking={(fr) => (fr > askAt - 10 && fr < askAt + 100 ? 1 : 0.25)} />
              </div>
            </div>
            <SmsCard at={smsAt} code="482913" digitsStart={smsAt + 18} maskAt={maskAt} />
            <SimTag style={{ bottom: 60 }} />
          </div>
        </Phone>
      </div>
      {/* bulle : la demande du faux conseiller */}
      {f > askAt && (
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 140,
            top: 300,
            padding: "26px 32px",
            borderRadius: "30px 30px 30px 6px",
            background: C.white,
            color: C.anthracite,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 40,
            lineHeight: 1.25,
            transform: `scale(${ip(f, [askAt, askAt + 12], [0.6, 1])})`,
            transformOrigin: "0% 100%",
            opacity: ip(f, [askAt, askAt + 8], [0, 1]) * (1 - ip(f, [maskAt + 30, maskAt + 40], [0, 1])),
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)", border: "3px solid #000",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 20, color: C.red, letterSpacing: 2, marginBottom: 8 }}>LE FAUX CONSEILLER</div>
          « Lisez-moi le code reçu, c'est pour bloquer le retrait. »
        </div>
      )}
      {/* réticule de mise au point pendant la poussée caméra */}
      {push > 0 && f < maskAt + 10 && (
        <div style={{ position: "absolute", left: 120, right: 120, top: 560, height: 360, border: `4px solid ${C.yellow}`, outline: "3px solid #000", borderRadius: 20, opacity: (0.4 + 0.6 * (Math.floor(f / 6) % 2)) * push }}>
          <div style={{ position: "absolute", top: -44, left: 0, fontFamily: MONO, fontSize: 24, color: C.yellow, background: "#000", padding: "4px 10px", letterSpacing: 3 }}>ZOOM · DONNÉE SENSIBLE</div>
        </div>
      )}
      <AlertBanner text="NE COMMUNIQUEZ JAMAIS CE CODE" at={372} style={{ top: 1100 }} size={50} />
    </AbsoluteFill>
  );
};
