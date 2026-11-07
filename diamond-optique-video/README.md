# Diamond Optique — Publicité recrutement « Vibe Motion Design » (35 s, 9:16)

Projet Remotion (React + TypeScript) de la publicité de recrutement des **3 promoteurs terrain** Diamond Optique.

| Livrable | Fichier |
|---|---|
| Vidéo avec voix-off | `out/diamond-optique-recrutement-1080x1920.mp4` |
| Vidéo sous-titrée | `out/diamond-optique-sous-titres.mp4` |
| Script de voix-off | ci-dessous et `src/config.ts` (`VOICE_OVER`) |
| Assets graphiques | `public/img`, `public/audio`, `public/fonts` |

**Format** : 1080 × 1920, 30 i/s, 35 s, H.264 (yuv420p, CRF 18), AAC 48 kHz.

---

## 1. Structure du projet

```
diamond-optique-video/
├── src/
│   ├── config.ts            ← TOUT ce qui est modifiable (dates, zones, montant, numéro, minutage)
│   ├── theme.ts             ← palette (bordeaux / or / marine / blanc) et polices
│   ├── Main.tsx             ← montage : scènes, transitions, musique, voix-off, effets sonores
│   ├── Root.tsx             ← compositions (version normale, version sous-titrée, une par scène)
│   ├── components/          ← animations réutilisables
│   │   ├── LogoBadge.tsx    ← logo officiel en haut à droite
│   │   ├── Kinetic.tsx      ← typographie cinétique (révélation par masque, mot par mot)
│   │   ├── FX.tsx           ← particules dorées, bokeh, formes 3D, balayage lumineux, grain, vignettage
│   │   ├── Phone.tsx        ← smartphone 3D
│   │   ├── Wipe.tsx         ← transitions par balayage diagonal
│   │   └── Subtitles.tsx    ← sous-titres synchronisés
│   └── scenes/              ← une composition par scène (Scene1Hook … Scene7Signature)
├── public/
│   ├── img/                 ← logo extrait de l'affiche, duo détouré, plans photoréalistes IA
│   ├── audio/vo/            ← voix-off (7 clips)
│   ├── audio/sfx/           ← whoosh, impact, notification, compteur, signature sonore
│   ├── audio/music.wav      ← musique afro-corporate instrumentale
│   └── fonts/               ← Anton + Montserrat (fichiers locaux)
└── scripts/extract_assets.py ← extraction du logo et détourage des personnages depuis l'affiche
```

## 2. Minutage

| Scène | Temps | Contenu |
|---|---|---|
| 1 · Hook | 00:00–00:04 | Travelling vers un jeune Abidjanais, « TU CHERCHES UNE OPPORTUNITÉ ? » mot par mot, plongée dans l'écran du téléphone |
| 2 · Recrutement | 00:04–00:09 | « DIAMOND OPTIQUE RECRUTE ! », compteur 01→02→03, « 3 PROMOTEURS TERRAIN (H/F) », bandeau mission, duo de l'affiche sur hexagone 3D |
| 3 · Zones | 00:09–00:15 | Carte stylisée d'Abidjan, caméra qui vole de zone en zone, épingles et cartes de zone |
| 4 · Rémunération | 00:15–00:21 | Smartphone 3D avec compteur de gains, « GAIN JUSQU'À 11 000 FCFA / JOUR », détail + mention « montant maximum » |
| 5 · Opportunité | 00:21–00:26 | Promotrice avec un client → révélation circulaire → équipe commerciale, « EMBAUCHE COMMERCIALE POSSIBLE » |
| 6 · Appel à l'action | 00:26–00:32 | Conversation stylisée, saisie « PRÊT + ZONE 1 », notification, numéro mis en lumière |
| 7 · Signature | 00:32–00:35 | Fond blanc, losange doré, logo officiel traversé par un halo doré, rappel du numéro |

