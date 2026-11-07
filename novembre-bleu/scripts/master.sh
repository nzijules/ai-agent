#!/usr/bin/env bash
# Mastering audio final (deux passes loudnorm) : -14 LUFS intégrés, crête vraie -1,5 dBTP
# (cible courante des plateformes sociales). La vidéo est copiée sans ré-encodage.
# Usage : bash scripts/master.sh out/film.mp4 out/film-master.mp4
set -euo pipefail
in="$1"; out="$2"
stats=$(ffmpeg -hide_banner -i "$in" -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$in" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 192k -movflags +faststart "$out"
echo "master: $out"
