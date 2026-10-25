# Script intégral de la voix off (≈ 40 s)

**Ton** : voix française naturelle, chaleureuse, posée et rassurante — un parent qui parle à un autre parent. Débit ≈ 150 mots/min, sourire dans la voix sur l’offre et le CTA. Prononcer « dix mille francs CFA ».

| Temps | Scène | Texte |
|---|---|---|
| 0,3 – 4,7 s | Accroche | Votre enfant utilise ChatGPT… *(courte pause)* mais apprend-il **vraiment** ? |
| 5,2 – 10,8 s | Problème | Devoirs, leçons mal comprises, réponses copiées sans réflexion… *(pause)* Obtenir une réponse ne signifie pas comprendre. |
| 11,3 – 17,8 s | Solution | Découvrez « Apprendre à apprendre avec ChatGPT », le guide qui en fait un véritable tuteur pédagogique. |
| 18,3 – 28,8 s | Bénéfices | Aidez votre enfant à comprendre ses leçons, à réviser intelligemment, à développer son autonomie… et accompagnez ses progrès, de la 6e à la Terminale. |
| 29,4 – 34,7 s | Offre | Le guide pratique des parents, pour seulement dix mille francs CFA. |
| 35,1 – 39,8 s | CTA | Donnez à votre enfant une meilleure méthode pour apprendre. Commandez votre exemplaire dès aujourd’hui. |

Texte brut (à coller dans un moteur de synthèse vocale ou à lire au micro) :

> Votre enfant utilise ChatGPT… mais apprend-il vraiment ?
> Devoirs, leçons mal comprises, réponses copiées sans réflexion… Obtenir une réponse ne signifie pas comprendre.
> Découvrez « Apprendre à apprendre avec ChatGPT », le guide qui en fait un véritable tuteur pédagogique.
> Aidez votre enfant à comprendre ses leçons, à réviser intelligemment, à développer son autonomie… et accompagnez ses progrès, de la sixième à la terminale.
> Le guide pratique des parents, pour seulement dix mille francs CFA.
> Donnez à votre enfant une meilleure méthode pour apprendre. Commandez votre exemplaire dès aujourd’hui.

## Voix off actuelle

Générée avec ElevenLabs (voix « Sylvestre – calme et chaleureux », français standard). Fichier brut : `public/audio/voiceover-source.mp3` (35 s).
`scripts/assemble-voiceover.mjs` le découpe phrase par phrase (aux pauses) et place chaque phrase sur son animation, puis normalise le volume → `public/audio/voiceover.mp3` (40 s).

## Intégrer une nouvelle voix off

1. Enregistrez ou générez la voix (MP3, 44,1 kHz, ~40 s, en respectant les temps ci-dessus).
2. Déposez le fichier sous `public/audio/voiceover-source.mp3`, ajustez les découpes `src` de `scripts/assemble-voiceover.mjs` (début/fin de chaque phrase dans la voix brute), puis `node scripts/assemble-voiceover.mjs`.
3. Si les temps diffèrent, ajustez `src/captions.ts` puis `npm run audio` (régénère `docs/sous-titres.srt`).
4. `npm run render:vertical-vo` et `npm run render:square-vo` → la musique est automatiquement baissée sous la voix et les sous-titres animés sont incrustés.

Les sous-titres seuls (fichier séparé pour Facebook / YouTube) : `docs/sous-titres.srt`.
