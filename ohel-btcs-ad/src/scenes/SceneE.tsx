import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { MEDIA } from "../config/assets";
import { ECRAN } from "../config/script";
import { EASE_IN, EASE_IN_OUT, prog, useLayout } from "../components/anim";
import { BlockFace } from "../components/Block";
import { Presse } from "../components/Presse";
import { Chapitre, MediaFill, Mention, Reveal, Trame } from "../components/ui";

/** Instant de l'impact de compression (s, relatif à la scène) — caler l'effet sonore ici. */
export const IMPACT_E = 5.6;

export const SceneE: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe, W } = useLayout();
  const t = ECRAN.E;

  const tiroir = prog(frame, fps, 0.3, 0.8, EASE_IN_OUT) - prog(frame, fps, 2.8, 0.6, EASE_IN_OUT);
  const remplissage = prog(frame, fps, 1.1, 1.5, EASE_IN_OUT);
  const plateau = prog(frame, fps, 3.6, 1.0, EASE_IN_OUT) + prog(frame, fps, 4.6, IMPACT_E - 4.6, EASE_IN);
  const dt = frame - IMPACT_E * fps;
  const secousse = dt >= 0 && dt < 5 ? [7, -6, 4, -2, 1][dt] : 0;
  const ejection = prog(frame, fps, 6.8, 1.2, EASE_IN_OUT);
  const evacuation = prog(frame, fps, 8.2, 1.0, EASE_IN_OUT);
  const recul = prog(frame, fps, 9.8, 0.8, EASE_IN_OUT);

  const presseW = vertical ? 600 : 500;
  const presseX = vertical ? (W - presseW) / 2 : safe.left + 60;
  const presseY = vertical ? safe.top + 60 : safe.top - 30;
  const echelle = presseW / 600;
  const etape = (de: number, a: number, label: string) => (
    <Reveal de={de} jusqua={a} style={{ position: "absolute", left: 0, top: 0 }}>
      <div style={{ fontSize: vertical ? 50 : 46, fontWeight: 800, textTransform: "uppercase", letterSpacing: 3 }}>{label}</div>
    </Reveal>
  );

  // Rangée finale : répétition et alignement.
  const rangee = 5;
  const bw = vertical ? 168 : 136;
  const bh = bw / 2.1;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: COLORS.blancCasse }}>
      <Trame />
      {MEDIA.presse.src ? (
        <AbsoluteFill style={{ opacity: 0.9 }}>
          <MediaFill slot={MEDIA.presse} />
        </AbsoluteFill>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              left: presseX,
              top: presseY,
              // En 9:16, la presse s'efface pour laisser place au titre.
              opacity: vertical ? 1 - recul : 1,
              transform: vertical ? `translateY(${recul * -220}px)` : undefined,
            }}
          >
            <Presse largeur={presseW} etat={{ tiroir, remplissage, plateau, ejection, evacuation, secousse }} />
          </div>
          <Mention texte="Illustration schématique" />
        </>
      )}
      <Chapitre numero={3} titre={t.chapitre} />

      {/* Ligne d'impact */}
      <div
        style={{
          position: "absolute",
          left: presseX - 40,
          width: presseW + 80,
          top: presseY + 640 * echelle,
          height: 4,
          background: COLORS.lateriteClair,
          opacity: dt >= 0 && dt < 8 ? 1 - dt / 8 : 0,
        }}
      />

      {/* Étapes */}
      <div
        style={{
          position: "absolute",
          left: vertical ? safe.left : W * 0.6,
          top: vertical ? presseY + 900 * echelle + 24 : safe.top + 160,
          height: 70,
          width: 900,
        }}
      >
        {etape(0.5, 3.3, t.remplissage)}
        {etape(3.6, 6.4, t.compression)}
        {etape(6.8, 9.6, t.demoulage)}
      </div>

      {/* Titre et rangée de blocs */}
      <div
        style={{
          position: "absolute",
          left: vertical ? safe.left : W * 0.6,
          top: vertical ? safe.top + 280 : safe.top + 300,
          fontSize: vertical ? 96 : 88,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        <Reveal de={10.2}>La précision</Reveal>
        <Reveal de={10.45}>
          <span style={{ color: COLORS.lateriteClair }}>prend forme.</span>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: vertical ? safe.left : W * 0.6,
          top: vertical ? safe.top + 560 : safe.top + 560,
          display: "flex",
          gap: 10,
        }}
      >
        {Array.from({ length: rangee }).map((_, i) => {
          const p = prog(frame, fps, 10.6 + i * 0.22, 0.4, EASE_IN_OUT);
          return (
            <div key={i} style={{ transform: `translateX(${(1 - p) * 120}px)`, opacity: p }}>
              <BlockFace w={bw} h={bh} seed={20 + i} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
