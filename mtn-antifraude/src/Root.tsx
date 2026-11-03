import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {DURATION_S, FPS} from './timing';
import {FraudeIA} from './ia/FraudeIA';
import {DURATION_IA} from './ia/timing';
import {FraudeMobile} from './mobile/FraudeMobile';
import {DURATION_M} from './mobile/timing';
import {FraudeMobileV2} from './mobile/v2/FraudeMobileV2';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="MTNAntifraude"
    component={Video}
    durationInFrames={Math.round(DURATION_S * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
  <Composition id="FraudeIA" component={FraudeIA} durationInFrames={Math.round(DURATION_IA * FPS)} fps={FPS} width={1920} height={1080} />
  <Composition id="FraudeIAMobile" component={FraudeMobile} durationInFrames={Math.round(DURATION_M * FPS)} fps={FPS} width={1080} height={1920} />
  <Composition id="FraudeIAMobileV2" component={FraudeMobileV2} durationInFrames={Math.round(DURATION_M * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);

