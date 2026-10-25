/**
 * Script de la voix off + minutage des sous-titres (secondes).
 * Si vous enregistrez une nouvelle voix off, ajustez `start` / `end`
 * pour coller à l'audio, puis lancez `npm run audio` pour régénérer
 * le fichier .srt (docs/sous-titres.srt).
 */
export type Cue = {start: number; end: number; text: string};

export const voiceOverCues: Cue[] = [
  // Scène 1 — le coût du répétiteur
  {start: 0.2, end: 2.7, text: 'Chaque mois, vous payez des cours de répétition.'},
  {start: 2.8, end: 5.2, text: 'Mais votre enfant progresse-t-il vraiment\u00A0?'},
  // Scène 2 — les difficultés du parent
  {start: 6.3, end: 9.8, text: 'Et entre votre travail, vos responsabilités et les devoirs…'},
  {start: 10.0, end: 11.8, text: 'difficile de tout suivre.'},
  // Scène 3 — la solution
  {start: 13.4, end: 16.3, text: 'Découvrez «\u00A0Apprendre à apprendre avec ChatGPT\u00A0»,'},
  {start: 16.4, end: 19.4, text: 'le guide pratique pour accompagner autrement votre enfant.'},
  // Scène 4 — quiz
  {start: 21.5, end: 26.9, text: 'Apprenez à créer des quiz interactifs et chronométrés pour l’aider à s’entraîner et vérifier ses connaissances.'},
  // Scène 5 — rapports d'activité
  {start: 31.4, end: 32.9, text: 'Et grâce aux rapports d’activité,'},
  {start: 33.0, end: 36.2, text: 'suivez son travail, ses difficultés et ses progrès.'},
  // Scène 6 — bénéfices
  {start: 41.3, end: 42.7, text: 'Moins de dépenses inutiles,'},
  {start: 42.8, end: 44.0, text: 'plus de visibilité,'},
  {start: 44.1, end: 46.5, text: 'et un enfant qui apprend à devenir autonome.'},
  // Scène 7 — offre
  {start: 47.3, end: 49.4, text: '«\u00A0Apprendre à apprendre avec ChatGPT\u00A0».'},
  {start: 49.5, end: 52.4, text: 'Votre guide pratique, à seulement 10\u00A0000\u00A0francs CFA.'},
  {start: 52.5, end: 54.6, text: 'Commandez maintenant\u00A0!'},
];
