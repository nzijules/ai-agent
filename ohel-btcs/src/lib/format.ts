import {useVideoConfig} from 'remotion';

/** Zones de sécurité 9:16 (Reels / TikTok / Stories). */
export const SAFE_VERTICAL = {top: 250, bottom: 420, right: 140, left: 60};
/** 16:9 : marges « title safe » classiques. */
export const SAFE_HORIZONTAL = {top: 80, bottom: 80, right: 120, left: 120};

export type Format = {
  vertical: boolean;
  width: number;
  height: number;
  safe: typeof SAFE_VERTICAL;
  /** Échelle typographique : 1 en 1080 × 1920, adaptée en 16:9. */
  u: number;
};

/** Une seule implémentation par scène : le format est lu ici. */
export const useFormat = (): Format => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  return {
    vertical,
    width,
    height,
    safe: vertical ? SAFE_VERTICAL : SAFE_HORIZONTAL,
    u: vertical ? width / 1080 : height / 1080,
  };
};
