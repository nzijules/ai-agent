import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { KineticTitle } from "../components/KineticTitle";
import { StepChip, TitleArea, Flash } from "../components/common";
import { Phone } from "../components/Phone";
import { Toggle3D } from "../components/Toggle3D";
import { TouchRipple } from "../components/TouchHand";
import { Label } from "../components/ui";
import { AppIcon, AppKind, TowerIcon } from "../icons/extra";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { EASE_IN_OUT, EASE_OUT, ip, SPRING_POP } from "../theme/timing";

// ---------------------------------------------------------------------------
// SCÈNE 3 — « Empêche les applis de tourner en arrière-plan »  (6 s)
// Pédagogie : on coupe les applis non essentielles, la messagerie reste active.
// ---------------------------------------------------------------------------
export const SCENE3_TEXT = {
  title: [
    { text: "Empêche", breakAfter: false },
    { text: "les", breakAfter: false },
    { text: "applis", breakAfter: true },
    { text: "de", breakAfter: false },
    { text: "tourner", breakAfter: false },
    { text: "en", breakAfter: true },
    { text: "arrière-plan", highlight: true },
  ],
  screenTitle: "Arrière-plan",
  screenSub: "Données mobiles · applis",
  meter: "Conso en arrière-plan",
  essential: "Essentielle",
};

type Row = { kind: AppKind; name: string; offAt: number | null; mb: number };
// offAt : frame de coupure (null = reste activée). Le jeu est coupé par l'interrupteur venu de la scène 2.
const ROWS: Row[] = [
  { kind: "game", name: "Jeu", offAt: -1, mb: 22 },
  { kind: "shop", name: "Boutique", offAt: 58, mb: 14 },
  { kind: "social", name: "Réseau social", offAt: 76, mb: 18 },
  { kind: "video", name: "Vidéo", offAt: 94, mb: 26 },
  { kind: "chat", name: "Messagerie", offAt: null, mb: 4 },
];

const T = { intro: 22, title: 8, icons: 14, highlight: 30, gauge: 40, exit: 148, end: 180 };

// Géométrie du téléphone (repère 1080×1920)
const PH = { x: 290, y: 715, w: 500 };
const SCR = { x: PH.x + PH.w * 0.035, y: PH.y + PH.w * 0.035, w: PH.w * 0.93 };
const HEAD = 160; // hauteur de l'en-tête de l'écran
const ROW0 = SCR.y + HEAD;
const ROW_H = 92;
const TOG_W = 116;
const toggleCenter = (i: number) => ({ x: SCR.x + SCR.w - 26 - TOG_W / 2, y: ROW0 + ROW_H * i + (ROW_H - 10) / 2 });

// Icônes en orbite autour du téléphone (même ordre que ROWS)
const ORBIT: { x: number; y: number; size: number }[] = [
  { x: 130, y: 860, size: 124 },
  { x: 130, y: 1080, size: 124 },
  { x: 900, y: 900, size: 110 },
  { x: 130, y: 1300, size: 124 },
  { x: 900, y: 1130, size: 110 },
];
const TOWER = { x: 540, y: 668 };

