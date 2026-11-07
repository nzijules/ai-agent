import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {PlaceholderContext} from '../components/MediaSlot';
import {sceneById, SceneId} from '../data/timeline';
import {FilmProps, Overlays, SceneStack, Soundtrack} from './NovembreBleu';
import {colors} from '../styles/theme';

/**
 * Preview isolée d'une scène : on rejoue le film décalé sur la plage de la scène
 * (image, sous-titres, voix et musique restent parfaitement synchronisés).
 */
export const ScenePreview: React.FC<FilmProps & {scene: SceneId}> = ({scene, ...props}) => {
  const s = sceneById(scene);
  return (
    <PlaceholderContext.Provider value={{showTags: props.showPlaceholderTags}}>
      <AbsoluteFill style={{backgroundColor: colors.navy}}>
        <Sequence from={-s.startFrame}>
          <SceneStack only={[scene]} />
          <Overlays props={props} />
        </Sequence>
        <Soundtrack props={props} offsetFrames={s.startFrame} />
      </AbsoluteFill>
    </PlaceholderContext.Provider>
  );
};

/** Preview d'une plage du film (ex. 15 premières secondes). */
export const RangePreview: React.FC<FilmProps & {fromFrame: number}> = ({fromFrame, ...props}) => (
  <PlaceholderContext.Provider value={{showTags: props.showPlaceholderTags}}>
    <AbsoluteFill style={{backgroundColor: colors.navy}}>
      <Sequence from={-fromFrame}>
        <SceneStack />
        <Overlays props={props} />
      </Sequence>
      <Soundtrack props={props} offsetFrames={fromFrame} />
    </AbsoluteFill>
  </PlaceholderContext.Provider>
);
