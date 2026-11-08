import { Composition, Folder } from "remotion";
import { LoginSecurityVideo, VIDEO_DURATION } from "./Video";
import { D } from "./timing";
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
        durationInFrames={D.hook}
        {...common}
      />
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={D.intro}
        {...common}
      />
      <Composition
        id="A1-BruteForce"
        component={A1BruteForce}
        durationInFrames={D.a1}
        {...common}
      />
      <Composition
        id="A2-Enumeration"
        component={A2Enumeration}
        durationInFrames={D.a2}
        {...common}
      />
      <Composition
        id="A3-Bypass"
        component={A3Bypass}
        durationInFrames={D.a3}
        {...common}
      />
      <Composition
        id="A4-Database"
        component={A4Database}
        durationInFrames={D.a4}
        {...common}
      />
      <Composition
        id="A5-Session"
        component={A5Session}
        durationInFrames={D.a5}
        {...common}
      />
      <Composition
        id="Bonus-2FA"
        component={Bonus2FA}
        durationInFrames={D.bonus}
        {...common}
      />
      <Composition
        id="ClaudeCode"
        component={ClaudeCode}
        durationInFrames={D.claude}
        {...common}
      />
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={D.outro}
        {...common}
      />
    </Folder>
  </>
);
