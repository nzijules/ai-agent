# AroSoft — « Effacé du téléphone. Vraiment disparu ? »

Vidéo de sensibilisation au **Mobile Digital Forensics**, entièrement animée en code avec
[Remotion](https://www.remotion.dev) (React + TypeScript).

| Paramètre | Valeur |
|---|---|
| Format | Vertical 1080 × 1920 |
| Cadence | 30 i/s |
| Durée | 100 s (3000 images) |
| Export | MP4 H.264 + AAC, piste audio séparée (M4A, ou WAV via `render:audio`) |
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
npm run render         # out/arosoft-forensics.mp4 (H.264, CRF 18, AAC) + out/arosoft-forensics-audio.m4a (piste audio séparée)
npm run render:draft   # brouillon rapide en demi-résolution
npm run render:audio   # piste audio seule (WAV)
npm run still          # image d'aperçu (logo final) → out/poster.png
```

Résolution, cadence et durée : `src/config/video.ts` (`VIDEO`).

## 4. Remplacer la voix-off

La voix-off finale n'est pas encore livrée. La vidéo contient pour l'instant une **nappe
d'ambiance de remplacement** (`public/audio/ambient-placeholder.m4a`), avec les sous-titres
synchronisés sur le script prévu.

1. Déposez le fichier dans `public/audio/`, par ex. `public/audio/voiceover.wav`
   (WAV 48 kHz ou MP3 / M4A, commençant à t = 0 de la vidéo).
2. Dans `src/config/video.ts` :
   ```ts
   voiceover: "audio/voiceover.wav",
   ```
   La musique baisse alors automatiquement pendant chaque réplique (`musicVolumeUnderVoice`).
3. **Recalez le minutage** dans `src/data/script.ts` : ajustez `start` / `end` de chaque
   réplique (en secondes, sur la timeline globale) d'après la voix enregistrée.
   Les sous-titres **et** les animations des scènes suivent automatiquement : chaque scène
   déclenche ses animations sur `cue("<id de réplique>")`.
4. Si une scène doit s'allonger ou se raccourcir, modifiez ses bornes dans `SCENES`
   (même fichier) et, si besoin, `VIDEO.durationInSeconds`.
5. Contrôlez dans le Studio (composition *SubtitlesOnly* ou vidéo complète), puis relancez
   `npm run render`.

Pour remplacer la musique : déposez votre fichier dans `public/audio/` et renseignez
`AUDIO.music` (ou `null` pour la retirer).

> Astuce : pour obtenir les temps exacts, ouvrez la voix-off dans un éditeur audio
> (Audacity…) et notez le début et la fin de chaque phrase. Vous pouvez aussi la transcrire
> avec `@remotion/install-whisper-cpp` (horodatage par mot) et reporter les valeurs.

## 5. Logo AroSoft

- Logo fourni : `public/brand/arosoft-logo.jpg` (fond blanc).
- Version utilisée : `public/brand/arosoft-logo-dark.png`, générée par `npm run logo`
  (détourage du blanc, marine éclairci pour rester lisible sur le fond graphite).
- Si vous avez un PNG transparent officiel pour fond sombre, remplacez ce fichier ou
  changez `BRAND.logo` dans `src/config/video.ts` (`logoMode: "as-is"`).

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
    Scene1Deletion.tsx       0–12 s   suppression, désintégration, SUPPRIMÉ ≠ DISPARU
    Scene2DataUniverse.tsx   12–30 s  sauvegarde, cloud, métadonnées, artefacts (anneau 3D)
    Scene3Investigator.tsx   30–51 s  cadre légal, acquérir / préserver / analyser
    Scene4Encryption.tsx     51–69 s  chiffrement, clé effacée, limites de récupération
    Scene5Protection.tsx     69–100 s réflexes de protection, message clé, signature
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
