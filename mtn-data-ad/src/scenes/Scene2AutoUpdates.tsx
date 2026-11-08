import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { LAYOUT, StepChip } from "../components/common";
import { KineticTitle } from "../components/KineticTitle";
import { Toggle3D } from "../components/Toggle3D";
import { TouchHand, TouchRipple } from "../components/TouchHand";
import { Character } from "../components/Character";
import { Label, Panel3D, ProgressBar, SettingRow } from "../components/ui";
import { Badge3D, CellularIcon, CheckMark, DownloadArrow, PauseIcon, SyncArrows, WifiIcon } from "../icons";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { SAFE } from "../theme/safeZones";
import { clamp, EASE_IN, EASE_IN_OUT, EASE_OUT, SPRING_POP, SPRING_SOFT } from "../theme/timing";

// ---------------------------------------------------------------------------
// SCÈNE 2 — « Coupe les mises à jour auto »  (6 s = 180 frames @30fps)
// Tous les temps clés sont regroupés ici pour faciliter le retiming.
// ---------------------------------------------------------------------------
export const SCENE2_TEXT = {
  title: [
    { text: "Coupe", breakAfter: false },
    { text: "les", breakAfter: true },
    { text: "mises", breakAfter: false },
    { text: "à", breakAfter: false },
    { text: "jour", breakAfter: true },
    { text: "auto", highlight: true },
  ],
  panelTitle: "Mises à jour automatiques",
  panelSubtitle: "Applications & système",
  rowMobile: "Via données mobiles",
  rowWifi: "Wi-Fi uniquement",
  downloading: "Mise à jour en cours…",
  paused: "En pause · reprise en Wi-Fi",
  tip: "Mises à jour en Wi-Fi seulement",
};

// Temps clés de base (frames) ; ajustés à la durée réelle de la scène dans le composant.
const T0 = {
  morphEnd: 22, // les flèches de données (scène 1) deviennent l'icône de mise à jour
  panelIn: 6, // le panneau surgit en profondeur
  titleIn: 14,
  characterIn: 0,
  handIn: 50, // la main entre
  press: 76, // contact du doigt
  slide: 79, // le curseur glisse ON → OFF
  syncStop: 92, // les flèches de synchro s'arrêtent
  confirm: 100, // confirmation lumineuse
  tipIn: 112, // message pédagogique Wi-Fi
  handOut: 100,
  exit: 146, // transition vers la scène 3 : zoom dans l'interrupteur OFF
  end: 180,
};

// Géométrie (repère 1080×1920)
// Panneau dans la zone sûre TikTok : bord droit ≤ SAFE.right (colonne d'actions).
const PANEL = { left: SAFE.left + 10, top: 700, width: SAFE.right - SAFE.left - 20 };
const TOGGLE_W = 178;

