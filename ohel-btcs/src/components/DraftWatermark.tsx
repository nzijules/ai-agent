import {AbsoluteFill} from 'remotion';
import {FONT} from '../lib/fonts';
import {useFormat} from '../lib/format';

export const DraftWatermark: React.FC = () => {
  const {u} = useFormat();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 150 * u,
          letterSpacing: 12 * u,
          color: 'rgba(255,255,255,0.10)',
          WebkitTextStroke: `${2 * u}px rgba(0,0,0,0.10)`,
          transform: 'rotate(-30deg)',
        }}
      >
        BROUILLON
      </div>
    </AbsoluteFill>
  );
};
