import {useCurrentFrame} from 'remotion';
import {SUBTITLE_LINE_CHARS, splitLine, type SubtitleCue} from '../config/scripts';
import {useFormat} from '../lib/format';
import {KineticTitle} from './KineticTitle';

/**
 * Texte de la voix off, dans le même style que les titres (capitales, même police,
 * même position, même animation), sans l'aplat rouge réservé aux messages clés.
 */
export const Subtitles: React.FC<{cues: SubtitleCue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {u, safe, width} = useFormat();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const innerW = width - safe.left - safe.right;
  const lines = splitLine(cue.text.toUpperCase(), SUBTITLE_LINE_CHARS).map((text) => ({text}));
  return (
    <div style={{position: 'absolute', left: safe.left, width: innerW, bottom: safe.bottom + 30 * u}}>
      <KineticTitle lines={lines} from={cue.from} frames={cue.to - cue.from} maxWidth={innerW} baseSize={84 * u} />
    </div>
  );
};
