import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { KineticTitle } from "../components/KineticTitle";
import { StepChip, TitleArea } from "../components/common";
import { Phone } from "../components/Phone";
import { Toggle3D } from "../components/Toggle3D";
import { TouchRipple } from "../components/TouchHand";
import { Label, ProgressBar } from "../components/ui";
import { CheckMark, SyncArrows, WifiIcon } from "../icons";
import { AppIcon, AppKind, CloudShape } from "../icons/extra";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { EASE_IN_OUT, EASE_OUT, ip, SPRING_POP } from "../theme/timing";

// ---------------------------------------------------------------------------
// SCÈNE 5 — « Surveille les sauvegardes auto »  (6 s)
// Pédagogie : on ne supprime pas la sauvegarde, on la réserve au Wi-Fi.
// ---------------------------------------------------------------------------
export const SCENE5_TEXT = {
  title: [
    { text: "Surveille", breakAfter: false },
    { text: "les", breakAfter: true },
    { text: "sauvegardes", breakAfter: false },
    { text: "auto", highlight: true },
  ],
  screenTitle: "Sauvegarde cloud",
  progress: "Sauvegarde en cours",
  rowMobile: "Via données mobiles",
  rowWifi: "Wi-Fi uniquement",
  waiting: "En attente du Wi-Fi",
  waitingSub: "Tes fichiers restent protégés",
};

// Temps clés de base (frames) ; ajustés à la durée réelle de la scène dans le composant.
const T0 = { intro: 22, title: 8, files: 24, press: 84, wifi: 96, confirm: 104, exit: 146, end: 180 };

const PH = { x: 50, y: 690, w: 510 };
const CLOUD = { cx: 768, cy: 800, w: 330 };
export const S6_GAUGE = { x: 540, y: 965, r: 150 }; // centre de la jauge de la scène 6 (raccord)

const FILES: AppKind[] = ["photo", "video", "contact", "doc"];

