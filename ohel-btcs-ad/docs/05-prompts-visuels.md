# 5. Prompts des visuels manquants

**Règle :** pour tout ce qui montre OHEL (bloc, presse, cure, stock), une **photo ou vidéo réelle** passe avant la génération.
Chaque fiche donne donc d'abord un brief de prise de vue, puis un prompt de génération à n'utiliser qu'à défaut.
Toute image générée est déclarée `nature: "illustration"` dans `src/config/assets.ts` → la mention
« Illustration non contractuelle » s'affiche automatiquement. Ne jamais la présenter comme une réalisation ou une usine OHEL.

Les prompts sont en anglais (meilleurs résultats sur la plupart des générateurs). Format conseillé : **9:16, 1080 × 1920 minimum**,
sujet centré dans la moitié haute pour laisser la place aux textes et aux interfaces.

**Négatif commun** (à ajouter à tous les prompts) :
`fired clay bricks, red terracotta bricks, hollow concrete blocks, cinder blocks, stone, tiles, invented holes or interlocking grooves, rusty old manual press, messy workshop, heavy dust, sepia filter, text, logo, watermark, people's faces`

---

## P-01 — Bloc BTCS en gros plan (scène A)

**Prise de vue :** un bloc OHEL brut, sec, posé sur une surface anthracite mate. Objectif 50–90 mm, lumière rasante à 45° depuis la gauche
pour révéler le grain, fond sombre uni. Une vue de face, une vue 3/4. Montrer fidèlement les éventuels trous ou emboîtements, sans en ajouter.

**Génération (à défaut) :**
`Photorealistic studio macro of a single compressed stabilized earth block (CSEB), solid rectangular block with flat smooth faces and crisp edges, natural laterite ochre-orange color with fine sandy grain, matte surface, resting on a dark anthracite surface, raking warm side light from the left, deep dark background, shallow depth of field, 85mm lens, industrial premium product photography, vertical 9:16`

## P-02 — Presse hydraulique (scènes A et E)

**Prise de vue (prioritaire) :** vidéo 4K, 50 i/s si possible, machine propre, zone dégagée. Plans fixes sur trépied :
1) tiroir d'alimentation qui remplit le moule ; 2) descente du plateau et compression (plan serré, son direct) ;
3) démoulage / éjection du bloc ; 4) plan large de la machine. Chaque plan 8–10 s, sans opérateur dans le champ si possible.

**Génération (à défaut, illustration) :**
`Photorealistic modern hydraulic compressed earth block press machine in a clean organized industrial workshop, painted steel frame in dark anthracite grey with subtle ochre accents, hydraulic cylinder and chrome piston above a rectangular steel mold, freshly pressed ochre earth block being ejected from the mold, tidy concrete floor, soft natural daylight from high windows, sharp background, no dust cloud, no rust, vertical 9:16`

## P-03 — Macros des matières (scène C)

**Prise de vue :** trois photos zénithales, même lumière diffuse, matière étalée à plat sur toute l'image (pas de contenant visible) : latérite, sable, ciment.
Image carrée 2 000 px minimum, raccordable en mosaïque si possible.

**Génération (à défaut) :**
- Latérite : `Top-down macro photograph of loose laterite soil filling the entire frame, natural ochre to rust-orange color, small granules and lumps, even soft diffuse light, sharp focus edge to edge, seamless texture`
- Sable : `Top-down macro photograph of dry building sand filling the entire frame, light beige with fine mixed grains, even soft diffuse light, sharp focus, seamless texture`
- Ciment : `Top-down macro photograph of grey Portland cement powder filling the entire frame, fine smooth powder with subtle surface relief, even soft diffuse light, sharp focus, seamless texture`

## P-04 — Mélange homogène (scène D)

**Prise de vue :** vue de dessus de la cuve du malaxeur en fonctionnement, ou du mélange déposé avant pressage. Le mélange doit être
**humide mais non liquide** : il tient en motte quand on le serre dans la main.

**Génération (à défaut) :**
`Top-down photograph inside an industrial pan mixer, homogeneous moist earth mixture of laterite, sand and cement, uniform ochre-brown color, crumbly damp texture that holds shape, not liquid, no water puddles, steel mixing blades, clean even light, vertical 9:16`

## P-05 — Cure humide (scène F)

**Prise de vue :** blocs fraîchement démoulés, rangés sur aire de stockage, arrosage fin (pulvérisateur ou rampe) ; faces humides plus sombres
que les sèches. Ne pas montrer de pose en mur à ce stade.

**Génération (à défaut) :**
`Photorealistic rows of freshly made compressed stabilized earth blocks neatly stacked with small gaps on a clean concrete curing area, fine water mist being sprayed evenly over them, wet blocks slightly darker ochre than dry ones, organized industrial yard, soft morning light, sharp background, vertical 9:16`

## P-06 — École (scène G) — obligatoire

**Priorité :** photo d'une école réelle construite en BTCS (avec autorisation). Sinon :

`Photorealistic contemporary primary school building in Côte d'Ivoire built with exposed compressed stabilized earth blocks, solid rectangular ochre blocks laid in regular courses, white concrete slab edges, wide roof overhangs for shade, covered walkway, schoolyard with tropical trees, bright clear daylight, architectural photography, eye-level, sharp, no people's faces, vertical 9:16`

## P-07 — Autre bâtiment (scène G) — obligatoire

`Photorealistic contemporary two-storey public or office building in Abidjan built with exposed compressed stabilized earth block walls, solid rectangular ochre blocks in regular courses, white concrete frame and slabs, large windows with solar shading, tropical landscaping, clear late-afternoon light, architectural photography, sharp, vertical 9:16`

## P-08 — Blocs prêts à livrer (scène H)

**Prise de vue :** palettes de blocs OHEL bien alignées sur l'aire de stockage, éventuellement chariot en arrière-plan, ciel dégagé.

**Génération (à défaut) :**
`Photorealistic neatly stacked pallets of finished compressed stabilized earth blocks ready for delivery, perfectly aligned solid ochre blocks, clean industrial storage yard, soft golden-hour light, sharp background, premium industrial look, vertical 9:16`

---

Pour chaque visuel retenu : déposer le fichier dans `public/images/` (ou `public/video/`), puis renseigner
`src`, `type` et `nature` de l'emplacement correspondant dans `src/config/assets.ts`.
