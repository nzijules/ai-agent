import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Identité visuelle OHEL International — paramètres modifiables.
 * Palette dérivée du brief (ocre latérite, anthracite, blanc cassé, vert
 * profond en accent). Le rouge du logo n'est utilisé que dans le logo.
 */
export const COLORS = {
  laterite: "#B4612F",
  lateriteClair: "#D98A52",
  lateriteSombre: "#7E3D1C",
  anthracite: "#1C1D20",
  anthraciteClair: "#2A2C31",
  acier: "#4A5058",
  blancCasse: "#F3EEE6",
  sable: "#D8C29A",
  ciment: "#8E9093",
  vert: "#1F5A40",
  vertClair: "#3F8A64",
};

/**
 * Police Archivo (SIL Open Font License), embarquée dans public/fonts pour un
 * rendu hors ligne et reproductible. Fichiers variables : graisses 100 à 900.
 */
export const FONT = "Archivo";

loadFont({
  family: FONT,
  url: staticFile("fonts/Archivo-latin.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});
loadFont({
  family: FONT,
  url: staticFile("fonts/Archivo-latin-ext.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
});

/**
 * Coordonnées affichées sur le carton final.
 * Laisser une valeur vide ("") pour la masquer.
 * En mode "final", un WhatsApp vide bloque le rendu (aucun faux contact exporté).
 */
export const CONTACT = {
  whatsapp: "+225 07 49 23 86 40",
  site: "ohelintermondial.com",
  email: "contact@ohelintermondial.com",
};

export const SIGNATURE = {
  marque: "OHEL International",
  ligne1: "Bâtir solide,",
  ligne2: "bâtir vert.",
};
