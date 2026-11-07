/**
 * ============================================================
 *  CONFIGURATION ÉDITABLE — Diamond Optique / Recrutement
 *  Modifiez ici les dates, zones, montants et le numéro.
 *  (Si vous changez un texte prononcé, régénérez aussi la voix-off
 *   correspondante — voir README.md)
 * ============================================================
 */
export const CONFIG = {
  marque: 'Diamond Optique',
  slogan: 'La vision à coup sûr',

  nbPromoteurs: 3,
  mission: 'MISSION 5 JOURS — DU 10 AU 14 NOVEMBRE 2026',

  zones: [
    {id: 1, titre: 'Zone 1', secteurs: ['Bassam', 'Anani', 'Modeste']},
    {id: 2, titre: 'Zone 2', secteurs: ['Marcory', 'Treichville', 'Koumassi']},
    {id: 3, titre: 'Zone 3', secteurs: ['Cocody', 'Adjamé']},
  ],

  // Rémunération (présentée comme un plafond, jamais comme un revenu garanti)
  gainMax: 11000,
  devise: 'FCFA',
  detailGain: '1 000 F fixe + pass transport + 100 F par scan validé',
  mentionGain: 'Montant maximum annoncé, selon tes résultats',

  // Appel à l'action
  whatsapp: '+225 07 79 65 70 32',
  messageExemple: 'PRÊT + ZONE 1',
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Minutage des scènes (en secondes) — total 35 s */
export const SCENES = {
  hook: {from: 0, dur: 4},
  recrutement: {from: 4, dur: 5},
  zones: {from: 9, dur: 6},
  remuneration: {from: 15, dur: 6},
  opportunite: {from: 21, dur: 5},
  cta: {from: 26, dur: 6},
  signature: {from: 32, dur: 3},
} as const;

export const DURATION_S = 35;

/** Voix-off : fichier, début (s) et sous-titres découpés */
export const VOICE_OVER = [
  {file: 'audio/vo/s1.wav', at: 0.2, dur: 3.31, text: ['Tu es dynamique et tu cherches', 'une opportunité pour gagner de l’argent ?']},
  {file: 'audio/vo/s2.wav', at: 4.15, dur: 3.55, text: ['Diamond Optique recrute', 'trois promoteurs terrain,', 'hommes ou femmes !']},
  {file: 'audio/vo/s3.wav', at: 9.2, dur: 5.37, text: ['Trois zones sont concernées :', 'Bassam, Marcory et Cocody,', 'avec leurs secteurs associés.']},
  {file: 'audio/vo/s4.wav', at: 15.3, dur: 4.82, text: ['Une rémunération pouvant atteindre', '11 000 FCFA par jour,', 'selon tes résultats !']},
  {file: 'audio/vo/s5.wav', at: 21.3, dur: 3.49, text: ['Et à la clé, une possibilité', 'd’intégrer l’équipe commerciale !']},
  {file: 'audio/vo/s6.wav', at: 26.2, dur: 5.02, text: ['Pour postuler, envoie simplement', '« PRÊT » suivi de ta zone,', 'sur WhatsApp au numéro affiché !']},
  {file: 'audio/vo/s7.wav', at: 31.65, dur: 3.23, text: ['Diamond Optique.', 'La vision à coup sûr.']},
] as const;
