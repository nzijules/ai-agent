import React from 'react';
import {colors} from '../theme';

/** Petites icônes statiques (matières, statistiques, atouts, appareils). */
type P = {size: number; color?: string};
const sw = {fill: 'none', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

const icons: Record<string, (c: string) => React.ReactNode> = {
  pi: (c) => (
    <>
      <path d="M5 7 H19" stroke={c} {...sw} strokeWidth={2.4} />
      <path d="M9 7 V18 M15 7 V16 Q15 18 17 18" stroke={c} {...sw} strokeWidth={2.4} />
    </>
  ),
  book: (c) => (
    <>
      <path d="M3 6 Q7.5 4 12 6 Q16.5 4 21 6 V19 Q16.5 17 12 19 Q7.5 17 3 19 Z" stroke={c} {...sw} />
      <path d="M12 6 V19" stroke={c} {...sw} />
    </>
  ),
  atom: (c) => (
    <>
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke={c} {...sw} />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke={c} {...sw} transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke={c} {...sw} transform="rotate(-60 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill={c} />
    </>
  ),
  abc: (c) => (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" stroke={c} {...sw} />
      <text x="12" y="15.6" textAnchor="middle" fontSize="8" fontWeight="800" fill={c} fontFamily="Inter, sans-serif">EN</text>
    </>
  ),
  leaf: (c) => (
    <>
      <path d="M5 19 Q4 6 19 5 Q19 18 6 18" stroke={c} {...sw} />
      <path d="M5 19 L13 11" stroke={c} {...sw} />
    </>
  ),
  exercises: (c) => (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke={c} {...sw} />
      <path d="M8.5 9 L10 10.5 L13 7.5 M8.5 15 H15.5" stroke={c} {...sw} />
    </>
  ),
  quiz: (c) => (
    <>
      <circle cx="12" cy="12" r="9" stroke={c} {...sw} />
      <path d="M9.5 9.5 Q9.5 7 12 7 Q14.5 7 14.5 9.3 Q14.5 11 12 12 V13.5" stroke={c} {...sw} />
      <circle cx="12" cy="17" r="1.2" fill={c} />
    </>
  ),
  score: (c) => <path d="M12 3 L14.6 8.6 L20.6 9.3 L16.1 13.3 L17.4 19.3 L12 16.3 L6.6 19.3 L7.9 13.3 L3.4 9.3 L9.4 8.6 Z" stroke={c} {...sw} />,
  time: (c) => (
    <>
      <circle cx="12" cy="12" r="9" stroke={c} {...sw} />
      <path d="M12 7 V12 L15.5 14" stroke={c} {...sw} />
    </>
  ),
  chat: (c) => (
    <>
      <path d="M4 5 H20 V15 H10 L6 19 V15 H4 Z" stroke={c} {...sw} />
      <circle cx="9" cy="10" r="1.1" fill={c} />
      <circle cx="12" cy="10" r="1.1" fill={c} />
      <circle cx="15" cy="10" r="1.1" fill={c} />
    </>
  ),
  family: (c) => (
    <>
      <circle cx="8" cy="7" r="2.8" stroke={c} {...sw} />
      <circle cx="16.5" cy="9" r="2.2" stroke={c} {...sw} />
      <path d="M3 20 Q3 12.5 8 12.5 Q13 12.5 13 20 M12.5 20 Q12.5 14.5 16.5 14.5 Q20.5 14.5 20.5 20" stroke={c} {...sw} />
    </>
  ),
  phone: (c) => <rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke={c} {...sw} />,
  tablet: (c) => <rect x="4" y="3" width="16" height="18" rx="2.5" stroke={c} {...sw} />,
  laptop: (c) => (
    <>
      <rect x="5" y="5" width="14" height="10" rx="1.5" stroke={c} {...sw} />
      <path d="M2.5 18.5 H21.5" stroke={c} {...sw} />
    </>
  ),
  checkCircle: (c) => (
    <>
      <circle cx="12" cy="12" r="9" fill={c} />
      <path d="M7.5 12.3 L10.6 15.2 L16.5 9" stroke={colors.white} {...sw} strokeWidth={2.4} />
    </>
  ),
  alert: (c) => (
    <>
      <circle cx="12" cy="12" r="9" fill={c} />
      <path d="M12 7 V13" stroke={colors.white} {...sw} strokeWidth={2.4} />
      <circle cx="12" cy="16.6" r="1.3" fill={colors.white} />
    </>
  ),
};

export const MiniIcon: React.FC<P & {name: string}> = ({name, size, color = colors.white}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    {icons[name]?.(color)}
  </svg>
);
