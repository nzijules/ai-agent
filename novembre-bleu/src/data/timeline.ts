/**
 * TIMELINE MAÎTRESSE — Novembre Bleu (90 s / 2700 frames @ 30 fps)
 *
 * Source de vérité unique pour : placement de la voix-off, découpage des scènes,
 * sous-titres (piste intégrée + SRT) et repères des transitions sonores.
 *
 * Méthode : la voix-off fournie (74,95 s) a été mesurée par détection de silences
 * (ffmpeg silencedetect, -38 dB / 180 ms). Chaque phrase du script validé est
 * associée à un segment de parole. Les phrases sont ensuite replacées sur la
 * timeline avec des respirations musicales ("gapBefore") afin d'atteindre
 * exactement 90 s SANS couper ni modifier un seul mot.
 *
 * Les valeurs `from` / `to` sont exprimées en secondes DANS LE FICHIER AUDIO SOURCE.
 */

export const FPS = 30;
export const DURATION_SECONDS = 90;
export const TOTAL_FRAMES = FPS * DURATION_SECONDS; // 2700

export const VO_FILE = 'assets/audio/voix-off-novembre-bleu.mp3';
export const MUSIC_FILE = 'assets/audio/musique-provisoire-piano-ambient.mp3';
export const SFX_FILE = 'assets/audio/transitions-provisoires.mp3';

/** Marges ajoutées autour de chaque segment de parole pour ne pas couper les attaques / queues. */
const PAD_IN = 0.06;
const PAD_OUT = 0.1;

export type SceneId =
  | 'S01' | 'S02' | 'S03' | 'S04' | 'S05' | 'S06' | 'S07' | 'S08'
  | 'S09' | 'S10' | 'S11' | 'S12' | 'S13' | 'S14' | 'S15';

export type Chunk = {text: string; from: number; to: number};

export type VoLine = {
  id: string;
  scene: SceneId;
  /** silence (s) entre la fin du segment précédent et le début de celui-ci */
  gapBefore: number;
  chunks: Chunk[];
};

export const VO_LINES: VoLine[] = [
  {id: 'L01', scene: 'S01', gapBefore: 1.4, chunks: [
    {text: 'Chaque matin, il se lève pour les siens.', from: 0.0, to: 1.67},
  ]},
  {id: 'L02', scene: 'S02', gapBefore: 1.6, chunks: [
    {text: 'Il travaille.', from: 2.2, to: 2.89},
    {text: 'Il avance.', from: 3.36, to: 4.06},
    {text: 'Il protège sa famille.', from: 4.44, to: 5.52},
  ]},
  {id: 'L03', scene: 'S03', gapBefore: 1.5, chunks: [
    {text: 'Il trouve du temps pour tout le monde.', from: 6.03, to: 7.6},
  ]},
  {id: 'L04', scene: 'S04', gapBefore: 1.6, chunks: [
    {text: 'Mais pour sa propre santé…', from: 8.14, to: 9.54},
    {text: 'prend-il vraiment le temps ?', from: 10.19, to: 11.49},
  ]},
  {id: 'L05', scene: 'S05', gapBefore: 1.2, chunks: [
    {text: "En Côte d'Ivoire,", from: 11.92, to: 12.88},
    {text: "le cancer de la prostate touche des milliers d'hommes.", from: 13.18, to: 15.49},
  ]},
  {id: 'L06', scene: 'S06', gapBefore: 1.1, chunks: [
    {text: "Et le plus inquiétant, c'est qu'au début,", from: 15.84, to: 18.04},
    {text: 'il peut évoluer sans aucun symptôme.', from: 18.24, to: 20.4},
  ]},
  {id: 'L07', scene: 'S07', gapBefore: 0.9, chunks: [
    {text: 'Pas de douleur.', from: 20.88, to: 21.59},
    {text: 'Pas de signe évident.', from: 22.03, to: 23.11},
  ]},
  {id: 'L08', scene: 'S08', gapBefore: 1.0, chunks: [
    {text: "Pourtant, le risque augmente avec l'âge.", from: 23.52, to: 25.57},
  ]},
  {id: 'L09', scene: 'S08', gapBefore: 0.45, chunks: [
    {text: 'Les antécédents familiaux comptent aussi.', from: 26.09, to: 28.07},
  ]},
  {id: 'L10', scene: 'S09', gapBefore: 1.0, chunks: [
    {text: 'Dès quarante-cinq ans,', from: 28.67, to: 29.71},
    {text: 'il est important de parler de son risque avec un professionnel de santé.', from: 30.0, to: 33.15},
  ]},
  {id: 'L11', scene: 'S10', gapBefore: 1.0, chunks: [
    {text: 'Selon votre situation,', from: 33.68, to: 35.07},
    {text: 'il pourra vous proposer un dépistage adapté,', from: 35.37, to: 37.5},
    {text: 'notamment par une prise de sang appelée PSA.', from: 37.89, to: 40.95},
  ]},
  {id: 'L12', scene: 'S11', gapBefore: 0.8, chunks: [
    {text: 'Ce test ne suffit pas,', from: 41.57, to: 42.9},
    {text: 'à lui seul,', from: 43.18, to: 43.92},
    {text: 'à diagnostiquer un cancer.', from: 44.2, to: 45.55},
  ]},
  {id: 'L13', scene: 'S11', gapBefore: 0.5, chunks: [
    {text: 'Mais il peut contribuer à une détection précoce.', from: 45.99, to: 48.58},
  ]},
  {id: 'L14', scene: 'S12', gapBefore: 0.8, chunks: [
    {text: "Et lorsqu'un cancer est détecté à un stade précoce,", from: 48.86, to: 51.55},
    {text: 'les possibilités de traitement sont souvent meilleures.', from: 52.01, to: 54.04},
  ]},
  {id: 'L15', scene: 'S12', gapBefore: 0.6, chunks: [
    {text: 'Alors,', from: 54.64, to: 55.07},
    {text: "n'attendez pas forcément les premiers symptômes pour en parler.", from: 55.36, to: 58.03},
  ]},
  {id: 'L16', scene: 'S13', gapBefore: 0.8, chunks: [
    {text: "Parce que prendre soin de soi, ce n'est pas une faiblesse.", from: 58.37, to: 61.14},
  ]},
  {id: 'L17', scene: 'S13', gapBefore: 0.35, chunks: [
    {text: "C'est une responsabilité.", from: 61.46, to: 62.98},
  ]},
  {id: 'L18', scene: 'S14', gapBefore: 1.0, chunks: [
    {text: 'Pour vous.', from: 63.5, to: 63.93},
    {text: 'Pour ceux qui vous aiment.', from: 64.48, to: 65.47},
    {text: 'Pour demain.', from: 65.97, to: 66.48},
  ]},
  {id: 'L19', scene: 'S15', gapBefore: 1.0, chunks: [
    {text: 'Novembre Bleu.', from: 66.91, to: 67.87},
  ]},
  {id: 'L20', scene: 'S15', gapBefore: 0.4, chunks: [
    {text: "Le courage, c'est aussi de prendre soin de sa santé.", from: 68.17, to: 70.84},
  ]},
  {id: 'L21', scene: 'S15', gapBefore: 0.6, chunks: [
    {text: 'AroSoft…', from: 71.37, to: 72.19},
    {text: "La technologie au service de l'humain.", from: 72.58, to: 74.58},
  ]},
];

