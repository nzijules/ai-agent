// Foreground matte for each poster (people, hands, phones) — offline model.
// usage: node tools/segment.mjs   (needs @imgly/background-removal-node installed)
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs'; import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
for (let i = 1; i <= 7; i++) {
  const buf = fs.readFileSync(`${root}/assets/originals/scene${i}.jpg`);
  const blob = await removeBackground(new Blob([buf], { type: 'image/jpeg' }), { model: 'medium', output: { format: 'image/png', type: 'foreground' } });
  fs.writeFileSync(`${root}/assets/cutouts/scene${i}.png`, Buffer.from(await blob.arrayBuffer()));
  console.log('matte', i);
}
