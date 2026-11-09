import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Background, FilmFinish } from "./components/Background";
import { CornerLogo } from "./components/CornerLogo";
import { Particles } from "./components/Particles";
import { SceneShell } from "./components/SceneShell";
import { Subtitles } from "./components/Subtitles";
import { AUDIO, VIDEO } from "./config/video";
import { LINES, SCENES, SceneId } from "./data/script";
import { SCENE_COMPONENTS } from "./scenes";

/** Volume de la musique : baisse automatiquement pendant les répliques si une voix-off est présente. */
const musicVolume = (fps: number) => (f: number) => {
  const t = f / fps;
  if (!AUDIO.voiceover) return AUDIO.musicVolume;
  const speaking = LINES.some((l) => t >= l.start - 0.3 && t <= l.end + 0.3);
  return speaking ? AUDIO.musicVolumeUnderVoice : AUDIO.musicVolume;
};

export const AroSoftVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const T = VIDEO.transitionFrames;
  const ids = Object.keys(SCENES) as SceneId[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#090E18" }}>
      <Background />
      <Particles count={70} seed="global" />

      {ids.map((id, i) => {
        const s = SCENES[id];
        const start = Math.round(s.start * fps);
        const end = Math.min(Math.round(s.end * fps), durationInFrames);
        const inF = i === 0 ? 0 : T;
        // La scène sortante se fond pendant les T dernières images, qui recouvrent l'entrée de la suivante.
        const outF = i === ids.length - 1 ? 0 : T;
        const Comp = SCENE_COMPONENTS[id];
        return (
          <Sequence key={id} name={`${i + 1}. ${s.title}`} from={start - inF} durationInFrames={end - start + inF} premountFor={30}>
            <SceneShell inFrames={inF} outFrames={outF}>
              <Comp />
            </SceneShell>
          </Sequence>
        );
      })}

      <Subtitles />
      <CornerLogo />
      <FilmFinish />

      {AUDIO.music && (
        <Audio
          name="Musique"
          src={staticFile(AUDIO.music)}
          volume={(f) =>
            musicVolume(fps)(f) *
            interpolate(f, [0, fps * 2, durationInFrames - fps * 3, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      )}
      {/* Voix-off : un extrait du fichier par scène, posé selon SCENES[x].voice */}
      {AUDIO.voiceover &&
        ids.map((id) => {
          const v = SCENES[id].voice;
          return (
            <Sequence key={`vo-${id}`} name={`Voix-off ${id}`} from={Math.round(v.at * fps)} layout="none">
              <Audio
                src={staticFile(AUDIO.voiceover as string)}
                trimBefore={Math.round(v.from * fps)}
                trimAfter={Math.round(v.to * fps)}
                volume={AUDIO.voiceoverVolume}
              />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