export type PlacedLine = VoLine & {
  srcIn: number;
  srcOut: number;
  /** début sur la timeline du film (s) */
  start: number;
  end: number;
  startFrame: number;
  durationFrames: number;
};

const round3 = (n: number) => Math.round(n * 1000) / 1000;

export const PLACED_LINES: PlacedLine[] = (() => {
  let cursor = 0;
  return VO_LINES.map((line) => {
    const srcIn = Math.max(0, line.chunks[0].from - PAD_IN);
    const srcOut = line.chunks[line.chunks.length - 1].to + PAD_OUT;
    const startFrame = Math.round((cursor + line.gapBefore) * FPS);
    const durationFrames = Math.round((srcOut - srcIn) * FPS);
    cursor = (startFrame + durationFrames) / FPS;
    return {
      ...line,
      srcIn: round3(srcIn),
      srcOut: round3(srcOut),
      start: startFrame / FPS,
      end: (startFrame + durationFrames) / FPS,
      startFrame,
      durationFrames,
    };
  });
})();

export type Cue = {index: number; text: string; startFrame: number; endFrame: number; scene: SceneId};

/** Sous-titres : un repère par segment de phrase, calé sur la parole réelle. */
export const SUBTITLE_CUES: Cue[] = (() => {
  const cues: Cue[] = [];
  for (const line of PLACED_LINES) {
    const offset = line.start - line.srcIn;
    line.chunks.forEach((c) => {
      cues.push({
        index: cues.length + 1,
        text: c.text,
        startFrame: Math.round((c.from + offset) * FPS) - 2,
        endFrame: Math.round((c.to + offset) * FPS) + 6,
        scene: line.scene,
      });
    });
  }
  // fusion des repères trop courts avec un écart minimal entre eux
  for (let i = 0; i < cues.length - 1; i++) {
    const next = cues[i + 1];
    // si l'écart avec le suivant est < 10 frames, on prolonge jusqu'au suivant (évite le clignotement)
    if (next.startFrame - cues[i].endFrame < 10) cues[i].endFrame = next.startFrame;
    // durée minimale de lecture : 24 frames
    if (cues[i].endFrame - cues[i].startFrame < 24) {
      cues[i].endFrame = Math.min(next.startFrame, cues[i].startFrame + 24);
    }
  }
  return cues;
})();

