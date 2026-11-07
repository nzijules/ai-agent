/**
 * Recense les médias réellement fournis dans public/assets/{images,videos}
 * et écrit src/data/media-manifest.json.
 * Convention de nommage : s01.jpg / s01.mp4, s02.jpg ... (une image ou vidéo par scène),
 * éventuellement s05-b.jpg pour un second plan. Tout plan sans fichier reste un PLACEHOLDER identifié.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = {};
for (const [dir, kind] of [['images', 'image'], ['videos', 'video']]) {
  const abs = path.join(root, 'public/assets', dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    const m = f.match(/^(s\d{2}(?:-[a-z])?)\.(jpe?g|png|webp|mp4|mov|webm)$/i);
    if (!m) continue;
    manifest[m[1].toUpperCase()] = {kind, src: `assets/${dir}/${f}`};
  }
}
fs.writeFileSync(path.join(root, 'src/data/media-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Médias fournis : ${Object.keys(manifest).length ? Object.keys(manifest).join(', ') : 'aucun (placeholders identifiés partout)'}`);
