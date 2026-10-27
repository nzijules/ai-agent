import {interpolate, useCurrentFrame} from 'remotion';
import type {SubtitleCue} from '../config/scripts';
import {FONT} from '../lib/fonts';
import {useFormat} from '../lib/format';

export const MIN_SUBTITLE_PX = 44;

/** Sous-titres de la voix off, par groupes de 3 à 5 mots, au-dessus de la zone basse réservée. */
export const Subtitles: React.FC<{cues: SubtitleCue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {u, safe, width} = useFormat();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const t = frame - cue.from;
  const appear = interpolate(t, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  const size = Math.max(MIN_SUBTITLE_PX, 50 * u);
  return (
    <div
      style={{
        position: 'absolute',
        left: safe.left,
        width: width - safe.left - safe.right,
        bottom: safe.bottom + 24 * u,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.25,
          color: '#FFFFFF',
          background: 'rgba(12, 10, 9, 0.74)',
          borderRadius: 14 * u,
          padding: `${10 * u}px ${24 * u}px`,
          textAlign: 'center',
          opacity: appear,
          transform: `scale(${0.96 + 0.04 * appear})`,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
