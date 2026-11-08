import React from "react";
import { AbsoluteFill, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { MTNBackground } from "./components/MTNBackground";
import { BrandLogo } from "./components/common";
import { SCENES } from "./scenes";
import { FPS } from "./theme/timing";

/**
 * Composition principale (45 s). Le fond et le logo sont continus sur toute
 * la durée ; les scènes s'enchaînent bout à bout et assurent elles-mêmes
 * leurs raccords (transformations d'objets), sans défilement de compositions.
 */
export const MainAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <MTNBackground seed={22} lightUpFrom={0} lightUpDuration={30} parallax={-frame * 0.12} />
      <Series>
        {SCENES.map(({ id, seconds, Component }) => (
          <Series.Sequence key={id} durationInFrames={seconds * FPS} name={id} premountFor={30}>
            <Component />
          </Series.Sequence>
        ))}
      </Series>
      <BrandLogo appearAt={8} />
      <Audio
        src={staticFile("music/afro-pop-bed.wav")}
        volume={(f) => (f < durationInFrames - 45 ? 0.32 : 0.32 * Math.max(0, (durationInFrames - f) / 45))}
      />
    </AbsoluteFill>
  );
};
