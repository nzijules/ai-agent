/**
 * Emplacements des visuels, de la voix off et de la musique.
 *
 * Pour remplacer un visuel : déposer le fichier dans public/ puis renseigner
 * `src` (chemin relatif à public/) et `nature` :
 *   - "photo-ohel"   : photo/vidéo réellement prise chez OHEL International
 *   - "photo"        : photo réelle, sans attribution à OHEL
 *   - "illustration" : image générée ou 3D → mention « Illustration non contractuelle »
 *   - "schema"       : schéma animé intégré (repli par défaut quand src = null)
 *
 * Quand `src` vaut null, la scène affiche son repli graphique (schéma animé)
 * ou, pour les applications, un cartouche « VISUEL À FOURNIR » en mode maquette.
 * En mode "final", tout emplacement `obligatoire` vide bloque le rendu.
 */
export type Nature = "photo-ohel" | "photo" | "illustration";

export type MediaSlot = {
  src: string | null;
  type: "image" | "video";
  nature: Nature;
  /** Légende discrète affichée sur l'image (facultatif). */
  legende?: string;
  /** Référence du prompt de génération dans docs/05-prompts-visuels.md */
  prompt?: string;
  obligatoire: boolean;
};

export const MEDIA = {
  /** A — gros plan d'un bloc BTCS réel (repli : bloc 3D texturé). */
  blocHero: { src: null, type: "image", nature: "photo-ohel", prompt: "P-01", obligatoire: false },
  /** A/E — presse hydraulique OHEL (repli : schéma animé de presse). */
  presse: { src: null, type: "video", nature: "photo-ohel", prompt: "P-02", obligatoire: false },
  /** D — mélange homogène, macro (repli : disque de mélange animé). */
  melange: { src: null, type: "image", nature: "photo-ohel", prompt: "P-04", obligatoire: false },
  /** F — blocs en cure humide (repli : schéma animé d'arrosage). */
  cure: { src: null, type: "image", nature: "photo-ohel", prompt: "P-05", obligatoire: false },
  /** G — applications. */
  interieur: {
    src: "images/photo-interieur-couloir-btcs.jpg",
    type: "image",
    nature: "photo",
    legende: "Photo · intérieur en BTCS",
    obligatoire: true,
  },
  salle: {
    src: "images/photo-interieur-salle-btcs.jpg",
    type: "image",
    nature: "photo",
    legende: "Photo · intérieur en BTCS",
    obligatoire: true,
  },
  maison: {
    src: "images/illustration-maison.jpg",
    type: "image",
    nature: "illustration",
    obligatoire: true,
  },
  ecole: { src: null, type: "image", nature: "illustration", prompt: "P-06", obligatoire: true },
  batiment: { src: null, type: "image", nature: "illustration", prompt: "P-07", obligatoire: true },
  /** H — palettes de blocs prêts (repli : pile de blocs animée). */
  stock: { src: null, type: "image", nature: "photo-ohel", prompt: "P-08", obligatoire: false },
} satisfies Record<string, MediaSlot>;

/** Textures macro réelles (facultatives) — repli : textures procédurales. */
export const TEXTURES: Record<"laterite" | "sable" | "ciment", string | null> = {
  laterite: null,
  sable: null,
  ciment: null,
};

export const LOGO = "images/logo-ohel.jpg";

/**
 * Audio. Laisser null tant que les fichiers ne sont pas fournis.
 * voixOff : piste unique mixée, alignée sur le début de la vidéo.
 */
export const AUDIO = {
  voixOff: "audio/voix-off-provisoire.wav" as string | null,
  /**
   * true tant que la voix est la synthèse vocale de travail (Piper, voix « siwis »).
   * Bloque le rendu final : remplacer par l'enregistrement validé puis passer à false.
   */
  voixOffProvisoire: true,
  musique: null as string | null,
  volumeMusique: 0.18,
  /** Effets ponctuels : chemin + instant (secondes, absolu dans la vidéo). */
  effets: [] as { src: string; t: number; volume?: number }[],
};
