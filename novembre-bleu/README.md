# Novembre Bleu 2026 — film de sensibilisation au cancer de la prostate (Côte d'Ivoire)

Projet **Remotion (React + TypeScript)** : film de **90 s exactement (2700 frames à 30 fps)**, livré en
**1080x1920** (vertical) et **1920x1080** (horizontal, mise en page recomposée), en MP4 H.264 + AAC,
avec sous-titres français intégrés et fichier **SRT**.

> Concept : « Le courage, c'est aussi de prendre soin de sa santé. »
> Signature visuelle : logo AroSoft en haut à droite (format réduit, sans fond ni slogan).

## ⚠️ État des médias : à lire avant toute diffusion

| Élément | État |
|---|---|
| Voix-off | **Fichier fourni** (`public/assets/audio/voix-off-novembre-bleu.mp3`, 74,95 s), utilisé tel quel, phrase par phrase |
| Images / vidéos des 15 plans | **PLACEHOLDERS** : illustrations vectorielles animées, **étiquetées à l'écran** « PLACEHOLDER Sxx » |
| Musique | **Piste PROVISOIRE** générée par script (piano + nappe) : à remplacer par la musique originale |
| Transitions sonores | **Provisoires** (souffles et scintillements générés) |
| Logo AroSoft | Extrait du fichier fourni, fond blanc retiré, slogan retiré, lettres navy passées en blanc pour les fonds sombres (**variante à faire valider par la marque**) |
| Logo institutionnel | **Emplacement réservé** sur l'end card (aucun logo inventé) |
| Validation médicale | **Requise avant diffusion** (voir `docs/RAPPORT-VERIFICATION.md`) |

Pour remplacer un placeholder : déposer `s01.jpg` … `s15.mp4` dans `public/assets/images/` ou
`public/assets/videos/` (voir `docs/MEDIAS.md`). Le plan bascule automatiquement sur le média réel
(caméra cinématographique et étalonnage appliqués) et l'étiquette PLACEHOLDER disparaît.

## Installation

Prérequis : Node.js ≥ 18, FFmpeg (pour le mastering et les scripts), Python 3 + numpy + Pillow
(uniquement pour régénérer la musique provisoire ou le logo).

```bash
cd novembre-bleu
npm install
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm run studio` | Remotion Studio : preview interactive du film et de **chaque scène** (dossiers `Scenes-Vertical` / `Scenes-Horizontal`) |
| `npm run typecheck` | Vérification TypeScript |
| `npm run preview:15s` | Rend la preview 15 s (scènes 1 à 3) → `out/preview-S01-S03-15s.mp4` |
| `npm run render:vertical` | Rend le 1080x1920 puis mastering audio → `out/novembre-bleu-1080x1920.mp4` |
| `npm run render:horizontal` | Rend le 1920x1080 puis mastering audio → `out/novembre-bleu-1920x1080.mp4` |
| `npm run render:all` | Les deux formats |
| `npx remotion render Scene-S06-V out/S06.mp4` | Rend une scène isolée (voix, musique et sous-titres synchronisés) |
| `npm run timeline` | Régénère `out/novembre-bleu.fr.srt`, `docs/TIMELINE.md` et `scripts/timeline.json` |
| `npm run music` | Régénère la musique et les transitions provisoires (calées sur la timeline) |
| `npm run logo` | Régénère les PNG transparents du logo depuis le fichier source |
| `npm run stills -- Vertical` | Images de contrôle (2 par scène) → `out/stills/` |
| `npm run verify` | Vérifications automatiques (durées, synchro, texte intégral, garde-fous éditoriaux, fichiers rendus) |

Option Studio / CLI : les props `showSubtitles`, `showPlaceholderTags`, `musicLevel`, `musicDuckedLevel`
sont modifiables (`--props='{"showSubtitles":false}'` pour une version sans sous-titres incrustés).

Le mastering (`scripts/master.sh`) normalise l'audio à **-14 LUFS intégrés / -1,5 dBTP** (deux passes
`loudnorm`), sans ré-encoder la vidéo.

## Architecture

```
src/
  compositions/   NovembreBleu.tsx (film, pistes audio, ducking), ScenePreview.tsx (preview par scène / plage)
  scenes/         S01_S04.tsx, S05_S15.tsx, registry.tsx (scène → composant + transition), shared.ts
  components/     CinematicCamera, ParallaxScene, KineticHeadline, BlueRibbon, MedicalExplainer,
                  LightTransition, SubtitleTrack, EndCard, LogoBug, MediaSlot (+ PlaceholderTag),
                  Figures (silhouettes d'animatique, skyline), Atmosphere (grain, vignette, bokeh, rayons), Backdrop, layout
  data/           timeline.ts (SOURCE DE VÉRITÉ : VO, scènes, sous-titres), media-manifest.json (généré)
  styles/         theme.ts (couleurs, polices Montserrat ExtraBold + Inter, chargées localement)
public/assets/    images/ videos/ audio/ logos/ fonts/ textures/
scripts/          export-timeline.ts, verify.ts, stills.ts, scan-media.mjs, generate-music.py, process-logo.py, master.sh
docs/             TIMELINE.md, MEDIAS.md, RAPPORT-VERIFICATION.md
out/              rendus (MP4 ignorés par git), novembre-bleu.fr.srt
```

### Synchronisation

`src/data/timeline.ts` contient chaque phrase du script avec ses bornes **mesurées dans le fichier de
voix-off** (détection de silences). Les phrases sont reposées sur la timeline avec des respirations
musicales pour atteindre 90 s **sans couper ni modifier un mot**. Les scènes, la piste de sous-titres,
le SRT, le ducking de la musique et les repères des transitions sonores dérivent tous de ce fichier.
