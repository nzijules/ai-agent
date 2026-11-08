import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { SAFE } from "../theme/safeZones";
import { clamp, EASE_OUT, SPRING_POP } from "../theme/timing";
import { MTNBackground } from "./MTNBackground";

// ---------------------------------------------------------------------------
// Mise en page commune (TikTok) : rangée « logo + pastille d'astuce » sous la
// barre d'onglets TikTok, puis le titre.
// ---------------------------------------------------------------------------
export const LAYOUT = {
  brandRowTop: SAFE.top + 16, // 226
  titleTop: SAFE.top + 140, // 350
  logoWidth: 190,
  logoRight: 44,
};

/** Logo officiel MTN (fourni par le client) — public/brand/mtn-logo.png, ratio 2:1. */
export const BRAND_LOGO = "brand/mtn-logo.png";

/** Logo en haut à droite : apparition en « pop » puis reflet périodique. */
export const BrandLogo: React.FC<{ appearAt?: number }> = ({ appearAt = 4 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], { ...clamp, easing: SPRING_POP });
  const shine = ((frame - appearAt) % 150) / 30; // reflet toutes les 5 s
  const w = LAYOUT.logoWidth;
  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.brandRowTop,
        right: LAYOUT.logoRight,
        width: w,
        height: w / 2,
        scale: `${p}`,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        filter: "drop-shadow(0 8px 14px rgba(120,80,0,0.35))",
      }}
    >
      <Img src={staticFile(BRAND_LOGO)} style={{ width: "100%", height: "100%" }} />
      {shine > 0 && shine < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `url(${staticFile(BRAND_LOGO)})`,
            WebkitMaskImage: `url(${staticFile(BRAND_LOGO)})`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${shine * 140 - 40}%, rgba(255,255,255,0.75) ${shine * 140 - 20}%, rgba(255,255,255,0) ${shine * 140}%)`,
          }}
        />
      ) : null}
    </div>
  );
};

/** Pastille « ASTUCE n/5 » alignée à gauche sur la rangée du logo. */
export const StepChip: React.FC<{ step: number; total?: number; from?: number; exitAt?: number }> = ({
  step,
  total = 5,
  from = 2,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + 14], [0, 1], { ...clamp, easing: SPRING_POP });
  const out = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 10], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: LAYOUT.brandRowTop + 12,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 26px 12px 14px",
        borderRadius: 50,
        background: COLORS.black,
        translate: `${(1 - p) * -60}px 0px`,
        opacity: p * (1 - out),
        boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          background: COLORS.yellow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 30,
          color: COLORS.black,
          rotate: `${(1 - p) * -180}deg`,
        }}
      >
        {step}
      </div>
      <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 800, fontSize: 32, color: COLORS.white, letterSpacing: 1 }}>
        ASTUCE {step}/{total}
      </span>
    </div>
  );
};

/** Conteneur de titre centré à la hauteur standard. */
export const TitleArea: React.FC<{ children: React.ReactNode; top?: number; opacity?: number }> = ({
  children,
  top = LAYOUT.titleTop,
  opacity = 1,
}) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity }}>
    {children}
  </div>
);

/** Flash lumineux jaune (raccord entre scènes). */
export const Flash: React.FC<{ from: number; to: number; peak?: number; fadeIn?: boolean }> = ({
  from,
  to,
  peak = 0.6,
  fadeIn = true,
}) => {
  const frame = useCurrentFrame();
  const o = fadeIn
    ? interpolate(frame, [from, to], [0, peak], clamp)
    : interpolate(frame, [from, to], [peak, 0], { ...clamp, easing: EASE_OUT });
  return <AbsoluteFill style={{ backgroundColor: COLORS.yellowBright, opacity: o, pointerEvents: "none" }} />;
};

/** Habillage complet pour prévisualiser une scène seule (fond + logo). */
export const Stage: React.FC<{ children: React.ReactNode; seed?: number }> = ({ children, seed = 22 }) => (
  <AbsoluteFill>
    <MTNBackground seed={seed} lightUpFrom={0} lightUpDuration={1} />
    {children}
    <BrandLogo appearAt={0} />
  </AbsoluteFill>
);
