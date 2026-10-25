# Script intégral de la voix off (50 s)

**Ton** : voix française naturelle, chaleureuse et rassurante, comme un parent qui parle à un autre parent. Débit posé (environ 150 mots/min), sourire dans la voix sur l'offre. Prononcer « dix mille francs CFA ».

| Temps | Scène | Texte |
|---|---|---|
| 0,2 – 5,8 s | 1 · Coût du soutien scolaire | Chaque mois, vous payez des cours de répétition. *(pause)* Mais votre enfant progresse-t-il vraiment ? |
| 6,2 – 11,7 s | 2 · Difficultés du parent | Et entre votre travail, vos responsabilités et les devoirs… difficile de tout suivre. |
| 12,3 – 18,6 s | 3 · Solution | Découvrez « Apprendre à apprendre avec ChatGPT », le guide pratique pour accompagner autrement votre enfant. |
| 19,3 – 26,0 s | 4 · Quiz | Apprenez à créer des quiz interactifs et chronométrés pour l'aider à s'entraîner et vérifier ses connaissances. |
| 28,3 – 33,5 s | 5 · Rapports d'activité | Et grâce aux rapports d'activité, suivez son travail, ses difficultés et ses progrès. |
| 36,3 – 41,7 s | 6 · Bénéfices | Moins de dépenses inutiles, plus de visibilité, et un enfant qui apprend à devenir autonome. |
| 42,3 – 49,8 s | 7 · Offre | « Apprendre à apprendre avec ChatGPT ». Votre guide pratique, à seulement dix mille francs CFA. Commandez maintenant ! |

Texte brut à coller dans ElevenLabs ou à lire au micro. Gardez un **saut de ligne entre les paragraphes** : les pauses servent au calage automatique.

> Chaque mois, vous payez des cours de répétition. Mais votre enfant progresse-t-il vraiment ?
>
> Et entre votre travail, vos responsabilités et les devoirs… difficile de tout suivre.
>
> Découvrez « Apprendre à apprendre avec ChatGPT », le guide pratique pour accompagner autrement votre enfant.
>
> Apprenez à créer des quiz interactifs et chronométrés pour l'aider à s'entraîner et vérifier ses connaissances.
>
> Et grâce aux rapports d'activité, suivez son travail, ses difficultés et ses progrès.
>
> Moins de dépenses inutiles, plus de visibilité, et un enfant qui apprend à devenir autonome.
>
> « Apprendre à apprendre avec ChatGPT ». Votre guide pratique, à seulement dix mille francs CFA. Commandez maintenant !

Voix utilisée jusqu'ici : ElevenLabs « Sylvestre – calme et chaleureux » (français standard).

## Intégrer la voix off

1. Déposez le MP3 brut, lu d'une traite, sous `public/audio/voiceover-source.mp3`.
2. `npm run voiceover` : le script détecte les pauses, découpe la voix en 16 répliques (celles de `src/captions.ts`), place chaque réplique sur son animation, normalise le volume et écrit `public/audio/voiceover.mp3`. Il affiche le minutage et signale toute réplique qui déborde sur la suivante.
   - Si le nombre de segments ne correspond pas, essayez `node scripts/assemble-voiceover.mjs -38 0.12` (pause minimale plus courte).
   - Si une réplique déborde, avancez son `start` dans `src/captions.ts` (ou celui de la suivante), puis relancez.
3. `npm run audio` régénère `docs/sous-titres.srt` à partir de `src/captions.ts`.
4. `npm run render:vertical-vo` et `npm run render:square-vo` : la musique est automatiquement baissée sous la voix et les sous-titres animés sont incrustés.
