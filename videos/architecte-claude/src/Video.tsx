import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, Sequence, staticFile} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {S0Hook, S1Hook, S2Awa, S3NotJob, S4Architect, S5Plan, S6Site, S7Visit, S8Keys, S9Reveal, S10Secret, S11CTA} from './scenes';
import {Captions} from './ui';
import {WORDS} from './words';
import {FPS} from './theme';

export const TRANSITION = 12;
/** Accroche TikTok de 6,4 s avant l'histoire ; sa voix démarre à 0,15 s. */
export const HOOK_SEC = 6.4;
export const HOOK_VO_OFFSET = 0.15;
/** La voix off principale démarre 0,4 s après le début de l'histoire. */
export const VO_OFFSET = HOOK_SEC + 0.4;

// Durée de chaque scène (secondes) : chaque scène commence sur le premier mot de son paragraphe.
export const SCENES: {id: string; sec: number; C: React.FC; dark: boolean; enter?: 'fade'}[] = [
  {id: 'AccrocheTikTok', sec: HOOK_SEC, C: S0Hook, dark: true},
  {id: 'Briques', sec: 6.6, C: S1Hook, dark: true},
  {id: 'Awa', sec: 7.4, C: S2Awa, dark: false},
  {id: 'PasSonMetier', sec: 7.35, C: S3NotJob, dark: false},
  {id: 'Architecte', sec: 5.65, C: S4Architect, dark: true},
  {id: 'Plan', sec: 9.2, C: S5Plan, dark: false},
  {id: 'Chantier', sec: 10.85, C: S6Site, dark: false},
  {id: 'Visites', sec: 6.2, C: S7Visit, dark: false},
  {id: 'Cles', sec: 2.55, C: S8Keys, dark: false},
  {id: 'Revelation', sec: 11.25, C: S9Reveal, dark: true, enter: 'fade'},
  {id: 'Secret', sec: 4.2, C: S10Secret, dark: true},
  {id: 'AppelAction', sec: 16.75, C: S11CTA, dark: true, enter: 'fade'},
];
export const sceneFrames = (i: number) => Math.round(SCENES[i].sec * FPS) + (i < SCENES.length - 1 ? TRANSITION : 0);
export const TOTAL = SCENES.reduce((a, _, i) => a + sceneFrames(i), 0) - TRANSITION * (SCENES.length - 1);

const sceneStarts = SCENES.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].sec], []);
const isDark = (t: number) => {
  let i = 0;
  while (i < SCENES.length - 1 && t >= sceneStarts[i + 1]) i++;
  return SCENES[i].dark;
};

// Mettre à false pour une version sans voix (la musique remonte alors).
export const HAS_VOICE = true;

export const ArchitecteClaude: React.FC = () => (
  <AbsoluteFill>
    <Audio
      src={staticFile('musique.mp3')}
      volume={(f) => interpolate(f, [TOTAL - 60, TOTAL], [HAS_VOICE ? 0.14 : 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
    />
    {HAS_VOICE && (
      <Sequence from={Math.round(HOOK_VO_OFFSET * FPS)} name="Voix accroche">
        <Audio src={staticFile('voix-accroche.mp3')} />
      </Sequence>
    )}
    {HAS_VOICE && (
      <Sequence from={Math.round(VO_OFFSET * FPS)} name="Voix off">
        <Audio src={staticFile('voix-off.mp3')} />
      </Sequence>
    )}
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
    <Captions words={WORDS} offset={VO_OFFSET} isDark={isDark} />
  </AbsoluteFill>
);
