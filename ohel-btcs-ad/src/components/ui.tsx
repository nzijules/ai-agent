import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { COLORS, FONT } from "../config/brand";
import type { MediaSlot } from "../config/assets";
import { EASE_IN, EASE_OUT, prog, useLayout } from "./anim";

/**
 * Texte révélé par un masque rectangulaire (glissement vertical court).
 * `de` / `jusqua` en secondes, relatifs à la scène.
 */
export const Reveal: React.FC<{
  de: number;
  jusqua?: number;
  duree?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  direction?: "haut" | "gauche";
}> = ({ de, jusqua, duree = 0.55, children, style, direction = "haut" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pIn = prog(frame, fps, de, duree);
  const pOut = jusqua === undefined ? 0 : prog(frame, fps, jusqua, 0.4, EASE_IN);
  const off = (1 - pIn) * 105 + pOut * -105;
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          transform: direction === "haut" ? `translateY(${off}%)` : `translateX(${-off}%)`,
          opacity: pIn > 0 ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Indicateur d'étape du procédé : 01 → 04, quatre blocs. */
export const Chapitre: React.FC<{ numero: number; titre: string }> = ({ numero, titre }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe, vertical } = useLayout();
  const p = prog(frame, fps, 0.15, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        top: safe.top - (vertical ? 90 : 20),
        left: safe.left,
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: FONT,
        color: COLORS.blancCasse,
        opacity: p,
        transform: `translateX(${(1 - p) * -30}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 34,
              height: 16,
              background: i <= numero ? COLORS.laterite : "transparent",
              border: `2px solid ${i <= numero ? COLORS.laterite : "rgba(243,238,230,0.35)"}`,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase" }}>
        <span style={{ color: COLORS.lateriteClair }}>0{numero}</span>
        <span style={{ opacity: 0.45, margin: "0 12px" }}>/</span>
        {titre}
      </div>
      <div
        style={{
          width: vertical ? 160 : 360,
          height: 2,
          background: "linear-gradient(90deg, rgba(243,238,230,0.45), transparent)",
          scale: `${prog(frame, fps, 0.4, 0.8)} 1`,
          transformOrigin: "0 50%",
        }}
      />
    </div>
  );
};

/** Mention discrète sur visuel. */
export const Mention: React.FC<{ texte: string; style?: React.CSSProperties }> = ({ texte, style }) => {
  const { safe } = useLayout();
  return (
    <div
      style={{
        position: "absolute",
        right: safe.right,
        top: safe.top - 30,
        fontFamily: FONT,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: 1,
        color: "rgba(243,238,230,0.85)",
        background: "rgba(28,29,32,0.55)",
        padding: "6px 12px",
        ...style,
      }}
    >
      {texte}
    </div>
  );
};

/** Mention adaptée à la nature du visuel (illustration / photo). */
export const MentionMedia: React.FC<{ slot: MediaSlot; style?: React.CSSProperties }> = ({ slot, style }) => {
  if (!slot.src) return null;
  if (slot.nature === "illustration") return <Mention texte="Illustration non contractuelle" style={style} />;
  if (slot.legende) return <Mention texte={slot.legende} style={style} />;
  return null;
};

/** Affiche un visuel en plein cadre (image ou vidéo) avec léger travelling. */
export const MediaFill: React.FC<{ slot: MediaSlot; derive?: number; style?: React.CSSProperties }> = ({
  slot,
  derive = 40,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!slot.src) return null;
  const t = frame / durationInFrames;
  const common: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `translateY(${(0.5 - t) * derive}px) scale(1.06)`,
    ...style,
  };
  return slot.type === "video" ? (
    <Video src={staticFile(slot.src)} muted style={common} />
  ) : (
    <Img src={staticFile(slot.src)} style={common} />
  );
};

/** Cartouche visible en mode maquette quand un visuel manque. */
export const VisuelManquant: React.FC<{ titre: string; prompt?: string }> = ({ titre, prompt }) => (
  <AbsoluteFill
    style={{
      background: `repeating-linear-gradient(135deg, ${COLORS.anthraciteClair} 0 26px, ${COLORS.anthracite} 26px 52px)`,
      justifyContent: "center",
      alignItems: "center",
      fontFamily: FONT,
      color: "rgba(243,238,230,0.75)",
      textAlign: "center",
    }}
  >
    <div style={{ border: "3px dashed rgba(243,238,230,0.4)", padding: "36px 48px" }}>
      <div style={{ fontSize: 30, letterSpacing: 6, fontWeight: 700 }}>VISUEL À FOURNIR</div>
      <div style={{ fontSize: 40, marginTop: 12, fontWeight: 500 }}>{titre}</div>
      {prompt ? <div style={{ fontSize: 26, marginTop: 12, opacity: 0.7 }}>Prompt {prompt} — docs/05</div> : null}
    </div>
  </AbsoluteFill>
);

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>',
)}")`;

/**
 * Fond « atelier » des étapes : dégradé anthracite, lumière chaude localisée,
 * trame de calepinage qui s'estompe vers les bords, vignettage et grain fin.
 * `numero` affiche le numéro d'étape en filigrane.
 */
export const Trame: React.FC<{ opacite?: number; lumiere?: [number, number]; numero?: number }> = ({
  opacite = 0.06,
  lumiere = [50, 45],
  numero,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe } = useLayout();
  const [lx, ly] = lumiere;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #25262A 0%, ${COLORS.anthracite} 55%, #121315 100%)` }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at ${lx}% ${ly}%, rgba(217,138,82,0.16), rgba(217,138,82,0.04) 55%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(243,238,230,${opacite}) 2px, transparent 2px), linear-gradient(90deg, rgba(243,238,230,${opacite}) 2px, transparent 2px)`,
          backgroundSize: "189px 90px",
          backgroundPosition: `0 ${frame * 0.15}px`,
          maskImage: `radial-gradient(ellipse 75% 65% at ${lx}% ${ly}%, black 20%, transparent 80%)`,
        }}
      />
      {numero ? (
        <div
          style={{
            position: "absolute",
            right: vertical ? safe.right - 40 : safe.right - 20,
            bottom: vertical ? safe.bottom - 60 : -60,
            fontFamily: FONT,
            fontSize: vertical ? 560 : 520,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -20,
            color: "transparent",
            WebkitTextStroke: "3px rgba(217,138,82,0.16)",
            opacity: prog(frame, fps, 0.1, 0.8),
            transform: `translateY(${(1 - prog(frame, fps, 0.1, 1.2)) * 60}px)`,
          }}
        >
          0{numero}
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          opacity: 0.07,
          mixBlendMode: "overlay",
          backgroundPosition: `${(frame % 3) * 37}px ${(frame % 3) * 53}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const sortie = (frame: number, fps: number, total: number, duree = 0.35) =>
  1 - prog(frame, fps, total / fps - duree, duree, EASE_IN);

export { EASE_OUT };
