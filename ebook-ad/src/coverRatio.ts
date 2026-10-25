import {adConfig} from './config';

/** Rapport hauteur/largeur du livre : celui de l'image officielle, ou 2:3 pour la couverture provisoire. */
export const coverRatio = () => (adConfig.book.coverImage ? adConfig.book.coverRatio : 1.5);
