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
  /** Autre enregistrement à utiliser pour cet extrait (par défaut : la voix de la version). */
  file?: 'vo15' | 'vo30' | 'vo60';
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
    origin: 'ElevenLabs, voix « Fatou — Radiant and Gentle », modèle eleven_v4 (script V3 « Vous avez le terrain »)',
    clips: [
      {segment: 0, shot: 0, src: [0, 1.05], at: 0.3},
      {
        segment: 0,
        shot: 1,
        src: [1.05, 4.3],
        at: 0.05,
        cues: [
          {text: 'Alors pourquoi laisser votre projet', start: 1.3, end: 2.9},
          {text: 'de villa attendre encore ?', start: 2.9, end: 4.09},
        ],
      },
      {
        segment: 1,
        shot: 0,
        src: [4.3, 9.17],
        at: 0.1,
        cues: [
          {text: 'Imaginez…', start: 4.51, end: 5.4},
          {text: 'une villa moderne, élégante,', start: 5.58, end: 7.5},
          {text: 'avec de beaux espaces,', start: 7.5, end: 9.0},
        ],
      },
      {
        segment: 2,
        shot: 0,
        src: [9.17, 12.15],
        at: 0.05,
        cues: [
          {text: 'pensée pour votre confort', start: 9.35, end: 10.6},
          {text: 'et celui de votre famille.', start: 10.6, end: 11.9},
        ],
      },
      {
        segment: 3,
        shot: 0,
        src: [12.15, 15.07],
        at: 0.05,
        cues: [
          {text: 'Et si ce rêve prenait forme', start: 12.39, end: 13.53},
          {text: 'grâce à la terre de chez nous ?', start: 13.53, end: 14.85},
        ],
      },
      {
        segment: 3,
        shot: 1,
        src: [15.07, 18.95],
        at: 0.05,
        cues: [
          {text: 'Avec OHEL International,', start: 15.3, end: 16.58},
          {text: 'découvrez une autre façon de construire :', start: 16.58, end: 18.76},
        ],
      },
      {segment: 3, shot: 2, src: [18.95, 22.85], at: 0.05},
      {
        segment: 3,
        shot: 3,
        src: [22.85, 24.92],
        at: 0.05,
        cues: [{text: 'Un matériau issu de ressources locales,', start: 23.04, end: 24.84}],
      },
      {
        segment: 3,
        shot: 4,
        src: [24.92, 27.28],
        at: 0.05,
        cues: [{text: 'associé à une architecture contemporaine.', start: 24.99, end: 27.05}],
      },
      {
        segment: 4,
        shot: 0,
        src: [27.28, 30.38],
        at: 0.05,
        cues: [
          {text: 'Le résultat ?', start: 27.5, end: 28.3},
          {text: 'Une villa qui a du caractère.', start: 28.5, end: 30.23},
        ],
      },
      {segment: 4, shot: 1, src: [30.38, 32.2], at: 0.05, cues: [{text: 'Une maison qui vous ressemble.', start: 30.54, end: 31.99}]},
      {segment: 4, shot: 2, src: [32.2, 33.86], at: 0.05, cues: [{text: 'De la conception aux travaux,', start: 32.44, end: 33.74}]},
      {
        segment: 4,
        shot: 3,
        src: [33.86, 37.5],
        at: 0.05,
        cues: [
          {text: 'OHEL International vous accompagne', start: 33.98, end: 35.58},
          {text: 'dans la réalisation de votre projet.', start: 35.58, end: 37.28},
        ],
      },
      {segment: 5, shot: 0, src: [37.5, 41.43], at: 0.1},
      // Phrase reprise de l'enregistrement du 30 s, en attendant « Visitez notre site web, ou écrivez-nous sur WhatsApp ».
      {segment: 6, shot: 0, src: [17.3, 19.4], at: 0.4, file: 'vo30'},
      {segment: 6, shot: 1, src: [46.75, 51.84], at: 0.05},
    ],
  },
};
