import React from 'react';
import {Audio} from '@remotion/media';
import {interpolate, staticFile} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {S1Hook, S2Awa, S3NotJob, S4Architect, S5Plan, S6Site, S7Visit, S8Keys, S9Reveal, S10Secret, S11CTA} from './scenes';
import {FPS} from './theme';

export const TRANSITION = 12;
// Durée de chaque scène (secondes), calée sur la voix off
export const SCENES: {id: string; sec: number; C: React.FC; enter?: 'fade'}[] = [
  {id: 'Accroche', sec: 6, C: S1Hook},
  {id: 'Awa', sec: 7, C: S2Awa},
  {id: 'PasSonMetier', sec: 7.5, C: S3NotJob},
  {id: 'Architecte', sec: 8, C: S4Architect},
  {id: 'Plan', sec: 9, C: S5Plan},
  {id: 'Chantier', sec: 10.5, C: S6Site},
  {id: 'Visites', sec: 8, C: S7Visit},
  {id: 'Cles', sec: 4, C: S8Keys},
  {id: 'Revelation', sec: 11, C: S9Reveal, enter: 'fade'},
  {id: 'Secret', sec: 6, C: S10Secret},
  {id: 'AppelAction', sec: 14, C: S11CTA, enter: 'fade'},
];
export const sceneFrames = (i: number) => Math.round(SCENES[i].sec * FPS) + (i < SCENES.length - 1 ? TRANSITION : 0);
export const TOTAL = SCENES.reduce((a, _, i) => a + sceneFrames(i), 0) - TRANSITION * (SCENES.length - 1);

// Mettre à true quand public/voix-off.mp3 existe : la musique baisse alors sous la voix.
export const HAS_VOICE = false;

export const ArchitecteClaude: React.FC = () => (
  <>
  <Audio
    src={staticFile('musique.mp3')}
    volume={(f) => interpolate(f, [TOTAL - 60, TOTAL], [HAS_VOICE ? 0.16 : 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
  />
  {HAS_VOICE && <Audio src={staticFile('voix-off.mp3')} />}
  <TransitionSeries>
    {SCENES.flatMap(({id, C, enter}, i) => {
      const items = [];
      if (i > 0)
        items.push(
          <TransitionSeries.Transition
            key={'t' + id}
            presentation={enter === 'fade' ? fade() : slide({direction: 'from-right'})}
            timing={enter === 'fade' ? linearTiming({durationInFrames: TRANSITION}) : springTiming({config: {damping: 200}, durationInFrames: TRANSITION})}
          />,
        );
      items.push(
        <TransitionSeries.Sequence key={id} name={id} durationInFrames={sceneFrames(i)}>
          <C />
        </TransitionSeries.Sequence>,
      );
      return items;
    })}
  </TransitionSeries>
  </>
);
