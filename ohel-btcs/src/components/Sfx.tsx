import {Audio, Sequence} from 'remotion';
import type {AssetId} from '../config/assets';
import {resolveAsset} from '../lib/assets';

/** Effet sonore discret, joué seulement si le fichier sous licence est fourni. */
export const Sfx: React.FC<{id: AssetId; at: number; volume?: number}> = ({id, at, volume = 0.5}) => {
  const a = resolveAsset(id, false);
  if (!a.src) return null;
  return (
    <Sequence from={at} layout="none">
      <Audio src={a.src} volume={volume} />
    </Sequence>
  );
};
