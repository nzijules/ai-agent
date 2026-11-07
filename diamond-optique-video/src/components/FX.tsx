import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp, rand} from './anim';

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Grain filmique léger (SVG turbulence, décalé chaque image) */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  const seed = f % 8;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Particules dorées montantes */
export const GoldParticles: React.FC<{count?: number; start?: number; burst?: number}> = ({
  count = 60,
  start = 0,
  burst,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = rand(i) * 1080;
        const speed = 2 + rand(i + 7) * 5;
        const size = 4 + rand(i + 3) * 12;
        const life = f - start - rand(i + 11) * 40;
        if (life < 0) return null;
        let x = x0 + Math.sin((life + i * 9) / 18) * 30;
        let y = 1950 - life * speed;
        if (burst !== undefined) {
          const bl = Math.max(0, f - burst);
          const ang = rand(i + 21) * Math.PI * 2;
          const dist = bl * (8 + rand(i + 5) * 18) * Math.exp(-bl / 30);
          x = 540 + Math.cos(ang) * dist;
          y = 860 + Math.sin(ang) * dist + bl * 1.2;
        }
        const op = interpolate(life, [0, 15, 90, 130], [0, 1, 0.9, 0], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: i % 3 === 0 ? 2 : '50%',
              transform: `rotate(${45 + life * 3}deg)`,
              background: i % 4 === 0 ? '#FFF3C4' : C.gold,
              boxShadow: `0 0 ${size * 1.6}px ${C.gold}`,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Bokeh de premier plan (parallaxe rapide) */
export const Bokeh: React.FC<{drift?: number; count?: number; color?: string}> = ({
  drift = 3,
  count = 14,
  color = 'rgba(255,214,120,0.35)',
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const s = 60 + rand(i + 40) * 180;
        const x = ((rand(i + 1) * 1400 - f * drift * (0.5 + rand(i))) % 1400) - 160;
        const y = rand(i + 2) * 1920;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x < -200 ? x + 1400 : x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
              filter: 'blur(6px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Balayage lumineux diagonal */
export const LightSweep: React.FC<{at: number; dur?: number; width?: number; opacity?: number}> = ({
  at,
  dur = 22,
  width = 260,
  opacity = 0.55,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [-0.4, 1.4], clamp);
  if (f < at || f > at + dur) return null;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <div
        style={{
          position: 'absolute',
          top: -400,
          left: p * 1080 - width / 2,
          width,
          height: 2800,
          transform: 'rotate(20deg)',
          background: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,240,200,${opacity}), rgba(255,255,255,0))`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Formes géométriques 3D flottantes (hexagones / triangles) */
export const FloatingShapes: React.FC<{seed?: number; palette?: string[]; count?: number}> = ({
  seed = 1,
  palette = [C.gold, 'rgba(255,255,255,0.25)', C.navy],
  count = 9,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{perspective: 1200, pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: number) => rand(seed * 100 + i * 7 + k);
        const depth = r(1);
        const size = 40 + depth * 140;
        const x = r(2) * 1080;
        const y = r(3) * 1920 - f * (0.6 + depth * 2.2);
        const rot = f * (0.6 + r(4) * 1.5) * (r(5) > 0.5 ? 1 : -1);
        const col = palette[i % palette.length];
        const shape = i % 3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              transform: `translateZ(${depth * 300 - 150}px) rotateX(${rot}deg) rotateY(${rot * 0.7}deg)`,
              filter: depth < 0.3 ? 'blur(3px)' : undefined,
              opacity: 0.35 + depth * 0.5,
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {shape === 0 && (
                <polygon points="50,3 93,27 93,73 50,97 7,73 7,27" fill="none" stroke={col} strokeWidth={7} />
              )}
              {shape === 1 && <polygon points="50,8 95,90 5,90" fill={col} />}
              {shape === 2 && <circle cx={50} cy={50} r={40} fill="none" stroke={col} strokeWidth={6} />}
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
