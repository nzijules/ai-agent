import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS } from "../theme/colors";

// Géométrie de l'asset public/characters/hand-point.png (main détourée).
// HAND_TIP = position du bout de l'index dans l'image, en pixels.
export const HAND_ASSET = {
  src: "characters/hand-point.png",
  width: 1480,
  height: 530,
  tipX: 12,
  tipY: 38,
};

type Props = {
  /** Point visé (bout du doigt) dans le repère du parent. */
  x: number;
  y: number;
  /** 0 = main hors champ, 1 = doigt sur la cible. */
  reach: number;
  /** 0..1 : appui (la main avance légèrement et s'écrase). */
  press?: number;
  /** Largeur d'affichage de l'image. */
  displayWidth?: number;
  /** Distance d'entrée (px) depuis la droite. */
  travel?: number;
  rotate?: number;
};

/**
 * Main photoréaliste détourée qui entre depuis la droite et appuie sur une
 * cible. L'ombre portée se resserre quand le doigt touche l'écran.
 */
export const TouchHand: React.FC<Props> = ({
  x,
  y,
  reach,
  press = 0,
  displayWidth = 560,
  travel = 700,
  rotate = -8,
}) => {
  const s = displayWidth / HAND_ASSET.width;
  const tipX = HAND_ASSET.tipX * s;
  const tipY = HAND_ASSET.tipY * s;
  const offX = (1 - reach) * travel + press * -6;
  const offY = (1 - reach) * 160 + press * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x - tipX + offX,
        top: y - tipY + offY,
        width: displayWidth,
        height: HAND_ASSET.height * s,
        transformOrigin: `${tipX}px ${tipY}px`,
        rotate: `${rotate * (1 - reach) + rotate * 0.25}deg`,
        scale: `${1 - press * 0.03}`,
        pointerEvents: "none",
      }}
    >
      {/* ombre portée sur l'interface */}
      <Img
        src={staticFile(HAND_ASSET.src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: `brightness(0) blur(${14 - press * 8}px)`,
          opacity: 0.28 + press * 0.12,
          translate: `${26 - press * 16}px ${34 - press * 22}px`,
        }}
      />
      <Img src={staticFile(HAND_ASSET.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
};

/** Onde tactile concentrique au point de contact. */
export const TouchRipple: React.FC<{ x: number; y: number; t: number; color?: string; size?: number }> = ({
  x,
  y,
  t,
  color = COLORS.white,
  size = 220,
}) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      {[0, 0.18].map((d, i) => {
        const p = Math.max(0, Math.min(1, (t - d) / (1 - d)));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - (size * p) / 2,
              top: y - (size * p) / 2,
              width: size * p,
              height: size * p,
              borderRadius: "50%",
              border: `${6 * (1 - p) + 1}px solid ${color}`,
              opacity: (1 - p) * 0.9,
              boxShadow: `0 0 30px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};
