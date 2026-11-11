# L'architecte Claude : vidéo TikTok AroSoft

Vidéo verticale (1080×1920, 30 i/s, environ 1 min 26) qui explique Claude Code avec une analogie : Awa veut une maison et fait appel à un architecte. Elle se termine par un appel à l'action vers le guide « Réaliser le vibe motion design pas à pas avec Claude Code » (10 000 F).

Réalisée avec [Remotion](https://www.remotion.dev), aux couleurs d'AroSoft (bleu `#0A5BFF`, marine `#131C3A`, jaune `#FFC21A`, rouge `#E1262D`).

## Commandes

```bash
npm install
npx remotion studio            # aperçu et retouches
npx remotion render ArchitecteClaude out/architecte-claude.mp4
```

## Où modifier quoi

- `src/Video.tsx` : ordre et durée de chaque scène (en secondes)
- `src/scenes.tsx` : les 11 scènes (textes, illustrations, animations)
- `src/ui.tsx` : mise en page commune, sous-titres karaoké, personnages
- `src/theme.ts` : couleurs et polices
- `public/` : logo, couverture de l'ebook, polices Sora et Inter

La vidéo est muette pour l'instant. Pour ajouter la voix off, place un fichier `public/voix-off.mp3` et ajoute `<Audio src={staticFile('voix-off.mp3')} />` dans `src/Video.tsx`. Ajuste ensuite les durées des scènes pour suivre la voix.
