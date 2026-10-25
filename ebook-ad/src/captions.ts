/**
 * Script de la voix off + minutage des sous-titres (secondes).
 * Si vous enregistrez une nouvelle voix off, ajustez `start` / `end`
 * pour coller à l'audio, puis lancez `npm run audio` pour régénérer
 * le fichier .srt (docs/sous-titres.srt).
 */
export type Cue = {start: number; end: number; text: string};

export const voiceOverCues: Cue[] = [
  // Scène 1 — le coût du soutien scolaire
  {start: 0.2, end: 3.0, text: 'Chaque mois, vous payez des cours de répétition.'},
  {start: 3.2, end: 5.8, text: 'Mais votre enfant progresse-t-il vraiment\u00A0?'},
  // Scène 2 — les difficultés du parent
  {start: 6.2, end: 9.5, text: 'Et entre votre travail, vos responsabilités et les devoirs…'},
  {start: 9.7, end: 11.7, text: 'difficile de tout suivre.'},
  // Scène 3 — la solution
  {start: 12.3, end: 14.9, text: 'Découvrez «\u00A0Apprendre à apprendre avec ChatGPT\u00A0»,'},
  {start: 15.1, end: 18.6, text: 'le guide pratique pour accompagner autrement votre enfant.'},
  // Scène 4 — quiz
  {start: 19.3, end: 22.3, text: 'Apprenez à créer des quiz interactifs et chronométrés'},
  {start: 22.5, end: 26.0, text: 'pour l’aider à s’entraîner et vérifier ses connaissances.'},
  // Scène 5 — rapports d'activité
  {start: 28.3, end: 29.9, text: 'Et grâce aux rapports d’activité,'},
  {start: 30.1, end: 33.5, text: 'suivez son travail, ses difficultés et ses progrès.'},
  // Scène 6 — bénéfices
  {start: 36.3, end: 37.8, text: 'Moins de dépenses inutiles,'},
  {start: 37.9, end: 39.0, text: 'plus de visibilité,'},
  {start: 39.1, end: 41.7, text: 'et un enfant qui apprend à devenir autonome.'},
  // Scène 7 — offre
  {start: 42.3, end: 45.6, text: '«\u00A0Apprendre à apprendre avec ChatGPT\u00A0». Votre guide pratique,'},
  {start: 45.8, end: 47.7, text: 'à seulement 10\u00A0000\u00A0francs CFA.'},
  {start: 47.9, end: 49.8, text: 'Commandez maintenant\u00A0!'},
];
