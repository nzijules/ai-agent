import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {AssetId} from '../config/assets';
import {resolveAsset} from '../lib/assets';
import {useAdProps} from '../lib/context';
import {useFormat} from '../lib/format';
import {AssetMedia, IllustrationMention} from './AssetMedia';

export type CameraMove = {
  /** Position horizontale du cadre (%) au début et à la fin, utile en 9:16 sur un visuel paysage. */
  x?: [number, number];
  y?: [number, number];
  scale?: [number, number];
};

/**
 * Plan photo unique de la ligne visuelle « De la terre à la villa » :
 * mouvement de caméra lent, étalonnage chaud commun, dégradé de lisibilité,
 * mention fixe sur les visuels IA.
 */
export const PhotoPlate: React.FC<{
  id: AssetId;
  frames: number;
  move?: CameraMove;
  /** Assombrissement bas de cadre pour les titres et sous-titres (0–1). */
  shade?: number;
  /**
   * 'framed' : photo entière posée sur un fond flou d'elle-même. Pour les photos
   * réelles en paysage ou en basse définition, qu'un recadrage 9:16 abîmerait.
   */
  fit?: 'cover' | 'framed';
}> = ({id, frames, move = {}, shade = 0.6, fit = 'cover'}) => {
  const frame = useCurrentFrame();
  const {vertical} = useFormat();
  const {draft} = useAdProps();
  const t = interpolate(frame, [0, frames], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const [x0, x1] = move.x ?? [50, 50];
  const [y0, y1] = move.y ?? [50, 50];
  const [s0, s1] = move.scale ?? [1.04, 1.12];
  const x = vertical ? x0 + (x1 - x0) * t : 50;
  const y = y0 + (y1 - y0) * t;
  const scale = s0 + (s1 - s0) * t;
  const asset = resolveAsset(id, draft);
  if (fit === 'framed' && asset.src) {
    return (
      <AbsoluteFill style={{backgroundColor: '#0E0A08', overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: 'scale(1.25)', filter: 'blur(40px) brightness(0.45) saturate(1.1)'}}>
          <AssetMedia id={id} hideMention />
        </AbsoluteFill>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: vertical ? 260 : 0}}>
          <div
            style={{
              width: vertical ? '92%' : '78%',
              aspectRatio: '4 / 3',
              position: 'relative',
              transform: `scale(${0.98 + 0.06 * t})`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
              borderRadius: 18,
              overflow: 'hidden',
            }}
          >
            <AssetMedia id={id} hideMention />
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,${shade}) 100%)`}} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: '#0E0A08', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: `${x}% ${y}%`}}>
        <AssetMedia id={id} hideMention style={{objectPosition: `${x}% ${y}%`}} />
      </AbsoluteFill>
      {/* Étalonnage commun : léger voile chaud + vignettage */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,6,3,0.45) 100%)'}} />
      <AbsoluteFill style={{background: 'rgba(255,170,90,0.05)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,${shade}) 100%)`}} />
      {asset.src && asset.def.ia ? <IllustrationMention /> : null}
    </AbsoluteFill>
  );
};
