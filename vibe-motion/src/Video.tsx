import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Background, Flash, SceneWrap } from "./components";
import { CTA, Hook, Proof, Step1, Step2, Step3, Step4, Title, Tool } from "./scenes";
import { HAS_VOICEOVER, SCENES } from "./theme";

const list: [keyof typeof SCENES, React.FC][] = [
  ["hook", Hook],
  ["title", Title],
  ["tool", Tool],
  ["step1", Step1],
  ["step2", Step2],
  ["step3", Step3],
  ["step4", Step4],
  ["proof", Proof],
  ["cta", CTA],
];

export const VibeMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {list.map(([key, Comp]) => {
        const [from, to] = SCENES[key];
        return (
          <Sequence key={key} from={from} durationInFrames={to - from} name={key}>
            <SceneWrap duration={to - from} noExit={key === "cta" || key === "proof"}>
              <Comp />
            </SceneWrap>
          </Sequence>
        );
      })}
      {list.slice(1, 7).map(([key]) => (
        <Flash key={key} at={SCENES[key][0]} />
      ))}
      <Audio
        src={staticFile("music.mp3")}
        volume={HAS_VOICEOVER ? 0.28 : 0.9}
      />
      {HAS_VOICEOVER ? <Audio src={staticFile("voiceover.mp3")} volume={1} /> : null}
    </AbsoluteFill>
  );
};
