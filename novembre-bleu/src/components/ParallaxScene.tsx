import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type ParallaxLayer = {
  /** 0 = infini (immobile), 1 = plan de mise au point, >1 = premier plan */
  depth: number;
  content: React.ReactNode;
  /** flou de profondeur de champ en px (appliqué au calque) */
  blur?: number;
  opacity?: number;
  key?: string;
};

/**
 * Parallaxe 2.5D : chaque calque se déplace proportionnellement à sa profondeur,
 * ce qui crée le volume d'un vrai travelling. Le flou simule la profondeur de champ.
 */
export const ParallaxScene: React.FC<{
  layers: ParallaxLayer[];
  travel?: {x: number; y: number};
  zoomTravel?: number;
}> = ({layers, travel = {x: -80, y: 0}, zoomTravel = 0.06}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0, 0.3, 1),
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {layers.map((l, i) => {
        const tx = travel.x * p * l.depth;
        const ty = travel.y * p * l.depth;
        const sc = 1 + zoomTravel * p * l.depth;
        return (
          <AbsoluteFill
            key={l.key ?? i}
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${sc})`,
              filter: l.blur ? `blur(${l.blur}px)` : undefined,
              opacity: l.opacity ?? 1,
            }}
          >
            {l.content}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
