import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { KineticTitle } from "../components/KineticTitle";
import { LAYOUT, TitleArea } from "../components/common";
import { Phone } from "../components/Phone";
import { TouchHand, TouchRipple } from "../components/TouchHand";
import { Label } from "../components/ui";
import { Badge3D } from "../icons";
import { ShareGlyph } from "../icons/extra";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { EASE_IN_OUT, EASE_OUT, ip, SPRING_POP } from "../theme/timing";

// ---------------------------------------------------------------------------
// SCÈNE 7 — PARTAGE  « Partage l'info à un ami dont la connexion finit trop vite »  (9 s)
// ---------------------------------------------------------------------------
export const SCENE7_TEXT = {
  hook: [{ text: "Partage", breakAfter: false }, { text: "l'info !", highlight: true }],
  final: [
    { text: "Partage", breakAfter: false },
    { text: "l'info", breakAfter: true },
    { text: "à", breakAfter: false },
    { text: "un", breakAfter: false },
    { text: "ami", breakAfter: false },
    { text: "dont", breakAfter: true },
    { text: "la", breakAfter: false },
    { text: "connexion", breakAfter: true },
    { text: "finit", breakAfter: false },
    { text: "trop vite", highlight: true },
  ],
  postAuthor: "Astuces Data",
  postTitle: "5 astuces pour économiser ta data",
  tips: ["Coupe les mises à jour auto", "Limite l'arrière-plan", "Baisse la qualité vidéo", "Sauvegardes en Wi-Fi", "Surveille ta conso"],
  share: "Partager",
  cta: "Envoie-la à un ami",
};

// Temps clés de base (frames) ; ajustés à la durée réelle de la scène dans le composant.
const T0 = { glyph: 0, glyphPlaced: 34, phone: 10, cards: 30, hand: 92, press: 112, spread: 118, finalOut: 160, finalTitle: 176, end: 270 };

const PH = { x: 130, y: 560, w: 480 };
const SCR = { x: PH.x + PH.w * 0.035, y: PH.y + PH.w * 0.035, w: PH.w * 0.93 };
const BTN = { x: SCR.x + SCR.w / 2, y: SCR.y + 830 }; // centre du bouton « Partager » (écran)
const ICON = { x: 800, y: 650, size: 210 };

// Petits smartphones d'amis (réseau de partage)
const FRIENDS = [
  { x: 860, y: 920, fx: 160, fy: 1560 },
  { x: 820, y: 1200, fx: 340, fy: 1690 },
  { x: 900, y: 1440, fx: 540, fy: 1740 },
  { x: 150, y: 1600, fx: 740, fy: 1690 },
  { x: 480, y: 1690, fx: 920, fy: 1560 },
  { x: 760, y: 1680, fx: 540, fy: 1520 },
];

