import React, { useMemo } from "react";
import captions from "../data/captions.json";
import { C, F, ip, ease, useT } from "../lib/theme";

type Word = { text: string; startMs: number; endMs: number };
type Chunk = { words: Word[]; start: number; end: number };

const MAX_CHARS = 30; // ≈ 2 lignes lisibles sur smartphone

/** Découpe chaque réplique en groupes de mots courts (style sous-titres réseaux sociaux). */
const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const line of captions) {
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) chunks.push({ words: cur, start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000 });
      cur = [];
    };
    for (const w of line.words as Word[]) {
      const len = cur.map((x) => x.text).join(" ").length;
      if (cur.length && len + w.text.length + 1 > MAX_CHARS) flush();
      cur.push(w);
      if (/[,:;…?.!]$/.test(w.text) && cur.map((x) => x.text).join(" ").length > 10) flush();
    }
    // évite un dernier groupe orphelin d'un seul mot court : on le rattache au précédent
    const prev = chunks[chunks.length - 1];
    const tail = cur.map((x) => x.text).join(" ");
    if (cur.length && tail.length < 12 && prev && prev.words[0].startMs >= line.startMs) {
      prev.words.push(...cur);
      prev.end = cur[cur.length - 1].endMs / 1000;
      cur = [];
    }
    flush();
  }
  // chaque groupe reste affiché jusqu'au suivant (max +0.6 s) pour éviter les clignotements
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    const hold = chunks[i].end + 0.6;
    chunks[i].end = next ? Math.min(hold, next.start) : hold;
  }
  return chunks;
};

/**
 * Sous-titres animés. Zone de sécurité : centrés à ~71 % de la hauteur, décalés à gauche
 * pour libérer la colonne d'icônes à droite (TikTok / Reels / Shorts) et au-dessus de la
 * zone de description en bas.
 */
export const Captions: React.FC = () => {
  const t = useT();
  const chunks = useMemo(buildChunks, []);
  const chunk = chunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const pin = ip(t, [chunk.start, chunk.start + 0.18], [0, 1], ease.out);
  const pout = ip(t, [chunk.end - 0.12, chunk.end], [0, 1], ease.in);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 170,
        top: 1290,
        height: 230,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: pin * (1 - pout),
        translate: `0px ${(1 - pin) * 24}px`,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.18,
          color: C.white,
          letterSpacing: -0.5,
          textShadow: "0 4px 14px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,1)",
          WebkitTextStroke: "1.5px rgba(0,0,0,0.55)",
          paintOrder: "stroke fill",
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.startMs / 1000 && t < w.endMs / 1000 + 0.05;
          const said = t >= w.startMs / 1000;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 11px",
                color: active ? C.cyan : said ? C.white : "rgba(255,255,255,0.78)",
                scale: active ? "1.06" : "1",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
