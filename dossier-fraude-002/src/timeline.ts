/**
 * DÉCOUPAGE TEMPOREL — source unique de vérité.
 *
 * Chaque scène porte son texte de voix-off (affiché en sous-titres et à enregistrer tel quel).
 * Si vous enregistrez une vraie voix-off, ajustez uniquement `seconds` pour caler chaque scène
 * sur la durée réelle du passage : toutes les animations internes sont exprimées en
 * proportion / en frames relatives et suivent automatiquement.
 */
export type SceneDef = {
  id: string;
  title: string;
  seconds: number;
  vo: string[]; // groupes de phrases = blocs de sous-titres
};

export const SCENES: SceneDef[] = [
  {
    id: "s1",
    title: "L'appel inattendu",
    seconds: 12,
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
    seconds: 10,
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
    seconds: 12,
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
    seconds: 13,
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
    seconds: 13,
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
    seconds: 13,
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
    seconds: 7,
    vo: ["Verdict : escroquerie.", "Usurpation d'identité et ingénierie sociale."],
  },
  {
    id: "s8",
    title: "Les trois réflexes",
    seconds: 18,
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
    seconds: 13,
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

export const sceneFrames = (s: SceneDef) => Math.round(s.seconds * FPS);

export const SCENE_STARTS: number[] = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + sceneFrames(SCENES[i - 1]));
  return acc;
}, []);

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + sceneFrames(s), 0);
