import {PhotoPlate} from '../components/PhotoPlate';
import type {SceneProps} from './types';

/** Scène 1 — Hook : la villa terminée à l'heure bleue, travelling latéral (illustration). */
export const Scene1Hook: React.FC<SceneProps> = ({sequenceFrames}) => (
  <PhotoPlate id="villaHook" frames={sequenceFrames} move={{x: [28, 58], scale: [1.04, 1.12]}} />
);
