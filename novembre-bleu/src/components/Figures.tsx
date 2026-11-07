import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {colors} from '../styles/theme';

/**
 * Silhouettes d'illustration (PLACEHOLDERS d'animatique) — personnages stylisés
 * en contre-jour avec liseré lumineux. À remplacer par les prises de vue réelles.
 */

type Rim = {color?: string; side?: 'left' | 'right'; body?: string};

let uid = 0;
const useId = (p: string) => React.useMemo(() => `${p}-${uid++}`, [p]);

const RimDefs: React.FC<{id: string} & Rim> = ({id, color = colors.gold, side = 'right', body = '#0B1426'}) => (
  <defs>
    <linearGradient id={`${id}-rim`} x1={side === 'left' ? 0 : 1} y1="0" x2={side === 'left' ? 1 : 0} y2="0.2">
      <stop offset="0" stopColor={color} stopOpacity={1} />
      <stop offset="0.35" stopColor={color} stopOpacity={0.15} />
      <stop offset="1" stopColor={color} stopOpacity={0} />
    </linearGradient>
    <linearGradient id={`${id}-fill`} x1={side === 'left' ? 0 : 1} y1="0" x2={side === 'left' ? 1 : 0} y2="0">
      <stop offset="0" stopColor="#3A2618" />
      <stop offset="0.25" stopColor={body} />
      <stop offset="1" stopColor="#050A14" />
    </linearGradient>
  </defs>
);

export type PersonKind = 'man' | 'woman' | 'child' | 'elder' | 'doctor' | 'teen';

/** Couleurs de vêtements (désaturées : les personnages restent en contre-jour). */
const OUTFIT: Record<PersonKind, {top: string; bottom: string}> = {
  man: {top: '#1A2640', bottom: '#121A2C'},
  woman: {top: '#5C2A38', bottom: '#5C2A38'},
  child: {top: '#7A5520', bottom: '#20283A'},
  teen: {top: '#1F4A42', bottom: '#1A2236'},
  elder: {top: '#3E3A4A', bottom: '#2C2A36'},
  doctor: {top: '#D3DEEB', bottom: '#1A2236'},
};

