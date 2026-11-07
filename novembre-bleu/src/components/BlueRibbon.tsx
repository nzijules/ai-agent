import React from 'react';
import {getLength} from '@remotion/paths';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../styles/theme';

// Ruban de sensibilisation (ligne médiane, viewBox 0 0 400 600)
const LOOP =
  'M 118 572 L 200 338 C 236 236 286 168 272 116 C 258 58 142 58 128 116 C 114 168 164 236 200 338';
const TAIL = 'M 200 338 L 282 572';
const LOOP_LEN = getLength(LOOP);
const TAIL_LEN = getLength(TAIL);

/**
 * Ruban bleu animé : tracé progressif (stroke draw), remplissage en dégradé,
 * reflet satiné qui balaie le ruban, respiration lente.
 */
export const BlueRibbon: React.FC<{
  at?: number;
  drawFrames?: number;
  size: number;
  style?: React.CSSProperties;
  glow?: boolean;
}> = ({at = 0, drawFrames = 34, size, style, glow = true}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const ease = Easing.bezier(0.65, 0, 0.35, 1);
  const p1 = interpolate(t, [0, drawFrames * 0.72], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const p2 = interpolate(t, [drawFrames * 0.6, drawFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const sheen = interpolate(t, [drawFrames * 0.8, drawFrames * 0.8 + 40], [-0.6, 1.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const breathe = 1 + Math.sin(t / 24) * 0.012;
  const W = 52;
  const stroke = (d: string, len: number, p: number, id: string) => (
    <>
      {/* ombre portée interne pour l'effet de pli */}
      <path d={d} fill="none" stroke="#020814" strokeOpacity={0.35} strokeWidth={W + 6} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <path d={d} fill="none" stroke={`url(#rb-grad-${id})`} strokeWidth={W} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <path d={d} fill="none" stroke="url(#rb-sheen)" strokeWidth={W} strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{mixBlendMode: 'screen'}} />
      <path d={d} fill="none" stroke={colors.white} strokeOpacity={0.22} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform="translate(-14 0)" />
    </>
  );
  if (t < 0) return null;
  return (
    <div style={{width: size, height: size * 1.5, transform: `scale(${breathe})`, ...style}}>
      <svg viewBox="0 0 400 600" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="rb-grad-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={colors.electric} />
            <stop offset="0.55" stopColor="#1D5FC0" />
            <stop offset="1" stopColor={colors.blue} />
          </linearGradient>
          <linearGradient id="rb-grad-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3AA0F0" />
            <stop offset="1" stopColor="#1650B0" />
          </linearGradient>
          <linearGradient id="rb-sheen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="600">
            <stop offset={Math.max(0, sheen - 0.15)} stopColor="#ffffff" stopOpacity={0} />
            <stop offset={Math.min(1, Math.max(0, sheen))} stopColor="#ffffff" stopOpacity={0.55} />
            <stop offset={Math.min(1, Math.max(0, sheen + 0.15))} stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          <filter id="rb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        {glow && (
          <g filter="url(#rb-glow)" opacity={0.55 * p2}>
            <path d={LOOP} fill="none" stroke={colors.electric} strokeWidth={W} />
            <path d={TAIL} fill="none" stroke={colors.electric} strokeWidth={W} />
          </g>
        )}
        {stroke(LOOP, LOOP_LEN, p1, 'a')}
        {stroke(TAIL, TAIL_LEN, p2, 'b')}
      </svg>
    </div>
  );
};
