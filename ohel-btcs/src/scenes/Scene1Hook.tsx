import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {AssetMedia, IllustrationMention} from '../components/AssetMedia';
import {resolveAsset} from '../lib/assets';
import {useAdProps} from '../lib/context';
import {useFormat} from '../lib/format';
import type {SceneProps} from './types';

/** Scène 1 — Hook : villa au crépuscule, travelling avant + parallaxe 2.5D (illustration). */
export const Scene1Hook: React.FC<SceneProps> = ({sequenceFrames}) => {
  const frame = useCurrentFrame();
  const {u} = useFormat();
  const t = interpolate(frame, [0, sequenceFrames], [0, 1], {easing: Easing.out(Easing.quad)});
  // Fond : avance lente ; premier plan (si fourni) : avance plus vite → effet 2.5D.
  const bg = `scale(${1.04 + t * 0.1}) translateY(${-t * 30 * u}px)`;
  const fg = `scale(${1.08 + t * 0.2}) translateY(${-t * 60 * u}px)`;
  return (
    <AbsoluteFill style={{backgroundColor: '#0E0A08'}}>
      <AbsoluteFill style={{transform: bg}}>
        <AssetMedia id="villaHook" hideMention />
      </AbsoluteFill>
      <AbsoluteFill style={{transform: fg}}>
        <AssetMedia id="villaHookForeground" optional hideMention />
      </AbsoluteFill>
      {/* Dégradé de lisibilité sous le titre */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)'}} />
      <MentionIfIa />
    </AbsoluteFill>
  );
};

/** Mention posée hors des calques en mouvement (reste fixe et lisible). */
const MentionIfIa: React.FC = () => {
  const {draft} = useAdProps();
  return resolveAsset('villaHook', draft).src ? <IllustrationMention /> : null;
};
