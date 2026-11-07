import {Composition, Folder} from 'remotion';
import {DURATION_S, FPS, HEIGHT, SCENES, WIDTH} from './config';
import {Main} from './Main';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Recrutement} from './scenes/Scene2Recrutement';
import {Scene3Zones} from './scenes/Scene3Zones';
import {Scene4Remuneration} from './scenes/Scene4Remuneration';
import {Scene5Opportunite} from './scenes/Scene5Opportunite';
import {Scene6CTA} from './scenes/Scene6CTA';
import {Scene7Signature} from './scenes/Scene7Signature';
import {loadFonts} from './theme';

loadFonts();

const scenes = [
  ['Scene1-Hook', Scene1Hook, SCENES.hook.dur],
  ['Scene2-Recrutement', Scene2Recrutement, SCENES.recrutement.dur],
  ['Scene3-Zones', Scene3Zones, SCENES.zones.dur],
  ['Scene4-Remuneration', Scene4Remuneration, SCENES.remuneration.dur],
  ['Scene5-Opportunite', Scene5Opportunite, SCENES.opportunite.dur],
  ['Scene6-CTA', Scene6CTA, SCENES.cta.dur],
  ['Scene7-Signature', Scene7Signature, SCENES.signature.dur],
] as const;

export const Root: React.FC = () => (
  <>
    <Composition
      id="DiamondOptique"
      component={Main}
      defaultProps={{subtitles: false}}
      durationInFrames={DURATION_S * FPS}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="DiamondOptiqueSousTitres"
      component={Main}
      defaultProps={{subtitles: true}}
      durationInFrames={DURATION_S * FPS}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Folder name="Scenes">
      {scenes.map(([id, C, dur]) => (
        <Composition key={id} id={id} component={C} durationInFrames={dur * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
  </>
);
