import {coverRatio} from '../coverRatio';
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_SOFT} from '../anim';
import {Book3D} from '../components/Book3D';
import {Sparkle} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {Pill} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';
import {localAt} from '../timeline';

const c = adConfig.solution;

/** Rayons lumineux tournants derrière le livre. */
export const LightRays: React.FC<{size: number; frame: number; opacity: number; color?: string}> = ({size, frame, opacity, color = colors.sky}) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      left: -size / 2,
      top: -size / 2,
      borderRadius: '50%',
      background: `repeating-conic-gradient(from ${frame * 0.6}deg, ${color}38 0deg 7deg, transparent 7deg 22deg)`,
      maskImage: 'radial-gradient(circle, black 0%, transparent 68%)',
      WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 68%)',
      opacity,
    }}
  />
);

/** Éclats d'étincelles qui jaillissent autour du livre. */
export const Burst: React.FC<{frame: number; start: number; radius: number; count?: number}> = ({frame, start, radius, count = 12}) => {
  const t = frame - start;
  if (t < 0 || t > 40) return null;
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + random(`ba${i}`) * 0.4;
        const dist = interpolate(t, [0, 40], [radius * 0.3, radius * (0.9 + random(`bd${i}`) * 0.5)], {...clamp, easing: easeOut});
        const o = interpolate(t, [0, 6, 40], [0, 1, 0], clamp);
        const s = 18 + random(`bs${i}`) * 26;
        return (
          <div key={i} style={{position: 'absolute', left: Math.cos(a) * dist - s / 2, top: Math.sin(a) * dist - s / 2, opacity: o, transform: `rotate(${t * 6}deg)`}}>
            <Sparkle size={s} color={i % 3 === 0 ? colors.amber : colors.white} />
          </div>
        );
      })}
    </>
  );
};

export const S3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();

  const fly = sp(frame, 6, {damping: 15, stiffness: 70, mass: 1.1});
  const rotY = interpolate(fly, [0, 1], [-75, 22]) + Math.sin(frame / 28) * 4;
  const rotX = interpolate(fly, [0, 1], [25, 6]);
  const scale = interpolate(fly, [0, 1], [0.35, 1]);
  const floatY = Math.sin(frame / 22) * 10;
  const sheen = interpolate(frame, [42, 78], [-0.2, 1.2], clamp);
  const sheen2 = interpolate(frame, [150, 186], [-0.2, 1.2], clamp);
  const rays = interpolate(frame, [20, 50], [0, 1], clamp);
  const flash = interpolate(frame, [0, 4, 22], [0, 0.9, 0], clamp);
  const ring = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: easeOut});
  const kick = sp(frame, 14, SPRING_SOFT);
  const dolly = interpolate(frame, [0, 210], [1.06, 1]);
  const streak = interpolate(frame, [6, 14, 34], [0, 1, 0], clamp);

  const bookW = 380;
  const bookH = bookW * coverRatio();
  const center = {x: 540, y: 628 + bookH / 2};

  return (
    <SceneWrap enter={6}>
      <AbsoluteFill style={{transform: `scale(${dolly})`}}>
        {/* onde de choc + flash */}
        <div
          style={{
            position: 'absolute',
            left: center.x - 700 * ring,
            top: center.y - 700 * ring,
            width: 1400 * ring,
            height: 1400 * ring,
            borderRadius: '50%',
            border: `${6 * (1 - ring) + 1}px solid ${colors.amber}`,
            opacity: 1 - ring,
          }}
        />
        <AbsoluteFill style={{background: `radial-gradient(circle at ${center.x}px ${center.y}px, rgba(255,226,170,${flash}) 0%, transparent 55%)`}} />

        <div style={{position: 'absolute', left: center.x, top: center.y}}>
          <LightRays size={1500} frame={frame} opacity={rays * 0.95} color={colors.amber} />
          <Burst frame={frame} start={30} radius={400} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: center.x - bookW / 2,
            top: center.y - bookH / 2 + floatY,
            transform: `scale(${scale})`,
            opacity: interpolate(frame, [4, 14], [0, 1], clamp),
          }}
        >
          <Book3D width={bookW} rotateY={rotY} rotateX={rotX} sheen={frame < 120 ? sheen : sheen2} glow={rays} />
        </div>

        {/* reflet au sol */}
        <div
          style={{
            position: 'absolute',
            left: center.x - bookW / 2,
            top: center.y + bookH / 2 + 6 - floatY,
            height: bookH * 0.22,
            width: bookW,
            overflow: 'hidden',
            opacity: 0.22 * fly,
            maskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
          }}
        >
          <div style={{transform: `scale(${scale}) scaleY(-1)`, transformOrigin: 'center center'}}>
            <Book3D width={bookW} rotateY={rotY} rotateX={-rotX} shadow={false} />
          </div>
        </div>

        {/* traînée lumineuse horizontale à la révélation */}
        <div
          style={{
            position: 'absolute',
            left: center.x - 900,
            top: center.y - 4,
            width: 1800,
            height: 8,
            borderRadius: 8,
            background: 'linear-gradient(90deg, transparent, rgba(200,225,255,0.9), white, rgba(200,225,255,0.9), transparent)',
            transform: `scaleX(${0.2 + 0.8 * streak})`,
            opacity: streak,
            filter: 'blur(2px)',
          }}
        />

        <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <div style={{opacity: kick, transform: `translateY(${(1 - kick) * -24}px)`, fontFamily: fonts.display, fontWeight: 700, fontSize: 44, color: colors.white}}>{c.kicker}</div>
          <div style={{filter: `drop-shadow(0 0 ${18 * rays}px rgba(255,181,71,0.55))`}}>
            <KineticText text={c.titleTop} size={84} delay={16} stagger={4} effect="slam" color={colors.amber} maxWidth={900} lineHeight={1.0} letterSpacing={-0.01} />
          </div>
          <KineticText text={c.titleBottom} size={72} delay={30} stagger={4} effect="slam" maxWidth={900} lineHeight={1.0} letterSpacing={-0.01} />
        </div>
        <div style={{position: 'absolute', top: 1236, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.tagline} size={46} weight={700} delay={localAt('solution', 16.4)} stagger={3} highlight={c.highlight} highlightColor={colors.amber} maxWidth={900} lineHeight={1.14} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
