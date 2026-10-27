import {AbsoluteFill} from 'remotion';
import {FONT} from '../lib/fonts';
import type {SceneProps} from './types';

/** Scène pas encore développée (versions 30 s / 60 s, étapes suivantes). */
export const SceneTodo: React.FC<SceneProps> = ({segment}) => (
  <AbsoluteFill
    style={{
      background: '#202020',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT,
      color: '#9A9A9A',
      fontSize: 40,
      fontWeight: 600,
    }}
  >
    Scène « {segment.scene} » — en développement
  </AbsoluteFill>
);
