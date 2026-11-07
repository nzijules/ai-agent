import {chunksForScene, SceneId} from '../data/timeline';

/** Repères de parole (frames relatives au début de la scène). */
export const useCues = (id: SceneId) => {
  const chunks = chunksForScene(id);
  return {
    chunks,
    at: (i: number) => chunks[Math.min(i, chunks.length - 1)].startRel,
    end: (i: number) => chunks[Math.min(i, chunks.length - 1)].endRel,
  };
};
