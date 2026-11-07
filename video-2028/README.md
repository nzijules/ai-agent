# « ET SI C'ÉTAIT DANS DEUX ANS ? » — vidéo motion design (9:16)

Vidéo verticale de 89 s (1080 × 1920, 30 fps, H.264) sur la transformation du travail par l'IA, produite entièrement en code : **Remotion (React + TypeScript)** pour l'image, **Piper TTS** (local) pour la voix-off, **Python/NumPy/SciPy** pour la musique et le sound design, **FFmpeg** pour le traitement audio.

Storyboard détaillé et minuté : [`STORYBOARD.md`](./STORYBOARD.md).

## Livrables

| Fichier | Contenu |
|---|---|
| `out/et-si-cetait-dans-deux-ans_sous-titres.mp4` | Vidéo finale avec sous-titres animés incrustés |
| `out/et-si-cetait-dans-deux-ans.mp4` | Vidéo finale sans sous-titres incrustés |
| `out/et-si-cetait-dans-deux-ans.srt` | Sous-titres (import natif TikTok / YouTube / Instagram) |
| `public/audio/voiceover.wav` | Voix-off seule |
| `public/audio/music.wav`, `public/audio/sfx.wav` | Stems musique et effets |
| `public/audio/mix.wav` | Mix final (−14 LUFS intégré, −1 dBTP) intégré à la vidéo |
| `public/brand/logo-arosoft.png` | Logo détouré, sans légende, version pour fond sombre |

## Structure

```
scripts/script.json          Texte de la voix-off + minutage de chaque réplique
src/data/timeline.json       Découpage des scènes + repères (cues) partagés image/son
scripts/build_voiceover.py   Voix-off Piper → public/audio/voiceover.wav + src/data/captions.json
scripts/build_audio.py       Musique + SFX + mixage → public/audio/mix.wav
scripts/build_srt.py         captions.json → out/*.srt
scripts/build_logo.py        Détourage du logo (brand/logo-arosoft-source.jpg)
scripts/stills.mjs           Planche contact d'images clés pour contrôle visuel
src/Main.tsx                 Assemblage : scènes, transitions, logo, sous-titres, audio
src/scenes/S1…S10            Une scène par fichier
src/components/              Fond, transitions, sous-titres, personnages vectoriels
```

## Installation

```bash
npm install
pip install piper-tts numpy scipy pillow     # Python 3.10+
```

**Modèle de voix** (non versionné, 76 Mo) — voix « pierre », jeu de données UPMC, licence CC-BY-SA 4.0 :

```bash
mkdir -p tts-models && cd tts-models
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-upmc-medium.tar.bz2
tar xjf vits-piper-fr_FR-upmc-medium.tar.bz2 --strip-components=1 \
  vits-piper-fr_FR-upmc-medium/fr_FR-upmc-medium.onnx vits-piper-fr_FR-upmc-medium/fr_FR-upmc-medium.onnx.json
```

## Modifier et régénérer

1. **Texte ou minutage de la voix-off** → `scripts/script.json` (`text` = sous-titre affiché, `tts` = graphie envoyée au moteur, `start` = seconde de départ). Le script signale tout chevauchement.
2. **Durée ou découpage des scènes** → `src/data/timeline.json` (scènes + repères des animations/sons).
3. **Animations** → `src/scenes/*.tsx`. Aperçu interactif : `npm run dev` (Remotion Studio).
4. Régénérer :

```bash
python3 scripts/build_voiceover.py   # si le texte a changé (la synthèse varie légèrement à chaque passage)
python3 scripts/build_audio.py       # musique, SFX, mix
python3 scripts/build_srt.py
npx remotion render EtSiCetaitDansDeuxAns-SousTitres out/et-si-cetait-dans-deux-ans_sous-titres.mp4
npx remotion render EtSiCetaitDansDeuxAns out/et-si-cetait-dans-deux-ans.mp4
```

Pour utiliser un Chromium déjà installé plutôt que celui que télécharge Remotion : `export REMOTION_BROWSER=/chemin/vers/chrome-headless-shell`.

**Remplacer la voix par une voix de studio** (ElevenLabs ou comédien) : enregistrer chaque réplique, puis remplacer `public/audio/voiceover.wav` en conservant les `start` de `script.json` — ou adapter `synth()` dans `build_voiceover.py` pour lire des fichiers enregistrés. Le reste de la chaîne (sous-titres, ducking, mix) suit automatiquement.

## Droits

- **Voix** : modèle Piper `fr_FR-upmc-medium` (locuteur « pierre »), entraîné sur le corpus UPMC — CC-BY-SA 4.0. Créditer : *« Voix de synthèse : Piper, corpus UPMC (CC-BY-SA 4.0) »*.
- **Musique et effets sonores** : intégralement synthétisés par `scripts/build_audio.py`, aucun sample tiers.
- **Polices** : Space Grotesk, Inter, JetBrains Mono — SIL Open Font License.
- **Remotion** : gratuit pour les particuliers et les entreprises de 3 personnes maximum ; au-delà, une licence entreprise est requise (https://remotion.pro/license).
- Le gain « 4 heures → 4 minutes » est explicitement présenté à l'écran comme un exemple illustratif ; la vidéo ne contient aucune statistique.
