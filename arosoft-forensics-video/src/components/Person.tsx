import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { CHARACTERS } from "../config/video";
import { C, SKIN } from "../theme";

/**
 * Buste de personnage africain, illustration vectorielle semi-réaliste animée
 * (respiration, clignements, regard, éclairage d'écran).
 * Si un rendu (PNG détouré) est fourni dans CHARACTERS, il remplace l'illustration.
 */
export type PersonVariant = "investigator" | "citizen";

export const Person: React.FC<{
  variant: PersonVariant;
  width?: number;
  lookX?: number;
  lookY?: number;
  tilt?: number;
  screenLight?: number;
  lightColor?: string;
  style?: React.CSSProperties;
}> = ({ variant, width = 600, lookX = 0, lookY = 0, tilt = 0, screenLight = 0.6, lightColor = C.blue, style }) => {
  const frame = useCurrentFrame();
  const override = CHARACTERS[variant];
  const breath = Math.sin(frame / 38) * 3;

  if (override) {
    return (
      <div style={{ width, ...style }}>
        <Img src={staticFile(override)} style={{ width: "100%", translate: `0px ${breath}px` }} />
      </div>
    );
  }

  const id = variant;
  // Clignement déterministe : toutes les ~3,3 s, 5 images.
  const cycle = variant === "investigator" ? 101 : 89;
  const ph = (frame + (variant === "investigator" ? 17 : 0)) % cycle;
  const blink = ph < 5 ? 1 - Math.abs(ph - 2.5) / 2.5 : 0;
  const lid = 1 - blink * 0.92;
  const ex = lookX * 6;
  const ey = lookY * 4;

  const clothing = variant === "investigator" ? ["#1B2A3F", "#0B1320"] : ["#2B5A55", "#12302C"];
  const hair = "#0E0806";

  const eye = (cx: number) => (
    <g>
      <path d={`M${cx - 22} 332 Q${cx} 316 ${cx + 22} 332 Q${cx} 344 ${cx - 22} 332 Z`} fill="#D9CBBE" opacity={0.92} />
      <g style={{ transformOrigin: `${cx}px 332px`, transformBox: "view-box" as const, transform: `scaleY(${lid})` }}>
        <circle cx={cx + ex} cy={331 + ey} r={10} fill="#1A0E08" />
        <circle cx={cx + ex} cy={331 + ey} r={5} fill="#050302" />
        <circle cx={cx + ex + 3.5} cy={327 + ey} r={2.6} fill="#fff" opacity={0.85} />
      </g>
      {/* paupière supérieure */}
      <path
        d={`M${cx - 24} 331 Q${cx} ${314 + blink * 18} ${cx + 24} 331 L${cx + 24} 312 L${cx - 24} 312 Z`}
        fill={`url(#skin-${id})`}
      />
      <path d={`M${cx - 23} 331 Q${cx} ${316 + blink * 16} ${cx + 23} 331`} stroke="#1B0F09" strokeWidth={3} fill="none" />
    </g>
  );

  return (
    <div style={{ width, ...style }}>
      <svg viewBox="0 0 600 760" width="100%" style={{ overflow: "visible", display: "block" }}>
        <defs>
          <radialGradient id={`skin-${id}`} cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor={SKIN.warm} />
            <stop offset="55%" stopColor={SKIN.mid} />
            <stop offset="100%" stopColor={SKIN.shadow} />
          </radialGradient>
          <linearGradient id={`neck-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SKIN.shadow} />
            <stop offset="100%" stopColor={SKIN.deep} />
          </linearGradient>
          <linearGradient id={`cloth-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={clothing[0]} />
            <stop offset="100%" stopColor={clothing[1]} />
          </linearGradient>
          <linearGradient id={`light-${id}`} x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor={lightColor} stopOpacity={0.9} />
            <stop offset="60%" stopColor={lightColor} stopOpacity={0.15} />
            <stop offset="100%" stopColor={lightColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`rim-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.75} />
            <stop offset="12%" stopColor={C.cyan} stopOpacity={0} />
            <stop offset="88%" stopColor={C.cyan} stopOpacity={0} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0.45} />
          </linearGradient>
          <pattern id={`curl-${id}`} width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.1" fill="#2A1A12" opacity="0.55" />
            <circle cx="7.5" cy="7" r="1.6" fill="#000" opacity="0.5" />
          </pattern>
          <clipPath id={`head-${id}`}>
            <path d="M300 200 C365 200 405 250 405 320 C405 392 380 440 345 470 C325 487 275 487 255 470 C220 440 195 392 195 320 C195 250 235 200 300 200 Z" />
          </clipPath>
        </defs>

        {/* Buste */}
        <g transform={`translate(0 ${breath})`}>
          <path d="M30 770 C40 630 140 568 232 552 L368 552 C460 568 560 630 570 770 Z" fill={`url(#cloth-${id})`} />
          {variant === "investigator" ? (
            <>
              <path d="M232 552 L300 640 L368 552" fill="none" stroke="#0A111C" strokeWidth={8} />
              <path d="M262 556 L300 760 M338 556 L300 760" stroke={C.blue} strokeWidth={4} opacity={0.6} />
              <rect x="276" y="660" width="48" height="66" rx="6" fill="#DCE8F5" opacity={0.9} />
              <rect x="283" y="670" width="34" height="16" rx="3" fill={C.blue} opacity={0.8} />
              <path d="M284 698h32M284 708h22" stroke="#4A5A70" strokeWidth={3} />
            </>
          ) : (
            <path d="M236 552 Q300 610 364 552" fill="none" stroke="#0E2522" strokeWidth={10} />
          )}
          <path d="M30 770 C40 630 140 568 232 552 L368 552 C460 568 560 630 570 770 Z" fill={`url(#light-${id})`} opacity={screenLight * 0.35} style={{ mixBlendMode: "screen" }} />
        </g>

        <g transform={`rotate(${tilt} 300 520) translate(0 ${breath * 0.6})`}>
          {/* Cheveux volumineux (arrière) */}
          {variant === "citizen" && (
            <>
              <ellipse cx="300" cy="262" rx="168" ry="150" fill={hair} />
              <ellipse cx="300" cy="262" rx="168" ry="150" fill={`url(#curl-${id})`} />
            </>
          )}
          {/* Cou */}
          <path d="M256 455 L256 560 Q300 588 344 560 L344 455 Z" fill={`url(#neck-${id})`} />
          {/* Oreilles */}
          <ellipse cx="197" cy="338" rx="15" ry="27" fill={SKIN.mid} />
          <ellipse cx="403" cy="338" rx="15" ry="27" fill={SKIN.deep} />
          {variant === "citizen" && (
            <>
              <circle cx="197" cy="372" r="7" fill="none" stroke="#E2B34A" strokeWidth={3} />
              <circle cx="403" cy="372" r="7" fill="none" stroke="#E2B34A" strokeWidth={3} />
            </>
          )}
          {/* Tête */}
          <path
            d="M300 200 C365 200 405 250 405 320 C405 392 380 440 345 470 C325 487 275 487 255 470 C220 440 195 392 195 320 C195 250 235 200 300 200 Z"
            fill={`url(#skin-${id})`}
          />
          <g clipPath={`url(#head-${id})`}>
            {/* modelé : ombres de pommettes et tempe */}
            <ellipse cx="392" cy="350" rx="40" ry="110" fill={SKIN.shadow} opacity={0.45} />
            <ellipse cx="300" cy="455" rx="70" ry="30" fill={SKIN.shadow} opacity={0.35} />
            <ellipse cx="250" cy="372" rx="24" ry="14" fill="#9A6040" opacity={0.25} />
            <ellipse cx="350" cy="372" rx="24" ry="14" fill="#9A6040" opacity={0.18} />
            {/* barbe */}
            {variant === "investigator" && (
              <>
                <path d="M215 380 C225 450 262 482 300 484 C338 482 375 450 385 380 C372 430 345 450 300 452 C255 450 228 430 215 380 Z" fill={hair} opacity={0.88} />
                <path d="M262 410 Q300 396 338 410 Q300 404 262 410 Z" fill={hair} stroke={hair} strokeWidth={8} strokeLinejoin="round" opacity={0.9} />
                <rect x="190" y="370" width="220" height="120" fill={`url(#curl-${id})`} opacity={0.35} />
              </>
            )}
            {/* éclairage d'écran par le bas + liseré */}
            <rect x="180" y="190" width="240" height="300" fill={`url(#light-${id})`} opacity={screenLight * 0.28} style={{ mixBlendMode: "screen" }} />
            <rect x="180" y="190" width="240" height="300" fill={`url(#rim-${id})`} style={{ mixBlendMode: "screen" }} />
          </g>

          {/* Sourcils */}
          <path d="M232 304 Q256 292 282 302" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M318 302 Q344 292 368 304" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" />
          {eye(258)}
          {eye(342)}
          {/* Nez */}
          <path d="M300 338 Q296 368 286 384" stroke={SKIN.shadow} strokeWidth={3} fill="none" opacity={0.6} />
          <path d="M276 388 Q284 400 300 400 Q316 400 324 388 Q318 380 300 382 Q282 380 276 388 Z" fill={SKIN.shadow} opacity={0.55} />
          <ellipse cx="288" cy="391" rx="5" ry="3" fill="#1A0D07" />
          <ellipse cx="312" cy="391" rx="5" ry="3" fill="#1A0D07" />
          {/* Bouche */}
          <path d="M268 424 Q284 414 300 418 Q316 414 332 424 Q300 428 268 424 Z" fill="#4A2419" />
          <path d="M268 424 Q300 446 332 424 Q300 430 268 424 Z" fill="#6E3A2C" />
          <path d="M286 433 Q300 437 314 433" stroke="#8B5040" strokeWidth={2} fill="none" opacity={0.6} />

          {/* Cheveux (avant) */}
          {variant === "investigator" ? (
            <>
              <path d="M197 318 C190 232 238 190 300 190 C362 190 410 232 403 318 C396 272 372 240 300 236 C228 240 204 272 197 318 Z" fill={hair} />
              <path d="M197 318 C190 232 238 190 300 190 C362 190 410 232 403 318 C396 272 372 240 300 236 C228 240 204 272 197 318 Z" fill={`url(#curl-${id})`} />
            </>
          ) : (
            <>
              <path d="M200 330 C180 220 240 170 300 172 C360 170 420 220 400 330 C392 268 360 236 300 232 C240 236 208 268 200 330 Z" fill={hair} />
              <path d="M200 330 C180 220 240 170 300 172 C360 170 420 220 400 330 C392 268 360 236 300 232 C240 236 208 268 200 330 Z" fill={`url(#curl-${id})`} />
            </>
          )}

          {/* Lunettes */}
          {variant === "investigator" && (
            <g>
              <rect x="222" y="310" width="72" height="50" rx="14" fill={C.cyan} fillOpacity={0.1} stroke="#0A0D12" strokeWidth={5} />
              <rect x="306" y="310" width="72" height="50" rx="14" fill={C.cyan} fillOpacity={0.1} stroke="#0A0D12" strokeWidth={5} />
              <path d="M294 330 Q300 324 306 330" stroke="#0A0D12" strokeWidth={5} fill="none" />
              <path d="M222 326 L198 320 M378 326 L402 320" stroke="#0A0D12" strokeWidth={5} />
              {/* reflet d'écran défilant */}
              <rect x={230 + ((frame * 0.8) % 50)} y="316" width="10" height="38" fill={C.cyan} opacity={0.25 * screenLight} rx="4" />
              <rect x={314 + ((frame * 0.8) % 50)} y="316" width="10" height="38" fill={C.cyan} opacity={0.25 * screenLight} rx="4" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
