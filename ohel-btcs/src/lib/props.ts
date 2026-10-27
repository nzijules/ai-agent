import {z} from 'zod';

export const adProps = z.object({
  /** Brouillon : filigrane + logo provisoire autorisés. */
  draft: z.boolean(),
  /** Affiche les zones de sécurité 9:16 (prévisualisation uniquement). */
  showSafeZones: z.boolean(),
});
export type AdProps = z.infer<typeof adProps>;
