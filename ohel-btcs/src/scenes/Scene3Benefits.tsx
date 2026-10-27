import {PhotoPlate} from '../components/PhotoPlate';
import type {SceneProps} from './types';

/** Scène 3 — Les preuves d'usage, sur la même villa en chantier (titres via ShotText). */
export const Scene3Benefits: React.FC<SceneProps> = ({sequenceFrames}) => (
  <PhotoPlate id="villaChantier" frames={sequenceFrames} move={{x: [65, 35], scale: [1.06, 1.14]}} shade={0.7} />
);
