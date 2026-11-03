# Refonte artistique V2 : « MTN Corporate & Cyber »

**Projet :** La fraude à l'ère de l'IA. Motion design de sensibilisation, Direction Clientèle, MTN Côte d'Ivoire
**Format :** vertical 9:16, 1080 × 1920, 30 i/s, sans sous-titres. Voix-off ElevenLabs « Brian » (102,4 s), vidéo de 106,7 s.
**Livrable vidéo :** `out/mobile/MTN-CI_La-fraude-a-l-ere-de-l-IA_mobile-9x16_V2.mp4`. La V1 reste disponible pour comparaison (`…_mobile-9x16.mp4`).
**Code :** composition Remotion `FraudeIAMobileV2` (`src/mobile/v2/FraudeMobileV2.tsx`). Le minutage `src/mobile/timing.ts` est le même que pour la V1.

**Contrainte respectée :** scénario, ordre narratif, situations, personnages, messages clés et voix-off sont strictement identiques à la V1. Aucune séquence narrative n'est ajoutée : seuls le traitement graphique, les animations et les transitions changent.

---

## 1. Storyboard V2

Vignettes : `mobile/storyboard_v2/` (planche : `planche-V1-V2.jpg`, V1 en haut et V2 en bas de chaque paire).

| # | Temps | Voix-off | Phase | Proposition graphique V2 |
|---|---|---|---|---|
| 1 | 0,0–5,0 | « Et si la voix de votre responsable… n'était pas vraiment la sienne ? » | Menace | Fond **bleu nuit**. Smartphone, appel entrant « Mon responsable », pastille rouge URGENT (alerte). Le téléphone vibre. Sur « n'était pas », l'avatar bascule vers la silhouette encapuchonnée, l'anneau passe au rouge et la mention « ⚠ Identité non vérifiée » apparaît. Glitch bleu nuit. |
| 2 | 5,0–9,2 | « Avec l'IA, la fraude entre dans une nouvelle ère. » | Menace | **Transition objet :** le téléphone rapetisse jusqu'à un point lumineux, d'où jaillit un réseau neuronal en cercle croissant. Titre blanc « LA FRAUDE » et bandeau jaune MTN « ENTRE DANS UNE NOUVELLE ÈRE ». |
| 3 | 9,2–22,1 | Voix clonée, visage reproduit, pièce falsifiée, message professionnel | Démonstration | Quatre **fenêtres d'application crédibles** (barre de titre, mention « Démonstration », barre de progression) qui pivotent en 3D l'une après l'autre : *Clonage vocal* (source « Mon responsable », puis copie synthétique), *Synthèse faciale* (photo source du responsable, puis visage généré sous maillage), *Générateur de documents* (pièce qui se construit pixel par pixel), *Rédaction automatique* (courriel « Direction régionale – URGENT » qui s'écrit seul). |
| 4 | 22,1–23,6 | « Imaginez… » | Transition | Plan d'installation : plateau Customer Services, **travelling avant** sur le conseiller ; « IMAGINEZ… » discret en haut. |
| 5 | 23,6–39,2 | L'appel urgent, tout semble normal… un fraudeur | Menace | Écran partagé. En haut, l'appelant en bleu nuit : avatar du responsable, forme d'onde, bulle « Une opération exceptionnelle, tout de suite ! », pastilles blanches cochées en jaune (voix reconnaissable, ton convaincant, urgence réelle). En bas, le conseiller dans son environnement réel. À la révélation, l'avatar devient le fraudeur, les pastilles passent en **rouge « ? »** (anomalie) et le bandeau rouge « UN FRAUDEUR » apparaît. |
| 6 | 39,2–49,1 | Son objectif ? SIM, PIN Mobile Money, données client | Menace | Bleu nuit. Trois cartes blanches (liseré anthracite) qui basculent en 3D. Chaque opération est **ciblée par un réticule rouge** (anomalie). |
| 7 | 49,1–54,4 | Voir ne suffit plus. Entendre ne suffit plus. | Menace | Œil, puis oreille, en distorsion numérique ; les mots « VOIR » et « ENTENDRE » sont barrés en rouge. |
| 8 | 54,4–57,5 | Ce qui nous protège, c'est la rigueur de nos contrôles. | **Contrôles** | **Bascule vers le jaune MTN :** un bouclier jaune s'ouvre depuis le centre et recouvre la menace (volet circulaire). Bouclier anthracite et check-list jaune : « LA RIGUEUR DE NOS CONTRÔLES ». |
| 9 | 57,5–77,8 | Les 4 bons réflexes | Prévention | Fond blanc, bandeau jaune institutionnel, fil conducteur jaune vertical. Quatre cartes structurées : pastilles d'icône jaunes, badges de validation anthracite cochés en jaune (plus de vert), rouge uniquement sur l'alerte n° 4 et sur les pastilles barrées urgence / pression / autorité. |
| 10 | 77,8–83,1 | Une seule vérification négligée… compte compromis | Conséquence | Fond **anthracite** (plus de rouge plein écran). Check-list : la case « Validation » manquante clignote en rouge, une ligne rouge descend vers le compte client, qui se fissure en rouge. |
| 11 | 83,1–86,6 | La technologie évolue. Les fraudeurs innovent. | Menace | **Transformation d'objets :** le téléphone se métamorphose en puce IA, puis laisse place au fraudeur dont le masque holographique change de visage (responsable, conseiller, collègue). |
| 12 | 86,6–89,9 | Notre vigilance doit garder une longueur d'avance. | Conclusion | Volet jaune. **Course de deux jauges :** VIGILANCE (anthracite) passe devant FRAUDE. « UNE LONGUEUR D'AVANCE ». |
| 13 | 89,9–95,3 | Direction Clientèle… première ligne de défense | Conclusion | Jaune MTN. Bouclier hexagonal anthracite qui s'assemble autour de **l'équipe** : le conseiller et deux collègues, les personnages de la vidéo. Bandeau anthracite « LA PREMIÈRE LIGNE DE DÉFENSE ». |
| 14 | 95,3–100,9 | Face à la fraude augmentée par l'IA, ne faisons pas confiance aux apparences | Menace | Bleu nuit. Le fraudeur porte le masque du responsable ; sur « apparences », **le masque se brise** en quatre éclats qui tombent. |
| 15 | 100,9–102,8 | Faisons confiance aux contrôles. | Contrôles | Volet circulaire jaune. Check-list anthracite dont les 4 contrôles se cochent en jaune. « FAISONS CONFIANCE / AUX CONTRÔLES. » |
| 16 | 102,8–106,7 | (fin) | **Signature** | Jaune MTN : logo officiel au centre, en grand ; « LA FRAUDE À L'ÈRE DE L'IA » ; VÉRIFIER · RÉSISTER À L'URGENCE · SIGNALER ; Direction Clientèle, MTN Côte d'Ivoire. Fondu au noir. |

