# DOSSIER FRAUDE N°002 — Le faux agent MTN Mobile Money

Motion design vertical de sensibilisation (1080 × 1920, 30 i/s, H.264), entièrement programmé avec **React + TypeScript + Remotion**, aux couleurs MTN : fond jaune #FFCB05, typographie noire, rouge réservé aux alertes.
Aucun dessin de personnage : la narration passe par le téléphone, les interfaces fictives, l'empreinte vocale de l'appelant, les preuves numériques et des lumières de ville en bokeh.

- Vidéo finale : `out/dossier-fraude-002.mp4` (1 min 55 s, voix-off synchronisée)
- Le logo MTN (fourni par le client) apparaît en miniature en haut à droite, sur toute la durée.
- Toutes les interfaces sont marquées « INTERFACE FICTIVE · SIMULATION ». Aucune procédure officielle MTN n'est inventée.

## Démarrage

```bash
npm install
npm run studio      # prévisualisation interactive (http://localhost:3000)
npm run sfx         # (re)génère les effets sonores procéduraux dans public/sfx
npm run render      # exporte out/dossier-fraude-002.mp4
```

Le Studio expose la composition complète `DossierFraude002` et une composition par scène (`Scene-1` … `Scene-9`) pour itérer vite.

## Structure

```
src/
  timeline.ts          ← découpage temporel + texte intégral de la voix-off (source unique)
  Main.tsx             ← assemblage : scènes, habillage, sous-titres, audio
  sfx.tsx              ← cues sonores synchronisés
  theme.ts / anim.ts   ← palette MTN Corporate & Cyber, helpers d'animation
  components/
    Backdrop.tsx       fond forensic (grille, poussière, vignette) + grain de film
    Hud.tsx            habillage : DOSSIER FRAUDE N°002, REC, timecode, logo MTN
    Captions.tsx       sous-titres mot à mot (compréhensible sans le son)
    Text.tsx           typographie cinétique, texte tapé, intertitres de pièces
    Phone.tsx          smartphone Android générique (vibration, allumage) + étiquette SIMULATION
    CallScreens.tsx    appel entrant, SMS de code avec masquage
    Stamp.tsx          tampon rouge, bandeau d'alerte
    Widgets.tsx        ondes vocales, compteur, compte à rebours, bouclier, particules
    Characters.tsx     bokeh urbain, empreinte vocale (aucune figure dessinée)
    Shell.tsx          transitions d'entrée/sortie par volets masqués
  scenes/S1…S9         les 9 séquences
scripts/
  generate-sfx.mjs     synthèse des effets sonores (aucun fichier tiers)
  stills.mjs           images fixes de contrôle : node scripts/stills.mjs <dossier> <frame>...
```

## Storyboard technique minuté

| # | Séquence | Début → fin | Animations clés |
|---|----------|-------------|-----------------|
| 1 | L'appel inattendu | 00:00 → 00:13 | « ABIDJAN · 19:02 » tapé, téléphone posé en 3D qui vibre par salves, écran qui s'allume, anneaux d'appel entrant, prise en main (bascule 3D), gros plan en communication + ondes vocales, « VOTRE ARGENT EST EN DANGER » avec secousse et pulsation rouge |
| 2 | La fausse confiance | 00:13 → 00:26 | Empreinte vocale circulaire de l'appelant, fragments « Service client / Sécurisation du compte / Intervention urgente », badge fictif qui se fragmente, « RIEN N'A ÉTÉ VÉRIFIÉ », carton DOSSIER FRAUDE N°002 |
| 3 | Pièce n°1 — L'identité | 00:26 → 00:38 | Dossier qui s'ouvre (rotation 3D), données tapées une à une avec leur source, loupe qui balaie les lignes, tampon « IDENTITÉ NON VÉRIFIÉE » |
| 4 | Pièce n°2 — La menace | 00:38 → 00:52 | Compteur 150 000 FCFA, particules rouges, compte à rebours circulaire « URGENCE », bascule vers un historique simulé sans anomalie, « UNE AFFIRMATION N'EST PAS UNE PREUVE » |
| 5 | Pièce n°3 — Le code | 00:52 → 01:06 | SMS fictif qui descend, chiffres qui apparaissent, bulle de la demande, poussée caméra sur l'écran, code masqué par une barre rouge, alerte « NE COMMUNIQUEZ JAMAIS CE CODE » |
| 6 | Reconstitution forensic | 01:06 → 01:19 | 3 nœuds (informations → opération → manipulation) reliés par des tracés SVG et des flux de particules, « CODE = CLÉ » (schéma pédagogique, non opérationnel) |
| 7 | Le verdict | 01:19 → 01:26 | Écran assombri, dossier qui se referme, tampon « VERDICT : ESCROQUERIE » avec onde de choc, sous-titre « USURPATION D'IDENTITÉ ET INGÉNIERIE SOCIALE » |
| 8 | Les trois réflexes | 01:26 → 01:41 | Règle 1 : code flouté + cadenas + partage bloqué. Règle 2 : raccrocher + liste de vérification animée. Règle 3 : demande de confirmation fictive, le doigt hésite puis refuse, « OPÉRATION BLOQUÉE » |
| 9 | Conclusion | 01:41 → 01:55 | Appel terminé, vérification par canal officiel, bouclier numérique tracé autour du téléphone, « FACE À LA FRAUDE, VÉRIFIEZ AVANT D'AGIR. », carton N°002 + « ABONNEZ-VOUS » |

## Voix-off

La voix-off (`public/voiceover.mp3`, ElevenLabs, 1 min 46 s) est intégrée et synchronisée mot à mot :
une transcription horodatée a fourni l'instant exact de chaque phrase (`cues` dans `src/timeline.ts`).

- Chaque scène joue son extrait `[voFrom, voTo]` de la voix-off. Cela laisse des respirations visuelles sans couper la narration : carton « DOSSIER FRAUDE N°002 », dossier qui se referme avant le verdict, carton final.
- Les sous-titres apparaissent exactement quand la phrase est prononcée.
- Les instants clés des animations (tampons, alertes, règles, compteur…) sont calés sur les mots correspondants : constantes en tête de chaque fichier `src/scenes/S*.tsx`.

Pour remplacer la voix : déposez le nouveau fichier sous `public/voiceover.mp3`, mettez à jour `cues`, `speechEnd`, `voFrom`, `voTo` et `seconds` dans `src/timeline.ts`, puis les instants clés des scènes.
Rendu sans voix : `--props='{"voiceover":"","voiceoverVolume":1,"sfx":true,"sfxVolume":0.8,"captions":true}'`.

## Modifier et réexporter

- **Textes / durées** : `src/timeline.ts`.
- **Couleurs** : `src/theme.ts` + fond dans `src/components/Backdrop.tsx` (jaune MTN `#FFCB05`, rouge réservé aux alertes).
- **Une scène** : `src/scenes/SX*.tsx`, puis `npm run studio` → `Scene-X`.
- **Sons** : `scripts/generate-sfx.mjs` (synthèse) et `src/sfx.tsx` (placement des cues).
- **Images photoréalistes** : déposez vos photos sous licence dans `public/` et utilisez `<Img src={staticFile("…")} />` de Remotion dans la scène voulue.
- **Contrôle visuel rapide** : `node scripts/stills.mjs out 120 900 2300` (frames globales).
