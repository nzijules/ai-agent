import {Composition} from 'remotion';
import {AdComposition} from './compositions/AdComposition';
import {COMPOSITIONS} from './config/formats';
import {FPS, timeline} from './config/scripts';
import {adProps, type AdProps} from './lib/props';

export const RemotionRoot: React.FC = () => (
  <>
    {COMPOSITIONS.map((f) => (
      <Composition
        key={f.id}
        id={f.id}
        component={(p: AdProps) => <AdComposition {...p} version={f.version} />}
        schema={adProps}
        defaultProps={{draft: true, showSafeZones: false}}
        durationInFrames={timeline(f.version).durationInFrames}
        fps={FPS}
        width={f.width}
        height={f.height}
      />
    ))}
  </>
);
