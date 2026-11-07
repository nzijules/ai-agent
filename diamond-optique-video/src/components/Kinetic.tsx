import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, spr} from './anim';

/** Ligne de texte révélée par un masque (glisse depuis le bas) */
export const MaskLine: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  out?: number;
  dir?: 1 | -1;
}> = ({delay, children, style, out, dir = 1}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 16], [1, 0], {...clamp, easing: ease});
  const o = out !== undefined ? interpolate(f, [out, out + 10], [0, 1], {...clamp, easing: ease}) : 0;
  return (
    <div style={{overflow: 'hidden', paddingTop: 28, marginTop: -28, paddingBottom: 6, ...style}}>
      <div style={{transform: `translateY(${(p * 110 - o * 110) * dir}%)`}}>{children}</div>
    </div>
  );
};

/** Mot par mot avec impact : scale + flou → net */
export const PunchWord: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const s = spr(f, delay, 12, 0.6, 180);
  const blur = interpolate(f, [delay, delay + 8], [14, 0], clamp);
  const o = interpolate(f, [delay, delay + 4], [0, 1], clamp);
  return (
    <span
      style={{
        display: 'inline-block',
        transform: `scale(${1.8 - 0.8 * s}) translateY(${(1 - s) * 20}px)`,
        filter: `blur(${blur}px)`,
        opacity: o,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
