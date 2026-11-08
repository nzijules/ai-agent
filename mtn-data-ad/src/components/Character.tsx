import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";

type Props = {
  src: string;
  /** Largeur d'affichage (px). */
  width: number;
  /** Rapport hauteur/largeur de l'asset. */
  ratio: number;
  left: number;
  top: number;
  /** 0..1 : révélation par masque (balayage du bas vers le haut, bord adouci). */
  reveal: number;
  /** Décalage de parallaxe horizontal (px). */
  parallax?: number;
  style?: React.CSSProperties;
};

/**
 * Personnage photoréaliste détouré. Animation volontairement sobre :
 * révélation par masque, respiration (micro-échelle), parallaxe et
 * lumière de contour jaune pour l'intégrer au fond MTN.
 * (Les mouvements corporels réels nécessiteraient une séquence vidéo détourée.)
 */
export const Character: React.FC<Props> = ({ src, width, ratio, left, top, reveal, parallax = 0, style }) => {
  const frame = useCurrentFrame();
  const height = width * ratio;
  const breathe = 1 + Math.sin(frame / 22) * 0.004;
  const edge = (1 - reveal) * 110; // % masqué
  const mask = `linear-gradient(to top, black ${100 - edge - 8}%, transparent ${100 - edge + 2}%)`;
  return (
    <div
      style={{
        position: "absolute",
        left: left + parallax,
        top: top + (1 - reveal) * 60,
        width,
        height,
        transformOrigin: "50% 100%",
        scale: `${breathe}`,
        maskImage: mask,
        WebkitMaskImage: mask,
        ...style,
      }}
    >
      {/* halo doux derrière le personnage (détache la silhouette du fond) */}
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "6%",
          bottom: "-10%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,241,118,0.9) 0%, rgba(255,241,118,0) 65%)",
        }}
      />
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 30px 40px rgba(110,70,0,0.35)) drop-shadow(-6px 0 10px rgba(255,229,0,0.45))",
        }}
      />
    </div>
  );
};
