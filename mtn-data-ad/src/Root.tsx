import React from "react";
import { AbsoluteFill, Composition, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./theme/fonts";
import { Scene2AutoUpdates } from "./scenes/Scene2AutoUpdates";
import { FPS, HEIGHT, SCENE_SECONDS, WIDTH } from "./theme/timing";

/** Prototype de la scène 2 avec le lit musical, pour validation. */
const Scene2Prototype: React.FC = () => (
  <AbsoluteFill>
    <Scene2AutoUpdates />
    <Audio src={staticFile("music/afro-pop-bed.wav")} volume={0.32} />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Scene2-Prototype"
        component={Scene2Prototype}
        durationInFrames={SCENE_SECONDS.s2 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
