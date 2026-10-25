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

  /** Scène 1 (0–6 s) — le coût du répétiteur. Aucun montant affiché. */
  hook: {
    lineA: 'Vous payez un répétiteur chaque mois…',
    lineB: `Mais savez-vous vraiment si votre enfant progresse${NBSP}?`,
    highlight: ['progresse'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
    chartLabel: 'Progrès de votre enfant',
  },

  /** Scène 2 (6–13 s) — les difficultés du parent. */
  struggle: {
    heading: 'Entre votre travail, les devoirs et les différentes matières…',
    highlight: ['travail,', 'devoirs', 'matières…'],
    subjects: [
      {icon: 'pi', label: 'Mathématiques'},
      {icon: 'book', label: 'Français'},
      {icon: 'atom', label: 'Physique-Chimie'},
      {icon: 'abc', label: 'Anglais'},
      {icon: 'leaf', label: 'SVT'},
    ],
    sticker: `Difficile de tout suivre${NBSP}!`,
  },

  /** Scène 3 (13–21 s) — révélation du livre. */
  solution: {
    kicker: `Découvrez${NBSP}:`,
    titleTop: 'APPRENDRE À APPRENDRE',
    titleBottom: 'AVEC CHATGPT',
    tagline: 'Le guide pratique pour accompagner autrement votre enfant.',
    highlight: ['autrement'],
  },

  /** Scène 4 (21–31 s) — quiz interactifs et chronométrés (usage de ChatGPT enseigné par le livre). */
  quiz: {
    heading: `Créez des quiz interactifs et chronométrés pour entraîner votre enfant${NBSP}!`,
    highlight: ['interactifs', 'chronométrés'],
    demoTag: 'Démonstration · quiz créé avec ChatGPT grâce au guide',
    counter: 'Question 1/10',
    timerSeconds: 15,
    question: `Combien font 12 × 8${NBSP}?`,
    options: ['86', '96', '108', '116'],
    correctIndex: 1,
    feedbackTitle: `Bonne réponse${NBSP}!`,
    feedbackText: '12 × 8 = 96',
    scoreLabel: 'Score',
    score: '8/10',
    scorePercent: 0.8,
    weakLabel: `À renforcer${NBSP}:`,
    weak: 'Fractions',
  },

  /** Scène 5 (31–41 s) — rapport d'activité. Données fictives (exemple illustratif). */
  report: {
    heading: 'Suivez son travail, identifiez ses difficultés et mesurez ses progrès.',
    highlight: ['travail,', 'difficultés', 'progrès.'],
    title: 'Rapport d’activité',
    period: 'Semaine du 3 au 9 mars 2026',
    student: 'Koffi N’ZI',
    grade: 'Classe de 4e',
    stats: [
      {icon: 'exercises', value: 12, suffix: '', label: 'Exercices réalisés'},
      {icon: 'quiz', value: 5, suffix: '', label: 'Quiz complétés'},
      {icon: 'score', value: 78, suffix: ' %', label: 'Score moyen'},
      {icon: 'time', value: 200, suffix: 'min', label: 'Temps de révision'},
    ],
    chartLabel: 'Évolution des résultats',
    chart: [0.55, 0.6, 0.62, 0.76, 0.705],
    chartBadge: '+28 %',
    strengthsLabel: 'Points forts',
    strengths: ['Calcul mental', 'Résolution de problèmes', 'Compréhension des textes'],
    weakLabel: 'À renforcer',
    weak: ['Fractions', 'Équations', 'Méthodologie'],
    footer: 'Exemple illustratif · rapport rédigé par ChatGPT à partir des informations que vous lui fournissez',
  },

  /** Scène 6 (41–47 s) — bénéfices pour le parent (ordre calé sur la voix off). */
  benefits: {
    items: [
      {icon: 'wallet', title: 'Maîtrisez votre budget', text: 'Réduisez votre dépendance aux cours de répétition.'},
      {icon: 'progress', title: 'Suivez ses progrès', text: 'Des rapports clairs et faciles à comprendre.'},
      {icon: 'stairs', title: 'Développez son autonomie', text: 'Il apprend à apprendre, pas à copier.'},
      {icon: 'clock', title: 'Gagnez du temps', text: 'Des méthodes et prompts prêts à l’emploi.'},
    ],
    note: 'Le guide complète l’accompagnement de votre enfant : il ne remplace pas forcément un répétiteur et ne garantit pas d’économies.',
  },

  /** Scène 7 (47–55 s) — offre et appel à l'action. */
  offer: {
    titleTop: 'APPRENDRE À APPRENDRE',
    titleBottom: 'AVEC CHATGPT',
    subtitle: 'Transformez l’IA en répétiteur scolaire tout en gardant le contrôle.',
    /** Atouts du livre (repris de la couverture — à vérifier). */
    badges: [
      {icon: 'chat', value: '200+', label: 'prompts prêts à l’emploi'},
      {icon: 'family', value: '20', label: 'études de cas réels de familles'},
      {icon: 'book', value: 'A.P.P.R.E.N.D.R.E.', label: 'méthode en 9 étapes'},
    ],
    priceLabel: 'GUIDE NUMÉRIQUE',
    /** Prix affiché tel quel (gardez l'espace insécable entre milliers). */
    price: `10${NBSP}000`,
    currency: 'FCFA',
    button: 'COMMANDER MAINTENANT',
    devices: 'Lecture sur smartphone, tablette et ordinateur',
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
    /** Rappel éthique (affiché en scène 7). */
    ethics: 'ChatGPT ne remplace ni l’enseignant ni les efforts de l’élève.',
    /** Mention de marque (recommandée : ne pas supprimer). */
    trademark:
      'ChatGPT est une marque d’OpenAI. Ce guide est indépendant, non affilié à OpenAI ni approuvé par OpenAI.',
  },
};

export type AdConfig = typeof adConfig;
