import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { KineticTitle } from "../components/KineticTitle";
import { StepChip, TitleArea } from "../components/common";
import { Phone } from "../components/Phone";
import { Label } from "../components/ui";
import { AppIcon, AppKind, Magnifier } from "../icons/extra";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { EASE_IN_OUT, EASE_OUT, ip, SPRING_POP } from "../theme/timing";
import { S6_GAUGE } from "./Scene5Backups";

// ---------------------------------------------------------------------------
// SCÈNE 6 — « Surveille quelles applis épuisent ta connexion »  (6 s)
// ---------------------------------------------------------------------------
export const SCENE6_TEXT = {
  title: [
    { text: "Surveille", breakAfter: false },
    { text: "quelles", breakAfter: true },
    { text: "applis", breakAfter: false },
    { text: "épuisent", highlight: true, breakAfter: true },
    { text: "ta", breakAfter: false },
    { text: "connexion" },
  ],
  header: "Consommation · ce mois",
  used: 12.8,
  total: 20,
  categories: [
    { kind: "video" as AppKind, name: "Vidéos", go: 5.6 },
    { kind: "social" as AppKind, name: "Réseaux sociaux", go: 3.2 },
    { kind: "chat" as AppKind, name: "Messagerie", go: 1.4 },
    { kind: "doc" as AppKind, name: "Autres applis", go: 2.6 },
  ],
};

const T = { title: 6, gauge: 12, gaugeEnd: 52, rows: 44, highlight: 92, lens: 86, exit: 150, end: 180 };

const PH = { w: 600, x: 240, y: 655 };
const BEZEL = PH.w * 0.035;
// Le centre de la jauge coïncide avec l'anneau final de la scène 5.
const G = { x: S6_GAUGE.x - PH.x - BEZEL, y: S6_GAUGE.y - PH.y - BEZEL, r: S6_GAUGE.r };
const ROWS_TOP = G.y + G.r + 46;
const ROW_H = 92;

