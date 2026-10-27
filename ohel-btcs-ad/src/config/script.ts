/**
 * Script, minutage et textes à l'écran.
 *
 * Après l'enregistrement de la voix off : ajuster `duree` de chaque scène et
 * les instants `de`/`a` des répliques (en secondes, relatifs au début de la
 * scène). Tout le reste (durée totale, sous-titres) se recalcule.
 */
export const FPS = 30;

export type Replique = { de: number; a: number; texte: string };

export type TransitionType = "blocs" | "fondu" | "coupe";

export type SceneId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type SceneDef = {
  id: SceneId;
  nom: string;
  /** Durée de la scène en secondes (transition entrante incluse). */
  duree: number;
  /** Transition vers la scène suivante. */
  enchainement: TransitionType;
  voix: Replique[];
};

export const TRANSITION_FRAMES: Record<TransitionType, number> = {
  blocs: 18,
  fondu: 10,
  coupe: 0,
};

export const SCENES: SceneDef[] = [
  {
    id: "A",
    nom: "Accroche",
    duree: 7,
    enchainement: "blocs",
    voix: [
      { de: 0.4, a: 2.29, texte: "Votre prochain projet commence ici." },
      { de: 3, a: 4.79, texte: "Avec la terre… et la précision." },
    ],
  },
  {
    id: "B",
    nom: "Identification",
    duree: 11.0,
    enchainement: "coupe",
    voix: [
      { de: 0.6, a: 1.87, texte: "B. T. C. S." },
      {
        de: 2.6,
        a: 4.87,
        texte: "Des blocs de terre comprimée et stabilisée.",
      },
      {
        de: 5.6,
        a: 9.65,
        texte:
          "Produits et commercialisés en Côte d'Ivoire par OHEL International.",
      },
    ],
  },
  {
    id: "C",
    nom: "Formulation",
    duree: 16.2,
    enchainement: "fondu",
    voix: [
      { de: 0.5, a: 2.59, texte: "Tout commence par une formulation précise." },
      {
        de: 3,
        a: 7.61,
        texte: "Chez OHEL : 65 % de latérite, une terre riche et résistante,",
      },
      {
        de: 7.91,
        a: 11.64,
        texte: "25 % de sable, pour la compacité et la texture,",
      },
      {
        de: 11.94,
        a: 14.89,
        texte: "et 10 % de ciment, comme liant et stabilisateur.",
      },
    ],
  },
  {
    id: "D",
    nom: "Mélange",
    duree: 8,
    enchainement: "blocs",
    voix: [
      {
        de: 0.6,
        a: 2.79,
        texte: "Les composants sont soigneusement mélangés,",
      },
      { de: 3.8, a: 5.81, texte: "jusqu'à obtenir un mélange homogène." },
    ],
  },
  {
    id: "E",
    nom: "Compression",
    duree: 14,
    enchainement: "fondu",
    voix: [
      {
        de: 0.5,
        a: 3.71,
        texte: "Le mélange est placé dans le moule de la presse hydraulique.",
      },
      { de: 4.01, a: 5.96, texte: "Sous forte pression, il est compacté," },
      {
        de: 6.6,
        a: 8.72,
        texte: "pour former des blocs solides et réguliers.",
      },
      { de: 10.2, a: 11.7, texte: "La précision prend forme." },
    ],
  },
  {
    id: "F",
    nom: "Cure",
    duree: 11.6,
    enchainement: "blocs",
    voix: [
      {
        de: 0.5,
        a: 3.01,
        texte: "Après le démoulage, place à la cure humide.",
      },
      { de: 3.31, a: 5.18, texte: "Les blocs sont arrosés régulièrement," },
      {
        de: 5.7,
        a: 8.31,
        texte: "pour favoriser le développement de leur résistance",
      },
      { de: 8.61, a: 10.33, texte: "et limiter le risque de fissures." },
    ],
  },
  {
    id: "G",
    nom: "Applications",
    duree: 13,
    enchainement: "blocs",
    voix: [
      { de: 0.5, a: 2.5, texte: "Maison, école, bâtiment durable :" },
      {
        de: 4,
        a: 7.17,
        texte: "les BTCS s'adaptent à vos projets de construction.",
      },
      {
        de: 8.4,
        a: 10.99,
        texte: "Faites le choix de la solidité… et de l'écologie.",
      },
    ],
  },
  {
    id: "H",
    nom: "Conversion",
    duree: 17,
    enchainement: "coupe",
    voix: [
      {
        de: 0.5,
        a: 3.41,
        texte: "Votre projet mérite des matériaux bien fabriqués.",
      },
      { de: 3.8, a: 6.14, texte: "Pour vos approvisionnements en BTCS," },
      { de: 6.44, a: 8.89, texte: "faites confiance à OHEL International." },
      { de: 9.19, a: 10.43, texte: "Demandez votre devis." },
      {
        de: 10.73,
        a: 13.98,
        texte: "OHEL International : bâtir solide, bâtir vert.",
      },
    ],
  },
];

