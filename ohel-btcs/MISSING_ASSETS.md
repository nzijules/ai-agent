# MISSING_ASSETS — OHEL BTCS

> Fichier généré par `npm run scan` à partir de `src/config/brand.ts`, `src/config/assets.ts` et `public/assets/`. Ne pas éditer à la main.

## 1. Bloquant pour la publication

- [ ] **Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large)** — `assets/brand/ohel-logo.svg` — bloque : ad15, ad30, ad60  
  _Le fichier fourni (221 × 131 px, fond blanc) est trop petit et non transparent._
- [x] **Photo réelle : équipe OHEL qui tamise la terre latérite sur chantier** — `assets/chantiers/preparation-terre.jpg` — bloque : ad30, ad60
- [x] **Vidéo ou photo réelle : élévation de murs BTCS sur un chantier OHEL** — `assets/chantiers/elevation-murs.mp4` — bloque : ad30, ad60
- [x] **Photo réelle : intérieur d’une réalisation OHEL** — `assets/realisations/interieur-realisation.jpg` — bloque : ad60
- [x] **Bâtiment OHEL terminé n° 1 (photo HD ou vidéo verticale)** — `assets/realisations/realisation-1.jpg` — bloque : ad30, ad60
- [x] **Bâtiment OHEL terminé n° 2 (photo HD ou vidéo verticale)** — `assets/realisations/realisation-2.jpg` — bloque : ad60
- [x] **Numéro WhatsApp officiel** — `brand.whatsapp` — bloque : ad15, ad30, ad60

## 2. Informations à fournir dans `brand.ts`

- [ ] Offre d’étude (gratuite / payante, délai) — `brand.offer` — _vide = non affichée_
- [ ] Services réellement proposés — `brand.services` — _vide = bandeau retiré_
- [ ] Code couleur exact du rouge OHEL — provisoire `#DB191D` prélevé sur le logo basse définition
- [ ] Dimensions des blocs — provisoire 29.5 × 14 × 9.5 cm
- [ ] Modèle de bloc (emboîtement ? alvéoles ?) + photo d’un bloc et de la presse OHEL (référence obligatoire pour l’animation)
- [ ] Entité qui détient le projet (licence Remotion, licence musique) — `brand.owner`
- [ ] Autorisation écrite d’utiliser les visages des employés et clients visibles dans les médias
- [ ] Validation des scripts voix off (`npm run storyboard` → `STORYBOARD.md`) et choix de la voix

## 3. Affirmations à valider

- [ ] `brand.claims.humidite` : « Soubassement protégé, enduit adapté, large débord de toiture : bien conçu, le BTCS résiste à la saison des pluies. »  
  _non validée → carte « Architecture contemporaine » à la place de « Résiste à la pluie »_
- [ ] `brand.claims.thermique` : « Des murs qui gardent la fraîcheur. »  
  _non validée → rendu final des versions qui l’utilisent refusé_
- [ ] « Un matériau local, plus respectueux de l’environnement » (scène 3, 60 s) — formulation à confirmer par OHEL

## 4. Médias et audio (non bloquants)

- [x] Villa contemporaine au crépuscule (illustration, format portrait de préférence) — `assets/illustrations/villa-hook.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [ ] Calque premier plan détouré de la villa (PNG transparent, optionnel, pour la parallaxe 2.5D) — `assets/illustrations/villa-hook-premier-plan.png` _(illustration : mention « non contractuelle » ajoutée automatiquement)_  
  _Optionnel : sans lui, la parallaxe se fait sur un seul plan._
- [x] Mains qui tamisent la terre latérite (illustration) — `assets/illustrations/terre-tamisee.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [x] Presse BTCS et bloc frais sorti du moule (illustration) — `assets/illustrations/presse-btcs.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [x] Pose des blocs, joints fins (illustration) — `assets/illustrations/pose-blocs.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [x] Salon contemporain avec mur BTCS apparent (illustration) — `assets/illustrations/interieur-fraicheur.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [x] Gros plan matière : terre latérite tamisée et pile de blocs BTCS (illustration) — `assets/illustrations/matiere-btcs.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [x] La même villa en construction, murs en blocs BTCS qui montent (illustration) — `assets/illustrations/villa-chantier.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [x] La même villa de nuit, fond du CTA (illustration) — `assets/illustrations/villa-nuit.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [x] Version « plan d’architecte » de la villa (dérivée de villa-hook, scène 4) — `assets/illustrations/villa-filaire.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [ ] Vidéo ou photo réelle : presse BTCS OHEL en action (optionnel, renforcerait la démonstration) — `assets/chantiers/presse-action.mp4`
- [ ] Plan authentique OHEL pour le fond du CTA 15 s (vidéo verticale de préférence) — `assets/chantiers/fond-cta-15s.mp4`  
  _Optionnel : à défaut, le 15 s utilise l’animation du bloc sur fond terre (prévu par le brief)._
- [x] Voix off 15 s validée — `assets/audio/vo-15.mp3`
- [x] Voix off 30 s validée — `assets/audio/vo-30.mp3`
- [ ] Voix off 60 s validée — `assets/audio/vo-60.mp3`
- [ ] Musique sous licence commerciale (publicité Meta + TikTok autorisée) — `assets/audio/musique.mp3`
- [ ] SFX compression du bloc — `assets/audio/sfx-compression.mp3`
- [ ] SFX pose d’un bloc — `assets/audio/sfx-pose.mp3`
- [ ] SFX transition — `assets/audio/sfx-transition.mp3`
- [ ] SFX apparition du CTA — `assets/audio/sfx-cta.mp3`

## 5. Placeholders restants par version

### 15 s — Hook

- Musique sous licence commerciale (publicité Meta + TikTok autorisée)
- SFX transition
- Calque premier plan détouré de la villa (PNG transparent, optionnel, pour la parallaxe 2.5D)
- SFX compression du bloc
- SFX pose d’un bloc
- Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large) **(bloquant)**
- SFX apparition du CTA

### 30 s — Meta Ads

- Musique sous licence commerciale (publicité Meta + TikTok autorisée)
- SFX transition
- Calque premier plan détouré de la villa (PNG transparent, optionnel, pour la parallaxe 2.5D)
- SFX compression du bloc
- SFX pose d’un bloc
- Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large) **(bloquant)**
- SFX apparition du CTA
- Affirmation non validée : `brand.claims.thermique`
- Affirmation non validée : `brand.claims.humidite`

### Version longue (V3 — « Vous avez le terrain »)

- Voix off 60 s validée
- Musique sous licence commerciale (publicité Meta + TikTok autorisée)
- SFX transition
- Calque premier plan détouré de la villa (PNG transparent, optionnel, pour la parallaxe 2.5D)
- SFX compression du bloc
- SFX pose d’un bloc
- Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large) **(bloquant)**
- SFX apparition du CTA
