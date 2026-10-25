import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, interpolate, Sequence, staticFile} from 'remotion';
import {Background} from './components/Background';
import {Captions} from './components/Captions';
import {loadFonts} from './fonts';
import {S1Hook} from './scenes/S1Hook';
import {S2Struggle} from './scenes/S2Struggle';
import {S3Solution} from './scenes/S3Solution';
import {S4Quiz} from './scenes/S4Quiz';
import {S5Report} from './scenes/S5Report';
import {S6Benefits} from './scenes/S6Benefits';
import {S7Offer} from './scenes/S7Offer';
import {OVERLAP, scenes, TOTAL_FRAMES} from './timeline';

loadFonts();

export type AdProps = {
  /** Ajoute public/audio/voiceover.mp3 (si présent) et baisse la musique. */
  voiceOver: boolean;
  /** Affiche les sous-titres animés de la voix off. */
  captions: boolean;
  /** Musique et effets sonores. */
  music: boolean;
};

const order = [
  {key: 'hook', C: S1Hook},
  {key: 'struggle', C: S2Struggle},
  {key: 'solution', C: S3Solution},
  {key: 'quiz', C: S4Quiz},
  {key: 'report', C: S5Report},
  {key: 'benefits', C: S6Benefits},
  {key: 'offer', C: S7Offer},
] as const;

const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

type Sfx = {at: number; file: string; volume: number};
// Effets sonores calés sur les animations (frames globales ; L = début local d'une scène).
const L = (k: keyof typeof scenes, f: number) => scenes[k].from - (k === 'hook' ? 0 : OVERLAP) + f;
const sfx: Sfx[] = [
  // Scène 1 : pièces qui tombent chaque mois, puis la question choc
  ...[0, 1, 2, 3, 4, 5].map((i) => ({at: 6 + i * 12 + 6, file: 'tick', volume: 0.32})),
  {at: 96, file: 'impact', volume: 0.35},
  {at: L('struggle', 0) - 4, file: 'whoosh', volume: 0.5},
  ...[16, 40, 66].map((f) => ({at: L('struggle', f), file: 'pop', volume: 0.35})),
  {at: L('struggle', 112), file: 'impact', volume: 0.4},
  {at: L('solution', 0) - 8, file: 'riser', volume: 0.55},
  {at: L('solution', 2), file: 'impact', volume: 0.7},
  {at: L('solution', 30), file: 'shimmer', volume: 0.5},
  {at: L('quiz', 0) - 4, file: 'whoosh', volume: 0.45},
  {at: L('quiz', 112), file: 'click', volume: 0.7},
  {at: L('quiz', 124), file: 'tick', volume: 0.6},
  {at: L('quiz', 192), file: 'shimmer', volume: 0.35},
  {at: L('report', 0) - 4, file: 'whoosh', volume: 0.45},
  ...[0, 1, 2, 3].map((i) => ({at: L('report', 40 + i * 6), file: 'pop', volume: 0.25})),
  {at: L('benefits', 0) - 4, file: 'whoosh', volume: 0.45},
  ...[16, 62, 98].map((f) => ({at: L('benefits', f + 18), file: 'tick', volume: 0.5})),
  {at: L('offer', 0) - 4, file: 'whoosh', volume: 0.5},
  {at: L('offer', 104), file: 'impact', volume: 0.45},
  {at: L('offer', 106), file: 'shimmer', volume: 0.45},
  {at: L('offer', 146), file: 'pop', volume: 0.5},
  {at: L('offer', 192), file: 'click', volume: 0.8},
];

export const Ad: React.FC<AdProps> = ({voiceOver, captions, music}) => {
  const vo = voiceOver && hasFile('audio/voiceover.mp3');
  const musicVol = vo ? 0.22 : 0.55;
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
                <Audio src={staticFile(`audio/sfx-${s.file}.wav`)} volume={s.volume * (vo ? 0.55 : 0.7)} />
              </Sequence>
            ) : null
          )
        : null}
      {vo ? <Audio src={staticFile('audio/voiceover.mp3')} volume={1} /> : null}
    </AbsoluteFill>
  );
};
