import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { CheckIcon } from "../components/Icons";
import { C, FONT, pop, prog } from "../theme";

export const OUTRO_DURATION = 150;

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = prog(frame, 4, 22);
  const btn = pop(frame, 18, 24);
  const CLICK = 60;
  const press = interpolate(frame, [CLICK - 4, CLICK, CLICK + 8], [1, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subscribed = frame >= CLICK;
  const cursorP = prog(frame, 30, 26);
  const sub = prog(frame, 76, 22);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.navy }}>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            letterSpacing: -3,
            textAlign: "center",
            lineHeight: 1.02,
            opacity: t,
            translate: `0 ${(1 - t) * 40}px`,
            padding: "0 80px",
          }}
        >
          Une astuce IA
          <br />
          <span style={{ color: C.blue }}>chaque jour.</span>
        </div>

        <div
          style={{ marginTop: 90, position: "relative", scale: btn * press }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "36px 70px",
              borderRadius: 999,
              fontSize: 60,
              fontWeight: 850,
              color: subscribed ? C.navy : "white",
              background: subscribed
                ? "white"
                : `linear-gradient(135deg, ${C.blueLight}, ${C.blueDeep})`,
              border: `4px solid ${subscribed ? C.line : "transparent"}`,
              boxShadow: subscribed
                ? "none"
                : "0 24px 60px rgba(10,91,255,0.35)",
            }}
          >
            {subscribed && <CheckIcon size={64} color={C.green} stroke={3} />}
            {subscribed ? "Abonné" : "Abonne-toi"}
          </div>
          {/* cursor */}
          <svg
            width="90"
            height="90"
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              right: interpolate(cursorP, [0, 1], [-260, 40]),
              bottom: interpolate(cursorP, [0, 1], [-260, -50]),
              opacity: frame < 100 ? 1 : 1 - prog(frame, 100, 10),
            }}
          >
            <path
              d="M4 2l15 9-6.5 1.5L9 19z"
              fill={C.navy}
              stroke="white"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            marginTop: 80,
            fontSize: 48,
            fontWeight: 600,
            color: C.muted,
            textAlign: "center",
            opacity: sub,
            padding: "0 80px",
          }}
        >
          Enregistre la vidéo et envoie-la
          <br />à ton pote qui vibe code.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