/** Personnage debout (vue de face/trois-quarts), hauteur = `height` px. */
export const Person: React.FC<{
  kind?: PersonKind;
  height: number;
  rim?: Rim;
  /** respiration / micro-mouvement */
  sway?: number;
  seed?: string;
  style?: React.CSSProperties;
  armRaise?: number; // 0..1 bras levé (geste d'explication)
}> = ({kind = 'man', height, rim = {}, sway = 1, seed = 'p', style, armRaise = 0}) => {
  const id = useId(`person-${kind}`);
  const frame = useCurrentFrame();
  const ph = random(seed) * 10;
  const breathe = Math.sin(frame / 22 + ph) * 1.2 * sway;
  const rimColor = rim.color ?? colors.gold;
  const side = rim.side ?? 'right';
  const stroke = `url(#${id}-rim)`;
  const shade = `url(#${id}-shade)`;
  const o = OUTFIT[kind];
  const isWoman = kind === 'woman';
  const isDoctor = kind === 'doctor';
  const young = kind === 'child' || kind === 'teen';
  const lean = kind === 'elder' ? 3 : 0;
  // proportions : tête plus grosse chez l'enfant
  const headR = kind === 'child' ? 40 : 33;
  const gesture = armRaise * 70;
  return (
    <svg viewBox="0 0 200 600" width={height / 3} height={height} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={`${id}-rim`} x1={side === 'left' ? 0 : 1} y1="0" x2={side === 'left' ? 1 : 0} y2="0">
          <stop offset="0" stopColor={rimColor} stopOpacity={1} />
          <stop offset="0.3" stopColor={rimColor} stopOpacity={0.12} />
          <stop offset="1" stopColor={rimColor} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1={side === 'left' ? 0 : 1} y1="0" x2={side === 'left' ? 1 : 0} y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id={`${id}-skin`} cx={side === 'left' ? 0.3 : 0.7} cy="0.35" r="0.8">
          <stop offset="0" stopColor="#6A4630" />
          <stop offset="0.6" stopColor="#3A2416" />
          <stop offset="1" stopColor="#1C110A" />
        </radialGradient>
      </defs>
      <g transform={`translate(0 ${breathe}) rotate(${lean} 100 590)`}>
        {/* jambes (pantalon) */}
        {!isWoman && (
          <>
            <path d="M 60 318 L 99 318 L 96 568 L 68 568 Z" fill={o.bottom} stroke={stroke} strokeWidth={3} />
            <path d="M 101 318 L 140 318 L 132 568 L 104 568 Z" fill={o.bottom} stroke={stroke} strokeWidth={3} />
            <path d="M 60 318 L 140 318 L 132 568 L 68 568 Z" fill={shade} />
          </>
        )}
        {isWoman && (
          <>
            <path d="M 74 480 L 92 480 L 90 568 L 76 568 Z" fill="#2A1A10" />
            <path d="M 108 480 L 126 480 L 124 568 L 110 568 Z" fill="#2A1A10" />
          </>
        )}
        {/* chaussures */}
        <ellipse cx={80} cy={572} rx={20} ry={8} fill="#0A0A0E" />
        <ellipse cx={120} cy={572} rx={20} ry={8} fill="#0A0A0E" />
        {/* bras (arrière) */}
        <path d="M 156 158 C 172 210 176 270 166 330" stroke={o.top} strokeWidth={24} strokeLinecap="round" fill="none" />
        <circle cx={166} cy={334} r={11} fill={`url(#${id}-skin)`} />
        {/* torse */}
        {isWoman ? (
          <path d="M 58 146 Q 100 128 142 146 L 148 290 L 176 486 Q 100 504 24 486 L 52 290 Z" fill={o.top} stroke={stroke} strokeWidth={3.5} />
        ) : isDoctor ? (
          <path d="M 42 146 Q 100 120 158 146 L 170 462 Q 100 474 30 462 Z" fill={o.top} stroke={stroke} strokeWidth={3.5} />
        ) : (
          <path d={`M 42 146 Q 100 120 158 146 L 164 ${young ? 322 : 330} Q 100 344 36 ${young ? 322 : 330} Z`} fill={o.top} stroke={stroke} strokeWidth={3.5} />
        )}
        {/* motif wax discret sur la robe */}
        {isWoman && [0, 1, 2, 3].map((r) => (
          <path key={r} d={`M ${40 + r * 4} ${330 + r * 40} Q 100 ${318 + r * 40} ${160 - r * 4} ${330 + r * 40}`} fill="none" stroke="#C99A4A" strokeOpacity={0.35} strokeWidth={4} />
        ))}
        {isDoctor && (
          <>
            <path d="M 100 140 L 100 462" stroke="#9FB1C8" strokeWidth={3} />
            <path d="M 84 140 L 100 200 L 116 140" fill="#24344E" />
            <path d="M 78 150 Q 70 230 92 250 Q 112 262 118 236" fill="none" stroke="#24344E" strokeWidth={5} />
            <circle cx={118} cy={232} r={8} fill="#24344E" />
          </>
        )}
        {kind === 'man' && <path d="M 86 136 L 100 186 L 114 136" fill="#E7ECF3" fillOpacity={0.75} />}
        {kind === 'elder' && <path d="M 60 150 L 140 150 L 150 330 L 50 330 Z" fill="#C9A15F" fillOpacity={0.18} />}
        <path d="M 42 146 Q 100 120 158 146 L 166 330 L 34 330 Z" fill={shade} opacity={isWoman ? 0 : 0.8} />
        {/* bras (avant), éventuellement en geste */}
        <path d={`M 44 158 C 28 210 ${24 + gesture * 0.2} ${270 - gesture} ${36 + gesture * 0.6} ${330 - gesture * 1.6}`} stroke={o.top} strokeWidth={24} strokeLinecap="round" fill="none" />
        <circle cx={36 + gesture * 0.6} cy={334 - gesture * 1.6} r={11} fill={`url(#${id}-skin)`} />
        {/* cou + tête */}
        <rect x={89} y={96} width={22} height={40} fill={`url(#${id}-skin)`} />
        <ellipse cx={100} cy={66} rx={headR} ry={headR * 1.22} fill={`url(#${id}-skin)`} stroke={stroke} strokeWidth={3.5} />
        {/* cheveux courts / coiffure */}
        {isWoman ? (
          <path d="M 64 56 Q 70 4 100 6 Q 132 4 138 52 Q 120 30 100 30 Q 80 30 64 56 Z" fill="#120A06" />
        ) : (
          <path d={`M ${100 - headR} 58 Q ${100 - headR} ${66 - headR * 1.3} 100 ${66 - headR * 1.25} Q ${100 + headR} ${66 - headR * 1.3} ${100 + headR} 58 Q 100 ${66 - headR * 0.9} ${100 - headR} 58 Z`} fill={kind === 'elder' ? '#9A9AA2' : '#0E0805'} />
        )}
        {kind === 'elder' && <path d="M 176 330 L 188 576" stroke="#6B4E33" strokeWidth={6} strokeLinecap="round" />}
      </g>
    </svg>
  );
};

/** Version enfant : proportions différentes (tête plus grande). */
export const Child: React.FC<{height: number; rim?: Rim; seed?: string; style?: React.CSSProperties}> = (p) => (
  <Person {...p} kind="child" />
);

