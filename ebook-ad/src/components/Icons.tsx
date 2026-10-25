import React from 'react';
import {interpolate} from 'remotion';
import {clamp} from '../anim';
import {colors} from '../theme';

/**
 * Icônes vectorielles animées (traits dessinés + micro-animations en boucle).
 * `p` = progression du tracé (0 → 1), `f` = frame locale pour les boucles.
 */
type IconProps = {size: number; p: number; f: number; color?: string; accent?: string};

const draw = (p: number, delay = 0, len = 1) => {
  const v = interpolate(p, [delay, Math.min(1, delay + len)], [1, 0], clamp);
  return {pathLength: 1, strokeDasharray: 1, strokeDashoffset: v} as const;
};

const stroke = (c: string, w = 5) => ({fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});

// ---------- Problèmes ----------

const Homework: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.coral}) => {
  const pen = Math.sin(f / 4) * 6;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="18" y="14" width="54" height="72" rx="8" {...stroke(color)} {...draw(p, 0, 0.6)} />
      <path d="M30 34 H60 M30 48 H60 M30 62 H48" {...stroke(color, 4)} {...draw(p, 0.3, 0.6)} />
      <g transform={`translate(${pen} ${-pen / 2}) rotate(35 76 60)`} opacity={p}>
        <rect x="70" y="30" width="12" height="44" rx="3" fill={accent} />
        <path d="M70 74 L76 86 L82 74 Z" fill="#FFD7C2" />
      </g>
    </svg>
  );
};

const Confused: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.coral}) => {
  const bob = Math.sin(f / 7) * 4;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="44" cy="56" r="28" {...stroke(color)} {...draw(p, 0, 0.6)} />
      <circle cx="35" cy="52" r="3.5" fill={color} opacity={p} />
      <circle cx="53" cy="52" r="3.5" fill={color} opacity={p} />
      <path d="M34 68 Q40 63 46 68 T58 68" {...stroke(color, 4)} {...draw(p, 0.4, 0.4)} />
      <g transform={`translate(0 ${bob})`} opacity={interpolate(p, [0.5, 0.9], [0, 1], clamp)}>
        <path d="M70 14 q12 -6 18 4 q4 8 -6 13 q-5 3 -5 8" {...stroke(accent, 6)} />
        <circle cx="77" cy="48" r="3.8" fill={accent} />
      </g>
    </svg>
  );
};

const Revision: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.coral}) => {
  const a = f * 9;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="52" r="32" {...stroke(color)} {...draw(p, 0, 0.6)} />
      <path d="M38 12 H62 M50 12 V20" {...stroke(color, 5)} {...draw(p, 0.2, 0.4)} />
      <line x1="50" y1="52" x2="50" y2="32" {...stroke(accent, 5)} transform={`rotate(${a} 50 52)`} opacity={p} />
      <line x1="50" y1="52" x2="64" y2="52" {...stroke(color, 5)} transform={`rotate(${a / 12} 50 52)`} opacity={p} />
      <circle cx="50" cy="52" r="4" fill={accent} opacity={p} />
    </svg>
  );
};

const Copy: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.coral}) => {
  const slide = (Math.sin(f / 6) + 1) * 4;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="16" y="14" width="46" height="58" rx="7" {...stroke(color)} {...draw(p, 0, 0.5)} />
      <g transform={`translate(${slide} ${slide})`}>
        <rect x="38" y="30" width="46" height="58" rx="7" {...stroke(accent)} fill={colors.ink} {...draw(p, 0.3, 0.5)} />
        <path d="M48 48 H74 M48 60 H74 M48 72 H64" {...stroke(accent, 4)} {...draw(p, 0.5, 0.5)} />
      </g>
    </svg>
  );
};

// ---------- Bénéfices ----------

