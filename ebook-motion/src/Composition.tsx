import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./components/Background";
import { Logo } from "./components/Logo";
import { SceneWrap } from "./components/SceneWrap";
import { CTA } from "./scenes/CTA";
import { Hook } from "./scenes/Hook";
import { Problem } from "./scenes/Problem";
import { Recap } from "./scenes/Recap";
import { Secret } from "./scenes/Secret";
import { Step1 } from "./scenes/Step1";
import { Step2 } from "./scenes/Step2";
import { NOTIF_TIMES, Step3 } from "./scenes/Step3";
import { Turn } from "./scenes/Turn";
import { C, FPS, sec } from "./theme";

type Props = {
  /** Put your voice-over in /public (e.g. "voiceover.mp3") and set its file name here. */
  voiceover: string | null;
};

// Timeline (seconds) — matches the voice-over script in VOICEOVER_SCRIPT.md
export const SCENES = [
  { id: "hook", from: 0, dur: 5, C: Hook },
  { id: "problem", from: 5, dur: 6, C: Problem },
  { id: "secret", from: 11, dur: 7, C: Secret },
  { id: "step1", from: 18, dur: 9, C: Step1 },
  { id: "step2", from: 27, dur: 8, C: Step2 },
  { id: "step3", from: 35, dur: 8, C: Step3 },
  { id: "recap", from: 43, dur: 5, C: Recap },
  { id: "turn", from: 48, dur: 4, C: Turn },
  { id: "cta", from: 52, dur: 12, C: CTA },
] as const;

const TOTAL = 64;

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: "rgba(255,255,255,0.08)", zIndex: 40 }}>
      <div style={{ width: `${(f / durationInFrames) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.cyan}, ${C.blue})`, boxShadow: `0 0 16px ${C.cyan}` }} />
    </div>
  );
};

export const EbookAd: React.FC<Props> = ({ voiceover }) => {
  const f = useCurrentFrame();
  const bgIntensity = interpolate(f, [sec(48), sec(50), sec(52)], [1, 0.35, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const musicVol = voiceover ? 0.22 : 0.6;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background intensity={bgIntensity} />

      {SCENES.map(({ id, from, dur, C: Scene }) => (
        <Sequence key={id} name={id} from={sec(from)} durationInFrames={sec(dur)}>
          <SceneWrap exit={id !== "cta"}>
            <Scene />
          </SceneWrap>
        </Sequence>
      ))}

      <Logo />
      <ProgressBar />

      {/* ---- audio ---- */}
      <Audio
        src={staticFile("music.wav")}
        volume={(fr) => musicVol * interpolate(fr, [sec(TOTAL) - 45, sec(TOTAL)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {voiceover && <Audio src={staticFile(voiceover)} volume={1} />}
      {SCENES.slice(1).map(({ id, from }) => (
        <Sequence key={`w-${id}`} from={sec(from) - 6} durationInFrames={30} layout="none">
          <Audio src={staticFile("sfx-whoosh.wav")} volume={0.35} />
        </Sequence>
      ))}
      {NOTIF_TIMES.map((t) => (
        <Sequence key={`c-${t}`} from={sec(35) + t} durationInFrames={30} layout="none">
          <Audio src={staticFile("sfx-cash.wav")} volume={0.4} />
        </Sequence>
      ))}
      {[sec(5) + 4, sec(5) + 26, sec(5) + 48, sec(52) + 96, sec(52) + 150].map((t) => (
        <Sequence key={`p-${t}`} from={t} durationInFrames={10} layout="none">
          <Audio src={staticFile("sfx-pop.wav")} volume={0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="EbookAd"
      component={EbookAd}
      durationInFrames={sec(TOTAL)}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ voiceover: null } as Props}
    />
  );
};
