// Rend des images fixes à des instants donnés (revue visuelle).
// Usage : node scripts/preview-frames.mjs out_dir 10 50 120 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [out, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "AroSoftPub", browserExecutable });
for (const fr of frames) {
  await renderStill({ serveUrl, composition, frame: Number(fr), output: path.join(out, `f${String(fr).padStart(4, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, scale: 0.5, browserExecutable });
  process.stdout.write(fr + " ");
}