const Bulb: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.amber}) => {
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="42" r="30" fill={accent} opacity={0.18 * pulse * p} />
      {[-70, -35, 0, 35, 70].map((d, i) => {
        const r = (d * Math.PI) / 180;
        const r1 = 30 + pulse * 2;
        const r2 = 38 + pulse * 5;
        return (
          <line
            key={d}
            x1={50 + Math.sin(r) * r1}
            y1={42 - Math.cos(r) * r1}
            x2={50 + Math.sin(r) * r2}
            y2={42 - Math.cos(r) * r2}
            {...stroke(accent, 5)}
            {...draw(p, 0.45 + i * 0.08, 0.2)}
          />
        );
      })}
      <path d="M50 20 a20 20 0 0 1 12 36 v8 h-24 v-8 a20 20 0 0 1 12 -36z" {...stroke(color, 5)} {...draw(p, 0, 0.6)} />
      <path d="M41 74 H59 M44 82 H56" {...stroke(color, 5)} {...draw(p, 0.4, 0.3)} />
      <path d="M44 46 L50 38 L56 46" {...stroke(accent, 4)} {...draw(p, 0.6, 0.3)} />
    </svg>
  );
};

const Cards: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.mint}) => {
  const flip = Math.abs(Math.cos(f / 14));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="14" y="22" width="50" height="62" rx="8" {...stroke(color, 4)} opacity={0.5} {...draw(p, 0, 0.5)} />
      <g transform={`translate(58 50) scale(${0.25 + 0.75 * flip} 1) translate(-58 -50)`}>
        <rect x="32" y="16" width="52" height="66" rx="9" {...stroke(accent, 5)} fill={colors.ink} {...draw(p, 0.2, 0.5)} />
        <path d="M46 50 L55 59 L72 40" {...stroke(accent, 6)} {...draw(p, 0.6, 0.35)} />
      </g>
    </svg>
  );
};

const Stairs: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.mint}) => {
  const wave = Math.sin(f / 5) * 3;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M12 86 H32 V68 H52 V50 H72 V32 H88" {...stroke(color, 5)} {...draw(p, 0, 0.65)} />
      <path d="M80 32 V8" {...stroke(color, 4)} {...draw(p, 0.6, 0.2)} />
      <path d={`M80 8 Q88 ${10 + wave} 96 8 Q88 ${16 - wave} 96 20 L80 20 Z`} fill={accent} opacity={interpolate(p, [0.75, 0.95], [0, 1], clamp)} />
      <circle cx="22" cy="74" r="6" fill={accent} opacity={interpolate(p, [0.3, 0.5], [0, 1], clamp)} />
    </svg>
  );
};

const Progress: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.amber}) => {
  const bars = [0.35, 0.55, 0.78];
  const beat = 1 + 0.08 * Math.max(0, Math.sin(f / 4));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M12 88 H90" {...stroke(color, 4)} {...draw(p, 0, 0.3)} />
      {bars.map((b, i) => {
        const g = interpolate(p, [0.15 + i * 0.15, 0.45 + i * 0.15], [0, 1], clamp);
        const hgt = b * 64 * g;
        return <rect key={i} x={18 + i * 22} y={84 - hgt} width="14" height={hgt} rx="4" fill={i === 2 ? accent : color} opacity={i === 2 ? 1 : 0.75} />;
      })}
      <g transform={`translate(80 22) scale(${beat}) translate(-80 -22)`} opacity={interpolate(p, [0.7, 0.9], [0, 1], clamp)}>
        <path d="M80 34 C64 24 66 10 74 10 C78 10 80 14 80 14 C80 14 82 10 86 10 C94 10 96 24 80 34 Z" fill={colors.coral} />
      </g>
    </svg>
  );
};

const Briefcase: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.coral}) => {
  const tilt = Math.sin(f / 6) * 3;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g transform={`rotate(${tilt} 50 56)`}>
        <rect x="14" y="32" width="72" height="50" rx="9" {...stroke(color)} {...draw(p, 0, 0.6)} />
        <path d="M38 32 V24 a5 5 0 0 1 5 -5 h14 a5 5 0 0 1 5 5 V32" {...stroke(color, 5)} {...draw(p, 0.3, 0.4)} />
        <path d="M14 52 H86" {...stroke(accent, 4)} {...draw(p, 0.5, 0.4)} />
        <rect x="44" y="47" width="12" height="10" rx="2" fill={accent} opacity={p} />
      </g>
    </svg>
  );
};

const Home: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.coral}) => {
  const smoke = (f % 40) / 40;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M14 50 L50 18 L86 50" {...stroke(color, 6)} {...draw(p, 0, 0.5)} />
      <path d="M24 44 V84 H76 V44" {...stroke(color)} {...draw(p, 0.2, 0.5)} />
      <rect x="42" y="60" width="16" height="24" rx="3" fill={accent} opacity={p} />
      <path d="M66 30 V18 H74 V38" {...stroke(color, 4)} {...draw(p, 0.4, 0.3)} />
      <circle cx={72 + smoke * 6} cy={12 - smoke * 10} r={3 + smoke * 3} fill={color} opacity={(1 - smoke) * 0.5 * p} />
    </svg>
  );
};

