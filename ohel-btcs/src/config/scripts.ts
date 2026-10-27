/**
 * SOURCE UNIQUE des scripts et des timings.
 *
 * Toutes les durées en frames (compositions, séquences, sous-titres, transitions)
 * sont calculées à partir de ce fichier : changer un timing = une seule modification.
 *
 * Règle « une seule couche de texte par plan » : chaque plan (Shot) déclare
 * `textLayer` = 'title' | 'subtitles' | 'none'. Un plan 'title' n'affiche jamais de
 * sous-titres ; sa voix off dit la même chose que le titre (ou le complète) ou se tait.
 */
import type {Claim} from './brand';
import {brand} from './brand';
import {voiceover} from './voiceover';
import type {AssetId} from './assets';

export const FPS = 30;
/** Durée d'une transition entre deux scènes (frames). */
export const TRANSITION_FRAMES = 15;

export type SceneId = 'hook' | 'btcs' | 'benefits' | 'modernite' | 'showcase' | 'projection' | 'cta';
export type TransitionKind = 'volet' | 'rangs' | 'matiere';
export type ClaimKey = keyof typeof brand.claims;

export type TitleLine = {text: string; highlight?: boolean};

export type Shot = {
  /** Durée du plan en secondes. */
  sec: number;
  /** Texte exact de la voix off pendant ce plan ('' = silence). */
  vo: string;
  textLayer: 'title' | 'subtitles' | 'none';
  /** Obligatoire si textLayer = 'title'. */
  title?: TitleLine[];
  /** Description du visuel (storyboard). */
  visual: string;
  /** Carte de bénéfice affichée par la scène benefits. */
  card?: 'thermique' | 'pluie' | 'local' | 'architecture';
  /** Image du plan (scènes photo) et mouvement de caméra lent. */
  image?: AssetId;
  move?: {x?: [number, number]; y?: [number, number]; scale?: [number, number]};
  /** 'framed' pour les photos réelles en paysage / basse définition. */
  fit?: 'cover' | 'framed';
  /** Affirmation à valider dans brand.ts avant le rendu final. */
  claim?: ClaimKey;
  /** Plan de remplacement si `claim` n'est pas validé (sinon : rendu final bloqué). */
  fallback?: Omit<Shot, 'fallback' | 'claim'>;
};

export type Segment = {
  scene: SceneId;
  transitionIn?: TransitionKind;
  /** Variante de mise en scène (durées raccourcies, fond, etc.). */
  variant?: 'full' | 'short' | 'photo' | 'overMedia' | 'white' | 'overVilla';
  shots: Shot[];
};

export type VersionScript = {
  id: 'ad15' | 'ad30' | 'ad60';
  label: string;
  segments: Segment[];
};

