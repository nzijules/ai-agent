import words from "./data/words.json";

export type Word = { text: string; start: number; end: number };
export type Group = { words: Word[]; start: number; end: number };

/** Mots mis en valeur en jaune dans les sous-titres. */
export const KEYWORDS = [
  "einstein", "savoir", "comprendre", "compris", "guide", "étape", "simple", "pédagogique",
  "première", "vidéo", "claude", "code", "ia", "l'ia", "informaticiens", "non", "accessible",
  "curieux", "pâte", "demandez", "demander", "barrière", "intelligence", "artificielle", "dix",
  "mille", "francs", "cfa", "lien", "aujourd'hui", "motion", "design", "six",
];

/** Intervalles (secondes VO) où le grand titre à l'écran remplace le sous-titre. */
export const SUPPRESS: [number, number][] = [
  [1.6, 6.9], // citation d'Einstein en typographie cinétique
  [33.6, 35.9], // verset affiché en grand
];

const clean = (w: { text: string; start: number; end: number }[]): Word[] => {
  const out: Word[] = [];
  for (const x of w) {
    if (x.text.startsWith("[")) continue; // balises de direction vocale
    if (/^[:!?.,…]+$/.test(x.text)) {
      if (out.length) out[out.length - 1] = { ...out[out.length - 1], text: out[out.length - 1].text + (x.text === ":" ? "" : x.text) };
      continue;
    }
    out.push({ text: x.text, start: x.start, end: x.end });
  }
  return out;
};

const build = (): Group[] => {
  const ws = clean((words as { words: Word[] }).words);
  const groups: Group[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) groups.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  ws.forEach((w, i) => {
    cur.push(w);
    const next = ws[i + 1];
    const punct = /[,…]$/.test(w.text);
    const endSentence = /[.!?]$/.test(w.text);
    const gap = next ? next.start - w.end : 1;
    const chars = cur.map((c) => c.text).join(" ").length;
    if (endSentence || (punct && cur.length >= 2) || cur.length >= 5 || chars > 22 || gap > 0.35 || !next) flush();
  });
  // fusionne les groupes d'un seul mot très court avec le suivant
  for (let i = 0; i < groups.length - 1; i++) {
    if (groups[i].words.length === 1 && !/[.!?]$/.test(groups[i].words[0].text) && groups[i + 1].start - groups[i].end < 0.3 && groups[i + 1].words.length < 4) {
      groups[i + 1] = { words: [...groups[i].words, ...groups[i + 1].words], start: groups[i].start, end: groups[i + 1].end };
      groups.splice(i, 1);
    }
  }
  // chaque groupe reste affiché jusqu'au suivant (max +0,6 s)
  return groups.map((g, i) => ({
    ...g,
    end: Math.min(groups[i + 1]?.start ?? g.end + 0.8, g.end + 0.6),
  }));
};

export const GROUPS = build();

const fmt = (t: number) => {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(s)},${p(ms % 1000, 3)}`;
};
/** Génère le fichier SRT (temps vidéo = temps VO + offset). */
export const toSrt = (offset: number) =>
  GROUPS.map((g, i) => `${i + 1}\n${fmt(g.start + offset)} --> ${fmt(g.end + offset)}\n${g.words.map((w) => w.text).join(" ")}\n`).join("\n");
