#!/usr/bin/env bash
# Mixe la voix-off (clips par scène) + la musique de fond (baissée sous la voix)
# Usage : video/mix.sh <video_source.mp4> <sortie.mp4>   (lancer depuis video/)
set -euo pipefail
IN="$1"; OUT="$2"; DUR=62.3
ffmpeg -y -loglevel error -i "$IN" \
  -i audio/1-intro.mp3 -i audio/2-claude.mp3 -i audio/3-code.mp3 -i audio/4-design.mp3 -i audio/5-outro.mp3 -i audio/6-abonnement.mp3 \
  -i audio/musique.mp3 -filter_complex "\
[1]adelay=500|500[a1];[2]adelay=8900|8900[a2];[3]adelay=21700|21700[a3];[4]adelay=35700|35700[a4];[5]adelay=49200|49200[a5];[6]adelay=57000|57000[a6];\
[a1][a2][a3][a4][a5][a6]amix=inputs=6:normalize=0,aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=${DUR}[voice];\
[voice]asplit[v][key];\
[7]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${DUR},volume=0.16,afade=t=in:d=1.2,afade=t=out:st=$(echo "$DUR-2.5" | bc):d=2.5[m];\
[m][key]sidechaincompress=threshold=0.015:ratio=8:attack=25:release=600:makeup=1[md];\
[v][md]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t ${DUR} -movflags +faststart "$OUT"
