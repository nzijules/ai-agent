// Usage : node scripts/stills.mjs <dossier_sortie> <frame> [<frame> ...]   (frames globales)
// Rend des images fixes de contrôle à partir d'un seul bundle (bien plus rapide que `remotion still` en boucle).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "node:child_process";
import path from "node:path";

const [out, ...frames] = process.argv.slice(2);
const exe = execSync("find /opt/pw-browsers -name chrome-headless-shell -type f 2>/dev/null | head -1").toString().trim() || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable: exe });
const composition = await selectComposition({ serveUrl, id: "DossierFraude002", puppeteerInstance: browser, browserExecutable: exe });
for (const fr of frames) {
  await renderStill({ composition, serveUrl, frame: Number(fr), output: `${out}/f${String(fr).padStart(4, "0")}.png`, scale: 0.4, puppeteerInstance: browser, browserExecutable: exe });
  console.log("frame", fr);
}
await browser.close({ silent: true });
