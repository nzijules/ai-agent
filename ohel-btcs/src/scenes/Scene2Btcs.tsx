import {BtcsBlockAnimation} from '../components/BtcsBlockAnimation';
import {PhotoPlate} from '../components/PhotoPlate';
import type {SceneProps} from './types';

/**
 * Scène 2 — Le BTCS.
 * 'photo' : retour à la matière, gros plan terre + blocs (ligne « De la terre à la villa »).
 * 'full' / 'short' : animation codée de la presse (conservée pour le 60 s).
 */
export const Scene2Btcs: React.FC<SceneProps> = ({segment, sequenceFrames}) =>
  segment.variant === 'photo' ? (
    <PhotoPlate id="matiereBtcs" frames={sequenceFrames} move={{x: [40, 60], y: [55, 50], scale: [1.18, 1.04]}} />
  ) : (
    <BtcsBlockAnimation variant={segment.variant === 'full' ? 'full' : 'short'} frames={segment.frames} />
  );
