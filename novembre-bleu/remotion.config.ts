import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

// Navigateur headless local (environnement sans accès au CDN Remotion).
// Si ce chemin n'existe pas sur votre machine, Remotion téléchargera son propre navigateur.
const localShell =
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
Config.setAudioBitrate('192k');
Config.setConcurrency(4);
Config.setOverwriteOutput(true);
