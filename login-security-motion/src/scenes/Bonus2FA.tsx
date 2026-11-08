import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Card } from "../components/Card";
import { ShieldIcon } from "../components/Icons";
import { C, FONT, MONO, pop, prog } from "../theme";

export const BONUS_DURATION = 165;
const CODE = "482913";

export const Bonus2FA: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = pop(frame, 2, 18);
  const t = prog(frame, 8, 22);
  const phone = pop(frame, 22, 24);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.navy }}>
      <Background />
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 80,
          padding: "12px 28px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${C.blueLight}, ${C.blueDeep})`,
          color: "white",
          fontSize: 36,
          fontWeight: 850,
          letterSpacing: 3,
          scale: tag,
          transformOrigin: "left center",
        }}
      >
        + BONUS
      </div>
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 80,
          right: 80,
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: -2.5,
          opacity: t,
          translate: `0 ${(1 - t) * 40}px`,
        }}
      >
        Ajoute la{" "}
        <span style={{ color: C.blue }}>double authentification.</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          scale: phone,
        }}
      >
        <Card
          style={{
            width: 520,
            padding: 50,
            borderRadius: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ShieldIcon size={120} color={C.blue} stroke={1.8} />
          <div
            style={{
              marginTop: 20,
              fontSize: 36,
              color: C.muted,
              fontWeight: 600,
            }}
          >
            Ton code de connexion
          </div>
          <div style={{ marginTop: 30, display: "flex", gap: 14 }}>
            {CODE.split("").map((d, i) => {
              const p = pop(frame, 46 + i * 5, 14);
              return (
                <div
                  key={i}
                  style={{
                    width: 62,
                    height: 90,
                    borderRadius: 16,
                    background: "#F2F5FB",
                    border: `2px solid ${C.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontSize: 52,
                    fontWeight: 700,
                    color: C.blue,
                  }}
                >
                  <span style={{ scale: p, display: "inline-block" }}>{d}</span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 34,
              width: "100%",
              height: 10,
              borderRadius: 5,
              background: C.line,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${100 - prog(frame, 50, 110, (x) => x) * 100}%`,
                background: C.blue,
              }}
            />
          </div>
        </Card>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1430,
          left: 80,
          right: 80,
          fontSize: 54,
          fontWeight: 650,
          lineHeight: 1.25,
          opacity: prog(frame, 80, 20),
          translate: `0 ${(1 - prog(frame, 80, 20)) * 30}px`,
        }}
      >
        Même s’il trouve ton mot de passe,{" "}
        <span style={{ color: C.green }}>l’intrus reste dehors.</span>
      </div>
    </AbsoluteFill>
  );
};
