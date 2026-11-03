import React from 'react';

/** Icônes au trait qui "se dessinent" (p = 0→1). */
type IP = {p?: number; size?: number; color?: string; sw?: number; fill?: string};
const Svg: React.FC<IP & {children: React.ReactNode}> = ({size = 200, children}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible'}}>
    {children}
  </svg>
);
const d = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});
const st = (color: string, sw: number) => ({stroke: color, strokeWidth: sw, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});

export const SimIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <path d="M28 10 H62 L78 26 V90 H28 Z" {...st(color, sw)} {...d(p)} />
    <rect x={38} y={42} width={30} height={34} rx={4} {...st(color, sw)} {...d(Math.max(0, p * 1.4 - 0.4))} />
    <path d="M38 54 H68 M38 64 H68 M53 42 V76" {...st(color, sw * 0.7)} {...d(Math.max(0, p * 1.6 - 0.6))} />
  </Svg>
);
export const PinIcon: React.FC<IP & {dots?: number}> = ({p = 1, size, color = '#111', sw = 4, dots = 4}) => (
  <Svg size={size}>
    <rect x={14} y={22} width={72} height={56} rx={10} {...st(color, sw)} {...d(p)} />
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={30 + i * 13.3} cy={50} r={5} fill={i < dots ? color : 'none'} stroke={color} strokeWidth={sw * 0.6} opacity={p} />
    ))}
  </Svg>
);
export const ProfileIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <circle cx={40} cy={34} r={14} {...st(color, sw)} {...d(p)} />
    <path d="M14 82 C16 62 28 54 40 54 C52 54 62 60 66 70" {...st(color, sw)} {...d(p)} />
    <path d="M62 86 L66 72 L86 52 L94 60 L74 80 Z" {...st(color, sw)} {...d(Math.max(0, p * 1.5 - 0.5))} />
  </Svg>
);
export const WalletIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <path d="M14 30 H78 a8 8 0 0 1 8 8 V78 a8 8 0 0 1 -8 8 H22 a8 8 0 0 1 -8 -8 Z" {...st(color, sw)} {...d(p)} />
    <path d="M14 30 L62 14 L70 30" {...st(color, sw)} {...d(p)} />
    <path d="M86 50 H66 a8 8 0 0 0 0 16 H86" {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const PhoneIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <rect x={30} y={8} width={40} height={84} rx={8} {...st(color, sw)} {...d(p)} />
    <path d="M44 80 H56" {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const AccountIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <circle cx={50} cy={36} r={16} {...st(color, sw)} {...d(p)} />
    <path d="M18 88 C20 64 34 56 50 56 C66 56 80 64 82 88" {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const AlertIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <path d="M50 8 L94 88 H6 Z" {...st(color, sw)} {...d(p)} />
    <path d="M50 36 V60" {...st(color, sw * 1.2)} {...d(Math.max(0, p * 2 - 1))} />
    <circle cx={50} cy={74} r={sw * 0.8} fill={color} opacity={p > 0.9 ? 1 : 0} />
  </Svg>
);
export const IdIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <rect x={8} y={20} width={84} height={60} rx={8} {...st(color, sw)} {...d(p)} />
    <circle cx={32} cy={44} r={9} {...st(color, sw)} {...d(p)} />
    <path d="M18 68 C20 58 44 58 46 68 M58 40 H82 M58 52 H82 M58 64 H74" {...st(color, sw)} {...d(Math.max(0, p * 1.5 - 0.5))} />
  </Svg>
);
export const DocCheckIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <path d="M22 8 H62 L80 26 V92 H22 Z" {...st(color, sw)} {...d(p)} />
    <path d="M32 40 H70 M32 52 H70 M32 64 H54" {...st(color, sw)} {...d(Math.max(0, p * 1.5 - 0.5))} />
  </Svg>
);
export const ListIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={10} y={14 + i * 28} width={16} height={16} rx={3} {...st(color, sw)} {...d(p)} />
        <path d={`M38 ${22 + i * 28} H90`} {...st(color, sw)} {...d(p)} />
      </g>
    ))}
  </Svg>
);
export const ShieldIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4, fill = 'none'}) => (
  <Svg size={size}>
    <path d="M50 6 L88 20 V48 C88 72 72 88 50 96 C28 88 12 72 12 48 V20 Z" {...st(color, sw)} fill={fill} {...d(p)} />
  </Svg>
);
export const LockIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <rect x={20} y={44} width={60} height={48} rx={8} {...st(color, sw)} {...d(p)} />
    <path d="M32 44 V30 a18 18 0 0 1 36 0 V44" {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const GavelIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <path d="M30 14 L60 44 M18 26 L48 56 M22 18 L52 48" {...st(color, sw * 1.6)} {...d(p)} />
    <path d="M44 40 L84 80" {...st(color, sw)} {...d(p)} />
    <path d="M10 92 H58" {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const PauseIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 6}) => (
  <Svg size={size}>
    <circle cx={50} cy={50} r={42} {...st(color, sw)} {...d(p)} />
    <path d="M40 34 V66 M60 34 V66" {...st(color, sw)} {...d(p)} />
  </Svg>
);

