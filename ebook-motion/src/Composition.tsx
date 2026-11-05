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

// Timeline (seconds) — synced to the pauses of public/voiceover.mp3 (see VOICEOVER_SCRIPT.md)
export const SCENES = [
  { id: "hook", from: 0, dur: 5.3, C: Hook },
  { id: "problem", from: 5.3, dur: 6.9, C: Problem },
  { id: "secret", from: 12.2, dur: 7.4, C: Secret },
  { id: "step1", from: 19.6, dur: 8.3, C: Step1 },
  { id: "step2", from: 27.9, dur: 8.1, C: Step2 },
  { id: "step3", from: 36, dur: 6.7, C: Step3 },
  { id: "recap", from: 42.7, dur: 6.3, C: Recap },
  { id: "turn", from: 49, dur: 2.3, C: Turn },
  { id: "cta", from: 51.3, dur: 12.7, C: CTA },
] as const;

// The music's big drop is at 52s in music.wav; trimming 0.7s lands it on the CTA (51.3s).
const MUSIC_OFFSET = 21;
const VO_END = 60;

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
  const bgIntensity = interpolate(f, [sec(46.5), sec(49.5), sec(51.3)], [1, 0.35, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        trimBefore={MUSIC_OFFSET}
        volume={(fr) => {
          const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
          // ducked under the voice, swells back once the voice-over ends
          const base = voiceover ? interpolate(fr, [sec(VO_END), sec(VO_END) + 15], [0.2, 0.55], cl) : 0.6;
          return base * interpolate(fr, [sec(TOTAL) - 50, sec(TOTAL)], [1, 0], cl);
        }}
      />
      {voiceover && <Audio src={staticFile(voiceover)} volume={1} />}
      {SCENES.slice(1).map(({ id, from }) => (
        <Sequence key={`w-${id}`} from={sec(from) - 6} durationInFrames={30} layout="none">
          <Audio src={staticFile("sfx-whoosh.wav")} volume={0.35} />
        </Sequence>
      ))}
      {NOTIF_TIMES.map((t) => (
        <Sequence key={`c-${t}`} from={sec(36) + t} durationInFrames={30} layout="none">
          <Audio src={staticFile("sfx-cash.wav")} volume={0.4} />
        </Sequence>
      ))}
      {[sec(5.3) + 6, sec(5.3) + 40, sec(5.3) + 79, sec(51.3) + 92, sec(51.3) + 130].map((t) => (
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
      defaultProps={{ voiceover: "voiceover.mp3" } as Props}
    />
  );
};
