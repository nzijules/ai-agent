import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {PhotoPlate} from '../components/PhotoPlate';
import {useFormat} from '../lib/format';
import type {SceneProps} from './types';

/**
 * Scène 4 — La modernité : le plan d'architecte de la villa se révèle en photo,
 * par un volet diagonal (même cadrage, même mouvement de caméra pour les deux calques).
 */
export const Scene4Modernite: React.FC<SceneProps> = ({sequenceFrames}) => {
  const frame = useCurrentFrame();
  const {width, height} = useFormat();
  const p = interpolate(frame, [sequenceFrames * 0.18, sequenceFrames * 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  // Volet diagonal : de la gauche vers la droite, incliné.
  const span = width + height * 0.6;
  const x = -height * 0.6 + p * (span + height * 0.6);
  const move = {x: [35, 60] as [number, number], scale: [1.08, 1.14] as [number, number]};
  return (
    <AbsoluteFill>
      <PhotoPlate id="villaFilaire" frames={sequenceFrames} move={move} shade={0.8} />
      <AbsoluteFill style={{clipPath: `polygon(0 0, ${x + height * 0.6}px 0, ${x}px 100%, 0 100%)`}}>
        <PhotoPlate id="villaHook" frames={sequenceFrames} move={move} />
      </AbsoluteFill>
      {/* Trait rouge qui suit le front du volet */}
      {p > 0 && p < 1 ? (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <line x1={x + height * 0.6} y1={0} x2={x} y2={height} stroke="#DB191D" strokeWidth={6} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
