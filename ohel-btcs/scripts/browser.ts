import {existsSync} from 'node:fs';

/**
 * Chromium pré-installé (environnement sans téléchargement) : utilisé s'il existe,
 * sinon Remotion télécharge son propre navigateur.
 */
const LOCAL = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
export const BROWSER = process.env.REMOTION_BROWSER
  ? [`--browser-executable=${process.env.REMOTION_BROWSER}`]
  : existsSync(LOCAL)
    ? [`--browser-executable=${LOCAL}`]
    : [];
