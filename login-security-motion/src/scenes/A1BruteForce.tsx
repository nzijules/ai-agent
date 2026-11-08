import { interpolate } from "remotion";
import { AttackLayout, Hl } from "../components/AttackLayout";
import { Card } from "../components/Card";
import { BotIcon, LockIcon } from "../components/Icons";
import { C, FONT, MONO, easeInOut, pop, prog } from "../theme";

const GUESSES = [
  "123456",
  "password",
  "azerty",
  "soleil2024",
  "marseille13",
  "qwerty!",
  "iloveyou",
  "admin123",
  "doudou75",
  "motdepasse",
  "bonjour1",
  "camille06",
  "football",
  "princesse",
  "Azerty123",
  "dragon",
  "loulou",
  "chocolat",
  "000000",
  "nicolas92",
];

export const A1BruteForce: React.FC = () => (
  <AttackLayout
    index={1}
    fixAt={222}
    title={
      <>
        Il insiste.
        <br />
        <Hl color={C.red}>Encore et encore.</Hl>
      </>
    }
    threat={
      <>
        Un robot teste <b>des milliers de mots de passe</b> pendant la nuit. Et
        rien ne l’arrête.
      </>
    }
    fix={
      <>
        Après <Hl color={C.green}>5 échecs</Hl>, le compte se bloque{" "}
        <Hl color={C.green}>15 minutes</Hl>. Le robot perd la nuit.
      </>
    }
  >
    {({ frame, fixP, fixAt }) => {
      const enter = pop(frame, 14, 22);
      const running = frame < fixAt;
      const guess = GUESSES[Math.floor(frame / 3) % GUESSES.length];
      const tries = Math.round(
        interpolate(frame, [20, fixAt], [0, 48213], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeInOut,
        }),
      );
      const remaining = Math.max(
        0,
        15 * 60 - 1 - Math.floor(Math.max(0, frame - fixAt) / 30),
      );
      const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
      const ss = String(remaining % 60).padStart(2, "0");
      const shake = running && frame > 20 ? Math.sin(frame * 2.3) * 3 : 0;
      const lockP = pop(frame, fixAt + 2, 20);
      const minutes =
        12 +
        Math.floor(
          interpolate(frame, [20, fixAt], [0, 180], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        );
      const clock = `0${Math.floor(minutes / 60) + 2}:${String(minutes % 60).padStart(2, "0")}`;

      return (
        <div style={{ width: "100%", scale: enter, position: "relative" }}>
          {/* Robot + clock */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
              opacity: 1 - fixP * 0.5,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                color: C.red,
                fontSize: 38,
                fontWeight: 700,
              }}
            >
              <BotIcon size={64} color={C.red} /> robot.exe
            </div>
            <div style={{ fontFamily: MONO, fontSize: 40, color: C.muted }}>
              ☾ {clock}
            </div>
          </div>

          <Card style={{ translate: `${shake}px 0` }}>
            <div style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>
              Mot de passe
            </div>
            <div
              style={{
                marginTop: 16,
                height: 110,
                borderRadius: 22,
                border: `3px solid ${running ? C.red : C.line}`,
                background: running ? C.redSoft : "#F6F7FA",
                display: "flex",
                alignItems: "center",
                padding: "0 32px",
                fontFamily: MONO,
                fontSize: 50,
                color: running ? C.red : C.muted,
              }}
            >
              {running ? guess : "••••••••••"}
            </div>

            <div
              style={{
                marginTop: 34,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontFamily: FONT,
              }}
            >
              <div style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>
                Tentatives
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 850,
                  color: running ? C.red : C.navy,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {running ? tries.toLocaleString("fr-FR") : "5 / 5"}
              </div>
            </div>

            {/* Locked banner */}
            <div
              style={{
                marginTop: 28,
                height: prog(frame, fixAt + 6, 18) * 120,
                overflow: "hidden",
                borderRadius: 22,
                background: C.navy,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px",
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              <span>Compte verrouillé</span>
              <span style={{ fontFamily: MONO, color: "#7FB2FF" }}>
                {mm}:{ss}
              </span>
            </div>
          </Card>

          {/* Big lock slam */}
          <div
            style={{
              position: "absolute",
              right: -20,
              top: 60,
              width: 170,
              height: 170,
              borderRadius: "50%",
              background: C.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: lockP,
              rotate: `${(1 - lockP) * -30}deg`,
              boxShadow: "0 20px 50px rgba(18,161,80,0.35)",
            }}
          >
            <LockIcon size={96} color="white" stroke={2.2} />
          </div>
        </div>
      );
    }}
  </AttackLayout>
);
