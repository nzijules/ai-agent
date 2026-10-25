import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// Navigateur local (environnement sans accès au CDN de Chrome Headless Shell).
// Supprimez cette ligne sur un poste classique : Remotion téléchargera son navigateur.
const localBrowser = process.env.REMOTION_BROWSER;
if (localBrowser) {
  Config.setBrowserExecutable(localBrowser);
}
