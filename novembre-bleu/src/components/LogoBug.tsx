import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {useLayout} from './layout';
import {PLACED_LINES} from '../data/timeline';

const BRAND_LINE = PLACED_LINES.find((l) => l.id === 'L21')!;

/**
 * Logo AroSoft en haut à droite, format réduit, sans fond blanc ni slogan.
 * Variante "reverse" (lettres navy passées en blanc) pour la lisibilité sur fonds sombres.
 * ⚠️ Variante dérivée du fichier fourni : à faire valider par le titulaire de la marque.
 */
export const LogoBug: React.FC<{appearAt?: number}> = ({appearAt = 12}) => {
  const frame = useCurrentFrame();
  const {vertical, u, safe} = useLayout();
  const o = Math.min(1, interpolate(frame, [appearAt, appearAt + 20], [0, 0.92], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  // léger éclat lorsque la voix prononce « AroSoft… »
  const hl = interpolate(frame, [BRAND_LINE.startFrame - 4, BRAND_LINE.startFrame + 10, BRAND_LINE.startFrame + 40], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const w = (vertical ? 150 : 128) * u * (1 + hl * 0.08);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <Img
        src={staticFile('assets/logos/arosoft-logo-reverse.png')}
        style={{
          position: 'absolute',
          top: vertical ? 120 : 56 * u,
          right: vertical ? safe.right : 72 * u,
          width: w,
          height: 'auto',
          opacity: o,
          filter: `drop-shadow(0 4px 14px rgba(3,11,25,0.55)) drop-shadow(0 0 ${hl * 18}px rgba(39,140,224,${hl * 0.9}))`,
          transformOrigin: 'top right',
        }}
      />
    </AbsoluteFill>
  );
};
