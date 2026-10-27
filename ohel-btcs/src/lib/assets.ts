import {getRemotionEnvironment, staticFile} from 'remotion';
import {assets, type AssetDef, type AssetId} from '../config/assets';
import status from '../generated/asset-status.json';

export type ResolvedAsset = {
  def: AssetDef;
  /** URL utilisable, ou null si l'asset manque (→ placeholder). */
  src: string | null;
  /** true si c'est un fichier provisoire toléré en brouillon. */
  provisional: boolean;
  /** Nom de fichier attendu, pour le placeholder. */
  expected: string;
};

const st = status as Record<string, {path: string | null; draft: string | null}>;

export const resolveAsset = (id: AssetId, draft: boolean): ResolvedAsset => {
  const def: AssetDef = assets[id];
  const s = st[id] ?? {path: null, draft: null};
  if (s.path) return {def, src: staticFile(s.path), provisional: false, expected: def.candidates[0]};
  if (draft && s.draft) return {def, src: staticFile(s.draft), provisional: true, expected: def.candidates[0]};
  return {def, src: null, provisional: false, expected: def.candidates[0]};
};

export const isVideoFile = (src: string) => /\.(mp4|mov|webm)$/i.test(src);

export const isStudio = () => getRemotionEnvironment().isStudio;
