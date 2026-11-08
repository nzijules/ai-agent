# MTN Côte d'Ivoire — « Économise tes données mobiles »

Publicité motion design **TikTok** (9:16, 1080×1920, 30 fps, 49 s) construite avec **Remotion + React + TypeScript + SVG**.

| Livrable | Fichier |
|---|---|
| Vidéo finale **avec voix-off** | [`deliverables/mtn-data-ad-tiktok.mp4`](deliverables/mtn-data-ad-tiktok.mp4) |
| Version **sans voix-off** (musique + effets sonores) | [`deliverables/mtn-data-ad-tiktok-sansvoix.mp4`](deliverables/mtn-data-ad-tiktok-sansvoix.mp4) |
| Script de la voix-off + calage sur l'enregistrement | [`VOIX-OFF.md`](VOIX-OFF.md) |
| Contrôle des zones de sécurité TikTok | [`deliverables/mtn-data-ad-safezones.jpg`](deliverables/mtn-data-ad-safezones.jpg) |
| Planche de contact (1 image par scène) | [`deliverables/mtn-data-ad-storyboard.jpg`](deliverables/mtn-data-ad-storyboard.jpg) |

## Storyboard

| # | Durée | Scène | Raccord vers la suivante |
|---|---|---|---|
| 1 | 0–6 s | Le problème : « Ta connexion finit trop vite ? » — personnage surpris, jauge qui s'effondre, croix rouge, « ? » | Les flèches de données filent au centre et deviennent l'icône de synchro |
| 2 | 6–13,3 s | Astuce 1 : couper les mises à jour auto (Wi-Fi conservé) | Plongée dans l'interrupteur OFF |
| 3 | 13,3–19,6 s | Astuce 2 : limiter l'arrière-plan (la messagerie reste active) | L'interrupteur OFF se pose sur une ligne ; la tuile vidéo grandit |
| 4 | 19,6–28,1 s | Astuce 3 : baisser la qualité vidéo (480p) — mains réelles | Un nuage se forme au centre |
| 5 | 28,1–35 s | Astuce 4 : sauvegardes en Wi-Fi uniquement (rien n'est supprimé) | La coche devient l'anneau de la jauge |
| 6 | 35–40 s | Astuce 5 : analyser la consommation (12,8 Go / 20 Go, loupe sur Vidéos) | Une ligne lumineuse traverse l'écran |
| 7 | 40–49 s | Partage : publication « 5 astuces », bouton Partager, réseau d'amis, message final | — (tenue finale 3 s) |

## Lancer / rendre

```bash
npm i
npm run dev                       # Remotion Studio (aperçu, chaque scène est aussi une composition)
node scripts/generate-audio.mjs   # régénère SFX + musique
npm run render:tiktok             # → out/mtn-data-ad-tiktok.mp4 (avec voix ; H.264 High yuv420p, AAC 320k, faststart)
npm run render:tiktok:sansvoix    # → out/mtn-data-ad-tiktok-sansvoix.mp4
npm run still:safezones           # image de contrôle des zones TikTok
```

Sans accès à `remotion.media`, pointer vers un Chrome Headless Shell local :
`REMOTION_BROWSER=/chemin/chrome-headless-shell npm run render:tiktok`

## Format TikTok

- Zones de sécurité dans `src/theme/safeZones.ts` (haut 210 px, bas 430 px, colonne d'actions à droite 150 px).
- Logo MTN en haut à droite, juste sous la barre d'onglets TikTok ; pastille « ASTUCE n/5 » à gauche sur la même ligne ; titres dessous.
- Composition **`MTN-Data-Ad-SafeZones`** : maquette de l'interface TikTok par-dessus la pub (à ne pas publier).

## Architecture

| Fichier | Rôle |
|---|---|
| `src/MainAd.tsx` | Composition principale : fond et logo continus, 7 scènes en série, musique |
| `src/scenes/index.ts` | Ordre des scènes ; `src/theme/timing.ts` → `SCENE_FRAMES` (durées calées sur la voix) |
| `src/scenes/Scene1…7*.tsx` | Une scène par fichier : textes (`SCENEn_TEXT`) et temps clés (`T`) en tête de fichier |
| `src/components/MTNBackground.tsx` | Fond jaune animé (halos, lignes lumineuses, trame de points, particules, barres, arcs) |
| `src/components/KineticTitle.tsx` | Typographie cinétique + mot-clé surligné |
| `src/components/common.tsx` | Logo, pastille d'astuce, zone de titre, flash, habillage des scènes seules |
| `src/components/Phone.tsx` | Smartphone 3D réutilisable (écran = vraie interface animée) |
| `src/components/Toggle3D.tsx`, `ui.tsx` | Interrupteur ON/OFF, panneaux, lignes de réglage, barres |
| `src/components/Character.tsx`, `TouchHand.tsx` | Personnage détouré, main qui appuie, ondes tactiles |
| `src/icons/` | Icônes SVG « 3D » : synchro, Wi-Fi, réseau, applis génériques, nuage, partage, loupe… |
| `scripts/generate-audio.mjs` | Synthé procédural : 14 effets sonores + musique afro-pop 112 BPM (libres de droits) |
| `public/characters/` | Assets photoréalistes générés par IA puis détourés |
| `public/brand/mtn-logo.png` | Logo officiel fourni par le client (fond extérieur rendu transparent) |
| `public/fonts/` | Montserrat variable (licence SIL OFL) |

## Modifier

- **Textes** : objets `SCENEn_TEXT` en tête de chaque scène.
- **Rythme** : objets `T0`/`T` (frames) dans chaque scène, `SCENE_FRAMES` pour la durée des scènes.
- **Couleurs** : `src/theme/colors.ts`. **Logo** : remplacer `public/brand/mtn-logo.png` (ratio 2:1).
- **Sons** : `scripts/generate-audio.mjs` ; placement/volume via les `<Sequence>` en bas de chaque scène ; musique dans `src/MainAd.tsx`.
- **Voix-off** : `public/voiceover/astuce-mtn-connexion.mp3`, déclarée dans `VOICEOVER` (`src/MainAd.tsx`). Pour un nouvel enregistrement : remplacer le fichier, ajuster `endSeconds` et, si le débit change, `SCENE_FRAMES`.

## Limites connues

- Les personnages sont des photos générées et détourées : ils vivent par masque, respiration, parallaxe, vibration et lumière, mais ne bougent pas réellement. Des gestes/expressions animés nécessiteraient des séquences vidéo détourées.
- Les consommations vidéo (≈ 2,5 / 1,2 / 0,6 Go/h) sont des ordres de grandeur moyens, signalés comme estimations à l'écran.
- La musique et les sons sont synthétisés par code : fonctionnels et libres de droits, mais une musique produite donnerait un rendu plus riche.
