import React from "react";
import { AbsoluteFill, Img, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { KineticTitle } from "../components/KineticTitle";
import { Flash, StepChip, TitleArea } from "../components/common";
import { TouchRipple } from "../components/TouchHand";
import { Label } from "../components/ui";
import { CheckMark } from "../icons";
import { AppIcon, CloudShape, GearIcon } from "../icons/extra";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { SAFE } from "../theme/safeZones";
import { EASE_IN_OUT, EASE_OUT, ip, SPRING_POP } from "../theme/timing";

// ---------------------------------------------------------------------------
// SCÈNE 4 — « Baisse la qualité des vidéos »  (6 s)
// Les consommations sont des ordres de grandeur moyens (varient selon l'appli).
// ---------------------------------------------------------------------------
export const SCENE4_TEXT = {
  title: [
    { text: "Baisse", breakAfter: false },
    { text: "la", breakAfter: false },
    { text: "qualité", breakAfter: true },
    { text: "des", breakAfter: false },
    { text: "vidéos", highlight: true },
  ],
  menuTitle: "Qualité vidéo",
  options: [
    { label: "HD · 1080p", data: "≈ 2,5 Go / heure" },
    { label: "SD · 720p", data: "≈ 1,2 Go / heure" },
    { label: "Éco data · 480p", data: "≈ 0,6 Go / heure" },
  ],
  videoTitle: "Match amical · Résumé",
  gauge: "Data consommée par heure de vidéo",
  saving: "≈ 4× moins de data",
  note: "*estimations moyennes",
};

const T = { title: 8, hands: 0, gear: 36, menu: 42, select: 86, gauge: 92, exit: 148, end: 180 };

// Asset mains + téléphone (public/characters/hands-phone.png, 1305×1033) : écran transparent.
const HANDS = { w: 1305, h: 1033, sx: 470, sy: 22, sw: 372, sh: 816 };
const SCALE = 1.19;
const SCREEN = { x: 540 - (HANDS.sw * SCALE) / 2, y: 820, w: HANDS.sw * SCALE, h: HANDS.sh * SCALE };
const IMG = { left: SCREEN.x - HANDS.sx * SCALE, top: SCREEN.y - HANDS.sy * SCALE };
const VIDEO_H = SCREEN.w * 0.5625;

/** Match de foot fictif animé (SVG). */
const FootballClip: React.FC<{ frame: number; blur: number }> = ({ frame, blur }) => {
  const w = 400;
  const h = 225;
  const players = [
    { c: COLORS.red, x: 90, y: 70, a: 0.0 },
    { c: COLORS.red, x: 160, y: 150, a: 1.2 },
    { c: COLORS.red, x: 230, y: 95, a: 2.1 },
    { c: COLORS.white, x: 260, y: 160, a: 0.7 },
    { c: COLORS.white, x: 300, y: 80, a: 1.9 },
    { c: COLORS.white, x: 200, y: 50, a: 2.8 },
  ];
  const t = frame / 18;
  const ballX = 200 + Math.sin(t * 0.9) * 110;
  const ballY = 112 + Math.sin(t * 1.7) * 55;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ filter: `blur(${blur}px)` }}>
      {new Array(8).fill(0).map((_, i) => (
        <rect key={i} x={i * 50 - ((frame * 1.5) % 50)} y={0} width={25} height={h} fill="#2E9E4F" />
      ))}
      <rect x={0} y={0} width={w} height={h} fill="#258A43" opacity={0.55} />
      <g stroke="rgba(255,255,255,0.85)" strokeWidth={2.5} fill="none" transform={`translate(${-((frame * 1.5) % 400) * 0.2},0)`}>
        <line x1={200} y1={0} x2={200} y2={h} />
        <circle cx={200} cy={112} r={34} />
        <rect x={-2} y={60} width={50} height={105} />
        <rect x={352} y={60} width={50} height={105} />
      </g>
      {players.map((p, i) => {
        const px = p.x + Math.sin(t + p.a) * 26 + (ballX - p.x) * 0.15;
        const py = p.y + Math.cos(t * 1.3 + p.a) * 16 + (ballY - p.y) * 0.1;
        return (
          <g key={i}>
            <ellipse cx={px + 3} cy={py + 12} rx={9} ry={3} fill="rgba(0,0,0,0.3)" />
            <rect x={px - 6} y={py - 8} width={12} height={18} rx={5} fill={p.c} />
            <circle cx={px} cy={py - 12} r={5} fill="#3b2416" />
          </g>
        );
      })}
      <circle cx={ballX} cy={ballY} r={5} fill="white" stroke="#222" strokeWidth={1} />
    </svg>
  );
};

