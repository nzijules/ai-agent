# Rapport de vérification technique et éditoriale — Novembre Bleu (AroSoft)

Date : 7 novembre 2026 · Version : animatique v1 (placeholders + musique provisoire)

## 1. Audit de l'environnement

| Élément | Résultat |
|---|---|
| Node.js / npm | 22.23 / 10.9 |
| Remotion | 4.0.541 (`remotion`, `@remotion/cli`, `@remotion/media`, `@remotion/fonts`, `@remotion/paths`) |
| FFmpeg / ffprobe | disponibles (`/usr/bin`) : mesure de la VO, mastering, contrôle des rendus |
| Navigateur de rendu | chrome-headless-shell local (le CDN Remotion n'est pas joignable depuis cet environnement) |
| Python | numpy + Pillow (musique provisoire, logo) |
| Transcription automatique (Whisper) | **indisponible** : modèles hébergés sur HuggingFace, non joignables. Alignement réalisé par détection de silences + script validé (voir §3) |
| Polices | Montserrat ExtraBold / Inter embarquées localement (WOFF2, SIL OFL) : pas de dépendance réseau au rendu |

## 2. Résultats des vérifications automatiques (`npm run verify`)

- ✔ Sous-titres = texte intégral du script validé (aucun mot modifié, ordre respecté)
- ✔ Composition : 2700 frames @ 30 fps ; somme des scènes = 2700 frames ; scènes contiguës
- ✔ Durée minimale de scène ≥ 3 s (min. 3,33 s, S03)
- ✔ Segments de voix-off sans chevauchement (timeline et fichier source) ; chaque phrase est contenue dans sa scène
- ✔ Voix-off terminée 1,77 s avant la fin (queue musicale + end card)
- ✔ 37 sous-titres sans chevauchement, ≤ 84 caractères
- ✔ Aucune promesse de guérison, ni dépistage annuel ou obligatoire, ni statistique chiffrée à l'écran
- ✔ Fichiers rendus : voir §6

## 3. Voix-off et timing

**Mesure.** Le fichier fourni dure **74,95 s**. La détection de silences (ffmpeg `silencedetect`, -38 dB / 180 ms)
découpe 43 segments de parole, associés un à un aux phrases du script. Les bornes de chaque phrase sont
dans `src/data/timeline.ts` (colonne « Source » de `docs/TIMELINE.md`).

**Conclusion : la voix-off tient naturellement dans 90 s.** Aucune coupe n'est nécessaire. Les 15 s
disponibles ont été réparties en respirations musicales entre les phrases (0,35 à 1,6 s), avec une
intro de 1,4 s et une queue de 1,77 s, pour aligner chaque scène sur ses mots. Le débit et le texte de
la voix ne sont pas modifiés (aucun étirement temporel).

**Écart avec le storyboard initial (6 s par scène).** Les plages ont été ajustées sur la parole réelle
(voir `docs/TIMELINE.md`) : les scènes 1 à 7 durent de 3,3 à 5,6 s (phrases courtes), les scènes 10 à 12
durent de 8 à 10 s (phrases longues sur le PSA), et l'end card dure 10,5 s.
Les scènes longues contiennent plusieurs temps visuels (S10 : dépistage adapté → tube → PSA ;
S11 : PSA ≠ diagnostic → détection précoce ; S12 : détection précoce → « Parlez-en »).

**Texte de voix-off : point à arbitrer.** Le brief contient deux versions du texte :
- le bloc « VOIX-OFF » répète la fin (« Alors, n'attendez pas… » → « …sa santé. ») puis ajoute
  « AroSoft… La technologie au service de l'humain. » ;
- le « Script intégral » ne contient pas la répétition ni la phrase AroSoft.

Le **fichier audio fourni** contient le script intégral **une seule fois, suivi de la phrase AroSoft**.
Le film suit donc l'audio fourni : la répétition du bloc est traitée comme un doublon de copier-coller.
→ **À confirmer.**

**Limites de cette vérification.** L'alignement par silences a été recoupé par la durée relative de
chaque phrase, mais l'audio n'a pas pu être écouté ni transcrit automatiquement dans cet environnement.
Il faut donc faire **un contrôle à l'écoute** de la synchro des sous-titres et de la conformité mot à mot
de la voix au script. Le timbre (« voix masculine ivoirienne, grave et chaleureuse ») est à valider
par l'équipe : le fichier fourni est utilisé tel quel.

## 4. Mixage audio

| Piste | Niveau / traitement |
|---|---|
| Voix-off | volume 1, phrases replacées individuellement |
| Musique (provisoire) | 0,55 hors narration → **0,20 sous la narration** (ducking automatique, rampes de 8 à 12 frames) |
| Transitions | 0,7 : souffles filtrés à chaque coupe, scintillements sur le ruban (S05), le retour de la lumière (S13) et l'end card (S15) |
| Master | deux passes `loudnorm` + limiteur : **-14 LUFS intégrés, crête ≤ -1,4 dBFS** (`scripts/master.sh`) |

Mesure sur la preview (avant mastering) : parole ≈ -23 dB RMS, musique seule entre les phrases ≈ -30 dB RMS.
La voix reste nettement au-dessus de la musique.

## 5. Exactitude médicale : contrôle du texte à l'écran

| Exigence | Mise en œuvre |
|---|---|
| Peut être asymptomatique au début | S07 « PARFOIS, AUCUN SYMPTÔME » ; S06 : la zone périphérique s'illumine discrètement sans signe extérieur |
| PSA ≠ diagnostic | S11 « PSA ≠ DIAGNOSTIC » + « Ce test seul ne permet pas de poser un diagnostic. Un résultat s'interprète avec un professionnel de santé ; d'autres examens peuvent être nécessaires. » |
| Décision individualisée | S09 « Parlez de votre risque avec un professionnel de santé » ; S10 « Selon votre situation / UN DÉPISTAGE ADAPTÉ / Proposé, si besoin, par un professionnel de santé » |
| Pas de promesse de guérison | S12 : « Des possibilités de traitement souvent meilleures » (reprend « souvent » de la VO) |
| Pas de dépistage annuel universel | Aucune mention de fréquence ni d'obligation |
| Symptômes urinaires non présentés comme spécifiques | Aucun symptôme n'est listé |
| Pas de statistique non sourcée | « des milliers d'hommes » reste dans la voix-off (texte validé) ; aucun chiffre à l'écran. La courbe âge/risque de S08 est **qualitative** (légende « représentation qualitative ») |
| 45 ans | S09 « DÈS 45 ANS, PARLONS-EN » (texte du storyboard) + sous-titre « Parlez de votre risque avec un professionnel de santé » (choix éditorial du brief) |
| « n'attendez pas forcément » | S12 « PARLEZ-EN / sans attendre forcément les premiers symptômes » : la nuance « forcément » est conservée |
| Schéma anatomique (S06) | Coupe sagittale simplifiée : prostate sous la vessie, autour de l'urètre ; rectum en arrière ; symphyse pubienne en avant ; vésicules séminales en arrière de la vessie, au-dessus de la prostate. Légendes : Vessie, Prostate, Urètre, Rectum. Mention « schéma simplifié » |
| PSA | « Antigène prostatique spécifique » · « Dosage par une prise de sang » |

**Points à soumettre au validateur médical :**
1. Le schéma S06 (proportions, mise en évidence de la zone périphérique).
2. La formulation S11 sur les examens complémentaires.
3. Le titre « DÈS 45 ANS, PARLONS-EN » au regard des recommandations nationales (publication du ministère de la Santé du 19/02/2026 citée dans le brief) et internationales (ACS : discussion à 50 ans pour un risque moyen, 45 ans pour un risque accru).
4. La mention « des milliers d'hommes » (VO) : il faut une source épidémiologique ivoirienne à joindre au dossier de diffusion.

**➡ VALIDATION MÉDICALE OBLIGATOIRE AVANT DIFFUSION.**

## 6. Rendus et contrôle technique

| Fichier | Format | Contrôle |
|---|---|---|
| `out/preview-S01-S03-15s.mp4` | 1080x1920, H.264, 30 fps, AAC | 450 frames, 15,02 s ✔ |
| `out/novembre-bleu-1080x1920.mp4` | 1080x1920, H.264 (CRF 18, yuv420p), 30 fps, AAC 192 kb/s | **2700 frames** ✔ · -14,2 LUFS · crête -1,4 dBFS · 136 Mo |
| `out/novembre-bleu-1920x1080.mp4` | 1920x1080, idem, mise en page recomposée | **2700 frames** ✔ · -14,2 LUFS · crête -1,4 dBFS · 142 Mo |
| `out/novembre-bleu.fr.srt` | SRT UTF-8, 37 repères | dérivé de la même timeline que la piste incrustée ✔ |

La durée du conteneur indiquée par ffprobe est de 90,10 s : ce sont les ~0,1 s de remplissage de fin de trame AAC. La piste vidéo fait exactement 2700 frames, soit 90,000 s.
Les fichiers sont lourds (CRF 18, grain) : pour un envoi mobile, une version allégée peut être réencodée avec `ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset slow -c:a copy out.mp4`.

Contrôle visuel : 2 images de contrôle par scène et par format (`npm run stills`) ont été examinées.

- Textes : rien n'est coupé, la typographie reste dans les marges de sécurité.
- Marges du vertical : 250 px en haut, 430 px en bas pour les titres ; sous-titres à 330 px du bas, au-dessus des interfaces Reels / TikTok / Shorts.
- Logo : en haut à droite dans la zone sûre.
- Aucune image déformée : il n'y a que du vectoriel, et les médias réels seront affichés en `object-fit: cover`.

Recomposition horizontale :
- titres en colonne gauche, personnages à droite ;
- ruban et texte côte à côte ;
- schéma anatomique avec texte explicatif.

Corrections faites pendant la vérification :
- personnages masqués par le titre en S09 (horizontal) ;
- contraste du texte doré en S12 ;
- chevauchement de la courbe et de l'arbre familial en S08 ;
- vésicules séminales repositionnées en S06 ;
- famille assise derrière la table en S02.

## 7. Transitions et motion design

- **Transitions d'entrée** (`LightTransition`) : iris, balayage diagonal, éclat lumineux, montée masquée et fondu, toutes à 14 frames avec chevauchement. Pas de coupe sèche involontaire. Le match cut circulaire de S02 (tasse → montre → halo) est voulu, avec un flash doux.
- **Caméra virtuelle** (`CinematicCamera`) : push-in et dérive sur chaque plan.
- **Parallaxe 2.5D** (`ParallaxScene`) : 4 à 7 calques avec flou de profondeur.
- **Typographie cinétique** (`KineticHeadline`) : masque animé mot à mot avec flou de bougé proportionnel à la vitesse.
- **Atmosphère** : grain animé, vignette, bokeh, rayons de lumière.

## 8. Reste à faire avant diffusion

1. Remplacer les placeholders par les prises de vue réelles (`docs/MEDIAS.md`), puis refaire un contrôle visuel des cadrages en vertical et en horizontal.
2. Remplacer la musique provisoire par la musique originale. Le ducking reste automatique.
3. Fournir le logo institutionnel et valider la variante « reverse » du logo AroSoft (idéalement fournir un SVG officiel).
4. Confirmer le texte final de la VO (§3) et faire un contrôle à l'écoute de la synchro.
5. Obtenir la validation médicale (§5).
6. Rendre en version finale avec `showPlaceholderTags=false` uniquement quand tous les médias sont en place.
