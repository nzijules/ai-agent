# Voix-off — « Claude en mouvement »

Durée totale : environ 62 s, calée sur les scènes de `claude-motion.html`.
Ton : chaleureux, posé, complice. Rythme : environ 2,5 mots par seconde, avec de vraies pauses aux « … ».

| Scène | Timecode | Texte |
|---|---|---|
| 1. Intro | 0:00 – 0:06 | Claude. Une seule intelligence… et trois façons de travailler avec elle : penser, construire, imaginer. |
| 2. Claude | 0:06 – 0:19 | D'abord, Claude : l'assistant qui pense avec vous. Envoyez-lui un contrat de trente pages… il repère en quelques secondes les clauses à risque. Emails, analyses, traductions : il réfléchit à vos côtés. |
| 3. Claude Code | 0:19 – 0:33 | Ensuite, Claude Code : l'agent qui code dans votre terminal. Vous dites : « ajoute un mode sombre ». Il explore le projet, modifie les fichiers, lance les tests… et pousse le commit. Vous, vous gardez la main. |
| 4. Claude Design | 0:33 – 0:46 | Enfin, Claude Design : du prompt au visuel. Décrivez une affiche de concert au coucher du soleil… et regardez-la prendre forme. Slides, maquettes, visuels de marque : vous ajustez, vous exportez. |
| 5. Récap | 0:46 – 0:56 | Penser. Construire. Imaginer. Trois outils, une seule intelligence. Et vous… par lequel allez-vous commencer ? |
| 6. Abonnement | 0:57 – 1:01 | Je t'instruirai chaque jour sur cette page. Abonne-toi pour ne rien manquer ! |

## Version courte (format Reels / TikTok, environ 20 s)

> Claude, c'est trois outils. Claude pense avec vous : il lit, rédige, analyse. Claude Code code pour vous : il modifie, teste et livre. Claude Design imagine avec vous : du prompt à l'affiche en quelques secondes. Et vous, par lequel allez-vous commencer ?

## Vidéo MP4

`video/claude-en-mouvement.mp4` : 1920×1080, 30 images/s, 62,3 s, voix « Sébastien » (ElevenLabs, eleven_v4).
Les clips bruts sont dans `video/audio/`. Pour refaire le rendu :

```bash
node video/render.js "$PWD/claude-motion.html" video/silencieux.mp4 8400,12800,14000,13500,13600 30
```

Ensuite, ajouter l'audio avec ffmpeg : chaque clip est placé 0,5 s après le début de sa scène (0,5 / 8,9 / 21,7 / 35,7 / 49,2 s), et la phrase d'abonnement à 57,0 s.
