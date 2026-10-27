/**
 * Génère STORYBOARD.md et voix-off/vo-XX.txt depuis src/config/scripts.ts.
 * Le storyboard reflète l'état réel de brand.ts (plans de repli appliqués).
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {brand} from '../src/config/brand';
import {FPS, chunkWords, scripts, timeline, voText, type VersionId} from '../src/config/scripts';

const ROOT = join(__dirname, '..');

const SCENE_NAMES: Record<string, string> = {
  hook: '1. Hook',
  btcs: '2. Le BTCS',
  benefits: '3. Les preuves d’usage',
  modernite: '4. La modernité',
  showcase: '5. Le savoir-faire',
  projection: '6. Projection',
  cta: '7. CTA',
};
const TRANSITIONS: Record<string, string> = {
  volet: 'volet architectural',
  rangs: 'glissement de rangs de blocs',
  matiere: 'fondu matière',
};

const ts = (f: number) => {
  const s = f / FPS;
  return Number.isInteger(s) ? `${s}` : s.toFixed(1);
};
const words = (t: string) => t.split(/\s+/).filter(Boolean).length;

const L: string[] = [];
L.push('# Storyboard chronométré — OHEL BTCS');
L.push('');
L.push('> Généré par `npm run storyboard` depuis `src/config/scripts.ts`. Ne pas éditer à la main : modifier `scripts.ts`.');
L.push('> Les plans dont l’affirmation n’est pas validée dans `brand.ts` apparaissent déjà sous leur forme de repli.');
L.push('');
L.push('Couche de texte : **Titre** = titre animé (pas de sous-titres) · **ST** = sous-titres de la voix off · **—** = aucun texte.');
L.push('');

mkdirSync(join(ROOT, 'voix-off'), {recursive: true});

for (const v of Object.keys(scripts) as VersionId[]) {
  const tl = timeline(v);
  const vo = voText(v);
  L.push(`## ${scripts[v].label} — ${ts(tl.durationInFrames)} s, ${words(vo)} mots`);
  L.push('');
  L.push('| Temps | Scène | Visuel | Texte écran | Voix off |');
  L.push('|---|---|---|---|---|');
  for (const seg of tl.segments) {
    seg.shots.forEach((sh, i) => {
      const a = seg.from + sh.from;
      const scene =
        i === 0 ? `**${SCENE_NAMES[seg.scene]}**${seg.transitionIn ? `<br>_entrée : ${TRANSITIONS[seg.transitionIn]}_` : ''}` : '↳';
      const text =
        sh.textLayer === 'title'
          ? `Titre : ${sh.title!.map((l) => (l.highlight ? `**${l.text}**` : l.text)).join(' / ')}`
          : sh.textLayer === 'subtitles'
            ? `ST : ${chunkWords(sh.vo).join(' │ ')}`
            : '—';
      const claim = sh.claim
        ? `<br>_affirmation : brand.claims.${sh.claim}${brand.claims[sh.claim].validated ? ' ✓' : ' (à valider)'}_`
        : '';
      L.push(`| ${ts(a)}–${ts(a + sh.frames)} s | ${scene} | ${sh.visual}${claim} | ${text} | ${sh.vo ? `« ${sh.vo} »` : '_(silence)_'} |`);
    });
  }
  L.push('');
  L.push(`**Voix off ${scripts[v].label} (texte brut) :** ${vo}`);
  L.push('');
  writeFileSync(join(ROOT, 'voix-off', `vo-${v.slice(2)}.txt`), vo + '\n');
}

writeFileSync(join(ROOT, 'STORYBOARD.md'), L.join('\n'));
console.log('STORYBOARD.md et voix-off/*.txt générés');
