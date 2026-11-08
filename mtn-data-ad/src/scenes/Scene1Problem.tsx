import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { KineticTitle } from "../components/KineticTitle";
import { Character } from "../components/Character";
import { TitleArea } from "../components/common";
import { Badge3D, SyncArrows } from "../icons";
import { CrossMark, DataArrows } from "../icons/extra";
import { Label } from "../components/ui";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { SAFE } from "../theme/safeZones";
import { EASE_IN_OUT, EASE_OUT, ip, SPRING_POP } from "../theme/timing";

// ---------------------------------------------------------------------------
// SCÈNE 1 — LE PROBLÈME  « Ta connexion finit trop vite ? »  (6 s)
// ---------------------------------------------------------------------------
export const SCENE1_TEXT = {
  title: [
    { text: "Ta", breakAfter: false },
    { text: "connexion", breakAfter: true },
    { text: "finit", breakAfter: true },
    { text: "trop vite ?", highlight: true },
  ],
  gaugeLabel: "Data restante",
  gaugePlan: "Forfait Internet",
  toast: "Forfait presque épuisé !",
};

// Temps clés de base (frames) ; ajustés à la durée réelle de la scène dans le composant.
const T0 = {
  character: 4,
  title: 14,
  card: 22,
  drainStart: 34,
  drainEnd: 96,
  vibrate: 36,
  toast: 58,
  badge: 46,
  cross: 96,
  question: 110,
  exit: 148, // les flèches de données filent au centre et deviennent l'icône de synchro (scène 2)
  end: 180,
};

const BADGE = { x: 720, y: 870, size: 250 }; // centre du badge « données »

