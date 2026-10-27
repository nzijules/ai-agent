/**
 * Rendu des MP4 (H.264).
 *   npm run render:all                 → les 4 versions finales (refusé si un asset bloquant manque)
 *   npm run render:draft               → brouillons filigranés (placeholders autorisés)
 *   npm run render:draft -- Ad15Vertical
 *   npm run render:preview             → aperçu client sans filigrane (mêmes tolérances que le brouillon)
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {COMPOSITIONS} from '../src/config/formats';
import {BROWSER} from './browser';
import {checkFinal} from './preflight';

const ROOT = join(__dirname, '..');
const preview = process.argv.includes('--preview');
const draft = preview || process.argv.includes('--draft');
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const list = COMPOSITIONS.filter((c) => !wanted.length || wanted.includes(c.id));

if (!draft) {
  let blocked = false;
  for (const c of list) {
    const errors = checkFinal(c.version);
    if (errors.length) {
      blocked = true;
      console.error(`\n✗ ${c.id} — rendu final refusé :`);
      for (const e of errors) console.error(`   - ${e}`);
    }
  }
  if (blocked) {
    console.error('\nFournir les éléments ci-dessus (voir MISSING_ASSETS.md) ou utiliser `npm run render:draft`.');
    process.exit(1);
  }
}

const outDir = join(ROOT, 'out');
mkdirSync(outDir, {recursive: true});
for (const c of list) {
  const file = join(outDir, preview ? c.file.replace('.mp4', '-APERCU.mp4') : draft ? c.file.replace('.mp4', '-BROUILLON.mp4') : c.file);
  console.log(`\n▶ ${c.id} → ${file}`);
  execFileSync(
    'npx',
    [
      'remotion',
      'render',
      'src/index.ts',
      c.id,
      file,
      '--codec=h264',
      '--crf=18',
      `--props=${JSON.stringify({draft, watermark: !preview, showSafeZones: false})}`,
      ...BROWSER,
    ],
    {cwd: ROOT, stdio: 'inherit'},
  );
}
