import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../theme';
import {scenes} from '../timeline';

const keys = [
  scenes.hook.from,
  scenes.problem.from + 10,
  scenes.solution.from + 10,
  scenes.benefits.from + 10,
  scenes.offer.from + 10,
  scenes.cta.from + 10,
];
// Couleurs des halos par scène : accroche, problème, solution, bénéfices, offre, CTA
const blobA = [colors.violet, '#7A2E55', colors.indigo, '#1C4FA8', '#3B3FC4', colors.violet];
const blobB = [colors.indigo, colors.coral, colors.sky, colors.mint, colors.amber, colors.amber];
const base = ['#060E26', '#0B0F26', '#0A1A4A', '#071A3A', '#0B1640', '#0A1440'];

const Particles: React.FC<{count: number}> = ({count}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`px${i}`) * width;
        const speed = 0.25 + random(`ps${i}`) * 0.6;
        const y = (random(`py${i}`) * (height + 200) - frame * speed * 1.4 + height * 4) % (height + 200) - 100;
        const size = 2 + random(`pz${i}`) * 5;
        const tw = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(frame / (12 + random(`pt${i}`) * 20) + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin(frame / 40 + i) * 14,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: i % 4 === 0 ? colors.amber : colors.white,
              opacity: tw * 0.55,
              filter: 'blur(0.5px)',
            }}
          />
        );
      })}
    </>
  );
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const a = interpolateColors(frame, keys, blobA);
  const b = interpolateColors(frame, keys, blobB);
  const bg = interpolateColors(frame, keys, base);
  const t = frame / 30;
  const big = Math.max(width, height);
  const gridShift = (frame * 0.6) % 80;
  const vignette = interpolate(frame, [0, 20], [1, 0.55], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: bg, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: big * 0.95,
          height: big * 0.95,
          left: width * 0.5 - big * 0.62 + Math.sin(t * 0.5) * 90,
          top: height * 0.18 - big * 0.45 + Math.cos(t * 0.4) * 70,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${a} 0%, transparent 65%)`,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: big * 0.85,
          height: big * 0.85,
          left: width * 0.5 - big * 0.2 + Math.cos(t * 0.45) * 80,
          top: height * 0.82 - big * 0.42 + Math.sin(t * 0.35) * 90,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${b} 0%, transparent 62%)`,
          opacity: 0.42,
        }}
      />
      {/* Grille subtile en perspective */}
      <div
        style={{
          position: 'absolute',
          inset: -80,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: `0px ${gridShift}px`,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 10%, transparent 70%)',
        }}
      />
      <Particles count={36} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(2,6,20,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
