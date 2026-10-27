import {AbsoluteFill} from 'remotion';
import type {TimedSegment} from '../config/scripts';
import {useFormat} from '../lib/format';
import type {TitlePlacement} from '../scenes/types';
import {KineticTitle} from './KineticTitle';
import {Subtitles} from './Subtitles';

/**
 * Couche de texte unique d'une scène : pour chaque plan, SOIT le titre animé,
 * SOIT les sous-titres, jamais les deux (textLayer dans scripts.ts).
 */
export const ShotText: React.FC<{segment: TimedSegment; placement: TitlePlacement}> = ({segment, placement}) => {
  const {safe, width, height, u} = useFormat();
  const innerW = width - safe.left - safe.right;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {segment.shots.map((shot, i) => {
        if (shot.textLayer === 'subtitles') return <Subtitles key={i} cues={shot.cues} />;
        if (shot.textLayer !== 'title' || placement === 'scene') return null;
        const pos: React.CSSProperties =
          placement === 'top'
            ? {top: safe.top + 20 * u}
            : placement === 'center'
              ? {top: height / 2, transform: 'translateY(-50%)'}
              : {bottom: safe.bottom + 30 * u};
        return (
          <div key={i} style={{position: 'absolute', left: safe.left, width: innerW, ...pos}}>
            <KineticTitle lines={shot.title!} from={shot.from} frames={shot.frames} maxWidth={innerW} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
