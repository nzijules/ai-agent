import {BtcsBlockAnimation} from '../components/BtcsBlockAnimation';
import type {SceneProps} from './types';

/** Scène 2 — Le BTCS : animation entièrement codée (aucun visuel généré). */
export const Scene2Btcs: React.FC<SceneProps> = ({segment}) => (
  <BtcsBlockAnimation variant={segment.variant === 'full' ? 'full' : 'short'} frames={segment.frames} />
);
