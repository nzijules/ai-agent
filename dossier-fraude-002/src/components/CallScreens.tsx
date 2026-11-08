import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip } from "../anim";
import { Waveform } from "./Widgets";

/** Écran d'appel entrant générique : anneaux pulsants, numéro masqué, glissement pour décrocher. */
export const IncomingCall: React.FC<{ start: number; acceptAt: number }> = ({ start, acceptAt }) => {
  const f = useCurrentFrame();
  const t = f - start;
  const accepted = ip(f, [acceptAt, acceptAt + 14], [0, 1]);
  const slide = ip(f, [acceptAt - 16, acceptAt], [0, 1]);
  const callSec = Math.max(0, Math.floor((f - acceptAt) / 30));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #1d1d1f 0%, #0b0b0c 60%, #1a1503 100%)",
        fontFamily: FONT,
        color: C.white,
      }}
    >
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", opacity: ip(t, [4, 16], [0, 1]) }}>
        <div style={{ fontSize: 26, letterSpacing: 4, color: accepted > 0.5 ? C.yellow : C.dim, fontWeight: 600 }}>
          {accepted > 0.5 ? `EN COMMUNICATION · 00:${String(callSec).padStart(2, "0")}` : "APPEL ENTRANT"}
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, marginTop: 18 }}>Numéro inconnu</div>
        <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim, marginTop: 12 }}>+225 07 •• •• •• 41</div>
      </div>
      {/* avatar et anneaux */}
      <div style={{ position: "absolute", top: 440, left: "50%", width: 0, height: 0 }}>
        {accepted < 1 &&
          [0, 1, 2].map((i) => {
            const p = ((t + i * 14) % 42) / 42;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 180 + p * 260,
                  height: 180 + p * 260,
                  left: -(90 + p * 130),
                  top: -(90 + p * 130),
                  borderRadius: "50%",
                  border: `3px solid ${C.yellow}`,
                  opacity: (1 - p) * 0.7 * (1 - accepted),
                }}
              />
            );
          })}
        <div
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            left: -90,
            top: -90,
            borderRadius: 90,
            background: "#2b2b2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 96,
            fontWeight: 900,
            color: C.yellow,
          }}
        >
          ?
        </div>
      </div>
      {accepted > 0 && (
        <div style={{ position: "absolute", top: 640, width: "100%", display: "flex", justifyContent: "center", opacity: accepted }}>
          <Waveform width={420} height={140} bars={28} seed={4} speaking={(fr) => (Math.sin(fr / 9) > -0.4 ? 1 : 0.15)} />
        </div>
      )}
      {/* boutons */}
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "space-around", opacity: 1 - accepted }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhoneIcon rot={135} />
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
            transform: `translateY(${-slide * 60}px) scale(${1 + 0.06 * Math.sin(t / 3)})`,
            boxShadow: "0 0 40px rgba(43,182,115,0.6)",
          }}
        >
          <PhoneIcon rot={0} />
        </div>
      </div>
      {accepted > 0 && (
        <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: accepted }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PhoneIcon rot={135} />
          </div>
        </div>
      )}
    </div>
  );
};

export const PhoneIcon: React.FC<{ rot?: number; size?: number; color?: string }> = ({ rot = 0, size = 56, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rot}deg)` }}>
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
      fill={color}
    />
  </svg>
);

/** Notification SMS fictive qui descend du haut de l'écran. */
export const SmsCard: React.FC<{ at: number; code: string; maskAt?: number; digitsStart?: number }> = ({
  at,
  code,
  maskAt = 99999,
  digitsStart,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const drop = ip(f, [at, at + 16], [-260, 0]);
  const ds = digitsStart ?? at + 18;
  const mask = ip(f, [maskAt, maskAt + 10], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top: 90 + drop,
        left: 24,
        right: 24,
        borderRadius: 30,
        background: "rgba(40,40,44,0.96)",
        padding: "24px 28px",
        fontFamily: FONT,
        color: C.white,
        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: C.dim, fontWeight: 600 }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: "#3a3a40", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✉</span>
        MESSAGES · maintenant
      </div>
      <div style={{ fontSize: 26, marginTop: 14, lineHeight: 1.35, color: "#e8e8e8" }}>
        Code de validation (fictif) :
      </div>
      <div style={{ position: "relative", marginTop: 12, display: "flex", gap: 12 }}>
        {code.split("").map((d, i) => {
          const o = ip(f, [ds + i * 7, ds + i * 7 + 6], [0, 1]);
          return (
            <div
              key={i}
              style={{
                width: 62,
                height: 84,
                borderRadius: 14,
                background: "#1b1b1e",
                border: `2px solid ${o > 0.5 ? C.yellow : "#333"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 50,
                color: C.white,
              }}
            >
              <span style={{ opacity: o * (1 - mask), transform: `translateY(${(1 - o) * 20}px)`, filter: `blur(${mask * 10}px)` }}>{d}</span>
              <span style={{ position: "absolute", opacity: mask, color: C.red }}>•</span>
            </div>
          );
        })}
        {/* barre de masquage */}
        <div
          style={{
            position: "absolute",
            left: -8,
            top: -6,
            height: 96,
            width: `${mask * 104}%`,
            borderRadius: 14,
            background: `repeating-linear-gradient(45deg, ${C.red}, ${C.red} 14px, ${C.redDeep} 14px, ${C.redDeep} 28px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: mask > 0 ? "0 0 30px rgba(229,37,42,0.7)" : "none",
          }}
        >
          <span style={{ fontWeight: 900, fontSize: 30, letterSpacing: 4, whiteSpace: "nowrap", opacity: ip(f, [maskAt + 8, maskAt + 14], [0, 1]) }}>
            🔒 CODE MASQUÉ
          </span>
        </div>
      </div>
    </div>
  );
};
