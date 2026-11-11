import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile } from "remotion";
import { Background, Logo } from "./components";
import { Book, Demo, Hook, Problem, Reveal } from "./scenes";
import { Audience, Cta, Learn1, Learn2, Price, Projects, Receive } from "./scenes2";
import { FPS, HEIGHT, SCENES, TOTAL, WIDTH } from "./theme";

const LIST: [keyof typeof SCENES, React.FC][] = [
  ["hook", Hook],
  ["problem", Problem],
  ["reveal", Reveal],
  ["book", Book],
  ["learn1", Learn1],
  ["learn2", Learn2],
  ["demo", Demo],
  ["projects", Projects],
  ["audience", Audience],
  ["receive", Receive],
  ["price", Price],
  ["cta", Cta],
];

export const Promo: React.FC = () => (
  <AbsoluteFill>
    <Audio
      src={staticFile("music.mp3")}
      volume={(f) =>
        interpolate(f, [0, 15, TOTAL - 45, TOTAL], [0, 0.85, 0.85, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
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
