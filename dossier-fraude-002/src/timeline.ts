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
    seconds: 13.6,
    cues: [0.0, 2.032, 4.644, 6.49, 9.59],
    speechEnd: 13.2,
    voFrom: 0,
    voTo: 13.34,
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
    cues: [13.479, 16.114, 20.038, 21.432],
    speechEnd: 23.417,
    voFrom: 13.34,
    voTo: 23.52,
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
    seconds: 12.8,
    cues: [23.626, 27.179, 30.871, 34.214],
    speechEnd: 35.549,
    voFrom: 23.52,
    voTo: 35.65,
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
    seconds: 13.8,
    cues: [35.758, 38.347, 41.413, 43.363, 47.078],
    speechEnd: 49.017,
    voFrom: 35.65,
    voTo: 49.14,
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
    cues: [49.261, 52.314, 53.672, 57.295, 61.021],
    speechEnd: 62.437,
    voFrom: 49.14,
    voTo: 62.56,
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
    seconds: 13.1,
    cues: [62.681, 63.819, 67.232, 70.913],
    speechEnd: 74.361,
    voFrom: 62.56,
    voTo: 74.48,
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
    cues: [74.605, 76.3],
    speechEnd: 78.807,
    voFrom: 74.48,
    voTo: 78.91,
    voOffset: 0.6,
    vo: ["Verdict : escroquerie.", "Usurpation d'identité et ingénierie sociale."],
  },
  {
    id: "s8",
    title: "Les trois réflexes",
    seconds: 17.4,
    cues: [79.016, 80.177, 82.325, 86.215, 92.054],
    speechEnd: 95.932,
    voFrom: 78.91,
    voTo: 96.04,
    voOffset: 0,
    vo: [
      "Trois réflexes.",
      "Un : ne partagez jamais vos codes,",
      "ni votre code secret, ni un code reçu par SMS.",
      "Deux : raccrochez et signalez la tentative au 222, le numéro vert de MTN.",
      "Trois : ne validez aucune opération que vous n'avez pas vous-même initiée.",
    ],
  },
  {
    id: "s9",
    title: "Conclusion",
    seconds: 14.0,
    cues: [96.141, 97.371, 101.04, 103.327, 105.44],
    speechEnd: 107.182,
    voFrom: 96.04,
    voTo: 107.23,
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
