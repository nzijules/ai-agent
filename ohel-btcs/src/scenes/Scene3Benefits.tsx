import {AbsoluteFill, Sequence} from 'remotion';
import {PhotoPlate, type CameraMove} from '../components/PhotoPlate';
import {ShotPlates, hasShotImages} from '../components/ShotPlates';
import type {AssetId} from '../config/assets';
import type {Shot} from '../config/scripts';
import type {SceneProps} from './types';

/** Plan photo de chaque carte : la même villa, en chantier ou terminée selon l'argument. */
const PLATES: Record<NonNullable<Shot['card']> | 'intro', {id: AssetId; move: CameraMove}> = {
  intro: {id: 'villaChantier', move: {x: [62, 45], scale: [1.04, 1.1]}},
  thermique: {id: 'villaChantier', move: {x: [45, 55], y: [55, 50], scale: [1.3, 1.18]}},
  pluie: {id: 'villaHook', move: {x: [60, 42], scale: [1.08, 1.16]}},
  architecture: {id: 'villaHook', move: {x: [60, 42], scale: [1.08, 1.16]}},
  local: {id: 'villaChantier', move: {x: [8, 22], y: [88, 75], scale: [2.1, 1.7]}},
};

/** Scène 3 — Les preuves d'usage (titres posés par ShotText). */
export const Scene3Benefits: React.FC<SceneProps> = ({segment, sequenceFrames}) =>
  hasShotImages(segment) ? (
    <ShotPlates segment={segment} sequenceFrames={sequenceFrames} shade={0.7} />
  ) : (
    <AbsoluteFill style={{backgroundColor: '#0E0A08'}}>
      {segment.shots.map((shot, i) => {
        const last = i === segment.shots.length - 1;
        const frames = last ? sequenceFrames - shot.from : shot.frames;
        const plate = PLATES[shot.card ?? 'intro'];
        return (
          <Sequence key={i} from={shot.from} durationInFrames={frames} layout="none">
            <PhotoPlate id={plate.id} frames={frames} move={plate.move} shade={0.7} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
