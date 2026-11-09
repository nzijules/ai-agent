import React from "react";
import { AbsoluteFill } from "remotion";
import { IconTrash } from "../components/Icons";
import { Person } from "../components/Person";
import { PixelSwarm } from "../components/PixelSwarm";
import { Smartphone } from "../components/Smartphone";
import { WordReveal } from "../components/WordReveal";
import { cue } from "../data/script";
import { EASE_IN_OUT, EASE_OUT, tw, useSceneClock } from "../lib/anim";
import { FONT } from "../fonts";
import { C } from "../theme";

const S = "s1" as const;

const MESSAGES: Array<{ me: boolean; text: string; file?: boolean }> = [
  { me: false, text: "Tu as reçu le document ?" },
  { me: true, text: "Oui, je te l'envoie ce soir." },
  { me: true, text: "Photo_0312.jpg", file: true },
  { me: false, text: "Ne le partage avec personne." },
  { me: true, text: "Promis. J'efface tout." },
];

const ChatScreen: React.FC<{ t: number; burstAt: number }> = ({ t, burstAt }) => {
  const selectAt = burstAt - 1.8;
  const sheetAt = burstAt - 1.2;
  const tapAt = burstAt - 0.35;
  const sel = tw(t, [selectAt, selectAt + 0.3], [0, 1]);
  const sheet = tw(t, [sheetAt, sheetAt + 0.45], [0, 1]) * tw(t, [burstAt - 0.05, burstAt + 0.25], [1, 0]);
  const tap = tw(t, [tapAt, tapAt + 0.4], [0, 1]);
  const empty = tw(t, [burstAt + 1.0, burstAt + 1.6], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0B1322 0%, #070C16 100%)", fontFamily: FONT.ui }}>
      {/* barre d'état */}
      <div style={{ position: "absolute", top: 22, left: 34, right: 34, display: "flex", justifyContent: "space-between", color: C.white, fontSize: 19, fontWeight: 600 }}>
        <span>21:47</span>
        <span style={{ letterSpacing: 2 }}>●●● 5G ▮</span>
      </div>
      {/* en-tête de conversation */}
      <div style={{ position: "absolute", top: 76, left: 0, right: 0, height: 92, display: "flex", alignItems: "center", gap: 16, padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ color: C.blue, fontSize: 34 }}>‹</span>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg,#7A4A2E,#3B2216)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F3D9C4", fontWeight: 700, fontSize: 22 }}>AK</div>
        <div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 24 }}>Awa K.</div>
          <div style={{ color: C.green, fontSize: 17 }}>en ligne</div>
        </div>
      </div>
      {/* messages */}
      <div style={{ position: "absolute", top: 190, left: 20, right: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {MESSAGES.map((m, i) => {
          const at = 0.25 + i * 0.38;
          const pin = tw(t, [at, at + 0.35], [0, 1]);
          const bd = burstAt + i * 0.06;
          const dissolve = tw(t, [bd, bd + 0.5], [0, 1]);
          return (
            <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  border: `2px solid ${C.blue}`,
                  background: sel > 0.5 ? C.blue : "transparent",
                  opacity: sel * (1 - dissolve),
                  order: m.me ? 0 : 2,
                }}
              />
              <div
                style={{
                  maxWidth: 330,
                  padding: m.file ? "14px 18px" : "14px 20px",
                  borderRadius: 22,
                  borderBottomRightRadius: m.me ? 6 : 22,
                  borderBottomLeftRadius: m.me ? 22 : 6,
                  background: m.me ? "linear-gradient(135deg,#0A7BD8,#0057B8)" : "#1A2436",
                  color: C.white,
                  fontSize: 22,
                  lineHeight: 1.3,
                  opacity: pin * (1 - dissolve),
                  translate: `0px ${(1 - pin) * 20}px`,
                  scale: String(1 - dissolve * 0.15),
                  filter: dissolve > 0 ? `blur(${dissolve * 8}px)` : undefined,
                  outline: sel > 0.5 ? `2px solid ${C.cyan}66` : undefined,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {m.file && <div style={{ width: 54, height: 54, borderRadius: 10, background: "linear-gradient(135deg,#2C6E5A,#C98B3A)" }} />}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>
      {/* état vide */}
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: empty }}>
        <IconTrash size={86} color={C.faint} />
        <div style={{ color: C.dim, fontSize: 24 }}>Aucune conversation</div>
      </div>
      {/* feuille de confirmation */}
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 22,
          padding: "26px 24px",
          borderRadius: 30,
          background: "rgba(24,32,48,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          translate: `0px ${(1 - sheet) * 340}px`,
          opacity: sheet > 0 ? 1 : 0,
          textAlign: "center",
        }}
      >
        <div style={{ color: C.white, fontSize: 24, fontWeight: 700 }}>Supprimer la conversation ?</div>
        <div style={{ color: C.dim, fontSize: 18, marginTop: 6 }}>5 messages et 1 pièce jointe</div>
        <div style={{ position: "relative", marginTop: 20, padding: "16px 0", borderRadius: 16, background: "#3A1A10", color: C.orange, fontSize: 23, fontWeight: 700, overflow: "hidden" }}>
          Supprimer
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 260,
              height: 260,
              borderRadius: 130,
              translate: "-50% -50%",
              scale: String(tap),
              background: `${C.orange}33`,
              opacity: tap > 0 && tap < 1 ? 1 - tap : 0,
            }}
          />
        </div>
        <div style={{ marginTop: 12, color: C.blue, fontSize: 22, fontWeight: 600 }}>Annuler</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene1Deletion: React.FC = () => {
  const { t, D } = useSceneClock();
  const burstAt = cue("s1.b", S) + 0.1;
  const titleAt = cue("s1.c", S);

  const pushOut = tw(t, [titleAt - 0.6, titleAt + 0.6], [0, 1], EASE_IN_OUT);
  const rotY = tw(t, [0, D], [-24, -6], EASE_IN_OUT) + Math.sin(t * 0.9) * 1.5;
  const rotX = tw(t, [0, D], [12, 4], EASE_IN_OUT);
  const phoneScale = tw(t, [0, titleAt], [0.9, 1.02], EASE_IN_OUT) * (1 - 0.3 * pushOut);
  const phoneY = 840 + pushOut * 330 + Math.sin(t * 1.2) * 6;
  const burst = tw(t, [burstAt, burstAt + 3.2], [0, 1], (x) => x);
  const converge = tw(t, [titleAt + 0.3, titleAt + 2.4], [0, 1], EASE_IN_OUT);

  return (
    <AbsoluteFill>
      {/* personnage en arrière-plan, flou de profondeur, éclairé par l'écran */}
      <div
        style={{
          position: "absolute",
          left: -120 + t * 6,
          top: 60,
          opacity: 0.6 - pushOut * 0.35,
          filter: "blur(5px) brightness(0.8)",
          scale: String(1.15 + t * 0.006),
        }}
      >
        <Person variant="citizen" width={820} lookX={0.6} lookY={0.9} tilt={-4} screenLight={0.9} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(9,14,24,0.1) 0%, rgba(9,14,24,0.7) 70%)" }} />

      {/* smartphone en 3D */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, perspective: 1700 }}>
        <div
          style={{
            position: "absolute",
            left: 540 - 250,
            top: phoneY - 520,
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${phoneScale})`,
            transformStyle: "preserve-3d",
          }}
        >
          <Smartphone width={500} glare={tw(t, [0, D], [0.1, 1.1])} screenGlow={1 - pushOut * 0.5}>
            <ChatScreen t={t} burstAt={burstAt} />
          </Smartphone>
        </div>
      </div>

      {/* pixels qui s'échappent du téléphone */}
      <PixelSwarm
        seed="s1-escape"
        count={110}
        p={burst}
        t={t}
        origin={{ x: 330, y: 560, w: 420, h: 420 }}
        drift={{ x: 120, y: -380 }}
        spread={620}
        converge={{ x: 540, y: 600, p: converge * 0.0 }}
      />

      {/* SUPPRIMÉ ≠ DISPARU */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
        <WordReveal text="SUPPRIMÉ" at={titleAt + 0.1} size={118} weight={800} letterSpacing={4} />
        <div style={{ height: 6 }} />
        <WordReveal text="≠" at={titleAt + 0.6} size={150} weight={700} color={C.orange} colors={{ "≠": C.orange }} />
        <div style={{ height: 6 }} />
        <WordReveal text="DISPARU" at={titleAt + 1.15} size={118} weight={800} letterSpacing={4} color={C.cyan} />
        <div
          style={{
            marginTop: 30,
            width: tw(t, [titleAt + 1.6, titleAt + 2.4], [0, 520], EASE_OUT),
            height: 3,
            background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
