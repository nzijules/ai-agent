import React from "react";
import { AbsoluteFill, Composition, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./theme/fonts";
import { Scene2AutoUpdates } from "./scenes/Scene2AutoUpdates";
import { TikTokSafeZone } from "./components/TikTokSafeZone";
import { FPS, HEIGHT, SCENE_SECONDS, WIDTH } from "./theme/timing";

/** Prototype de la scène 2 avec le lit musical, pour validation. */
const Scene2Prototype: React.FC = () => (
  <AbsoluteFill>
    <Scene2AutoUpdates />
    <Audio src={staticFile("music/afro-pop-bed.wav")} volume={0.32} />
  </AbsoluteFill>
);

/** Contrôle des zones de sécurité TikTok (aperçu uniquement, ne pas publier). */
const Scene2SafeZones: React.FC = () => (
  <AbsoluteFill>
    <Scene2Prototype />
    <TikTokSafeZone />
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
      <Composition
        id="Scene2-TikTok-SafeZones"
        component={Scene2SafeZones}
        durationInFrames={SCENE_SECONDS.s2 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
