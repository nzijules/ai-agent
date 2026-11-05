# Script voix-off — « Vendre des ebooks sans montrer son visage »

**Durée :** 64 s · **Format :** vertical 9:16 (TikTok / Reels / Meta Ads)
**Ton :** énergique, confiant, proche (tutoiement), rythme rapide mais articulé.
**Conseil pour la génération :** une seule prise en MP3, débit ≈ 150 mots/min. Laisse une petite pause sur chaque « … ».

| Temps | Scène à l'écran | Texte à dire |
|---|---|---|
| 0:00 – 0:05 | « VENDRE DES EBOOKS » → visage barré → tampon « 0 COMPÉTENCE » | Et si tu pouvais vendre des ebooks… sans montrer ton visage, et sans aucune compétence ? |
| 0:05 – 0:11 | Pas de caméra / design / code → « IMPOSSIBLE ? » → « DÉTROMPE-TOI. » | Pas de caméra. Pas de design. Pas de code. Tu penses que c'est impossible ? Détrompe-toi. |
| 0:11 – 0:18 | « LE SECRET : VIBE MOTION DESIGN » + téléphone animé | Le secret, c'est le Vibe Motion Design : des vidéos animées qui captent l'attention… et qui vendent pour toi. |
| 0:18 – 0:27 | ÉTAPE 01 – terminal Claude Code qui écrit l'ebook et crée les vidéos | Étape 1 : tu demandes à Claude Code d'écrire ton ebook, puis de créer tes vidéos animées. Tu décris… il crée. |
| 0:27 – 0:35 | ÉTAPE 02 – Meta Ads & TikTok Ads, radar de ciblage | Étape 2 : tu lances tes vidéos en publicité sur Meta Ads et TikTok Ads, et tu cibles exactement les bonnes personnes. |
| 0:35 – 0:43 | ÉTAPE 03 – notifications « Nouvelle vente ! », silhouette dans l'ombre | Étape 3 : les clients achètent, les notifications tombent… pendant que toi, tu restes dans l'ombre. |
| 0:43 – 0:48 | « ZÉRO VISAGE. ZÉRO COMPÉTENCE. » + Claude Code + Offre + Pub | Zéro visage. Zéro compétence. Juste Claude Code, une bonne offre… et la pub. |
| 0:48 – 0:52 | « Et maintenant… C'EST TON TOUR. » (montée musicale) | Et maintenant… c'est ton tour. |
| 0:52 – 1:04 | Guide AROSOFT + « SEULEMENT 10.000F » + bouton « TÉLÉCHARGE MAINTENANT » | J'ai préparé un guide pratique et pas à pas pour toi. Télécharge-le maintenant à seulement dix mille francs, et commence à écrire et vendre ton premier ebook aujourd'hui ! |

## Texte brut (à copier dans ton générateur de voix)

Et si tu pouvais vendre des ebooks… sans montrer ton visage, et sans aucune compétence ?

Pas de caméra. Pas de design. Pas de code. Tu penses que c'est impossible ? Détrompe-toi.

Le secret, c'est le Vibe Motion Design : des vidéos animées qui captent l'attention… et qui vendent pour toi.

Étape 1 : tu demandes à Claude Code d'écrire ton ebook, puis de créer tes vidéos animées. Tu décris… il crée.

Étape 2 : tu lances tes vidéos en publicité sur Meta Ads et TikTok Ads, et tu cibles exactement les bonnes personnes.

Étape 3 : les clients achètent, les notifications tombent… pendant que toi, tu restes dans l'ombre.

Zéro visage. Zéro compétence. Juste Claude Code, une bonne offre… et la pub.

Et maintenant… c'est ton tour.

J'ai préparé un guide pratique et pas à pas pour toi. Télécharge-le maintenant à seulement dix mille francs, et commence à écrire et vendre ton premier ebook aujourd'hui !

> « 10.000F » est écrit « dix mille francs » pour que la voix de synthèse le prononce correctement.

## Intégrer la voix-off

1. Mets ton fichier dans `ebook-motion/public/voiceover.mp3`.
2. Rends la vidéo avec la voix (la musique baisse automatiquement) :
   ```bash
   npx remotion render EbookAd out/arosoft-ebook-vibe-motion-vo.mp4 --props='{"voiceover":"voiceover.mp3"}'
   ```
   Ou envoie-moi le MP3 : je l'intègre et je recale les scènes sur ta voix.
