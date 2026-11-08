import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile } from "remotion";
import { SCENES, SCENE_STARTS, sceneFrames } from "./timeline";
import { fontFaceCss } from "./fonts.css";
import { FilmGrain } from "./components/Backdrop";
import { Hud } from "./components/Hud";
import { Captions } from "./components/Captions";
import { Shell } from "./components/Shell";
import { SFX } from "./sfx";
import { S1Appel } from "./scenes/S1Appel";
import { S2Confiance } from "./scenes/S2Confiance";
import { S3Identite } from "./scenes/S3Identite";
import { S4Menace } from "./scenes/S4Menace";
import { S5Code } from "./scenes/S5Code";
import { S6Forensic } from "./scenes/S6Forensic";
import { S7Verdict } from "./scenes/S7Verdict";
import { S8Reflexes } from "./scenes/S8Reflexes";
import { S9Conclusion } from "./scenes/S9Conclusion";
import { C } from "./theme";

const SCENE_COMPONENTS: React.FC[] = [S1Appel, S2Confiance, S3Identite, S4Menace, S5Code, S6Forensic, S7Verdict, S8Reflexes, S9Conclusion];

export type MainProps = {
  /** fichier placé dans public/ (ex. "voiceover.mp3"). Laisser vide pour une version sans voix. */
  voiceover: string;
  voiceoverVolume: number;
  sfx: boolean;
  sfxVolume: number;
  captions: boolean;
};

export const mainSchemaDefaults: MainProps = {
  voiceover: "",
  voiceoverVolume: 1,
  sfx: true,
  sfxVolume: 0.8,
  captions: true,
};

const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all([400, 500, 600, 700, 800, 900].map((w) => document.fonts.load(`${w} 40px Inter`)))
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

const SceneBlock: React.FC<{ index: number; captions: boolean }> = ({ index, captions }) => {
  const s = SCENES[index];
  const Comp = SCENE_COMPONENTS[index];
  return (
    <AbsoluteFill>
      <Shell flash={index === 6 ? C.red : C.yellow}>
        <Comp />
      </Shell>
      <Hud sceneLabel={s.title} dark={index === 6} />
      {captions && <Captions chunks={s.vo} duration={sceneFrames(s)} />}
    </AbsoluteFill>
  );
};

export const Main: React.FC<MainProps> = ({ voiceover, voiceoverVolume, sfx, sfxVolume, captions }) => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <style>{fontFaceCss}</style>
      {SCENES.map((s, i) => (
        <Sequence key={s.id} from={SCENE_STARTS[i]} durationInFrames={sceneFrames(s)} name={`${i + 1}. ${s.title}`}>
          <SceneBlock index={i} captions={captions} />
        </Sequence>
      ))}
      <FilmGrain />
      {sfx && <SFX volume={sfxVolume} />}
      {voiceover ? <Audio src={staticFile(voiceover)} volume={voiceoverVolume} /> : null}
    </AbsoluteFill>
  );
};

export const SceneStandalone: React.FC<{ index: number }> = ({ index }) => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <style>{fontFaceCss}</style>
      <SceneBlock index={index} captions />
      <FilmGrain />
    </AbsoluteFill>
  );
};
