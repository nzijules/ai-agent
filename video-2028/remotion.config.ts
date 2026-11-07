/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Navigateur de rendu : Chromium headless déjà présent sur la machine.
// Supprimez cette ligne pour laisser Remotion télécharger son propre navigateur.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
Config.setConcurrency(4);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
