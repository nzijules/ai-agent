# Script voix-off — « Vibe Motion Design avec Claude Code »

Durée totale : **57 secondes** (version finale calée sur la voix Brian : 63,5 s) · Ton : énergique, chaleureux, tutoiement, débit dynamique.
Chaque bloc doit tenir dans sa fenêtre (les images sont calées dessus).

| # | Temps | Texte à lire |
|---|-------|--------------|
| 1 | 0:00 – 0:04 | Et si tu pouvais créer des vidéos animées… sans savoir monter, ni coder ? |
| 2 | 0:04 – 0:10 | Bienvenue dans le Vibe Motion Design. Tu décris… et l'IA anime. Zéro compétence requise. |
| 3 | 0:10 – 0:16 | Ton outil secret : Claude Code. Un assistant IA qui écrit le code de ta vidéo… à ta place. |
| 4 | 0:16 – 0:22 | Étape un : tu décris ta vidéo avec tes propres mots. Les couleurs, le texte, l'ambiance. |
| 5 | 0:22 – 0:28 | Étape deux : Claude crée tout seul les animations, les transitions et les effets spéciaux. |
| 6 | 0:28 – 0:34 | Étape trois : tu ajustes en discutant. Plus grand ! Plus rapide ! Plus de couleurs ! |
| 7 | 0:34 – 0:40 | Étape quatre : tu exportes en MP4, prêt pour TikTok, WhatsApp, Instagram et Facebook. |
| 8 | 0:40 – 0:46 | Zéro compétence. Zéro logiciel compliqué. Juste ton idée. Cette vidéo ? Faite exactement comme ça. |
| 9 | 0:46 – 0:57 | J'ai préparé un guide pratique et pas à pas pour toi. Télécharge-le maintenant à seulement dix mille francs… et fais ton premier montage aujourd'hui ! |

## Texte brut (à coller dans le générateur de voix)

Et si tu pouvais créer des vidéos animées… sans savoir monter, ni coder ?
Bienvenue dans le Vibe Motion Design. Tu décris… et l'IA anime. Zéro compétence requise.
Ton outil secret : Claude Code. Un assistant IA qui écrit le code de ta vidéo… à ta place.
Étape un : tu décris ta vidéo avec tes propres mots. Les couleurs, le texte, l'ambiance.
Étape deux : Claude crée tout seul les animations, les transitions et les effets spéciaux.
Étape trois : tu ajustes en discutant. Plus grand ! Plus rapide ! Plus de couleurs !
Étape quatre : tu exportes en MP4, prêt pour TikTok, WhatsApp, Instagram et Facebook.
Zéro compétence. Zéro logiciel compliqué. Juste ton idée. Cette vidéo ? Faite exactement comme ça.
J'ai préparé un guide pratique et pas à pas pour toi. Télécharge-le maintenant à seulement dix mille francs… et fais ton premier montage aujourd'hui !

## Intégrer la voix-off

1. Dépose le fichier dans `public/voiceover.mp3`
2. Dans `src/theme.ts`, mets `HAS_VOICEOVER = true` (la musique baisse automatiquement)
3. Rends la vidéo : `REMOTION_CHROME=<chemin chrome> npx remotion render VibeMotion out/vibe-motion-design.mp4`

## Version finale

Voix-off intégrée : `public/voiceover.mp3` (prix : 10.000F, 62,7 s). Scènes recalées sur les pauses de la voix (début des blocs : 0 / 4,8 / 12,1 / 18,1 / 24,5 / 30,9 / 37,9 / 44,7 / 52,4 s). Vidéo : 65,2 s.
