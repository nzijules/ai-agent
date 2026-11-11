import React from 'react';
import {Composition, Folder} from 'remotion';
import {ArchitecteClaude, SCENES, sceneFrames, TOTAL} from './Video';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ArchitecteClaude" component={ArchitecteClaude} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL} />
    <Folder name="Scenes">
      {SCENES.map(({id, C}, i) => (
        <Composition key={id} id={id} component={C} width={1080} height={1920} fps={FPS} durationInFrames={sceneFrames(i)} />
      ))}
    </Folder>
  </>
);
