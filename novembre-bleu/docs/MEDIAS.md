# Liste des médias

## Médias fournis et utilisés

| Fichier | Origine | Usage |
|---|---|---|
| `public/assets/audio/voix-off-novembre-bleu.mp3` | Fourni (« Novembre_bleu.mp3 », 74,95 s, mono 44,1 kHz) | Voix-off, découpée phrase par phrase (aucun mot coupé) |
| `public/assets/logos/arosoft-logo-source.jpg` | Fourni (logo AroSoft, 1254x1254, fond blanc) | Source des logos ci-dessous |
| `public/assets/logos/arosoft-logo-transparent.png` | Dérivé : recadrage sans slogan + fond retiré | Pour fonds clairs (non utilisé dans le film) |
| `public/assets/logos/arosoft-logo-reverse.png` | Dérivé : idem + lettres navy passées en blanc | **Logo en haut à droite du film** — à valider par la marque |

## Médias générés (provisoires, clairement identifiés)

| Fichier | Méthode | Statut |
|---|---|---|
| `public/assets/audio/musique-provisoire-piano-ambient.mp3` | `scripts/generate-music.py` (synthèse piano additive + nappe + réverbération, calée sur la timeline) | **PROVISOIRE** : remplacer par la musique originale du compositeur (même nom de fichier, ou modifier `MUSIC_FILE`) |
| `public/assets/audio/transitions-provisoires.mp3` | Même script (souffles filtrés aux coupes, scintillements S05/S13/S15) | **PROVISOIRE** |
| `public/assets/textures/grain-256.png` | Bruit gaussien | Texture de grain (définitive) |
| `public/assets/fonts/*.woff2` | Paquets `@fontsource/montserrat` et `@fontsource/inter` (licence SIL OFL) | Définitif |

## Médias à fournir (15 plans) : remplacent les placeholders

Déposer les fichiers dans `public/assets/images/` (photo) ou `public/assets/videos/` (vidéo), avec le nom
exact ci-dessous. Formats : JPG/PNG/WebP ou MP4/MOV/WebM. Recommandé : vidéo 4K ou photo ≥ 4000 px,
**cadrée pour le vertical ET l'horizontal** (sujet au centre, marges généreuses), sans texte incrusté.
Puis lancer `npm run media` (fait automatiquement par `studio` et `render:*`).

Personnage principal : homme ivoirien de 50 à 55 ans, tenue professionnelle sobre, **même acteur et même
garde-robe sur tous les plans**. Lieux crédibles à Abidjan. Aucune dramatisation excessive.

| Fichier | Scène | Plan à tourner / à sourcer |
|---|---|---|
| `s01` | Réveil à l'aube | Chambre, aube dorée sur Abidjan, l'homme se lève (travelling latéral lent) |
| `s02` | Petit déjeuner | Famille à table (épouse, deux enfants), lumière chaude ; idéalement 3 plans : tasse en plongée, montre au poignet, famille |
| `s03` | Au travail | Bureau au Plateau, téléphone, dossiers, collègues ; lumière bleutée |
| `s04` | Seul, pensif | Gros plan de profil près d'une fenêtre, heure bleue |
| `s07` | En bonne santé apparente | L'homme marche en ville, souriant, en forme (lumière de jour) |
| `s08` | Père et fils | L'homme avec son père âgé (≈75 ans) et son fils ; complicité |
| `s09` | Consultation | Médecin ivoirien(ne) et patient en dialogue, cabinet crédible (sans nom de clinique visible) |
| `s11` | Explication du médecin | Plan rapproché du médecin expliquant un résultat (arrière-plan flou) |
| `s13` | Couple | Couple sur une terrasse au lever du soleil |
| `s14` | Famille intergénérationnelle | Grands-parents, couple, enfants réunis, lumière dorée |

Les scènes S05 (ruban), S06 (schéma anatomique), S10 (PSA), S12 (détection précoce) et S15 (end card)
sont des **motion graphics définitifs** composés dans Remotion (aucun média externe requis).
Un prélèvement sanguin filmé peut être ajouté en `s10` si souhaité (il passera derrière l'animation).

À fournir également :
- **Logo institutionnel** (partenaire santé / ministère) en SVG ou PNG transparent → emplacement réservé sur l'end card (`src/components/EndCard.tsx`).
- **Logo AroSoft officiel en SVG** (idéalement une version négative officielle) pour remplacer la variante dérivée.
- **Musique originale** (piano + ambient cinématique), 90 s, calée sur `docs/TIMELINE.md`.
