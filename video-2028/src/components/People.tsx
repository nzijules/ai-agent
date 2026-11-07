import React from "react";
import { C } from "../lib/theme";

type Hair = "short" | "bun" | "afro" | "braids" | "fade";

const HairShape: React.FC<{ hair: Hair; cx: number; cy: number; r: number; color: string }> = ({
  hair,
  cx,
  cy,
  r,
  color,
}) => {
  switch (hair) {
    case "afro":
      return <circle cx={cx} cy={cy - r * 0.15} r={r * 1.28} fill={color} />;
    case "bun":
      return (
        <g fill={color}>
          <ellipse cx={cx} cy={cy - r * 0.12} rx={r * 1.04} ry={r * 1.0} />
          <circle cx={cx} cy={cy - r * 1.05} r={r * 0.48} />
        </g>
      );
    case "braids":
      return (
        <g fill={color}>
          <ellipse cx={cx} cy={cy - r * 0.1} rx={r * 1.06} ry={r * 1.02} />
          {[-0.7, -0.35, 0, 0.35, 0.7].map((k) => (
            <rect key={k} x={cx + k * r - r * 0.13} y={cy} width={r * 0.26} height={r * 1.6} rx={r * 0.13} />
          ))}
        </g>
      );
    case "fade":
      return <ellipse cx={cx} cy={cy - r * 0.18} rx={r * 0.98} ry={r * 0.86} fill={color} />;
    default:
      return <ellipse cx={cx} cy={cy - r * 0.12} rx={r * 1.02} ry={r * 0.95} fill={color} />;
  }
};

