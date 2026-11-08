/**
 * Script de narration + minutage (secondes, timeline globale).
 *
 * C'est la SOURCE UNIQUE de synchronisation :
 *  - les sous-titres affichent `text` entre `start` et `end` ;
 *  - les scènes déclenchent leurs animations sur `cue(id)` ;
 *  - les bornes des scènes sont définies dans SCENES.
 *
 * Lorsque la voix-off définitive est livrée, recalez uniquement `start`/`end`
 * (et si besoin les bornes de SCENES) : toutes les animations suivent.
 */
export type Line = { id: string; start: number; end: number; text: string };

export const SCENES = {
  s1: { start: 0, end: 12, title: "Suppression" },
  s2: { start: 12, end: 30, title: "Univers de données" },
  s3: { start: 30, end: 51, title: "Enquête forensic" },
  s4: { start: 51, end: 69, title: "Chiffrement et limites" },
  s5: { start: 69, end: 100, title: "Protection et signature" },
} as const;

export type SceneId = keyof typeof SCENES;

export const LINES: Line[] = [
  // Scène 1
  { id: "s1.a", start: 0.6, end: 3.9, text: "Un message effacé. Une conversation supprimée." },
  { id: "s1.b", start: 4.2, end: 7.6, text: "On pense souvent que tout a disparu." },
  { id: "s1.c", start: 8.0, end: 11.6, text: "Mais supprimé ne veut pas toujours dire disparu." },
  // Scène 2
  { id: "s2.a", start: 12.4, end: 16.2, text: "Une donnée peut laisser des traces ailleurs :" },
  { id: "s2.b", start: 16.5, end: 20.4, text: "dans une sauvegarde, sur un cloud synchronisé," },
  { id: "s2.c", start: 20.7, end: 24.6, text: "dans des métadonnées : dates, tailles, identifiants," },
  { id: "s2.d", start: 24.9, end: 29.4, text: "ou dans des artefacts du système et des applications." },
  // Scène 3
  { id: "s3.a", start: 30.4, end: 34.6, text: "L'investigation mobile est une discipline encadrée par la loi." },
  { id: "s3.b", start: 34.9, end: 39.0, text: "Sur décision ou autorisation légale, l'expert acquiert les données," },
  { id: "s3.c", start: 39.3, end: 44.0, text: "les préserve avec une empreinte et une chaîne de conservation," },
  { id: "s3.d", start: 44.3, end: 50.4, text: "puis les analyse sur une copie, sans jamais modifier l'original." },
  // Scène 4
  { id: "s4.a", start: 51.4, end: 55.2, text: "Mais la récupération n'est jamais garantie." },
  { id: "s4.b", start: 55.5, end: 59.6, text: "Les smartphones modernes chiffrent leur stockage." },
  { id: "s4.c", start: 59.9, end: 63.9, text: "Si les clés sont effacées, les données deviennent illisibles." },
  { id: "s4.d", start: 64.2, end: 68.6, text: "Sans sauvegarde, un effacement peut être définitif." },
  // Scène 5
  { id: "s5.a", start: 69.4, end: 73.2, text: "Protégez vos données dès aujourd'hui." },
  { id: "s5.b", start: 73.5, end: 77.7, text: "Verrouillez votre téléphone et gardez-le à jour." },
  { id: "s5.c", start: 78.0, end: 82.3, text: "Maîtrisez vos sauvegardes : où sont-elles, sont-elles chiffrées ?" },
  { id: "s5.d", start: 82.6, end: 87.0, text: "Réfléchissez avant de partager : une copie envoyée vous échappe." },
  { id: "s5.e", start: 87.4, end: 92.2, text: "Effacé de votre téléphone ne veut pas dire effacé partout." },
  { id: "s5.f", start: 93.4, end: 98.6, text: "AroSoft. Apprendre, créer, réussir." },
];

const byId = new Map(LINES.map((l) => [l.id, l]));

export const line = (id: string): Line => {
  const l = byId.get(id);
  if (!l) throw new Error(`Ligne de script inconnue : ${id}`);
  return l;
};

/** Début d'une réplique, en secondes RELATIVES au début de la scène. */
export const cue = (id: string, scene: SceneId): number =>
  line(id).start - SCENES[scene].start;

/** Fin d'une réplique, relative à la scène. */
export const cueEnd = (id: string, scene: SceneId): number =>
  line(id).end - SCENES[scene].start;
