# Publicité AroSoft — « Vibe Motion Design avec Claude Code »

Vidéo publicitaire verticale **1080 × 1920, 9:16, 30 i/s, ~58 s**, réalisée entièrement en code avec
**Remotion + React + TypeScript**, puis encodée en **MP4 H.264 / AAC**.

## Livrables (`livrables/`)

| Fichier | Contenu |
|---|---|
| `arosoft_pub_tiktok.mp4` | Vidéo finale (TikTok / Reels / Shorts) |
| `couverture_tiktok.png` | Image de couverture 1080 × 1920 |
| `sous-titres.srt` | Sous-titres français synchronisés |
| `voix-off.mp3` | Voix-off seule (brute, sans décalage) |
| `musique.mp3` | Musique de fond seule (brute, 58 s) |
| `stem_voix.wav`, `stem_musique.wav`, `stem_sfx.wav` | Pistes séparées, calées sur la vidéo (la musique inclut le ducking) |
| `sfx/` | Les 9 effets sonores individuels (WAV) |

Le **projet source modifiable** est ce dossier (`arosoft-pub/`).

## Ressources et droits

- **Voix-off** : générée avec ElevenLabs (modèle `eleven_v4`, voix « Tony – Punchy Ad & Social Voice »,
  français à léger accent africain), puis transcrite mot par mot (Scribe) → `src/data/words.json`.
- **Musique** : composition instrumentale originale générée avec ElevenLabs Music (vérifiée sans voix chantée).
  Vérifiez que votre offre ElevenLabs couvre l'usage publicitaire commercial.
- **Effets sonores** : synthétisés de A à Z par `scripts/make_sfx.py` (aucun échantillon tiers).
- **Polices** : Montserrat, Inter, Playfair Display (licence SIL OFL, via `@fontsource`).
- **Images** : les 3 visuels fournis (`assets-src/`), traités par `scripts/prepare_assets.py` :
  couverture redressée en perspective, symbole AS isolé (sans « AROSOFT » ni slogan), calque sujet Einstein
  pour la parallaxe. Le portrait d'Einstein est une photo de statue de cire : assurez-vous d'en détenir les droits.
- Le personnage, les icônes et toutes les interfaces sont des illustrations vectorielles originales.

## Installation

```bash
npm install
npm run dev            # Remotion Studio : prévisualisation et édition
```

Le rendu utilise un Chrome/Chromium local. Si Remotion ne peut pas télécharger le sien, indiquez-en un :
`export REMOTION_BROWSER=/chemin/vers/chrome-headless-shell`.

## Rendu

```bash
npx remotion render AroSoftPub out/arosoft_pub_tiktok.mp4 --codec=h264 --audio-codec=aac --crf=18
npx remotion still CouvertureTikTok out/couverture_tiktok.png
node scripts/export-srt.mjs                                   # out/sous-titres.srt
npx remotion render VoiceStem out/stem_voix.wav --codec=wav    # pistes séparées
npx remotion render MusicStem out/stem_musique.wav --codec=wav
npx remotion render SfxStem   out/stem_sfx.wav --codec=wav
```

## Modifier…

### Les textes et le prix
Tout est dans **`src/config.ts`** : objet `TEXTS` (titres de chaque scène) et constante `PRICE`
(`"10 000 F CFA"`, réutilisée scènes 7, 8 et couverture). Les mots surlignés en jaune se règlent via les props
`highlight` / `marker` des `<Headline>` dans chaque scène, et dans `KEYWORDS` de `src/captions.ts` pour les sous-titres.

### La voix-off
1. Remplacez `public/audio/voiceover.mp3`.
2. Mettez à jour `src/data/words.json` (horodatage mot par mot, format `{ "words": [{text,start,end}] }` —
   ElevenLabs Scribe, Whisper, etc.) et `VO_DURATION` dans `src/config.ts`.
3. Ajustez `SCENES_VO` (début de chaque scène, en secondes de voix-off) et les repères `at("sX", t)` dans
   les scènes : tous les temps sont exprimés en **secondes de voix-off**, la conversion en frames est automatique.
   Les sous-titres et le ducking se recalculent seuls.

### La musique
Remplacez `public/audio/music.mp3`. Volumes dans `src/components/SoundDesign.tsx` :
`MUSIC_BASE` (sans voix) et `MUSIC_DUCKED` (pendant la parole).

### Les effets sonores
Liste `SFX` dans `src/components/SoundDesign.tsx` (instant, fichier, volume). Pour régénérer / modifier
les sons : `python3 scripts/make_sfx.py`.

### Les scènes
Chaque scène est un composant indépendant dans `src/scenes/` :

| Scène | Fichier | Voix-off |
|---|---|---|
| 1 Hook Einstein | `S1Einstein.tsx` | « Albert Einstein a dit… » |
| 2 Promesse | `S2Promise.tsx` | « Dans ce guide pratique… » |
| 3 Briser la croyance | `S3Belief.tsx` | « Aujourd'hui, tu crois encore… Non ! » |
| 4 Le déclic | `S4Click.tsx` | « Il suffit d'être un peu curieux… » |
| 5 Demandez… | `S5Ask.tsx` | « Matthieu, chapitre sept… » |
| 6 Le guide | `S6Guide.tsx` | « Dans ce guide, je t'aide… » |
| 7 Prix | `S7Price.tsx` | « Télécharge ce guide… » |
| 8 Appel à l'action | `S8CTA.tsx` | « Clique sur le lien… » |

Composants partagés (`src/components/`) : fond animé, particules, livre 3D CSS (`Book3D`), personnage,
typographie cinétique (`Kinetic`), sous-titres, logo, icônes, sound design. Les transitions entre scènes
(zoom + flou + balayage lumineux) sont dans `src/Main.tsx`.

### Le logo
`src/components/Logo.tsx` : 74 px de large, marge 45 px en haut et à droite, visible tout le long.

## Zones de sécurité TikTok
Titres et éléments clés entre y ≈ 170 et 1300 px ; sous-titres à partir de y = 1330 px, avec 150 px de marge
à droite pour la colonne de boutons ; rien d'important dans les ~380 px du bas (légende / pseudo).
