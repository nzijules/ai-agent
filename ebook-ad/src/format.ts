import React, {createContext, useContext} from 'react';
import {useVideoConfig} from 'remotion';

/** Force la mise en page verticale (utilisé par SquareFit pour le format carré). */
export const ForceVertical = createContext(false);

/**
 * Infos de mise en page selon le format.
 * Zones de sécurité (TikTok / Reels / Shorts) :
 *  - vertical : contenu principal entre y=250 et y=1360, marges latérales 90 px,
 *    bande sous-titres 1390–1520, rien d'important sous 1540 (interface plateformes).
 *  - carré : la zone sûre verticale est réduite (×0,72) et centrée (voir SquareFit),
 *    bande sous-titres 900–1010.
 */
export const useFormat = () => {
  const {width, height} = useVideoConfig();
  const forced = useContext(ForceVertical);
  const vertical = forced || height > width * 1.3;
  return {
    vertical,
    width: forced ? 1080 : width,
    height: forced ? 1920 : height,
    padX: vertical ? 90 : 70,
    safeTop: vertical ? 250 : 70,
    safeBottom: vertical ? 1360 : 870,
    captionTop: vertical && !forced ? 1395 : 900,
    captionHeight: vertical && !forced ? 125 : 105,
  };
};

/** Zone sûre verticale (y 250 → 1360) affichée réduite dans le format carré. */
export const SQUARE_SCALE = 0.74;
export const SquareFit: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  if (height > width * 1.3) return React.createElement(React.Fragment, null, children);
  const s = SQUARE_SCALE;
  const x = (1080 - 1080 * s) / 2;
  const y = 52 - 250 * s;
  return React.createElement(
    ForceVertical.Provider,
    {value: true},
    React.createElement(
      'div',
      {style: {position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: 'top left'}},
      children
    )
  );
};
