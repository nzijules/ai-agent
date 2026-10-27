# MISSING_ASSETS — OHEL BTCS

> Fichier généré par `npm run scan` à partir de `src/config/brand.ts`, `src/config/assets.ts` et `public/assets/`. Ne pas éditer à la main.

## 1. Bloquant pour la publication

- [ ] **Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large)** — `assets/brand/ohel-logo.svg` — bloque : ad15, ad30, ad60  
  _Le fichier fourni (221 × 131 px, fond blanc) est trop petit et non transparent._
- [ ] **Vidéo ou photo réelle : presse BTCS OHEL en action** — `assets/chantiers/presse-action.mp4` — bloque : ad30, ad60
- [ ] **Vidéo ou photo réelle : élévation de murs BTCS sur un chantier OHEL** — `assets/chantiers/elevation-murs.mp4` — bloque : ad30, ad60
- [ ] **Photo ou vidéo réelle : détail des joints d’un mur BTCS OHEL** — `assets/chantiers/detail-joints.jpg` — bloque : ad60
- [ ] **Bâtiment OHEL terminé n° 1 (photo HD ou vidéo verticale)** — `assets/realisations/realisation-1.jpg` — bloque : ad30, ad60
- [ ] **Bâtiment OHEL terminé n° 2 (photo HD ou vidéo verticale)** — `assets/realisations/realisation-2.jpg` — bloque : ad60
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
- [ ] Villa BTCS contemporaine, rendu final de la scène 4 (illustration) — `assets/illustrations/villa-moderne.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [ ] Villa avec piscine, quartier résidentiel ivoirien (illustration) — `assets/illustrations/villa-piscine.jpg` _(illustration : mention « non contractuelle » ajoutée automatiquement)_
- [ ] Plan authentique OHEL pour le fond du CTA 15 s (vidéo verticale de préférence) — `assets/chantiers/fond-cta-15s.mp4`  
  _Optionnel : à défaut, le 15 s utilise l’animation du bloc sur fond terre (prévu par le brief)._
- [x] Voix off 15 s validée — `assets/audio/vo-15.mp3`
- [ ] Voix off 30 s validée — `assets/audio/vo-30.mp3`
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
- Plan authentique OHEL pour le fond du CTA 15 s (vidéo verticale de préférence)

### 30 s — Meta Ads

- Voix off 30 s validée
- Musique sous licence commerciale (publicité Meta + TikTok autorisée)
- SFX transition
- Calque premier plan détouré de la villa (PNG transparent, optionnel, pour la parallaxe 2.5D)
- SFX compression du bloc
- SFX pose d’un bloc
- Vidéo ou photo réelle : presse BTCS OHEL en action **(bloquant)**
- Vidéo ou photo réelle : élévation de murs BTCS sur un chantier OHEL **(bloquant)**
- Bâtiment OHEL terminé n° 1 (photo HD ou vidéo verticale) **(bloquant)**
- Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large) **(bloquant)**
- SFX apparition du CTA
- Affirmation non validée : `brand.claims.thermique`
- Affirmation non validée : `brand.claims.humidite`

### 60 s — Version longue

- Voix off 60 s validée
- Musique sous licence commerciale (publicité Meta + TikTok autorisée)
- SFX transition
- Calque premier plan détouré de la villa (PNG transparent, optionnel, pour la parallaxe 2.5D)
- SFX compression du bloc
- SFX pose d’un bloc
- Villa BTCS contemporaine, rendu final de la scène 4 (illustration)
- Vidéo ou photo réelle : presse BTCS OHEL en action **(bloquant)**
- Vidéo ou photo réelle : élévation de murs BTCS sur un chantier OHEL **(bloquant)**
- Photo ou vidéo réelle : détail des joints d’un mur BTCS OHEL **(bloquant)**
- Bâtiment OHEL terminé n° 1 (photo HD ou vidéo verticale) **(bloquant)**
- Bâtiment OHEL terminé n° 2 (photo HD ou vidéo verticale) **(bloquant)**
- Villa avec piscine, quartier résidentiel ivoirien (illustration)
- Logo officiel OHEL (SVG ou PNG transparent, ≥ 1200 px de large) **(bloquant)**
- SFX apparition du CTA
- Affirmation non validée : `brand.claims.thermique`
- Affirmation non validée : `brand.claims.humidite`
