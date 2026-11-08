import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Logo } from "./components/Logo";
import { ATTACK_DURATION } from "./components/AttackLayout";
import { Hook, HOOK_DURATION } from "./scenes/Hook";
import { Intro, INTRO_DURATION } from "./scenes/Intro";
import { A1BruteForce } from "./scenes/A1BruteForce";
import { A2Enumeration } from "./scenes/A2Enumeration";
import { A3Bypass } from "./scenes/A3Bypass";
import { A4Database } from "./scenes/A4Database";
import { A5Session } from "./scenes/A5Session";
import { Bonus2FA, BONUS_DURATION } from "./scenes/Bonus2FA";
import { ClaudeCode, CLAUDE_DURATION } from "./scenes/ClaudeCode";
import { Outro, OUTRO_DURATION } from "./scenes/Outro";
import { easeInOut } from "./theme";

export const TRANSITION = 16;

const SCENES = [
  { name: "Hook", C: Hook, d: HOOK_DURATION },
  { name: "Intro", C: Intro, d: INTRO_DURATION },
  { name: "1 · Force brute", C: A1BruteForce, d: ATTACK_DURATION },
  { name: "2 · Messages d'erreur", C: A2Enumeration, d: ATTACK_DURATION },
  { name: "3 · Contrôle navigateur", C: A3Bypass, d: ATTACK_DURATION },
  { name: "4 · Base de données", C: A4Database, d: ATTACK_DURATION },
  { name: "5 · Sessions", C: A5Session, d: ATTACK_DURATION },
  { name: "Bonus 2FA", C: Bonus2FA, d: BONUS_DURATION },
  { name: "Claude Code", C: ClaudeCode, d: CLAUDE_DURATION },
  { name: "Outro", C: Outro, d: OUTRO_DURATION },
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
  </AbsoluteFill>
);
