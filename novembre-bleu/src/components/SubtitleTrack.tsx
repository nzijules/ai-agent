import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SUBTITLE_CUES} from '../data/timeline';
import {colors, fonts} from '../styles/theme';
import {useLayout} from './layout';

/**
 * Piste de sous-titres intégrée (mêmes repères que le fichier SRT exporté).
 * Placée au-dessus de la zone d'interface basse des plateformes mobiles.
 */
export const SubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, u, safe, width} = useLayout();
  const cue = SUBTITLE_CUES.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!cue) return null;
  const fadeIn = interpolate(frame, [cue.startFrame, cue.startFrame + 4], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [cue.endFrame - 4, cue.endFrame], [1, 0], {extrapolateLeft: 'clamp'});
  const bottom = vertical ? 330 : 64;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          marginBottom: bottom,
          maxWidth: vertical ? width - 2 * safe.left : width * 0.66,
          padding: `${12 * u}px ${26 * u}px`,
          borderRadius: 14 * u,
          background: 'rgba(3, 11, 25, 0.58)',
          color: colors.white,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: (vertical ? 44 : 40) * u,
          lineHeight: 1.3,
          textAlign: 'center',
          opacity: Math.min(fadeIn, fadeOut),
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};
