import {useVideoConfig} from 'remotion';

/**
 * Mise en page adaptative : une seule base de code pour 1080x1920 et 1920x1080.
 * Marges de sécurité :
 *  - Vertical : zones d'interface des plateformes (Reels / TikTok / Shorts) en haut et en bas.
 *  - Horizontal : title-safe ~7 % latéral.
 */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  const u = Math.min(width, height) / 1080;
  const safe = vertical
    ? {top: 250, bottom: 430, left: 80, right: 80}
    : {top: 90, bottom: 170, left: 150, right: 150};
  return {
    width,
    height,
    vertical,
    u,
    safe,
    innerWidth: width - safe.left - safe.right,
    innerHeight: height - safe.top - safe.bottom,
  };
};

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
