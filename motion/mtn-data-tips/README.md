# MTN — Astuces data (motion design)

Vidéo verticale 1080×1920, 26 s, 30 fps, avec voix-off (`assets/voix-off.mp3`) et musique synthétisée à 120 BPM : `mtn-data-tips.mp4`.
Le logo MTN est en haut à droite pendant toute la vidéo (il a été retiré du bas des visuels).

- `index.html` : l'animation. Ouvre le fichier dans un navigateur pour la voir en boucle.
- `assets/` : visuels nettoyés, logo transparent, police Montserrat.
- `tools/prep.py` : retire le logo du bas des visuels et extrait le logo.
- `tools/beat.py` : génère la piste audio (`python3 tools/beat.py beat.wav`).
- `tools/capture.js` : rend la vidéo image par image (`node tools/capture.js mtn-data-tips.mp4 beat.wav`).
- `tools/mix.sh` : mixe la voix-off (décalée de 0,8 s pour tomber sur les changements de visuel) sur la musique, qui baisse automatiquement sous la voix :
  `node tools/capture.js video.mp4 && python3 tools/beat.py beat.wav && tools/mix.sh video.mp4 beat.wav assets/voix-off.mp3 mtn-data-tips.mp4`
