import raw from './vo_timing.json';

// Voix-off ElevenLabs (Brian) – segments mesurés, décalés de VO_OFFSET (temps vidéo).
export const VO_OFFSET = 0.5;
type Seg = {id: string; s: number; e: number; text: string};
export const SEGS: Seg[] = (raw as Seg[]).map((x) => ({...x, s: x.s + VO_OFFSET, e: x.e + VO_OFFSET}));
const seg = (id: string) => {
  const g = SEGS.find((x) => x.id === id);
  if (!g) throw new Error('segment inconnu ' + id);
  return g;
};
/** Début d'un segment, ou d'un mot dans ce segment (estimation proportionnelle). */
export const at = (id: string, word?: string) => {
  const g = seg(id);
  if (!word) return g.s;
  const i = g.text.indexOf(word);
  return g.s + ((g.e - g.s) * Math.max(0, i)) / g.text.length;
};
export const end = (id: string) => seg(id).e;
export const END_VO = SEGS[SEGS.length - 1].e;
export const DURATION_M = Math.ceil((END_VO + 4.2) * 30) / 30;

export const SC = {
  hook: [0, at('voix') - 0.35],
  arsenal: [at('voix') - 0.35, at('imaginez') - 0.3],
  scenario: [at('imaginez') - 0.3, at('objectif') - 0.3],
  objectif: [at('objectif') - 0.3, at('voir') - 0.3],
  sens: [at('voir') - 0.3, at('r1') - 0.35],
  reflexes: [at('r1') - 0.35, at('seule') - 0.35],
  seule: [at('seule') - 0.35, at('evolue') - 0.3],
  final: [at('evolue') - 0.3, DURATION_M],
} as const;
