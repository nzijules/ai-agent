// Zones de sécurité TikTok (repère 1080×1920). Valeurs prudentes, couvrant
// l'interface TikTok actuelle : onglets en haut, colonne d'actions à droite,
// pseudo + légende + son en bas. Les éléments clés doivent rester dans SAFE.
export const TIKTOK = {
  top: 210, // « Suivis | Pour toi », recherche, LIVE
  bottom: 430, // pseudo, légende, musique, barre de navigation
  right: 150, // avatar, j'aime, commentaires, favoris, partager
  rightBand: { top: 760, bottom: 1640 }, // hauteur de la colonne d'actions
  left: 60,
};

export const SAFE = {
  left: TIKTOK.left,
  right: 1080 - TIKTOK.right, // 930
  top: TIKTOK.top,
  bottom: 1920 - TIKTOK.bottom, // 1490
};
