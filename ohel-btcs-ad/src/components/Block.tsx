import React from "react";
import { texture, TextureKind } from "./textures";

/**
 * Bloc BTCS en volume (CSS 3D). Proportions de face reprises des photos de
 * référence (≈ 2,1 : 1), faces lisses, sans alvéoles ni emboîtement :
 * à recaler sur les dimensions réelles fournies par OHEL.
 */
export const BLOCK_RATIO = 2.1;

export const Block3D: React.FC<{
  largeur: number;
  rotX?: number;
  rotY?: number;
  profondeur?: number;
  kind?: TextureKind;
  seed?: number;
  /** 0 = sec, 1 = humide (assombrissement léger). */
  humide?: number;
  style?: React.CSSProperties;
}> = ({ largeur, rotX = -16, rotY = -30, profondeur, kind = "bloc", seed = 3, humide = 0, style }) => {
  const w = largeur;
  const h = largeur / BLOCK_RATIO;
  const d = profondeur ?? h * 1.02;
  const face = (extra: React.CSSProperties, shade: number): React.CSSProperties => ({
    position: "absolute",
    backgroundImage: texture(kind, seed, 420),
    backgroundSize: `${Math.max(w, 300)}px auto`,
    boxShadow: `inset 0 0 ${w * 0.02}px rgba(0,0,0,0.35), inset 0 0 0 9999px rgba(${shade > 0 ? "255,235,210" : "0,0,0"},${Math.abs(shade) + humide * 0.18})`,
    backfaceVisibility: "hidden",
    ...extra,
  });
  return (
    <div style={{ width: w, height: h, perspective: w * 4, ...style }}>
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        <div style={face({ width: w, height: h, transform: `translateZ(${d / 2}px)` }, 0)} />
        <div
          style={face(
            { width: w, height: d, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)` },
            0.1,
          )}
        />
        <div
          style={face(
            { width: d, height: h, left: (w - d) / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)` },
            -0.32,
          )}
        />
        <div
          style={face(
            { width: d, height: h, left: (w - d) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)` },
            -0.18,
          )}
        />
      </div>
    </div>
  );
};

/** Face de bloc à plat (vue de face), utilisée pour les piles et les murs. */
export const BlockFace: React.FC<{
  w: number;
  h: number;
  seed?: number;
  kind?: TextureKind;
  humide?: number;
  style?: React.CSSProperties;
}> = ({ w, h, seed = 1, kind = "bloc", humide = 0, style }) => (
  <div
    style={{
      width: w,
      height: h,
      backgroundImage: texture(kind, seed, 300),
      backgroundPosition: `${(seed * 97) % 300}px ${(seed * 53) % 300}px`,
      boxShadow: `inset 0 ${h * 0.06}px ${h * 0.04}px rgba(255,230,200,0.12), inset 0 -${h * 0.08}px ${h * 0.06}px rgba(0,0,0,0.28), inset 0 0 0 9999px rgba(45,18,6,${humide * 0.38})`,
      ...style,
    }}
  />
);
