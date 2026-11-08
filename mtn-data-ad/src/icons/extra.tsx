import React from "react";
import { COLORS } from "../theme/colors";
import { darken, lighten } from "./index";

type IconProps = { size?: number; color?: string; style?: React.CSSProperties };

// ----- Glyphes d'applications génériques (aucune marque réelle) -----
export type AppKind = "video" | "social" | "game" | "shop" | "chat" | "music" | "photo" | "doc" | "contact" | "map";

export const APP_COLORS: Record<AppKind, string> = {
  video: "#EF3340",
  social: "#3B82F6",
  game: "#8B5CF6",
  shop: "#F97316",
  chat: "#22C55E",
  music: "#EC4899",
  photo: "#F59E0B",
  doc: "#0EA5E9",
  contact: "#14B8A6",
  map: "#10B981",
};

export const AppGlyph: React.FC<{ kind: AppKind; size?: number; color?: string }> = ({
  kind,
  size = 60,
  color = COLORS.white,
}) => {
  const p = { fill: "none", stroke: color, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {kind === "video" && <path d="M36 26 L76 50 L36 74 Z" fill={color} stroke={color} strokeWidth={6} strokeLinejoin="round" />}
      {kind === "social" && (
        <>
          <circle cx={38} cy={38} r={13} fill={color} />
          <circle cx={66} cy={44} r={10} fill={color} opacity={0.8} />
          <path d="M14 80 C16 60 60 60 62 80 Z" fill={color} />
          <path d="M56 80 C58 66 86 64 88 80 Z" fill={color} opacity={0.8} />
        </>
      )}
      {kind === "game" && (
        <>
          <rect x={12} y={34} width={76} height={38} rx={19} fill={color} />
          <path d="M30 44 V62 M21 53 H39" stroke={APP_COLORS.game} strokeWidth={7} strokeLinecap="round" />
          <circle cx={64} cy={48} r={5} fill={APP_COLORS.game} />
          <circle cx={74} cy={58} r={5} fill={APP_COLORS.game} />
        </>
      )}
      {kind === "shop" && (
        <>
          <path d="M22 38 H78 L72 82 H28 Z" fill={color} />
          <path d="M38 40 V30 C38 18 62 18 62 30 V40" {...p} />
        </>
      )}
      {kind === "chat" && (
        <path d="M50 16 C28 16 14 30 14 47 C14 56 18 63 25 68 L21 84 L38 76 C42 77 46 78 50 78 C72 78 86 64 86 47 C86 30 72 16 50 16 Z" fill={color} />
      )}
      {kind === "music" && (
        <>
          <path d="M40 70 V24 L78 16 V62" {...p} />
          <circle cx={31} cy={71} r={11} fill={color} />
          <circle cx={69} cy={63} r={11} fill={color} />
        </>
      )}
      {kind === "photo" && (
        <>
          <rect x={14} y={22} width={72} height={58} rx={10} fill={color} />
          <path d="M20 74 L42 50 L56 64 L66 54 L82 74 Z" fill={APP_COLORS.photo} />
          <circle cx={66} cy={38} r={7} fill={APP_COLORS.photo} />
        </>
      )}
      {kind === "doc" && (
        <>
          <path d="M26 12 H60 L78 30 V88 H26 Z" fill={color} />
          <path d="M36 46 H68 M36 58 H68 M36 70 H58" stroke={APP_COLORS.doc} strokeWidth={6} strokeLinecap="round" />
        </>
      )}
      {kind === "contact" && (
        <>
          <circle cx={50} cy={36} r={16} fill={color} />
          <path d="M18 86 C20 60 80 60 82 86 Z" fill={color} />
        </>
      )}
      {kind === "map" && (
        <>
          <path d="M50 88 C50 88 22 58 22 40 C22 24 34 12 50 12 C66 12 78 24 78 40 C78 58 50 88 50 88 Z" fill={color} />
          <circle cx={50} cy={40} r={11} fill={APP_COLORS.map} />
        </>
      )}
    </svg>
  );
};

