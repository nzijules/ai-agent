import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { C, FONT, pop, prog } from "../theme";

export const HOOK_DURATION = 135;

const Line: React.FC<{
  at: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ at, children, size = 110, color = C.navy }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 22);
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1.02,
        letterSpacing: -3,
        color,
        opacity: p,
        translate: `0 ${(1 - p) * 60}px`,
        filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = pop(frame, 2, 18);
  const underline = prog(frame, 130, 20);
  const bottom = prog(frame, 170, 20);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <AbsoluteFill style={{ padding: "0 80px", justifyContent: "center" }}>
        <div
          style={{
            alignSelf: "flex-start",
            padding: "14px 28px",
            borderRadius: 999,
            background: C.navy,
            color: "white",
            fontSize: 38,
            fontWeight: 700,
            scale: tag,
            transformOrigin: "left center",
            marginBottom: 50,
          }}
        >
          Développeur ou vibe codeur ?
        </div>
        <Line at={72}>Ta page de</Line>
        <Line at={80}>connexion a été</Line>
        <Line at={106}>
          codée par une{" "}
          <span style={{ position: "relative", color: C.blue }}>
            IA
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: 4,
                height: 14,
                width: `${underline * 100}%`,
                background: C.blue,
                opacity: 0.25,
                borderRadius: 7,
              }}
            />
          </span>
        </Line>
        <Line at={140}>en 5 minutes ?</Line>

        <div
          style={{
            marginTop: 70,
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.25,
            color: C.muted,
            opacity: bottom,
            translate: `0 ${(1 - bottom) * 30}px`,
          }}
        >
          Vérifie qu’un intrus ne peut pas l’ouvrir de{" "}
          <span style={{ color: C.red, fontWeight: 850 }}>ces 5 façons.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
