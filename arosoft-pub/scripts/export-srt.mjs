// Génère out/sous-titres.srt à partir de src/captions.ts (même découpage que la vidéo).
import { build } from "esbuild";
import fs from "node:fs";
const r = await build({ entryPoints: ["src/captions.ts"], bundle: true, write: false, format: "esm", platform: "node" });
const mod = await import("data:text/javascript;base64," + Buffer.from(r.outputFiles[0].text).toString("base64"));
const cfg = fs.readFileSync("src/config.ts", "utf8");
const offset = Number(cfg.match(/VO_OFFSET = ([\d.]+)/)[1]);
fs.mkdirSync("out", { recursive: true });
fs.writeFileSync("out/sous-titres.srt", mod.toSrt(offset));
console.log("out/sous-titres.srt :", mod.GROUPS.length, "blocs");
