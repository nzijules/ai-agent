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
    cues: [0.0, 2.078, 4.598, 6.385, 9.369],
    speechEnd: 12.98,
    voFrom: 0,
    voTo: 13.08,
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
    cues: [13.189, 15.685, 19.424, 20.898],
    speechEnd: 22.837,
    voFrom: 13.08,
    voTo: 22.94,
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
    cues: [23.046, 26.03, 29.664, 33.135],
    speechEnd: 34.517,
    voFrom: 22.94,
    voTo: 34.62,
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
    cues: [34.726, 37.361, 40.426, 42.319, 46.045],
    speechEnd: 48.065,
    voFrom: 34.62,
    voTo: 48.17,
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
    cues: [48.274, 51.27, 52.837, 56.738, 60.558],
    speechEnd: 62.113,
    voFrom: 48.17,
    voTo: 62.22,
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
    cues: [62.322, 63.576, 67.291, 71.413],
    speechEnd: 74.919,
    voFrom: 62.22,
    voTo: 75.04,
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
    cues: [75.163, 76.858],
    speechEnd: 79.331,
    voFrom: 75.04,
    voTo: 79.45,
    voOffset: 0.6,
    vo: ["Verdict : escroquerie.", "Usurpation d'identité et ingénierie sociale."],
  },
  {
    id: "s8",
    title: "Les trois réflexes",
    seconds: 17.0,
    cues: [79.575, 80.666, 82.651, 85.949, 91.87],
    speechEnd: 95.864,
    voFrom: 79.45,
    voTo: 95.99,
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
    cues: [96.108, 97.721, 101.483, 103.886, 105.895],
    speechEnd: 107.926,
    voFrom: 95.99,
    voTo: 107.96,
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
