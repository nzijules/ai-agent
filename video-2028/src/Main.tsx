import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";
import { Captions } from "./components/Captions";
import { FilmFinish, LightSlit, Logo, SceneShell } from "./components/Common";
import { C, TimeCtx, scene } from "./lib/theme";
import { S1Choc } from "./scenes/S1Choc";
import { S2Transformation } from "./scenes/S2Transformation";
import { S3Copilote } from "./scenes/S3Copilote";
import { S4Equation } from "./scenes/S4Equation";
import { S5Question } from "./scenes/S5Question";
import { S6Risque } from "./scenes/S6Risque";
import { S7Renversement } from "./scenes/S7Renversement";
import { S8Redefinition } from "./scenes/S8Redefinition";
import { S9Conclusion } from "./scenes/S9Conclusion";
import { S10Final } from "./scenes/S10Final";

export const mainSchema = z.object({
  subtitles: z.boolean(),
  audio: z.boolean(),
});

export const Main: React.FC<z.infer<typeof mainSchema>> = ({ subtitles, audio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = (id: number) => ({ start: scene(id).start, end: scene(id).end });

  return (
    <TimeCtx.Provider value={t}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        <SceneShell {...s(1)} enter="cut" exit="zoom" push={0.05}>
          <S1Choc />
        </SceneShell>
        <SceneShell {...s(2)} enter="zoom" exit="slide" push={0.04} drift={-60}>
          <S2Transformation />
        </SceneShell>
        <SceneShell {...s(3)} enter="slide" exit="zoom" push={0.05}>
          <S3Copilote />
        </SceneShell>
        <SceneShell {...s(4)} enter="zoom" exit="iris" push={0.04}>
          <S4Equation />
        </SceneShell>
        <SceneShell {...s(5)} enter="iris" exit="glitch" push={0.1}>
          <S5Question />
        </SceneShell>
        <SceneShell {...s(6)} enter="glitch" exit="bloom" push={0.05}>
          <S6Risque />
        </SceneShell>
        <SceneShell {...s(7)} enter="bloom" exit="rise" push={0.05}>
          <S7Renversement />
        </SceneShell>
        <SceneShell {...s(8)} enter="rise" exit="zoom" push={0.03}>
          <S8Redefinition />
        </SceneShell>
        <SceneShell {...s(9)} enter="zoom" exit="bloom" push={0}>
          <S9Conclusion />
        </SceneShell>
        <SceneShell {...s(10)} enter="bloom" exit="cut" push={0.03}>
          <S10Final />
        </SceneShell>

        <LightSlit at={scene(2).start} />
        <LightSlit at={scene(3).start} vertical />
        <LightSlit at={scene(4).start} color={C.blue} />
        <LightSlit at={scene(6).start} color={C.orange} />
        <LightSlit at={scene(7).start} color={C.white} />
        <LightSlit at={scene(9).start} vertical />

        <FilmFinish />
        <Logo />
        {subtitles && <Captions />}
        {audio && <Audio src={staticFile("audio/mix.wav")} />}
      </AbsoluteFill>
    </TimeCtx.Provider>
  );
};
