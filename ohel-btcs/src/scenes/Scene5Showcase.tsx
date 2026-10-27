import {AbsoluteFill, Sequence} from 'remotion';
import {PhotoPlate} from '../components/PhotoPlate';
import type {AssetId} from '../config/assets';
import type {SceneProps} from './types';

/**
 * Scène 5 — Le savoir-faire : médias AUTHENTIQUES OHEL uniquement.
 * Chaque média manquant reste un placeholder « À FOURNIR » : jamais de visuel IA ici.
 */
export const Scene5Showcase: React.FC<SceneProps> = ({segment, sequenceFrames}) => {
  const ids: AssetId[] =
    segment.variant === 'full'
      ? ['presseAction', 'elevationMurs', 'detailJoints', 'realisation1', 'realisation2']
      : ['presseAction', 'elevationMurs', 'realisation1'];
  const per = Math.ceil(sequenceFrames / ids.length);
  return (
    <AbsoluteFill style={{backgroundColor: '#0E0A08'}}>
      {ids.map((id, i) => (
        <Sequence key={id} from={i * per} durationInFrames={per} layout="none">
          <PhotoPlate id={id} frames={per} move={{x: [45, 55], scale: [1.08, 1.0]}} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