/** Icône d'application 3D (tuile biseautée + glyphe). */
export const AppIcon: React.FC<{ kind: AppKind; size?: number; dim?: number; style?: React.CSSProperties }> = ({
  kind,
  size = 120,
  dim = 0,
  style,
}) => {
  const c = APP_COLORS[kind];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: `linear-gradient(145deg, ${lighten(c)} 0%, ${c} 50%, ${darken(c)} 100%)`,
        boxShadow: `inset 0 ${size * 0.04}px ${size * 0.05}px rgba(255,255,255,0.45), inset 0 -${size * 0.05}px ${size * 0.07}px rgba(0,0,0,0.2), 0 ${size * 0.12}px ${size * 0.2}px rgba(80,50,0,0.3)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: `grayscale(${dim}) brightness(${1 - dim * 0.15})`,
        ...style,
      }}
    >
      <AppGlyph kind={kind} size={size * 0.56} />
    </div>
  );
};

// ----- Pictogrammes -----
export const CloudShape: React.FC<IconProps & { width?: number }> = ({ width = 400, color = COLORS.white, style }) => (
  <svg width={width} height={width * 0.62} viewBox="0 0 200 124" style={style}>
    <defs>
      <linearGradient id="cloudg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#E8EBF0" />
      </linearGradient>
    </defs>
    <path
      d="M50 118 C24 118 8 102 8 82 C8 62 24 48 44 48 C48 24 68 8 94 8 C120 8 140 26 144 50 C168 50 190 66 190 88 C190 106 176 118 156 118 Z"
      fill="url(#cloudg)"
    />
  </svg>
);

export const ShareGlyph: React.FC<IconProps & { progress?: number; node?: string }> = ({
  size = 120,
  color = COLORS.black,
  node = COLORS.yellow,
  progress = 1,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path
      d="M30 50 L70 26 M30 50 L70 74"
      stroke={color}
      strokeWidth={8}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - progress}
    />
    {[
      [30, 50],
      [70, 26],
      [70, 74],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={13 * Math.min(1, Math.max(0, progress * 3 - i))} fill={node} stroke={color} strokeWidth={6} />
    ))}
  </svg>
);

export const Magnifier: React.FC<IconProps> = ({ size = 200, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <defs>
      <radialGradient id="lens" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="100%" stopColor="rgba(255,229,0,0.25)" />
      </radialGradient>
      <linearGradient id="handle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3A3D45" />
        <stop offset="100%" stopColor="#000" />
      </linearGradient>
    </defs>
    <path d="M60 60 L88 88" stroke="url(#handle)" strokeWidth={13} strokeLinecap="round" />
    <circle cx={40} cy={40} r={28} fill="url(#lens)" stroke="#111" strokeWidth={7} />
    <path d="M24 32 A18 18 0 0 1 36 20" stroke="white" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9} />
  </svg>
);

export const TowerIcon: React.FC<IconProps & { pulse?: number }> = ({ size = 110, color = COLORS.black, pulse = 0, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M50 40 L34 92 M50 40 L66 92 M40 72 H60 M37 82 H63" stroke={color} strokeWidth={6} strokeLinecap="round" />
    <circle cx={50} cy={36} r={7} fill={color} />
    {[0, 1].map((i) => {
      const t = (pulse + i * 0.5) % 1;
      return (
        <g key={i} opacity={1 - t} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round">
          <path d={`M ${50 - 14 - t * 16} ${36 - 12 - t * 10} A ${20 + t * 20} ${20 + t * 20} 0 0 0 ${50 - 14 - t * 16} ${36 + 12 + t * 10}`} />
          <path d={`M ${50 + 14 + t * 16} ${36 - 12 - t * 10} A ${20 + t * 20} ${20 + t * 20} 0 0 1 ${50 + 14 + t * 16} ${36 + 12 + t * 10}`} />
        </g>
      );
    })}
  </svg>
);

export const GearIcon: React.FC<IconProps & { rotation?: number }> = ({ size = 60, color = COLORS.white, rotation = 0, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ rotate: `${rotation}deg`, ...style }}>
    <g fill={color}>
      {new Array(8).fill(0).map((_, i) => (
        <rect key={i} x={43} y={6} width={14} height={20} rx={4} transform={`rotate(${i * 45} 50 50)`} />
      ))}
      <circle cx={50} cy={50} r={30} />
    </g>
    <circle cx={50} cy={50} r={12} fill="rgba(0,0,0,0.55)" />
  </svg>
);

/** Flèches de données montante/descendante (scène 1). */
export const DataArrows: React.FC<IconProps> = ({ size = 160, color = COLORS.black, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <g fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round">
      <path d="M34 80 V22 M18 38 L34 22 L50 38" />
      <path d="M66 20 V78 M50 62 L66 78 L82 62" />
    </g>
  </svg>
);

export const CrossMark: React.FC<IconProps & { progress?: number }> = ({ size = 100, color = COLORS.white, progress = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <g stroke={color} strokeWidth={14} strokeLinecap="round" fill="none">
      <path d="M28 28 L72 72" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, progress * 2)} />
      <path d="M72 28 L28 72" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, progress * 2 - 1)} />
    </g>
  </svg>
);
