/**
 * ============================================================
 *  CONFIGURATION DE LA PUBLICITÉ — modifiez ce fichier en priorité
 * ============================================================
 *  Tous les textes, le prix, la couverture et l'appel à l'action
 *  sont centralisés ici. Aucun autre fichier n'a besoin d'être
 *  modifié pour une mise à jour courante.
 *
 *  Astuce : «   » est une espace insécable. Gardez-la avant
 *  « ? », « ! », « : » pour que la ponctuation ne passe jamais seule
 *  à la ligne (typographie française).
 */

const NBSP = ' ';

export const adConfig = {
  book: {
    /** Titre affiché dans les textes animés. */
    title: 'Apprendre à apprendre avec ChatGPT',
    /** Titre découpé pour la couverture provisoire. */
    coverTitleTop: 'Apprendre',
    coverTitleMiddle: 'à apprendre',
    coverTitleAccent: 'avec ChatGPT',
    coverKicker: 'Guide pratique pour les parents',
    coverSubtitle: `Accompagner son enfant de la 6e à la Terminale`,
    /** Laisser vide ('') pour masquer. */
    coverAuthor: 'Jules N’ZI',
    /**
     * Couverture officielle : déposez l'image dans public/cover/
     * (format portrait, ratio 2:3 conseillé, ex. 1200×1800 px)
     * puis indiquez son nom, ex. 'cover/couverture.jpg', et son rapport
     * hauteur/largeur dans `coverRatio`.
     * Note : `couverture.jpg` est la couverture officielle dont le logo
     * ChatGPT a été masqué (consigne : aucun logo suggérant un partenariat).
     * L'original est conservé dans public/cover/couverture-officielle.png.
     * Laissez null pour utiliser la couverture provisoire générée.
     */
    coverImage: 'cover/couverture.jpg' as string | null,
    /**
     * Rapport hauteur / largeur de la couverture (image : 1492 / 1054).
     * Mettre 1.5 pour la couverture provisoire.
     */
    coverRatio: 1492 / 1054,
    /** Couleur de la tranche du livre 3D (accordée à la couverture). */
    spineColor: '#05080F',
  },

  scene1: {
    line1: 'Votre enfant utilise ChatGPT…',
    line2: `mais apprend-il vraiment${NBSP}?`,
    /** Mot du line2 surligné. */
    highlight: 'vraiment',
    chatQuestion: 'Fais mon exercice de maths',
    chatAnswerLabel: 'Réponse générée',
  },

  scene2: {
    problems: [
      {icon: 'homework', label: 'Des devoirs difficiles à suivre'},
      {icon: 'confused', label: 'Des leçons mal comprises'},
      {icon: 'revision', label: 'Des révisions inefficaces'},
      {icon: 'copy', label: 'Des réponses copiées sans réflexion'},
    ],
    statementA: 'Obtenir une réponse',
    statementB: 'ne signifie pas',
    statementC: 'comprendre.',
  },

  scene3: {
    kicker: 'Découvrez',
  },

  scene4: {
    heading: 'Avec ce guide, apprenez à utiliser ChatGPT pour…',
    benefits: [
      {
        icon: 'bulb',
        title: 'Comprendre les leçons',
        text: 'Faire expliquer une notion pas à pas, avec des exemples adaptés.',
      },
      {
        icon: 'cards',
        title: 'Réviser intelligemment',
        text: 'Créer des quiz, des fiches et des exercices pour s’entraîner.',
      },
      {
        icon: 'stairs',
        title: 'Développer l’autonomie',
        text: 'Apprendre à poser les bonnes questions plutôt que copier.',
      },
      {
        icon: 'progress',
        title: 'Accompagner les progrès de son enfant',
        text: 'Suivre ses efforts et l’encourager au quotidien.',
      },
    ],
    note: 'ChatGPT ne remplace ni l’enseignant ni les efforts de l’élève.',
  },

  scene5: {
    badge: 'Le guide pratique des parents',
    priceLabel: 'Seulement',
    /** Prix affiché tel quel (gardez l'espace insécable entre milliers). */
    price: `10${NBSP}000`,
    currency: 'FCFA',
    chips: ['Ebook numérique', 'De la 6e à la Terminale'],
  },

  scene6: {
    headline: 'Donnez à votre enfant une meilleure méthode pour apprendre.',
    button: 'Commandez votre exemplaire',
    /**
     * Contact affiché sous le bouton.
     * type : 'whatsapp' | 'link' | 'none'
     */
    contact: {
      type: 'whatsapp' as 'whatsapp' | 'link' | 'none',
      label: 'WhatsApp',
      value: `+225${NBSP}05${NBSP}84${NBSP}06${NBSP}06${NBSP}06`,
    },
  },

  legal: {
    /** Mention de marque (recommandée : ne pas supprimer). */
    trademark:
      'ChatGPT est une marque d’OpenAI. Ce guide est indépendant, non affilié à OpenAI ni approuvé par OpenAI.',
  },
};

export type AdConfig = typeof adConfig;