## 2. Palette et règles de cohérence visuelle

| Rôle | Couleur | Code utilisé | Règle |
|---|---|---|---|
| Couleur institutionnelle dominante | Jaune MTN | `#FFCB05` | Marque, contrôles, prévention, conclusion. Jamais sur un élément de fraude. |
| Profondeur, contraste | Noir anthracite | `#1E1F22` / `#2A2C31` | Textes sur jaune, cartes, interfaces de démonstration, conséquences. |
| Lisibilité | Blanc | `#FFFFFF` (fond clair `#F7F7F5`) | Textes sur fonds sombres, cartes de prévention. |
| Menace cyber **uniquement** | Bleu nuit | `#0B1B3F` → `#040A1A` ; tracés `#5B82F0` | Scènes 1–3, 5 (appelant), 6, 7, 11, 14. Réseau neuronal, maillage facial, copies synthétiques. |
| Alertes et anomalies **uniquement** | Rouge | `#E5332A` | URGENT, identité non vérifiée, pastilles « ? », réticules, ratures, case manquante, fissure, alerte n° 4, « UN FRAUDEUR ». Jamais en fond plein écran. |
| Neutre | Gris | `#9AA0AA` | Métadonnées d'interface. |

> **Charte officielle :** aucune référence colorimétrique officielle MTN n'a été fournie. `#FFCB05` est la valeur usuelle du jaune MTN ; elle doit être confirmée par la Communication MTN (référence Pantone ou RVB de la charte) et se corrige en un seul endroit (`V.yellow`). Même chose pour la police : la typographie de marque MTN n'étant pas disponible, Montserrat et Inter la remplacent provisoirement.

