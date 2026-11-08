import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Card } from "../components/Card";
import { LockIcon } from "../components/Icons";
import { C, FONT, pop, prog } from "../theme";

export const INTRO_DURATION = 120;

const MARKERS = [
  { x: -30, y: 70 },
  { x: 800, y: 40 },
  { x: -40, y: 330 },
  { x: 820, y: 300 },
  { x: 380, y: 610 },
];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = prog(frame, 4, 22);
  const card = pop(frame, 14, 24);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.navy }}>
      <Background />
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 80,
          right: 80,
          fontSize: 92,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: -2.5,
          opacity: t,
          translate: `0 ${(1 - t) * 40}px`,
        }}
      >
        Ta page de connexion, c’est la{" "}
        <span style={{ color: C.blue }}>porte d’entrée</span> de ton appli.
      </div>

      <div
        style={{
          position: "absolute",
          top: 760,
          left: 130,
          right: 130,
          scale: card,
        }}
      >
        <Card style={{ padding: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 48,
              fontWeight: 850,
            }}
          >
            <LockIcon size={56} color={C.blue} /> Connexion
          </div>
          {["Email", "Mot de passe"].map((l, i) => (
            <div key={l} style={{ marginTop: 34 }}>
              <div style={{ fontSize: 30, color: C.muted, fontWeight: 600 }}>
                {l}
              </div>
              <div
                style={{
                  marginTop: 12,
                  height: 88,
                  borderRadius: 18,
                  background: "#F6F7FA",
                  border: `2px solid ${C.line}`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 26px",
                  fontSize: 36,
                  color: C.muted,
                }}
              >
                {i === 0 ? "toi@mail.com" : "••••••••"}
              </div>
            </div>
          ))}
          <div
            style={{
              marginTop: 40,
              height: 96,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${C.blueLight}, ${C.blueDeep})`,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            Se connecter
          </div>
        </Card>
        {MARKERS.map((m, i) => {
          const p = pop(frame, 46 + i * 7, 16);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: m.x,
                top: m.y,
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: C.red,
                color: "white",
                fontSize: 40,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scale: p,
                boxShadow: "0 12px 30px rgba(229,72,77,0.4)",
                outline: `8px solid ${C.red}33`,
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 1580,
          left: 80,
          right: 80,
          textAlign: "center",
          fontSize: 54,
          fontWeight: 750,
          opacity: prog(frame, 82, 18),
        }}
      >
        <span style={{ color: C.red }}>5 failles</span> ·{" "}
        <span style={{ color: C.green }}>5 parades</span>
      </div>
    </AbsoluteFill>
  );
};
