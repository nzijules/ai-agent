# MTN — Astuces data (motion design)

Vidéo verticale 1080×1920, 25 s, 30 fps, avec musique synthétisée à 120 BPM : `mtn-data-tips.mp4`.
Le logo MTN est en haut à droite pendant toute la vidéo (il a été retiré du bas des visuels).

- `index.html` : l'animation. Ouvre le fichier dans un navigateur pour la voir en boucle.
- `assets/` : visuels nettoyés, logo transparent, police Montserrat.
- `tools/prep.py` : retire le logo du bas des visuels et extrait le logo.
- `tools/beat.py` : génère la piste audio (`python3 tools/beat.py beat.wav`).
- `tools/capture.js` : rend la vidéo image par image (`node tools/capture.js mtn-data-tips.mp4 beat.wav`).
- Mixage pour haut-parleurs de téléphone (appliqué à la piste finale) :
  `ffmpeg -i video.mp4 -i beat.wav -map 0:v -map 1:a -c:v copy -af "highpass=f=80,bass=g=-4:f=120,equalizer=f=1500:t=q:w=1:g=4,treble=g=3:f=4000,loudnorm=I=-12:TP=-1:LRA=9" -c:a aac -b:a 192k -shortest mtn-data-tips.mp4`
