import { sec } from "./theme";

/** Master timeline (seconds). Scene timings are synced to voiceover/script.json "start" values. */
export const SCENES = [
  { id: "S1-Accroche", from: 0, to: 8 },
  { id: "S2-Probleme", from: 8, to: 24.6 },
  { id: "S3-Tuteur", from: 24.6, to: 33 },
  { id: "S4-Revelation", from: 33, to: 42.8 },
  { id: "S5-Benefices", from: 42.8, to: 62.6 },
  { id: "S6-Methode", from: 62.6, to: 74.8 },
  { id: "S7-Offre", from: 74.8, to: 82.6 },
  { id: "S8-Appel", from: 82.6, to: 90 },
] as const;

export const TOTAL_FRAMES = sec(90);
export const OVERLAP = 8; // frames of cross-fade between scenes

/** Sound effects placed on the master timeline: [file, second, volume] */
export const SFX: [string, number, number][] = [
  ["pop", 0.33, 0.35], ["pop", 1.93, 0.35], ["whoosh", 3.7, 0.45],
  ["whoosh", 7.75, 0.5],
  ["pop", 9.0, 0.45], ["pop", 12.0, 0.45], ["pop", 14.6, 0.45], ["pop", 17.0, 0.45], ["whoosh", 19.9, 0.4],
  ["whoosh", 24.35, 0.5], ["pop", 28.8, 0.4], ["pop", 29.53, 0.45],
  ["riser", 31.2, 0.5], ["impact", 33.3, 0.75],
  ["whoosh", 42.55, 0.45], ["ding", 43.53, 0.28], ["whoosh", 47.9, 0.3], ["ding", 48.53, 0.28], ["whoosh", 52.9, 0.3], ["ding", 53.53, 0.28], ["whoosh", 57.9, 0.3], ["ding", 58.53, 0.28],
  ["whoosh", 62.35, 0.45], ["pop", 63.2, 0.3], ["pop", 65.4, 0.3], ["whoosh", 68.9, 0.4],
  ["whoosh", 74.55, 0.45], ["success", 78.4, 0.5],
  ["whoosh", 82.35, 0.45], ["pop", 85.2, 0.4], ["click", 87.2, 0.8], ["success", 87.25, 0.3],
];
