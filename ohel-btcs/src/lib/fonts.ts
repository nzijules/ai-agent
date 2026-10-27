// Polices embarquées localement (aucun appel réseau au rendu).
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/caveat/600.css';
import {continueRender, delayRender} from 'remotion';

export const FONT = "'Montserrat', sans-serif";
/** Réservée à la signature « Construisons autrement. ». */
export const FONT_SIGNATURE = "'Caveat', cursive";

const handle = delayRender('Chargement des polices');
Promise.all([
  document.fonts.load(`600 40px Montserrat`),
  document.fonts.load(`800 40px Montserrat`),
  document.fonts.load(`600 40px Caveat`),
]).then(() => continueRender(handle));
