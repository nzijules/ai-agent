# Guide « Réaliser le vibe motion design pas à pas avec Claude Code » (AroSoft)

| Fichier | Contenu |
|---|---|
| `guide-vibe-motion-design-a-z.pdf` | Le guide de A à Z, 20 pages A4, couverture comprise |
| `index.html` | La source du guide (version web) |
| `pub-arosoft.mp4` | La vidéo d'exemple réalisée en suivant le guide (30 s, 1080×1920) |
| `projet-video/` | Le projet Remotion complet de la vidéo d'exemple |
| `img/` | Couverture, vraie capture du Studio Remotion, images extraites de la vidéo |
| `generer-pdf.js` | Régénère le PDF : `node generer-pdf.js` (Playwright + pdfunite) |

## Tests réellement effectués (7 novembre 2026)

- `npx create-video@latest --yes --blank projet-video` : projet créé (Remotion 4.0.541).
- Vérification TypeScript (`npx tsc --noEmit`) : aucune erreur.
- Rendu `npx remotion render src/index.ts PubAroSoft out/pub-arosoft.mp4` : réussi.
- Contrôle `ffprobe` : 30,0 s, 1080×1920, 30 images/s, vidéo H.264, audio AAC, 4,3 Mo.
- Volume mesuré (FFmpeg ebur128) : −16,4 LUFS intégré, crête −4,2 dBFS.
- Studio Remotion lancé et capturé (`img/studio-remotion.png`).

## Limites connues de l'exemple

- La voix-off d'exemple est une voix de synthèse gratuite (espeak-ng), utilisée seulement pour tester le montage.
- La musique et le son « pop » ont été composés par code avec FFmpeg : ils sont originaux, mais simples.
- Le rendu a été fait avec le Chromium déjà installé sur la machine de test (`--browser-executable`). Sur un ordinateur normal, Remotion télécharge son propre navigateur au premier rendu.
- Non testés ici : l'application de bureau Claude (étapes A et B, rédigées d'après la documentation officielle) et la commande `npx skills add remotion-dev/skills` (rédigée d'après la documentation Remotion).
