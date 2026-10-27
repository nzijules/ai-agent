import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { MEDIA } from "../config/assets";
import { ECRAN } from "../config/script";
import { EASE_IN, EASE_IN_OUT, prog, useLayout } from "../components/anim";
import { Block3D } from "../components/Block";
import { Presse } from "../components/Presse";
import { MediaFill, Mention, Reveal } from "../components/ui";

/** A — Accroche : un bloc réel en gros plan, puis la presse. */
export const SceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, vertical, safe } = useLayout();
  const t = ECRAN.A;

  // Chute du bloc (0 → 0,45 s), impact, puis lente rotation.
  const chute = prog(frame, fps, 0, 0.45, EASE_IN);
  const impact = frame >= 0.45 * fps && frame < 0.45 * fps + 4 ? (frame % 2 ? 6 : -6) : 0;
  const rot = -34 + prog(frame, fps, 0.5, 6, EASE_IN_OUT) * 12;
  // Révélation de la presse par une fenêtre rectangulaire (4,0 → 4,8 s).
  const fenetre = prog(frame, fps, 4.0, 0.8, EASE_IN_OUT);
  const sortieTextes = 3.9;

  const blocW = vertical ? 760 : 620;
  const blocX = vertical ? W / 2 : W * 0.7;
  const blocY = vertical ? H * 0.5 : H * 0.52;
  const presseW = vertical ? 520 : 520;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, #34302C 0%, ${COLORS.anthracite} 70%)` }}>
      {/* Bloc héros */}
      <AbsoluteFill
        style={{
          transform: `translateY(${impact}px) scale(${1 + prog(frame, fps, 0.5, 6.5) * 0.06 - fenetre * 0.25})`,
          opacity: 1 - fenetre,
        }}
      >
        {MEDIA.blocHero.src ? (
          <MediaFill slot={MEDIA.blocHero} />
        ) : (
          <div
            style={{
              position: "absolute",
              left: blocX - blocW / 2,
              top: blocY - blocW / 4.2 + (chute - 1) * H,
            }}
          >
            <Block3D largeur={blocW} rotY={rot} rotX={-18} seed={11} />
            <div
              style={{
                position: "absolute",
                left: blocW * 0.1,
                top: blocW / 2.1 + 60,
                width: blocW * 0.8,
                height: 40,
                background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
                opacity: chute,
              }}
            />
          </div>
        )}
      </AbsoluteFill>

      {/* Presse révélée */}
      <AbsoluteFill
        style={{
          clipPath: `inset(${(1 - fenetre) * 42}% ${(1 - fenetre) * 30}% ${(1 - fenetre) * 42}% ${(1 - fenetre) * 30}%)`,
          opacity: fenetre > 0 ? 1 : 0,
          background: COLORS.anthraciteClair,
          justifyContent: "center",
          alignItems: vertical ? "center" : "flex-end",
          paddingRight: vertical ? 0 : 260,
        }}
      >
        {MEDIA.presse.src ? (
          <MediaFill slot={MEDIA.presse} />
        ) : (
          <>
            <Presse
              largeur={presseW}
              etat={{
                tiroir: 0,
                remplissage: 1,
                plateau: prog(frame, fps, 5.2, 1.2, EASE_IN_OUT),
                ejection: 0,
                evacuation: 0,
              }}
              style={{ scale: `${1.1 - fenetre * 0.1}`, marginTop: vertical ? 40 : 0 }}
            />
            {fenetre > 0.6 ? <Mention texte="Illustration schématique" /> : null}
          </>
        )}
      </AbsoluteFill>

      {/* Textes */}
      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? safe.top + 10 : safe.top + 120,
          fontFamily: FONT,
          color: COLORS.blancCasse,
          fontSize: vertical ? 92 : 96,
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: -1.5,
        }}
      >
        <Reveal de={0.5} jusqua={2.7}>{t.l1}</Reveal>
        <Reveal de={0.85} jusqua={2.7}>
          <span style={{ color: COLORS.lateriteClair }}>{t.l2}</span>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? safe.top + 10 : safe.top + 120,
          fontFamily: FONT,
          fontSize: vertical ? 110 : 100,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        <Reveal de={3.0} jusqua={sortieTextes + 2.4}>
          <span style={{ color: COLORS.lateriteClair }}>{t.terre}</span>
        </Reveal>
        <Reveal de={4.5}>
          <span style={{ color: COLORS.blancCasse }}>{t.precision}</span>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
