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
