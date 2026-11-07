import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../styles/theme';

export type TransitionKind = 'flare' | 'iris' | 'wipe' | 'dissolve' | 'rise';

/**
 * Entrée d'un plan par la lumière : masque animé + balayage lumineux.
 *  - flare    : fondu + éclat lumineux doré/bleu qui traverse l'image
 *  - iris     : masque circulaire qui s'ouvre depuis un point (transition morphologique)
 *  - wipe     : masque diagonal doux
 *  - dissolve : fondu enchaîné simple
 *  - rise     : le plan monte du bas avec un masque doux
 */
export const LightTransition: React.FC<React.PropsWithChildren<{
  kind?: TransitionKind;
  duration?: number;
  origin?: {x: string; y: string};
  tint?: string;
}>> = ({children, kind = 'flare', duration = 14, origin = {x: '50%', y: '50%'}, tint = colors.gold}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  let style: React.CSSProperties = {};
  if (kind === 'iris') {
    const r = p * 150;
    const mask = `radial-gradient(circle at ${origin.x} ${origin.y}, #000 ${r}%, transparent ${r + 12}%)`;
    style = {WebkitMaskImage: mask, maskImage: mask};
  } else if (kind === 'wipe') {
    const pos = -30 + p * 160;
    const mask = `linear-gradient(115deg, #000 ${pos - 20}%, transparent ${pos + 10}%)`;
    style = {WebkitMaskImage: mask, maskImage: mask};
  } else if (kind === 'rise') {
    const pos = 130 - p * 160;
    const mask = `linear-gradient(0deg, #000 ${100 - pos}%, transparent ${130 - pos}%)`;
    style = {WebkitMaskImage: mask, maskImage: mask, transform: `translateY(${(1 - p) * 60}px)`};
  } else {
    style = {opacity: p};
  }
  const flare = kind === 'flare' || kind === 'iris' || kind === 'wipe';
  const flareP = interpolate(frame, [0, duration * 0.5, duration * 1.4], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={p >= 1 ? undefined : style}>{children}</AbsoluteFill>
      {flare && flareP > 0.01 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(115deg, transparent ${-40 + p * 120}%, ${tint}55 ${-20 + p * 120}%, ${colors.white}66 ${-14 + p * 120}%, ${colors.electric}44 ${-6 + p * 120}%, transparent ${10 + p * 120}%)`,
            mixBlendMode: 'screen',
            opacity: flareP,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
