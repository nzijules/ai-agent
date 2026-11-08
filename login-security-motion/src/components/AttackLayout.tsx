import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { AlertIcon, ShieldIcon } from "./Icons";
import { C, FONT, easeInOut, pop, prog } from "../theme";

/** Default frame (inside the scene) at which the "parade" (fix) kicks in. */
export const FIX_AT = 140;
export const ATTACK_DURATION = 285;

type Props = {
  index: number;
  title: React.ReactNode;
  threat: React.ReactNode;
  fix: React.ReactNode;
  /** Frame at which "La parade" starts — synced to the voiceover. */
  fixAt?: number;
  children: (s: {
    frame: number;
    fixP: number;
    fixAt: number;
  }) => React.ReactNode;
};

export const AttackLayout: React.FC<Props> = ({
  index,
  title,
  threat,
  fix,
  fixAt = FIX_AT,
  children,
}) => {
  const FIX = fixAt;
  const frame = useCurrentFrame();
  const fixP = prog(frame, FIX, 22, easeInOut);
  const pill = pop(frame, 2);
  const titleP = prog(frame, 8, 24);
  const threatP = prog(frame, 30, 22);
  const fixLabelP = pop(frame, FIX + 4, 20);
  const fixTextP = prog(frame, FIX + 12, 22);

  // Flash when the parade lands
  const flash = interpolate(frame, [FIX, FIX + 6, FIX + 26], [0, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.navy }}>
      <Background tint={frame < FIX ? C.red : C.green} />

      {/* Step pill + progress */}
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 20,
          scale: pill,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            padding: "12px 26px",
            borderRadius: 999,
            background: C.navy,
            color: "white",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          FAÇON {String(index).padStart(2, "0")}
          <span style={{ opacity: 0.45 }}> / 05</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                width: i === index ? 54 : 18,
                height: 18,
                borderRadius: 9,
                background: i < index ? C.green : i === index ? C.blue : C.line,
              }}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 80,
          right: 80,
          fontSize: 96,
          fontWeight: 850,
          lineHeight: 1.02,
          letterSpacing: -2.5,
          opacity: titleP,
          translate: `0 ${(1 - titleP) * 40}px`,
        }}
      >
        {title}
      </div>

      {/* Visual */}
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 80,
          right: 80,
          height: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children({ frame, fixP, fixAt: FIX })}
      </div>

      {/* Bottom: threat → parade */}
      <div style={{ position: "absolute", top: 1360, left: 80, right: 80 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: threatP * (1 - fixP),
            translate: `${-fixP * 80}px ${(1 - threatP) * 30}px`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: C.red,
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: 3,
            }}
          >
            <AlertIcon size={42} color={C.red} stroke={2.4} /> LE DANGER
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 50,
              lineHeight: 1.25,
              fontWeight: 500,
              color: C.navy,
            }}
          >
            {threat}
          </div>
        </div>

        <div style={{ position: "absolute", inset: 0, opacity: fixP }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 26px 12px 18px",
              borderRadius: 999,
              background: C.green,
              color: "white",
              fontSize: 36,
              fontWeight: 850,
              letterSpacing: 3,
              scale: fixLabelP,
              transformOrigin: "left center",
            }}
          >
            <ShieldIcon size={44} color="white" stroke={2.4} /> LA PARADE
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 54,
              lineHeight: 1.22,
              fontWeight: 650,
              letterSpacing: -0.5,
              opacity: fixTextP,
              translate: `0 ${(1 - fixTextP) * 30}px`,
            }}
          >
            {fix}
          </div>
        </div>
      </div>

      <AbsoluteFill
        style={{
          background: C.green,
          opacity: flash * 0.25,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const Hl: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = C.blue,
}) => <span style={{ color }}>{children}</span>;
