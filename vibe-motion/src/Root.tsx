import React from "react";
import { Composition } from "remotion";
import { VibeMotion } from "./Video";
import { FPS, TOTAL } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VibeMotion"
      component={VibeMotion}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