const Wallet: React.FC<IconProps> = ({size, p, f, color = colors.white, accent = colors.amber}) => {
  const coin = Math.abs(Math.sin(f / 10));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="68" cy={24 - coin * 6} r="11" fill={accent} opacity={interpolate(p, [0.5, 0.8], [0, 1], clamp)} />
      <text x="68" y={28.5 - coin * 6} textAnchor="middle" fontSize="13" fontWeight="800" fill={colors.ink} opacity={interpolate(p, [0.5, 0.8], [0, 1], clamp)}>F</text>
      <rect x="12" y="34" width="74" height="50" rx="10" {...stroke(color)} {...draw(p, 0, 0.6)} />
      <path d="M86 50 H66 a8 8 0 0 0 0 16 H86" {...stroke(accent, 5)} {...draw(p, 0.4, 0.4)} />
      <circle cx="68" cy="58" r="3.5" fill={accent} opacity={p} />
    </svg>
  );
};

export const iconMap: Record<string, React.FC<IconProps>> = {
  homework: Homework,
  confused: Confused,
  revision: Revision,
  copy: Copy,
  bulb: Bulb,
  cards: Cards,
  stairs: Stairs,
  progress: Progress,
  briefcase: Briefcase,
  home: Home,
  wallet: Wallet,
};

export const AnimatedIcon: React.FC<IconProps & {name: string}> = ({name, ...rest}) => {
  const C = iconMap[name] ?? Bulb;
  return <C {...rest} />;
};

// ---------- Pictos utilitaires ----------

export const Sparkle: React.FC<{size: number; color?: string}> = ({size, color = colors.mint}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2 C12.8 7.5 16.5 11.2 22 12 C16.5 12.8 12.8 16.5 12 22 C11.2 16.5 7.5 12.8 2 12 C7.5 11.2 11.2 7.5 12 2 Z" fill={color} />
  </svg>
);

export const Check: React.FC<{size: number; p: number; color?: string}> = ({size, p, color = colors.ink}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5 L10 17 L19 7.5" {...stroke(color, 3)} {...draw(p)} />
  </svg>
);

/** Picto « message / téléphone » générique (pas de logo de marque). */
export const ChatPhone: React.FC<{size: number; color?: string}> = ({size, color = colors.mint}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2.5 a9.5 9.5 0 0 0 -8.2 14.3 L2.5 21.5 l4.9 -1.3 A9.5 9.5 0 1 0 12 2.5 z" fill="none" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
    <path
      d="M8.6 7.6 c.3 -.6 .7 -.6 1 -.6 h.6 c.2 0 .5 0 .7 .5 l.8 1.9 c.1 .3 0 .6 -.2 .8 l-.6 .7 c-.2 .2 -.2 .4 0 .7 c.7 1.2 1.7 2.1 2.9 2.7 c.3 .1 .5 .1 .7 -.1 l.7 -.8 c.2 -.3 .5 -.3 .8 -.2 l1.8 .9 c.3 .1 .5 .3 .5 .6 c0 .6 -.3 1.5 -1.4 2 c-1 .4 -2.4 .3 -4.6 -1 c-2.1 -1.3 -3.6 -3.2 -4.1 -4.7 c-.5 -1.5 -.2 -2.5 .4 -3.4 z"
      fill={color}
    />
  </svg>
);

export const LinkIcon: React.FC<{size: number; color?: string}> = ({size, color = colors.mint}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M10 14 a4 4 0 0 0 5.7 0 l3 -3 a4 4 0 0 0 -5.7 -5.7 l-1 1 M14 10 a4 4 0 0 0 -5.7 0 l-3 3 a4 4 0 0 0 5.7 5.7 l1 -1" {...stroke(color, 2.2)} />
  </svg>
);

export const Cursor: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 2.5 L5 19 L9.3 15 L12.2 21.5 L15 20.2 L12.2 13.9 L18 13.6 Z" fill={colors.white} stroke={colors.ink} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
