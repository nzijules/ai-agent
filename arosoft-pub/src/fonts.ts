import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/700-italic.css";
import { continueRender, delayRender } from "remotion";

const handle = delayRender("Chargement des polices");
const specs = [
  "600 40px Montserrat", "700 40px Montserrat", "800 40px Montserrat", "900 40px Montserrat",
  "500 40px Inter", "600 40px Inter", "700 40px Inter", "italic 700 40px 'Playfair Display'",
];
Promise.all(specs.map((s) => document.fonts.load(s, "AÉàçêô€ 0123456789")))
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
