// Rend des images clés (en secondes) et les assemble en planche contact pour contrôle visuel.
// Usage : node scripts/stills.mjs out/planche.png 1.5 3 6.2 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [out, ...times] = process.argv.slice(2);
const dir = path.join(path.dirname(out), "stills-tmp");
mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const composition = await selectComposition({
  serveUrl,
  id: "EtSiCetaitDansDeuxAns-SousTitres",
  browserExecutable,
});
const files = [];
for (const t of times) {
  const file = path.join(dir, `t${t}.png`);
  await renderStill({
    composition,
    serveUrl,
    output: file,
    frame: Math.round(Number(t) * composition.fps),
    scale: 0.4,
    browserExecutable,
  });
  files.push(file);
}
execFileSync("python3", [
  "-c",
  `import sys
from PIL import Image, ImageDraw
fs=sys.argv[2:]; ims=[Image.open(f).convert('RGB') for f in fs]
w,h=ims[0].size; cols=min(5,len(ims)); rows=(len(ims)+cols-1)//cols
o=Image.new('RGB',(cols*(w+8),rows*(h+8)),(60,60,60))
for i,(im,f) in enumerate(zip(ims,fs)):
  d=ImageDraw.Draw(im); d.text((8,8),f.split('/')[-1][1:-4]+'s',fill=(255,80,80))
  o.paste(im,((i%cols)*(w+8),(i//cols)*(h+8)))
o.save(sys.argv[1])`,
  out,
  ...files,
]);
console.log("✓", out);