export const Scene2AutoUpdates: React.FC<{ withAudio?: boolean; dur?: number }> = ({ withAudio = true, dur = 219 }) => {
  // Calé sur la voix-off (voir VOIX-OFF.md)
  const T = { ...T0, tipIn: 150, exit: dur - 26, end: dur };
  const frame = useCurrentFrame();

  // ---- états de l'interface ----
  const off = interpolate(frame, [T.slide, T.slide + 12], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const press = interpolate(frame, [T.press - 4, T.press, T.press + 8, T.press + 14], [0, 1, 1, 0], clamp);
  const reach = interpolate(frame, [T.handIn, T.press - 3, T.handOut, T.handOut + 18], [0, 1, 1, 0], {
    ...clamp,
    easing: [EASE_OUT, (t) => t, EASE_IN],
  });

  // rotation des flèches de synchro : rapide, puis décélération jusqu'à l'arrêt
  // intégrale approchée de la vitesse (déterministe)
  let rotation = 0;
  for (let f = 0; f < frame; f++) {
    rotation += interpolate(f, [0, T.slide, T.syncStop], [9, 9, 0], { ...clamp, easing: EASE_OUT });
  }
  // on cale l'arrêt sur une position « propre »
  if (frame >= T.syncStop) rotation = Math.round(rotation / 180) * 180;

  // progression du téléchargement (consomme de la data tant que c'est ON)
  const dl = interpolate(frame, [10, T.slide + 4], [0.12, 0.58], clamp);
  const mb = Math.round(dl * 248);
  const confirm = interpolate(frame, [T.confirm, T.confirm + 14], [0, 1], { ...clamp, easing: SPRING_POP });
  const sheen = interpolate(frame, [T.confirm - 4, T.confirm + 22], [-0.3, 1.3], clamp);

  // ---- entrée du panneau (profondeur) + flottement ----
  const pIn = interpolate(frame, [T.panelIn, T.panelIn + 26], [0, 1], { ...clamp, easing: SPRING_SOFT });
  const floatX = Math.sin(frame / 34) * 1.6;
  const floatY = Math.cos(frame / 41) * 1.4;

  // ---- sortie : la caméra plonge dans l'interrupteur OFF ----
  const exit = interpolate(frame, [T.exit, T.end], [0, 1], { ...clamp, easing: EASE_IN_OUT });

  // position écran approximative du centre de l'interrupteur (origine du zoom)
  const toggleCenter = { x: PANEL.left + PANEL.width - 132, y: PANEL.top + 260 };

  // ---- morph d'ouverture : flèches de données → icône de synchro ----
  const morph = interpolate(frame, [0, T.morphEnd], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const badgeTarget = { x: PANEL.left + 40 + 60, y: PANEL.top + 40 + 60 };

  const statusMobile = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: interpolateColors(off, [0, 1], [COLORS.green, COLORS.red]),
        }}
      />
      <Label size={30} weight={600} color={interpolateColors(off, [0, 1], [COLORS.green, COLORS.red])}>
        {off < 0.5 ? "Activé · consomme ta data" : "Désactivé"}
      </Label>
    </div>
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <StepChip step={1} exitAt={T.exit} />

      {/* ===== Scène (tout ce qui subit la plongée caméra de sortie) ===== */}
      <AbsoluteFill
        style={{
          transformOrigin: `${toggleCenter.x}px ${toggleCenter.y}px`,
          scale: `${interpolate(exit, [0, 1], [1, 3.6])}`,
          translate: `${(540 - toggleCenter.x) * exit}px ${(960 - toggleCenter.y) * exit}px`,
        }}
      >
        {/* Titre cinétique */}
        <div
          style={{
            position: "absolute",
            top: LAYOUT.titleTop,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: 1 - exit * 1.6,
          }}
        >
          <KineticTitle words={SCENE2_TEXT.title} from={T.titleIn} stagger={4} fontSize={94} />
        </div>

        {/* Personnage (révélation par masque) */}
        <Character
          src="characters/hero-phone.png"
          width={1180}
          ratio={1152 / 1328}
          left={-150}
          top={1200}
          reveal={interpolate(frame, [T.characterIn, T.characterIn + 26], [0, 1], { ...clamp, easing: EASE_OUT })}
          parallax={Math.sin(frame / 50) * 6 - frame * 0.08}
          style={{ opacity: 1 - exit * 1.4 }}
        />

        {/* Faisceau lumineux : l'écran du téléphone « projette » l'interface agrandie */}
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0, opacity: pIn * 0.55 * (1 - exit) }}
        >
          <defs>
            <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={COLORS.white} stopOpacity={0.9} />
              <stop offset="100%" stopColor={COLORS.white} stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points={`905,1670 985,1648 ${PANEL.left + PANEL.width - 70},1290 ${PANEL.left + 480},1290`} fill="url(#beam)" />
          {[0, 1, 2, 3, 4].map((i) => {
            const t = ((frame / 26 + i / 5) % 1) as number;
            return (
              <circle
                key={i}
                cx={945 - t * 140 + (i % 2 ? 1 : -1) * 50 * t + Math.sin(i * 3) * 30 * t}
                cy={1655 - t * 450}
                r={6 * (1 - t) + 2}
                fill={COLORS.white}
                opacity={1 - t}
              />
            );
          })}
        </svg>

        {/* ===== Panneau 3D ===== */}
        <div
          style={{
            position: "absolute",
            left: PANEL.left,
            top: PANEL.top,
            width: PANEL.width,
            perspective: pIn < 0.995 ? 1800 : undefined,
          }}
        >
          <div
            style={{
              transformStyle: pIn < 0.995 ? "preserve-3d" : "flat",
              transformOrigin: "50% 100%",
              // En 3D pendant l'entrée, puis en 2D (flottement) : le rendu reste net lors du zoom final.
              transform:
                pIn < 0.995
                  ? `translateZ(${(1 - pIn) * -900}px) rotateX(${(1 - pIn) * 38}deg) rotateY(${(1 - pIn) * -28}deg)`
                  : `translate(${floatX * 3}px, ${floatY * 3}px)`,
              opacity: interpolate(pIn, [0, 0.25], [0, 1], clamp),
            }}
          >
            <Panel3D width={PANEL.width} sheen={sheen}>
              {/* En-tête */}
              <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "40px 40px 26px" }}>
                <Badge3D size={120}>
                  <SyncArrows
                    size={82}
                    rotation={rotation}
                    style={{ opacity: interpolate(frame, [T.morphEnd - 4, T.morphEnd], [0, 1], clamp) }}
                  />
                </Badge3D>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Label size={44} weight={800} color={COLORS.black}>
                    {SCENE2_TEXT.panelTitle}
                  </Label>
                  <Label size={30} weight={600} color={COLORS.uiSoft}>
                    {SCENE2_TEXT.panelSubtitle}
                  </Label>
                </div>
              </div>
              <div style={{ height: 2, background: COLORS.uiLine, margin: "0 40px" }} />

              {/* Ligne : données mobiles (cible de l'action) */}
              <div style={{ position: "relative", zIndex: 10 }}>
                <SettingRow
                  icon={<CellularIcon size={54} color={interpolateColors(off, [0, 1], [COLORS.ui, COLORS.red])} />}
                  label={SCENE2_TEXT.rowMobile}
                  status={statusMobile}
                  highlight={interpolate(frame, [T.handIn, T.press, T.confirm + 20, T.confirm + 40], [0, 1, 1, 0], clamp)}
                  control={
                    <div style={{ position: "relative" }}>
                      <Toggle3D off={off} press={press} width={TOGGLE_W} glow={interpolate(frame, [T.slide + 8, T.slide + 16, T.slide + 40], [0, 0.8, 0.25], clamp)} />
                      <TouchRipple x={TOGGLE_W * 0.72} y={TOGGLE_W * 0.28} t={interpolate(frame, [T.press, T.press + 22], [0, 1], clamp)} color={COLORS.yellow} size={300} />
                      <TouchHand x={TOGGLE_W * 0.74} y={TOGGLE_W * 0.3} reach={reach} press={press} displayWidth={620} travel={720} />
                    </div>
                  }
                />
              </div>

              {/* Ligne : Wi-Fi (reste active) */}
              <SettingRow
                icon={<WifiIcon size={56} color={COLORS.ui} />}
                label={SCENE2_TEXT.rowWifi}
                highlight={interpolate(frame, [T.confirm + 10, T.confirm + 24], [0, 1], clamp)}
                status={
                  <Label size={30} weight={600} color={COLORS.green}>
                    Activé · gratuit en Wi-Fi
                  </Label>
                }
                control={<Toggle3D off={0} width={TOGGLE_W} glow={interpolate(frame, [T.confirm + 10, T.confirm + 20, T.confirm + 50], [0, 0.9, 0.35], clamp)} />}
              />

              {/* Bandeau de téléchargement : la data s'écoule… puis s'arrête */}
              <div
                style={{
                  margin: "10px 40px 40px",
                  padding: "24px 28px",
                  borderRadius: 28,
                  background: "#F1F3F6",
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                }}
              >
                <div style={{ width: 64, height: 64, position: "relative", overflow: "hidden" }}>
                  {off < 1 ? (
                    <DownloadArrow
                      size={64}
                      color={COLORS.ui}
                      style={{
                        position: "absolute",
                        translate: `0px ${off > 0 ? 0 : ((frame * 2.2) % 40) - 14}px`,
                        opacity: 1 - off,
                      }}
                    />
                  ) : null}
                  <PauseIcon size={60} color={COLORS.red} style={{ position: "absolute", opacity: off, scale: `${0.6 + off * 0.4}` }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Label size={30} weight={700} color={off > 0.5 ? COLORS.red : COLORS.ui}>
                      {off > 0.5 ? SCENE2_TEXT.paused : SCENE2_TEXT.downloading}
                    </Label>
                    <Label size={30} weight={800} color={COLORS.ui}>
                      {mb} / 248 Mo
                    </Label>
                  </div>
                  <ProgressBar value={dl} color={interpolateColors(off, [0, 1], [COLORS.yellow, "#B8BDC7"])} />
                </div>
              </div>
            </Panel3D>

            {/* Badge de confirmation (coin du panneau) */}
            <div
              style={{
                position: "absolute",
                right: -26,
                top: -40,
                scale: `${confirm}`,
                rotate: `${(1 - confirm) * -40}deg`,
              }}
            >
              <Badge3D size={128} color={COLORS.green} radius={64}>
                <CheckMark size={86} progress={interpolate(frame, [T.confirm + 4, T.confirm + 16], [0, 1], { ...clamp, easing: EASE_OUT })} />
              </Badge3D>
            </div>
          </div>
        </div>

        {/* Flèches de données venues de la scène 1 → icône de mise à jour */}
        {morph < 1 ? (
          <div
            style={{
              position: "absolute",
              left: interpolate(morph, [0, 1], [540, badgeTarget.x]) - 160,
              top: interpolate(morph, [0, 1], [960, badgeTarget.y]) - 160,
              width: 320,
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: `${interpolate(morph, [0, 1], [1, 0.26])}`,
              opacity: interpolate(morph, [0.85, 1], [1, 0], clamp),
            }}
          >
            <SyncArrows size={320} rotation={morph * 540} color={COLORS.black} stroke={8} />
          </div>
        ) : null}

        {/* Message pédagogique : Wi-Fi conservé */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: PANEL.top + 585,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [T.tipIn, T.tipIn + 10], [0, 1], clamp) * (1 - exit * 2),
            translate: `0px ${interpolate(frame, [T.tipIn, T.tipIn + 16], [30, 0], { ...clamp, easing: EASE_OUT })}px`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "20px 34px",
              borderRadius: 60,
              background: COLORS.black,
              boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
              scale: `${interpolate(frame, [T.tipIn, T.tipIn + 14], [0.8, 1], { ...clamp, easing: SPRING_POP })}`,
            }}
          >
            <WifiIcon size={50} color={COLORS.yellow} />
            <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 800, fontSize: 38, color: COLORS.white }}>
              {SCENE2_TEXT.tip}
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Flash de transition (fondu dans le jaune de la scène suivante) */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.yellowBright,
          opacity: interpolate(frame, [T.end - 8, T.end], [0, 0.6], clamp),
          pointerEvents: "none",
        }}
      />

      {/* ===== Piste d'effets sonores synchronisés ===== */}
      {withAudio ? (
        <>
          <Sequence  layout="none">
            <Audio src={staticFile("sfx/digital-spin.wav")} volume={0.6} />
          </Sequence>
          <Sequence from={T.panelIn} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
          </Sequence>
          <Sequence from={T.morphEnd} layout="none">
            <Audio src={staticFile("sfx/pop.wav")} volume={0.5} />
          </Sequence>
          <Sequence from={T.press} layout="none">
            <Audio src={staticFile("sfx/click.wav")} volume={0.9} />
          </Sequence>
          <Sequence from={T.slide} layout="none">
            <Audio src={staticFile("sfx/toggle.wav")} volume={0.8} />
          </Sequence>
          <Sequence from={T.syncStop - 10} layout="none">
            <Audio src={staticFile("sfx/power-down.wav")} volume={0.6} />
          </Sequence>
          <Sequence from={T.confirm} layout="none">
            <Audio src={staticFile("sfx/confirm.wav")} volume={0.7} />
          </Sequence>
          <Sequence from={T.confirm + 2} layout="none">
            <Audio src={staticFile("sfx/sparkle.wav")} volume={0.4} />
          </Sequence>
          <Sequence from={T.tipIn} layout="none">
            <Audio src={staticFile("sfx/pop.wav")} volume={0.35} />
          </Sequence>
          <Sequence from={T.exit} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
