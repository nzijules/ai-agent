import React from "react";
import { Composition } from "remotion";
import { Main, mainSchemaDefaults } from "./Main";
import { TOTAL_FRAMES, FPS, SCENES, sceneFrames } from "./timeline";
import { H, W } from "./theme";
import { SceneStandalone } from "./Main";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DossierFraude002"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={mainSchemaDefaults}
    />
    {/* une composition par scène, pratique pour itérer dans le Studio */}
    {SCENES.map((s, i) => (
      <Composition
        key={s.id}
        id={`Scene-${i + 1}`}
        component={SceneStandalone}
        durationInFrames={sceneFrames(s)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ index: i }}
      />
    ))}
  </>
);
