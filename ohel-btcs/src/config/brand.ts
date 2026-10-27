/**
 * Données de marque OHEL International.
 *
 * RÈGLE : rien n'est affiché à l'écran s'il ne figure pas ici ET n'est pas validé.
 * - Un champ texte vide ('') n'est jamais affiché.
 * - Une affirmation `validated: false` n'est jamais affichée (la scène prévoit un repli).
 * Toute valeur ajoutée ici doit avoir été validée par écrit par OHEL.
 */

export type Claim = {
  /** Formulation exacte à afficher / dire. */
  text: string;
  /** true uniquement après validation écrite d'OHEL. */
  validated: boolean;
};

export const brand = {
  name: 'OHEL International',
  /** Signature manuscrite sous le logo du CTA. Vide = non affichée (remplacée par brand.tagline). */
  signature: '',

  colors: {
    /**
     * Rouge prélevé sur le logo fourni (fichier basse définition).
     * À remplacer par le code de la charte OHEL s'il existe.
     */
    red: '#DB191D',
    redValidated: false,
    redDark: '#A50F14',
    grey: '#A6A4A2',
    greyLight: '#ECEBE8',
    white: '#FFFFFF',
    offWhite: '#F6F4F0',
    black: '#111111',
    laterite: '#A9603D',
    ochre: '#C4925F',
    earthLight: '#D6B08A',
    earthDark: '#7A3A1F',
    stabiliser: '#BFC0BC',
    steel: '#4A4F55',
    steelLight: '#7D848C',
  },

  /** Numéro WhatsApp officiel au format affiché, ex. '+225 07 00 00 00 00'. BLOQUANT. */
  whatsapp: '+225 07 49 23 86 40',

  /** Message prérempli à l'ouverture de WhatsApp (QR code, publicité Meta « clic vers WhatsApp »). */
  whatsappMessage:
    'Bonjour OHEL INTERNATIONAL, je possède un terrain et je souhaite échanger sur un projet de construction de villa en BTCS. Pouvez-vous m’accompagner ?',

  /** Site web affiché dans le CTA, ex. 'www.ohel-international.com'. Vide = non affiché. */
  website: 'ohelintermondial.com',

  /** Signature de fin. */
  tagline: 'Votre terrain. Votre vision. Notre savoir-faire.',

  /** Offre d'étude, ex. 'Étude gratuite sous 72 h'. Vide = non affichée. */
  offer: '',

  /** Services réellement proposés par OHEL. Vide = bandeau services retiré. */
  services: [] as string[],

  claims: {
    /** Résistance à la pluie / humidité. Non validée = carte remplacée par « Architecture contemporaine ». */
    humidite: {
      text: 'Soubassement protégé, enduit adapté, large débord de toiture : bien conçu, le BTCS résiste à la saison des pluies.',
      validated: false,
    } as Claim,
    /** Confort thermique, formulation qualitative sans chiffre. */
    thermique: {
      text: 'Des murs qui gardent la fraîcheur.',
      validated: false,
    } as Claim,
  },

  btcs: {
    /**
     * Dimensions du bloc en cm (longueur × largeur × hauteur).
     * Valeurs provisoires d'un format BTCS courant, À CONFIRMER par OHEL.
     */
    dimensions: {length: 29.5, width: 14, height: 9.5},
    dimensionsValidated: false,
    /** Emboîtement (tenon/mortaise) ou alvéoles selon le modèle OHEL. À confirmer. */
    interlocking: false,
    hollows: false,
    modelValidated: false,
    /** Type de presse affichée dans l'animation. */
    press: 'hydraulique' as 'manuelle' | 'hydraulique',
  },

  /**
   * Mention « Illustration non contractuelle » sur les visuels IA.
   * Retirée à la demande du client ; repasser à true pour la rétablir partout.
   */
  showAiNotice: false,

  /** Entité qui détient le projet (licence Remotion, licence musique). */
  owner: '',
} as const;

export type Brand = typeof brand;

/** Une affirmation n'est utilisable que si elle est validée et non vide. */
export const isUsable = (c: Claim) => c.validated && c.text.trim().length > 0;

/** Lien direct vers la conversation WhatsApp (QR code de la version 16:9). */
export const whatsappLink = () =>
  brand.whatsapp ? `https://wa.me/${brand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(brand.whatsappMessage)}` : '';
