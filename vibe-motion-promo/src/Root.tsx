import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Background, Logo } from "./components";
import { Benefits, Book, Cta, Demo, Hook, Problem, Reveal } from "./scenes";
import { FPS, HEIGHT, SCENES, TOTAL, WIDTH } from "./theme";

export const Promo: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.dur}><Hook /></Sequence>
    <Sequence from={SCENES.problem.from} durationInFrames={SCENES.problem.dur}><Problem /></Sequence>
    <Sequence from={SCENES.reveal.from} durationInFrames={SCENES.reveal.dur}><Reveal /></Sequence>
    <Sequence from={SCENES.demo.from} durationInFrames={SCENES.demo.dur}><Demo /></Sequence>
    <Sequence from={SCENES.book.from} durationInFrames={SCENES.book.dur}><Book /></Sequence>
    <Sequence from={SCENES.benefits.from} durationInFrames={SCENES.benefits.dur}><Benefits /></Sequence>
    <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.dur}><Cta /></Sequence>
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
