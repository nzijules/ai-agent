import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../styles/theme';

/** Fond dégradé animé (lumière qui évolue pendant le plan). */
export const Backdrop: React.FC<{
  from: string[];
  to?: string[];
  angle?: number;
  radial?: {x: string; y: string; color: string; size?: string};
}> = ({from, to, angle = 180, radial}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mix = (a: string, b: string) => {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - p) + ((pb >> s) & 255) * p));
    return `rgb(${c.join(',')})`;
  };
  const stops = from.map((c, i) => (to ? mix(c, to[i] ?? c) : c));
  return (
    <AbsoluteFill style={{background: `linear-gradient(${angle}deg, ${stops.join(', ')})`}}>
      {radial && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(${radial.size ?? 'circle at'} ${radial.x} ${radial.y}, ${radial.color} 0%, transparent 60%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export const NavyBackdrop: React.FC = () => (
  <Backdrop from={[colors.navyDeep, colors.navy, '#0A2350']} angle={170} />
);
