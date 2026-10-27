import {interpolate, useCurrentFrame} from 'remotion';
import type {SubtitleCue} from '../config/scripts';
import {FONT} from '../lib/fonts';
import {useFormat} from '../lib/format';

export const MIN_SUBTITLE_PX = 44;

/**
 * Sous-titres de la voix off, style unique pour toute la vidéo : une ligne,
 * même taille, même position (au-dessus de la zone basse réservée), même fondu.
 */
export const Subtitles: React.FC<{cues: SubtitleCue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {u, safe, width} = useFormat();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const fadeIn = interpolate(frame - cue.from, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(cue.to - frame, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  const o = Math.min(fadeIn, fadeOut);
  const size = Math.max(MIN_SUBTITLE_PX, 46 * u);
  return (
    <div
      style={{
        position: 'absolute',
        left: safe.left,
        width: width - safe.left - safe.right,
        bottom: safe.bottom + 40 * u,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.2,
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          background: 'rgba(10, 8, 7, 0.78)',
          borderRadius: 12 * u,
          padding: `${12 * u}px ${28 * u}px`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          textAlign: 'center',
          opacity: o,
          transform: `translateY(${(1 - fadeIn) * 8 * u}px)`,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