/** Textes à l'écran (compréhension sans le son). */
export const ECRAN = {
  A: {
    l1: "Votre prochain projet",
    l2: "commence ici.",
    terre: "La terre.",
    precision: "La précision.",
  },
  B: {
    sigle: "BTCS",
    developpe: ["Blocs de", "Terre", "Comprimée et", "Stabilisée"],
    activite1: "Production",
    activite2: "Commercialisation",
    lieu: "en Côte d’Ivoire",
  },
  C: {
    chapitre: "La formulation",
    source: "Formulation communiquée par OHEL International",
    composants: [
      {
        pct: 65,
        nom: "Latérite",
        role: "Terre riche et résistante",
        texture: "laterite",
      },
      { pct: 25, nom: "Sable", role: "Compacité et texture", texture: "sable" },
      {
        pct: 10,
        nom: "Ciment",
        role: "Liant et stabilisateur",
        texture: "ciment",
      },
    ] as const,
  },
  D: {
    chapitre: "Le mélange",
    titre: "Un mélange homogène",
    sous: "Prêt pour le pressage",
  },
  E: {
    chapitre: "La compression",
    remplissage: "Remplissage du moule",
    compression: "Compression",
    demoulage: "Démoulage",
    titre: "La précision prend forme",
  },
  F: {
    chapitre: "La cure",
    titre: "Cure humide",
    l1: "Arrosage régulier après démoulage",
    l2: "Développement de la résistance",
  },
  G: {
    maison: "Maison",
    ecole: "École",
    batiment: "Bâtiment durable",
    projets1: "Vos projets",
    projets2: "de construction",
    choix1: "Le choix",
    choix2: "de la solidité.",
  },
  H: {
    l1: "Votre projet mérite",
    l2: "des matériaux",
    l3: "bien fabriqués.",
    appro: "Approvisionnement en BTCS",
    cta1: "Demandez votre",
    cta2: "devis BTCS",
  },
};

/* ---------- Minutage calculé (ne pas modifier) ---------- */

export const sceneFrames = (s: SceneDef) => Math.round(s.duree * FPS);

export const transitionFrames = (s: SceneDef, index: number) =>
  index < SCENES.length - 1 ? TRANSITION_FRAMES[s.enchainement] : 0;

/** Image de départ de chaque scène dans la vidéo complète. */
export const SCENE_START: Record<SceneId, number> = (() => {
  const out = {} as Record<SceneId, number>;
  let t = 0;
  SCENES.forEach((s, i) => {
    out[s.id] = t;
    t += sceneFrames(s) - transitionFrames(s, i);
  });
  return out;
})();

export const TOTAL_FRAMES = SCENES.reduce(
  (acc, s, i) => acc + sceneFrames(s) - transitionFrames(s, i),
  0,
);

export const sceneById = (id: SceneId) => SCENES.find((s) => s.id === id)!;

/** Répliques en temps absolu (images), pour les sous-titres. */
export const SOUS_TITRES = SCENES.flatMap((s) =>
  s.voix.map((v) => ({
    de: SCENE_START[s.id] + Math.round(v.de * FPS),
    a: SCENE_START[s.id] + Math.round(v.a * FPS),
    texte: v.texte,
  })),
);
