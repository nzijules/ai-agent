// Matte the 3D icons separately (the full-poster matte drops some of them).
// usage: node tools/segment_icons.mjs   (run with @imgly/background-removal-node resolvable)
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const icons = [ // scene, name, crop box (with margin)
  [4, 'clapper', [650, 130, 965, 425]],
  [5, 'icon', [592, 292, 956, 722]],
  [6, 'database', [595, 140, 900, 510]],
];
for (const [k, name, [x0, y0, x1, y1]] of icons) {
  const tmp = `/tmp/icon_${k}_${name}.png`;
  execFileSync('python3', ['-c', `from PIL import Image;Image.open('${root}/assets/originals/scene${k}.jpg').crop((${x0},${y0},${x1},${y1})).save('${tmp}')`]);
  const blob = await removeBackground(new Blob([fs.readFileSync(tmp)], { type: 'image/png' }), { model: 'medium', output: { format: 'image/png', type: 'foreground' } });
  fs.writeFileSync(`${root}/assets/cutouts/scene${k}_${name}_${x0}_${y0}.png`, Buffer.from(await blob.arrayBuffer()));
  console.log('icon', k, name);
}
