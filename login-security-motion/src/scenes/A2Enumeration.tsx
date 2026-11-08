import { AttackLayout, Hl } from "../components/AttackLayout";
import { Card } from "../components/Card";
import { AlertIcon, CheckIcon } from "../components/Icons";
import { C, MONO, pop, prog } from "../theme";

const Row: React.FC<{
  email: string;
  before: string;
  leak: string;
  frame: number;
  fixP: number;
  delay: number;
  fixAt: number;
}> = ({ email, before, leak, frame, fixP, delay, fixAt }) => {
  const p = pop(frame, delay, 20);
  const msgP = prog(frame, delay + 14, 16);
  const leakP = pop(frame, delay + 34, 18) * (1 - fixP);
  const swap = frame >= fixAt + 6;
  return (
    <div style={{ scale: p, marginBottom: 36 }}>
      <Card style={{ padding: 36 }}>
        <div style={{ fontFamily: MONO, fontSize: 40, color: C.navy }}>
          {email}
        </div>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 26px",
            borderRadius: 18,
            background: swap ? "#EEF1F7" : C.redSoft,
            color: swap ? C.navy : C.red,
            fontSize: 40,
            fontWeight: 700,
            opacity: msgP,
          }}
        >
          <AlertIcon size={44} color={swap ? C.muted : C.red} />
          {swap ? "Email ou mot de passe incorrect." : before}
        </div>
      </Card>
      <div
        style={{
          marginTop: 14,
          marginLeft: 20,
          fontSize: 38,
          fontWeight: 800,
          color: C.red,
          opacity: leakP,
          translate: `${(1 - leakP) * -30}px 0`,
          height: 50,
        }}
      >
        ↳ {leak}
      </div>
    </div>
  );
};

export const A2Enumeration: React.FC = () => (
  <AttackLayout
    index={2}
    fixAt={214}
    title={
      <>
        Il écoute ce que
        <br />
        <Hl color={C.red}>ta page répond.</Hl>
      </>
    }
    threat={
      <>
        « Cet email n’existe pas » lui apprend <b>qui a un compte chez toi</b>…
        et qui n’en a pas.
      </>
    }
    fix={
      <>
        Une seule phrase pour toutes les erreurs :{" "}
        <Hl color={C.green}>« Email ou mot de passe incorrect. »</Hl> Même chose
        sur « mot de passe oublié ».
      </>
    }
  >
    {({ frame, fixP, fixAt }) => (
      <div style={{ width: "100%", position: "relative" }}>
        <Row
          email="inconnu@mail.com"
          before="Cet email n’existe pas"
          leak="Pas de compte ici"
          frame={frame}
          fixP={fixP}
          fixAt={fixAt}
          delay={60}
        />
        <Row
          email="sarah@mail.com"
          before="Mot de passe incorrect"
          leak="Sarah a un compte → cible !"
          frame={frame}
          fixP={fixP}
          fixAt={fixAt}
          delay={110}
        />
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            fontSize: 40,
            fontWeight: 800,
            color: C.green,
            opacity: prog(frame, fixAt + 20, 16),
          }}
        >
          <CheckIcon size={46} color={C.green} /> Il n’apprend plus rien.
        </div>
      </div>
    )}
  </AttackLayout>
);
