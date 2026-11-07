/**
 * Rendu d'images de contrôle (2 par scène) pour la vérification visuelle.
 * Usage : npx tsx scripts/stills.ts [Vertical|Horizontal] [S01,S02...]
 */
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {SCENES} from '../src/data/timeline';

const orientation = process.argv[2] ?? 'Vertical';
const only = process.argv[3]?.split(',');
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';

(async () => {
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
  const id = `NovembreBleu-${orientation}`;
  const composition = await selectComposition({serveUrl, id, browserExecutable: fs.existsSync(browserExecutable) ? browserExecutable : null});
  fs.mkdirSync('out/stills', {recursive: true});
  for (const s of SCENES) {
    if (only && !only.includes(s.id)) continue;
    for (const k of [0.45, 0.9]) {
      const frame = s.startFrame + Math.round(s.durationFrames * k);
      await renderStill({
        serveUrl, composition, frame, browserExecutable: fs.existsSync(browserExecutable) ? browserExecutable : null,
        output: `out/stills/${orientation[0].toLowerCase()}-${s.id}-${Math.round(k * 100)}.jpg`, imageFormat: 'jpeg', jpegQuality: 80,
      });
    }
    console.log('ok', s.id);
  }
})();
