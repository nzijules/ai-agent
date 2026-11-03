import React from 'react';

export const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const m = (c: number) => Math.round(Math.min(255, Math.max(0, f < 1 ? c * f : c + (255 - c) * (f - 1))));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
};

export const SKINS = ['#7A4A2A', '#5E3A22', '#8E5B37', '#6A4127', '#4B2E1D', '#A06A43'];

export type PersonProps = {
  t: number;
  skin?: string;
  hair?: 'short' | 'bun' | 'wrap' | 'braids' | 'fade' | 'locs' | 'bald';
  hairColor?: string;
  outfit?: string;
  accent?: string;
  wrapColor?: string;
  headset?: boolean;
  mood?: 'neutral' | 'smile' | 'worried' | 'focused';
  look?: number;
  lookY?: number;
  beard?: boolean;
  glasses?: boolean;
  earrings?: boolean;
  talking?: number; // 0..1 amplitude
  seed?: number;
  tilt?: number;
  style?: React.CSSProperties;
  width?: number;
};

export const Person: React.FC<PersonProps> = ({
  t, skin = SKINS[0], hair = 'short', hairColor = '#121010', outfit = '#FFCB05', accent = '#111',
  wrapColor = '#D9480F', headset = false, mood = 'neutral', look = 0, lookY = 0, beard = false, glasses = false,
  earrings = false, talking = 0, seed = 0, tilt = 0, style, width = 400,
}) => {
  const sk = skin, skD = shade(skin, 0.78), skDD = shade(skin, 0.6), skL = shade(skin, 1.12);
  // clignement des yeux
  const bp = ((t + seed * 1.37) % 3.9) / 3.9;
  const blink = bp > 0.965 ? 0.12 : 1;
  const ex = look * 5, ey = lookY * 3;
  const browY = mood === 'worried' ? -4 : mood === 'focused' ? 2 : 0;
  const mouthOpen = talking > 0 ? Math.max(0, Math.sin(t * 17 + seed) * Math.sin(t * 6.3 + seed * 2)) * 9 * talking : 0;
  const breathe = Math.sin(t * 1.6 + seed) * 2;
  return (
    <svg viewBox="0 0 400 480" width={width} height={(width * 480) / 400} style={{overflow: 'visible', ...style}}>
      <g transform={`translate(0 ${breathe * 0.3})`}>
        {/* cheveux arrière */}
        {hair === 'braids' && (
          <g fill={hairColor}>
            <path d="M128 190 C110 260 112 330 124 380 L146 378 C138 320 140 260 150 210 Z" />
            <path d="M272 190 C290 260 288 330 276 380 L254 378 C262 320 260 260 250 210 Z" />
          </g>
        )}
        {hair === 'locs' && (
          <g fill={hairColor}>
            {[...Array(9)].map((_, i) => (
              <rect key={i} x={118 + i * 20} y={150} width={14} height={150 + (i % 3) * 25} rx={7} />
            ))}
          </g>
        )}
        {/* torse */}
        <g transform={`translate(0 ${breathe})`}>
          <path d="M26 482 C34 402 98 352 200 346 C302 352 366 402 374 482 Z" fill={outfit} />
          <path d="M200 346 C302 352 366 402 374 482 L250 482 C260 430 250 380 200 346 Z" fill="#000" opacity={0.12} />
          <path d="M160 346 L200 398 L180 404 L146 356 Z" fill={accent} opacity={0.9} />
          <path d="M240 346 L200 398 L220 404 L254 356 Z" fill={accent} opacity={0.9} />
        </g>
        {/* cou */}
        <path d="M170 262 L170 350 Q200 372 230 350 L230 262 Z" fill={skD} />
        <g transform={`rotate(${tilt} 200 300)`}>
          {/* oreilles */}
          <ellipse cx={126} cy={212} rx={13} ry={21} fill={skD} />
          <ellipse cx={274} cy={212} rx={13} ry={21} fill={skD} />
          {earrings && (
            <g fill="#F2C14E">
              <circle cx={126} cy={238} r={6} />
              <circle cx={274} cy={238} r={6} />
            </g>
          )}
          {/* tête */}
          <ellipse cx={200} cy={200} rx={76} ry={92} fill={sk} />
          <path d="M235 120 C285 150 290 250 240 288 C262 240 265 170 235 120 Z" fill={skDD} opacity={0.35} />
          <ellipse cx={170} cy={150} rx={26} ry={14} fill={skL} opacity={0.25} />
          {/* cheveux avant */}
          {(hair === 'short' || hair === 'fade') && (
            <path
              d="M124 196 C116 122 156 98 200 98 C248 98 286 124 276 196 C270 160 252 136 200 134 C150 136 130 160 124 196 Z"
              fill={hairColor}
              opacity={hair === 'fade' ? 0.92 : 1}
            />
          )}
          {hair === 'bun' && (
            <g fill={hairColor}>
              <circle cx={200} cy={86} r={36} />
              <path d="M124 200 C114 120 156 104 200 104 C246 104 288 122 276 200 C268 150 246 132 200 130 C154 132 132 150 124 200 Z" />
            </g>
          )}
          {hair === 'braids' && (
            <g>
              <path d="M124 200 C114 118 156 100 200 100 C246 100 288 118 276 200 C268 150 246 132 200 130 C154 132 132 150 124 200 Z" fill={hairColor} />
              {[-30, -12, 6, 24].map((o, i) => (
                <path key={i} d={`M${200 + o} 104 Q${200 + o * 1.4} 120 ${200 + o * 1.9} 140`} stroke="#3a2a22" strokeWidth={2} fill="none" opacity={0.5} />
              ))}
            </g>
          )}
          {hair === 'locs' && (
            <path d="M122 200 C110 112 156 96 200 96 C248 96 292 112 278 200 C270 150 246 128 200 126 C154 128 130 150 122 200 Z" fill={hairColor} />
          )}
          {hair === 'wrap' && (
            <g>
              <path d="M116 190 C106 108 150 66 204 66 C262 68 298 108 284 190 C272 150 244 132 200 132 C158 132 130 150 116 190 Z" fill={wrapColor} />
              <ellipse cx={232} cy={70} rx={46} ry={28} fill={wrapColor} transform="rotate(-18 232 70)" />
              <ellipse cx={176} cy={66} rx={36} ry={22} fill={shade(wrapColor, 0.8)} transform="rotate(16 176 66)" />
              {[0, 1, 2, 3].map((i) => (
                <path key={i} d={`M${130 + i * 6} ${170 - i * 26} C${170} ${120 - i * 22} ${235} ${118 - i * 22} ${272 - i * 6} ${168 - i * 26}`} stroke="#FFCB05" strokeWidth={5} fill="none" opacity={0.75} />
              ))}
            </g>
          )}
          {/* sourcils */}
          <g stroke={hairColor === '#121010' ? '#0d0b0a' : hairColor} strokeWidth={6} strokeLinecap="round" fill="none">
            <path d={mood === 'worried' ? `M154 ${178 + browY} Q168 ${170 + browY} 186 ${166 + browY}` : `M154 ${176 + browY} Q170 ${168 + browY} 188 ${174 + browY}`} />
            <path d={mood === 'worried' ? `M246 ${178 + browY} Q232 ${170 + browY} 214 ${166 + browY}` : `M246 ${176 + browY} Q230 ${168 + browY} 212 ${174 + browY}`} />
          </g>
          {/* yeux */}
          <g transform={`translate(0 ${200}) scale(1 ${blink}) translate(0 ${-200})`}>
            <ellipse cx={170} cy={200} rx={14} ry={9.5} fill="#fff" />
            <ellipse cx={230} cy={200} rx={14} ry={9.5} fill="#fff" />
            <circle cx={170 + ex} cy={200 + ey} r={6.8} fill="#2a1a12" />
            <circle cx={230 + ex} cy={200 + ey} r={6.8} fill="#2a1a12" />
            <circle cx={172 + ex} cy={198 + ey} r={2} fill="#fff" />
            <circle cx={232 + ex} cy={198 + ey} r={2} fill="#fff" />
          </g>
          {glasses && (
            <g stroke="#1b1b1b" strokeWidth={4} fill="none">
              <rect x={146} y={184} width={48} height={34} rx={10} />
              <rect x={206} y={184} width={48} height={34} rx={10} />
              <path d="M194 198 L206 198" />
            </g>
          )}
          {/* nez */}
          <path d="M197 208 Q188 236 198 242 Q212 242 209 232" stroke={skDD} strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* bouche */}
          {mouthOpen > 0.6 ? (
            <ellipse cx={200} cy={264} rx={17} ry={2 + mouthOpen * 0.6} fill="#3a1414" />
          ) : mood === 'smile' ? (
            <path d="M176 258 Q200 280 224 258 Q200 268 176 258 Z" fill="#5a1f1f" stroke={shade(sk, 0.5)} strokeWidth={3} />
          ) : mood === 'worried' ? (
            <path d="M182 268 Q200 258 218 268" stroke={shade(sk, 0.45)} strokeWidth={5} fill="none" strokeLinecap="round" />
          ) : (
            <path d="M182 263 Q200 268 218 263" stroke={shade(sk, 0.45)} strokeWidth={5} fill="none" strokeLinecap="round" />
          )}
          {beard && <path d="M128 222 C134 300 170 296 200 298 C230 296 266 300 272 222 C262 270 236 280 200 282 C164 280 138 270 128 222 Z" fill={hairColor} opacity={0.88} />}
          {/* micro-casque */}
          {headset && (
            <g>
              <path d="M118 200 C112 70 288 70 282 200" stroke="#1d1d1f" strokeWidth={11} fill="none" strokeLinecap="round" />
              <rect x={108} y={186} width={30} height={50} rx={12} fill="#1d1d1f" />
              <rect x={262} y={186} width={30} height={50} rx={12} fill="#1d1d1f" />
              <rect x={113} y={200} width={6} height={22} rx={3} fill="#FFCB05" />
              <path d="M124 232 C130 276 156 284 176 276" stroke="#1d1d1f" strokeWidth={6} fill="none" strokeLinecap="round" />
              <circle cx={180} cy={274} r={8} fill="#2b2b2e" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

/** Silhouette encapuchonnée (fraudeur) – visage dans l'ombre, éclairé par l'écran du téléphone. */
export const Hooded: React.FC<{t: number; width?: number; rim?: string; phone?: boolean}> = ({t, width = 420, rim = '#E5332A', phone = true}) => {
  const b = Math.sin(t * 1.4) * 2;
  const glow = 0.55 + Math.sin(t * 9) * 0.05;
  return (
    <svg viewBox="0 0 400 480" width={width} height={(width * 480) / 400} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="phoneglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9fd4ff" stopOpacity={glow} />
          <stop offset="1" stopColor="#9fd4ff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(0 ${b})`}>
        <path d="M20 482 C30 380 90 330 200 324 C310 330 370 380 380 482 Z" fill="#141418" />
        <path d="M20 482 C30 380 90 330 200 324 L180 340 C110 350 60 400 50 482 Z" fill={rim} opacity={0.55} />
        <path d="M108 240 C96 110 150 52 206 52 C268 54 312 110 296 250 C290 300 260 340 200 344 C140 340 114 300 108 240 Z" fill="#17171c" />
        <path d="M108 240 C96 110 150 52 206 52 C160 70 128 120 126 240 C128 290 150 320 170 336 C134 326 112 296 108 240 Z" fill={rim} opacity={0.6} />
        <path d="M138 230 C134 150 170 112 204 112 C244 112 272 150 266 232 C262 280 236 306 202 308 C168 306 142 280 138 230 Z" fill="#050507" />
        <path d="M150 300 Q200 330 250 300" stroke={rim} strokeWidth={3} opacity={0.4} fill="none" />
        {phone && (
          <g>
            <ellipse cx={250} cy={280} rx={90} ry={70} fill="url(#phoneglow)" />
            <rect x={232} y={250} width={44} height={78} rx={8} fill="#0b0b0e" stroke="#2a2a30" strokeWidth={2} transform="rotate(-12 254 289)" />
            <rect x={237} y={256} width={34} height={64} rx={5} fill="#bfe3ff" opacity={0.85} transform="rotate(-12 254 289)" />
            <path d="M222 300 C214 330 222 350 246 352 L270 330" fill="#141418" />
          </g>
        )}
      </g>
    </svg>
  );
};
