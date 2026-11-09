import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, lin, sp } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { KineticText } from "../components/Text";
import { PhoneIcon } from "../components/CallScreens";

const R1 = 38;
const R2 = 219;
const R3 = 394;

const RuleHeader: React.FC<{ n: number; text: string; at: number; hl: string[] }> = ({ n, text, at, hl }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 420, left: 70, right: 70, display: "flex", gap: 30, alignItems: "flex-start" }}>
      <div
        style={{
          flexShrink: 0,
          width: 130,
          height: 130,
          borderRadius: 26,
          background: C.black,
          color: C.yellow,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 92,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${sp(f, fps, at, 11)}) rotate(${(1 - sp(f, fps, at, 11)) * -30}deg)`,
        }}
      >
        {n}
      </div>
      <KineticText text={text} start={at + 6} size={66} align="left" stagger={3} highlight={hl} style={{ flex: 1 }} />
    </div>
  );
};

const Demo1: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - R1;
  const lock = ip(t, [70, 90], [0, 1]);
  const arrow = ip(t, [30, 60], [0, 1]);
  return (
    <div style={{ position: "absolute", top: 760, left: 0, right: 0, height: 700 }}>
      <div style={{ position: "absolute", left: 110, top: 120, display: "flex", gap: 14 }}>
        {"482913".split("").map((d, i) => (
          <div key={i} style={{ width: 82, height: 110, borderRadius: 16, background: "#1b1b1e", border: `3px solid ${lock > 0.5 ? C.yellow : "#444"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 62, color: C.white, opacity: ip(t, [i * 3, i * 3 + 8], [0, 1]) }}>
            <span style={{ filter: `blur(${lock * 12}px)` }}>{d}</span>
          </div>
        ))}
      </div>
      {/* cadenas qui se referme */}
      <svg width="220" height="240" viewBox="0 0 100 110" style={{ position: "absolute", left: 430, top: 60, opacity: lock, transform: `scale(${0.7 + 0.3 * lock})` }}>
        <path d={`M28 50 V${32 - lock * 4} a22 22 0 0 1 44 0 V50`} stroke={C.black} strokeWidth="9" fill="none" transform={`translate(0 ${(1 - lock) * -14})`} />
        <rect x="16" y="48" width="68" height="56" rx="10" fill={C.black} />
        <circle cx="50" cy="72" r="7" fill={C.yellow} />
        <rect x="47" y="74" width="6" height="16" fill={C.yellow} />
      </svg>
      {/* flèche de partage bloquée */}
      <div style={{ position: "absolute", left: 160, top: 360, width: 760, height: 120 }}>
        <div style={{ position: "absolute", left: 0, top: 54, height: 12, width: `${arrow * 60}%`, background: C.red, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: "62%", top: 0, width: 120, height: 120, borderRadius: 60, border: `10px solid ${C.red}`, opacity: arrow, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 130, height: 10, background: C.red, transform: "rotate(-45deg)" }} />
        </div>
        <div style={{ position: "absolute", left: "80%", top: 30, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.black, opacity: arrow }}>Appelant</div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 520, fontFamily: FONT, fontSize: 34, color: C.black, fontWeight: 600, opacity: ip(t, [100, 115], [0, 1]) }}>
        Code secret · Code reçu par SMS → <span style={{ background: C.black, color: C.yellow, fontWeight: 900, padding: "0 10px" }}>pour vous seul</span>
      </div>
    </div>
  );
};

const Demo2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - R2;
  const hang = ip(t, [14, 24], [0, 1]);
  const press = t > 14 && t < 26 ? 0.85 : 1;
  const items = ["Raccrocher l'appel suspect", "Rappeler vous-même", "Signaler au 222 (gratuit)"];
  return (
    <div style={{ position: "absolute", top: 760, left: 0, right: 0, height: 700 }}>
      <div style={{ position: "absolute", left: 110, top: 40, width: 220, height: 220, borderRadius: 110, background: hang > 0.5 ? "#333" : C.red, transform: `scale(${press})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hang > 0.5 ? "none" : "0 0 60px rgba(229,37,42,0.7)" }}>
        <PhoneIcon rot={135} size={110} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 280, width: 220, textAlign: "center", fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.black }}>
        {hang > 0.5 ? "APPEL TERMINÉ" : "RACCROCHER"}
      </div>
      <div style={{ position: "absolute", left: 400, top: 30, right: 70 }}>
        {items.map((it, i) => {
          const at = 24 + i * 16;
          const p = ip(t, [at, at + 12], [0, 1]);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 34, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
              <svg width="64" height="64" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="11" fill={C.black} />
                <path d="M6.5 12.5 l3.5 3.5 l7.5 -8" stroke={C.yellow} strokeWidth="2.6" fill="none" strokeDasharray="20" strokeDashoffset={20 * (1 - ip(t, [at + 6, at + 16], [0, 1]))} strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.black, lineHeight: 1.2 }}>{it}</span>
            </div>
          );
        })}
      </div>
      {/* composition du 222 : le canal officiel */}
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 390,
          height: 190,
          borderRadius: 34,
          background: C.black,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          opacity: ip(t, [72, 82], [0, 1]),
          transform: `translateY(${ip(t, [72, 84], [40, 0])}px)`,
          boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
        }}
      >
        <div>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "rgba(255,255,255,0.7)" }}>NUMÉRO VERT MTN · GRATUIT</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, lineHeight: 1, color: C.yellow, letterSpacing: 8 }}>
            {"222".split("").map((d, i) => (
              <span key={i} style={{ opacity: ip(t, [82 + i * 5, 86 + i * 5], [0, 1]) }}>{d}</span>
            ))}
          </div>
        </div>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            background: C.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${t > 104 ? 1 + 0.07 * Math.sin((t - 104) / 3) : ip(t, [98, 104], [0, 1])})`,
            boxShadow: "0 0 30px rgba(43,182,115,0.6)",
          }}
        >
          <PhoneIcon rot={0} size={64} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, right: 70, top: 610, fontFamily: FONT, fontSize: 32, color: "rgba(0,0,0,0.75)", fontWeight: 600, opacity: ip(t, [100, 112], [0, 1]) }}>
        Numéro vert pour signaler toute tentative de fraude.
        <br />
        Ne rappelez jamais le numéro qui vous a contacté.
      </div>
    </div>
  );
};

