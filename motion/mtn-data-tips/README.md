# MTN — Astuces data · Vibe motion design

Pub verticale 1080×1920, 30 fps, 43 s, H.264. Chaque affiche est reconstruite en **calques indépendants** et animée de l'intérieur. Ce n'est ni un diaporama ni un effet Ken Burns.

## Livrables

| Fichier | Contenu |
|---|---|
| `mtn-data-tips.mp4` | Film final : voix-off + musique (baissée sous la voix) + effets sonores |
| `mtn-data-tips-sans-voix.mp4` | Même film sans narration (musique + effets), pour une future voix-off |
| `scenes/scene1.mp4` … `scene7.mp4` | Les 7 compositions découpées une à une (version sans voix) |
| `assets/scenes/sN/*.png` | Ressources graphiques séparées : personnage/mains, doigts, pictogrammes 3D, écrans redressés |
| `audio/sfx/*.wav` | Les 19 effets sonores utilisés (tous synthétisés, sans échantillon tiers) |
| `audio/music.wav`, `audio/sfx_track.wav`, `audio/voix-off-calee.wav` | Pistes séparées du mixage |

## Projet source

- `index.html` + `js/core.js` + `js/main.js` : le moteur. Le rendu est piloté par le temps (`render(t)`), donc chaque image est déterministe.
- `js/scenes/s1.js` … `s7.js` : **une composition par scène** (calques, minutage, effets sonores).
- Ouvre `index.html` dans Chrome pour voir le film en boucle, ou `index.html?scene=3` pour une seule scène.

| Scène | Minutage | Ce qui bouge |
|---|---|---|
| 1. Le problème | 0–6 s | Lignes lumineuses qui se dessinent, personnage révélé par masque, téléphone qui vibre, flèches de données, croix rouge (pop + impulsion), « ? » dessiné, traits d'alerte, titre par groupes de mots |
| 2. Mises à jour | 6–12 s | Titre mot par mot, icône de mise à jour qui tourne puis s'arrête, interrupteur ON → OFF (devient rouge), tap, halo de confirmation |
| 3. Arrière-plan | 12–18 s | Titre typographique, téléphone révélé par masque, 3 interrupteurs qui passent en OFF, icônes qui s'atténuent, synchro qui s'arrête, indicateur de conso qui baisse |
| 4. Qualité vidéo | 18–24 s | Vidéo qui démarre, menu qui s'ouvre, sélection 1080p → 720p → 480p, cercle de confirmation, clap qui rebondit |
| 5. Sauvegardes | 24–30 s | Nuage assemblé pièce par pièce, flèches de synchro, pictogrammes de données qui montent, « Activée » → « Wi-Fi uniquement » (on garde les sauvegardes, mais on les contrôle) |
| 6. Consommation | 30–36 s | Jauge qui se dessine jusqu'à 12,8 Go / 20 Go, barres par appli, loupe numérique sur « Vidéos » |
| 7. Partage | 36–43 s | Cartes du guide qui s'assemblent, icône de partage construite à partir de 3 points, appui sur « Partager », onde lumineuse, particules, message final, logo |

Les transitions sont créées par les éléments des scènes : ligne lumineuse, ouverture depuis l'interrupteur OFF, ouverture depuis l'icône de synchro, barre 480p qui s'agrandit, iris sur la jauge, anneau de la jauge qui s'élargit.

## Refaire le film

```bash
python3 tools/layers.py                       # calques à partir des affiches + détourages
node tools/render.js events events.json       # liste des effets sonores calée sur l'animation
python3 tools/audio.py events.json audio      # effets, musique, voix-off recalée
node tools/render.js video film_video.mp4     # 1290 images -> vidéo
tools/mix.sh film_video.mp4 audio .           # mtn-data-tips.mp4 + mtn-data-tips-sans-voix.mp4
```

Les détourages (`assets/cutouts/`) viennent de `tools/segment.mjs` et `tools/segment_icons.mjs`, qui utilisent `@imgly/background-removal-node` hors ligne.

`v1/` contient la première version (diaporama animé), conservée pour référence.
