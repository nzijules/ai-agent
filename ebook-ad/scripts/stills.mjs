// Contrôle qualité : rend des images fixes clés de chaque scène dans out/stills/.
// Usage : node scripts/stills.mjs [AdVertical|AdSquare|...] [frame,frame,...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const ids = (process.argv[2] ?? 'AdVertical,AdSquare').split(',');
const frames = (process.argv[3] ?? '20,70,110,140,200,260,300,360,400,470,560,640,720,800,860,900,960,1020,1080,1130,1190')
  .split(',')
  .map(Number);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
fs.mkdirSync('out/stills', {recursive: true});
for (const id of ids) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  for (const frame of frames) {
    const output = `out/stills/${id}-${String(frame).padStart(4, '0')}.jpg`;
    await renderStill({composition, serveUrl, frame, output, imageFormat: 'jpeg', jpegQuality: 80, browserExecutable});
    console.log(output);
  }
}
