// Usage : node tools/stills.mjs <composition> <dossier_sortie> <t1> <t2> ...  (temps en secondes) – aperçus pour contrôle
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const [comp, out, ...times] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const composition = await selectComposition({serveUrl, id: comp, browserExecutable});
for (const s of times) {
  const frame = Math.round(Number(s) * 30);
  await renderStill({composition, serveUrl, frame, output: path.join(out, `t${String(s).padStart(5, '0')}.jpg`), imageFormat: 'jpeg', scale: 0.5, browserExecutable});
}
console.log('done');
