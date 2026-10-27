/**
 * Manifeste des médias attendus dans public/assets/.
 *
 * - authentique: true → média réel OHEL obligatoire. Jamais remplacé par une image IA
 *   ou de banque d'images. Placeholder restant = rendu final refusé pour les versions
 *   listées dans `blocksFinal`.
 * - ia: true → visuel projectif ; la mention « Illustration non contractuelle » est
 *   ajoutée automatiquement par <AssetMedia>.
 * - Les chemins sont relatifs à public/. Plusieurs extensions acceptées : la première
 *   trouvée par `npm run scan` est utilisée.
 */

export type VersionId = 'ad15' | 'ad30' | 'ad60';

export type AssetDef = {
  label: string;
  candidates: string[];
  kind: 'image' | 'video' | 'audio';
  authentique?: boolean;
  ia?: boolean;
  /** Versions dont le rendu final est bloqué tant que l'asset manque. */
  blocksFinal?: VersionId[];
  /** Fichier toléré en brouillon uniquement (jamais en rendu final). */
  draftFallback?: string;
  note?: string;
};

const exts = (base: string, list: string[]) => list.map((e) => `${base}.${e}`);
const IMG = ['jpg', 'jpeg', 'png', 'webp'];
const VID = ['mp4', 'mov', 'webm'];

