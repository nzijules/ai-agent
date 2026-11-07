// Le script de la pub : une entrée par scène.
// durée = nombre d'images (30 images = 1 seconde)
export const scenes = [
  { id: "accroche", duree: 135, voix: "voix/scene1.wav",
    texte: "Vos clients vous écrivent sur WhatsApp, à toute heure." },
  { id: "probleme", duree: 165, voix: "voix/scene2.wav",
    texte: "Et vous répondez trop tard ? Ils partent chez un concurrent." },
  { id: "solution", duree: 195, voix: "voix/scene3.wav",
    texte: "Avec AroSoft, vous répondez 24\u00a0h/24, automatiquement." },
  { id: "benefices", duree: 285, voix: "voix/scene4.wav",
    texte: "Réponses instantanées. Commandes et rendez-vous. Zéro message oublié." },
  { id: "appel", duree: 180, voix: "voix/scene5.wav",
    texte: "Essayez AroSoft. Écrivez-nous sur WhatsApp dès aujourd'hui." },
] as const;

export const TRANSITION = 15; // durée de chaque transition (0,5 s)

// Charte graphique
export const couleurs = {
  bleu: "#0b2a8a", bleuClair: "#1f4fe0", jaune: "#ffd21f",
  rouge: "#e3262f", vert: "#25d366", blanc: "#ffffff", nuit: "#071a52",
};
