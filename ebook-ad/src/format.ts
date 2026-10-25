import {useVideoConfig} from 'remotion';

/**
 * Infos de mise en page selon le format.
 * Zones de sécurité (TikTok / Reels / Shorts) :
 *  - vertical : contenu principal entre y=250 et y=1360, marges latérales 90 px,
 *    bande sous-titres 1390–1520, rien d'important sous 1540 (interface plateformes).
 *  - carré : marges 70 px, bande sous-titres 900–1010.
 */
export const useFormat = () => {
  const {width, height} = useVideoConfig();
  const vertical = height > width * 1.3;
  return {
    vertical,
    width,
    height,
    padX: vertical ? 90 : 70,
    safeTop: vertical ? 250 : 70,
    safeBottom: vertical ? 1360 : 870,
    captionTop: vertical ? 1395 : 892,
    captionHeight: vertical ? 125 : 110,
  };
};
