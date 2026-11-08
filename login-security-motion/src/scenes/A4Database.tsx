import { random } from "remotion";
import { AttackLayout, Hl } from "../components/AttackLayout";
import { Card } from "../components/Card";
import { CardIcon, ChatIcon, LockIcon, MailIcon } from "../components/Icons";
import { C, MONO, pop, prog } from "../theme";

const ROWS = [
  { email: "lea@mail.com", pwd: "soleil2024", hash: "$2b$12$Xk9vQ2…" },
  { email: "marc@mail.com", pwd: "azerty123", hash: "$2b$12$7Lm0aR…" },
  { email: "sarah@mail.com", pwd: "Paris75!", hash: "$2b$12$Qe4ZtW…" },
];
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$./";

const scramble = (
  target: string,
  frame: number,
  settle: number,
  seed: string,
) => {
  if (frame >= settle) return target;
  return target
    .split("")
    .map((ch, i) =>
      ch === "…"
        ? ch
        : CHARS[
            Math.floor(
              random(`${seed}-${i}-${Math.floor(frame / 2)}`) * CHARS.length,
            )
          ],
    )
    .join("");
};

export const A4Database: React.FC = () => (
  <AttackLayout
    index={4}
    fixAt={306}
    title={
      <>
        Il vole ta
        <br />
        <Hl color={C.red}>base de données.</Hl>
      </>
    }
    threat={
      <>
        Mots de passe en clair ? Il les lit tous. Et comme on réutilise le même
        partout, il ouvre aussi <b>emails et réseaux sociaux</b>.
      </>
    }
    fix={
      <>
        Des mots de passe <Hl color={C.green}>hachés</Hl> (bcrypt, Argon2) : un
        code que <Hl color={C.green}>personne ne peut relire</Hl>. Même pas toi.
      </>
    }
  >
    {({ frame, fixP, fixAt }) => {
      const enter = pop(frame, 12, 22);
      const leak = frame < fixAt;
      return (
        <div style={{ width: "100%", scale: enter }}>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "24px 36px",
                background: C.navy,
                color: "white",
                fontFamily: MONO,
                fontSize: 34,
              }}
            >
              <span style={{ opacity: 0.6 }}>table</span> users
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: leak ? "#FF8A8D" : "#6EE7A0",
                  fontFamily: "inherit",
                  fontSize: 28,
                }}
              >
                <LockIcon
                  size={34}
                  color={leak ? "#FF8A8D" : "#6EE7A0"}
                  open={leak}
                />
                {leak ? "EN CLAIR" : "HACHÉ"}
              </div>
            </div>
            {ROWS.map((r, i) => {
              const rowP = prog(frame, 22 + i * 8, 14);
              const hl = leak && frame > 132 + i * 8;
              return (
                <div
                  key={r.email}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "30px 36px",
                    borderTop: i ? `2px solid ${C.line}` : "none",
                    fontFamily: MONO,
                    fontSize: 34,
                    opacity: rowP,
                    background: hl ? C.redSoft : "white",
                  }}
                >
                  <span style={{ color: C.muted }}>{r.email}</span>
                  <span
                    style={{ color: leak ? C.red : C.green, fontWeight: 700 }}
                  >
                    {leak
                      ? r.pwd
                      : scramble(r.hash, frame, fixAt + 24 + i * 6, r.email)}
                  </span>
                </div>
              );
            })}
          </Card>

          {/* Reused passwords → other accounts */}
          <div
            style={{
              marginTop: 50,
              display: "flex",
              justifyContent: "center",
              gap: 40,
              opacity: 1 - fixP,
            }}
          >
            {[MailIcon, ChatIcon, CardIcon].map((Icon, i) => {
              const p = pop(frame, 235 + i * 10, 16);
              return (
                <div
                  key={i}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 34,
                    background: C.redSoft,
                    border: `3px solid ${C.red}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scale: p,
                  }}
                >
                  <Icon size={74} color={C.red} />
                </div>
              );
            })}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 34,
              fontWeight: 700,
              color: C.red,
              opacity: prog(frame, 262, 14) * (1 - fixP),
            }}
          >
            Même mot de passe = mêmes portes ouvertes
          </div>
        </div>
      );
    }}
  </AttackLayout>
);
