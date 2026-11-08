import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { CheckIcon } from "../components/Icons";
import { C, FONT, MONO, pop, prog, shadow } from "../theme";

export const CLAUDE_DURATION = 255;

const PROMPT =
  "Vérifie ma page de connexion sur ces 5 points et corrige ce qui manque.";
const CHECKS = [
  "Blocage après plusieurs échecs",
  "Un seul message d’erreur",
  "Contrôle côté serveur",
  "Mots de passe hachés",
  "Sessions qui expirent",
];

export const ClaudeCode: React.FC = () => {
  const frame = useCurrentFrame();
  const t = prog(frame, 4, 22);
  const sub = prog(frame, 18, 20);
  const term = pop(frame, 26, 24);
  const typed = PROMPT.slice(0, Math.max(0, Math.floor((frame - 44) * 1.1)));
  const done = typed.length >= PROMPT.length;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.navy }}>
      <Background />
      <div
        style={{
          position: "absolute",
          top: 200,
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
        Pas besoin d’être <span style={{ color: C.blue }}>développeur</span>{" "}
        pour corriger tout ça.
      </div>
      <div
        style={{
          position: "absolute",
          top: 530,
          left: 80,
          right: 80,
          fontSize: 48,
          fontWeight: 600,
          color: C.muted,
          opacity: sub,
        }}
      >
        Demande simplement à <b style={{ color: C.navy }}>Claude Code</b> :
      </div>

      <div
        style={{
          position: "absolute",
          top: 650,
          left: 80,
          right: 80,
          scale: term,
          borderRadius: 32,
          background: C.terminal,
          boxShadow: shadow,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "24px 30px",
            borderBottom: "2px solid #1E293B",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{ width: 20, height: 20, borderRadius: 10, background: c }}
            />
          ))}
        </div>
        <div
          style={{
            padding: "36px 40px 44px",
            fontFamily: MONO,
            fontSize: 40,
            lineHeight: 1.45,
            color: "#E2E8F0",
            minHeight: 300,
          }}
        >
          <span style={{ color: "#7FB2FF" }}>{">"} </span>
          {typed}
          <span
            style={{
              opacity: !done || frame % 20 < 10 ? 1 : 0,
              color: "#7FB2FF",
            }}
          >
            ▍
          </span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1150, left: 80, right: 80 }}>
        {CHECKS.map((c, i) => {
          const at = 128 + i * 14;
          const p = prog(frame, at, 14);
          const tick = pop(frame, at + 4, 14);
          return (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                marginBottom: 22,
                fontSize: 46,
                fontWeight: 650,
                opacity: p,
                translate: `${(1 - p) * 60}px 0`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: tick,
                }}
              >
                <CheckIcon size={44} color="white" stroke={3} />
              </div>
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
