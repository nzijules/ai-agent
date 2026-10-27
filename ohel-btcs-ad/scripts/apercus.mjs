// Génère des images de contrôle (PNG) à des instants donnés.
// Usage : node scripts/apercus.mjs <compositionId> <sec1,sec2,...> [dossier] [sousTitres]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [id = "OHEL-BTCS-9x16", liste = "1,5", dossier = "out/apercus"] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER || undefined;
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const s of liste.split(",").map(Number)) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  const output = path.join(dossier, `${id}_${String(s).replace(".", "-")}s.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable, scale: 0.5 });
  console.log(output);
}
