import React from "react";
import { COLORS } from "../theme/colors";

// Bibliothèque d'icônes SVG au rendu « 3D premium » (dégradés, biseaux, ombres).
// Toutes acceptent des props d'animation pour être pilotées par les scènes.

type IconProps = { size?: number; style?: React.CSSProperties };

/** Pastille 3D : carré arrondi biseauté qui accueille une icône. */
export const Badge3D: React.FC<
  IconProps & { color?: string; children: React.ReactNode; radius?: number }
> = ({ size = 120, color = COLORS.yellow, radius, children, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius ?? size * 0.28,
      background: `linear-gradient(145deg, ${lighten(color)} 0%, ${color} 48%, ${darken(color)} 100%)`,
      boxShadow: `inset 0 ${size * 0.04}px ${size * 0.05}px rgba(255,255,255,0.7), inset 0 -${size * 0.06}px ${size * 0.08}px rgba(0,0,0,0.18), 0 ${size * 0.12}px ${size * 0.22}px rgba(0,0,0,0.22)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Flèches circulaires de mise à jour / synchronisation. `rotation` en degrés. */
export const SyncArrows: React.FC<IconProps & { rotation?: number; color?: string; stroke?: number }> = ({
  size = 80,
  rotation = 0,
  color = COLORS.black,
  stroke = 9,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ rotate: `${rotation}deg`, ...style }}>
    <g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 80 42 A 32 32 0 0 0 24 30" />
      <path d="M 20 58 A 32 32 0 0 0 76 70" />
    </g>
    <path d="M 12 22 L 30 18 L 26 38 Z" fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 88 78 L 70 82 L 74 62 Z" fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

/** Flèche de téléchargement (descente de données). */
export const DownloadArrow: React.FC<IconProps & { color?: string }> = ({ size = 60, color = COLORS.black, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path
      d="M50 14 V62 M28 42 L50 64 L72 42 M22 84 H78"
      fill="none"
      stroke={color}
      strokeWidth={11}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Barres de réseau mobile. `level` 0..4. */
export const CellularIcon: React.FC<IconProps & { color?: string; level?: number }> = ({
  size = 60,
  color = COLORS.black,
  level = 4,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={12 + i * 21}
        y={70 - i * 18}
        width={15}
        height={18 + i * 18}
        rx={4}
        fill={color}
        opacity={i < level ? 1 : 0.25}
      />
    ))}
  </svg>
);

/** Wi-Fi. `level` 0..3 arcs actifs. */
export const WifiIcon: React.FC<IconProps & { color?: string; level?: number }> = ({
  size = 60,
  color = COLORS.black,
  level = 3,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx={50} cy={78} r={8} fill={color} />
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M ${50 - (20 + i * 15)} ${68 - (8 + i * 12)} A ${24 + i * 18} ${24 + i * 18} 0 0 1 ${50 + (20 + i * 15)} ${68 - (8 + i * 12)}`}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        opacity={i < level ? 1 : 0.25}
      />
    ))}
  </svg>
);

/** Coche de confirmation qui se dessine (`progress` 0..1). */
export const CheckMark: React.FC<IconProps & { color?: string; progress?: number }> = ({
  size = 60,
  color = COLORS.white,
  progress = 1,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path
      d="M24 52 L43 70 L77 32"
      fill="none"
      stroke={color}
      strokeWidth={12}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - progress}
    />
  </svg>
);

/** Pause (deux barres). */
export const PauseIcon: React.FC<IconProps & { color?: string }> = ({ size = 40, color = COLORS.ui, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <rect x={24} y={18} width={18} height={64} rx={6} fill={color} />
    <rect x={58} y={18} width={18} height={64} rx={6} fill={color} />
  </svg>
);

// --- utilitaires couleur ---
const shift = (hex: string, amt: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt)));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `rgb(${r},${g},${b})`;
};
export const lighten = (hex: string) => shift(hex, 45);
export const darken = (hex: string) => shift(hex, -45);
