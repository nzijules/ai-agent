# Script voix off — « 5 façons de forcer ta page de connexion »

Format : vertical 1080×1920 · 30 fps · ≈ 70 s · logo Arosoft en miniature en haut à droite.

| Temps | Scène | Voix off |
|---|---|---|
| 0:00 | Accroche | Développeur ou vibe codeur ? Ta page de connexion a été codée par une IA en 5 minutes ? Vérifie qu’un intrus ne peut pas l’ouvrir de ces 5 façons. |
| 0:04 | Intro | Ta page de connexion, c’est la porte d’entrée de ton appli. 5 failles, 5 parades. |
| 0:07 | Façon 1 · Force brute | Un : il insiste, encore et encore. Un robot teste des milliers de mots de passe pendant la nuit, et rien ne l’arrête. **La parade :** après 5 échecs, le compte se bloque 15 minutes. Le robot perd sa nuit. |
| 0:16 | Façon 2 · Messages d’erreur | Deux : il écoute ce que ta page répond. « Cet email n’existe pas » lui apprend qui a un compte chez toi, et qui n’en a pas. **La parade :** une seule phrase pour toutes les erreurs : « Email ou mot de passe incorrect. » Même chose sur la page « mot de passe oublié ». |
| 0:25 | Façon 3 · Contrôle navigateur | Trois : il contourne le contrôle. Si la vérification se fait seulement dans le navigateur, il tape l’adresse des pages réservées… et il entre. **La parade :** c’est le serveur qui vérifie qui tu es, à chaque demande. |
| 0:34 | Façon 4 · Base de données | Quatre : il vole ta base de données. Si les mots de passe sont écrits en clair, il les lit tous. Et comme beaucoup de gens utilisent le même partout, il ouvre aussi leurs emails et leurs réseaux sociaux. **La parade :** des mots de passe hachés, avec bcrypt ou Argon2. Un code que personne ne peut relire, même pas toi. |
| 0:43 | Façon 5 · Sessions | Cinq : il garde la porte ouverte. Une connexion sans date de fin reste valable pour toujours, même après la suppression du compte. **La parade :** chaque session expire au bout d’un moment, et elle est révoquée à la déconnexion ou à la suppression du compte. |
| 0:52 | Bonus · 2FA | Bonus : active la double authentification. Même s’il trouve ton mot de passe, l’intrus reste dehors. |
| 0:57 | Claude Code | Pas besoin d’être développeur pour corriger tout ça. Demande simplement à Claude Code : « Vérifie ma page de connexion sur ces 5 points et corrige ce qui manque. » |
| 1:05 | Outro | Abonne-toi, je te partage une astuce IA chaque jour. Et envoie cette vidéo à ton pote qui vibe code. |

## Légende suggérée

> Ta page de connexion a été codée par une IA ? 🔐 Vérifie ces 5 failles avant qu’un intrus ne le fasse. Sauvegarde la vidéo pour ton prochain projet 👇
> #vibecoding #cybersécurité #claudecode #IA #développeur
