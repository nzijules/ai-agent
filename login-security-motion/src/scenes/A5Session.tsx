import { AttackLayout, Hl } from "../components/AttackLayout";
import { Card } from "../components/Card";
import { C, MONO, pop, prog } from "../theme";

const Field: React.FC<{
  k: string;
  children: React.ReactNode;
  strike?: boolean;
}> = ({ k, children, strike }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 0",
      borderTop: `2px solid ${C.line}`,
      fontSize: 38,
    }}
  >
    <span style={{ color: C.muted, fontWeight: 600 }}>{k}</span>
    <span
      style={{
        fontFamily: MONO,
        textDecoration: strike ? "line-through" : "none",
      }}
    >
      {children}
    </span>
  </div>
);

export const A5Session: React.FC = () => (
  <AttackLayout
    index={5}
    fixAt={224}
    title={
      <>
        Il garde la
        <br />
        <Hl color={C.red}>porte ouverte.</Hl>
      </>
    }
    threat={
      <>
        Une connexion <b>sans date de fin</b> reste valable pour toujours. Même
        après la suppression du compte.
      </>
    }
    fix={
      <>
        Chaque session <Hl color={C.green}>expire</Hl> au bout d’un moment, et
        elle est <Hl color={C.green}>annulée</Hl> à la déconnexion ou à la
        suppression du compte.
      </>
    }
  >
    {({ frame, fixP, fixAt }) => {
      const enter = pop(frame, 12, 22);
      const before = frame < fixAt;
      const deletedP = pop(frame, 176, 16);
      const blink = Math.floor(frame / 12) % 2 === 0;
      const left = Math.max(
        0,
        30 * 60 - 1 - Math.floor(Math.max(0, frame - fixAt) * 8),
      ); // fast countdown
      const mm = String(Math.floor(left / 60)).padStart(2, "0");
      const ss = String(left % 60).padStart(2, "0");
      const stampP = pop(frame, fixAt + 90, 16);
      return (
        <div style={{ width: "100%", position: "relative", scale: enter }}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 850 }}>
                Session{" "}
                <span style={{ fontFamily: MONO, color: C.muted }}>#8F3A</span>
              </div>
              <div
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  fontSize: 30,
                  fontWeight: 800,
                  color: "white",
                  background: before
                    ? C.red
                    : frame > fixAt + 90
                      ? C.muted
                      : C.green,
                  opacity: before ? (blink ? 1 : 0.55) : 1,
                }}
              >
                {before
                  ? "● ACTIVE"
                  : frame > fixAt + 90
                    ? "ANNULÉE"
                    : "● ACTIVE"}
              </div>
            </div>
            <Field k="Utilisateur" strike={deletedP > 0.5}>
              sarah@mail.com
            </Field>
            <Field k="Créée le">12/03/2023</Field>
            <Field k="Expire">
              {before ? (
                <span style={{ color: C.red, fontWeight: 800 }}>∞ jamais</span>
              ) : (
                <span style={{ color: C.green, fontWeight: 800 }}>
                  dans {mm}:{ss}
                </span>
              )}
            </Field>
          </Card>

          {/* "Compte supprimé" tag */}
          <div
            style={{
              marginTop: 40,
              display: "flex",
              justifyContent: "center",
              opacity: 1 - fixP,
            }}
          >
            <div
              style={{
                padding: "20px 34px",
                borderRadius: 20,
                background: C.navy,
                color: "white",
                fontSize: 38,
                fontWeight: 700,
                scale: deletedP,
              }}
            >
              Compte supprimé…{" "}
              <span style={{ color: "#FF8A8D" }}>session toujours valide</span>
            </div>
          </div>

          {/* Expired stamp */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "38%",
              translate: "-50% -50%",
              rotate: "-10deg",
              padding: "14px 40px",
              border: `7px solid ${C.green}`,
              borderRadius: 18,
              color: C.green,
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: 6,
              background: "rgba(255,255,255,0.85)",
              scale: stampP ? 1.6 - stampP * 0.6 : 0,
              opacity: prog(frame, fixAt + 90, 8),
            }}
          >
            EXPIRÉE
          </div>
        </div>
      );
    }}
  </AttackLayout>
);
