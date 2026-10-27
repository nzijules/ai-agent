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
};
