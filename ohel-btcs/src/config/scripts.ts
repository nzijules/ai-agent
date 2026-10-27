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
// 60 s — V2 : 5 s accroche, 15 s démonstration BTCS, 15 s avantages,
// 15 s preuves, 10 s projection + conversion.
// ---------------------------------------------------------------------------
const ad60: VersionScript = {
  id: 'ad60',
  label: 'Version longue (V2, resserrée sur la voix)',
  segments: [
    {
      scene: 'hook',
      shots: [
        {
          sec: 3.8,
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
          sec: 3.3,
          vo: 'Tout commence par une terre sélectionnée et tamisée.',
          textLayer: 'subtitles',
          image: 'terreTamisee',
          move: {y: [40, 60], scale: [1.12, 1.02]},
          visual: 'Mains qui tamisent la terre latérite (illustration).',
        },
        {
          sec: 3.0,
          vo: 'Stabilisée, puis comprimée dans une presse,',
          textLayer: 'subtitles',
          image: 'presseBtcs',
          move: {y: [55, 40], scale: [1.02, 1.12]},
          visual: 'Presse BTCS manuelle, bloc frais sorti du moule (illustration).',
        },
        {
          sec: 3.9,
          vo: 'elle devient un bloc BTCS, dense et précis.',
          textLayer: 'title',
          title: [{text: 'BTCS', highlight: true}, {text: 'BLOC DE TERRE'}, {text: 'COMPRIMÉE STABILISÉE'}],
          image: 'matiereBtcs',
          move: {y: [45, 55], scale: [1.15, 1.04]},
          visual: 'Gros plan : terre et pile de blocs BTCS (illustration).',
        },
        {
          sec: 2.9,
          vo: 'Bloc après bloc, les murs prennent forme.',
          textLayer: 'subtitles',
          image: 'poseBlocs',
          move: {x: [55, 45], y: [50, 45], scale: [1.04, 1.12]},
          visual: 'Mains d’un maçon qui posent un bloc, joints fins (illustration).',
        },
      ],
    },
    {
      scene: 'benefits',
      transitionIn: 'rangs',
      variant: 'photo',
      shots: [
        {
          sec: 2.8,
          vo: 'Des murs qui gardent la fraîcheur.',
          textLayer: 'title',
          title: [{text: 'CONFORT'}, {text: 'THERMIQUE', highlight: true}],
          image: 'interieurFraicheur',
          move: {x: [35, 55], scale: [1.08, 1.02]},
          claim: 'thermique',
          visual: 'Salon contemporain, mur BTCS apparent, intérieur frais (illustration).',
        },
      ],
    },
    {
      scene: 'modernite',
      transitionIn: 'volet',
      shots: [
        {
          sec: 3.5,
          vo: 'Des lignes contemporaines, sans compromis sur le style.',
          textLayer: 'title',
          title: [{text: 'POSSIBILITÉS'}, {text: 'ARCHITECTURALES', highlight: true}],
          visual: 'Le plan d’architecte de la villa se révèle en photo (illustration).',
        },
      ],
    },
    {
      scene: 'benefits',
      transitionIn: 'matiere',
      variant: 'photo',
      shots: [
        {
          sec: 3.5,
          vo: 'Un matériau local, qui valorise la terre d’ici.',
          textLayer: 'title',
          title: [{text: 'MATÉRIAU'}, {text: 'LOCAL', highlight: true}],
          image: 'villaChantier',
          move: {x: [8, 22], y: [88, 75], scale: [2.1, 1.7]},
          visual: 'La villa en chantier : piles de blocs et terre du site (illustration).',
        },
      ],
    },
    {
      scene: 'showcase',
      transitionIn: 'rangs',
      variant: 'full',
      shots: [
        {
          sec: 5.3,
          vo: 'Avec OHEL International : nos équipes, nos chantiers, nos réalisations.',
          textLayer: 'subtitles',
          visual: 'Médias authentiques OHEL uniquement : presse, élévation des murs, joints, bâtiments terminés.',
        },
        {
          sec: 2.1,
          vo: 'Un savoir-faire concret.',
          textLayer: 'title',
          title: [{text: 'DES PROJETS RÉELS.'}, {text: 'UN SAVOIR-FAIRE', highlight: true}, {text: 'CONCRET.', highlight: true}],
          visual: 'Bâtiment OHEL terminé (média authentique).',
        },
      ],
    },
    {
      scene: 'projection',
      transitionIn: 'volet',
      shots: [
        {
          sec: 1.8,
          vo: 'Vous avez un terrain ?',
          textLayer: 'title',
          title: [{text: 'VOUS AVEZ'}, {text: 'UN TERRAIN ?', highlight: true}],
          visual: 'La villa : la nuit tombe, les lumières s’allument (illustration).',
        },
      ],
    },
    {
      scene: 'cta',
      transitionIn: 'matiere',
      variant: 'overVilla',
      shots: [
        {
          sec: 5.5,
          vo: 'OHEL International. Parlons de votre projet de construction, sur WhatsApp.',
          textLayer: 'title',
          title: [{text: 'PARLONS DE'}, {text: 'VOTRE PROJET', highlight: true}],
          visual: 'La villa de nuit (illustration) : logo, signature, bouton WhatsApp, numéro.',
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
      const ts: TimedShot = {...s, from: local, frames, cues};
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
