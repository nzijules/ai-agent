/**
 * Script de narration + minutage : SOURCE UNIQUE de synchronisation.
 *
 * La voix-off (public/audio/voiceover.mp3) est découpée en un bloc par scène,
 * coupé dans les silences entre paragraphes. Chaque bloc est posé sur la timeline
 * à `voice.at` : on peut ainsi laisser respirer les visuels entre deux scènes
 * sans toucher au débit de la voix.
 *
 *  - SCENES[x].start / end : bornes de la scène (secondes, timeline globale) ;
 *  - SCENES[x].voice       : extrait du fichier audio [from, to] posé à `at` ;
 *  - RAW_LINES             : répliques en temps du FICHIER audio (transcription) ;
 *  - LINES                 : répliques converties en temps de la timeline (calculé).
 *
 * Les sous-titres affichent LINES ; les scènes déclenchent leurs animations sur cue(id).
 */
export type Line = { id: string; start: number; end: number; text: string };

type VoiceBlock = { from: number; to: number; at: number };
type Scene = { start: number; end: number; title: string; voice: VoiceBlock };

export const SCENES = {
  s1: { start: 0, end: 10.4, title: "Suppression", voice: { from: 0, to: 8.54, at: 0.6 } },
  s2: { start: 10.4, end: 22.4, title: "Univers de données", voice: { from: 8.54, to: 19.23, at: 10.6 } },
  s3: { start: 22.4, end: 37.6, title: "Enquête forensic", voice: { from: 19.23, to: 33.28, at: 22.6 } },
  s4: { start: 37.6, end: 49.6, title: "Chiffrement et limites", voice: { from: 33.28, to: 44.32, at: 37.8 } },
  s5: { start: 49.6, end: 71, title: "Protection et signature", voice: { from: 44.32, to: 62.85, at: 49.8 } },
} satisfies Record<string, Scene>;

export type SceneId = keyof typeof SCENES;

/** Répliques, en secondes dans le fichier voix-off (issues de la transcription). */
const RAW_LINES: Line[] = [
  // Scène 1
  { id: "s1.a", start: 0.08, end: 3.0, text: "Un message effacé, une conversation supprimée." },
  { id: "s1.b", start: 3.52, end: 5.32, text: "On pense souvent que tout a disparu," },
  { id: "s1.c", start: 5.82, end: 8.3, text: "mais supprimé ne veut pas toujours dire disparu." },
  // Scène 2
  { id: "s2.a", start: 8.78, end: 10.5, text: "Une donnée peut laisser des traces ailleurs," },
  { id: "s2.b", start: 10.9, end: 13.08, text: "dans une sauvegarde, sur un cloud synchronisé," },
  { id: "s2.c", start: 13.46, end: 16.2, text: "dans des métadonnées : date, taille, identifiant" },
  { id: "s2.d", start: 16.64, end: 18.98, text: "ou dans des artefacts du système et des applications." },
  // Scène 3
  { id: "s3.a", start: 19.48, end: 22.36, text: "L'investigation mobile est une discipline encadrée par la loi." },
  { id: "s3.b", start: 22.76, end: 26.32, text: "Sur décision ou autorisation légale, l'expert acquiert les données," },
  { id: "s3.c", start: 26.6, end: 29.22, text: "les préserve avec une empreinte et une chaîne de conservation," },
  { id: "s3.d", start: 29.66, end: 33.06, text: "puis les analyse sur une copie, sans jamais modifier l'original." },
  // Scène 4
  { id: "s4.a", start: 33.5, end: 35.52, text: "Mais la récupération n'est jamais garantie." },
  { id: "s4.b", start: 35.92, end: 37.94, text: "Les smartphones modernes chiffrent leur stockage." },
  { id: "s4.c", start: 38.34, end: 41.06, text: "Si les clés sont effacées, les données deviennent illisibles." },
  { id: "s4.d", start: 41.48, end: 44.08, text: "Sans sauvegarde, un effacement peut être définitif." },
  // Scène 5
  { id: "s5.a", start: 44.56, end: 46.2, text: "Protégez vos données dès aujourd'hui." },
  { id: "s5.b", start: 46.58, end: 48.78, text: "Verrouillez votre téléphone et gardez-le à jour." },
  { id: "s5.c", start: 49.14, end: 51.86, text: "Maîtrisez vos sauvegardes. Où sont-elles ? Sont-elles chiffrées ?" },
  { id: "s5.d", start: 52.3, end: 55.66, text: "Réfléchissez avant de partager. Une copie envoyée vous échappe." },
  { id: "s5.e", start: 56.08, end: 59.06, text: "Effacé de votre téléphone ne veut pas dire effacé partout." },
  { id: "s5.f", start: 59.56, end: 62.64, text: "AroSoft : Apprendre, créer, réussir." },
];

const sceneOf = (id: string): SceneId => id.split(".")[0] as SceneId;

/** Décalage fichier audio → timeline pour une scène. */
export const voiceShift = (scene: SceneId) => SCENES[scene].voice.at - SCENES[scene].voice.from;

/** Convertit un temps du fichier voix-off en temps de timeline. */
export const sourceToTimeline = (src: number): number => {
  const id = (Object.keys(SCENES) as SceneId[]).find((s) => src >= SCENES[s].voice.from && src < SCENES[s].voice.to);
  return src + voiceShift(id ?? "s5");
};

export const LINES: Line[] = RAW_LINES.map((l) => {
  const d = voiceShift(sceneOf(l.id));
  return { ...l, start: l.start + d, end: l.end + d };
});

const byId = new Map(LINES.map((l) => [l.id, l]));

export const line = (id: string): Line => {
  const l = byId.get(id);
  if (!l) throw new Error(`Ligne de script inconnue : ${id}`);
  return l;
};

/** Début d'une réplique, en secondes RELATIVES au début de la scène. */
export const cue = (id: string, scene: SceneId): number => line(id).start - SCENES[scene].start;

/** Fin d'une réplique, relative à la scène. */
export const cueEnd = (id: string, scene: SceneId): number => line(id).end - SCENES[scene].start;

/** Durée d'une scène en secondes. */
export const sceneDuration = (scene: SceneId) => SCENES[scene].end - SCENES[scene].start;
