/**
 * Script de la voix off + minutage des sous-titres (secondes).
 * Si vous enregistrez une nouvelle voix off, ajustez `start` / `end`
 * pour coller à l'audio, puis lancez `npm run audio` pour régénérer
 * le fichier .srt (docs/sous-titres.srt).
 */
export type Cue = {start: number; end: number; text: string};

export const voiceOverCues: Cue[] = [
  // Scène 1 — accroche
  {start: 0.3, end: 2.3, text: 'Votre enfant utilise ChatGPT…'},
  {start: 2.4, end: 4.7, text: 'mais apprend-il vraiment ?'},
  // Scène 2 — problème
  {start: 5.2, end: 8.0, text: 'Devoirs, leçons mal comprises, réponses copiées sans réflexion…'},
  {start: 8.2, end: 10.8, text: 'Obtenir une réponse ne signifie pas comprendre.'},
  // Scène 3 — solution
  {start: 11.3, end: 14.4, text: 'Découvrez « Apprendre à apprendre avec ChatGPT »,'},
  {start: 14.5, end: 17.8, text: 'le guide qui en fait un véritable tuteur pédagogique.'},
  // Scène 4 — bénéfices
  {start: 18.3, end: 20.6, text: 'Aidez votre enfant à comprendre ses leçons,'},
  {start: 20.8, end: 23.1, text: 'à réviser intelligemment,'},
  {start: 23.3, end: 25.6, text: 'à développer son autonomie,'},
  {start: 25.8, end: 28.8, text: 'et accompagnez ses progrès, de la 6e à la Terminale.'},
  // Scène 5 — offre
  {start: 29.4, end: 31.8, text: 'Le guide pratique des parents,'},
  {start: 31.9, end: 34.7, text: 'pour seulement 10 000 francs CFA.'},
  // Scène 6 — appel à l'action
  {start: 35.1, end: 37.6, text: 'Donnez à votre enfant une meilleure méthode pour apprendre.'},
  {start: 37.7, end: 39.8, text: 'Commandez votre exemplaire dès aujourd’hui.'},
];
