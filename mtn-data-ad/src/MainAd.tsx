import React from "react";
import { AbsoluteFill, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { MTNBackground } from "./components/MTNBackground";
import { BrandLogo } from "./components/common";
import { SCENES } from "./scenes";

/** Voix-off enregistrée (public/voiceover). Fin de la parole : 45,6 s. */
export const VOICEOVER = { src: "voiceover/astuce-mtn-connexion.mp3", endSeconds: 45.6 };

/**
 * Composition principale (49 s). Fond et logo continus ; les scènes
 * s'enchaînent bout à bout (durées calées sur la voix-off) et assurent
 * elles-mêmes leurs raccords par transformation d'objets.
 */
export const MainAd: React.FC<{ withVoiceover?: boolean }> = ({ withVoiceover = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const voEnd = Math.round(VOICEOVER.endSeconds * fps);

  // Musique : « ducking » sous la voix, remontée sur la tenue finale, fondu de sortie.
  const musicVolume = (f: number) => {
    const fadeOut = Math.max(0, Math.min(1, (durationInFrames - f) / 40));
    if (!withVoiceover) return 0.32 * fadeOut;
    const duck = f < voEnd ? 0.13 : 0.13 + Math.min(1, (f - voEnd) / 12) * 0.19;
    return duck * fadeOut;
  };

  return (
    <AbsoluteFill>
      <MTNBackground seed={22} lightUpFrom={0} lightUpDuration={30} parallax={-frame * 0.12} />
      <Series>
        {SCENES.map(({ id, frames, Component }) => (
          <Series.Sequence key={id} durationInFrames={frames} name={id} premountFor={30}>
            <Component dur={frames} withAudio />
          </Series.Sequence>
        ))}
      </Series>
      <BrandLogo appearAt={8} />
      <Audio src={staticFile("music/afro-pop-bed.wav")} volume={musicVolume} />
      {withVoiceover ? <Audio src={staticFile(VOICEOVER.src)} volume={1.15} /> : null}
    </AbsoluteFill>
  );
};
