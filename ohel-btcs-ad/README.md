# OHEL International — publicité motion design BTCS

Projet Remotion de la publicité « La terre. La précision. Votre construction. »
Formats : **9:16** (1080 × 1920, principal) et **16:9** (1920 × 1080), chacun avec et sans sous-titres.

> **État actuel : maquette.** Le code est complet et rend une animatique avec une **voix off provisoire de synthèse**
> (`public/audio/voix-off-provisoire.wav`, Piper, voix française « siwis », licence CC-BY 4.0). La voix définitive,
> la musique et plusieurs visuels restent à fournir (voir `docs/04-ressources.md`). Le rendu en mode `final` est
> volontairement bloqué tant qu'il en manque, y compris tant que `AUDIO.voixOffProvisoire` vaut `true`.

## Documents

| Fichier | Contenu |
|---|---|
| `docs/01-proposition-creative.md` | Concept, système visuel, écarts éditoriaux |
| `docs/02-voix-off.md` | Texte final à enregistrer |
| `docs/03-storyboard.md` | Storyboard minuté scène par scène |
| `docs/04-ressources.md` | Ressources disponibles / manquantes / à valider |
| `docs/05-prompts-visuels.md` | Briefs photo et prompts des seuls visuels manquants |

## Démarrer

```bash
npm i
npm run dev          # Remotion Studio
```

Compositions :

| ID | Format | Sous-titres |
|---|---|---|
| `OHEL-BTCS-9x16` | 1080 × 1920 | non |
| `OHEL-BTCS-9x16-ST` | 1080 × 1920 | oui |
| `OHEL-BTCS-16x9` | 1920 × 1080 | non |
| `OHEL-BTCS-16x9-ST` | 1920 × 1080 | oui |
| `Scene-A` … `Scene-H` | 1080 × 1920 | — (scènes isolées) |

Props (modifiables dans le Studio) : `sousTitres`, `mode` (`maquette` | `final`), `zonesSecurite` (affiche les zones masquées par les interfaces).

## Rendre

```bash
# Animatique de contrôle (demi-résolution)
npx remotion render OHEL-BTCS-9x16-ST out/maquette.mp4 --scale=0.5

# Versions finales (échouent tant qu'un élément obligatoire manque)
npx remotion render OHEL-BTCS-9x16    out/OHEL-BTCS-9x16.mp4    --props='{"sousTitres":false,"mode":"final","zonesSecurite":false}'
npx remotion render OHEL-BTCS-9x16-ST out/OHEL-BTCS-9x16-ST.mp4 --props='{"sousTitres":true,"mode":"final","zonesSecurite":false}'
npx remotion render OHEL-BTCS-16x9    out/OHEL-BTCS-16x9.mp4    --props='{"sousTitres":false,"mode":"final","zonesSecurite":false}'
npx remotion render OHEL-BTCS-16x9-ST out/OHEL-BTCS-16x9-ST.mp4 --props='{"sousTitres":true,"mode":"final","zonesSecurite":false}'

# Images de contrôle à des instants donnés (secondes)
node scripts/apercus.mjs OHEL-BTCS-9x16 1.5,21,44,88
```

## Remplacer les éléments

Tout se règle dans trois fichiers, sans toucher aux scènes :

- `src/config/assets.ts` : visuels (`MEDIA`), textures matières (`TEXTURES`), logo (`LOGO`), voix off, musique et effets (`AUDIO`).
  Chaque visuel a une `nature` : `photo-ohel`, `photo` ou `illustration` (cette dernière affiche « Illustration non contractuelle »).
  Si `src` vaut `null`, la scène utilise son schéma animé (mention « Illustration schématique »).
- `src/config/brand.ts` : couleurs, police, contacts (`CONTACT`), signature.
- `src/config/script.ts` : voix off, sous-titres, minutage, textes à l'écran (`ECRAN`).

## Recaler le minutage après l'enregistrement de la voix off

1. Déposer la voix dans `public/audio/voix-off.wav`, renseigner `AUDIO.voixOff = "audio/voix-off.wav"` et passer
   `AUDIO.voixOffProvisoire` à `false`.
2. Dans `src/config/script.ts`, pour chaque scène : ajuster `duree` (s) et les instants `de` / `a` de chaque réplique
   (relatifs au début de la scène). La durée totale et les sous-titres se recalculent.
3. Les animations sont calées en secondes relatives dans chaque scène (`src/scenes/SceneX.tsx`, appels `prog(…, de, duree)`
   et `<Reveal de={…}>`) : les décaler si une phrase bouge nettement.
4. Ne jamais accélérer la voix : allonger la scène.

Repères son (temps absolus avec le minutage actuel, calé sur la voix provisoire) : impact du bloc 0,45 s ·
versements 20,4 / 25,6 / 29,2 s · **impact de compression 46,17 s** (`IMPACT_E` dans `SceneE.tsx`) · début de cure 55,4 s ·
carton final 87,8 s (`CARTON_H` dans `SceneH.tsx`).
Les effets se déclarent dans `AUDIO.effets` (`{ src, t, volume }`).

## Structure

```
src/
  config/      brand.ts · assets.ts · script.ts
  components/  anim, textures procédurales, Block (bloc 3D / face), BlockWipe (transition), Presse (schéma), ui, overlays
  scenes/      SceneA … SceneH
  OhelBtcsAd.tsx   assemblage, audio, sous-titres, contrôle du mode final
  Root.tsx         compositions
public/
  images/  fonts/  audio/
```
