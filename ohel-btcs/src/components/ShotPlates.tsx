import {AbsoluteFill, Sequence} from 'remotion';
import type {TimedSegment} from '../config/scripts';
import {PhotoPlate} from './PhotoPlate';

/** Un plan photo par plan du script (champ `image` + `move` dans scripts.ts). */
export const ShotPlates: React.FC<{segment: TimedSegment; sequenceFrames: number; shade?: number}> = ({segment, sequenceFrames, shade}) => (
  <AbsoluteFill style={{backgroundColor: '#0E0A08'}}>
    {segment.shots.map((shot, i) => {
      if (!shot.image) return null;
      const last = i === segment.shots.length - 1;
      const frames = last ? sequenceFrames - shot.from : shot.frames;
      return (
        <Sequence key={i} from={shot.from} durationInFrames={frames} layout="none">
          <PhotoPlate id={shot.image} frames={frames} move={shot.move} shade={shade} fit={shot.fit} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const hasShotImages = (segment: TimedSegment) => segment.shots.some((s) => s.image);
