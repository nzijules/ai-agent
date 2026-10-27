import {random} from 'remotion';

/** Pseudo-aléatoire déterministe (identique à chaque rendu). */
export const rnd = (seed: string | number) => random(`ohel-${seed}`);
