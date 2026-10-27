import {Img, interpolate, useCurrentFrame} from 'remotion';
import {resolveAsset} from '../lib/assets';
import {useAdProps} from '../lib/context';
import {useFormat} from '../lib/format';

/**
 * Logo OHEL permanent en haut à droite, dans la zone de sécurité.
 * Affiché de la première frame jusqu'au début du CTA (`until`), qui a son propre logo.
 */
export const LogoBug: React.FC<{until: number}> = ({until}) => {
  const frame = useCurrentFrame();
  const {u, safe, width} = useFormat();
  const {draft} = useAdProps();
  const logo = resolveAsset('logo', draft);
  if (!logo.src || frame >= until) return null;
  const opacity = interpolate(frame, [0, 10, until - 10, until], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: safe.top + 10 * u,
        right: width - (width - safe.right),
        width: 190 * u,
        padding: `${8 * u}px ${12 * u}px`,
        background: '#fff',
        borderRadius: 12 * u,
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
        opacity,
      }}
    >
      <Img src={logo.src} style={{width: '100%', display: 'block'}} />
    </div>
  );
};