export const Scene6Usage: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const frame = useCurrentFrame();
  const fade = 1 - ip(frame, [T.exit, T.exit + 12], [0, 1]);
  const gaugeP = ip(frame, [T.gauge, T.gaugeEnd], [0, 1], EASE_IN_OUT);
  const used = SCENE6_TEXT.used * gaugeP;
  const ratio = (SCENE6_TEXT.used / SCENE6_TEXT.total) * gaugeP;
  const phoneShell = ip(frame, [0, 18], [0, 1], EASE_OUT); // la coque apparaît autour de l'anneau hérité
  const hl = ip(frame, [T.highlight, T.highlight + 10], [0, 1], EASE_OUT);

  // loupe : entre par la droite, s'arrête sur « Vidéos »
  const lens = ip(frame, [T.lens, T.lens + 20], [0, 1], SPRING_POP);
  const lensX = 1100 + (PH.x + PH.w - 250 - 1100) * lens;
  const lensY = PH.y + BEZEL + ROWS_TOP + ROW_H / 2 - 120 + Math.sin(frame / 14) * 6 * lens;

  // sortie : une ligne de connexion lumineuse traverse l'écran (devient le partage en scène 7)
  const line = ip(frame, [T.exit, T.end - 6], [0, 1], EASE_IN_OUT);

  const circ = 2 * Math.PI * (G.r - 14);
  const maxGo = 6;

  return (
    <AbsoluteFill>
      <StepChip step={5} exitAt={T.exit} />
      <TitleArea opacity={fade}>
        <KineticTitle words={SCENE6_TEXT.title} from={T.title} stagger={3} fontSize={88} exitAt={T.exit} />
      </TitleArea>

      <div style={{ position: "absolute", left: PH.x, top: PH.y, opacity: fade }}>
        <Phone width={PH.w} screen="#FFFFFF" style={{ opacity: phoneShell, scale: `${0.9 + 0.1 * phoneShell}` }}>
          <div style={{ position: "absolute", left: 30, top: 70, opacity: phoneShell }}>
            <Label size={30} weight={800} color={COLORS.black}>
              {SCENE6_TEXT.header}
            </Label>
          </div>
          {/* lignes de catégories */}
          {SCENE6_TEXT.categories.map((c, i) => {
            const appear = ip(frame, [T.rows + i * 6, T.rows + 14 + i * 6], [0, 1], EASE_OUT);
            const bar = ip(frame, [T.rows + 6 + i * 6, T.rows + 30 + i * 6], [0, 1], EASE_OUT);
            const isVideo = i === 0;
            return (
              <div
                key={c.name}
                style={{
                  position: "absolute",
                  left: 18,
                  right: 18,
                  top: ROWS_TOP + i * ROW_H,
                  height: ROW_H - 10,
                  borderRadius: 22,
                  padding: "0 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: isVideo ? `rgba(239,51,64,${0.1 * hl})` : "#F6F7F9",
                  outline: isVideo ? `4px solid rgba(239,51,64,${hl * (0.6 + 0.4 * Math.sin(frame / 4))})` : "none",
                  translate: `${(1 - appear) * 60}px 0px`,
                  opacity: appear,
                  scale: `${isVideo ? 1 + hl * 0.03 : 1}`,
                }}
              >
                <AppIcon kind={c.kind} size={58} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Label size={26} weight={800} color={COLORS.ui}>
                      {c.name}
                    </Label>
                    <Label size={26} weight={900} color={isVideo && hl > 0.5 ? COLORS.red : COLORS.ui}>
                      {(c.go * bar).toFixed(1).replace(".", ",")} Go
                    </Label>
                  </div>
                  <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: "#E4E7EC" }}>
                    <div
                      style={{
                        width: `${(c.go / maxGo) * 100 * bar}%`,
                        height: "100%",
                        borderRadius: 6,
                        background: isVideo ? COLORS.red : COLORS.yellow,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </Phone>
      </div>

      {/* Jauge circulaire (en coordonnées écran pour le raccord avec la scène 5) */}
      <div style={{ position: "absolute", left: S6_GAUGE.x - G.r, top: S6_GAUGE.y - G.r, width: G.r * 2, height: G.r * 2, opacity: fade }}>
        <svg width={G.r * 2} height={G.r * 2} style={{ position: "absolute", rotate: "-90deg" }}>
          <circle cx={G.r} cy={G.r} r={G.r - 14} fill="none" stroke={phoneShell > 0.5 ? "#EDEFF3" : "rgba(255,255,255,0.85)"} strokeWidth={28} />
          <circle
            cx={G.r}
            cy={G.r}
            r={G.r - 14}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={28}
            strokeLinecap="round"
            strokeDasharray={`${circ * ratio} ${circ}`}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.yellow} />
              <stop offset="100%" stopColor="#FF9F00" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 68, color: COLORS.black, letterSpacing: -2 }}>
            {used.toFixed(1).replace(".", ",")}
            <span style={{ fontSize: 34 }}> Go</span>
          </span>
          <Label size={22} weight={700} color={COLORS.uiSoft} style={{ opacity: ip(frame, [T.gauge + 10, T.gauge + 20], [0, 1]) }}>
            utilisés sur {SCENE6_TEXT.total} Go
          </Label>
        </div>
      </div>

      {/* Loupe 3D qui examine la consommation */}
      <div style={{ position: "absolute", left: lensX, top: lensY, opacity: fade, rotate: `${(1 - lens) * 30}deg`, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))" }}>
        <Magnifier size={260} />
      </div>

      {/* Ligne de connexion (raccord scène 7) */}
      {line > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id="lineglow">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <line x1={540 - 330 * line} y1={960} x2={540 + 330 * line} y2={960} stroke={COLORS.white} strokeWidth={22} strokeLinecap="round" filter="url(#lineglow)" />
          <line x1={540 - 330 * line} y1={960} x2={540 + 330 * line} y2={960} stroke={COLORS.white} strokeWidth={10} strokeLinecap="round" />
        </svg>
      ) : null}

      {withAudio ? (
        <>
          <Sequence from={T.gauge} layout="none">
            <Audio src={staticFile("sfx/digital-spin.wav")} volume={0.45} />
          </Sequence>
          {SCENE6_TEXT.categories.map((c, i) => (
            <Sequence key={c.name} from={T.rows + i * 6} layout="none">
              <Audio src={staticFile("sfx/pop.wav")} volume={0.3} />
            </Sequence>
          ))}
          <Sequence from={T.lens} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.4} />
          </Sequence>
          <Sequence from={T.highlight} layout="none">
            <Audio src={staticFile("sfx/alert.wav")} volume={0.4} />
          </Sequence>
          <Sequence from={T.exit} layout="none">
            <Audio src={staticFile("sfx/riser.wav")} volume={0.4} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
