import {AbsoluteFill} from 'remotion';
import {FONT} from '../lib/fonts';
import {useFormat} from '../lib/format';

/** Visualise les zones réservées par l'interface des réseaux (prévisualisation uniquement). */
export const SafeZoneOverlay: React.FC = () => {
  const {safe, width, height, vertical} = useFormat();
  const zone: React.CSSProperties = {
    position: 'absolute',
    background: 'rgba(255, 0, 90, 0.28)',
    color: '#fff',
    fontFamily: FONT,
    fontWeight: 600,
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{...zone, left: 0, top: 0, width, height: safe.top}}>{vertical ? 'HAUT 250 px — compte, « Suivre »' : 'marge titre'}</div>
      <div style={{...zone, left: 0, bottom: 0, width, height: safe.bottom}}>
        {vertical ? 'BAS 420 px — légende, CTA plateforme' : 'marge titre'}
      </div>
      <div
        style={{...zone, right: 0, top: safe.top, width: safe.right, height: height - safe.top - safe.bottom, writingMode: 'vertical-rl'}}
      >
        {vertical ? 'DROITE 140 px — icônes' : ''}
      </div>
      <div
        style={{
          ...zone,
          left: 0,
          top: safe.top,
          width: safe.left,
          height: height - safe.top - safe.bottom,
          background: 'rgba(255,200,0,0.18)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          top: safe.top,
          right: safe.right,
          bottom: safe.bottom,
          outline: '3px dashed rgba(0,255,170,0.9)',
        }}
      />
    </AbsoluteFill>
  );
};
