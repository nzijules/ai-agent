import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {AbsoluteFill, Audio, interpolate, Sequence} from 'remotion';
import type {AssetId} from '../config/assets';
import {TRANSITION_FRAMES, sec2f, timeline, type Timeline, type VersionId} from '../config/scripts';
import {voiceover} from '../config/voiceover';
import {transitions} from '../components/ArchitecturalTransition';
import {DraftWatermark} from '../components/DraftWatermark';
import {SafeZoneOverlay} from '../components/SafeZoneOverlay';
import {ShotText} from '../components/ShotText';
import {Sfx} from '../components/Sfx';
import {resolveAsset} from '../lib/assets';
import {AdPropsContext} from '../lib/context';
import '../lib/fonts';
import type {AdProps} from '../lib/props';
import {SCENES} from '../scenes';

/** -14 dB sous la voix off. */
const DUCK = Math.pow(10, -14 / 20);
const MUSIC_VOLUME = 0.55;
const RAMP = 6;

const VO: Record<VersionId, AssetId> = {ad15: 'vo15', ad30: 'vo30', ad60: 'vo60'};

/** Intervalles (frames absolues) où la voix off parle, d'après scripts.ts. */
/** Extraits de voix off posés sur les plans (frames absolues), d'après voiceover.ts. */
const voiceClips = (version: VersionId, tl: Timeline) =>
  (voiceover[version]?.clips ?? []).map((c) => {
    const seg = tl.segments[c.segment];
    const from = seg.from + seg.shots[c.shot].from + sec2f(c.at);
    return {from, start: sec2f(c.src[0]), frames: sec2f(c.src[1] - c.src[0])};
  });

/** Intervalles (frames absolues) où la voix off parle. */
const voiceIntervals = (version: VersionId, tl: Timeline) => {
  const clips = voiceClips(version, tl);
  if (clips.length) return clips.map((c) => [c.from, c.from + c.frames] as const);
  return tl.segments.flatMap((seg) => seg.shots.filter((s) => s.vo).map((s) => [seg.from + s.from, seg.from + s.from + s.frames] as const));
};

export const AdComposition: React.FC<AdProps & {version: VersionId}> = ({version, draft, showSafeZones, watermark = true}) => {
  const tl = timeline(version);
  const vo = resolveAsset(VO[version], false);
  const music = resolveAsset('music', false);
  const voice = voiceIntervals(version, tl);
  const clips = voiceClips(version, tl);

  const musicVolume = (f: number) => {
    // Ducking : gain réduit pendant la voix, avec rampes courtes.
    const duck = Math.max(
      0,
      ...voice.map(([a, b]) =>
        interpolate(f, [a - RAMP, a, b, b + RAMP], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      ),
    );
    const fadeOut = interpolate(f, [tl.durationInFrames - 20, tl.durationInFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return MUSIC_VOLUME * (1 - duck * (1 - DUCK)) * fadeOut;
  };

  const items: React.ReactNode[] = [];
  const sfx: React.ReactNode[] = [];
  tl.segments.forEach((seg, i) => {
    const next = tl.segments[i + 1];
    // On prolonge la scène de la durée de la transition suivante : chaque scène
    // démarre ainsi exactement à son temps de storyboard.
    const sequenceFrames = seg.frames + (next?.transitionIn ? TRANSITION_FRAMES : 0);
    const {Component, title} = SCENES[seg.scene];
    if (seg.transitionIn && i > 0) {
      items.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={transitions[seg.transitionIn]()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />,
      );
    }
    items.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sequenceFrames} name={seg.scene}>
        <AbsoluteFill>
          <Component segment={seg} sequenceFrames={sequenceFrames} />
          <ShotText segment={seg} placement={title} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>,
    );
    if (seg.transitionIn && i > 0) sfx.push(<Sfx key={`x${i}`} id="sfxTransition" at={seg.from} volume={0.3} />);
  });

  return (
    <AdPropsContext.Provider value={{draft, showSafeZones}}>
      <AbsoluteFill style={{backgroundColor: '#000'}}>
        <TransitionSeries>{items}</TransitionSeries>
        {sfx}
        {vo.src && clips.length
          ? clips.map((c, i) => (
              <Sequence key={`vo${i}`} from={c.from} durationInFrames={c.frames} layout="none">
                <Audio src={vo.src!} startFrom={c.start} endAt={c.start + c.frames} />
              </Sequence>
            ))
          : null}
        {vo.src && !clips.length ? <Audio src={vo.src} /> : null}
        {music.src ? <Audio src={music.src} volume={musicVolume} /> : null}
        {draft && watermark ? <DraftWatermark /> : null}
        {showSafeZones ? <SafeZoneOverlay /> : null}
      </AbsoluteFill>
    </AdPropsContext.Provider>
  );
};
