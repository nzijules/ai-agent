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

  /** Scène 1 (0–6 s) — le coût du soutien scolaire. Aucun montant affiché. */
  hook: {
    lineA: 'Vous payez un répétiteur chaque mois…',
    lineB: `Mais savez-vous vraiment si votre enfant progresse${NBSP}?`,
    highlight: ['progresse'],
    months: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin'],
    ledgerLabel: 'Cours de répétition',
    chartLabel: 'Progrès de votre enfant',
  },

  /** Scène 2 (6–12 s) — les difficultés du parent. */
  struggle: {
    kicker: 'Votre quotidien',
    items: [
      {icon: 'briefcase', label: 'Votre travail'},
      {icon: 'home', label: 'Vos responsabilités'},
      {icon: 'homework', label: 'Les devoirs'},
    ],
    subjects: ['Maths', 'Français', 'Anglais', 'Physique-Chimie', 'SVT', 'Histoire-Géo'],
    statement: 'Difficile de tout suivre.',
    highlight: ['tout', 'suivre.'],
  },

  /** Scène 3 (12–19 s) — révélation du livre. */
  solution: {
    kicker: 'Découvrez le guide',
    tagline: 'Le guide pratique pour accompagner autrement votre enfant.',
    highlight: ['autrement'],
  },

  /** Scène 4 (19–28 s) — quiz interactifs et chronométrés (usage de ChatGPT enseigné par le livre). */
  quiz: {
    heading: 'Des quiz interactifs et chronométrés',
    demoTag: 'Démonstration · quiz créé avec ChatGPT grâce au guide',
    subject: 'Mathématiques · 4e',
    counter: 'Question 3/5',
    question: `Résous${NBSP}: 3x + 5 = 20. Que vaut x${NBSP}?`,
    options: ['x = 3', 'x = 5', 'x = 15', 'x = 25/3'],
    correctIndex: 1,
    timerSeconds: 30,
    feedbackTitle: 'Bonne réponse !',
    feedbackText: '3x = 20 − 5 = 15, donc x = 15 ÷ 3 = 5.',
    scoreLabel: 'Score du quiz',
    score: '4/5',
    scorePercent: 0.8,
    scoreAdvice: 'À revoir : les équations en deux étapes.',
  },

  /** Scène 5 (28–36 s) — rapport d'activité. Données fictives (démonstration). */
  report: {
    heading: 'Des rapports d’activité clairs',
    demoTag: 'Exemple fictif · rapport rédigé par ChatGPT à partir des informations que vous lui fournissez',
    title: 'Rapport de la semaine',
    student: 'Élève de 4e',
    stats: [
      {label: 'Exercices réalisés', value: 12, suffix: ''},
      {label: 'Temps de révision', value: 3.5, suffix: ' h'},
      {label: 'Quiz réussis', value: 4, suffix: '/5'},
      {label: 'Points à renforcer', value: 2, suffix: ''},
    ],
    chartLabel: 'Évolution des résultats aux quiz',
    chart: [
      {label: 'Sem. 1', value: 0.5},
      {label: 'Sem. 2', value: 0.6},
      {label: 'Sem. 3', value: 0.65},
      {label: 'Sem. 4', value: 0.8},
    ],
    weakLabel: 'À renforcer',
    weak: ['Équations', 'Accord du participe passé'],
  },

  /** Scène 6 (36–42 s) — bénéfices pour le parent. */
  benefits: {
    heading: 'Pour vous, parent',
    items: [
      {icon: 'wallet', title: 'Maîtrisez votre budget', text: 'Des dépenses de soutien mieux ciblées.'},
      {icon: 'progress', title: 'Suivez ses progrès', text: 'Plus de visibilité sur son travail réel.'},
      {icon: 'stairs', title: 'Développez son autonomie', text: 'Il apprend à apprendre, pas à copier.'},
    ],
    note: 'Le guide complète l’accompagnement de votre enfant : il ne remplace pas forcément un répétiteur et ne garantit pas d’économies.',
  },

  /** Scène 7 (42–50 s) — offre et appel à l'action. */
  offer: {
    kicker: 'Votre guide pratique',
    priceLabel: 'Seulement',
    /** Prix affiché tel quel (gardez l'espace insécable entre milliers). */
    price: `10${NBSP}000`,
    currency: 'FCFA',
    button: 'COMMANDER MAINTENANT',
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
    /** Rappel éthique (affiché en scène 4). */
    ethics: 'ChatGPT ne remplace ni l’enseignant ni les efforts de l’élève.',
    /** Mention de marque (recommandée : ne pas supprimer). */
    trademark:
      'ChatGPT est une marque d’OpenAI. Ce guide est indépendant, non affilié à OpenAI ni approuvé par OpenAI.',
  },
};

export type AdConfig = typeof adConfig;
