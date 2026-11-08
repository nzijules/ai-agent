// Configuration centralisée des couleurs.
// Jaune / noir / blanc : univers MTN. Les autres teintes sont des
// propositions créatives (non issues de la charte officielle MTN).
export const COLORS = {
  yellow: "#FFCB05", // Jaune MTN principal
  yellowBright: "#FFE500", // Jaune lumineux secondaire
  yellowPale: "#FFF176", // Jaune clair
  black: "#000000",
  white: "#FFFFFF",
  ui: "#252830", // Gris interfaces
  uiSoft: "#5B606B",
  uiLine: "#E7E9EE",
  green: "#22C55E", // Confirmation
  red: "#EF3340", // Alerte
} as const;

export type ColorName = keyof typeof COLORS;
