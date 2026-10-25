/**
 * Script de la voix off + minutage des sous-titres (secondes).
 * Si vous enregistrez une nouvelle voix off, ajustez `start` / `end`
 * pour coller à l'audio, puis lancez `npm run audio` pour régénérer
 * le fichier .srt (docs/sous-titres.srt).
 */
export type Cue = {start: number; end: number; text: string};

export const voiceOverCues: Cue[] = [
  // Scène 1 — accroche
  {start: 0.3, end: 2.2, text: 'Votre enfant utilise ChatGPT…'},
  {start: 2.8, end: 4.6, text: 'mais apprend-il vraiment\u00A0?'},
  // Scène 2 — problème
  {start: 5.2, end: 8.4, text: 'Devoirs, leçons mal comprises, réponses copiées sans réflexion…'},
  {start: 8.5, end: 10.9, text: 'Obtenir une réponse ne signifie pas comprendre.'},
  // Scène 3 — solution
  {start: 11.3, end: 14.1, text: 'Découvrez «\u00A0Apprendre à apprendre avec ChatGPT\u00A0»,'},
  {start: 14.3, end: 17.4, text: 'le guide qui en fait un véritable tuteur pédagogique.'},
  // Scène 4 — bénéfices
  {start: 18.0, end: 20.2, text: 'Aidez votre enfant à comprendre ses leçons,'},
  {start: 20.4, end: 22.3, text: 'à réviser intelligemment,'},
  {start: 22.9, end: 24.8, text: 'à développer son autonomie,'},
  {start: 25.3, end: 28.6, text: 'et accompagnez ses progrès, de la 6e à la Terminale.'},
  // Scène 5 — offre
  {start: 29.2, end: 30.7, text: 'Le guide pratique des parents,'},
  {start: 30.9, end: 34.3, text: 'pour seulement 10\u00A0000\u00A0francs CFA.'},
  // Scène 6 — appel à l'action
  {start: 35.0, end: 37.6, text: 'Donnez à votre enfant une meilleure méthode pour apprendre.'},
  {start: 37.7, end: 39.85, text: 'Commandez votre exemplaire dès aujourd’hui.'},
];