const MiniPhone: React.FC<{ glow: number }> = ({ glow }) => (
  <div
    style={{
      width: 74,
      height: 136,
      borderRadius: 18,
      background: "linear-gradient(135deg,#4a4d55,#0a0a0c)",
      padding: 5,
      boxShadow: `0 12px 24px rgba(80,50,0,0.35), 0 0 ${30 * glow}px ${10 * glow}px rgba(255,255,255,${0.8 * glow})`,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 14,
        background: glow > 0.5 ? COLORS.yellow : "#2a2d34",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {glow > 0.5 ? <ShareGlyph size={48} /> : null}
    </div>
  </div>
);

export const Scene7Share: React.FC<{ withAudio?: boolean; dur?: number }> = ({ withAudio = true, dur = 270 }) => {
  // Calé sur la voix-off (voir VOIX-OFF.md)
  const T = { ...T0, hand: 110, press: 132, spread: 138, finalOut: 172, finalTitle: 186, end: dur };
  const frame = useCurrentFrame();

  // la ligne de la scène 6 se replie en symbole de partage, puis le symbole rejoint sa place
  const glyphDraw = ip(frame, [0, 22], [0, 1], EASE_OUT);
  const place = ip(frame, [22, T.glyphPlaced], [0, 1], EASE_IN_OUT);
  const gx = 540 + (ICON.x - 540) * place;
  const gy = 960 + (ICON.y - 960) * place;
  const gs = 300 + (ICON.size - 300) * place;
  const lineCollapse = ip(frame, [0, 14], [1, 0], EASE_IN_OUT);

  const phoneIn = ip(frame, [T.phone, T.phone + 22], [0, 1], SPRING_POP);
  const press = ip(frame, [T.press - 4, T.press, T.press + 8, T.press + 14], [0, 1, 1, 0]);
  const reach = ip(frame, [T.hand, T.press - 3, T.press + 14, T.press + 32], [0, 1, 1, 0], [EASE_OUT, (t) => t, EASE_IN_OUT]);
  const spread = ip(frame, [T.spread, T.spread + 40], [0, 1], EASE_OUT);

  // composition finale : le téléphone et l'icône s'écartent, le message prend toute la place
  const out = ip(frame, [T.finalOut, T.finalOut + 20], [0, 1], EASE_IN_OUT);
  const hookOut = T.finalOut - 6;
  const converge = ip(frame, [T.finalOut, T.finalOut + 30], [0, 1], EASE_IN_OUT);

  return (
    <AbsoluteFill>
      {/* Accroche courte */}
      <TitleArea top={LAYOUT.titleTop - 10}>
        <KineticTitle words={SCENE7_TEXT.hook} from={20} stagger={5} fontSize={104} exitAt={hookOut} />
      </TitleArea>

      {/* Réseau : lignes lumineuses vers les smartphones d'amis */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="netglow">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        {FRIENDS.map((f, i) => {
          const p = ip(spread, [i * 0.07, i * 0.07 + 0.5], [0, 1]);
          const sx = BTN.x + (540 - BTN.x) * converge;
          const sy = BTN.y + (1340 - BTN.y) * converge;
          const tx = f.x + (f.fx - f.x) * out;
          const ty = f.y + (f.fy - f.y) * out;
          const ex = sx + (tx - sx) * p;
          const ey = sy + (ty - sy) * p;
          return (
            <g key={i} opacity={p > 0 ? 1 : 0}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={COLORS.white} strokeWidth={12} strokeLinecap="round" filter="url(#netglow)" />
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={COLORS.white} strokeWidth={5} strokeLinecap="round" strokeDasharray="14 18" strokeDashoffset={-frame * 3} />
            </g>
          );
        })}
        {/* onde de propagation */}
        {[0, 1, 2].map((i) => {
          const t = ip(frame, [T.press + i * 10, T.press + 40 + i * 10], [0, 1], EASE_OUT);
          if (t <= 0 || t >= 1) return null;
          return <circle key={i} cx={BTN.x} cy={BTN.y} r={40 + t * 700} fill="none" stroke={COLORS.white} strokeWidth={8 * (1 - t) + 1} opacity={1 - t} />;
        })}
      </svg>

      {/* Smartphones d'amis */}
      {FRIENDS.map((f, i) => {
        const p = ip(spread, [i * 0.07 + 0.35, i * 0.07 + 0.6], [0, 1], SPRING_POP);
        return (
          <div key={i} style={{ position: "absolute", left: f.x + (f.fx - f.x) * out - 37, top: f.y + (f.fy - f.y) * out - 68, scale: `${p * (1 - out * 0.15)}`, rotate: `${(i % 2 ? 1 : -1) * 8}deg`, translate: `0px ${Math.sin(frame / 16 + i) * 6}px` }}>
            <MiniPhone glow={ip(spread, [i * 0.07 + 0.4, i * 0.07 + 0.62], [0, 1])} />
          </div>
        );
      })}

      {/* Téléphone : publication « 5 astuces » */}
      <div
        style={{
          position: "absolute",
          left: PH.x,
          top: PH.y,
          scale: `${phoneIn * (1 - out * 0.45)}`,
          translate: `${-out * 360}px ${out * 380}px`,
          opacity: 1 - out,
        }}
      >
        <Phone width={PH.w} screen="#F6F7F9">
          {/* en-tête du post */}
          <div style={{ position: "absolute", left: 22, right: 22, top: 70, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: COLORS.yellow, border: `3px solid ${COLORS.black}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShareGlyph size={36} />
            </div>
            <div>
              <Label size={24} weight={800} color={COLORS.black}>
                {SCENE7_TEXT.postAuthor}
              </Label>
              <Label size={18} weight={600} color={COLORS.uiSoft}>
                à l'instant
              </Label>
            </div>
          </div>
          {/* guide */}
          <div
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: 150,
              padding: "20px 18px",
              borderRadius: 26,
              background: COLORS.yellow,
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              opacity: ip(frame, [T.cards - 8, T.cards], [0, 1]),
              scale: `${ip(frame, [T.cards - 8, T.cards + 6], [0.85, 1], SPRING_POP)}`,
            }}
          >
            <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 34, color: COLORS.black, lineHeight: 1.05, display: "block" }}>
              {SCENE7_TEXT.postTitle}
            </span>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {SCENE7_TEXT.tips.map((t, i) => {
                const a = ip(frame, [T.cards + 6 + i * 6, T.cards + 18 + i * 6], [0, 1], SPRING_POP);
                return (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 16,
                      background: COLORS.white,
                      translate: `${(1 - a) * (i % 2 ? 80 : -80)}px 0px`,
                      rotate: `${(1 - a) * (i % 2 ? 6 : -6)}deg`,
                      opacity: ip(a, [0, 0.3], [0, 1]),
                    }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 17, background: COLORS.black, color: COLORS.yellow, fontFamily: FONT, fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <Label size={21} weight={700} color={COLORS.ui}>
                      {t}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
          {/* bouton Partager */}
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 830 - 40,
              height: 80,
              borderRadius: 40,
              background: COLORS.black,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              boxShadow: `0 10px 24px rgba(0,0,0,0.3), 0 0 ${press * 40}px ${press * 10}px ${COLORS.yellow}`,
              scale: `${ip(frame, [T.cards + 40, T.cards + 52], [0, 1], SPRING_POP) * (1 - press * 0.06)}`,
            }}
          >
            <ShareGlyph size={46} node={COLORS.yellow} color={COLORS.yellow} />
            <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 34, color: COLORS.yellow }}>{SCENE7_TEXT.share}</span>
          </div>
        </Phone>
      </div>

      {/* Main qui appuie sur « Partager » */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
        <TouchRipple x={BTN.x + 60} y={BTN.y} t={ip(frame, [T.press, T.press + 22], [0, 1])} color={COLORS.yellow} size={280} />
        <TouchHand x={BTN.x + 60} y={BTN.y} reach={reach} press={press} displayWidth={660} travel={700} />
      </div>

      {/* Icône 3D de partage (jaune & noire) */}
      <div
        style={{
          position: "absolute",
          left: gx - gs / 2,
          top: gy - gs / 2,
          width: gs,
          height: gs,
          scale: `${1 - out * 0.4 + (frame >= T.press && frame < T.press + 12 ? ip(frame, [T.press, T.press + 6, T.press + 12], [0, 0.15, 0]) : 0)}`,
          translate: `${out * 60}px ${-out * 40}px`,
          opacity: 1 - out,
        }}
      >
        <Badge3D size={gs} color={COLORS.black} style={{ opacity: place }}>
          <span />
        </Badge3D>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShareGlyph size={gs * 0.78} progress={glyphDraw} color={place > 0.5 ? COLORS.yellow : COLORS.black} node={COLORS.yellow} />
        </div>
      </div>

      {/* Ligne héritée de la scène 6 qui se replie */}
      {lineCollapse > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <line x1={540 - 330 * lineCollapse} y1={960} x2={540 + 330 * lineCollapse} y2={960} stroke={COLORS.white} strokeWidth={10} strokeLinecap="round" />
        </svg>
      ) : null}

      {/* ===== Composition finale ===== */}
      <TitleArea top={560}>
        <KineticTitle words={SCENE7_TEXT.final} from={T.finalTitle} stagger={3} fontSize={100} />
      </TitleArea>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1210,
          display: "flex",
          justifyContent: "center",
          opacity: ip(frame, [T.finalTitle + 40, T.finalTitle + 50], [0, 1]),
          translate: `0px ${ip(frame, [T.finalTitle + 40, T.finalTitle + 56], [30, 0], EASE_OUT)}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "18px 40px 18px 22px",
            borderRadius: 60,
            background: COLORS.black,
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            scale: `${ip(frame, [T.finalTitle + 40, T.finalTitle + 54], [0.7, 1], SPRING_POP) * (1 + Math.sin(frame / 10) * 0.015)}`,
          }}
        >
          <div style={{ width: 72, height: 72, borderRadius: 36, background: COLORS.yellow, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShareGlyph size={56} />
          </div>
          <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 44, color: COLORS.white }}>{SCENE7_TEXT.cta}</span>
        </div>
      </div>

      {/* Lignes lumineuses qui convergent vers la composition finale */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[
          [0, 300],
          [1080, 420],
          [0, 1500],
          [1080, 1700],
          [540, 1920],
          [200, 0],
        ].map(([x, y], i) => {
          const t = ip(frame, [T.finalOut + i * 3, T.finalOut + 26 + i * 3], [0, 1], EASE_IN_OUT);
          if (t <= 0 || t >= 1) return null;
          const tx = 540;
          const ty = 900;
          const hx = x + (tx - x) * t;
          const hy = y + (ty - y) * t;
          const tailT = Math.max(0, t - 0.25);
          return (
            <line key={i} x1={x + (tx - x) * tailT} y1={y + (ty - y) * tailT} x2={hx} y2={hy} stroke={COLORS.white} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
          );
        })}
      </svg>
      <AbsoluteFill style={{ backgroundColor: COLORS.white, opacity: ip(frame, [T.finalOut + 26, T.finalOut + 30, T.finalOut + 44], [0, 0.45, 0]), pointerEvents: "none" }} />

      {withAudio ? (
        <>
          <Sequence  layout="none">
            <Audio src={staticFile("sfx/sparkle.wav")} volume={0.45} />
          </Sequence>
          <Sequence from={T.cards} layout="none">
            <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
          </Sequence>
          <Sequence from={T.press} layout="none">
            <Audio src={staticFile("sfx/click.wav")} volume={0.9} />
          </Sequence>
          <Sequence from={T.spread} layout="none">
            <Audio src={staticFile("sfx/transfer.wav")} volume={0.55} />
          </Sequence>
          <Sequence from={T.spread + 20} layout="none">
            <Audio src={staticFile("sfx/sparkle.wav")} volume={0.4} />
          </Sequence>
          <Sequence from={T.finalOut} layout="none">
            <Audio src={staticFile("sfx/riser.wav")} volume={0.5} />
          </Sequence>
          <Sequence from={T.finalOut + 28} layout="none">
            <Audio src={staticFile("sfx/signature.wav")} volume={0.7} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
