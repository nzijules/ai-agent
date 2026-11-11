import React from "react";
import { COLORS } from "../config";

/**
 * Personnage débutant face à son ordinateur (illustration vectorielle originale).
 * mood : 0 = hésitant / inquiet, 1 = enthousiaste.
 */
export const Character: React.FC<{ mood: number; frame: number; size?: number; glow?: number }> = ({
  mood,
  frame,
  size = 600,
  glow = 0.5,
}) => {
  const skin = "#8A5A3B";
  const skinShade = "#6E4529";
  const blink = frame % 96 > 90 ? 0.15 : 1;
  const brow = (1 - mood) * 12; // inclinaison inquiète
  const browY = 255 - mood * 8;
  const smile = -10 + mood * 34;
  const open = Math.max(0, mood - 0.6) * 30;
  const bob = Math.sin(frame / 12) * (2 + mood * 4);
  return (
    <svg width={size} height={size} viewBox="0 0 600 600" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="screenGlow" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.55 * glow} />
          <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="hoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B7BFF" />
          <stop offset="100%" stopColor={COLORS.electric} />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${bob})`}>
        {/* corps */}
        <path d="M120 600 Q125 440 300 420 Q475 440 480 600 Z" fill="url(#hoodie)" />
        <path d="M250 425 Q300 470 350 425" stroke="#0A4FB5" strokeWidth={10} fill="none" />
        {/* cou */}
        <rect x={268} y={355} width={64} height={80} rx={20} fill={skinShade} />
        {/* oreilles */}
        <ellipse cx={213} cy={300} rx={17} ry={24} fill={skinShade} />
        <ellipse cx={387} cy={300} rx={17} ry={24} fill={skinShade} />
        {/* tête */}
        <ellipse cx={300} cy={290} rx={88} ry={102} fill={skin} />
        {/* cheveux */}
        <path d="M212 280 Q200 180 300 172 Q402 180 388 280 Q382 228 352 214 Q300 236 246 214 Q218 230 212 280 Z" fill="#141414" />
        {/* sourcils */}
        <g stroke="#141414" strokeWidth={9} strokeLinecap="round">
          <line x1={248} y1={browY + brow * 0.2} x2={284} y2={browY - brow} />
          <line x1={316} y1={browY - brow} x2={352} y2={browY + brow * 0.2} />
        </g>
        {/* yeux */}
        <ellipse cx={268} cy={292} rx={10} ry={12 * blink} fill="#141414" />
        <ellipse cx={332} cy={292} rx={10} ry={12 * blink} fill="#141414" />
        <circle cx={271} cy={288} r={3 * blink} fill="#fff" />
        <circle cx={335} cy={288} r={3 * blink} fill="#fff" />
        {/* bouche */}
        <path
          d={`M272 ${342 - smile * 0.15} Q300 ${342 + smile} 328 ${342 - smile * 0.15} ${open > 0 ? `Q300 ${342 + smile + open} 272 ${342 - smile * 0.15}` : ""}`}
          stroke="#3A1E10"
          strokeWidth={7}
          strokeLinecap="round"
          fill={open > 0 ? "#3A1E10" : "none"}
        />
        {/* joues */}
        <circle cx={245} cy={325} r={14} fill="#C46A4A" opacity={0.35 * mood} />
        <circle cx={355} cy={325} r={14} fill="#C46A4A" opacity={0.35 * mood} />
        {/* goutte de sueur (hésitation) */}
        <path
          d="M392 230 Q404 252 392 262 Q380 252 392 230 Z"
          fill={COLORS.cyan}
          opacity={Math.max(0, 0.9 - mood * 2)}
          transform={`translate(0 ${(frame % 40) * 0.4})`}
        />
        {/* lueur écran sur le visage */}
        <ellipse cx={300} cy={360} rx={190} ry={170} fill="url(#screenGlow)" />
      </g>
      {/* ordinateur (dos de l'écran) */}
      <g>
        <path d="M150 455 L450 455 L470 600 L130 600 Z" fill="#C9D3E6" />
        <path d="M150 455 L450 455 L470 600 L130 600 Z" fill="url(#hoodie)" opacity={0.08} />
        <circle cx={300} cy={528} r={22} fill="#ffffff" opacity={0.9} />
        <circle cx={300} cy={528} r={34} fill={COLORS.cyan} opacity={0.25 * glow} />
      </g>
    </svg>
  );
};
