import type {SceneId, VersionId} from './scripts';

/** Les quatre livrables. */
export const COMPOSITIONS = [
  {id: 'Ad15Vertical', version: 'ad15', width: 1080, height: 1920, file: 'OHEL-BTCS-15s-9x16.mp4'},
  {id: 'Ad30Vertical', version: 'ad30', width: 1080, height: 1920, file: 'OHEL-BTCS-30s-9x16.mp4'},
  {id: 'Ad60Vertical', version: 'ad60', width: 1080, height: 1920, file: 'OHEL-BTCS-60s-9x16.mp4'},
  {id: 'Ad60Horizontal', version: 'ad60', width: 1920, height: 1080, file: 'OHEL-BTCS-60s-16x9.mp4'},
] as const satisfies readonly {id: string; version: VersionId; width: number; height: number; file: string}[];

/**
 * Scènes développées. Une version n'est rendue en final que si toutes ses scènes
 * en font partie (les autres affichent « en développement »).
 */
export const READY_SCENES: SceneId[] = ['hook', 'btcs', 'benefits', 'cta'];
