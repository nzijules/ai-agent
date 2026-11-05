import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Background, Flash, SceneWrap } from "./components";
import { Logo } from "./Logo";
import { CTA, Hook, Proof, Step1, Step2, Step3, Step4, Title, Tool } from "./scenes";
import { HAS_VOICEOVER, SCENES, VOICE_END } from "./theme";

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
      <Logo />
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) =>
          HAS_VOICEOVER
            ? interpolate(f, [0, 6, VOICE_END, VOICE_END + 20], [0.35, 0.24, 0.24, 0.75], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0.9
        }
      />
      {HAS_VOICEOVER ? <Audio src={staticFile("voiceover.mp3")} volume={1} /> : null}
    </AbsoluteFill>
  );
};
