/**
 * Calage de la voix off enregistrée sur les plans de scripts.ts.
 *
 * Chaque extrait (clip) du fichier voix off est posé au début d'un plan, avec son
 * décalage. Les sous-titres sont mesurés sur l'enregistrement (secondes du fichier
 * source) : ils remplacent alors les timings estimés de scripts.ts.
 * Pour un nouvel enregistrement : mesurer les pauses (ffmpeg silencedetect) et mettre
 * à jour `src`, `at` et `cues`.
 */
export type VoCue = {text: string; start: number; end: number};

export type VoClip = {
  /** Index de la scène et du plan dans scripts.ts. */
  segment: number;
  shot: number;
  /** Extrait du fichier voix off, en secondes. */
  src: [number, number];
  /** Décalage de l'extrait dans le plan, en secondes. */
  at: number;
  cues?: VoCue[];
};

export type VoiceoverTrack = {
  /** true tant que la voix n'est pas validée par OHEL. */
  provisional: boolean;
  origin: string;
  clips: VoClip[];
};

export const voiceover: Partial<Record<'ad15' | 'ad30' | 'ad60', VoiceoverTrack>> = {
  ad15: {
    provisional: true,
    origin: 'ElevenLabs, voix « Fatou — Radiant and Gentle » (accent africain francophone), modèle eleven_v4, prise A',
    clips: [
      {segment: 0, shot: 0, src: [0, 2.35], at: 0.2},
      {
        segment: 1,
        shot: 0,
        src: [2.35, 6.95],
        at: 0.2,
        cues: [
          {text: 'Oui. Le BTCS :', start: 2.5, end: 4.55},
          {text: 'de la terre comprimée', start: 4.7, end: 5.94},
          {text: 'et stabilisée.', start: 5.94, end: 6.9},
        ],
      },
      {segment: 2, shot: 0, src: [6.95, 10.53], at: 0.6},
    ],
  },
  ad30: {
    provisional: true,
    origin: 'ElevenLabs, voix « Fatou — Radiant and Gentle », modèle eleven_v4',
    clips: [
      {segment: 0, shot: 0, src: [0, 3.45], at: 0.03},
      {
        segment: 1,
        shot: 0,
        src: [3.6, 8.1],
        at: 0.4,
        cues: [
          {text: 'Le BTCS\u00a0:', start: 3.79, end: 4.95},
          {text: 'de la terre stabilisée,', start: 5.14, end: 6.43},
          {text: 'comprimée en blocs solides.', start: 6.43, end: 8.0},
        ],
      },
      {segment: 2, shot: 0, src: [8.15, 9.35], at: 0.6},
      {segment: 2, shot: 1, src: [9.4, 11.65], at: 0.4},
      {
        segment: 3,
        shot: 0,
        src: [11.7, 15.7],
        at: 1.2,
        cues: [
          {text: 'OHEL International le construit déjà\u00a0:', start: 11.87, end: 13.9},
          {text: 'nos chantiers en sont la preuve.', start: 14.15, end: 15.6},
        ],
      },
      {segment: 4, shot: 0, src: [15.75, 19.33], at: 0.6},
    ],
  },
  ad60: {
    provisional: true,
    origin: 'ElevenLabs, voix « Fatou — Radiant and Gentle », modèle eleven_v4 (script V2)',
    clips: [
      {segment: 0, shot: 0, src: [0, 3.5], at: 0.25},
      {
        segment: 1,
        shot: 0,
        src: [3.6, 6.6],
        at: 0.05,
        cues: [
          {text: 'Tout commence par une terre', start: 3.86, end: 5.2},
          {text: 'sélectionnée et tamisée.', start: 5.2, end: 6.5},
        ],
      },
      {
        segment: 1,
        shot: 1,
        src: [6.65, 9.42],
        at: 0.05,
        cues: [
          {text: 'Stabilisée,', start: 6.92, end: 7.85},
          {text: 'puis comprimée dans une presse,', start: 7.88, end: 9.4},
        ],
      },
      {segment: 1, shot: 2, src: [9.42, 13.15], at: 0.05},
      {
        segment: 1,
        shot: 3,
        src: [13.2, 15.85],
        at: 0.05,
        cues: [{text: 'Bloc après bloc, les murs prennent forme.', start: 13.41, end: 15.7}],
      },
      {segment: 2, shot: 0, src: [15.85, 18.06], at: 0.2},
      {segment: 3, shot: 0, src: [18.06, 21.24], at: 0.1},
      {segment: 4, shot: 0, src: [21.24, 24.42], at: 0.1},
      {
        segment: 5,
        shot: 0,
        src: [24.42, 29.4],
        at: 0.1,
        cues: [
          {text: 'Avec OHEL International\u00a0:', start: 24.68, end: 26.4},
          {text: 'nos équipes, nos chantiers,', start: 26.49, end: 28.15},
          {text: 'nos réalisations.', start: 28.15, end: 29.3},
        ],
      },
      {segment: 5, shot: 1, src: [29.4, 31.13], at: 0.1},
      {segment: 6, shot: 0, src: [31.13, 32.35], at: 0.15},
      {segment: 7, shot: 0, src: [32.35, 36.64], at: 0.15},
    ],
  },
};