export const Scene3Background: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const frame = useCurrentFrame();
  const exit = ip(frame, [T.exit, T.end], [0, 1], EASE_IN_OUT);
  const fade = 1 - ip(frame, [T.exit, T.exit + 12], [0, 1]);

  const offState = (r: Row) => (r.offAt === null ? 0 : r.offAt < 0 ? 1 : ip(frame, [r.offAt, r.offAt + 10], [0, 1], EASE_IN_OUT));
  const offs = ROWS.map(offState);
  const perHour = ROWS.reduce((acc, r, i) => acc + r.mb * (1 - offs[i]), 0);
  const maxPerHour = ROWS.reduce((a, r) => a + r.mb, 0);

  const phoneIn = ip(frame, [0, 22], [0, 1], SPRING_POP);
  const intro = ip(frame, [0, T.intro], [0, 1], EASE_IN_OUT);
  const t0 = toggleCenter(0);

  return (
    <AbsoluteFill>
      <StepChip step={2} exitAt={T.exit} />
      <TitleArea opacity={fade}>
        <KineticTitle words={SCENE3_TEXT.title} from={T.title} stagger={3} fontSize={80} exitAt={T.exit} />
      </TitleArea>

      {/* Flux de données : applis → réseau */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: fade }}>
        <defs>
          <filter id="flowglow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {ORBIT.map((o, i) => {
          const appear = ip(frame, [T.icons + i * 4, T.icons + i * 4 + 14], [0, 1]);
          const alive = (1 - offs[i]) * appear;
          const d = `M ${o.x} ${o.y} Q ${(o.x + TOWER.x) / 2} ${Math.min(o.y, TOWER.y) - 60} ${TOWER.x} ${TOWER.y}`;
          const hot = ROWS[i].offAt !== null;
          return (
            <g key={i} opacity={alive}>
              <path d={d} fill="none" stroke={COLORS.white} strokeWidth={4} opacity={0.5} />
              <path
                d={d}
                fill="none"
                stroke={hot ? COLORS.white : COLORS.green}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray="10 34"
                strokeDashoffset={-frame * 4}
                filter="url(#flowglow)"
              />
              <path d={d} fill="none" stroke={hot ? COLORS.white : COLORS.green} strokeWidth={7} strokeLinecap="round" strokeDasharray="10 34" strokeDashoffset={-frame * 4} />
            </g>
          );
        })}
      </svg>

      {/* Symbole réseau */}
      <div style={{ position: "absolute", left: TOWER.x - 42, top: TOWER.y - 58, opacity: fade * ip(frame, [6, 18], [0, 1]) }}>
        <TowerIcon size={84} pulse={(frame / 30) % 1} />
      </div>

      {/* Téléphone central */}
      <div
        style={{
          position: "absolute",
          left: PH.x,
          top: PH.y,
          scale: `${phoneIn}`,
          opacity: fade,
          translate: `0px ${Math.sin(frame / 30) * 5}px`,
        }}
      >
        <Phone width={PH.w} screen="#F6F7F9">
          <div style={{ position: "absolute", left: 30, right: 22, top: 74 }}>
            <Label size={34} weight={800} color={COLORS.black}>
              {SCENE3_TEXT.screenTitle}
            </Label>
            <Label size={24} weight={600} color={COLORS.uiSoft} style={{ marginTop: 4 }}>
              {SCENE3_TEXT.screenSub}
            </Label>
          </div>
          {ROWS.map((r, i) => {
            const rowIn = ip(frame, [10 + i * 4, 24 + i * 4], [0, 1], EASE_OUT);
            const hot = r.offAt !== null && offs[i] < 0.5 && frame >= T.highlight;
            const pulse = hot ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;
            return (
              <div
                key={r.kind}
                style={{
                  position: "absolute",
                  left: 14,
                  right: 14,
                  top: HEAD + ROW_H * i,
                  height: ROW_H - 10,
                  borderRadius: 24,
                  background: hot ? `rgba(239,51,64,${0.06 + pulse * 0.06})` : COLORS.white,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 12px",
                  translate: `${(1 - rowIn) * 60}px 0px`,
                  opacity: rowIn,
                }}
              >
                <AppIcon kind={r.kind} size={66} dim={offs[i] * 0.8} />
                <div style={{ flex: 1 }}>
                  <Label size={28} weight={700} color={COLORS.ui}>
                    {r.name}
                  </Label>
                  {r.offAt === null ? (
                    <Label size={20} weight={700} color={COLORS.green}>
                      ✓ {SCENE3_TEXT.essential}
                    </Label>
                  ) : (
                    <Label size={20} weight={700} color={interpolateColors(offs[i], [0, 1], [COLORS.red, COLORS.uiSoft])}>
                      {offs[i] > 0.5 ? "0 Mo/h" : `+${r.mb} Mo/h`}
                    </Label>
                  )}
                </div>
                <div style={{ opacity: i === 0 ? ip(frame, [T.intro - 2, T.intro], [0, 1]) : 1, position: "relative" }}>
                  <Toggle3D off={offs[i]} width={TOG_W} />
                  {r.offAt !== null && r.offAt > 0 ? (
                    <TouchRipple x={TOG_W * 0.7} y={TOG_W * 0.28} t={ip(frame, [r.offAt - 2, r.offAt + 18], [0, 1])} color={COLORS.yellow} size={180} />
                  ) : null}
                </div>
              </div>
            );
          })}
          {/* compteur de consommation */}
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              top: HEAD + ROW_H * 5 + 12,
              borderRadius: 26,
              background: COLORS.black,
              padding: "20px 24px",
              opacity: ip(frame, [T.gauge, T.gauge + 10], [0, 1]),
            }}
          >
            <Label size={22} weight={700} color={COLORS.yellowPale}>
              {SCENE3_TEXT.meter}
            </Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 64, color: COLORS.yellow }}>
                {Math.round(perHour)}
              </span>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COLORS.white }}>Mo/h</span>
            </div>
            <div style={{ height: 14, borderRadius: 7, background: "#333", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(perHour / maxPerHour) * 100}%`,
                  height: "100%",
                  background: interpolateColors(perHour / maxPerHour, [0.1, 0.6, 1], [COLORS.green, COLORS.yellow, COLORS.red]),
                }}
              />
            </div>
          </div>
        </Phone>
      </div>

      {/* Icônes d'applis en orbite */}
      {ORBIT.map((o, i) => {
        const appear = ip(frame, [T.icons + i * 4, T.icons + i * 4 + 16], [0, 1], SPRING_POP);
        const hot = ROWS[i].offAt !== null && offs[i] < 0.5 && frame >= T.highlight;
        const isVideo = ROWS[i].kind === "video";
        // la tuile vidéo devient le lecteur de la scène 4
        const vx = isVideo ? o.x + (540 - o.x) * exit : o.x;
        const vy = isVideo ? o.y + (960 - o.y) * exit : o.y;
        const s = isVideo ? 1 + exit * (360 / o.size - 1) : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: vx - o.size / 2,
              top: vy - o.size / 2 + Math.sin(frame / 20 + i) * 6,
              scale: `${appear * s}`,
              opacity: isVideo ? 1 : fade,
              zIndex: isVideo ? 20 : 1,
            }}
          >
            {hot ? (
              <div
                style={{
                  position: "absolute",
                  inset: -14,
                  borderRadius: o.size * 0.34,
                  border: `6px solid ${COLORS.red}`,
                  opacity: 0.5 + 0.5 * Math.sin(frame / 4),
                }}
              />
            ) : null}
            <AppIcon kind={ROWS[i].kind} size={o.size} dim={isVideo ? offs[i] * 0.8 * Math.max(0, 1 - exit * 4) : offs[i] * 0.8} />
          </div>
        );
      })}

      {/* Interrupteur OFF hérité de la scène 2 : il rétrécit et se pose sur la ligne « Jeu » */}
      {frame < T.intro ? (
        <div
          style={{
            position: "absolute",
            left: 540 + (t0.x - 540) * intro,
            top: 960 + (t0.y - 960) * intro,
            translate: "-50% -50%",
          }}
        >
          <Toggle3D off={1} width={640 + (TOG_W - 640) * intro} glow={1 - intro} />
        </div>
      ) : null}

      <Flash from={0} to={10} peak={0.6} fadeIn={false} />

      {withAudio ? (
        <>
          <Sequence  layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.4} />
          </Sequence>
          <Sequence from={T.intro - 2} layout="none">
            <Audio src={staticFile("sfx/click.wav")} volume={0.7} />
          </Sequence>
          <Sequence from={T.icons} layout="none">
            <Audio src={staticFile("sfx/transfer.wav")} volume={0.35} />
          </Sequence>
          {ROWS.filter((r) => r.offAt !== null && r.offAt > 0).map((r) => (
            <Sequence key={r.kind} from={r.offAt as number} layout="none">
              <Audio src={staticFile("sfx/toggle.wav")} volume={0.7} />
            </Sequence>
          ))}
          <Sequence from={112} layout="none">
            <Audio src={staticFile("sfx/confirm.wav")} volume={0.5} />
          </Sequence>
          <Sequence from={T.exit} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.55} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
