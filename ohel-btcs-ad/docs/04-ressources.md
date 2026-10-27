# 4. Ressources : disponibles, manquantes, à valider

## Disponibles (fournies et intégrées)

| Fichier | Contenu | Usage | Statut |
|---|---|---|---|
| `public/images/logo-ohel.jpg` | Logo OHEL International (221 × 131 px, JPEG fond blanc) | Carton final | ⚠️ Trop petit pour un rendu net en 1080p. Voir « Manquantes ». |
| `public/images/photo-interieur-couloir-btcs.jpg` | Photo réelle : couloir, murs en BTCS (810 × 1080) | G, plein cadre 1 | Légendée « Photo · intérieur en BTCS ». **Non attribuée à OHEL** tant que ce n'est pas confirmé. |
| `public/images/photo-interieur-salle-btcs.jpg` | Photo réelle : salle à manger, murs en BTCS (1080 × 810) | G, plein cadre 2 | Idem. |
| `public/images/illustration-maison.jpg` | Rendu généré : maison contemporaine en blocs (1536 × 864) | G, bande « Maison » | Mention « Illustration non contractuelle » obligatoire (déjà en place). |
| `public/fonts/Archivo-*.woff2` | Police Archivo (SIL OFL), variable 100–900 | Toute la vidéo | Libre d'usage commercial. |

Remarque : les blocs des deux photos d'intérieur sont **finis (peints ou vernis)**. Ils servent de référence de forme et
d'appareillage (faces lisses, sans alvéoles ni emboîtements visibles), pas de couleur du bloc brut.

## Manquantes

Les éléments marqués « Obligatoire » bloquent le rendu en mode `final`. Les autres ont un repli graphique déjà animé,
identifié comme « Illustration schématique ».

| Réf. | Élément | Scène | Obligatoire | Source à privilégier | Repli actuel |
|---|---|---|---|---|---|
| — | **Voix off enregistrée** | Toutes | Oui | Comédien(ne) voix FR, texte `docs/02` | Synthèse provisoire Piper « siwis » (voix féminine, CC-BY 4.0) déjà calée ; à remplacer |
| — | **Musique instrumentale sous licence** | Toutes | Oui | Banque de sons (licence pub + réseaux sociaux) | Aucune |
| — | Effets sonores (impact, versements, mélange, hydraulique, pose, bruine) | A–H | Non | Banque de sons | Aucun |
| — | **Logo HD** : SVG/PDF vectoriel, ou PNG ≥ 1 500 px à fond transparent | H | Recommandé | OHEL | JPEG 221 px agrandi (flou) |
| P-01 | Photo macro d'un **bloc BTCS brut OHEL** | A | Non | Photo réelle chez OHEL | Bloc 3D texturé |
| P-02 | **Vidéo de la presse OHEL** (remplissage, compression, démoulage) | A, E | Non, mais fortement recommandé | Tournage réel chez OHEL | Schéma animé de presse |
| P-03 | Macros des matières : latérite, sable, ciment | C | Non | Photos réelles | Textures procédurales |
| P-04 | Mélange homogène vu de dessus | D | Non | Photo réelle | Cuve animée |
| P-05 | Blocs en cure humide, arrosage | F | Non | Photo réelle chez OHEL | Grille animée + gouttelettes |
| P-06 | **École** en BTCS | G | Oui | Photo d'un projet réel, sinon génération (P-06) | Cartouche « Visuel à fournir » |
| P-07 | **Autre bâtiment** en BTCS | G | Oui | Photo d'un projet réel, sinon génération (P-07) | Cartouche « Visuel à fournir » |
| P-08 | Palettes de blocs prêts à livrer | H | Non | Photo réelle chez OHEL | Pile animée sur palette |
| — | Dimensions réelles du bloc (L × l × h) et présence éventuelle d'alvéoles ou d'emboîtements | A, B, E, F, H | Non | OHEL | Parallélépipède lisse, face ≈ 2,1 : 1 |

## À valider par OHEL avant la version finale

1. **Prononciation d'« OHEL »** pour la voix off.
2. **Nom de domaine** : le brief indique `ohelintermondial.com` et `contact@ohelintermondial.com` alors que la marque est
   « OHEL **International** ». Je n'ai pas pu vérifier l'adresse (le réseau de cet environnement bloque le site). À confirmer lettre par lettre.
3. **WhatsApp** : le § 5-H prévoyait un numéro « fourni ultérieurement », mais le brief se termine par +225 0749238640.
   Il est intégré (`+225 07 49 23 86 40`) ; à confirmer. Un numéro vide bloque le rendu final.
4. **Photos d'intérieurs** : s'agit-il de blocs OHEL et/ou de réalisations OHEL ? Si oui, la légende peut devenir
   « Réalisation avec des BTCS OHEL » (`legende` dans `src/config/assets.ts`) ; sinon, elle reste neutre.
5. **Couleur du bloc brut** : la teinte ocre des schémas est une estimation, à recaler sur la photo P-01.
6. **Vidéo précédente** : non transmise. À visionner côte à côte avec cette maquette pour confirmer la différence d'identité.

## Où remplacer quoi

| Élément | Fichier | Champ |
|---|---|---|
| Images / vidéos | `src/config/assets.ts` | `MEDIA.<emplacement>.src` (+ `nature`, `legende`) |
| Textures matières | `src/config/assets.ts` | `TEXTURES` |
| Logo | `src/config/assets.ts` | `LOGO` |
| Voix off, musique, effets | `src/config/assets.ts` | `AUDIO` |
| Contacts, signature | `src/config/brand.ts` | `CONTACT`, `SIGNATURE` |
| Couleurs, police | `src/config/brand.ts` | `COLORS`, `FONT` |
| Texte voix off, sous-titres, minutage, textes à l'écran | `src/config/script.ts` | `SCENES`, `ECRAN` |
