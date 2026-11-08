// Pseudo-aléatoire déterministe (indispensable : chaque frame doit être reproductible).
export const seeded = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