/** Coche qui se dessine dans un disque. */
export const CheckBadge: React.FC<{p: number; size?: number; color?: string; ink?: string}> = ({p, size = 90, color = '#1FAF5A', ink = '#fff'}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible'}}>
    <circle cx={50} cy={50} r={46} fill={color} transform={`scale(${Math.min(1, p * 2)})`} style={{transformOrigin: '50px 50px'}} />
    <path d="M28 52 L44 67 L73 36" stroke={ink} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
  </svg>
);
export const WarnBadge: React.FC<{p: number; size?: number; t: number}> = ({p, size = 90, t}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible'}}>
    <circle cx={50} cy={50} r={46 + Math.max(0, Math.sin(t * 8)) * 6 * p} fill="#E5332A" opacity={0.3 * p} />
    <circle cx={50} cy={50} r={46} fill="#E5332A" transform={`scale(${Math.min(1, p * 2)})`} style={{transformOrigin: '50px 50px'}} />
    <path d="M50 26 V58" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={p > 0.5 ? 1 : 0} />
    <circle cx={50} cy={74} r={6} fill="#fff" opacity={p > 0.5 ? 1 : 0} />
  </svg>
);

export const EyeIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <path d="M6 50 C22 24 78 24 94 50 C78 76 22 76 6 50 Z" {...st(color, sw)} {...d(p)} />
    <circle cx={50} cy={50} r={13} {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const EarIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <path d="M30 40 C30 16 74 12 76 40 C78 60 58 62 56 78 C54 92 34 92 32 80" {...st(color, sw)} {...d(p)} />
    <path d="M44 42 C44 30 62 30 62 42 C62 50 52 52 52 58" {...st(color, sw)} {...d(Math.max(0, p * 1.5 - 0.5))} />
  </Svg>
);
export const ChipIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 4}) => (
  <Svg size={size}>
    <rect x={24} y={24} width={52} height={52} rx={8} {...st(color, sw)} {...d(p)} />
    <path d="M38 8 V24 M50 8 V24 M62 8 V24 M38 76 V92 M50 76 V92 M62 76 V92 M8 38 H24 M8 50 H24 M8 62 H24 M76 38 H92 M76 50 H92 M76 62 H92" {...st(color, sw)} {...d(p)} />
    <path d="M38 62 L44 38 L50 62 M40 54 H48 M60 38 V62" {...st(color, sw)} {...d(Math.max(0, p * 1.6 - 0.6))} />
  </Svg>
);
export const ClockIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <circle cx={50} cy={54} r={36} {...st(color, sw)} {...d(p)} />
    <path d="M50 32 V54 L64 62 M40 8 H60 M50 8 V18" {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const ChatIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <path d="M10 18 H90 V68 H44 L24 86 V68 H10 Z" {...st(color, sw)} {...d(p)} />
    <path d="M26 36 H74 M26 50 H60" {...st(color, sw)} {...d(Math.max(0, p * 1.5 - 0.5))} />
  </Svg>
);
export const StoreIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <path d="M10 36 L18 12 H82 L90 36 Z M16 36 V90 H84 V36 M40 90 V62 H60 V90" {...st(color, sw)} {...d(p)} />
  </Svg>
);
export const GlobeIcon: React.FC<IP> = ({p = 1, size, color = '#111', sw = 5}) => (
  <Svg size={size}>
    <circle cx={50} cy={50} r={40} {...st(color, sw)} {...d(p)} />
    <path d="M10 50 H90 M50 10 C30 30 30 70 50 90 C70 70 70 30 50 10" {...st(color, sw)} {...d(p)} />
  </Svg>
);