// ---------------------------------------------------------------------------
// 15 s — Hook (Reels, TikTok, Stories)
// ---------------------------------------------------------------------------
const ad15: VersionScript = {
  id: 'ad15',
  label: '15 s — Hook',
  segments: [
    {
      scene: 'hook',
      shots: [
        {
          sec: 3,
          vo: 'Une villa moderne… en terre ?',
          textLayer: 'title',
          title: [{text: 'UNE VILLA MODERNE…'}, {text: 'EN TERRE ?', highlight: true}],
          visual: 'La villa terminée à l’heure bleue, travelling latéral (illustration).',
        },
      ],
    },
    {
      scene: 'btcs',
      transitionIn: 'matiere',
      variant: 'photo',
      shots: [
        {
          sec: 5,
          vo: 'Oui. Le BTCS : de la terre comprimée et stabilisée.',
          textLayer: 'subtitles',
          visual: 'Animation codée : terre + stabilisant → presse → bloc éjecté → mur qui monte en rangs décalés.',
        },
      ],
    },
    {
      scene: 'cta',
      transitionIn: 'volet',
      variant: 'overVilla',
      shots: [
        {
          sec: 7,
          vo: 'OHEL International. Envoyez votre projet sur WhatsApp.',
          textLayer: 'title',
          title: [{text: 'ENVOYEZ VOTRE PROJET'}, {text: 'SUR WHATSAPP', highlight: true}],
          visual: 'Plan authentique OHEL en fond (à défaut : mur BTCS sur fond terre), logo officiel, bouton WhatsApp, numéro ≥ 4 s.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 30 s — Meta Ads principal
// ---------------------------------------------------------------------------
const ad30: VersionScript = {
  id: 'ad30',
  label: '30 s — Meta Ads',
  segments: [
    {
      scene: 'hook',
      shots: [
        {
          sec: 3.5,
          vo: 'Et si votre prochaine villa était construite… en terre ?',
          textLayer: 'title',
          title: [{text: 'ET SI LA TERRE'}, {text: 'BÂTISSAIT'}, {text: 'VOTRE VILLA ?', highlight: true}],
          visual: 'La villa terminée à l’heure bleue, travelling latéral (illustration).',
        },
      ],
    },
    {
      scene: 'btcs',
      transitionIn: 'matiere',
      variant: 'photo',
      shots: [
        {
          sec: 5.5,
          vo: 'Le BTCS : de la terre stabilisée, comprimée en blocs solides.',
          textLayer: 'subtitles',
          visual: 'Retour à la matière : terre latérite et pile de blocs BTCS en gros plan (illustration).',
        },
      ],
    },
    {
      scene: 'benefits',
      transitionIn: 'rangs',
      variant: 'photo',
      shots: [
        {
          sec: 3,
          vo: 'Des murs frais.',
          textLayer: 'title',
          title: [{text: 'CONFORT'}, {text: 'THERMIQUE', highlight: true}],
          card: 'thermique',
          claim: 'thermique',
          visual: 'Coupe de mur : chaleur extérieure arrêtée, fraîcheur intérieure.',
        },
        {
          sec: 3,
          vo: 'Une maison protégée de la pluie, quand elle est bien conçue.',
          textLayer: 'title',
          title: [{text: 'RÉSISTE'}, {text: 'À LA PLUIE', highlight: true}],
          card: 'pluie',
          claim: 'humidite',
          visual: 'Pluie qui ruisselle : débord de toiture + soubassement protégé.',
          fallback: {
            sec: 3,
            vo: 'Des lignes modernes et élégantes.',
            textLayer: 'title',
            title: [{text: 'ARCHITECTURE'}, {text: 'CONTEMPORAINE', highlight: true}],
            card: 'architecture',
            visual: 'Même plan de chantier, la structure contemporaine se dessine.',
          },
        },
      ],
    },
    {
      scene: 'showcase',
      transitionIn: 'volet',
      variant: 'short',
      shots: [
        {
          sec: 8,
          vo: 'OHEL International le construit déjà : nos chantiers en sont la preuve.',
          textLayer: 'subtitles',
          visual: 'Médias authentiques OHEL uniquement : presse en action, élévation des murs, bâtiment terminé.',
        },
      ],
    },
    {
      scene: 'cta',
      transitionIn: 'matiere',
      variant: 'overVilla',
      shots: [
        {
          sec: 7,
          vo: 'Construisons autrement. Envoyez-nous votre projet sur WhatsApp.',
          textLayer: 'title',
          title: [{text: 'ENVOYEZ VOTRE PROJET'}, {text: 'SUR WHATSAPP', highlight: true}],
          visual: 'Retour à la villa terminée, de nuit (illustration) : logo, signature, bouton WhatsApp, numéro.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Version longue V3 — « Vous avez le terrain » (script client, orienté conversion WhatsApp)
// ---------------------------------------------------------------------------
const ad60: VersionScript = {
  id: 'ad60',
  label: 'Version longue (V3 — « Vous avez le terrain »)',
  segments: [
    {
      scene: 'hook',
      shots: [
        {
          sec: 1.9,
          vo: 'Vous avez un terrain ?',
          textLayer: 'title',
          title: [{text: 'VOUS AVEZ'}, {text: 'UN TERRAIN ?', highlight: true}],
          visual: 'La villa terminée à l’heure bleue, travelling latéral (illustration).',
        },
        {
          sec: 3.5,
          vo: 'Alors pourquoi laisser votre projet de villa attendre encore ?',
          textLayer: 'subtitles',
          visual: 'Même villa, la caméra s’approche (illustration).',
        },
      ],
    },
    {
      scene: 'modernite',
      transitionIn: 'matiere',
      shots: [
        {
          sec: 5.2,
          vo: 'Imaginez… une villa moderne, élégante, avec de beaux espaces,',
          textLayer: 'subtitles',
          visual: 'Le plan d’architecte de la villa se révèle en photo (illustration).',
        },
      ],
    },
    {
      scene: 'benefits',
      transitionIn: 'rangs',
      variant: 'photo',
      shots: [
        {
          sec: 3.2,
          vo: 'pensée pour votre confort et celui de votre famille.',
          textLayer: 'subtitles',
          image: 'interieurFraicheur',
          move: {x: [35, 55], scale: [1.08, 1.02]},
          visual: 'Salon contemporain, mur BTCS apparent (illustration).',
        },
      ],
    },
    {
      scene: 'btcs',
      transitionIn: 'volet',
      variant: 'photo',
      shots: [
        {
          sec: 3.2,
          vo: 'Et si ce rêve prenait forme grâce à la terre de chez nous ?',
          textLayer: 'subtitles',
          image: 'terreTamisee',
          move: {y: [40, 60], scale: [1.12, 1.02]},
          visual: 'Mains qui tamisent la terre latérite (illustration).',
        },
        {
          sec: 4.1,
          vo: 'Avec OHEL International, découvrez une autre façon de construire :',
          textLayer: 'subtitles',
          image: 'presseBtcs',
          move: {y: [55, 40], scale: [1.02, 1.12]},
          visual: 'Presse BTCS, bloc frais sorti du moule (illustration).',
        },
        {
          sec: 4.15,
          vo: 'les blocs de terre comprimée stabilisée, les BTCS.',
          textLayer: 'title',
          title: [{text: 'BTCS', highlight: true}, {text: 'BLOC DE TERRE'}, {text: 'COMPRIMÉE STABILISÉE'}],
          image: 'matiereBtcs',
          move: {y: [45, 55], scale: [1.15, 1.04]},
          visual: 'Gros plan : terre et blocs BTCS (illustration).',
        },
        {
          sec: 2.35,
          vo: 'Un matériau issu de ressources locales,',
          textLayer: 'subtitles',
          image: 'elevationMurs',
          move: {scale: [1.06, 1.0]},
          fit: 'framed',
          visual: 'Montage à sec des blocs BTCS auto-bloquants par une équipe OHEL (photo réelle).',
        },
        {
          sec: 2.6,
          vo: 'associé à une architecture contemporaine.',
          textLayer: 'subtitles',
          image: 'villaChantier',
          move: {x: [62, 45], scale: [1.04, 1.1]},
          visual: 'La villa en chantier, structure contemporaine (illustration).',
        },
      ],
    },
    {
      scene: 'showcase',
      transitionIn: 'matiere',
      shots: [
        {
          sec: 3.35,
          vo: 'Le résultat ? Une villa qui a du caractère.',
          textLayer: 'subtitles',
          image: 'realisation1',
          move: {scale: [1.06, 1.0]},
          fit: 'framed',
          visual: 'Bâtiment OHEL terminé (photo réelle).',
        },
        {
          sec: 2.1,
          vo: 'Une maison qui vous ressemble.',
          textLayer: 'subtitles',
          image: 'interieurRealisation',
          move: {scale: [1.06, 1.0]},
          fit: 'framed',
          visual: 'Intérieur d’une réalisation OHEL (photo réelle).',
        },
        {
          sec: 1.95,
          vo: 'De la conception aux travaux,',
          textLayer: 'subtitles',
          image: 'preparationTerre',
          move: {scale: [1.06, 1.0]},
          fit: 'framed',
          visual: 'Équipe OHEL sur chantier (photo réelle).',
        },
        {
          sec: 3.9,
          vo: 'OHEL International vous accompagne dans la réalisation de votre projet.',
          textLayer: 'subtitles',
          image: 'realisation2',
          move: {scale: [1.06, 1.0]},
          fit: 'framed',
          visual: 'Deuxième bâtiment OHEL terminé (photo réelle).',
        },
      ],
    },
    {
      scene: 'projection',
      transitionIn: 'rangs',
      shots: [
        {
          sec: 4.25,
          vo: 'Vous avez déjà un terrain ? Faites le premier pas vers votre future villa.',
          textLayer: 'title',
          title: [{text: 'FAITES LE'}, {text: 'PREMIER PAS', highlight: true}],
          visual: 'La villa : la nuit tombe, les lumières s’allument (illustration).',
        },
      ],
    },
    {
      scene: 'cta',
      transitionIn: 'volet',
      variant: 'overVilla',
      shots: [
        {
          sec: 3.0,
          vo: 'Envoyez-nous votre projet sur WhatsApp.',
          textLayer: 'title',
          title: [{text: 'VISITEZ NOTRE SITE'}, {text: 'OU ÉCRIVEZ-NOUS', highlight: true}],
          visual: 'La villa de nuit : logo, site web, bouton WhatsApp, numéro.',
        },
        {
          sec: 5.6,
          vo: 'OHEL International. Votre terrain. Votre vision. Notre savoir-faire.',
          textLayer: 'title',
          title: [{text: 'VOTRE TERRAIN.'}, {text: 'VOTRE VISION.'}, {text: 'NOTRE SAVOIR-FAIRE.', highlight: true}],
          visual: 'Même plan : signature OHEL.',
        },
      ],
    },
  ],
};

export const scripts = {ad15, ad30, ad60} as const;
export type VersionId = keyof typeof scripts;

// ---------------------------------------------------------------------------
// Résolution : affirmations, frames, sous-titres
// ---------------------------------------------------------------------------

const claimOf = (k: ClaimKey): Claim => brand.claims[k];

/** Remplace les plans dont l'affirmation n'est pas validée par leur plan de repli. */
export const resolveShot = (s: Shot): Shot => {
  if (s.claim && !claimOf(s.claim).validated && s.fallback) {
    return {...s.fallback};
  }
  return s;
};

export const sec2f = (sec: number) => Math.round(sec * FPS);

export type SubtitleCue = {text: string; from: number; to: number};

export type TimedShot = Shot & {
  from: number; // frame relative au début de la scène
  frames: number;
  cues: SubtitleCue[]; // relatifs au début de la scène
};

export type TimedSegment = Omit<Segment, 'shots'> & {
  index: number;
  from: number; // frame absolue du début de la scène
  frames: number;
  shots: TimedShot[];
};

/** Découpe une phrase en groupes de 3 à 5 mots, en coupant de préférence sur la ponctuation. */
export const chunkWords = (text: string): string[] => {
  const words = text.split(/ +/).filter(Boolean);
  const chunks: string[] = [];
  let cur: string[] = [];
  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const remaining = words.length - i - 1;
    const punct = /[,.:;?!…]$/.test(words[i]);
    if ((cur.length >= 3 && punct) || cur.length === 5) {
      if (remaining > 0 && remaining < 2) continue; // évite un mot orphelin
      chunks.push(cur.join(' '));
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur.join(' '));
  return chunks;
};

/** Marges de la voix off dans un plan (attaque / fin), en frames. */
const VO_LEAD = 6;
const VO_TAIL = 8;

/**
 * Timings provisoires des sous-titres : la durée du plan est répartie au prorata du
 * nombre de caractères. À remplacer par les timings mesurés sur la voix off finale.
 */
const cuesForShot = (shot: Shot, from: number, frames: number): SubtitleCue[] => {
  if (shot.textLayer !== 'subtitles' || !shot.vo) return [];
  const chunks = chunkWords(shot.vo);
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const span = frames - VO_LEAD - VO_TAIL;
  let t = from + VO_LEAD;
  return chunks.map((text, i) => {
    const len = i === chunks.length - 1 ? from + frames - VO_TAIL - t : Math.round((text.length / total) * span);
    const cue = {text, from: t, to: t + len};
    t += len;
    return cue;
  });
};

/**
 * Les sous-titres reprennent le style des titres (capitales, grande taille) :
 * au plus deux lignes de SUBTITLE_LINE_CHARS caractères par sous-titre.
 */
export const SUBTITLE_LINE_CHARS = 16;
export const SUBTITLE_MAX_CHARS = 2 * SUBTITLE_LINE_CHARS;
/** Durée minimale d'affichage d'un sous-titre (frames). */
const CUE_MIN_FRAMES = 14;
/** Écart sous lequel deux sous-titres s'enchaînent sans clignoter (frames). */
const CUE_BRIDGE_FRAMES = 10;

/**
 * Découpe un texte en lignes de SUBTITLE_MAX_CHARS caractères au plus : le moins de
 * lignes possible, longueurs équilibrées, coupure de préférence après une ponctuation,
 * jamais de mot isolé.
 */
/** Un sous-titre tient en deux lignes de SUBTITLE_LINE_CHARS caractères au plus. */
export const fitsTwoLines = (t: string): boolean => {
  const lines = splitLine(t, SUBTITLE_LINE_CHARS);
  return lines.length <= 2 && lines.every((l) => l.length <= SUBTITLE_LINE_CHARS);
};

export const splitLine = (text: string, max = SUBTITLE_MAX_CHARS, fits = (l: string) => l.length <= max): string[] => {
  if (fits(text)) return [text];
  const words = text.split(/ +/);
  const score = (lines: string[]) => {
    if (lines.some((l) => !fits(l))) return Infinity;
    const lens = lines.map((l) => l.length);
    let sc = Math.max(...lens) - Math.min(...lens);
    for (const l of lines) {
      if (l.length < 8) sc += 30; // mot isolé
      if (/[,.:;?!…]$/.test(l)) sc -= 6; // coupure naturelle
      if (/ (le|la|les|de|du|des|un|une|à|au|aux|en|et|dans|qui|pour|sur|par|avec|votre|nos)$/i.test(l)) sc += 25; // mot outil en fin de ligne
    }
    return sc;
  };
  for (let k = Math.ceil(text.length / max); k <= words.length; k++) {
    let best: string[] | null = null;
    let bestScore = Infinity;
    const walk = (start: number, left: number, acc: string[]) => {
      if (left === 1) {
        const lines = [...acc, words.slice(start).join(' ')];
        const sc = score(lines);
        if (sc < bestScore) [best, bestScore] = [lines, sc];
        return;
      }
      for (let e = start + 1; e <= words.length - left + 1; e++) walk(e, left - 1, [...acc, words.slice(start, e).join(' ')]);
    };
    walk(0, k, []);
    if (best) return best;
  }
  return [text];
};

/**
 * Uniformise les sous-titres : une ligne chacun, temps réparti au prorata des
 * caractères, durée minimale, et enchaînement sans trou court entre deux sous-titres.
 */
export const normalizeCues = (cues: SubtitleCue[]): SubtitleCue[] => {
  // Regroupe les morceaux d'une même phrase : on ne garde comme coupures imposées
  // que les fins de phrase (pauses réelles de la voix), puis on redécoupe en lignes.
  const merged: SubtitleCue[] = [];
  for (const c of cues) {
    const prev = merged[merged.length - 1];
    if (prev && !/[.?!:…]$/.test(prev.text)) merged[merged.length - 1] = {text: `${prev.text} ${c.text}`, from: prev.from, to: c.to};
    else merged.push({...c});
  }
  const split = merged.flatMap((c) => {
    const lines = splitLine(c.text, SUBTITLE_MAX_CHARS, fitsTwoLines);
    const total = lines.reduce((n, l) => n + l.length, 0);
    let t = c.from;
    return lines.map((text, i) => {
      const to = i === lines.length - 1 ? c.to : t + Math.round(((c.to - c.from) * text.length) / total);
      const cue = {text, from: t, to};
      t = to;
      return cue;
    });
  });
  return split.map((c, i) => {
    const next = split[i + 1];
    let to = Math.max(c.to, c.from + CUE_MIN_FRAMES);
    if (next && next.from - to <= CUE_BRIDGE_FRAMES) to = next.from;
    if (next) to = Math.min(to, next.from);
    return {...c, to};
  });
};

export const timeline = (id: VersionId) => {
  let at = 0;
  const segments: TimedSegment[] = scripts[id].segments.map((seg, index) => {
    let local = 0;
    const shots: TimedShot[] = seg.shots.map((raw, si) => {
      const s = resolveShot(raw);
      const frames = sec2f(s.sec);
      const clip = voiceover[id]?.clips.find((c) => c.segment === index && c.shot === si);
      const cues =
        clip?.cues && s.textLayer === 'subtitles'
          ? clip.cues.map((c) => ({
              text: c.text,
              from: local + sec2f(clip.at + c.start - clip.src[0]),
              to: local + sec2f(clip.at + c.end - clip.src[0]),
            }))
          : cuesForShot(s, local, frames);
      const ts: TimedShot = {...s, from: local, frames, cues: normalizeCues(cues)};
      local += frames;
      return ts;
    });
    const out: TimedSegment = {...seg, index, from: at, frames: local, shots};
    at += local;
    return out;
  });
  return {id, segments, durationInFrames: at};
};

export type Timeline = ReturnType<typeof timeline>;

/** Texte brut de la voix off d'une version (livrable « scripts en texte brut »). */
export const voText = (id: VersionId) =>
  timeline(id)
    .segments.flatMap((s) => s.shots.map((sh) => sh.vo))
    .filter(Boolean)
    .join(' ');
