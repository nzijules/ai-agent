import {Img, staticFile, useCurrentFrame} from 'remotion';
import {spr} from './anim';

/** Logo officiel Diamond Optique — toujours en haut à droite (zone de sécurité respectée) */
export const LogoBadge: React.FC<{delay?: number; hide?: number}> = ({delay = 6, hide}) => {
  const f = useCurrentFrame();
  const s = spr(f, delay, 16);
  const out = hide !== undefined ? 1 - spr(f, hide, 18) : 1;
  const v = s * out;
  return (
    <div
      style={{
        position: 'absolute',
        top: 96,
        right: 40,
        width: 300,
        padding: '14px 20px 10px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 26,
        boxShadow: '0 14px 40px rgba(0,0,0,0.28)',
        transform: `translateY(${(1 - v) * -40}px) scale(${0.85 + 0.15 * v})`,
        transformOrigin: 'top right',
        opacity: v,
        zIndex: 50,
      }}
    >
      <Img src={staticFile('img/logo-diamond-optique.png')} style={{width: '100%', display: 'block'}} />
    </div>
  );
};
