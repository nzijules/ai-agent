import raw from './vo_timing.json';

// Version TikTok (Arosoft) – voix-off courte, segments mesurés, décalés de VO_OFFSET.
export const VO_OFFSET = 0.3;
type Seg = {id: string; s: number; e: number; text: string};
export const SEGS: Seg[] = (raw as Seg[]).map((x) => ({...x, s: x.s + VO_OFFSET, e: x.e + VO_OFFSET}));
const seg = (id: string) => {
  const g = SEGS.find((x) => x.id === id);
  if (!g) throw new Error('segment inconnu ' + id);
  return g;
};
export const at = (id: string, word?: string) => {
  const g = seg(id);
  if (!word) return g.s;
  const i = g.text.indexOf(word);
  return g.s + ((g.e - g.s) * Math.max(0, i)) / g.text.length;
};
export const END_VO = SEGS[SEGS.length - 1].e;
export const DURATION_TT = Math.ceil((END_VO + 2.6) * 30) / 30;
export const SC = {
  menace: [0, at('trois') - 0.3],
  reflexes: [at('trois') - 0.3, at('imite') - 0.3],
  imite: [at('imite') - 0.3, at('outro') - 0.3],
  outro: [at('outro') - 0.3, DURATION_TT],
} as const;