/**
 * Buste de profil (gros plan), tourné vers la droite par défaut.
 * Utilisé pour les plans introspectifs.
 */
export const ProfileBust: React.FC<{
  size: number;
  rim?: Rim;
  flip?: boolean;
  style?: React.CSSProperties;
  collar?: boolean;
}> = ({size, rim = {}, flip = false, style, collar = true}) => {
  const id = useId('bust');
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 26) * 2;
  const d =
    'M 40 520 C 46 430 92 392 150 376 C 160 344 150 322 140 302 C 108 262 104 190 134 140 C 164 90 226 74 266 94 C 302 112 316 150 312 186 L 318 206 C 320 216 316 222 322 232 L 346 268 C 349 274 343 280 333 281 C 336 290 334 296 330 300 C 335 306 333 314 326 318 C 325 330 322 340 312 348 C 300 356 282 356 270 352 C 268 366 270 374 282 384 C 330 398 376 424 392 520 Z';
  return (
    <svg viewBox="0 0 420 520" width={size} height={size * (520 / 420)} style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style}}>
      <RimDefs id={id} {...rim} />
      <g transform={`translate(0 ${breathe})`}>
        <path d={d} fill={`url(#${id}-fill)`} stroke={`url(#${id}-rim)`} strokeWidth={5} />
        {collar && <path d="M 206 394 L 236 456 L 262 394" fill="none" stroke="#E7ECF3" strokeOpacity={0.22} strokeWidth={5} />}
        {/* oreille */}
        <path d="M 190 210 C 176 214 176 246 192 250" fill="none" stroke={rim.color ?? colors.gold} strokeOpacity={0.25} strokeWidth={4} />
      </g>
    </svg>
  );
};

/** Ligne d'horizon d'Abidjan (générique : tours du Plateau + lagune). */
export const Skyline: React.FC<{
  width: number;
  height: number;
  color?: string;
  windows?: string;
  seed?: string;
  reflection?: boolean;
  windowsOn?: number;
}> = ({width, height, color = '#081530', windows = colors.gold, seed = 'abj', reflection = true, windowsOn = 0.35}) => {
  const frame = useCurrentFrame();
  const towers: Array<{x: number; w: number; h: number; top: 'flat' | 'spire' | 'step'}> = [];
  let x = -20;
  let i = 0;
  while (x < width + 20) {
    const w = 40 + random(`${seed}w${i}`) * 90;
    const big = random(`${seed}b${i}`) > 0.7;
    const h = height * (big ? 0.55 + random(`${seed}h${i}`) * 0.4 : 0.15 + random(`${seed}h${i}`) * 0.35);
    const r = random(`${seed}t${i}`);
    towers.push({x, w, h, top: r > 0.85 ? 'spire' : r > 0.65 ? 'step' : 'flat'});
    x += w + 4 + random(`${seed}g${i}`) * 18;
    i++;
  }
  const base = reflection ? height * 0.78 : height;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block'}}>
      <defs>
        <linearGradient id={`${seed}-refl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.6} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {towers.map((t, k) => (
        <g key={k}>
          <rect x={t.x} y={base - t.h} width={t.w} height={t.h} fill={color} />
          {t.top === 'spire' && <path d={`M ${t.x + t.w / 2} ${base - t.h - 60} L ${t.x + t.w * 0.35} ${base - t.h} L ${t.x + t.w * 0.65} ${base - t.h} Z`} fill={color} />}
          {t.top === 'step' && <rect x={t.x + t.w * 0.2} y={base - t.h - 18} width={t.w * 0.6} height={20} fill={color} />}
          {new Array(Math.floor(t.h / 26)).fill(0).map((_, row) =>
            new Array(Math.max(1, Math.floor(t.w / 18))).fill(0).map((__, col) => {
              const on = random(`${seed}${k}-${row}-${col}`) < windowsOn;
              if (!on) return null;
              const flick = random(`${seed}f${k}${row}${col}${Math.floor(frame / 45)}`) > 0.03 ? 1 : 0.3;
              return (
                <rect key={`${row}-${col}`} x={t.x + 6 + col * 18} y={base - t.h + 12 + row * 26} width={8} height={11} fill={windows} opacity={0.55 * flick} />
              );
            }),
          )}
        </g>
      ))}
      {reflection && (
        <g transform={`translate(0 ${base * 2}) scale(1 -1)`} opacity={0.35}>
          {towers.map((t, k) => (
            <rect key={k} x={t.x} y={base - t.h} width={t.w} height={t.h} fill={`url(#${seed}-refl)`} />
          ))}
        </g>
      )}
    </svg>
  );
};
