import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type CameraMove = {
  /** zoom de départ / d'arrivée */
  zoom?: [number, number];
  /** translation en px (repère de la composition) */
  x?: [number, number];
  y?: [number, number];
  rotate?: [number, number];
  /** micro-tremblement "caméra épaule" (px) */
  handheld?: number;
};

/**
 * Caméra virtuelle : travelling, push-in, dérive et respiration.
 * La durée est celle de la <Sequence> parente : le mouvement couvre tout le plan.
 */
export const CinematicCamera: React.FC<React.PropsWithChildren<CameraMove & {style?: React.CSSProperties}>> = ({
  children,
  zoom = [1.04, 1.12],
  x = [0, 0],
  y = [0, 0],
  rotate = [0, 0],
  handheld = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.25, 1),
  });
  const lerp = (r: [number, number]) => r[0] + (r[1] - r[0]) * p;
  const hx = handheld ? Math.sin(frame / 23) * handheld + Math.sin(frame / 7.3) * handheld * 0.25 : 0;
  const hy = handheld ? Math.cos(frame / 29) * handheld * 0.8 + Math.sin(frame / 9.1) * handheld * 0.2 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <AbsoluteFill
        style={{
          transform: `translate(${lerp(x) + hx}px, ${lerp(y) + hy}px) scale(${lerp(zoom)}) rotate(${lerp(rotate)}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
