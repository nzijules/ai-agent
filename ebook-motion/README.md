# AROSOFT — Vibe Motion Design « Vendre des ebooks »

Vidéo publicitaire verticale (1080×1920, 30 fps, 64 s) réalisée avec [Remotion](https://remotion.dev).

- `src/scenes/` — les 9 scènes (accroche → problème → secret → 3 étapes → récap → transition → appel à l'action)
- `src/Composition.tsx` — timeline, logo AROSOFT en haut à droite, musique et effets sonores
- `public/music.wav`, `public/sfx-*.wav` — musique de fond et effets **originaux** générés par `scripts/make_audio.py` (libres de droits)
- `VOICEOVER_SCRIPT.md` — script voix-off minuté

## Commandes

```bash
npm i
npx remotion studio                      # aperçu / édition
npx remotion render EbookAd out/video.mp4
npx remotion render EbookAd out/video-vo.mp4 --props='{"voiceover":"voiceover.mp3"}'  # avec voix-off
python3 scripts/make_audio.py            # régénérer la musique
```
