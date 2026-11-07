import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {DURATION_S, FPS, SCENES, VOICE_OVER} from './config';
import {Subtitles} from './components/Subtitles';
import {Wipe} from './components/Wipe';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Recrutement} from './scenes/Scene2Recrutement';
import {Scene3Zones} from './scenes/Scene3Zones';
import {Scene4Remuneration} from './scenes/Scene4Remuneration';
import {Scene5Opportunite} from './scenes/Scene5Opportunite';
import {CTA_TIMING, Scene6CTA} from './scenes/Scene6CTA';
import {Scene7Signature} from './scenes/Scene7Signature';
import {C, loadFonts} from './theme';

loadFonts();

const s = (sec: number) => Math.round(sec * FPS);
const SC = Object.fromEntries(
  Object.entries(SCENES).map(([k, v]) => [k, {from: s(v.from), dur: s(v.dur)}])
) as Record<keyof typeof SCENES, {from: number; dur: number}>;

/** Effets sonores : [fichier, image, volume] */
const SFX: [string, number, number][] = [
  ['impact', 8, 0.35],
  ['impact', 40, 0.5],
  ['whoosh', 94, 0.55],
  ['counter', SC.recrutement.from + 22, 0.45],
  ['impact', SC.recrutement.from + 64, 0.45],
  ['whoosh', SC.zones.from - 9, 0.5],
  ['whoosh', SC.zones.from + 26, 0.25],
  ['whoosh', SC.zones.from + 74, 0.25],
  ['whoosh', SC.zones.from + 122, 0.25],
  ['whoosh', SC.remuneration.from - 9, 0.5],
  ['counter', SC.remuneration.from + 16, 0.5],
  ['counter', SC.remuneration.from + 40, 0.4],
  ['impact', SC.remuneration.from + 62, 0.55],
  ['whoosh', SC.opportunite.from - 9, 0.5],
  ['whoosh', SC.opportunite.from + 66, 0.45],
  ['whoosh', SC.cta.from - 9, 0.5],
  ['notification', SC.cta.from + CTA_TIMING.SEND_AT, 0.7],
  ['impact', SC.cta.from + CTA_TIMING.NUMBER_AT, 0.4],
  ['whoosh', SC.signature.from - 4, 0.4],
  ['sting', SC.signature.from + 8, 0.7],
];

const TOTAL = s(DURATION_S);

/** volume musique : fondu d'entrée/sortie + ducking sous la voix-off */
const musicVolume = (f: number) => {
  const t = f / FPS;
  const speaking = VOICE_OVER.some((v) => t > v.at - 0.15 && t < v.at + v.dur + 0.1);
  const base = speaking ? 0.16 : 0.32;
  const fadeIn = interpolate(f, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [TOTAL - 20, TOTAL], [1, 0], {extrapolateLeft: 'clamp'});
  return base * fadeIn * fadeOut;
};

export const Main: React.FC<{subtitles: boolean}> = ({subtitles}) => {
  return (
    <AbsoluteFill style={{background: C.navyDeep}}>
      <Sequence from={SC.hook.from} durationInFrames={SC.hook.dur} name="1 · Hook">
        <Scene1Hook />
      </Sequence>
      <Sequence from={SC.recrutement.from} durationInFrames={SC.recrutement.dur} name="2 · Recrutement">
        <Scene2Recrutement />
      </Sequence>
      <Sequence from={SC.zones.from} durationInFrames={SC.zones.dur} name="3 · Zones">
        <Scene3Zones />
      </Sequence>
      <Sequence from={SC.remuneration.from} durationInFrames={SC.remuneration.dur} name="4 · Rémunération">
        <Scene4Remuneration />
      </Sequence>
      <Sequence from={SC.opportunite.from} durationInFrames={SC.opportunite.dur} name="5 · Opportunité">
        <Scene5Opportunite />
      </Sequence>
      <Sequence from={SC.cta.from} durationInFrames={SC.cta.dur} name="6 · Appel à l'action">
        <Scene6CTA />
      </Sequence>
      <Sequence from={SC.signature.from} durationInFrames={SC.signature.dur} name="7 · Signature">
        <Scene7Signature />
      </Sequence>

      {/* Transitions */}
      <Wipe at={SC.zones.from} color={C.navy} />
      <Wipe at={SC.remuneration.from} color={C.bordeaux} />
      <Wipe at={SC.opportunite.from} color={C.navyDeep} />
      <Wipe at={SC.cta.from} color={C.navy} />

      {subtitles && <Subtitles />}

      {/* Audio */}
      <Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
      {VOICE_OVER.map((v, i) => (
        <Sequence key={`vo${i}`} from={s(v.at)} name={`VO ${i + 1}`}>
          <Audio src={staticFile(v.file)} volume={1} />
        </Sequence>
      ))}
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={`sfx${i}`} from={at} durationInFrames={s(2)} name={`SFX ${file}`}>
          <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
