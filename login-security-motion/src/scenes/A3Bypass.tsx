import { AttackLayout, Hl } from "../components/AttackLayout";
import { Card } from "../components/Card";
import {
  BrowserIcon,
  ServerIcon,
  ShieldIcon,
  XIcon,
} from "../components/Icons";
import { C, MONO, pop, prog } from "../theme";

const URL = "monapp.com/admin";

export const A3Bypass: React.FC = () => (
  <AttackLayout
    index={3}
    fixAt={241}
    title={
      <>
        Il contourne
        <br />
        <Hl color={C.red}>le contrôle.</Hl>
      </>
    }
    threat={
      <>
        Si la vérification se fait <b>seulement dans le navigateur</b>, il tape
        l’adresse des pages réservées… et entre.
      </>
    }
    fix={
      <>
        C’est le <Hl color={C.green}>serveur</Hl> qui vérifie qui tu es.{" "}
        <Hl color={C.green}>À chaque demande.</Hl>
      </>
    }
  >
    {({ frame, fixP, fixAt }) => {
      const enter = pop(frame, 12, 22);
      const typed = URL.slice(0, Math.max(0, Math.floor((frame - 150) / 2)));
      const opened = prog(frame, 196, 16);
      const reqP = prog(frame, fixAt + 14, 30);
      const denyP = pop(frame, fixAt + 44, 18);
      return (
        <div style={{ width: "100%", position: "relative", height: 700 }}>
          {/* Browser — threat */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - fixP,
              scale: enter * (1 - fixP * 0.1),
            }}
          >
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "26px 30px",
                  borderBottom: `2px solid ${C.line}`,
                  background: "#F6F7FA",
                }}
              >
                {[C.red, "#F5B83D", C.green].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: c,
                    }}
                  />
                ))}
                <div
                  style={{
                    flex: 1,
                    marginLeft: 16,
                    padding: "14px 24px",
                    borderRadius: 14,
                    background: "white",
                    border: `2px solid ${C.line}`,
                    fontFamily: MONO,
                    fontSize: 36,
                    color: C.navy,
                  }}
                >
                  {typed}
                  <span style={{ opacity: frame % 20 < 10 ? 1 : 0 }}>|</span>
                </div>
              </div>
              <div style={{ padding: 40, height: 420, position: "relative" }}>
                <div style={{ opacity: opened }}>
                  <div style={{ fontSize: 46, fontWeight: 800 }}>
                    Espace admin
                  </div>
                  {[
                    "Utilisateurs · 2 481",
                    "Paiements · 18 340 €",
                    "Paramètres",
                  ].map((t, i) => (
                    <div
                      key={t}
                      style={{
                        marginTop: 22,
                        padding: "20px 24px",
                        borderRadius: 16,
                        background: "#F2F4F9",
                        fontSize: 36,
                        opacity: prog(frame, 202 + i * 5, 10),
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 30,
                    top: 30,
                    padding: "10px 20px",
                    borderRadius: 12,
                    background: C.red,
                    color: "white",
                    fontSize: 30,
                    fontWeight: 800,
                    scale: pop(frame, 212, 14),
                  }}
                >
                  SANS CONNEXION
                </div>
              </div>
            </Card>
          </div>

          {/* Server check — parade */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: fixP,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Card
                style={{
                  padding: 34,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  width: 260,
                }}
              >
                <BrowserIcon size={110} color={C.navy} stroke={1.6} />
                <div style={{ fontSize: 34, fontWeight: 700 }}>Navigateur</div>
              </Card>
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: 120,
                  margin: "0 18px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 58,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: C.line,
                    borderRadius: 3,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 58,
                    left: 0,
                    width: `${reqP * 100}%`,
                    height: 5,
                    background: C.blue,
                    borderRadius: 3,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontFamily: MONO,
                    fontSize: 30,
                    color: C.blue,
                  }}
                >
                  GET /admin
                </div>
              </div>
              <Card
                style={{
                  padding: 34,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  width: 260,
                  border: `3px solid ${C.green}`,
                }}
              >
                <div style={{ position: "relative" }}>
                  <ServerIcon size={110} color={C.navy} stroke={1.6} />
                  <div
                    style={{
                      position: "absolute",
                      right: -26,
                      bottom: -14,
                      background: "white",
                      borderRadius: "50%",
                      padding: 4,
                    }}
                  >
                    <ShieldIcon size={56} color={C.green} stroke={2.4} />
                  </div>
                </div>
                <div style={{ fontSize: 34, fontWeight: 700 }}>Serveur</div>
              </Card>
            </div>
            <div
              style={{
                marginTop: 60,
                alignSelf: "center",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "24px 40px",
                borderRadius: 24,
                background: C.navy,
                color: "white",
                fontSize: 46,
                fontWeight: 800,
                scale: denyP,
              }}
            >
              <XIcon size={52} color={C.red} stroke={3} />
              <span style={{ fontFamily: MONO }}>401</span> · Accès refusé
            </div>
          </div>
        </div>
      );
    }}
  </AttackLayout>
);