const Demo3: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - R3;
  // le doigt hésite vers « Valider », puis choisit « Refuser »
  const fx = lin(t, [10, 45, 60, 85], [800, 700, 700, 310]);
  const fy = lin(t, [10, 45, 60, 85], [1250, 990, 990, 990]);
  const tap = t > 85 && t < 95;
  const refused = t > 90;
  return (
    <>
      <div style={{ position: "absolute", top: 780, left: 110, right: 110, borderRadius: 30, background: C.light, padding: "34px 36px", fontFamily: FONT, color: C.anthracite, boxShadow: "0 30px 60px rgba(0,0,0,0.3)", border: "3px solid #000", opacity: ip(t, [0, 10], [0, 1]), transform: `translateY(${ip(t, [0, 12], [60, 0])}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: "#a07a00", letterSpacing: 2 }}>DEMANDE DE CONFIRMATION (SIMULATION)</div>
        <div style={{ fontWeight: 900, fontSize: 40, marginTop: 12 }}>Opération non initiée par vous</div>
        <div style={{ fontSize: 30, marginTop: 8, color: "#555" }}>Montant : 150 000 FCFA</div>
        <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
          <div style={{ flex: 1, height: 96, borderRadius: 20, background: refused ? C.anthracite : "#e2e4e8", color: refused ? C.yellow : C.anthracite, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, transform: tap ? "scale(0.94)" : "none" }}>REFUSER</div>
          <div style={{ flex: 1, height: 96, borderRadius: 20, background: "#e2e4e8", color: "#999", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, textDecoration: refused ? "line-through" : "none" }}>VALIDER</div>
        </div>
      </div>
      {/* doigt / curseur */}
      {t < 120 && (
        <div style={{ position: "absolute", left: fx, top: fy, width: 70, height: 70, borderRadius: 35, background: "rgba(0,0,0,0.25)", border: "5px solid #000", transform: `scale(${tap ? 0.8 : 1})` }} />
      )}
      {refused && (
        <div style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.black, opacity: ip(t, [92, 102], [0, 1]) }}>
          ✓ OPÉRATION BLOQUÉE
        </div>
      )}
    </>
  );
};

/** SÉQUENCE 8 — LES TROIS RÉFLEXES */
export const S8Reflexes: React.FC = () => {
  const f = useCurrentFrame();
  const phase = f < R2 ? 1 : f < R3 ? 2 : 3;
  const wipe = (at: number) => ip(f, [at - 8, at], [0, 1]);
  return (
    <AbsoluteFill>
      <Backdrop tint="yellow" />
      {/* titre + progression */}
      <div style={{ position: "absolute", top: 250, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: f < R1 ? 0 : 44, color: C.black, letterSpacing: 2 }}>LES 3 RÉFLEXES</div>
        <div style={{ display: "flex", gap: 14 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ width: n === phase ? 80 : 26, height: 26, borderRadius: 13, background: n <= phase && f >= R1 ? C.black : "rgba(0,0,0,0.2)" }} />
          ))}
        </div>
      </div>
      {f < R1 && (
        <AbsoluteFill style={{ justifyContent: "center" }}>
          <KineticText text="TROIS RÉFLEXES" start={2} size={150} highlight={["TROIS"]} out={R1 - 12} />
        </AbsoluteFill>
      )}
      {f >= R1 && f < R2 && (
        <AbsoluteFill style={{ opacity: 1 - wipe(R2) }}>
          <RuleHeader n={1} text="NE PARTAGEZ JAMAIS VOS CODES" at={R1} hl={["JAMAIS"]} />
          <Demo1 />
        </AbsoluteFill>
      )}
      {f >= R2 && f < R3 && (
        <AbsoluteFill style={{ opacity: 1 - wipe(R3) }}>
          <RuleHeader n={2} text={"CONTACTEZ MTN VIA LE CANAL OFFICIEL : LE\u00A0222"} at={R2} hl={["LE\u00A0222"]} />
          <Demo2 />
        </AbsoluteFill>
      )}
      {f >= R3 && (
        <AbsoluteFill>
          <RuleHeader n={3} text="NE VALIDEZ AUCUNE OPÉRATION INCONNUE" at={R3} hl={["AUCUNE"]} />
          <Demo3 />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
