import React from 'react';
import {Composition, Folder} from 'remotion';
import {defaultFilmProps, NovembreBleu} from './compositions/NovembreBleu';
import {RangePreview, ScenePreview} from './compositions/ScenePreview';
import {FPS, SCENES, TOTAL_FRAMES} from './data/timeline';
import {loadAllFonts} from './styles/theme';

loadAllFonts();

const V = {width: 1080, height: 1920};
const H = {width: 1920, height: 1080};

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Film">
      <Composition id="NovembreBleu-Vertical" component={NovembreBleu} durationInFrames={TOTAL_FRAMES} fps={FPS} {...V} defaultProps={defaultFilmProps} />
      <Composition id="NovembreBleu-Horizontal" component={NovembreBleu} durationInFrames={TOTAL_FRAMES} fps={FPS} {...H} defaultProps={defaultFilmProps} />
      <Composition id="NovembreBleu-Preview15s" component={RangePreview} durationInFrames={15 * FPS} fps={FPS} {...V} defaultProps={{...defaultFilmProps, fromFrame: 0}} />
    </Folder>
    <Folder name="Scenes-Vertical">
      {SCENES.map((s) => (
        <Composition key={s.id} id={`Scene-${s.id}-V`} component={ScenePreview} durationInFrames={s.durationFrames} fps={FPS} {...V} defaultProps={{...defaultFilmProps, scene: s.id}} />
      ))}
    </Folder>
    <Folder name="Scenes-Horizontal">
      {SCENES.map((s) => (
        <Composition key={s.id} id={`Scene-${s.id}-H`} component={ScenePreview} durationInFrames={s.durationFrames} fps={FPS} {...H} defaultProps={{...defaultFilmProps, scene: s.id}} />
      ))}
    </Folder>
  </>
);
