/**
 * Inspecte public/assets/ et brand.ts, puis :
 *  - écrit src/generated/asset-status.json (lu par les composants : fichier réel ou placeholder) ;
 *  - régénère MISSING_ASSETS.md (ressources manquantes, affirmations à valider, placeholders).
 *
 * Lancé automatiquement par studio, stills et render.
 */
import {existsSync, mkdirSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {assets, sceneAssets, versionAudio, type AssetDef, type AssetId} from '../src/config/assets';
import {brand} from '../src/config/brand';
import {scripts, type VersionId} from '../src/config/scripts';

const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

export type AssetStatus = Record<string, {path: string | null; draft: string | null}>;

const findFile = (candidates: string[]) =>
  candidates.find((c) => existsSync(join(PUBLIC, c)) && statSync(join(PUBLIC, c)).size > 0) ?? null;

export const scan = () => {
  const status: AssetStatus = {};
  for (const [id, def] of Object.entries(assets) as [AssetId, AssetDef][]) {
    const draft = def.draftFallback && existsSync(join(PUBLIC, def.draftFallback)) ? def.draftFallback : null;
    status[id] = {path: findFile(def.candidates), draft};
  }
  return status;
};

/** Assets réellement utilisés par une version. */
export const assetsOfVersion = (v: VersionId): AssetId[] => {
  const ids = new Set<AssetId>(versionAudio[v]);
  for (const seg of scripts[v].segments) {
    for (const id of sceneAssets[seg.scene] ?? []) ids.add(id);
    for (const id of sceneAssets[`${seg.scene}:${seg.variant}`] ?? []) ids.add(id);
  }
  return [...ids].filter((id) => {
    const def: AssetDef = assets[id];
    return !def.authentique || !def.blocksFinal || def.blocksFinal.includes(v);
  });
};

const usedClaims = (v: VersionId) =>
  [...new Set(scripts[v].segments.flatMap((s) => s.shots.map((sh) => sh.claim)).filter(Boolean))] as (keyof typeof brand.claims)[];

const writeMissing = (status: AssetStatus) => {
  const L: string[] = [];
  const box = (ok: boolean) => (ok ? '[x]' : '[ ]');
  const all = Object.entries(assets) as [AssetId, AssetDef][];

  L.push('# MISSING_ASSETS — OHEL BTCS');
  L.push('');
  L.push(
    '> Fichier généré par `npm run scan` à partir de `src/config/brand.ts`, `src/config/assets.ts` et `public/assets/`. Ne pas éditer à la main.',
  );
  L.push('');

  L.push('## 1. Bloquant pour la publication');
  L.push('');
  for (const [id, def] of all.filter(([, d]) => d.blocksFinal?.length)) {
    const ok = !!status[id].path;
    L.push(
      `- ${box(ok)} **${def.label}** — \`${def.candidates[0]}\` — bloque : ${def.blocksFinal!.join(', ')}${def.note ? `  \n  _${def.note}_` : ''}`,
    );
  }
  L.push(`- ${box(!!brand.whatsapp)} **Numéro WhatsApp officiel** — \`brand.whatsapp\` — bloque : ad15, ad30, ad60`);
  L.push('');

  L.push('## 2. Informations à fournir dans `brand.ts`');
  L.push('');
  L.push(`- ${box(!!brand.offer)} Offre d’étude (gratuite / payante, délai) — \`brand.offer\` — _vide = non affichée_`);
  L.push(`- ${box(brand.services.length > 0)} Services réellement proposés — \`brand.services\` — _vide = bandeau retiré_`);
  L.push(
    `- ${box(brand.colors.redValidated)} Code couleur exact du rouge OHEL — provisoire \`${brand.colors.red}\` prélevé sur le logo basse définition`,
  );
  L.push(
    `- ${box(brand.btcs.dimensionsValidated)} Dimensions des blocs — provisoire ${brand.btcs.dimensions.length} × ${brand.btcs.dimensions.width} × ${brand.btcs.dimensions.height} cm`,
  );
  L.push(
    `- ${box(brand.btcs.modelValidated)} Modèle de bloc (emboîtement ? alvéoles ?) + photo d’un bloc et de la presse OHEL (référence obligatoire pour l’animation)`,
  );
  L.push(`- ${box(!!brand.owner)} Entité qui détient le projet (licence Remotion, licence musique) — \`brand.owner\``);
  L.push('- [ ] Autorisation écrite d’utiliser les visages des employés et clients visibles dans les médias');
  L.push('- [ ] Validation des scripts voix off (`npm run storyboard` → `STORYBOARD.md`) et choix de la voix');
  L.push('');

  L.push('## 3. Affirmations à valider');
  L.push('');
  for (const [k, c] of Object.entries(brand.claims)) {
    const consequence =
      k === 'humidite'
        ? 'non validée → carte « Architecture contemporaine » à la place de « Résiste à la pluie »'
        : 'non validée → rendu final des versions qui l’utilisent refusé';
    L.push(`- ${box(c.validated)} \`brand.claims.${k}\` : « ${c.text} »  \n  _${consequence}_`);
  }
  L.push('- [ ] « Un matériau local, plus respectueux de l’environnement » (scène 3, 60 s) — formulation à confirmer par OHEL');
  L.push('');

  L.push('## 4. Médias et audio (non bloquants)');
  L.push('');
  for (const [id, def] of all.filter(([, d]) => !d.blocksFinal?.length)) {
    const ok = !!status[id].path;
    const tag = def.ia ? ' _(illustration : mention « non contractuelle » ajoutée automatiquement)_' : '';
    L.push(`- ${box(ok)} ${def.label} — \`${def.candidates[0]}\`${tag}${def.note ? `  \n  _${def.note}_` : ''}`);
  }
  L.push('');

  L.push('## 5. Placeholders restants par version');
  L.push('');
  for (const v of Object.keys(scripts) as VersionId[]) {
    const missing = assetsOfVersion(v).filter((id) => !status[id].path);
    const claims = usedClaims(v).filter((k) => !brand.claims[k].validated);
    L.push(`### ${scripts[v].label}`);
    L.push('');
    if (!missing.length && !claims.length) L.push('Aucun.');
    for (const id of missing) {
      const def: AssetDef = assets[id];
      const blocking = def.blocksFinal?.includes(v) ? ' **(bloquant)**' : '';
      L.push(`- ${def.label}${blocking}`);
    }
    for (const k of claims) L.push(`- Affirmation non validée : \`brand.claims.${k}\``);
    L.push('');
  }

  writeFileSync(join(ROOT, 'MISSING_ASSETS.md'), L.join('\n'));
};

if (require.main === module) {
  const status = scan();
  mkdirSync(join(ROOT, 'src/generated'), {recursive: true});
  writeFileSync(join(ROOT, 'src/generated/asset-status.json'), JSON.stringify(status, null, 2) + '\n');
  writeMissing(status);
  const n = Object.values(status).filter((s) => !s.path).length;
  console.log(`scan : ${Object.keys(status).length - n} assets trouvés, ${n} manquants → MISSING_ASSETS.md mis à jour`);
}
