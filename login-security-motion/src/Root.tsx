import { Composition, Folder } from "remotion";
import { LoginSecurityVideo, VIDEO_DURATION } from "./Video";
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
import { FPS, HEIGHT, WIDTH } from "./theme";

const common = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LoginSecurity"
      component={LoginSecurityVideo}
      durationInFrames={VIDEO_DURATION}
      {...common}
    />
    <Folder name="Scenes">
      <Composition
        id="Hook"
        component={Hook}
        durationInFrames={HOOK_DURATION}
        {...common}
      />
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={INTRO_DURATION}
        {...common}
      />
      <Composition
        id="A1-BruteForce"
        component={A1BruteForce}
        durationInFrames={ATTACK_DURATION}
        {...common}
      />
      <Composition
        id="A2-Enumeration"
        component={A2Enumeration}
        durationInFrames={ATTACK_DURATION}
        {...common}
      />
      <Composition
        id="A3-Bypass"
        component={A3Bypass}
        durationInFrames={ATTACK_DURATION}
        {...common}
      />
      <Composition
        id="A4-Database"
        component={A4Database}
        durationInFrames={ATTACK_DURATION}
        {...common}
      />
      <Composition
        id="A5-Session"
        component={A5Session}
        durationInFrames={ATTACK_DURATION}
        {...common}
      />
      <Composition
        id="Bonus-2FA"
        component={Bonus2FA}
        durationInFrames={BONUS_DURATION}
        {...common}
      />
      <Composition
        id="ClaudeCode"
        component={ClaudeCode}
        durationInFrames={CLAUDE_DURATION}
        {...common}
      />
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={OUTRO_DURATION}
        {...common}
      />
    </Folder>
  </>
);