export type SceneDef = {
  id: SceneId;
  title: string;
  storyboard: string; // plage du storyboard initial
  startFrame: number;
  durationFrames: number;
  /** texte à l'écran (composé dans Remotion) */
  onScreen: string[];
};

const SCENE_META: Record<SceneId, {title: string; storyboard: string; onScreen: string[]}> = {
  S01: {title: "Réveil à l'aube", storyboard: '00-06', onScreen: []},
  S02: {title: 'Petit déjeuner en famille (match cuts)', storyboard: '06-12', onScreen: []},
  S03: {title: 'Au travail : agenda et tâches', storyboard: '12-18', onScreen: ['Agenda (motion graphics)']},
  S04: {title: 'Seul, pensif — ambiance bleue', storyboard: '18-24', onScreen: ['ET VOTRE SANTÉ ?']},
  S05: {title: 'Ruban bleu — révélation', storyboard: '24-30', onScreen: ['NOVEMBRE BLEU', 'CANCER DE LA PROSTATE']},
  S06: {title: 'Visualisation anatomique', storyboard: '30-36', onScreen: ['Vessie', 'Prostate', 'Urètre', 'Rectum', 'Schéma simplifié']},
  S07: {title: 'Apparemment en bonne santé', storyboard: '36-42', onScreen: ['PARFOIS, AUCUN SYMPTÔME']},
  S08: {title: 'Père et fils — âge et antécédents', storyboard: '42-48', onScreen: ["LE RISQUE AUGMENTE AVEC L'ÂGE", 'ANTÉCÉDENTS FAMILIAUX']},
  S09: {title: 'Consultation médicale', storyboard: '48-54', onScreen: ['DÈS 45 ANS, PARLONS-EN', 'Parlez de votre risque avec un professionnel de santé']},
  S10: {title: 'Prélèvement sanguin — PSA', storyboard: '54-60', onScreen: ['PSA', 'Antigène prostatique spécifique', 'Dépistage adapté à votre situation']},
  S11: {title: 'PSA ≠ diagnostic', storyboard: '60-66', onScreen: ['PSA ≠ DIAGNOSTIC', 'Un résultat s’interprète avec un professionnel de santé']},
  S12: {title: 'Détection précoce — éclairage rassurant', storyboard: '66-72', onScreen: ['DÉTECTION PRÉCOCE', 'N’ATTENDEZ PAS FORCÉMENT LES SYMPTÔMES POUR EN PARLER']},
  S13: {title: 'Couple — retour de la lumière', storyboard: '72-78', onScreen: ['CE N’EST PAS UNE FAIBLESSE.', 'C’EST UNE RESPONSABILITÉ.']},
  S14: {title: 'Famille intergénérationnelle — climax', storyboard: '78-84', onScreen: ['POUR VOUS.', 'POUR CEUX QUI VOUS AIMENT.', 'POUR DEMAIN.']},
  S15: {title: 'Signature Novembre Bleu', storyboard: '84-90', onScreen: ['NOVEMBRE BLEU', 'Le courage, c’est aussi de prendre soin de sa santé.', '[Emplacement logo institutionnel]']},
};

/** Avance de la coupe image sur la voix (s) : l'image précède la parole. */
const CUT_LEAD = 0.45;

export const SCENES: SceneDef[] = (() => {
  const ids = Object.keys(SCENE_META) as SceneId[];
  const starts = ids.map((id, i) => {
    if (i === 0) return 0;
    const first = PLACED_LINES.find((l) => l.scene === id)!;
    return Math.round((first.start - CUT_LEAD) * FPS);
  });
  return ids.map((id, i) => ({
    id,
    ...SCENE_META[id],
    startFrame: starts[i],
    durationFrames: (i < ids.length - 1 ? starts[i + 1] : TOTAL_FRAMES) - starts[i],
  }));
})();

export const sceneById = (id: SceneId) => SCENES.find((s) => s.id === id)!;

/** Lignes VO d'une scène, avec des frames RELATIVES au début de la scène. */
export const linesForScene = (id: SceneId) => {
  const scene = sceneById(id);
  return PLACED_LINES.filter((l) => l.scene === id).map((l) => {
    const offset = l.start - l.srcIn;
    return {
      ...l,
      rel: l.startFrame - scene.startFrame,
      chunksRel: l.chunks.map((c) => ({
        ...c,
        startRel: Math.round((c.from + offset) * FPS) - scene.startFrame,
        endRel: Math.round((c.to + offset) * FPS) - scene.startFrame,
      })),
    };
  });
};

/** Tous les segments de phrase d'une scène (frames relatives). */
export const chunksForScene = (id: SceneId) => linesForScene(id).flatMap((l) => l.chunksRel);

/** Durée de transition entre scènes (chevauchement) */
export const TRANSITION_FRAMES = 14;

export const VO_END_SECONDS = PLACED_LINES[PLACED_LINES.length - 1].end;
