import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { Ad, AdProps, SCENE_COMPONENTS } from "./Ad";
import { SceneWrap } from "./scenes/Stage";
import { SCENES, TOTAL_FRAMES } from "./timeline";
import { FPS } from "./theme";

const SceneOnly: React.FC<{ id: (typeof SCENES)[number]["id"] }> = ({ id }) => {
  const C = SCENE_COMPONENTS[id];
  return (
    <SceneWrap inFrames={0} outFrames={0}>
      <C />
    </SceneWrap>
  );
};

const formats = [
  { key: "Verticale", w: 1080, h: 1920 },
  { key: "Carree", w: 1080, h: 1080 },
];

export const RemotionRoot: React.FC = () => (
  <>
    {formats.map((fm) => (
      <Folder key={fm.key} name={`Pub-${fm.key}`}>
        <Composition
          id={`Pub-${fm.key}-VoixOff`}
          component={Ad as React.FC<AdProps>}
          width={fm.w}
          height={fm.h}
          fps={FPS}
          durationInFrames={TOTAL_FRAMES}
          defaultProps={{ voiceover: true, captions: true }}
        />
        <Composition
          id={`Pub-${fm.key}-SansVoix`}
          component={Ad as React.FC<AdProps>}
          width={fm.w}
          height={fm.h}
          fps={FPS}
          durationInFrames={TOTAL_FRAMES}
          defaultProps={{ voiceover: false, captions: false }}
        />
      </Folder>
    ))}
    <Folder name="Scenes-Verticales">
      {SCENES.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={() => <SceneOnly id={s.id} />}
          width={1080}
          height={1920}
          fps={FPS}
          durationInFrames={Math.round((s.to - s.from) * FPS)}
        />
      ))}
    </Folder>
  </>
);