export const Scene1Problem: React.FC<{ withAudio?: boolean; dur?: number }> = ({ withAudio = true, dur = 180 }) => {
  // Calé sur la voix-off (voir VOIX-OFF.md)
  const T = { ...T0, end: dur };
  const frame = useCurrentFrame();

  const exit = ip(frame, [T.exit, T.end - 8], [0, 1], EASE_IN_OUT);
  const fadeOthers = 1 - ip(frame, [T.exit, T.exit + 14], [0, 1]);

  // tremblement d'écran à l'impact de la croix
  const shakeT = frame - T.cross;
  const shake = shakeT >= 0 && shakeT < 12 ? Math.sin(shakeT * 2.4) * (12 - shakeT) * 1.4 : 0;

  // vibration du téléphone (micro-secousse du personnage)
  const vib = frame >= T.vibrate && frame < T.vibrate + 22 && (frame - T.vibrate) % 12 < 8 ? Math.sin(frame * 3.1) * 3 : 0;

  // jauge de data qui s'effondre
  const drain = ip(frame, [T.drainStart, T.drainEnd], [0, 1], EASE_IN_OUT);
  const remaining = 2 - drain * 1.9; // 2,0 Go -> 0,1 Go
  const gaugeColor = interpolateColors(drain, [0, 0.55, 1], [COLORS.green, COLORS.yellow, COLORS.red]);
  const cardIn = ip(frame, [T.card, T.card + 18], [0, 1], SPRING_POP);
  const lowBlink = drain > 0.85 ? 0.5 + 0.5 * Math.sin(frame / 2.2) : 0;

  // badge de données + croix rouge
  const badgeIn = ip(frame, [T.badge, T.badge + 18], [0, 1], SPRING_POP);
  const crossP = ip(frame, [T.cross, T.cross + 10], [0, 1], EASE_OUT);
  const crossScale = ip(frame, [T.cross, T.cross + 6, T.cross + 14], [2.4, 0.9, 1], EASE_OUT);
  const arrowsFlow = (frame * 3) % 60; // les flèches « pulsent » tant que la data passe

  // bulle « ? »
  const qIn = ip(frame, [T.question, T.question + 16], [0, 1], SPRING_POP);
  const qBounce = frame > T.question + 16 ? Math.abs(Math.sin((frame - T.question) / 7)) * -14 : 0;

  // toast de notification
  const toastIn = ip(frame, [T.toast, T.toast + 14], [0, 1], SPRING_POP);

  // badge en sortie : vers le centre, puis fondu enchaîné vers les flèches de synchro
  const bx = BADGE.x + (540 - BADGE.x) * exit;
  const by = BADGE.y + (960 - BADGE.y) * exit;
  const morphToSync = ip(frame, [T.end - 14, T.end - 2], [0, 1]);

  return (
    <AbsoluteFill style={{ translate: `${shake}px ${shake * 0.4}px` }}>
      {/* Titre */}
      <TitleArea opacity={fadeOthers}>
        <KineticTitle words={SCENE1_TEXT.title} from={T.title} stagger={5} fontSize={104} exitAt={T.exit} />
      </TitleArea>

      {/* Personnage surpris */}
      <Character
        src="characters/hero-surprised.png"
        width={1180}
        ratio={768 / 900}
        left={-200 + vib}
        top={1190}
        reveal={ip(frame, [T.character, T.character + 28], [0, 1], EASE_OUT)}
        parallax={-frame * 0.1}
        style={{ opacity: fadeOthers }}
      />

      {/* Ondes de vibration autour du téléphone */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: fadeOthers }}>
        {[0, 1, 2].map((i) => {
          const t = ip(frame, [T.vibrate + i * 5, T.vibrate + 20 + i * 5], [0, 1]);
          if (t <= 0 || t >= 1) return null;
          return (
            <g key={i} fill="none" stroke={COLORS.black} strokeWidth={6} strokeLinecap="round" opacity={1 - t}>
              <path d={`M ${790 - t * 40} ${1610 - t * 30} q -30 60 0 120`} />
              <path d={`M ${1010 + t * 40} ${1610 - t * 30} q 30 60 0 120`} />
            </g>
          );
        })}
      </svg>

      {/* Carte « Data restante » qui se vide */}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 760,
          width: 430,
          padding: "30px 32px",
          borderRadius: 40,
          background: COLORS.white,
          boxShadow: "0 30px 60px rgba(90,60,0,0.3), inset 0 -4px 0 rgba(0,0,0,0.06)",
          translate: `${(1 - cardIn) * -120}px 0px`,
          rotate: `${(1 - cardIn) * -10}deg`,
          opacity: ip(cardIn, [0, 0.3], [0, 1]) * fadeOthers,
        }}
      >
        <Label size={28} weight={700} color={COLORS.uiSoft}>
          {SCENE1_TEXT.gaugePlan}
        </Label>
        <Label size={36} weight={800} color={COLORS.black} style={{ marginTop: 4 }}>
          {SCENE1_TEXT.gaugeLabel}
        </Label>
        <div
          style={{
            fontFamily: FONT,
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 96,
            color: drain > 0.6 ? COLORS.red : COLORS.black,
            margin: "6px 0 14px",
            letterSpacing: -2,
          }}
        >
          {remaining.toFixed(1).replace(".", ",")}
          <span style={{ fontSize: 50 }}> Go</span>
        </div>
        {/* barre segmentée */}
        <div style={{ display: "flex", gap: 8 }}>
          {new Array(10).fill(0).map((_, i) => {
            const filled = (1 - drain) * 10 > i;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 8,
                  background: filled ? gaugeColor : "#E4E7EC",
                  boxShadow: filled ? "inset 0 4px 0 rgba(255,255,255,0.4)" : "inset 0 2px 4px rgba(0,0,0,0.1)",
                  opacity: i === 0 && drain > 0.85 ? 0.4 + lowBlink * 0.6 : 1,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Toast de notification (vient du téléphone) */}
      <div
        style={{
          position: "absolute",
          left: 470,
          top: 1110,
          width: 450,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 24px",
          borderRadius: 30,
          background: COLORS.ui,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          transformOrigin: "80% 100%",
          scale: `${toastIn}`,
          translate: `0px ${(1 - toastIn) * 120}px`,
          opacity: ip(toastIn, [0, 0.2], [0, 1]) * fadeOthers,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: COLORS.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 38,
            color: COLORS.white,
            flexShrink: 0,
          }}
        >
          !
        </div>
        <Label size={32} weight={800} color={COLORS.white}>
          {SCENE1_TEXT.toast}
        </Label>
      </div>

      {/* Bulle « ? » au-dessus de la tête */}
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 1040 + qBounce,
          width: 150,
          height: 130,
          scale: `${qIn}`,
          opacity: fadeOthers,
          transformOrigin: "30% 100%",
        }}
      >
        <svg width={150} height={150} viewBox="0 0 150 150" style={{ position: "absolute", filter: "drop-shadow(0 12px 18px rgba(90,60,0,0.3))" }}>
          <path d="M75 8 C112 8 140 32 140 62 C140 92 112 116 75 116 C68 116 62 115 56 113 L30 136 L36 106 C20 96 10 80 10 62 C10 32 38 8 75 8 Z" fill={COLORS.white} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 6,
            textAlign: "center",
            fontFamily: FONT,
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 88,
            color: COLORS.black,
            rotate: `${Math.sin(frame / 6) * 8}deg`,
          }}
        >
          ?
        </div>
      </div>

      {/* Grande icône 3D : flux de données + croix rouge */}
      <div
        style={{
          position: "absolute",
          left: bx - BADGE.size / 2,
          top: by - BADGE.size / 2,
          width: BADGE.size,
          height: BADGE.size,
          scale: `${badgeIn * (1 + exit * 0.35)}`,
          rotate: `${(1 - badgeIn) * 25}deg`,
        }}
      >
        <Badge3D size={BADGE.size} color={COLORS.black} style={{ position: "absolute", opacity: 1 - exit }}>
          <span />
        </Badge3D>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DataArrows
            size={170}
            color={exit > 0.5 ? COLORS.black : COLORS.yellow}
            style={{
              position: "absolute",
              rotate: `${exit * 90}deg`,
              opacity: (1 - morphToSync) * (frame < T.cross ? 0.75 + 0.25 * Math.sin((arrowsFlow / 60) * Math.PI * 2) : 1),
            }}
          />
          <SyncArrows size={320 / 1.35} color={COLORS.black} stroke={8} style={{ position: "absolute", opacity: morphToSync }} />
        </div>
        {/* croix rouge (impact) */}
        <div
          style={{
            position: "absolute",
            right: -40,
            bottom: -40,
            scale: `${crossP > 0 ? crossScale : 0}`,
            opacity: 1 - exit * 2,
          }}
        >
          <Badge3D size={130} color={COLORS.red} radius={65}>
            <CrossMark size={86} progress={crossP} />
          </Badge3D>
        </div>
      </div>

      {/* Flash d'impact */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.white,
          opacity: ip(frame, [T.cross, T.cross + 2, T.cross + 10], [0, 0.35, 0]),
          pointerEvents: "none",
        }}
      />

      {withAudio ? (
        <>
          <Sequence from={T.title} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
          </Sequence>
          <Sequence from={T.vibrate} layout="none">
            <Audio src={staticFile("sfx/vibrate.wav")} volume={0.8} />
          </Sequence>
          <Sequence from={T.drainStart + 6} layout="none">
            <Audio src={staticFile("sfx/power-down.wav")} volume={0.35} />
          </Sequence>
          <Sequence from={T.toast} layout="none">
            <Audio src={staticFile("sfx/alert.wav")} volume={0.6} />
          </Sequence>
          <Sequence from={T.badge} layout="none">
            <Audio src={staticFile("sfx/pop.wav")} volume={0.4} />
          </Sequence>
          <Sequence from={T.cross} layout="none">
            <Audio src={staticFile("sfx/impact.wav")} volume={0.75} />
          </Sequence>
          <Sequence from={T.question} layout="none">
            <Audio src={staticFile("sfx/pop.wav")} volume={0.45} />
          </Sequence>
          <Sequence from={T.exit} layout="none">
            <Audio src={staticFile("sfx/digital-spin.wav")} volume={0.45} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

