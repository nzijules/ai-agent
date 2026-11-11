// =====================================================================
//  CONFIGURATION CENTRALE — modifiez ici textes, prix, couleurs, timing
// =====================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Décalage (s) entre le début de la vidéo et le début de la voix-off. */
export const VO_OFFSET = 0.5;
/** Durée réelle de la voix-off (s), mesurée sur public/audio/voiceover.mp3 */
export const VO_DURATION = 54.64;
/** Écran final maintenu après la dernière parole (s). */
export const END_HOLD = 3.3;
export const DURATION_S = VO_OFFSET + VO_DURATION + END_HOLD;
export const DURATION_FRAMES = Math.ceil(DURATION_S * FPS);

export const COLORS = {
  night: "#101B3B",
  deep: "#060B1C",
  electric: "#0866E8",
  white: "#FFFFFF",
  yellow: "#FFD600",
  cyan: "#38CFFF",
  red: "#FF3B4E",
};

export const FONT_TITLE = "Montserrat, sans-serif";
export const FONT_UI = "Inter, sans-serif";
export const FONT_ELEGANT = "'Playfair Display', serif";

export const PRICE = "10 000 F CFA";

export const TEXTS = {
  s1Label: "ALBERT EINSTEIN",
  s1Quote: ["SI TU NE PEUX PAS", "L'EXPLIQUER", "SIMPLEMENT…"],
  s1Question: ["L'AS-TU VRAIMENT", "COMPRIS ?"],
  s2Prompt: "Crée une vidéo motion design de 15 s pour présenter mon guide, avec textes animés et voix-off",
  s2StepByStep: "ÉTAPE PAR ÉTAPE",
  s2Promise: ["TA PREMIÈRE VIDÉO", "AVEC L'IA"],
  s3Question: ["L'IA, C'EST POUR LES", "INFORMATICIENS ?"],
  s3False: "FAUX !",
  s3Accessible: ["BEAUCOUP PLUS", "ACCESSIBLE"],
  s4Steps: ["UNE IDÉE", "UNE INSTRUCTION", "UNE VIDÉO"],
  s4Prompt: "Anime mon idée en vidéo",
  s5Ref: "MATTHIEU 7 : 7",
  s5Verse: "Demandez, et l'on vous donnera.",
  s5Punch: ["ENCORE FAUT-IL", "SAVOIR DEMANDER !"],
  s5Prompt: "Crée une vidéo animée pour présenter mon activité",
  s6Steps: ["INSTALLER", "CRÉER", "ANIMER"],
  s7Title: "LE GUIDE PRATIQUE",
  s7Sub: "CRÉE TA PREMIÈRE VIDÉO",
  s8Lines: ["À TON TOUR", "DE CRÉER !"],
  s8Buy: "ACHÈTE TON GUIDE",
  s8PriceLabel: "SEULEMENT",
  s8Cta: "CLIQUE SUR LE LIEN CI-DESSOUS",
};

/**
 * Début de chaque scène, en secondes de VOIX-OFF (le décalage VO_OFFSET est
 * ajouté automatiquement). Valeurs calées sur les horodatages réels
 * (src/data/words.json).
 */
export const SCENES_VO = {
  s1: -VO_OFFSET,
  s2: 6.9, // « Dans ce guide pratique… »
  s3: 16.05, // « Aujourd'hui, tu crois encore… »
  s4: 25.8, // « Il suffit d'être un peu curieux… »
  s5: 31.0, // « …de Matthieu, chapitre sept… »
  s6: 38.25, // « Dans ce guide, je t'aide… »
  s7: 45.6, // « Télécharge ce guide… »
  s8: 51.58, // « Clique sur le lien… »
};

/** Convertit un temps de voix-off (s) en frame de la vidéo. */
export const vo = (t: number) => Math.round((t + VO_OFFSET) * FPS);
/** Convertit des secondes en frames. */
export const sec = (t: number) => Math.round(t * FPS);

const order = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const;
export type SceneId = (typeof order)[number];
export const SCENE_ORDER = order;
export const sceneStart = (id: SceneId) => vo(SCENES_VO[id]);
export const sceneEnd = (id: SceneId) => {
  const i = order.indexOf(id);
  return i === order.length - 1 ? DURATION_FRAMES : sceneStart(order[i + 1]);
};
/** Chevauchement entre scènes (frames) pour les transitions. */
export const OVERLAP = 12;
