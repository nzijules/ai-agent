# L'architecte Claude : vidéo TikTok AroSoft

Vidéo verticale (1080×1920, 30 i/s, 1 min 34) qui explique Claude Code avec une analogie : Awa veut une maison et fait appel à un architecte. Elle se termine par un appel à l'action vers le guide « Réaliser le vibe motion design pas à pas avec Claude Code » (10 000 F).

Réalisée avec [Remotion](https://www.remotion.dev), aux couleurs d'AroSoft (bleu `#0A5BFF`, marine `#131C3A`, jaune `#FFC21A`, rouge `#E1262D`).

## Commandes

```bash
npm install
npx remotion studio            # aperçu et retouches
npx remotion render ArchitecteClaude out/architecte-claude.mp4
npx remotion still Couverture out/couverture.png   # image de couverture TikTok
```

L'image de couverture prête à l'emploi est dans `export/couverture-tiktok.png` (1080×1920). Le texte important reste dans la zone centrale 3:4, celle que TikTok garde dans la grille du profil.

## Où modifier quoi

- `src/Video.tsx` : ordre et durée de chaque scène (en secondes)
- `src/scenes.tsx` : les 11 scènes (textes, illustrations, animations)
- `src/ui.tsx` : mise en page commune, sous-titres karaoké, personnages
- `src/Cover.tsx` : image de couverture TikTok
- `src/theme.ts` : couleurs et polices
- `public/` : logos sans fond (versions claire et sombre), livre 3D détouré (`livre-3d.png`), polices Sora et Inter, musique
- `scripts/music.py` : génère la musique de fond originale (afro-house douce, 104 BPM) calée sur les scènes

```bash
python3 scripts/music.py public/musique.wav && ffmpeg -i public/musique.wav -b:a 192k public/musique.mp3
```

## Voix off

- `public/voix-accroche.mp3` : accroche TikTok (« Tu crois encore que l'IA, c'est pour les informaticiens ? Eh bien, non ! Reste jusqu'à la fin, je t'explique. »), scène `S0Hook`.
- `public/voix-off.mp3` : voix off ElevenLabs (voix « Tony », français avec un léger accent africain), qui démarre à 0,4 s.
- `src/words.ts` : horodatage mot par mot (transcription ElevenLabs Scribe). Les sous-titres karaoké l'utilisent.
- Dans `src/Video.tsx`, chaque scène commence sur le premier mot de son paragraphe. Si tu changes la voix, mets à jour `words.ts` et les durées de `SCENES`.
- `HAS_VOICE = false` donne une version sans voix, avec la musique plus forte.
