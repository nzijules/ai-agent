import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, interpolate, Sequence, staticFile} from 'remotion';
import {Background} from './components/Background';
import {Captions} from './components/Captions';
import {loadFonts} from './fonts';
import {S1Hook} from './scenes/S1Hook';
import {S2Problem} from './scenes/S2Problem';
import {S3Solution} from './scenes/S3Solution';
import {S4Benefits} from './scenes/S4Benefits';
import {S5Offer} from './scenes/S5Offer';
import {S6CTA} from './scenes/S6CTA';
import {BENEFIT_START, BENEFIT_STEP, scenes, TOTAL_FRAMES} from './timeline';

loadFonts();

export type AdProps = {
  /** Ajoute public/audio/voiceover.mp3 (si présent) et baisse la musique. */
  voiceOver: boolean;
  /** Affiche les sous-titres animés de la voix off. */
  captions: boolean;
  /** Musique et effets sonores. */
  music: boolean;
};

const OVERLAP = 8;

const order = [
  {key: 'hook', C: S1Hook},
  {key: 'problem', C: S2Problem},
  {key: 'solution', C: S3Solution},
  {key: 'benefits', C: S4Benefits},
  {key: 'offer', C: S5Offer},
  {key: 'cta', C: S6CTA},
] as const;

const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

type Sfx = {at: number; file: string; volume: number};
const sfx: Sfx[] = [
  {at: 4, file: 'pop', volume: 0.35},
  {at: 88, file: 'pop', volume: 0.45},
  {at: 100, file: 'click', volume: 0.7},
  {at: scenes.problem.from - 12, file: 'whoosh', volume: 0.5},
  ...[0, 1, 2, 3].map((i) => ({at: scenes.problem.from - OVERLAP + 8 + i * 9, file: 'pop', volume: 0.3})),
  {at: scenes.problem.from - OVERLAP + 114, file: 'pop', volume: 0.4},
  {at: scenes.solution.from - 14, file: 'riser', volume: 0.55},
  {at: scenes.solution.from - OVERLAP + 2, file: 'impact', volume: 0.7},
  {at: scenes.solution.from - OVERLAP + 30, file: 'shimmer', volume: 0.5},
  {at: scenes.benefits.from - 12, file: 'whoosh', volume: 0.45},
  ...[0, 1, 2, 3].map((i) => ({at: scenes.benefits.from - OVERLAP + BENEFIT_START + i * BENEFIT_STEP - 4, file: 'whoosh', volume: 0.3})),
  ...[0, 1, 2, 3].map((i) => ({at: scenes.benefits.from - OVERLAP + BENEFIT_START + i * BENEFIT_STEP + 28, file: 'tick', volume: 0.5})),
  {at: scenes.offer.from - 12, file: 'whoosh', volume: 0.5},
  {at: scenes.offer.from - OVERLAP + 62, file: 'impact', volume: 0.45},
  {at: scenes.offer.from - OVERLAP + 66, file: 'shimmer', volume: 0.45},
  {at: scenes.cta.from - 12, file: 'whoosh', volume: 0.5},
  {at: scenes.cta.from - OVERLAP + 36, file: 'pop', volume: 0.5},
  {at: scenes.cta.from - OVERLAP + 78, file: 'click', volume: 0.8},
];

export const Ad: React.FC<AdProps> = ({voiceOver, captions, music}) => {
  const vo = voiceOver && hasFile('audio/voiceover.mp3');
  const musicVol = vo ? 0.25 : 0.62;
  return (
    <AbsoluteFill>
      <Background />
      {order.map(({key, C}, i) => {
        const s = scenes[key];
        const from = i === 0 ? s.from : s.from - OVERLAP;
        const dur = i === 0 ? s.duration : s.duration + OVERLAP;
        return (
          <Sequence key={key} from={from} durationInFrames={dur} name={key}>
            <C />
          </Sequence>
        );
      })}
      {captions ? <Captions /> : null}

      {music && hasFile('audio/music.wav') ? (
        <Audio
          src={staticFile('audio/music.wav')}
          volume={(f) => musicVol * interpolate(f, [0, 8, TOTAL_FRAMES - 40, TOTAL_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        />
      ) : null}
      {music
        ? sfx.map((s, i) =>
            hasFile(`audio/sfx-${s.file}.wav`) ? (
              <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={90} layout="none">
                <Audio src={staticFile(`audio/sfx-${s.file}.wav`)} volume={s.volume * (vo ? 0.6 : 0.8)} />
              </Sequence>
            ) : null
          )
        : null}
      {vo ? <Audio src={staticFile('audio/voiceover.mp3')} volume={1} /> : null}
    </AbsoluteFill>
  );
};
