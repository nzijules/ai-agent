# AroSoft — « Effacé du téléphone. Vraiment disparu ? »

Vidéo de sensibilisation au **Mobile Digital Forensics**, entièrement animée en code avec
[Remotion](https://www.remotion.dev) (React + TypeScript).

| Paramètre | Valeur |
|---|---|
| Format | Vertical 1080 × 1920 |
| Cadence | 30 i/s |
| Durée | 71 s (2130 images), calée sur la voix-off |
| Export | MP4 H.264 + AAC, et piste audio séparée en WAV |
| Langue | Français (voix-off + sous-titres animés) |

---

## 1. Installation

Prérequis : **Node.js ≥ 20.19** (ou 22.13+), npm, Git. Python 3 + Pillow + NumPy seulement pour régénérer le logo.

```bash
cd arosoft-forensics-video
npm install
```

Au premier rendu, Remotion télécharge automatiquement son navigateur headless.

## 2. Prévisualisation

```bash
npm run dev          # ouvre Remotion Studio sur http://localhost:3000
```

Compositions disponibles :

- **AroSoftForensics** : la vidéo complète.
- **Scenes/Scene1 … Scene5** : chaque scène isolée, pour itérer vite.
- **Outils/SubtitlesOnly** : sous-titres seuls (contrôle de la synchro).

## 3. Rendu

```bash
npm run render         # out/arosoft-forensics.mp4 (H.264 CRF 18 + AAC), puis out/arosoft-forensics-audio.wav (piste audio séparée)
npm run render:draft   # brouillon rapide en demi-résolution
npm run render:audio   # piste audio seule (WAV, rapide : aucune image n'est rendue)
npm run still          # image d'aperçu (logo final) → out/poster.png
```

Résolution, cadence et durée : `src/config/video.ts` (`VIDEO`).

## 4. Voix-off

La voix-off est intégrée : `public/audio/voiceover.mp3` (62,8 s), déclarée dans
`src/config/video.ts` (`AUDIO.voiceover`). La musique d'ambiance baisse automatiquement
pendant chaque réplique (`musicVolumeUnderVoice`).

**Synchronisation.** `src/data/script.ts` découpe le fichier en un bloc par scène
(`SCENES[x].voice = { from, to, at }`) : l'extrait `[from, to]` du fichier est posé à
`at` sur la timeline, ce qui laisse respirer les visuels entre deux scènes sans modifier
le débit de la voix. Les répliques (`RAW_LINES`) sont exprimées en temps du fichier audio,
issus de la transcription ; les sous-titres s'allument mot à mot grâce à
`src/data/voiceWords.ts`, et chaque scène déclenche ses animations sur `cue("<id>")`.

**Remplacer la voix par une nouvelle prise :**
1. Remplacez `public/audio/voiceover.mp3` (ou changez `AUDIO.voiceover`).
2. Transcrivez-la avec horodatage par mot (ElevenLabs Speech-to-Text, Whisper…) et
   mettez à jour `RAW_LINES` (début/fin de chaque phrase) et `voiceWords.ts`.
   Sans horodatage par mot, les sous-titres se rabattent sur une estimation du débit.
3. Ajustez `SCENES` : `voice.from` / `voice.to` = silences entre paragraphes dans le fichier,
   `voice.at` = position sur la timeline, `start` / `end` = bornes de scène.
   Mettez `VIDEO.durationInSeconds` à la fin de la dernière scène.
4. Contrôlez dans le Studio, puis `npm run render`.

Le texte et les minutages actuels sont dans `VOIX-OFF.md`.

## 5. Logo AroSoft

- Logo fourni : `public/brand/arosoft-logo.jpg` (fond blanc).
- Versions utilisées : `public/brand/arosoft-logo-dark.png` (signature finale) et
  `arosoft-logo-dark-cropped.png` (logo d'angle en haut à droite), générées par `npm run logo`
  (détourage du blanc, marine éclairci pour rester lisible sur le fond graphite).
- Si vous avez un PNG transparent officiel pour fond sombre, remplacez ce fichier ou
  changez `BRAND.logo` dans `src/config/video.ts` (`logoMode: "as-is"`).

- Logo d'angle : `BRAND.cornerLogo` / `BRAND.cornerLogoWidth` (mettre `null` pour le retirer).
  Il apparaît dès la 1re seconde et s'efface avant la signature finale.

## 6. Personnages

Les personnages (une citoyenne et un enquêteur forensic, tous deux africains) sont des
**illustrations vectorielles animées** dans `src/components/Person.tsx` : respiration,
clignement des yeux, regard, lumière des écrans.
Pour un rendu photoréaliste, déposez des bustes détourés (PNG transparent, ~900 × 1100)
dans `public/characters/` et renseignez `CHARACTERS.citizen` / `CHARACTERS.investigator`
dans `src/config/video.ts`. L'animation de respiration est conservée.

## 7. Architecture

```
src/
  config/video.ts        résolution, cadence, durée, audio, logo, personnages
  data/script.ts         script de narration + minutage (source unique de synchro)
  theme.ts, fonts.ts     palette (#090E18, #00C8FF, #65F0FF, orange d'alerte) et polices locales
  lib/anim.ts            helpers d'interpolation, easing, horloge de scène (useSceneClock)
  components/
    Background.tsx       fond graphite, grille en perspective, lumière volumétrique, grain
    Particles.tsx        poussière lumineuse en profondeur (parallaxe)
    SceneShell.tsx       transition « plongée caméra » entre scènes
    WordReveal.tsx       texte mot par mot (3D, flou, montée)
    Subtitles.tsx        sous-titres animés synchronisés au script
    Smartphone.tsx       smartphone générique (sans marque)
    Person.tsx           personnages animés (ou image de remplacement)
    PixelSwarm.tsx       pixels carrés (motif du logo) : désintégration, convergence
    HoloPanel.tsx        panneaux holographiques d'interface forensic
    Padlock.tsx, Icons.tsx, Logo.tsx
  scenes/
    Scene1Deletion.tsx       0–10 s   suppression, désintégration, SUPPRIMÉ ≠ DISPARU
    Scene2DataUniverse.tsx   10–22 s  sauvegarde, cloud, métadonnées, artefacts (anneau 3D)
    Scene3Investigator.tsx   22–38 s  cadre légal, acquérir / préserver / analyser
    Scene4Encryption.tsx     38–50 s  chiffrement, clé effacée, limites de récupération
    Scene5Protection.tsx     50–71 s  réflexes de protection, message clé, signature
  Video.tsx              assemblage : scènes, sous-titres, audio (musique + voix-off)
  Root.tsx               compositions (vidéo, scènes isolées, sous-titres)
```

Toutes les animations sont calculées à partir de la frame (`interpolate`, `spring`,
`Easing`) : pas de transitions CSS, donc un rendu déterministe image par image.

## 8. Exactitude du message

Le contenu a été écrit pour ne **jamais promettre une récupération systématique** :

- scène 2 : les traces sont présentées comme *possibles* (« Traces possibles, jamais garanties ») ;
- scène 3 : cadre légal (décision de justice, autorisation, consentement), isolement,
  empreinte SHA-256, chaîne de conservation, analyse sur une copie, original scellé ;
- scène 4 : le chiffrement, l'effacement des clés et l'absence de sauvegarde peuvent rendre
  les données **irrécupérables**.

Aucun logo ni interface de logiciel forensic tiers n'est utilisé. Les noms, horodatages et
empreintes affichés sont fictifs.

## 9. Licence Remotion

Remotion est gratuit pour les particuliers et les entreprises de 3 personnes maximum. Au-delà,
une licence entreprise est nécessaire : https://www.remotion.pro/license
