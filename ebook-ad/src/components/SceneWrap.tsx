import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeIn, easeOut} from '../anim';

/**
 * Transition d'entrée / sortie commune à toutes les scènes :
 * zoom léger + flou + fondu (les séquences se chevauchent de quelques frames).
 */
export const SceneWrap: React.FC<{children: React.ReactNode; enter?: number; exit?: number; noEnter?: boolean; noExit?: boolean}> = ({
  children,
  enter = 12,
  exit = 12,
  noEnter,
  noExit,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const inP = noEnter ? 1 : interpolate(frame, [0, enter], [0, 1], {...clamp, easing: easeOut});
  const outP = noExit ? 0 : interpolate(frame, [durationInFrames - exit, durationInFrames], [0, 1], {...clamp, easing: easeIn});
  const scale = (0.94 + 0.06 * inP) * (1 + 0.08 * outP);
  const blur = (1 - inP) * 14 + outP * 18;
  const opacity = inP * (1 - outP);
  return (
    <AbsoluteFill style={{opacity, transform: `scale(${scale})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};
