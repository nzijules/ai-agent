import React from "react";
import { AbsoluteFill, random } from "remotion";
import { HoloPanel } from "../components/HoloPanel";
import { IconKey, IconWarn } from "../components/Icons";
import { Padlock } from "../components/Padlock";
import { PixelSwarm } from "../components/PixelSwarm";
import { WordReveal } from "../components/WordReveal";
import { cue } from "../data/script";
import { EASE_IN_OUT, EASE_OUT, tw, useSceneClock } from "../lib/anim";
import { FONT } from "../fonts";
import { C } from "../theme";

const S = "s4" as const;
const PLAIN = ["Bonjour", "RDV 18h", "Photo_0312", "Contrat.pdf", "Code: 4471", "Adresse", "Audio_07", "Merci !", "Facture", "Notes", "Agenda", "Vidéo_22"];
const HEX = "0123456789ABCDEF";

const scramble = (txt: string, p: number, seed: string, frame: number) =>
  txt
    .split("")
    .map((ch, i) => {
      if (random(`${seed}-${i}`) < p) {
        return HEX[Math.floor(random(`${seed}-${i}-${Math.floor(frame / 3)}`) * 16)];
      }
      return ch;
    })
    .join("");

export const Scene4Encryption: React.FC = () => {
  const { t, frame, sp } = useSceneClock();
  const cA = cue("s4.a", S);
  const cB = cue("s4.b", S);
  const cC = cue("s4.c", S);
  const cD = cue("s4.d", S);

  const lockIn = sp(cB - 0.6, { damping: 15, stiffness: 80 });
  const closed = sp(cB + 1.4, { damping: 9, stiffness: 160 });
  const wave = tw(t, [cB + 0.6, cB + 2.6], [0, 1], EASE_IN_OUT);
  const keyIn = tw(t, [cC - 0.2, cC + 0.5], [0, 1]);
  const keyBreak = tw(t, [cC + 1.4, cC + 2.6], [0, 1], (x) => x);
  const dead = tw(t, [cC + 1.8, cC + 3.0], [0, 1]);
  const alert = tw(t, [cC + 2.0, cC + 2.3], [0, 1]);
  const flash = tw(t, [cB + 1.4, cB + 1.55], [0, 1]) * tw(t, [cB + 1.55, cB + 2.1], [1, 0]);
  const tilt = tw(t, [-0.6, 18], [18, 6], EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Titre */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <WordReveal text="RÉCUPÉRATION" at={cA + 0.1} size={96} weight={800} letterSpacing={3} out={cB - 0.3} />
        <WordReveal text="jamais garantie" at={cA + 0.7} size={82} weight={600} color={C.orange} out={cB - 0.3} />
      </AbsoluteFill>

      {/* Plan de données en perspective */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 900, perspective: 1300 }}>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 60,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
            transform: `rotateX(${tilt}deg) translateZ(-120px)`,
            opacity: tw(t, [cA + 0.4, cA + 1.5], [0, 1]),
          }}
        >
          {PLAIN.map((w, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const local = Math.max(0, Math.min(1, wave * 1.6 - row * 0.2));
            const enc = local;
            const glitch = dead > 0 ? (random(`gl${i}-${Math.floor(frame / 2)}`) - 0.5) * 10 * dead * (1 - dead * 0.5) : 0;
            const txt = enc > 0 ? scramble(w.padEnd(10, "·"), enc, `s4-${i}`, frame) : w;
            return (
              <div
                key={i}
                style={{
                  height: 120,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: enc > 0.5 ? FONT.mono : FONT.ui,
                  fontWeight: 600,
                  fontSize: 30,
                  color: dead > 0.5 ? "#4A5568" : enc > 0.5 ? C.cyan : C.white,
                  background: dead > 0.5 ? "rgba(30,36,48,0.6)" : enc > 0.5 ? "rgba(0,80,120,0.25)" : "rgba(30,50,80,0.55)",
                  border: `1px solid ${dead > 0.5 ? "#2A3242" : enc > 0.5 ? C.cyan + "66" : "rgba(255,255,255,0.12)"}`,
                  translate: `${glitch}px ${Math.sin(t * 1.2 + col + row) * 6}px`,
                  opacity: 1 - dead * 0.45,
                  textDecoration: "none",
                }}
              >
                {txt}
              </div>
            );
          })}
        </div>
        {/* front de chiffrement */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 40 + wave * 640,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
            boxShadow: `0 0 30px ${C.cyan}`,
            opacity: wave > 0 && wave < 1 ? 1 : 0,
          }}
        />
      </div>

      {/* Cadenas */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 640 }}>
        <div style={{ scale: String(lockIn), opacity: Math.min(1, lockIn), translate: `0px ${Math.sin(t * 1.1) * 8}px` }}>
          <Padlock width={330} closed={closed} alert={alert} glow={1 + flash * 2} />
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: FONT.mono,
            fontSize: 30,
            letterSpacing: 4,
            color: alert > 0.5 ? C.orange : C.cyan,
            opacity: tw(t, [cB + 1.6, cB + 2.1], [0, 1]),
            padding: "10px 22px",
            borderRadius: 10,
            background: "rgba(5,10,18,0.8)",
            border: `1px solid ${alert > 0.5 ? C.orange : C.cyan}66`,
          }}
        >
          {alert > 0.5 ? "DONNÉES ILLISIBLES" : "STOCKAGE CHIFFRÉ"}
        </div>
      </AbsoluteFill>

      {/* Clé de chiffrement qui se désintègre */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 760,
          opacity: keyIn * (1 - keyBreak),
          translate: `${(1 - keyIn) * 80}px ${Math.sin(t * 2) * 6}px`,
          filter: keyBreak > 0 ? `blur(${keyBreak * 6}px)` : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <IconKey size={150} color={C.cyan} stroke={3} />
        <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.cyan }}>clé</div>
      </div>
      <PixelSwarm
        seed="s4-key"
        count={60}
        p={keyBreak}
        t={t}
        origin={{ x: 770, y: 790, w: 140, h: 80 }}
        drift={{ x: 160, y: -240 }}
        spread={380}
        colors={[C.orange, "#FFB066", C.cyan]}
        minSize={6}
        maxSize={16}
        fadeTo={0}
      />
      {/* flash de verrouillage */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${C.cyan}55, transparent 50%)`, opacity: flash }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, transparent 40%, ${C.orange}22 100%)`, opacity: dead * tw(t, [cC + 2, cD + 4], [1, 0.4]) }} />

      {/* Bilan */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1150 }}>
        <HoloPanel p={tw(t, [cD - 0.1, cD + 0.6], [0, 1], EASE_OUT)} width={860} accent={C.orange} title="Limites" icon={<IconWarn size={50} color={C.orange} />}>
          {[
            ["Clé de chiffrement", "effacée"],
            ["Sauvegarde", "aucune"],
            ["Récupération", "impossible"],
          ].map(([k, v], i) => {
            const p = tw(t, [cD + 0.6 + i * 0.5, cD + 1.0 + i * 0.5], [0, 1]);
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.ui, fontSize: 30, padding: "8px 0", borderBottom: `1px dashed ${C.orange}33`, opacity: p, translate: `${(1 - p) * 30}px 0px` }}>
                <span style={{ color: C.dim }}>{k}</span>
                <span style={{ color: C.orange, fontWeight: 700 }}>✕ {v}</span>
              </div>
            );
          })}
        </HoloPanel>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
