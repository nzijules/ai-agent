import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile } from "remotion";
import { Background, Logo } from "./components";
import { Book, Demo, Reveal } from "./scenes";
import { Cta, Price, Receive } from "./scenes2";
import { Hook, Problem, Program, Steps, Usage } from "./scenes3";
import { FPS, HEIGHT, SCENES, TOTAL, VO, VO_DELAY, WIDTH } from "./theme";

const LIST: [string, React.FC][] = [
  ["hook", Hook],
  ["problem", Problem],
  ["reveal", Reveal],
  ["book", Book],
  ["demo", Demo],
  ["program", Program],
  ["usage", Usage],
  ["receive", Receive],
  ["price", Price],
  ["steps", Steps],
  ["cta", Cta],
];

// Voice-over windows in composition frames, used to duck the music.
const VO_WINDOWS = VO.map((v) => {
  const from = SCENES[v.scene].from + VO_DELAY;
  return [from, from + Math.round((v.end - v.start) * FPS)] as const;
});

const MUSIC_FULL = 0.6;
const MUSIC_DUCKED = 0.16;

const musicVolume = (f: number) => {
  let duck = 0;
  for (const [a, b] of VO_WINDOWS) {
    // 8-frame ramps around each spoken segment
    const d = interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    duck = Math.max(duck, d);
  }
  const fade = interpolate(f, [0, 12, TOTAL - 40, TOTAL], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return fade * (MUSIC_FULL + (MUSIC_DUCKED - MUSIC_FULL) * duck);
};

export const Promo: React.FC = () => (
  <AbsoluteFill>
    <Audio src={staticFile("music.mp3")} volume={musicVolume} />
    {VO.map((v) => (
      <Sequence
        key={v.scene}
        from={SCENES[v.scene].from + VO_DELAY}
        durationInFrames={Math.round((v.end - v.start) * FPS)}
        layout="none"
      >
        <Audio
          src={staticFile("voiceover.mp3")}
          trimBefore={Math.round(v.start * FPS)}
          trimAfter={Math.round(v.end * FPS)}
          volume={1}
        />
      </Sequence>
    ))}
    <Background />
    {LIST.map(([k, C]) => (
      <Sequence key={k} from={SCENES[k].from} durationInFrames={SCENES[k].dur}>
        <C />
      </Sequence>
    ))}
    <Logo />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VibeMotionPromo"
    component={Promo}
    durationInFrames={TOTAL}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
