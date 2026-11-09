/**
 * Configuration centrale de la vidéo AroSoft — « Effacé du téléphone. Vraiment disparu ? »
 * Modifiez ici la résolution, la cadence, la durée et les médias externes
 * (voix-off, musique, logo, personnages) sans toucher aux scènes.
 */
export const VIDEO = {
  id: "AroSoftForensics",
  width: 1080,
  height: 1920,
  fps: 30,
  /** Durée en secondes (doit couvrir la fin de la dernière scène, voir SCENES). */
  durationInSeconds: 71,
  /** Recouvrement entre deux scènes (fondu/zoom), en images. */
  transitionFrames: 18,
} as const;

export const AUDIO = {
  /**
   * Voix-off (chemin relatif à /public), `null` pour la désactiver.
   * Elle est découpée par scène selon SCENES[x].voice dans src/data/script.ts.
   */
  voiceover: "audio/voiceover.mp3" as string | null,
  voiceoverVolume: 1,
  /** Lit musicale / ambiance. Placeholder généré, remplaçable. */
  music: "audio/ambient-placeholder.m4a" as string | null,
  /** Volume de la musique sans voix-off et pendant la voix (ducking). */
  musicVolume: 0.55,
  musicVolumeUnderVoice: 0.22,
} as const;

export const BRAND = {
  /**
   * Logo AroSoft (relatif à /public). PNG transparent recommandé.
   * `arosoft-logo-dark.png` est généré depuis le logo fourni par
   * `npm run logo` (détourage du blanc + marine éclairci pour fond sombre).
   */
  logo: "brand/arosoft-logo-dark.png",
  /**
   * "invert-on-dark" : le logo fourni est sur fond blanc → inversion de luminance
   * + fusion "screen" pour l'intégrer au fond graphite.
   * "as-is" : à utiliser avec un PNG transparent prévu pour fond sombre.
   */
  logoMode: "as-is" as "invert-on-dark" | "as-is",
  tagline: ["APPRENDRE", "CRÉER", "RÉUSSIR"],
  /** Logo d'angle (haut droite), affiché pendant toute la vidéo sauf la signature finale. */
  cornerLogo: "brand/arosoft-logo-dark-cropped.png" as string | null,
  cornerLogoWidth: 170,
} as const;

/**
 * Personnages : par défaut, illustrations vectorielles animées intégrées au code.
 * Vous pouvez fournir des rendus 3D / photos détourées (PNG transparent, buste,
 * cadrage vertical ~ 900x1100) dans /public/characters et renseigner les chemins.
 */
export const CHARACTERS = {
  citizen: null as string | null, // ex. "characters/citizen.png"
  investigator: null as string | null, // ex. "characters/investigator.png"
} as const;

export const TOTAL_FRAMES = VIDEO.durationInSeconds * VIDEO.fps;
