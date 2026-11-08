import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(null);
// Navigateur Chromium pré-installé (environnement cloud). Commentez cette ligne en local
// pour laisser Remotion télécharger son propre navigateur.
if (require("fs").existsSync("/opt/pw-browsers/chromium_headless_shell-1243")) {
  const p = require("child_process")
    .execSync("find /opt/pw-browsers/chromium_headless_shell-1243 -name 'chrome-headless-shell' -type f | head -1")
    .toString()
    .trim();
  if (p) Config.setBrowserExecutable(p);
}