/** Collaborateur assis vu de dos (open space), avec écran devant lui. */
export const SeatedBack: React.FC<{
  skin?: string;
  hair?: Hair;
  shirt?: string;
  screen?: string; // couleur de lueur d'écran
  screenOn?: number; // 0..1
  width?: number;
  id: string;
  noScreen?: boolean;
}> = ({ skin = C.skin[0], hair = "short", shirt = "#1E2A44", screen = C.cyan, screenOn = 0.4, width = 220, id, noScreen }) => (
  <svg viewBox="0 0 220 260" width={width} height={(width * 260) / 220} style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id={`rim-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={screen} stopOpacity={0.32 * screenOn} />
        <stop offset="0.45" stopColor={screen} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`scr-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={screen} stopOpacity={0.25 + 0.6 * screenOn} />
        <stop offset="1" stopColor={C.blue} stopOpacity={0.15 + 0.5 * screenOn} />
      </linearGradient>
    </defs>
    {!noScreen && (
      <g>
        {/* écran */}
        <rect x="30" y="10" width="160" height="100" rx="8" fill="#0B1222" stroke="#2A3A5C" strokeWidth="3" />
        <rect x="37" y="17" width="146" height="86" rx="4" fill={`url(#scr-${id})`} />
        <ellipse cx="110" cy="60" rx="140" ry="90" fill={screen} opacity={0.12 * screenOn} />
        <rect x="102" y="110" width="16" height="22" fill="#1A2440" />
        {/* bureau */}
        <rect x="0" y="130" width="220" height="12" rx="4" fill="#1A2338" />
      </g>
    )}
    {/* buste */}
    <path d="M40 260 C40 200 62 176 110 172 C158 176 180 200 180 260 Z" fill={shirt} />
    <path d="M40 260 C40 200 62 176 110 172 C158 176 180 200 180 260 Z" fill={`url(#rim-${id})`} />
    {/* nuque + tête */}
    <rect x="97" y="150" width="26" height="30" rx="10" fill={skin} />
    <ellipse cx="110" cy="138" rx="30" ry="34" fill={skin} />
    <HairShape hair={hair} cx={110} cy={134} r={30} color="#120C0A" />
    <ellipse cx="110" cy="128" rx="30" ry="34" fill={screen} opacity={0.1 * screenOn} />
  </svg>
);

/** Tracé du profil (tête + épaules), regard vers la droite. viewBox 600 × 800. */
export const PROFILE_PATH =
  "M0 800 C18 724 112 684 196 652 C204 628 206 610 204 596 C150 572 112 500 112 410 " +
  "C112 300 182 196 300 184 C380 178 440 214 458 292 C462 312 462 332 466 350 " +
  "C470 366 482 392 498 428 C508 448 516 462 512 474 C508 484 494 486 484 488 " +
  "C482 496 490 506 488 514 C486 520 478 522 476 526 C482 532 486 540 484 548 " +
  "C482 556 472 560 466 562 C470 584 468 606 452 622 C430 640 400 644 380 640 " +
  "C376 670 380 712 392 744 C430 764 482 780 540 800 Z";

/** Portrait de profil cinématographique, éclairé par l'écran (lumière cyan à droite). */
export const ProfilePortrait: React.FC<{
  id: string;
  width?: number;
  skin?: string;
  rim?: string;
  light?: number;
  suit?: string;
}> = ({ id, width = 900, skin = "#4A2E20", rim = C.cyan, light = 1, suit = "#0F1626" }) => (
  <svg viewBox="0 0 600 800" width={width} height={(width * 800) / 600} style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id={`face-${id}`} x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor={skin} />
        <stop offset="0.35" stopColor="#2A1A12" />
        <stop offset="1" stopColor="#0A0706" />
      </linearGradient>
      <linearGradient id={`rimmask-${id}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.8" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id={`rm-${id}`}>
        <rect width="600" height="800" fill={`url(#rimmask-${id})`} />
      </mask>
      <clipPath id={`clip-${id}`}>
        <path d={PROFILE_PATH} />
      </clipPath>
      <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    <path d={PROFILE_PATH} fill={`url(#face-${id})`} />
    <g clipPath={`url(#clip-${id})`}>
      {/* costume */}
      <path d="M0 800 C18 724 112 684 196 652 L300 690 C330 720 360 760 380 800 Z" fill={suit} />
      <path d="M392 744 C430 764 482 780 540 800 L420 800 C404 780 396 762 392 744 Z" fill="#E8EEF7" opacity="0.85" />
      <path d="M300 690 L392 744 L420 800 L380 800 Z" fill="#0B111E" />
      {/* cheveux courts */}
      <path
        d="M112 410 C108 300 182 190 300 180 C384 172 446 214 456 296 C430 260 396 240 350 236 C290 232 250 262 232 320 C214 376 200 420 160 446 C136 458 116 444 112 410 Z"
        fill="#0B0807"
      />
      {/* oreille */}
      <ellipse cx="248" cy="420" rx="22" ry="38" fill="#1C120C" />
      {/* lumière d'écran sur le visage */}
      <ellipse cx="560" cy="440" rx="200" ry="300" fill={rim} opacity={0.16 * light} filter={`url(#glow-${id})`} />
      {/* œil */}
      <path d="M420 372 C432 366 446 366 454 372 C446 378 432 380 420 372 Z" fill="#0A0605" />
      <circle cx="447" cy="372" r="2.6" fill={rim} opacity={0.9 * light} />
      <path d="M414 352 C428 344 446 344 460 350" stroke="#0A0605" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
    {/* liseré de lumière */}
    <path d={PROFILE_PATH} fill="none" stroke={rim} strokeWidth="5" mask={`url(#rm-${id})`} opacity={0.95 * light} />
    <path
      d={PROFILE_PATH}
      fill="none"
      stroke={rim}
      strokeWidth="16"
      mask={`url(#rm-${id})`}
      opacity={0.35 * light}
      filter={`url(#glow-${id})`}
    />
  </svg>
);

/** Silhouette debout, vue de dos (bras droit réglable pour « piloter » une interface). */
export const StandingBack: React.FC<{
  id: string;
  height?: number;
  skin?: string;
  suit?: string;
  rim?: string;
  armRaise?: number; // 0 = bras le long du corps, 1 = bras tendu vers l'interface
  posture?: number; // 0 = voûté, 1 = droit
}> = ({ id, height = 900, skin = "#4A2E20", suit = "#141C2E", rim = C.cyan, armRaise = 0, posture = 1 }) => {
  const slouch = (1 - posture) * 18;
  return (
    <svg viewBox="0 0 300 800" height={height} width={(height * 300) / 800} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sb-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={rim} stopOpacity="0.5" />
          <stop offset="0.12" stopColor={rim} stopOpacity="0" />
          <stop offset="0.88" stopColor={rim} stopOpacity="0" />
          <stop offset="1" stopColor={rim} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${slouch}) rotate(${(1 - posture) * 4} 150 400)`}>
        {/* jambes */}
        <path d="M100 430 L96 790 L142 790 L150 470 L158 790 L204 790 L200 430 Z" fill="#0C1220" />
        {/* bras gauche */}
        <path d="M62 190 C46 260 44 340 52 420 L76 420 C76 340 82 270 96 210 Z" fill={suit} />
        {/* torse (veste) */}
        <path d="M62 180 C90 158 210 158 238 180 L244 450 L56 450 Z" fill={suit} />
        <path d="M62 180 C90 158 210 158 238 180 L244 450 L56 450 Z" fill={`url(#sb-${id})`} />
        <path d="M150 170 L150 450" stroke="#0A0F1A" strokeWidth="3" />
        {/* bras droit pivotant */}
        <g transform={`rotate(${-armRaise * 115} 230 190)`}>
          <path d="M238 190 C254 260 256 340 248 420 L224 420 C224 340 218 270 204 210 Z" fill={suit} />
          <ellipse cx="236" cy="430" rx="14" ry="18" fill={skin} />
        </g>
        {/* nuque + tête */}
        <rect x="132" y="120" width="36" height="50" rx="14" fill={skin} />
        <ellipse cx="150" cy="96" rx="44" ry="52" fill={skin} />
        <ellipse cx="150" cy="86" rx="45" ry="46" fill="#0B0807" />
        <ellipse cx="150" cy="96" rx="44" ry="52" fill={`url(#sb-${id})`} />
      </g>
    </svg>
  );
};
