# MTN Côte d'Ivoire : vidéos de sensibilisation antifraude

**« Une seule action peut tout changer »**, motion design de 99 s destiné aux équipes Customer Services. Commanditaire : Forensic Services.

- `PREPRODUCTION.md` : storyboard, minutage de la voix-off, prompts vidéo, plan d'animation, liste des éléments graphiques, points à valider.
- `out/` : vidéos finales (avec et sans sous-titres) et fichier `sous-titres.srt`.
- `storyboard/` : vignettes des plans.
- `src/` : animation (Remotion / React). `src/timing.ts` contient tous les repères synchronisés sur la voix-off.
- `audio/` : musique et effets sonores (synthétisés, sans droits tiers), sous-titres, script de mixage.

Fabrication : voir la section 8 de `PREPRODUCTION.md`.

## Vidéo 2 : « La fraude à l'ère de l'IA » (Direction clientèle, ~74 s)

- `ia/PREPRODUCTION_IA.md` : texte de la voix-off, minutage, storyboard, prompts, animation, éléments, points à valider.
- `out/ia/` : vidéos (avec et sans sous-titres) et `sous-titres.srt`. Logo MTN en haut à droite pendant toute la vidéo.
- `src/ia/` : animation (composition Remotion `FraudeIA`), synchronisée sur `src/ia/vo_timing.json`.
- **Voix-off provisoire (voix témoin)** : à remplacer par la voix ElevenLabs définitive (texte : `ia/script_vo.txt`).

## Vidéo 3 : « La fraude à l'ère de l'IA », format mobile 9:16 (voix Brian, ~107 s, sans légende)

- `out/mobile/MTN-CI_La-fraude-a-l-ere-de-l-IA_mobile-9x16_V2.mp4` : **V2 « MTN Corporate & Cyber »** (version recommandée).
- `out/mobile/MTN-CI_La-fraude-a-l-ere-de-l-IA_mobile-9x16.mp4` : V1, conservée pour comparaison.
- `mobile/DA_V2_MTN_Corporate_Cyber.md` : storyboard V2, proposition par scène, palette et règles, animations, éléments réutilisés, liste des modifications.
- `mobile/storyboard_v2/` : vignettes V2 et planche de comparaison V1 / V2.
- Code : compositions Remotion `FraudeIAMobile` (V1) et `FraudeIAMobileV2` (`src/mobile/`).

## Vidéo carrée « La fraude à l'ère de l'IA » : rebranding Arosoft

- `out/carre/fraude-ia-arosoft-carre_fond-blanc.mp4` : 1080 × 1080, 49 s, fond blanc, typographie bleu Arosoft, logo Arosoft en couleur (version retenue).
- `out/carre/fraude-ia-arosoft-carre_fond-bleu.mp4` : variante sur fond dégradé bleu Arosoft.
- `carre/rebrand_arosoft.py` : recoloration image par image de la vidéo source (`carre/source_fraude-ia-mtn-carre.mp4`). Chaque pixel est décomposé en noir / jaune / blanc, puis recomposé aux couleurs Arosoft ; le logo MTN est remplacé par le logo Arosoft. Le son d'origine est conservé (il ne cite pas MTN).
- Logos Arosoft détourés : `public/arosoft-logo-*.png`.

## Vidéo 16:9 « La fraude à l'ère de l'IA » : version Arosoft

- `out/ia_arosoft/Arosoft_La-fraude-a-l-ere-de-l-IA_1080p_sans-sous-titres.mp4` et `…_sous-titres.mp4` (1920 × 1080, environ 72 s).
- `ia_arosoft/NOTE_AROSOFT.md` : identité visuelle, texte adapté, autres messages possibles.
- Composition Remotion `FraudeIAArosoft` (`src/ia/arosoft/`). Voix témoin provisoire, à remplacer par la voix ElevenLabs définitive.
