import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const colors = {
  navy: '#07162E',
  blue: '#103E8C',
  electric: '#278CE0',
  gold: '#E5B875',
  white: '#F5F7FA',
  navyDeep: '#030B19',
  ink: '#0B1F3F',
  skin: '#5A3A28', // teinte de silhouette chaude (placeholders)
} as const;

export const fonts = {
  display: 'Montserrat',
  body: 'Inter',
} as const;

const fontFiles: Array<[string, string, string]> = [
  ['Montserrat', 'montserrat-latin-800-normal.woff2', '800'],
  ['Montserrat', 'montserrat-latin-700-normal.woff2', '700'],
  ['Inter', 'inter-latin-400-normal.woff2', '400'],
  ['Inter', 'inter-latin-500-normal.woff2', '500'],
  ['Inter', 'inter-latin-600-normal.woff2', '600'],
  ['Inter', 'inter-latin-700-normal.woff2', '700'],
];

let fontsPromise: Promise<unknown> | null = null;
export const loadAllFonts = () => {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      fontFiles.map(([family, file, weight]) =>
        loadFont({family, url: staticFile(`assets/fonts/${file}`), weight, display: 'block'}),
      ),
    );
  }
  return fontsPromise;
};

export const easing = {
  // courbes "cinéma" : sortie douce, entrée franche
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  soft: [0.33, 0, 0.2, 1] as const,
};
