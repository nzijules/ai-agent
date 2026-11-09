/**
 * DÉCOUPAGE TEMPOREL — source unique de vérité.
 *
 * Chaque scène porte son texte de voix-off (affiché mot pour mot en sous-titres) et les
 * horodatages réels de public/voiceover.mp3 (transcription mot à mot).
 * Chaque scène joue son propre extrait [voFrom, voTo] de la voix-off, ce qui permet de garder
 * des respirations visuelles (carton titre, verdict) sans couper la narration.
 * Si vous changez de voix-off : mettez à jour cues / speechEnd / voFrom / voTo, puis
 * les instants clés des animations dans chaque scène (constantes en tête de fichier).
 */
export type SceneDef = {
  id: string;
  title: string;
  seconds: number; // durée de la scène à l'écran
  vo: string[]; // groupes de phrases = blocs de sous-titres (texte exact de la voix-off)
  /** début de chaque bloc dans le fichier voix-off (secondes), issus de la transcription horodatée */
  cues: number[];
  /** fin de la parole du dernier bloc (secondes, dans le fichier) */
  speechEnd: number;
  /** extrait du fichier voix-off joué pendant la scène */
  voFrom: number;
  voTo: number;
  /** délai avant le début de l'extrait, dans la scène (secondes) */
  voOffset: number;
};

export const SCENES: SceneDef[] = [
  {
    id: "s1",
    title: "L'appel inattendu",
    seconds: 13.4,
    cues: [0.12, 1.9, 5.02, 7.12, 9.58],
    speechEnd: 12.84,
    voFrom: 0,
    voTo: 13.1,
    voOffset: 0,
    vo: [
      "Il est 19 heures à Abidjan.",
      "Le téléphone de Koffi vibre. Numéro inconnu.",
      "Au bout du fil, une voix calme :",
      "« Bonsoir, service client Mobile Money.",
      "Une tentative de retrait frauduleux vient d'être détectée sur votre compte. »",
    ],
  },
  {
    id: "s2",
    title: "La fausse confiance",
    seconds: 12.2,
    cues: [13.3, 15.98, 19.88, 21.3],
    speechEnd: 23.0,
    voFrom: 13.1,
    voTo: 23.22,
    voOffset: 0,
    vo: [
      "Le ton est assuré. Les mots sont rassurants :",
      "service client, sécurisation du compte, intervention urgente.",
      "Tout semble officiel.",
      "Pourtant, rien n'a été vérifié.",
    ],
  },
  {
    id: "s3",
    title: "Pièce à conviction n°1",
    seconds: 12.4,
    cues: [23.42, 26.62, 30.3, 33.28],
    speechEnd: 34.72,
    voFrom: 23.22,
    voTo: 34.96,
    voOffset: 0.3,
    vo: [
      "Pièce à conviction numéro un : l'identité de l'appelant.",
      "Il connaît votre nom, votre numéro, parfois même votre quartier.",
      "Mais connaître vos informations ne fait pas de lui un agent.",
      "Identité non vérifiée.",
    ],
  },
  {
    id: "s4",
    title: "Pièce à conviction n°2",
    seconds: 13.5,
    cues: [35.16, 37.98, 40.68, 42.66, 46.2],
    speechEnd: 48.02,
    voFrom: 34.96,
    voTo: 48.16,
    voOffset: 0,
    vo: [
      "Pièce à conviction numéro deux : la menace.",
      "Cent cinquante mille francs seraient sur le point d'être retirés.",
      "Il faut agir vite, très vite.",
      "Pourtant, l'historique de vos transactions ne montre rien d'anormal.",
      "Une affirmation n'est pas une preuve.",
    ],
  },
  {
    id: "s5",
    title: "Pièce à conviction n°3",
    seconds: 14.8,
    cues: [48.36, 51.72, 53.38, 57.06, 60.54],
    speechEnd: 62.26,
    voFrom: 48.16,
    voTo: 62.5,
    voOffset: 0,
    vo: [
      "Pièce à conviction numéro trois : le code confidentiel.",
      "Un SMS arrive.",
      "Le faux conseiller demande de lui lire le code, « pour bloquer le retrait ».",
      "C'est précisément ce code qui lui permettrait de valider une opération.",
      "Ne communiquez jamais ce code.",
    ],
  },
  {
    id: "s6",
    title: "Reconstitution forensic",
    seconds: 12.8,
    cues: [62.7, 63.88, 67.56, 71.64],
    speechEnd: 74.8,
    voFrom: 62.5,
    voTo: 75.02,
    voOffset: 0,
    vo: [
      "Reconstitution.",
      "Un : le fraudeur dispose déjà de quelques informations personnelles.",
      "Deux : il tente de déclencher une opération qui exige une vérification.",
      "Trois : il manipule la victime pour obtenir le code qui manque.",
    ],
  },
  {
    id: "s7",
    title: "Le verdict",
    seconds: 6.5,
    cues: [75.22, 76.92],
    speechEnd: 79.26,
    voFrom: 75.02,
    voTo: 79.44,
    voOffset: 0.6,
    vo: ["Verdict : escroquerie.", "Usurpation d'identité et ingénierie sociale."],
  },
  {
    id: "s8",
    title: "Les trois réflexes",
    seconds: 15.3,
    cues: [79.64, 80.84, 83.06, 86.42, 90.44],
    speechEnd: 94.12,
    voFrom: 79.44,
    voTo: 94.3,
    voOffset: 0,
    vo: [
      "Trois réflexes.",
      "Un : ne partagez jamais vos codes,",
      "ni votre code secret, ni un code reçu par SMS.",
      "Deux : raccrochez et contactez MTN par un canal officiel.",
      "Trois : ne validez aucune opération que vous n'avez pas vous-même initiée.",
    ],
  },
  {
    id: "s9",
    title: "Conclusion",
    seconds: 14.0,
    cues: [94.5, 95.84, 99.4, 102.12, 103.98],
    speechEnd: 105.38,
    voFrom: 94.3,
    voTo: 105.64,
    voOffset: 0,
    vo: [
      "Koffi a raccroché.",
      "Il a vérifié par lui-même : son compte n'a jamais été menacé.",
      "Face à la fraude, vérifiez avant d'agir.",
      "C'était le Dossier Fraude numéro deux.",
      "Abonnez-vous pour le prochain dossier.",
    ],
  },
];

export const FPS = 30;

/** frame (relative à la scène) où commence un bloc de voix-off */
export const cueFrame = (s: SceneDef, i: number) => Math.round((s.cues[i] - s.voFrom + s.voOffset) * FPS);

export const sceneFrames = (s: SceneDef) => Math.round(s.seconds * FPS);

export const SCENE_STARTS: number[] = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + sceneFrames(SCENES[i - 1]));
  return acc;
}, []);

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + sceneFrames(s), 0);
