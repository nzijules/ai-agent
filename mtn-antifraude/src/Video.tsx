import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Vignette} from './components/Fx';
import {prog} from './lib';
import {FPS, SCENES} from './timing';
import {S1} from './scenes/S1';
import {S2} from './scenes/S2';
import {S3} from './scenes/S3';
import {S4} from './scenes/S4';
import {S5} from './scenes/S5';
import {S6} from './scenes/S6';

const LIST: [readonly [number, number], React.FC<{t: number}>, number][] = [
  [SCENES.s1, S1, 0],
  [SCENES.s2, S2, 0.25],
  [SCENES.s3, S3, 0.2],
  [SCENES.s4, S4, 0.45],
  [SCENES.s5, S5, 0.3],
  [SCENES.s6, S6, 0.01],
];
const TAIL = 0.6;

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {LIST.map(([[a, b], Comp, fadeIn], i) =>
        t >= a && t < b + TAIL ? (
          <AbsoluteFill key={i} style={{opacity: fadeIn ? prog(t, a, fadeIn) : 1}}>
            <Comp t={t} />
          </AbsoluteFill>
        ) : null,
      )}
      <Vignette o={0.45} />

    </AbsoluteFill>
  );
};
