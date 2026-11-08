import React from "react";
import { AbsoluteFill, Composition, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./theme/fonts";
import { Stage } from "./components/common";
import { TikTokSafeZone } from "./components/TikTokSafeZone";
import { MainAd } from "./MainAd";
import { SCENES } from "./scenes";
import { FPS, HEIGHT, WIDTH } from "./theme/timing";

const TOTAL = SCENES.reduce((a, s) => a + s.frames, 0);

const MainNoVoice: React.FC = () => <MainAd withVoiceover={false} />;

/** Pub complète avec contrôle des zones TikTok (aperçu uniquement). */
const MainSafeZones: React.FC = () => (
  <AbsoluteFill>
    <MainAd />
    <TikTokSafeZone />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vidéo finale : 9:16 TikTok, avec voix-off */}
      <Composition id="MTN-Data-Ad" component={MainAd} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* Version sans voix-off (musique + effets sonores) */}
      <Composition id="MTN-Data-Ad-SansVoix" component={MainNoVoice} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition
        id="MTN-Data-Ad-SafeZones"
        component={MainSafeZones}
        durationInFrames={TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* Chaque scène seule (fond + logo + musique) pour l'édition */}
      {SCENES.map(({ id, frames, Component }) => (
        <Composition
          key={id}
          id={id}
          component={() => (
            <Stage>
              <Component dur={frames} />
              <Audio src={staticFile("music/afro-pop-bed.wav")} volume={0.3} />
            </Stage>
          )}
          durationInFrames={frames}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </>
  );
};
