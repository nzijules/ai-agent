# MTN Côte d'Ivoire — « Économise tes données mobiles »

Pub motion design verticale (1080×1920, 30 fps, H.264) construite avec **Remotion + React + TypeScript + SVG**.

> **État : phase 3 — prototype de la scène 2** (« Coupe les mises à jour auto »), à valider avant la production des 7 scènes.
> Vidéo : [`deliverables/scene2-prototype.mp4`](deliverables/scene2-prototype.mp4)

## Lancer le projet

```bash
npm i
npm run dev                       # Remotion Studio (aperçu interactif)
node scripts/generate-audio.mjs   # régénère SFX + musique (public/sfx, public/music)
npx remotion render Scene2-Prototype out/scene2-prototype.mp4 --codec=h264 --crf=18
```

Sans accès à `remotion.media` (téléchargement du navigateur), pointer vers un Chrome Headless Shell local :
`REMOTION_BROWSER=/chemin/chrome-headless-shell npx remotion render …`

## Architecture

| Dossier / fichier | Rôle |
|---|---|
| `src/theme/colors.ts` | Palette centralisée (jaune MTN, noir, blanc, + propositions créatives) |
| `src/theme/fonts.ts` | Montserrat variable embarquée (`public/fonts`, licence OFL) |
| `src/theme/timing.ts` | FPS, format, courbes d'animation, **durées des scènes** |
| `src/components/MTNBackground.tsx` | Fond jaune animé réutilisable (halos, lignes lumineuses, points, particules, barres, arcs) |
| `src/components/KineticTitle.tsx` | Typographie cinétique mot par mot + mot-clé surligné |
| `src/components/Toggle3D.tsx` | Interrupteur ON/OFF 3D (squash & stretch, couleur, libellés) |
| `src/components/TouchHand.tsx` | Main photoréaliste qui appuie + onde tactile |
| `src/components/Character.tsx` | Personnage détouré : révélation par masque, respiration, parallaxe |
| `src/components/ui.tsx` | Panneau 3D, ligne de réglage, barre de progression |
| `src/icons/index.tsx` | Icônes SVG « 3D » (synchro, Wi-Fi, réseau, coche, pause…) |
| `src/scenes/Scene2AutoUpdates.tsx` | Scène 2 (prototype) |
| `scripts/generate-audio.mjs` | Synthé procédural : SFX + lit musical afro-pop 112 BPM (libre de droits) |
| `public/characters/` | Assets générés par IA puis détourés (personnage, main) |

## Modifier

- **Textes** : objet `SCENE2_TEXT` en haut de `src/scenes/Scene2AutoUpdates.tsx`.
- **Rythme** : objet `T` (frames clés : entrée du panneau, appui, glissement, confirmation, sortie) dans le même fichier ; durées globales dans `SCENE_SECONDS`.
- **Couleurs** : `src/theme/colors.ts`.
- **Sons** : paramètres dans `scripts/generate-audio.mjs` ; placement/volume via les `<Sequence>` en bas de chaque scène ; volume musique dans `src/Root.tsx`.
- **Logo MTN** : aucun logo n'est fabriqué. Déposer le fichier officiel autorisé dans `public/brand/` ; l'emplacement sera intégré à la scène 7.

## Limites connues

- Le personnage est une photo générée et détourée : il vit par masque, respiration, parallaxe et lumière, mais ne bouge pas réellement. Pour des expressions/gestes animés, il faudra des séquences vidéo détourées (génération image→vidéo).
