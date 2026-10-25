import {continueRender, delayRender, staticFile} from 'remotion';

const faces: Array<[string, number, string]> = [
  ['Plus Jakarta Sans', 400, 'fonts/plus-jakarta-sans-latin-400-normal.woff2'],
  ['Plus Jakarta Sans', 500, 'fonts/plus-jakarta-sans-latin-500-normal.woff2'],
  ['Plus Jakarta Sans', 600, 'fonts/plus-jakarta-sans-latin-600-normal.woff2'],
  ['Plus Jakarta Sans', 700, 'fonts/plus-jakarta-sans-latin-700-normal.woff2'],
  ['Plus Jakarta Sans', 800, 'fonts/plus-jakarta-sans-latin-800-normal.woff2'],
  ['Inter', 400, 'fonts/inter-latin-400-normal.woff2'],
  ['Inter', 500, 'fonts/inter-latin-500-normal.woff2'],
  ['Inter', 600, 'fonts/inter-latin-600-normal.woff2'],
  ['Inter', 700, 'fonts/inter-latin-700-normal.woff2'],
];

let loaded = false;

/** Charge les polices locales (OFL) avant le rendu de la première frame. */
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Chargement des polices');
  Promise.all(
    faces.map(([family, weight, file]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {
        weight: String(weight),
        style: 'normal',
      });
      return face.load().then((f) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(f));
    })
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
