/**
 * Captures de contrôle : une image par plan (milieu du plan), avec zones de sécurité.
 *   npm run stills -- Ad15Vertical
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {COMPOSITIONS} from '../src/config/formats';
import {timeline} from '../src/config/scripts';
import {BROWSER} from './browser';

const ROOT = join(__dirname, '..');
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const safe = !process.argv.includes('--no-safe');

for (const c of COMPOSITIONS.filter((c) => !wanted.length || wanted.includes(c.id))) {
  const dir = join(ROOT, 'out', 'stills', c.id);
  mkdirSync(dir, {recursive: true});
  for (const seg of timeline(c.version).segments) {
    seg.shots.forEach((sh, i) => {
      const frame = seg.from + sh.from + Math.floor(sh.frames * 0.6);
      const file = join(dir, `${String(frame).padStart(4, '0')}-${seg.scene}-${i + 1}.jpg`);
      execFileSync(
        'npx',
        [
          'remotion',
          'still',
          'src/index.ts',
          c.id,
          file,
          `--frame=${frame}`,
          `--props=${JSON.stringify({draft: true, showSafeZones: safe})}`,
          ...BROWSER,
        ],
        {cwd: ROOT, stdio: 'inherit'},
      );
    });
  }
}
