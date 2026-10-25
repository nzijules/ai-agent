import React from 'react';
import {interpolate} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP} from '../anim';
import {colors, fonts} from '../theme';
import {AnimatedIcon} from './Icons';
import {glass} from './ui';

/** Carte « verre dépoli » avec icône animée et libellé (scène 2). */
export const ProblemCard: React.FC<{start: number; w: number; h: number; frame: number; icon: string; label: string; fontSize: number; tilt?: number; accent?: string}> = ({
  start,
  w,
  h,
  frame,
  icon,
  label,
  fontSize,
  tilt = -6,
  accent = colors.coral,
}) => {
  const p = sp(frame, start, SPRING_POP);
  const drawP = interpolate(frame, [start, start + 26], [0, 1], {...clamp, easing: easeOut});
  const drift = Math.sin((frame + start) / 30) * 6; // parallaxe légère
  return (
    <div
      style={{
        ...glass,
        width: w,
        height: h,
        borderRadius: 30,
        padding: w * 0.09,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: p,
        transform: `translateY(${(1 - p) * 80 + drift}px) scale(${0.85 + 0.15 * p}) rotate(${(1 - p) * tilt}deg)`,
      }}
    >
      <div
        style={{
          width: h * 0.42,
          height: h * 0.42,
          borderRadius: h * 0.12,
          background: `${accent}22`,
          border: `2px solid ${accent}66`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatedIcon name={icon} size={h * 0.32} p={drawP} f={frame} accent={accent} />
      </div>
      <div style={{fontFamily: fonts.display, fontWeight: 700, color: colors.white, fontSize, lineHeight: 1.15, letterSpacing: '-0.01em'}}>{label}</div>
    </div>
  );
};
