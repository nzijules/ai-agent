# Publicité motion design — « Apprendre à apprendre avec ChatGPT »

Projet **Remotion 4 + React 19 + TypeScript**. Publicité de **50 s** (version 2 : « bénéfice parent »), 30 fps, entièrement animée par frames.

## Fichiers livrés

| Fichier | Contenu |
|---|---|
| `out/pub-1080x1920.mp4` | Vertical 1080×1920, H.264, **sans voix off** (musique + effets) |
| `out/pub-1080x1920-soustitres.mp4` | Vertical, sans voix off, avec sous-titres animés incrustés (lecture sans son) |
| `out/pub-1080x1080.mp4` | Carré 1080×1080, H.264, sans voix off |
| `docs/STORYBOARD.md` | Storyboard détaillé, direction artistique, zones de sécurité, conformité |
| `docs/VOIX-OFF.md` | Script intégral de la voix off v2 + intégration automatique (`npm run voiceover`) |
| `docs/sous-titres.srt` | Sous-titres de la voix off (fichier séparé) |
| `src/` | Code source complet |

## Démarrage

```bash
npm install
npm run studio          # prévisualisation interactive dans le navigateur
npm run render          # exporte les versions verticale + carrée (sans voix off)
npm run voiceover       # recale public/audio/voiceover-source.mp3 sur la timeline
npm run render:vertical-vo   # version avec voix off + sous-titres (voir docs/VOIX-OFF.md)
npm run audio           # régénère musique, effets et docs/sous-titres.srt
npm run stills          # images de contrôle qualité dans out/stills/
```

> Environnement sans accès au téléchargement de Chrome : définir `REMOTION_BROWSER=/chemin/vers/chrome-headless-shell` (lu par `remotion.config.ts`) et ajouter `--browser-executable=$REMOTION_BROWSER` aux commandes de rendu.

### Compositions disponibles

| ID | Format | Voix off | Sous-titres |
|---|---|---|---|
| `AdVertical` | 1080×1920 | non | non |
| `AdVerticalCaptions` | 1080×1920 | non | oui |
| `AdVerticalVO` | 1080×1920 | oui (`public/audio/voiceover.mp3`) | oui |
| `AdSquare` | 1080×1080 | non | non |
| `AdSquareVO` | 1080×1080 | oui | oui |

## Modifier la publicité

**Tout se fait dans `src/config.ts`.**

- **Prix** : `offer.price` (ex. `` `7${NBSP}500` ``) et `offer.currency`. Penser à mettre à jour la voix off (`docs/VOIX-OFF.md`) et `src/captions.ts` si le prix y est prononcé.
- **Couverture officielle** : déjà intégrée (`public/cover/couverture.jpg`, auteur Jules N’ZI). Le logo ChatGPT de la couverture y est masqué pour respecter la consigne « aucun logo suggérant un partenariat » ; l’original est conservé dans `public/cover/couverture-officielle.png`. Pour changer de couverture : déposer l’image dans `public/cover/`, puis renseigner `book.coverImage` et `book.coverRatio` (hauteur ÷ largeur). Elle remplace automatiquement la couverture provisoire partout (mockups 3D des scènes 3 et 7). Pour garder la couverture provisoire, modifier `coverTitle*`, `coverKicker`, `coverSubtitle`, `coverAuthor`.
- **Textes** : `hook`, `struggle`, `solution`, `quiz`, `report`, `benefits`, `offer` (une clé par scène). Les données du quiz (question, réponses, correction, score) et du rapport fictif (tuiles, graphique, points à renforcer) s'y modifient aussi.
- **Appel à l’action** : `offer.button` (texte du bouton) et `offer.contact` :
  - WhatsApp : `{type: 'whatsapp', label: 'WhatsApp', value: '+225 07 00 00 00 00'}`
  - Lien : `{type: 'link', label: '', value: 'monsite.com/ebook'}`
  - Masquer : `{type: 'none', …}`
- **Couleurs / polices** : `src/theme.ts`.
- **Minutage** : `src/timeline.ts` (durée de chaque scène).
- **Sous-titres** : `src/captions.ts`.

Après modification : vérifier dans `npm run studio` qu’aucun texte ne déborde (les textes plus longs que l’original peuvent passer sur une ligne de plus), puis relancer le rendu.

## Architecture

```
src/
  config.ts          ← textes, prix, couverture, CTA (à éditer)
  theme.ts           ← palette, polices
  timeline.ts        ← découpage temporel des 7 scènes (50 s)
  captions.ts        ← script voix off + minutage des sous-titres
  format.ts          ← mise en page vertical / carré, zones de sécurité
  anim.ts            ← springs et easings partagés
  Ad.tsx             ← composition : fond, scènes, sous-titres, audio
  Root.tsx           ← déclaration des 5 compositions
  components/        ← Background, Book3D, Cover, KineticText, Icons, Captions, SceneWrap, ui,
                       Commerce (prix, bouton, contact, mentions), ProblemCard
  scenes/            ← S1Hook, S2Struggle, S3Solution, S4Quiz, S5Report, S6Benefits, S7Offer
scripts/
  generate-audio.mjs ← synthèse musique + effets + export .srt
  assemble-voiceover.mjs ← calage automatique de la voix off sur la timeline
  stills.mjs         ← rendu d’images de contrôle
public/
  fonts/             ← Plus Jakarta Sans & Inter (OFL)
  audio/             ← music.wav, sfx-*.wav (+ voiceover-source.mp3 à ajouter)
  cover/             ← couverture officielle (logo masqué) + original
```

## Droits

- Musique et bruitages : synthétisés par le script du projet, sans sample externe.
- Polices : Plus Jakarta Sans et Inter, SIL Open Font License (voir `public/fonts/LICENSE-*`).
- Aucune marque tierce affichée sous forme de logo ; mention d’indépendance vis-à-vis d’OpenAI incluse.