export const Scene5Backups: React.FC<{ withAudio?: boolean; dur?: number }> = ({ withAudio = true, dur = 207 }) => {
  // Calé sur la voix-off (voir VOIX-OFF.md)
  const T = { ...T0, press: 120, wifi: 160, confirm: 168, exit: dur - 28, end: dur };
  const frame = useCurrentFrame();
  const fade = 1 - ip(frame, [T.exit, T.exit + 12], [0, 1]);
  const off = ip(frame, [T.press + 2, T.press + 12], [0, 1], EASE_IN_OUT);
  const wifi = ip(frame, [T.wifi, T.wifi + 10], [0, 1], SPRING_POP);
  const confirm = ip(frame, [T.confirm, T.confirm + 14], [0, 1], SPRING_POP);

  // intro : le nuage de la scène 4 glisse à sa place
  const intro = ip(frame, [0, T.intro], [0, 1], EASE_IN_OUT);
  const cw = 700 + (CLOUD.w - 700) * intro;
  const ccx = 540 + (CLOUD.cx - 540) * intro;
  const ccy = 960 + (CLOUD.cy - 960) * intro;

  // rotation des flèches de synchro (décélèrent après la coupure)
  let rot = 0;
  for (let f = 0; f < frame; f++) rot += ip(f, [0, T.press, T.press + 16], [7, 7, 0], EASE_OUT);

  const progress = ip(frame, [T.files, T.press], [0.38, 0.63]);
  const phoneIn = ip(frame, [4, 24], [0, 1], SPRING_POP);

  // sortie : la coche de confirmation devient l'anneau de la jauge (scène 6)
  const exit = ip(frame, [T.exit, T.end], [0, 1], EASE_IN_OUT);
  const checkPos = { x: 754, y: 1215 };
  const ringX = checkPos.x + (S6_GAUGE.x - checkPos.x) * exit;
  const ringY = checkPos.y + (S6_GAUGE.y - checkPos.y) * exit;
  const ringR = 64 + (S6_GAUGE.r - 64) * exit;

  return (
    <AbsoluteFill>
      <StepChip step={4} exitAt={T.exit} />
      <TitleArea opacity={fade}>
        <KineticTitle words={SCENE5_TEXT.title} from={T.title} stagger={4} fontSize={96} exitAt={T.exit} />
      </TitleArea>

      {/* Téléphone : écran de sauvegarde */}
      <div style={{ position: "absolute", left: PH.x, top: PH.y, scale: `${phoneIn}`, opacity: fade, translate: `0px ${Math.sin(frame / 32) * 5}px` }}>
        <Phone width={PH.w} screen="#F6F7F9">
          <div style={{ position: "absolute", left: 26, right: 20, top: 70 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <CloudShape width={60} color="#DDE6F5" />
              <Label size={32} weight={800} color={COLORS.black}>
                {SCENE5_TEXT.screenTitle}
              </Label>
            </div>
            <div style={{ marginTop: 22, padding: 18, borderRadius: 22, background: COLORS.white, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Label size={22} weight={700} color={off > 0.5 ? COLORS.uiSoft : COLORS.ui}>
                  {off > 0.5 ? SCENE5_TEXT.waiting : SCENE5_TEXT.progress}
                </Label>
                <Label size={22} weight={800} color={COLORS.ui}>
                  {Math.round(progress * 100)} %
                </Label>
              </div>
              <div style={{ marginTop: 10 }}>
                <ProgressBar value={progress} height={14} color={interpolateColors(off, [0, 1], [COLORS.yellow, "#B8BDC7"])} />
              </div>
            </div>
            {/* ligne : données mobiles */}
            <div
              style={{
                position: "relative",
                marginTop: 16,
                padding: "16px 14px 16px 18px",
                borderRadius: 22,
                background: COLORS.white,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                outline: frame > T.files + 20 && off < 0.5 ? `4px solid rgba(239,51,64,${0.4 + 0.3 * Math.sin(frame / 4)})` : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <Label size={25} weight={800} color={COLORS.ui}>
                  {SCENE5_TEXT.rowMobile}
                </Label>
                <Label size={19} weight={700} color={interpolateColors(off, [0, 1], [COLORS.red, COLORS.uiSoft])}>
                  {off > 0.5 ? "Désactivé" : "Consomme ta data"}
                </Label>
              </div>
              <div style={{ position: "relative" }}>
                <Toggle3D off={off} width={108} press={ip(frame, [T.press - 3, T.press, T.press + 8], [0, 1, 0])} />
                <TouchRipple x={76} y={30} t={ip(frame, [T.press, T.press + 18], [0, 1])} color={COLORS.yellow} size={170} />
              </div>
            </div>
            {/* ligne : Wi-Fi uniquement */}
            <div
              style={{
                marginTop: 12,
                padding: "16px 14px 16px 18px",
                borderRadius: 22,
                background: `rgba(255,203,5,${0.25 * wifi})`,
                border: `3px solid rgba(255,203,5,${wifi})`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <WifiIcon size={40} color={COLORS.ui} />
              <Label size={25} weight={800} color={COLORS.ui} style={{ flex: 1 }}>
                {SCENE5_TEXT.rowWifi}
              </Label>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  border: `4px solid ${wifi > 0.5 ? COLORS.black : "#B8BDC7"}`,
                  background: wifi > 0.5 ? COLORS.yellow : "transparent",
                  scale: `${ip(frame, [T.wifi, T.wifi + 4, T.wifi + 10], [1, 1.25, 1])}`,
                }}
              >
                <CheckMark size={38} color={COLORS.black} progress={ip(frame, [T.wifi + 2, T.wifi + 10], [0, 1])} />
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 26, right: 20, top: 560 }}>
            <Label size={24} weight={800} color={COLORS.uiSoft}>
              Contenu sauvegardé
            </Label>
            {[
              { k: "photo" as AppKind, n: "Photos", c: 1240 },
              { k: "video" as AppKind, n: "Vidéos", c: 86 },
              { k: "contact" as AppKind, n: "Contacts", c: 312 },
              { k: "doc" as AppKind, n: "Documents", c: 45 },
            ].map((r, i) => (
              <div
                key={r.n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 12,
                  padding: "10px 14px",
                  borderRadius: 18,
                  background: COLORS.white,
                  opacity: ip(frame, [20 + i * 5, 30 + i * 5], [0, 1]),
                }}
              >
                <AppIcon kind={r.k} size={48} />
                <Label size={24} weight={700} color={COLORS.ui} style={{ flex: 1 }}>
                  {r.n}
                </Label>
                <Label size={22} weight={800} color={off > 0.5 ? COLORS.green : COLORS.uiSoft}>
                  {off > 0.5 ? "✓ protégés" : r.c.toLocaleString("fr-FR")}
                </Label>
              </div>
            ))}
          </div>
        </Phone>
      </div>

      {/* Fichiers qui montent vers le nuage (uniquement tant que la sauvegarde mobile est active) */}
      {FILES.map((k, i) => {
        const cycle = 22;
        const start = T.files + i * 6;
        const out: React.ReactNode[] = [];
        for (let n = 0; n < 4; n++) {
          const s0 = start + n * cycle;
          const t = (frame - s0) / 30;
          // un fichier ne part plus après la coupure ; ceux en vol se figent et s'effacent
          if (s0 > T.press + 2 || t < 0 || t > 1) continue;
          const frozen = frame > T.press + 2;
          const tt = frozen ? Math.min(t, (T.press + 2 - s0) / 30) : t;
          const e = EASE_IN_OUT(tt);
          const x0 = PH.x + PH.w - 40;
          const y0 = PH.y + 520 - i * 40;
          const x = x0 + (CLOUD.cx - x0) * e;
          const y = y0 + (CLOUD.cy + 20 - y0) * e - Math.sin(Math.PI * e) * 120;
          out.push(
            <div
              key={`${k}-${n}`}
              style={{
                position: "absolute",
                left: x - 45,
                top: y - 45,
                scale: `${1 - e * 0.5}`,
                opacity: (frozen ? 1 - ip(frame, [T.press + 2, T.press + 14], [0, 1]) : 1) * ip(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0]) * fade,
                filter: frozen ? "grayscale(1)" : "none",
              }}
            >
              <AppIcon kind={k} size={90} />
            </div>,
          );
        }
        return <React.Fragment key={k}>{out}</React.Fragment>;
      })}

      {/* Grand nuage + flèches de synchronisation jaunes */}
      <div
        style={{
          position: "absolute",
          left: ccx - cw / 2,
          top: ccy - (cw * 0.62) / 2,
          width: cw,
          height: cw * 0.62,
          opacity: fade,
          filter: "drop-shadow(0 30px 50px rgba(110,70,0,0.3))",
        }}
      >
        <CloudShape width={cw} />
        <div style={{ position: "absolute", left: "50%", top: "56%", translate: "-50% -50%", opacity: intro }}>
          <SyncArrows size={cw * 0.36} rotation={rot} color={off > 0.5 ? "#B8BDC7" : COLORS.yellow} stroke={11} />
        </div>
      </div>

      {/* Carte « En attente du Wi-Fi » */}
      <div
        style={{
          position: "absolute",
          left: 578,
          top: 1000,
          width: 352,
          padding: "22px 24px",
          borderRadius: 30,
          background: COLORS.black,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          scale: `${confirm}`,
          transformOrigin: "50% 0%",
          opacity: fade,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <WifiIcon size={38} color={COLORS.yellow} />
          <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 26, whiteSpace: "nowrap", color: COLORS.white }}>{SCENE5_TEXT.waiting}</span>
        </div>
        <Label size={24} weight={600} color={COLORS.yellowPale} style={{ marginTop: 4 }}>
          {SCENE5_TEXT.waitingSub}
        </Label>
      </div>

      {/* Coche de confirmation → anneau de la scène 6 */}
      <div
        style={{
          position: "absolute",
          left: ringX - ringR,
          top: ringY - ringR,
          width: ringR * 2,
          height: ringR * 2,
          scale: `${frame < T.exit ? confirm : 1}`,
        }}
      >
        <svg width={ringR * 2} height={ringR * 2} style={{ position: "absolute", overflow: "visible" }}>
          <circle cx={ringR} cy={ringR} r={ringR - 14} fill={`rgba(34,197,94,${1 - exit})`} stroke={exit > 0 ? "rgba(255,255,255,0.85)" : COLORS.green} strokeWidth={28 * exit + 0.01} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - exit * 2 }}>
          <CheckMark size={80} progress={ip(frame, [T.confirm + 4, T.confirm + 16], [0, 1])} />
        </div>
      </div>

      {withAudio ? (
        <>
          <Sequence  layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.4} />
          </Sequence>
          <Sequence from={T.files} layout="none">
            <Audio src={staticFile("sfx/transfer.wav")} volume={0.45} />
          </Sequence>
          <Sequence from={T.files + 30} layout="none">
            <Audio src={staticFile("sfx/transfer.wav")} volume={0.35} />
          </Sequence>
          <Sequence from={T.press} layout="none">
            <Audio src={staticFile("sfx/toggle.wav")} volume={0.8} />
          </Sequence>
          <Sequence from={T.press + 6} layout="none">
            <Audio src={staticFile("sfx/power-down.wav")} volume={0.45} />
          </Sequence>
          <Sequence from={T.wifi} layout="none">
            <Audio src={staticFile("sfx/click.wav")} volume={0.7} />
          </Sequence>
          <Sequence from={T.confirm} layout="none">
            <Audio src={staticFile("sfx/confirm.wav")} volume={0.65} />
          </Sequence>
          <Sequence from={T.exit} layout="none">
            <Audio src={staticFile("sfx/digital-spin.wav")} volume={0.4} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
