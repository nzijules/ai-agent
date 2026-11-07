import React from "react";
import { Composition } from "remotion";
import { Main, mainSchema } from "./Main";
import { FPS, TOTAL } from "./lib/theme";

const common = {
  component: Main,
  schema: mainSchema,
  width: 1080,
  height: 1920,
  fps: FPS,
  durationInFrames: Math.round(TOTAL * FPS),
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* Version avec sous-titres intégrés */}
    <Composition id="EtSiCetaitDansDeuxAns-SousTitres" {...common} defaultProps={{ subtitles: true, audio: true }} />
    {/* Version sans sous-titres incrustés (à combiner avec le fichier .srt) */}
    <Composition id="EtSiCetaitDansDeuxAns" {...common} defaultProps={{ subtitles: false, audio: true }} />
  </>
);
