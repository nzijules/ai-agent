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
    origin: 'ElevenLabs, voix « Fatou — Radiant and Gentle », modèle eleven_v4',
    clips: [
      {segment: 0, shot: 0, src: [0, 3.4], at: 0.2},
      {
        segment: 1,
        shot: 0,
        src: [3.65, 7.6],
        at: 0.03,
        cues: [
          {text: 'Voici le BTCS\u00a0:', start: 3.71, end: 5.3},
          {text: 'une terre sélectionnée,', start: 5.48, end: 6.72},
          {text: 'stabilisée,', start: 6.79, end: 7.6},
        ],
      },
      {segment: 1, shot: 1, src: [7.66, 10.1], at: 0.1},
      {segment: 2, shot: 1, src: [10.15, 12.2], at: 0.3},
      {segment: 2, shot: 2, src: [12.2, 14.4], at: 0.3},
      {segment: 2, shot: 3, src: [14.4, 17.5], at: 0.2},
      {segment: 3, shot: 0, src: [17.5, 21.95], at: 1.0},
      {
        segment: 4,
        shot: 0,
        src: [21.95, 25.0],
        at: 0.8,
        cues: [
          {text: 'Nos équipes, nos chantiers,', start: 22.14, end: 23.74},
          {text: 'nos réalisations\u00a0:', start: 23.74, end: 24.95},
        ],
      },
      {segment: 4, shot: 1, src: [25.0, 26.7], at: 0.3},
      {
        segment: 5,
        shot: 0,
        src: [26.7, 28.8],
        at: 0.3,
        cues: [{text: 'Votre terrain, votre vision.', start: 26.92, end: 28.7}],
      },
      {segment: 5, shot: 1, src: [28.8, 30.8], at: 0.2},
      {segment: 6, shot: 0, src: [30.8, 35.92], at: 0.6},
    ],
  },
};
