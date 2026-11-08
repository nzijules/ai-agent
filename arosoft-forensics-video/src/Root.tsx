import "./fonts";
import React from "react";
import { AbsoluteFill, Composition, Folder } from "remotion";
import { Background, FilmFinish } from "./components/Background";
import { Particles } from "./components/Particles";
import { SceneShell } from "./components/SceneShell";
import { Subtitles } from "./components/Subtitles";
import { TOTAL_FRAMES, VIDEO } from "./config/video";
import { SCENES, SceneId } from "./data/script";
import { SCENE_COMPONENTS } from "./scenes";
import { AroSoftVideo } from "./Video";

/** Prévisualisation isolée d'une scène (avec fond, sous-titres décalés). */
const makeStandalone = (id: SceneId): React.FC => {
  const Comp = SCENE_COMPONENTS[id];
  const Standalone: React.FC = () => (
    <AbsoluteFill>
      <Background />
      <Particles count={70} seed="global" />
      <SceneShell inFrames={0} outFrames={0}>
        <Comp />
      </SceneShell>
      <FilmFinish />
    </AbsoluteFill>
  );
  return Standalone;
};

export const RemotionRoot: React.FC = () => {
  const ids = Object.keys(SCENES) as SceneId[];
  return (
    <>
      <Composition
        id={VIDEO.id}
        component={AroSoftVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Folder name="Scenes">
        {ids.map((id, i) => (
          <Composition
            key={id}
            id={`Scene${i + 1}`}
            component={makeStandalone(id)}
            durationInFrames={Math.round((SCENES[id].end - SCENES[id].start) * VIDEO.fps)}
            fps={VIDEO.fps}
            width={VIDEO.width}
            height={VIDEO.height}
          />
        ))}
      </Folder>
      <Folder name="Outils">
        <Composition id="SubtitlesOnly" component={Subtitles} durationInFrames={TOTAL_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      </Folder>
    </>
  );
};
