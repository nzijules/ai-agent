# Publicité motion design — « Apprendre à apprendre avec ChatGPT »

Projet Remotion (React + TypeScript) qui produit la publicité vidéo de l'ebook de Jules N'ZI.

| Livrable | Fichier |
|---|---|
| Vertical 1080×1920, 30 fps, avec voix off + sous-titres animés | `exports/pub-controle-verticale-1080x1920-voix-off.mp4` |
| Vertical 1080×1920, sans voix off (musique + SFX) | `exports/pub-controle-verticale-1080x1920-sans-voix.mp4` |
| Carré 1080×1080, avec voix off + sous-titres | `exports/pub-controle-carree-1080x1080-voix-off.mp4` |
| Carré 1080×1080, sans voix off | `exports/pub-controle-carree-1080x1080-sans-voix.mp4` |
| Sous-titres (à importer sur les plateformes) | `exports/sous-titres-controle.srt` |
| Script intégral de la voix off | [`voiceover/SCRIPT.md`](voiceover/SCRIPT.md) |
| Storyboard et direction artistique | [`STORYBOARD.md`](STORYBOARD.md) |

Durée : **≈ 1 min 10** — calée sur la voix off, sans blancs entre les phrases (`scripts/retime.py`). Codec : H.264 + AAC.

---

## 1. Installation et prévisualisation

```bash
npm i
npm run dev          # ouvre Remotion Studio (aperçu image par image, chaque scène est aussi une composition)
```

Rendu des vidéos :

```bash
npm run render:all   # les 4 MP4 dans exports/
# ou une seule : npm run render:vertical | render:vertical-sans-voix | render:carre | render:carre-sans-voix
```

> Dans un conteneur sans Chrome téléchargeable, indiquer un Chromium local :
> `REMOTION_BROWSER_EXECUTABLE=/chemin/vers/chrome-headless-shell npm run render:all`

## 2. Modifier le prix, le CTA, le contact

Tout est centralisé dans **`src/ad.config.json`** :

```json
{
  "price": "3 000 FCFA",              // affiché à l'écran (scène Offre + sous-titres)
  "priceSpoken": "trois mille francs CFA", // lu par la voix off (en toutes lettres)
  "ctaLabel": "Commandez votre exemplaire",
  "contactLabel": "WhatsApp",
  "contactValue": "+225 00 00 00 00 00",  // ← à remplacer par votre numéro ou un lien court
  "linkLabel": "Lien en bio",
  "coverMode": "vector",                // "vector" ou "official"
  ...
}
```

Après un changement de **prix**, régénérez la voix off (étape 4) puis relancez `npm run render:all`.
Pour un changement purement visuel (CTA, contact), relancez seulement le rendu.

## 3. Remplacer la couverture

- `coverMode: "vector"` (par défaut) : couverture provisoire reconstruite en code (`src/components/Cover.tsx`), **sans logo ChatGPT/OpenAI**.
- `coverMode: "official"` : utilise l'image `public/images/couverture-officielle.jpg` (format 2:3, ex. 1024×1536).
  Remplacez simplement ce fichier par votre couverture définitive.

⚠️ Votre couverture actuelle contient le logo OpenAI. Pour la publicité, il est recommandé de le retirer
(ou de garder `coverMode: "vector"`) afin de ne pas suggérer un partenariat officiel — c'est aussi une
exigence fréquente des régies publicitaires (Meta, TikTok).

La photo parent/enfant est `public/images/parent-enfant.jpg` (extraite de vos visuels) — remplaçable à l'identique.

## 4. Modifier les textes / la voix off

- **Textes à l'écran** : dans chaque scène `src/scenes/S*.tsx` (les textes sont en clair dans le JSX).
  Dans `KineticText`, les mots entre `*astérisques*` sont surlignés en jaune.
- **Voix off et sous-titres** : `voiceover/script.json` (`text` = sous-titre, `spoken` = texte prononcé,
  `start` = seconde de départ). Puis :

```bash
pip install piper-tts
# voix française « siwis » (CC-BY 4.0) : https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-fr-siwis-medium.tar.gz
python3 scripts/generate_voiceover.py --model /chemin/fr-siwis-medium.onnx
```

Le script affiche un avertissement `OVERLAP` si une réplique déborde sur la suivante.
Il régénère `public/audio/vo/*.wav`, `src/generated/voiceover.json` (synchro + sous-titres animés) et `exports/sous-titres-controle.srt`.

**Voix actuelle** : l'enregistrement fourni (`voiceover/original/voix-off.mp3`), découpé automatiquement en 22 répliques par
`scripts/split_voiceover.py` (alignement MFCC/DTW sur la version Piper du même texte + coupe sur les pauses).
Pour un nouvel enregistrement continu : remplacez ce fichier, lancez `python3 scripts/split_voiceover.py` (nécessite `pip install librosa`
et les clips Piper de référence), puis `npm run render:vertical && npm run render:carre`.

**Autre voix pro** : pour une voix plus naturelle (ElevenLabs, comédien voix…), enregistrez une réplique par
fichier `public/audio/vo/l01.wav … l22.wav` en respectant les créneaux de `script.json`, puis mettez à jour
les durées dans `src/generated/voiceover.json`.

## 5. Modifier le minutage

Le montage suit la voix off : `scripts/retime.py` enchaîne les répliques sans blanc (pause de 0,22 s dans une scène,
~0,7 s aux changements de scène) et écrit `src/generated/timeline.json` (bornes des scènes, durée totale).
Animations et effets sonores sont ancrés sur les répliques (`at("l07")` dans `src/timeline.ts`), donc ils suivent automatiquement.
Après tout changement de voix : `python3 scripts/retime.py && npm run audio && npm run render:all`.
Réglages des pauses : constantes `GAP`, `SCENE_BREAK`, `TAIL` en tête de `scripts/retime.py`.

## 6. Musique et effets sonores

`npm run audio` régénère la musique (`public/audio/music.mp3`) et les SFX (`public/audio/sfx/`).
Ils sont **synthétisés de zéro** par `scripts/generate_audio.py` (numpy) : aucune banque de sons, aucun droit tiers.
La musique est automatiquement baissée (« ducking ») sous la voix off.

## 7. Structure

```
src/
  ad.config.json        paramètres commerciaux (prix, CTA, contact, couverture)
  timeline.ts           découpage des scènes + SFX
  Ad.tsx                composition principale (scènes, audio, sous-titres)
  Root.tsx              compositions : Pub-Verticale-*, Pub-Carree-*, + chaque scène isolée
  layout.ts             zones de sécurité (TikTok / Reels / Shorts) et adaptation carré
  theme.ts              couleurs, polices
  components/           Book3D, Cover, Icons (SVG animés), KineticText, Captions, Bubble, CtaButton…
  scenes/               S1Hook … S8Cta
scripts/                génération voix off / musique / SFX
voiceover/              script de la voix off
public/                 polices, images, audio
```

## 8. Crédits et licences

- Polices : Montserrat, Inter, Caveat — SIL Open Font License 1.1 (usage commercial libre).
- Voix off : enregistrement fourni par l'auteur. (Le générateur Piper « siwis », CC-BY 4.0, reste disponible comme voix de secours
  et sert de référence pour l'alignement.)
- Musique et SFX : compositions originales générées par script pour ce projet.
- Remotion : gratuit pour les particuliers et les structures jusqu'à 3 personnes ; au-delà, une licence
  entreprise est requise (https://remotion.pro/license).
- « ChatGPT » est une marque d'OpenAI. Elle est citée uniquement pour décrire le sujet du livre ; aucun logo
  n'est utilisé et aucune affiliation n'est suggérée.
