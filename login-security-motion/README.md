# Motion design — Sécurité de la page de connexion (Arosoft)

Vidéo verticale (1080×1920, 30 fps, ≈ 1 min 42 s, avec voix off) réalisée avec [Remotion](https://www.remotion.dev).
Le script voix off complet est dans [`SCRIPT.md`](./SCRIPT.md).

## Structure

- `src/Video.tsx` : enchaînement des scènes et transitions, plus le logo affiché en permanence
- `src/scenes/` : une scène par fichier (accroche, intro, 5 failles, bonus 2FA, Claude Code, outro)
- `src/components/AttackLayout.tsx` : gabarit commun « danger → parade » des 5 failles (`FIX_AT` = moment de la parade)
- `src/theme.ts` : couleurs de la marque, polices, courbes d’animation
- `src/timing.ts` : durée de chaque scène, calée sur la voix off (`public/voiceover.mp3`)
- `public/arosoft-logo.png` : logo détouré (sans fond, sans slogan)

## Commandes

```bash
npm i
npx remotion studio                       # prévisualiser et éditer
npx remotion render LoginSecurity out/login-security.mp4
```

Les polices utilisées sont Inter et DejaVu Sans Mono, installées sur la machine.
Dans un environnement sans Chrome téléchargeable, ajoute `--browser-executable=<chemin vers chrome-headless-shell>`.
