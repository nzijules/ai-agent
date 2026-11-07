import raw from './vo_timing.json';
// Version Arosoft : même logique que src/ia/timing.ts, voix-off adaptée.

// Voix-off : segments mesurés (voix témoin ou voix définitive réalignée), en secondes VO.
export const VO_OFFSET = 1.2;
type Seg = {id: string; s: number; e: number; text: string};
export const SEGS: Seg[] = (raw as Seg[]).map((x) => ({...x, s: x.s + VO_OFFSET, e: x.e + VO_OFFSET}));

export const seg = (id: string) => {
  const g = SEGS.find((x) => x.id === id);
  if (!g) throw new Error('segment inconnu ' + id);
  return g;
};
/** Temps vidéo du début d'un segment, ou d'un mot dans ce segment (estimation proportionnelle). */
export const at = (id: string, word?: string) => {
  const g = seg(id);
  if (!word) return g.s;
  const i = g.text.indexOf(word);
  return g.s + ((g.e - g.s) * Math.max(0, i)) / g.text.length;
};
export const END_VO = SEGS[SEGS.length - 1].e;
export const DURATION_IA = Math.ceil((END_VO + 4.4) * 30) / 30;

export const SC = {
  a: [0, at('voix') - 0.35],
  b: [at('voix') - 0.35, at('canaux') - 0.35],
  c: [at('canaux') - 0.35, at('objectif') - 0.3],
  d: [at('objectif') - 0.3, at('sens') - 0.35],
  e: [at('sens') - 0.35, at('r1') - 0.35],
  f: [at('r1') - 0.35, at('evolue') - 0.35],
  g: [at('evolue') - 0.35, DURATION_IA],
} as const;
