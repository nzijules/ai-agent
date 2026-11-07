import React from 'react';
import {AbsoluteFill, Sequence, staticFile, interpolate} from 'remotion';
import {Audio} from '@remotion/media';
import {Grain, Vignette} from '../components/Atmosphere';
import {LightTransition} from '../components/LightTransition';
import {LogoBug} from '../components/LogoBug';
import {PlaceholderContext} from '../components/MediaSlot';
import {SubtitleTrack} from '../components/SubtitleTrack';
import {
  FPS, MUSIC_FILE, PLACED_LINES, SCENES, SFX_FILE, SceneId, TOTAL_FRAMES, TRANSITION_FRAMES, VO_FILE,
} from '../data/timeline';
import {SCENE_COMPONENTS} from '../scenes/registry';
import {colors} from '../styles/theme';

export type FilmProps = {
  showSubtitles: boolean;
  showPlaceholderTags: boolean;
  /** niveau de la musique hors narration (0-1) */
  musicLevel: number;
  /** niveau de la musique sous la narration (ducking) */
  musicDuckedLevel: number;
};

export const defaultFilmProps: FilmProps = {
  showSubtitles: true,
  showPlaceholderTags: false,
  musicLevel: 0.55,
  musicDuckedLevel: 0.2,
};

/** Courbe de ducking : la musique s'atténue sous chaque phrase (rampes de 8 frames). */
const musicVolumeAt = (f: number, hi: number, lo: number) => {
  let duck = 0;
  for (const l of PLACED_LINES) {
    const a = l.startFrame - 8;
    const b = l.startFrame + l.durationFrames + 10;
    if (f >= a - 8 && f <= b + 12) {
      const v = interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      duck = Math.max(duck, v);
    }
  }
  return hi + (lo - hi) * duck;
};

/** Pistes audio : voix-off replacée phrase par phrase + musique + transitions. */
export const Soundtrack: React.FC<{props: FilmProps; offsetFrames?: number}> = ({props, offsetFrames = 0}) => (
  <>
    {PLACED_LINES.map((l) => (
      <Sequence key={l.id} from={l.startFrame - offsetFrames} durationInFrames={l.durationFrames} name={`VO ${l.id}`} layout="none">
        <Audio
          src={staticFile(VO_FILE)}
          trimBefore={Math.round(l.srcIn * FPS)}
          trimAfter={Math.round(l.srcIn * FPS) + l.durationFrames}
          volume={1}
        />
      </Sequence>
    ))}
    <Sequence from={-offsetFrames} name="Musique (provisoire)" layout="none">
      <Audio
        src={staticFile(MUSIC_FILE)}
        volume={(f) => musicVolumeAt(f, props.musicLevel, props.musicDuckedLevel)}
      />
    </Sequence>
    <Sequence from={-offsetFrames} name="Transitions sonores (provisoires)" layout="none">
      <Audio src={staticFile(SFX_FILE)} volume={0.7} />
    </Sequence>
  </>
);

export const SceneStack: React.FC<{only?: SceneId[]}> = ({only}) => (
  <>
    {SCENES.filter((s) => !only || only.includes(s.id)).map((s, i) => {
      const {Component, transition, origin} = SCENE_COMPONENTS[s.id];
      const isLast = i === SCENES.length - 1;
      return (
        <Sequence
          key={s.id}
          from={s.startFrame}
          durationInFrames={s.durationFrames + (isLast ? 0 : TRANSITION_FRAMES)}
          name={`${s.id} · ${s.title}`}
        >
          <LightTransition kind={i === 0 ? 'dissolve' : transition} duration={i === 0 ? 20 : TRANSITION_FRAMES} origin={origin}>
            <Component />
          </LightTransition>
        </Sequence>
      );
    })}
  </>
);

export const Overlays: React.FC<{props: FilmProps}> = ({props}) => (
  <>
    <Vignette strength={0.55} />
    <Grain opacity={0.08} />
    <LogoBug />
    {props.showSubtitles && <SubtitleTrack />}
  </>
);

/** Film complet — 2700 frames. Fonctionne en 1080x1920 et 1920x1080 (mise en page adaptative). */
export const NovembreBleu: React.FC<FilmProps> = (props) => (
  <PlaceholderContext.Provider value={{showTags: props.showPlaceholderTags}}>
    <AbsoluteFill style={{backgroundColor: colors.navy}}>
      <SceneStack />
      <Overlays props={props} />
      <Soundtrack props={props} />
    </AbsoluteFill>
  </PlaceholderContext.Provider>
);

export const FILM_DURATION = TOTAL_FRAMES;
