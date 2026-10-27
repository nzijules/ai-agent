import type {TimedSegment} from '../config/scripts';

export type SceneProps = {
  segment: TimedSegment;
  /** Durée réelle de la séquence (scène + recouvrement de la transition suivante). */
  sequenceFrames: number;
};

/**
 * Où la couche titre est posée. 'scene' : la scène place elle-même le titre
 * (ex. CTA) via <SceneTitle>.
 */
export type TitlePlacement = 'top' | 'bottom' | 'center' | 'scene';
