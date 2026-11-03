import React from 'react';
import {Person, SKINS} from './Person';

/** Décor : plateau de centre de relation client avec vue sur Abidjan (Plateau, lagune Ébrié). */
export const Office: React.FC<{t: number; mood?: 'day' | 'dim' | 'bright'; blurBg?: number}> = ({t, mood = 'day', blurBg = 3}) => {
  const sky = mood === 'dim' ? ['#2b3448', '#5b4a52'] : mood === 'bright' ? ['#bfe6ff', '#fff4cf'] : ['#9fd0ee', '#fde6b3'];
  const towers = [
    [70, 330, 90], [170, 250, 70], [250, 380, 60], [320, 210, 110], [440, 300, 80], [530, 170, 95], [640, 260, 70],
    [720, 330, 60], [790, 230, 100], [905, 140, 85], [1000, 290, 70], [1080, 200, 90], [1185, 320, 80], [1270, 240, 100],
    [1380, 160, 80], [1470, 300, 70], [1550, 220, 95], [1660, 280, 80], [1750, 190, 90], [1850, 310, 70],
  ];
  const shimmer = (i: number) => 0.25 + 0.25 * Math.sin(t * 2 + i);
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mood === 'dim' ? '#1a1d24' : '#e9e6df'} />
          <stop offset="1" stopColor={mood === 'dim' ? '#101216' : '#cfcac0'} />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mood === 'dim' ? '#15171c' : '#b9b2a6'} />
          <stop offset="1" stopColor={mood === 'dim' ? '#0a0b0d' : '#8e877b'} />
        </linearGradient>
        <filter id="bgblur"><feGaussianBlur stdDeviation={blurBg} /></filter>
      </defs>
      <rect width={1920} height={1080} fill="url(#wall)" />
      {/* baie vitrée */}
      <g filter="url(#bgblur)">
        <rect x={0} y={60} width={1920} height={560} fill="url(#sky)" />
        {/* Plateau – tours */}
        {towers.map(([x, h, w], i) => (
          <g key={i}>
            <rect x={x} y={520 - h} width={w} height={h} fill={mood === 'dim' ? '#1d2433' : '#7d93a8'} opacity={0.85} />
            {[...Array(Math.floor(h / 26))].map((_, j) => (
              <rect key={j} x={x + 8} y={530 - h + j * 26} width={w - 16} height={6} fill="#fff" opacity={mood === 'dim' ? 0.25 : 0.18} />
            ))}
          </g>
        ))}
        {/* tour pyramidale */}
        <path d="M600 520 L640 330 L700 330 L740 520 Z" fill={mood === 'dim' ? '#252d3d' : '#6c8297'} />
        {/* pont + lagune */}
        <rect x={0} y={520} width={1920} height={100} fill={mood === 'dim' ? '#1b2a3a' : '#5fa3c4'} />
        {[...Array(14)].map((_, i) => (
          <rect key={i} x={(i * 151 + t * 30) % 1920} y={540 + (i % 4) * 18} width={90} height={3} fill="#fff" opacity={shimmer(i)} />
        ))}
        <path d="M0 515 L1920 505" stroke={mood === 'dim' ? '#39465a' : '#e8e2d4'} strokeWidth={10} />
        {[200, 600, 1000, 1400, 1800].map((x) => (
          <path key={x} d={`M${x} 510 L${x} 470 M${x - 90} 512 Q${x} 455 ${x + 90} 508`} stroke={mood === 'dim' ? '#39465a' : '#e8e2d4'} strokeWidth={5} fill="none" />
        ))}
      </g>
      {/* montants de la baie */}
      {[0, 384, 768, 1152, 1536, 1920].map((x) => (
        <rect key={x} x={x - 12} y={60} width={24} height={560} fill={mood === 'dim' ? '#0d0f13' : '#d8d3ca'} />
      ))}
      <rect x={0} y={600} width={1920} height={24} fill={mood === 'dim' ? '#0d0f13' : '#d8d3ca'} />
      <rect x={0} y={40} width={1920} height={24} fill={mood === 'dim' ? '#0d0f13' : '#d8d3ca'} />
      {/* reflets */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${200 + i * 640 + Math.sin(t * 0.3) * 30} 60 l160 0 l-260 560 l-160 0 Z`} fill="#fff" opacity={0.07} />
      ))}
      {/* sol */}
      <rect x={0} y={620} width={1920} height={460} fill="url(#floor)" />
      {/* rangée arrière : collègues (profondeur de champ) */}
      <g filter="url(#bgblur)">
        {[180, 560, 1000, 1400, 1760].map((x, i) => (
          <g key={x} transform={`translate(${x - 90} 520)`}>
            <Person t={t} width={180} skin={SKINS[(i + 2) % SKINS.length]} hair={(['short', 'bun', 'wrap', 'fade', 'braids'] as const)[i]} outfit={i % 2 ? '#1c1c1f' : '#FFCB05'} accent={i % 2 ? '#FFCB05' : '#1c1c1f'} headset seed={i * 3} look={Math.sin(t * 0.4 + i)} talking={i % 2 ? 0.6 : 0} wrapColor={['#C2410C', '#7C3AED', '#0F766E'][i % 3]} />
          </g>
        ))}
        {[0, 1].map((r) => (
          <rect key={r} x={0} y={690 + r * 4} width={1920} height={70} fill={mood === 'dim' ? '#22252c' : '#f2efe9'} opacity={r ? 0.3 : 1} />
        ))}
        {[120, 500, 940, 1340, 1700].map((x) => (
          <g key={x}>
            <rect x={x} y={600} width={150} height={92} rx={6} fill="#1b1d22" />
            <rect x={x + 6} y={606} width={138} height={78} rx={3} fill={mood === 'dim' ? '#3a4a6a' : '#cfe3f5'} opacity={0.8} />
          </g>
        ))}
      </g>
    </svg>
  );
};
