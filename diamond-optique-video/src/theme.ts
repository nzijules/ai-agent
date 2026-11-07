import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const C = {
  bordeaux: '#B0152F',
  bordeauxDeep: '#7A0B1F',
  bordeauxDark: '#4A0612',
  gold: '#FFC928',
  goldDeep: '#E8A400',
  navy: '#14285C',
  navyDeep: '#0A1636',
  white: '#FFFFFF',
  ink: '#1B1B1F',
};

export const F = {
  display: 'Anton, Impact, sans-serif',
  body: 'Montserrat, Inter, sans-serif',
};

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  loadFont({family: 'Anton', url: staticFile('fonts/anton-latin-400-normal.woff2'), weight: '400'});
  for (const w of ['500', '600', '700', '800', '900']) {
    loadFont({family: 'Montserrat', url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`), weight: w});
  }
};
