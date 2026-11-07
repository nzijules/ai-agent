import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp, easeInOut} from './anim';

/** Transition par balayage diagonal (or + couleur) centrée sur `at` */
export const Wipe: React.FC<{at: number; color?: string; len?: number}> = ({at, color = C.bordeaux, len = 10}) => {
  const f = useCurrentFrame();
  if (f < at - len || f > at + len) return null;
  const p = interpolate(f, [at - len, at + len], [0, 1], {...clamp, easing: easeInOut});
  const band = (offset: number, col: string, w: number) => (
    <div
      style={{
        position: 'absolute',
        top: -600,
        height: 3200,
        width: w,
        left: interpolate(p, [0, 1], [1300 + offset, -w - 400 + offset]),
        transform: 'rotate(18deg)',
        background: col,
        filter: 'blur(0.5px)',
      }}
    />
  );
  return (
    <AbsoluteFill style={{zIndex: 80, pointerEvents: 'none'}}>
      {band(0, C.gold, 2300)}
      {band(160, color, 2300)}
    </AbsoluteFill>
  );
};