**Règles de cohérence :**
- **Personnages identiques** dans toute la vidéo : le responsable (lunettes, costume sombre, chemise blanche), le conseiller (polo jaune, micro-casque), deux collègues Customer Services (polo jaune ; tenue sombre et foulard), et le fraudeur encapuchonné, visage toujours dans l'ombre, liseré bleu nuit. Mêmes proportions et accessoires dans toutes les scènes. Le visage cloné est celui du responsable.
- **Environnement unique :** plateau Customer Services d'Abidjan (baie vitrée, Plateau, lagune), identique en plan large et en plan partagé.
- **Logo :** fichier officiel fourni uniquement, jamais régénéré. En haut à droite pendant toute la vidéo (blanc sur fond sombre, noir sur fond jaune ou clair, fondu au changement de fond), puis en grand au centre de la signature finale.
- **Interfaces :** toutes fictives et marquées « Démonstration » ou « Interface simulée » ; numéros et adresses masqués ; aucune donnée personnelle.
- **Lisibilité mobile :** titres de 56 à 170 px, une idée par écran, marges latérales de 50 à 70 px, contenu essentiel entre 200 et 1 650 px de hauteur, pour rester hors des zones d'interface des réseaux sociaux.

## 3. Animations et transitions

| Moment | Animation / transition | Intention |
|---|---|---|
| 1 | Vibration du téléphone ; avatar qui bascule ; glitch bleu nuit | Le doute s'installe |
| 1 → 2 | Le téléphone se réduit à un point d'où le réseau neuronal se déploie (masque circulaire) | La menace naît de l'appel |
| 3 | Fenêtres d'application qui pivotent en 3D ; barres de progression ; reconstruction pixel par pixel ; frappe automatique ; maillage de reconnaissance faciale | Démonstration crédible du clonage et de la falsification |
| 3 → 4 | Fondu enchaîné ; travelling avant sur le conseiller | Entrée dans la mise en situation |
| 5 | Pastilles cochées qui deviennent des « ? » rouges ; avatar révélé ; bandeau d'alerte en ressort | Renversement |
| 6 | Cartes en bascule 3D ; réticules rouges qui tournent et se resserrent | Ciblage des opérations sensibles |
| 7 | Distorsion RVB croissante ; ratures rouges | Nos sens sont trompés |
| 7 → 8 | **Volet bouclier jaune** depuis le centre | Les contrôles reprennent la main |
| 8 → 9 | Voile jaune ; cartes qui glissent latéralement ; fil conducteur qui se trace ; coches qui se dessinent | Prévention structurée et rassurante |
| 10 | Case manquante qui clignote ; ligne rouge qui descend ; fissure et secousse | Conséquence d'une seule négligence |
| 11 | Morphing téléphone → puce IA, puis masque qui change de visage | L'évolution technologique au service de la fraude |
| 12 | Volet circulaire jaune ; course de jauges | « Une longueur d'avance » |
| 13 | Bouclier hexagonal qui s'assemble autour de l'équipe | Protection collective |
| 14 | Masque holographique qui se brise en éclats | La fin des apparences |
| 15 | Volet jaune ; check-list qui se coche ligne par ligne | La confiance repose sur les contrôles |
| 16 | Logo officiel, consignes en ressort ; fondu au noir | Signature institutionnelle |

