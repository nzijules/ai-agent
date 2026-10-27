import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PhotoPlate} from '../components/PhotoPlate';
import type {SceneProps} from './types';

/** Scène 6 — Projection : la villa au crépuscule, la nuit tombe et les lumières s'allument. */
export const Scene6Projection: React.FC<SceneProps> = ({segment, sequenceFrames}) => {
  const frame = useCurrentFrame();
  const second = segment.shots[1]?.from ?? sequenceFrames / 2;
  const night = interpolate(frame, [second - 20, second + 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const move = {x: [62, 45] as [number, number], scale: [1.16, 1.06] as [number, number]};
  return (
    <AbsoluteFill>
      <PhotoPlate id="villaHook" frames={sequenceFrames} move={move} />
      <AbsoluteFill style={{opacity: night}}>
        <PhotoPlate id="villaNuit" frames={sequenceFrames} move={move} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