export const Scene4VideoQuality: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const frame = useCurrentFrame();
  const fade = 1 - ip(frame, [T.exit, T.exit + 14], [0, 1]);

  const handsIn = ip(frame, [T.hands, T.hands + 22], [0, 1], EASE_OUT);
  const tileMorph = ip(frame, [0, 18], [0, 1], EASE_IN_OUT);
  const videoReveal = ip(frame, [8, 22], [0, 1], EASE_OUT);
  const menuIn = ip(frame, [T.menu, T.menu + 16], [0, 1], SPRING_POP);
  const sel = ip(frame, [T.select, T.select + 8], [0, 1], EASE_OUT); // 0 = HD, 1 = 480p
  const gaugeP = ip(frame, [T.gauge, T.gauge + 24], [0, 1], EASE_IN_OUT);
  const playPulse = ip(frame, [T.select + 4, T.select + 10, T.select + 20], [1, 1.35, 1], EASE_OUT);
  const cloud = ip(frame, [T.exit + 4, T.end], [0, 1], EASE_OUT);

  const videoCenter = { x: SCREEN.x + SCREEN.w / 2, y: SCREEN.y + 70 + VIDEO_H / 2 };

  return (
    <AbsoluteFill>
      <StepChip step={3} exitAt={T.exit} />
      <TitleArea opacity={fade}>
        <KineticTitle words={SCENE4_TEXT.title} from={T.title} stagger={4} fontSize={96} exitAt={T.exit} />
      </TitleArea>

      {/* Jauge comparative de consommation */}
      <div
        style={{
          position: "absolute",
          left: SAFE.left + 20,
          right: 1080 - SAFE.right + 20,
          top: 600,
          padding: "18px 26px",
          borderRadius: 30,
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 16px 34px rgba(90,60,0,0.22)",
          opacity: ip(frame, [24, 34], [0, 1]) * fade,
          translate: `0px ${ip(frame, [24, 38], [30, 0], EASE_OUT)}px`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Label size={24} weight={700} color={COLORS.uiSoft}>
            {SCENE4_TEXT.gauge}
          </Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
          <div style={{ flex: 1, height: 30, borderRadius: 15, background: "#E4E7EC", overflow: "hidden" }}>
            <div
              style={{
                width: `${100 - gaugeP * 76}%`,
                height: "100%",
                borderRadius: 15,
                background: `linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0) 60%), ${interpolateColors(gaugeP, [0, 1], [COLORS.red, COLORS.green])}`,
              }}
            />
          </div>
          <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 38, color: COLORS.black, minWidth: 170, textAlign: "right" }}>
            {(2.5 - gaugeP * 1.9).toFixed(1).replace(".", ",")} Go/h
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <Label size={22} weight={600} color={COLORS.uiSoft}>
            {SCENE4_TEXT.note}
          </Label>
          <Label size={26} weight={800} color={COLORS.green} style={{ opacity: ip(frame, [T.gauge + 18, T.gauge + 26], [0, 1]) }}>
            {SCENE4_TEXT.saving}
          </Label>
        </div>
      </div>

      {/* ===== Écran (sous les mains) ===== */}
      <div
        style={{
          position: "absolute",
          left: SCREEN.x,
          top: SCREEN.y,
          width: SCREEN.w,
          height: SCREEN.h,
          borderRadius: 44,
          overflow: "hidden",
          background: "#0E0F12",
          // déborde sous la coque pour éviter tout liseré
          outline: "10px solid #0E0F12",
          translate: `0px ${(1 - handsIn) * 500}px`,
          opacity: fade,
        }}
      >
        {/* lecteur vidéo */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 70,
            width: SCREEN.w,
            height: VIDEO_H,
            overflow: "hidden",
            clipPath: `inset(${(1 - videoReveal) * 50}% ${(1 - videoReveal) * 50}% round 12px)`,
          }}
        >
          <FootballClip frame={frame} blur={sel * 0.7} />
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 12,
              padding: "4px 12px",
              borderRadius: 8,
              background: COLORS.red,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 20,
              color: COLORS.white,
            }}
          >
            ● EN DIRECT
          </div>
          <div
            style={{
              position: "absolute",
              right: 14,
              top: 12,
              padding: "4px 12px",
              borderRadius: 8,
              background: sel > 0.5 ? COLORS.yellow : "rgba(0,0,0,0.6)",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 20,
              color: sel > 0.5 ? COLORS.black : COLORS.white,
              scale: `${sel > 0.5 ? ip(frame, [T.select + 2, T.select + 10], [1.6, 1], SPRING_POP) : 1}`,
            }}
          >
            {sel > 0.5 ? "480p" : "HD"}
          </div>
          {/* contrôles */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 56, background: "linear-gradient(0deg, rgba(0,0,0,0.75), rgba(0,0,0,0))" }} />
          <div style={{ position: "absolute", left: 14, bottom: 14, width: 30, height: 30, scale: `${playPulse}` }}>
            <svg viewBox="0 0 100 100" width={30} height={30}>
              <rect x={20} y={14} width={20} height={72} rx={6} fill="white" />
              <rect x={60} y={14} width={20} height={72} rx={6} fill="white" />
            </svg>
          </div>
          <div style={{ position: "absolute", left: 60, right: 64, bottom: 26, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.3)" }}>
            <div style={{ width: `${30 + frame * 0.15}%`, height: "100%", borderRadius: 3, background: COLORS.yellow }} />
          </div>
          <div style={{ position: "absolute", right: 14, bottom: 10 }}>
            <GearIcon size={38} rotation={ip(frame, [T.gear, T.gear + 14], [0, 120], EASE_OUT)} />
          </div>
          <TouchRipple x={SCREEN.w - 33} y={VIDEO_H - 29} t={ip(frame, [T.gear, T.gear + 16], [0, 1])} color={COLORS.yellow} size={120} />
        </div>

        {/* infos vidéo */}
        <div style={{ position: "absolute", left: 22, right: 22, top: 70 + VIDEO_H + 16, opacity: videoReveal }}>
          <Label size={28} weight={800} color={COLORS.white}>
            {SCENE4_TEXT.videoTitle}
          </Label>
          <Label size={20} weight={600} color="#9AA0AA">
            12 k vues · il y a 2 h
          </Label>
        </div>

        {/* menu de qualité */}
        <div
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            top: 70 + VIDEO_H + 104,
            borderRadius: 28,
            background: "#1C1E24",
            padding: "20px 16px 14px",
            transformOrigin: "50% 0%",
            scale: `${menuIn}`,
            opacity: ip(menuIn, [0, 0.3], [0, 1]),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingLeft: 8 }}>
            <GearIcon size={26} color={COLORS.yellow} />
            <Label size={26} weight={800} color={COLORS.white}>
              {SCENE4_TEXT.menuTitle}
            </Label>
          </div>
          {SCENE4_TEXT.options.map((o, i) => {
            const appear = ip(frame, [T.menu + 6 + i * 5, T.menu + 18 + i * 5], [0, 1], EASE_OUT);
            const active = i === 0 ? 1 - sel : i === 2 ? sel : 0;
            const isEco = i === 2;
            return (
              <div
                key={o.label}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 12px",
                  marginTop: 8,
                  borderRadius: 18,
                  background: isEco ? `rgba(255,203,5,${sel})` : active ? "rgba(255,255,255,0.08)" : "transparent",
                  translate: `${(1 - appear) * 40}px 0px`,
                  opacity: appear,
                  scale: `${isEco ? ip(frame, [T.select, T.select + 4, T.select + 12], [1, 0.96, 1]) : 1}`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    border: `4px solid ${isEco && sel > 0.5 ? COLORS.black : active > 0.5 ? COLORS.yellow : "#6B7280"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {active > 0.5 ? (
                    <div style={{ width: 16, height: 16, borderRadius: 8, background: isEco ? COLORS.black : COLORS.yellow }} />
                  ) : null}
                </div>
                <div style={{ flex: 1 }}>
                  <Label size={25} weight={800} color={isEco && sel > 0.5 ? COLORS.black : COLORS.white}>
                    {o.label}
                  </Label>
                  <Label size={20} weight={600} color={isEco && sel > 0.5 ? "#3a3000" : "#9AA0AA"}>
                    {o.data}
                  </Label>
                </div>
                {isEco ? (
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: COLORS.black, scale: `${ip(frame, [T.select + 6, T.select + 16], [0, 1], SPRING_POP)}` }}>
                    <CheckMark size={40} color={COLORS.yellow} progress={ip(frame, [T.select + 8, T.select + 18], [0, 1])} />
                  </div>
                ) : null}
                {isEco ? <TouchRipple x={200} y={36} t={ip(frame, [T.select - 2, T.select + 18], [0, 1])} color={COLORS.yellow} size={240} /> : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mains photoréalistes (écran transparent : l'interface passe dessous, les pouces dessus) */}
      <Img
        src={staticFile("characters/hands-phone.png")}
        style={{
          position: "absolute",
          left: IMG.left,
          top: IMG.top,
          width: HANDS.w * SCALE,
          height: HANDS.h * SCALE,
          translate: `0px ${(1 - handsIn) * 500 + Math.sin(frame / 25) * 4}px`,
          opacity: fade,
          filter: "drop-shadow(0 30px 40px rgba(110,70,0,0.35))",
        }}
      />

      {/* La tuile vidéo de la scène 3 se transforme en lecteur */}
      {tileMorph < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 540 + (videoCenter.x - 540) * tileMorph - 180,
            top: 960 + (videoCenter.y - 960) * tileMorph - 180,
            scale: `${1 - tileMorph * 0.6}`,
            opacity: 1 - tileMorph,
          }}
        >
          <AppIcon kind="video" size={360} />
        </div>
      ) : null}

      {/* Raccord vers la scène 5 : un nuage se forme au centre */}
      {cloud > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 350,
            top: 960 - 217,
            scale: `${cloud}`,
            opacity: ip(cloud, [0, 0.3], [0, 1]),
            filter: "drop-shadow(0 30px 50px rgba(110,70,0,0.3))",
          }}
        >
          <CloudShape width={700} />
        </div>
      ) : null}

      <Flash from={0} to={8} peak={0.35} fadeIn={false} />

      {withAudio ? (
        <>
          <Sequence  layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.45} />
          </Sequence>
          <Sequence from={T.gear} layout="none">
            <Audio src={staticFile("sfx/click.wav")} volume={0.8} />
          </Sequence>
          <Sequence from={T.menu} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.3} />
          </Sequence>
          <Sequence from={T.select} layout="none">
            <Audio src={staticFile("sfx/click.wav")} volume={0.9} />
          </Sequence>
          <Sequence from={T.select + 6} layout="none">
            <Audio src={staticFile("sfx/confirm.wav")} volume={0.6} />
          </Sequence>
          <Sequence from={T.gauge} layout="none">
            <Audio src={staticFile("sfx/power-down.wav")} volume={0.35} />
          </Sequence>
          <Sequence from={T.exit + 4} layout="none">
            <Audio src={staticFile("sfx/pop.wav")} volume={0.45} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