export const assets = {
  logo: {
    label: 'Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large)',
    candidates: ['assets/brand/ohel-logo.svg', 'assets/brand/ohel-logo.png'],
    kind: 'image',
    blocksFinal: ['ad15', 'ad30', 'ad60'],
    draftFallback: 'assets/brand/ohel-logo-provisoire.webp',
    note: 'Le fichier fourni (221 × 131 px, fond blanc) est trop petit et non transparent.',
  },

  // Scènes projectives : visuels IA autorisés, mention obligatoire.
  villaHook: {
    label: 'Villa contemporaine au crépuscule (illustration, format portrait de préférence)',
    candidates: exts('assets/illustrations/villa-hook', IMG),
    kind: 'image',
    ia: true,
  },
  villaHookForeground: {
    label: 'Calque premier plan détouré de la villa (PNG transparent, optionnel, pour la parallaxe 2.5D)',
    candidates: ['assets/illustrations/villa-hook-premier-plan.png'],
    kind: 'image',
    ia: true,
    note: 'Optionnel : sans lui, la parallaxe se fait sur un seul plan.',
  },
  matiereBtcs: {
    label: 'Gros plan matière : terre latérite tamisée et pile de blocs BTCS (illustration)',
    candidates: exts('assets/illustrations/matiere-btcs', IMG),
    kind: 'image',
    ia: true,
  },
  villaChantier: {
    label: 'La même villa en construction, murs en blocs BTCS qui montent (illustration)',
    candidates: exts('assets/illustrations/villa-chantier', IMG),
    kind: 'image',
    ia: true,
  },
  villaNuit: {
    label: 'La même villa de nuit, fond du CTA (illustration)',
    candidates: exts('assets/illustrations/villa-nuit', IMG),
    kind: 'image',
    ia: true,
  },
  villaFilaire: {
    label: 'Version « plan d’architecte » de la villa (dérivée de villa-hook, scène 4)',
    candidates: exts('assets/illustrations/villa-filaire', IMG),
    kind: 'image',
    ia: true,
  },

  // Médias authentiques OHEL (scène 5 et fond du CTA 15 s).
  presseAction: {
    label: 'Vidéo ou photo réelle : presse BTCS OHEL en action',
    candidates: [...exts('assets/chantiers/presse-action', VID), ...exts('assets/chantiers/presse-action', IMG)],
    kind: 'video',
    authentique: true,
    blocksFinal: ['ad30', 'ad60'],
  },
  elevationMurs: {
    label: 'Vidéo ou photo réelle : élévation de murs BTCS sur un chantier OHEL',
    candidates: [...exts('assets/chantiers/elevation-murs', VID), ...exts('assets/chantiers/elevation-murs', IMG)],
    kind: 'video',
    authentique: true,
    blocksFinal: ['ad30', 'ad60'],
  },
  detailJoints: {
    label: 'Photo ou vidéo réelle : détail des joints d’un mur BTCS OHEL',
    candidates: [...exts('assets/chantiers/detail-joints', IMG), ...exts('assets/chantiers/detail-joints', VID)],
    kind: 'image',
    authentique: true,
    blocksFinal: ['ad60'],
  },
  realisation1: {
    label: 'Bâtiment OHEL terminé n° 1 (photo HD ou vidéo verticale)',
    candidates: [...exts('assets/realisations/realisation-1', IMG), ...exts('assets/realisations/realisation-1', VID)],
    kind: 'image',
    authentique: true,
    blocksFinal: ['ad30', 'ad60'],
  },
  realisation2: {
    label: 'Bâtiment OHEL terminé n° 2 (photo HD ou vidéo verticale)',
    candidates: [...exts('assets/realisations/realisation-2', IMG), ...exts('assets/realisations/realisation-2', VID)],
    kind: 'image',
    authentique: true,
    blocksFinal: ['ad60'],
  },
  fondCta15: {
    label: 'Plan authentique OHEL pour le fond du CTA 15 s (vidéo verticale de préférence)',
    candidates: [...exts('assets/chantiers/fond-cta-15s', VID), ...exts('assets/chantiers/fond-cta-15s', IMG)],
    kind: 'video',
    authentique: true,
    note: 'Optionnel : à défaut, le 15 s utilise l’animation du bloc sur fond terre (prévu par le brief).',
  },

  // Audio
  vo15: {label: 'Voix off 15 s validée', candidates: ['assets/audio/vo-15.mp3', 'assets/audio/vo-15.wav'], kind: 'audio'},
  vo30: {label: 'Voix off 30 s validée', candidates: ['assets/audio/vo-30.mp3', 'assets/audio/vo-30.wav'], kind: 'audio'},
  vo60: {label: 'Voix off 60 s validée', candidates: ['assets/audio/vo-60.mp3', 'assets/audio/vo-60.wav'], kind: 'audio'},
  music: {
    label: 'Musique sous licence commerciale (publicité Meta + TikTok autorisée)',
    candidates: ['assets/audio/musique.mp3', 'assets/audio/musique.wav'],
    kind: 'audio',
  },
  sfxCompression: {
    label: 'SFX compression du bloc',
    candidates: ['assets/audio/sfx-compression.mp3', 'assets/audio/sfx-compression.wav'],
    kind: 'audio',
  },
  sfxPose: {label: 'SFX pose d’un bloc', candidates: ['assets/audio/sfx-pose.mp3', 'assets/audio/sfx-pose.wav'], kind: 'audio'},
  sfxTransition: {
    label: 'SFX transition',
    candidates: ['assets/audio/sfx-transition.mp3', 'assets/audio/sfx-transition.wav'],
    kind: 'audio',
  },
  sfxCta: {label: 'SFX apparition du CTA', candidates: ['assets/audio/sfx-cta.mp3', 'assets/audio/sfx-cta.wav'], kind: 'audio'},
} satisfies Record<string, AssetDef>;

export type AssetId = keyof typeof assets;

/** Assets utilisés par chaque scène (sert au bilan des placeholders par version). */
export const sceneAssets: Record<string, AssetId[]> = {
  hook: ['villaHook', 'villaHookForeground'],
  btcs: ['sfxCompression', 'sfxPose'],
  'btcs:photo': ['matiereBtcs'],
  benefits: [],
  'benefits:photo': ['villaChantier', 'villaHook'],
  modernite: ['villaFilaire', 'villaHook'],
  showcase: ['presseAction', 'elevationMurs', 'detailJoints', 'realisation1', 'realisation2'],
  projection: ['villaHook', 'villaNuit'],
  cta: ['logo', 'sfxCta'],
  'cta:overMedia': ['fondCta15'],
  'cta:overVilla': ['villaNuit'],
};

export const versionAudio: Record<VersionId, AssetId[]> = {
  ad15: ['vo15', 'music', 'sfxTransition'],
  ad30: ['vo30', 'music', 'sfxTransition'],
  ad60: ['vo60', 'music', 'sfxTransition'],
};
