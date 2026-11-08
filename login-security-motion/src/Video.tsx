import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { D, TRANSITION } from "./timing";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Logo } from "./components/Logo";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { A1BruteForce } from "./scenes/A1BruteForce";
import { A2Enumeration } from "./scenes/A2Enumeration";
import { A3Bypass } from "./scenes/A3Bypass";
import { A4Database } from "./scenes/A4Database";
import { A5Session } from "./scenes/A5Session";
import { Bonus2FA } from "./scenes/Bonus2FA";
import { ClaudeCode } from "./scenes/ClaudeCode";
import { Outro } from "./scenes/Outro";
import { easeInOut } from "./theme";

const SCENES = [
  { name: "Hook", C: Hook, d: D.hook },
  { name: "Intro", C: Intro, d: D.intro },
  { name: "1 · Force brute", C: A1BruteForce, d: D.a1 },
  { name: "2 · Messages d'erreur", C: A2Enumeration, d: D.a2 },
  { name: "3 · Contrôle navigateur", C: A3Bypass, d: D.a3 },
  { name: "4 · Base de données", C: A4Database, d: D.a4 },
  { name: "5 · Sessions", C: A5Session, d: D.a5 },
  { name: "Bonus 2FA", C: Bonus2FA, d: D.bonus },
  { name: "Claude Code", C: ClaudeCode, d: D.claude },
  { name: "Outro", C: Outro, d: D.outro },
];

export const VIDEO_DURATION =
  SCENES.reduce((a, s) => a + s.d, 0) - TRANSITION * (SCENES.length - 1);

export const LoginSecurityVideo: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence
            key={s.name}
            name={s.name}
            durationInFrames={s.d}
          >
            <s.C />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        const presentation =
          i === 1 || i === SCENES.length - 1
            ? fade()
            : slide({ direction: "from-right" });
        return [
          <TransitionSeries.Transition
            key={`t-${s.name}`}
            presentation={presentation}
            timing={linearTiming({
              durationInFrames: TRANSITION,
              easing: easeInOut,
            })}
          />,
          seq,
        ];
      })}
    </TransitionSeries>
    <Logo />
    <Audio src={staticFile("voiceover.mp3")} />
  </AbsoluteFill>
);