Le logo est affiché **en haut à droite** dans toutes les scènes (sous la barre d'état des applis), puis en grand au centre pour la signature finale.

## 3. Script de voix-off

Voix : « Tony – Punchy Ad & Social Voice » (ElevenLabs, français, léger accent africain), modèle `eleven_v4`.

| # | Début | Texte |
|---|---|---|
| 1 | 0,20 s | Tu es dynamique, et tu cherches une opportunité pour gagner de l'argent ? |
| 2 | 4,15 s | Diamond Optique recrute trois promoteurs terrain, hommes ou femmes ! |
| 3 | 9,20 s | Trois zones sont concernées : Bassam, Marcory et Cocody, avec leurs secteurs associés. |
| 4 | 15,30 s | Une rémunération pouvant atteindre onze mille francs CFA par jour, selon tes résultats ! |
| 5 | 21,30 s | Et à la clé, une possibilité d'intégrer l'équipe commerciale ! |
| 6 | 26,20 s | Pour postuler, envoie simplement « prêt », suivi de ta zone, sur WhatsApp, au numéro affiché ! |
| 7 | 31,65 s | Diamond Optique. La vision à coup sûr. |

## 4. Modifier les informations

Tout se trouve dans **`src/config.ts`** :

- **Dates** : `mission: 'MISSION 5 JOURS — DU 10 AU 14 NOVEMBRE 2026'`
- **Zones** : tableau `zones` (titre + secteurs). Les étiquettes de la carte (BASSAM / MARCORY / COCODY) sont dans `src/scenes/Scene3Zones.tsx` (`ZONES`).
- **Montant** : `gainMax`, `detailGain`, `mentionGain`
- **Numéro WhatsApp** : `whatsapp` (affiché en scène 6 et en signature)
- **Message d'exemple** : `messageExemple`

Les textes affichés changent immédiatement. Si un changement touche **ce qui est dit** (par exemple le montant ou les zones), il faut aussi régénérer le clip de voix-off correspondant (`public/audio/vo/sN.wav`), puis mettre à jour sa durée (`dur`) et ses sous-titres (`text`) dans `VOICE_OVER`.

## 5. Commandes

```bash
npm install
npm run studio        # prévisualisation interactive
npm run typecheck
npm run render        # → out/diamond-optique-recrutement-1080x1920.mp4
npm run render:subs   # → out/diamond-optique-sous-titres.mp4
```

Si Remotion ne peut pas télécharger son navigateur (réseau restreint), indiquez un Chrome headless local :
`export REMOTION_BROWSER=/chemin/vers/chrome-headless-shell`

## 6. Origine des assets

- **Logo, duo homme/femme** : extraits de l'affiche officielle (`public/img/affiche-reference.jpg`) avec `scripts/extract_assets.py` ; le logo est détouré sans fond (`scripts/logo_transparent.py`, PNG transparent) et n'est pas redessiné. Dans la vidéo, il porte un fin liseré blanc pour rester lisible sur les fonds bordeaux et marine.
- **Plans photoréalistes** (rue d'Abidjan, promotrice avec un client, équipe en magasin) : générés avec ElevenLabs (Seedream 5 Pro). Les polos sont volontairement unis : une IA ne reproduit pas fidèlement un logo, la marque est donc portée par les éléments graphiques.
- **Voix-off, musique, effets sonores** : générés avec ElevenLabs (musique vérifiée sans paroles).
- **Polices** : Anton et Montserrat (SIL Open Font License), via Fontsource.

## 7. Contrôles de conformité

- Les informations de recrutement correspondent à l'affiche (3 promoteurs H/F, mission du 10 au 14 novembre 2026, zones, gains, numéro).
- Les 11 000 FCFA sont toujours présentés comme un **plafond** (« jusqu'à », « pouvant atteindre », « selon tes résultats », « montant maximum annoncé »). Le montant du transport n'est pas inventé (« pass transport »).
- L'embauche est présentée comme une **possibilité**, jamais comme une garantie.
- Aucun watermark ni logo tiers : le pseudo TikTok présent sur l'affiche a été évité, et la conversation utilise une interface stylisée sans le logo WhatsApp.
