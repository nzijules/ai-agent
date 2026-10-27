# OHEL International — Publicité BTCS (Remotion)

Projet Remotion qui assemble et anime la publicité vidéo BTCS d'OHEL International :
15 s, 30 s et 60 s en 9:16, plus 60 s en 16:9, au format MP4 H.264 en 30 fps.

Remotion **anime** des médias, il n'en **génère** pas. Les photos, vidéos, voix off et musiques viennent de `public/assets/`.
Un média manquant est remplacé par un placeholder « À FOURNIR : … », jamais par un visuel inventé.

## Installation

```bash
npm install
```

Pré-requis : Node 18 ou plus récent. Remotion télécharge son navigateur headless au premier rendu.
Pour utiliser un Chromium local, définir `REMOTION_BROWSER=/chemin/vers/chrome`.

## Commandes

| Commande | Effet |
|---|---|
| `npm run studio` | Prévisualisation dans Remotion Studio. La prop `showSafeZones` affiche les zones de sécurité 9:16. |
| `npm run scan` | Inspecte `public/assets/` et `brand.ts`, puis régénère `MISSING_ASSETS.md`. |
| `npm run storyboard` | Régénère `STORYBOARD.md` et `voix-off/vo-15.txt`, `vo-30.txt` et `vo-60.txt` depuis `scripts.ts`. |
| `npm run check` | Vérifie le typage, la typographie française, la règle « une couche de texte par plan », l'absence de transition répétée, l'authenticité de la scène 5 et la durée d'affichage du numéro. |
| `npm run stills -- Ad15Vertical` | Exporte une capture par plan, avec les zones de sécurité, dans `out/stills/`. |
| `npm run render:draft -- Ad15Vertical` | Rend un brouillon filigrané « BROUILLON ». Les placeholders et le logo provisoire sont autorisés. |
| `npm run render:all` | Rend les 4 MP4 finaux dans `out/`. **Refusé** tant qu'un élément bloquant manque (voir ci-dessous). |

Compositions disponibles : `Ad15Vertical`, `Ad30Vertical`, `Ad60Vertical` et `Ad60Horizontal`.

## Où modifier quoi

- **`src/config/scripts.ts`** est la source unique des voix off, des titres, des durées, des transitions et des couches de texte.
  Toutes les frames sont calculées depuis ce fichier, donc changer un timing ne demande qu'une seule modification.
- **`src/config/brand.ts`** contient les couleurs, le numéro WhatsApp, l'offre, les services, les affirmations validées et les dimensions du bloc.
  Un champ vide n'est pas affiché. Une affirmation `validated: false` est soit remplacée par son plan de repli, soit bloque le rendu final.
- **`src/config/assets.ts`** liste les médias attendus, avec les indicateurs `authentique` et `ia`.
  Un visuel `ia` reçoit automatiquement la mention « Illustration non contractuelle ».
  La scène 5 n'accepte que des médias `authentique`.

## Ce qui bloque `render:all`

- Le logo officiel n'est pas fourni (`public/assets/brand/ohel-logo.svg` ou `.png` transparent).
- `brand.whatsapp` est vide.
- Pour les versions 30 et 60 s, des médias authentiques OHEL manquent (presse, élévation de murs, réalisations, joints).
- Une affirmation utilisée sans plan de repli n'est pas validée (par exemple le confort thermique).
- Une scène de la version n'est pas encore développée.

## Structure

```
src/
  config/       brand.ts, scripts.ts, assets.ts, formats.ts
  compositions/ AdComposition.tsx (TransitionSeries, voix off, musique avec ducking à -14 dB)
  scenes/       Scene1Hook, Scene2Btcs, Scene7Cta (les scènes 3 à 6 sont à venir)
  components/   BtcsBlockAnimation, KineticTitle, Subtitles, ShotText, ArchitecturalTransition,
                AssetMedia, Placeholder, SafeZoneOverlay, DraftWatermark, Sfx
  lib/          format (9:16 / 16:9, zones de sécurité), polices locales, résolution des assets
scripts/        scan-assets, storyboard, check, preflight, stills, render
public/assets/  brand/ realisations/ chantiers/ illustrations/ textures/ audio/
```

## Licence Remotion

Remotion est gratuit pour les particuliers et les entreprises de 3 personnes maximum. Au-delà, une
[licence entreprise](https://www.remotion.pro/license) est obligatoire.

**Entité détentrice du projet : à confirmer** (`brand.owner`). Si OHEL International, ou le prestataire qui
réalise les rendus, compte plus de 3 personnes, il faut acheter la licence **avant tout usage commercial**.
La musique doit elle aussi être sous licence commerciale autorisant la publicité sur Meta et TikTok.
