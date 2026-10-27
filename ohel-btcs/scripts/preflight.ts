/**
 * Contrôles partagés par `npm run check` et `npm run render:all`.
 * Retourne des erreurs (bloquantes) et des avertissements.
 */
import {assets, sceneAssets, type AssetDef, type AssetId} from '../src/config/assets';
import {brand} from '../src/config/brand';
import {READY_SCENES} from '../src/config/formats';
import {FPS, fitsTwoLines, scripts, timeline, type Shot, type VersionId} from '../src/config/scripts';
import {SAFE_VERTICAL} from '../src/lib/format';
import {voiceover} from '../src/config/voiceover';
import {scan} from './scan-assets';

export type Report = {errors: string[]; warnings: string[]};

const CAP_EM = 0.74; // identique à KineticTitle
const MIN_TITLE = 56;
const CTA_NUMBER_AT = 26; // identique à Scene7Cta

/** Vérifications éditoriales et techniques, valables en brouillon comme en final. */
export const checkScripts = (): Report => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const texts: [string, string][] = [];

  for (const v of Object.keys(scripts) as VersionId[]) {
    const tl = timeline(v);
    const expected = scripts[v].segments.reduce((n, s) => n + s.shots.reduce((m, sh) => m + sh.sec, 0), 0);
    // La version longue est resserrée sur la voix : sa durée n'est plus fixée à 60 s.
    if (v !== 'ad60' && Math.abs(tl.durationInFrames / FPS - Number(v.slice(2))) > 0.01) {
      errors.push(`${v} : durée ${tl.durationInFrames / FPS} s au lieu de ${v.slice(2)} s (somme des plans : ${expected} s)`);
    }
    // Transitions : jamais la même deux fois de suite.
    const trans = tl.segments.map((s) => s.transitionIn).filter(Boolean);
    trans.forEach((t, i) => i > 0 && t === trans[i - 1] && errors.push(`${v} : transition « ${t} » répétée deux fois de suite`));
    // Au moins trois variantes sur les versions longues.
    if (v !== 'ad15' && new Set(trans).size < 3) warnings.push(`${v} : moins de trois variantes de transition`);

    const check = (sh: Shot, where: string) => {
      if (sh.textLayer === 'title' && !sh.title?.length) errors.push(`${where} : plan « title » sans titre`);
      if (sh.textLayer === 'subtitles' && !sh.vo) errors.push(`${where} : plan « subtitles » sans voix off`);
      if (sh.textLayer !== 'title' && sh.title)
        errors.push(`${where} : titre défini sur un plan « ${sh.textLayer} » (une seule couche de texte)`);
      for (const l of sh.title ?? []) {
        const w = l.text.length * CAP_EM * MIN_TITLE;
        const max = 1080 - SAFE_VERTICAL.left - SAFE_VERTICAL.right;
        if (w > max) errors.push(`${where} : ligne de titre trop longue pour 56 px en 9:16 : « ${l.text} »`);
        texts.push([where, l.text]);
      }
      if (sh.vo) texts.push([where, sh.vo]);
    };
    tl.segments.forEach((seg) =>
      scripts[v].segments[seg.index].shots.forEach((sh, i) => {
        const where = `${v}/${seg.scene}#${i + 1}`;
        check(sh, where);
        if (sh.fallback) check(sh.fallback as Shot, `${where} (repli)`);
        if (sh.claim && !(sh.claim in brand.claims)) errors.push(`${where} : affirmation inconnue ${sh.claim}`);
      }),
    );

    // Sous-titres uniformes : une ligne chacun.
    for (const seg of tl.segments)
      for (const sh of seg.shots)
        for (const c of sh.cues) if (!fitsTwoLines(c.text)) errors.push(`${v}/${seg.scene} : sous-titre trop long (« ${c.text} »)`);

    const cta = tl.segments.find((s) => s.scene === 'cta');
    if (!cta) errors.push(`${v} : pas de scène CTA`);
    else if (cta.frames - CTA_NUMBER_AT < 4 * FPS) errors.push(`${v} : numéro WhatsApp affiché moins de 4 s`);
  }

  // Voix off : chaque extrait tient dans son plan.
  for (const [v, track] of Object.entries(voiceover)) {
    const tl = timeline(v as VersionId);
    for (const c of track!.clips) {
      const shot = tl.segments[c.segment]?.shots[c.shot];
      if (!shot) {
        errors.push(`voiceover.${v} : plan ${c.segment}/${c.shot} inexistant`);
        continue;
      }
      if (c.at + c.src[1] - c.src[0] > shot.sec + 0.01)
        errors.push(`voiceover.${v} : l’extrait ${c.src.join('–')} s déborde du plan ${c.segment}/${c.shot}`);
      for (const q of c.cues ?? []) texts.push([`voiceover.${v}`, q.text]);
    }
    if (track!.provisional) warnings.push(`voix off ${v} provisoire (non validée par OHEL)`);
  }

  // Typographie française.
  texts.push(['brand.signature', brand.signature], ['brand.offer', brand.offer]);
  for (const [k, c] of Object.entries(brand.claims)) texts.push([`brand.claims.${k}`, c.text]);
  for (const [where, t] of texts) {
    if (/ [?:!;]/.test(t)) errors.push(`${where} : espace normale avant « ? : ! ; » (utiliser une espace insécable) — « ${t} »`);
    if (/[^\s  ][?:!;](\s|$)/.test(t)) errors.push(`${where} : espace insécable manquante avant « ? : ! ; » — « ${t} »`);
    if (/'/.test(t)) errors.push(`${where} : apostrophe droite, utiliser « ’ » — « ${t} »`);
    if (/\.\.\./.test(t)) errors.push(`${where} : « ... » au lieu de « … »`);
  }

  // Authenticité : la scène 5 n'accepte que des médias authentiques.
  for (const id of sceneAssets.showcase) {
    const d: AssetDef = assets[id];
    if (!d.authentique || d.ia) errors.push(`asset ${id} utilisé en scène 5 sans être marqué authentique (ou marqué IA)`);
  }
  for (const [id, d] of Object.entries(assets) as [AssetId, AssetDef][]) {
    if (d.authentique && d.ia) errors.push(`asset ${id} : authentique et IA à la fois`);
  }
  return {errors, warnings};
};

/** Conditions supplémentaires pour un rendu final publiable. */
export const checkFinal = (v: VersionId): string[] => {
  const errors: string[] = [];
  const status = scan();
  const tl = timeline(v);
  for (const seg of tl.segments) {
    if (!READY_SCENES.includes(seg.scene)) errors.push(`scène « ${seg.scene} » pas encore développée`);
  }
  if (!brand.whatsapp) errors.push('numéro WhatsApp officiel manquant (brand.whatsapp)');
  for (const [id, d] of Object.entries(assets) as [AssetId, AssetDef][]) {
    if (d.blocksFinal?.includes(v) && !status[id].path) {
      errors.push(`${d.authentique ? 'média authentique' : 'asset'} manquant : ${d.candidates[0]} (${d.label})`);
    }
  }
  for (const seg of scripts[v].segments) {
    for (const sh of seg.shots) {
      if (sh.claim && !brand.claims[sh.claim].validated && !sh.fallback) {
        errors.push(`affirmation non validée : brand.claims.${sh.claim} (« ${brand.claims[sh.claim].text} »)`);
      }
    }
  }
  return [...new Set(errors)];
};
