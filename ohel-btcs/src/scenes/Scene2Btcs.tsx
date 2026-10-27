import {BtcsBlockAnimation} from '../components/BtcsBlockAnimation';
import {PhotoPlate} from '../components/PhotoPlate';
import {ShotPlates, hasShotImages} from '../components/ShotPlates';
import {resolveAsset} from '../lib/assets';
import type {SceneProps} from './types';

/**
 * Scène 2 — Le BTCS.
 * 'photo' : retour à la matière, gros plan terre + blocs (ligne « De la terre à la villa »).
 *   Tant que le gros plan n'est pas fourni : cadrage serré sur les piles de blocs du chantier.
 * 'full' / 'short' : animation codée de la presse (conservée pour le 60 s).
 */
export const Scene2Btcs: React.FC<SceneProps> = ({segment, sequenceFrames}) => {
  if (segment.variant !== 'photo') {
    return <BtcsBlockAnimation variant={segment.variant === 'full' ? 'full' : 'short'} frames={segment.frames} />;
  }
  if (hasShotImages(segment)) return <ShotPlates segment={segment} sequenceFrames={sequenceFrames} />;
  return resolveAsset('matiereBtcs', false).src ? (
    <PhotoPlate id="matiereBtcs" frames={sequenceFrames} move={{x: [45, 55], y: [60, 50], scale: [1.15, 1.02]}} />
  ) : (
    <PhotoPlate id="villaChantier" frames={sequenceFrames} move={{x: [8, 22], y: [88, 75], scale: [2.1, 1.6]}} />
  );
};