Toutes les animations restent indexées sur la voix-off (`at('segment', 'mot')`). La musique et les effets sonores de la V1 sont conservés : ils sont calés sur les mêmes repères.

## 4. Éléments réutilisés du montage actuel

| Élément | Origine | Utilisation V2 |
|---|---|---|
| Voix-off, minutage par segment et par mot | `src/mobile/timing.ts` | Inchangés |
| Personnages (responsable, conseiller, fraudeur) | `components/Person.tsx` | Inchangés ; ajout de deux collègues issus de la même bibliothèque |
| Décor plateau Abidjan | `components/Office.tsx` | Inchangé (plan large « Imaginez » + plan partagé) |
| Smartphone, formes d'onde, maillage facial, réseau neuronal | `UI.tsx`, `ia/AiFx.tsx` | Recolorés (blanc / bleu nuit) |
| Pictogrammes au trait | `components/Icons.tsx` | Inchangés ; coche paramétrable (anthracite / jaune) |
| Structure des 8 séquences, mise en page verticale, cartes réflexes, check-list, bouclier hexagonal, écran partagé | `mobile/FraudeMobile.tsx` | Conservés, réglages couleur et mouvement |
| Musique, effets sonores, mixage | `mobile/build_audio_mobile.py`, `mix_mobile.sh` | Inchangés |

## 5. Liste précise des modifications (V1 → V2)

Les scènes déjà satisfaisantes ne sont pas reconstruites : on ne change que la couleur, le traitement des interfaces et certaines transitions.

1. **Palette globale :** suppression du cyan « IA » au profit du blanc et du bleu nuit ; fonds de menace en bleu nuit au lieu de navy / cyan ; suppression des **fonds rouges plein écran** (scène 6 → bleu nuit, scène 10 → anthracite).
2. **Rouge limité aux alertes :** les textes « N'ÉTAIT PAS LA SIENNE ? », « NE SUFFIT PLUS » et « LES FRAUDEURS INNOVENT » passent en blanc ; le contour rouge des cartes « objectif » passe en anthracite ; le liseré du fraudeur passe en bleu nuit.
3. **Vert supprimé :** les coches de validation passent en jaune / anthracite (charte MTN).
4. **Scène 1 → 2 :** nouvelle transition objet (le téléphone se réduit et libère le réseau neuronal).
5. **Scène 3 :** les vignettes à bordure cyan deviennent des fenêtres d'application crédibles avec progression ; le visage cloné est celui du **responsable** (cohérence narrative).
6. **Scène 4 :** l'écran texte « IMAGINEZ… » devient un plan d'installation avec travelling sur le conseiller.
7. **Scène 8 :** le flash blanc devient un volet bouclier jaune MTN.
8. **Scène 9 :** fond blanc et bandeau jaune institutionnel, pastilles d'icône jaunes, fil conducteur.
9. **Scène 11 :** l'écran texte devient une transformation d'objets (téléphone → puce IA → masque changeant).
10. **Scène 12 :** ajout de la course des jauges vigilance / fraude (illustration du texte existant).
11. **Scène 13 :** le pictogramme client est remplacé par l'équipe du conseiller dans le bouclier.
12. **Scène 14 :** le masque du responsable se brise sur « apparences ».
13. **Scène 15 :** check-list qui se coche au lieu d'une simple coche isolée.
14. **Scène 16 :** signature institutionnelle avec le logo officiel centré ; le logo d'angle s'efface.

**Points à valider par la Communication MTN :** valeurs officielles du jaune et du noir, typographie de marque, logo en haute définition (fichier actuel : 318 × 159 px).
